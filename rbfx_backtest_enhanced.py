"""
RetailBeastFX Premium - Enhanced Backtester v2.0
Fully replicates the Pine Script Alpha Edge strategies with proper killzone filtering.
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum

# ═══════════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════
@dataclass
class BacktestConfig:
    initial_balance: float = 1000.0
    risk_per_trade: float = 0.01  # 1% risk
    sl_atr_mult: float = 1.5
    tp_atr_mult: float = 4.5  # 3:1 R:R target
    
    # EMA Settings
    ema_fast: int = 8
    ema_slow: int = 21
    ema_trend: int = 200
    ema_trail: int = 5
    
    # BB Settings
    bb_period: int = 20
    bb_mult: float = 1.0
    
    # RSI Settings
    rsi_period: int = 14
    rsi_oversold: int = 30
    rsi_overbought: int = 70
    
    # ADX Settings
    adx_period: int = 14
    adx_threshold: int = 25
    
    # Strategy
    strategy: str = "All Signals"  # Trend Following, Mean Reversion, Swing Pullbacks, Breakout, All Signals, Original
    killzone_only: bool = True
    silver_bullet_boost: bool = True  # Prioritize 10-11 AM EST

class Strategy(Enum):
    TREND_FOLLOWING = "Trend Following"
    MEAN_REVERSION = "Mean Reversion"
    SWING_PULLBACKS = "Swing Pullbacks"
    BREAKOUT = "Breakout"
    ALL_SIGNALS = "All Signals"
    ORIGINAL = "Original"

# ═══════════════════════════════════════════════════════════════════════════════
# SYNTHETIC DATA GENERATOR
# ═══════════════════════════════════════════════════════════════════════════════
def generate_realistic_data(n_candles: int = 5000, start_price: float = 1.0850, seed: int = 42) -> pd.DataFrame:
    """Generate realistic OHLCV data with trending behavior and session patterns."""
    np.random.seed(seed)
    
    # Start from Monday 00:00 EST
    dates = pd.date_range(start='2026-01-05', periods=n_candles, freq='15min')
    
    # Generate returns with regime switching (trending/ranging)
    returns = np.zeros(n_candles)
    regime = 1  # 1 = trending up, -1 = trending down, 0 = ranging
    
    for i in range(1, n_candles):
        hour = dates[i].hour
        
        # Session-based volatility (EST timezone assumed)
        if 3 <= hour <= 6:  # London
            vol = 0.0005
        elif 8 <= hour <= 11:  # NY AM
            vol = 0.0006
        elif 10 <= hour <= 11:  # Silver Bullet - highest volatility
            vol = 0.0007
        elif 13 <= hour <= 16:  # NY PM
            vol = 0.0004
        else:  # Asian/Off hours
            vol = 0.0002
        
        # Regime switching
        if np.random.random() < 0.005:  # 0.5% chance to switch regime
            regime = np.random.choice([-1, 0, 1])
        
        # Generate return
        drift = regime * 0.00005  # Trend component
        noise = np.random.normal(0, vol)
        returns[i] = drift + noise
    
    # Build prices
    close = start_price * np.exp(np.cumsum(returns))
    
    # Generate OHLC
    volatility = np.abs(np.random.normal(0.0004, 0.0002, n_candles))
    
    # High/Low based on session
    session_mult = np.array([1.5 if 8 <= h <= 16 else 0.8 for h in dates.hour])
    volatility *= session_mult
    
    high = close + volatility
    low = close - volatility
    open_price = np.roll(close, 1)
    open_price[0] = start_price
    
    # Ensure OHLC consistency
    high = np.maximum(high, np.maximum(open_price, close))
    low = np.minimum(low, np.minimum(open_price, close))
    
    # Volume with session pattern
    base_volume = np.random.exponential(10000, n_candles)
    volume = base_volume * session_mult
    
    df = pd.DataFrame({
        'Open': open_price,
        'High': high,
        'Low': low,
        'Close': close,
        'Volume': volume
    }, index=dates)
    
    return df

# ═══════════════════════════════════════════════════════════════════════════════
# INDICATOR CALCULATIONS
# ═══════════════════════════════════════════════════════════════════════════════
def calculate_ema(series: pd.Series, period: int) -> pd.Series:
    return series.ewm(span=period, adjust=False).mean()

def calculate_sma(series: pd.Series, period: int) -> pd.Series:
    return series.rolling(window=period).mean()

def calculate_atr(df: pd.DataFrame, period: int = 14) -> pd.Series:
    tr1 = df['High'] - df['Low']
    tr2 = abs(df['High'] - df['Close'].shift())
    tr3 = abs(df['Low'] - df['Close'].shift())
    tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
    return tr.rolling(window=period).mean()

def calculate_rsi(series: pd.Series, period: int = 14) -> pd.Series:
    delta = series.diff()
    gain = delta.where(delta > 0, 0).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    rs = gain / (loss + 1e-10)
    return 100 - (100 / (1 + rs))

def calculate_adx(df: pd.DataFrame, period: int = 14) -> pd.Series:
    """Simplified ADX calculation."""
    high = df['High'].values
    low = df['Low'].values
    close = df['Close'].values
    
    n = len(close)
    adx = np.zeros(n)
    
    for i in range(period * 2, n):
        # Directional movement
        ups = sum(1 for j in range(i-period, i) if close[j] > close[j-1])
        dm = abs(ups - (period - ups)) / period
        
        # Range-based volatility
        avg_range = np.mean(high[i-period:i] - low[i-period:i])
        avg_close_range = np.mean(np.abs(np.diff(close[i-period:i])))
        
        if avg_range > 0:
            adx[i] = (dm * 50) + (avg_close_range / avg_range) * 25
    
    return pd.Series(adx, index=df.index)

def calculate_bollinger_bands(series: pd.Series, period: int = 20, mult: float = 1.0) -> Tuple[pd.Series, pd.Series, pd.Series]:
    sma = series.rolling(window=period).mean()
    std = series.rolling(window=period).std()
    upper = sma + mult * std
    lower = sma - mult * std
    return sma, upper, lower

# ═══════════════════════════════════════════════════════════════════════════════
# KILLZONE DETECTION
# ═══════════════════════════════════════════════════════════════════════════════
def get_session_info(timestamp: pd.Timestamp) -> Dict[str, bool]:
    """Get session information for a given timestamp (assumes EST)."""
    hour = timestamp.hour
    minute = timestamp.minute
    
    return {
        'london': 3 <= hour <= 6,
        'ny_am': 8 <= hour <= 11,
        'ny_pm': 13 <= hour <= 16,
        'silver_bullet': 10 <= hour <= 11,
        'power_hour': 9 <= hour <= 10,
        'asian': 19 <= hour <= 23 or 0 <= hour <= 2,
        'valid_session': 3 <= hour <= 16,  # Any major session
    }

# ═══════════════════════════════════════════════════════════════════════════════
# ORDER BLOCK DETECTION (Simplified)
# ═══════════════════════════════════════════════════════════════════════════════
def detect_order_blocks(df: pd.DataFrame, atr: pd.Series) -> Tuple[List[Dict], List[Dict]]:
    """Detect bullish and bearish order blocks."""
    bull_obs = []
    bear_obs = []
    
    for i in range(3, len(df) - 1):
        # Bullish OB: Bearish candle followed by strong bullish impulse
        if df['Close'].iloc[i-1] < df['Open'].iloc[i-1]:  # Previous bearish
            impulse = df['Close'].iloc[i] - df['Open'].iloc[i]
            if impulse > atr.iloc[i] * 1.5:  # Strong bullish move
                bull_obs.append({
                    'bar': i - 1,
                    'high': df['High'].iloc[i-1],
                    'low': df['Low'].iloc[i-1],
                    'mitigated': False
                })
        
        # Bearish OB: Bullish candle followed by strong bearish impulse
        if df['Close'].iloc[i-1] > df['Open'].iloc[i-1]:  # Previous bullish
            impulse = df['Open'].iloc[i] - df['Close'].iloc[i]
            if impulse > atr.iloc[i] * 1.5:  # Strong bearish move
                bear_obs.append({
                    'bar': i - 1,
                    'high': df['High'].iloc[i-1],
                    'low': df['Low'].iloc[i-1],
                    'mitigated': False
                })
    
    return bull_obs[-10:], bear_obs[-10:]  # Keep last 10


# ═══════════════════════════════════════════════════════════════════════════════
# FVG DETECTION
# ═══════════════════════════════════════════════════════════════════════════════
def detect_fvgs(df: pd.DataFrame, atr: pd.Series) -> Tuple[List[Dict], List[Dict]]:
    """Detect Fair Value Gaps."""
    bull_fvgs = []
    bear_fvgs = []
    
    for i in range(2, len(df)):
        min_gap = atr.iloc[i] * 0.1 if not pd.isna(atr.iloc[i]) else 0.0001
        
        # Bullish FVG: Current low > 2-bars-ago high
        if df['Low'].iloc[i] > df['High'].iloc[i-2]:
            gap_size = df['Low'].iloc[i] - df['High'].iloc[i-2]
            if gap_size >= min_gap:
                bull_fvgs.append({
                    'bar': i,
                    'top': df['Low'].iloc[i],
                    'bottom': df['High'].iloc[i-2],
                    'filled': False
                })
        
        # Bearish FVG: Current high < 2-bars-ago low
        if df['High'].iloc[i] < df['Low'].iloc[i-2]:
            gap_size = df['Low'].iloc[i-2] - df['High'].iloc[i]
            if gap_size >= min_gap:
                bear_fvgs.append({
                    'bar': i,
                    'top': df['Low'].iloc[i-2],
                    'bottom': df['High'].iloc[i],
                    'filled': False
                })
    
    return bull_fvgs[-5:], bear_fvgs[-5:]  # Keep last 5

# ═══════════════════════════════════════════════════════════════════════════════
# ALPHA EDGE SIGNAL GENERATION
# ═══════════════════════════════════════════════════════════════════════════════
def generate_signals(df: pd.DataFrame, config: BacktestConfig) -> pd.DataFrame:
    """Generate trading signals based on Alpha Edge strategies."""
    
    # Calculate indicators
    df['EMA_Fast'] = calculate_ema(df['Close'], config.ema_fast)
    df['EMA_Slow'] = calculate_ema(df['Close'], config.ema_slow)
    df['EMA_Trend'] = calculate_ema(df['Close'], config.ema_trend)
    df['EMA_Trail'] = calculate_ema(df['Close'], config.ema_trail)
    
    df['BB_Mid'], df['BB_Upper'], df['BB_Lower'] = calculate_bollinger_bands(
        df['Close'], config.bb_period, config.bb_mult
    )
    
    df['ATR'] = calculate_atr(df, 14)
    df['RSI'] = calculate_rsi(df['Close'], config.rsi_period)
    df['ADX'] = calculate_adx(df, config.adx_period)
    
    # Trend conditions
    df['BullTrend'] = df['EMA_Fast'] > df['EMA_Slow']
    df['BearTrend'] = df['EMA_Fast'] < df['EMA_Slow']
    df['AboveTrend'] = df['Close'] > df['EMA_Trend']
    df['BelowTrend'] = df['Close'] < df['EMA_Trend']
    
    # BB conditions
    df['TouchedLowerBB'] = df['Low'] <= df['BB_Lower']
    df['TouchedUpperBB'] = df['High'] >= df['BB_Upper']
    
    # BB Squeeze (for breakout)
    df['BB_Width'] = (df['BB_Upper'] - df['BB_Lower']) / df['BB_Mid']
    df['BB_Squeeze'] = df['BB_Width'] < df['BB_Width'].rolling(20).mean()
    
    # Candle type
    df['BullCandle'] = df['Close'] > df['Open']
    df['BearCandle'] = df['Close'] < df['Open']
    
    # RSI conditions
    df['RSI_Oversold'] = df['RSI'] < config.rsi_oversold
    df['RSI_Overbought'] = df['RSI'] > config.rsi_overbought
    
    # Pullback zone (between EMAs)
    df['PullbackZone'] = (df['Close'] < df['EMA_Fast']) & (df['Close'] > df['EMA_Slow'])
    
    # Volume analysis
    df['VolMA'] = df['Volume'].rolling(20).mean()
    df['HighVol'] = df['Volume'] > df['VolMA'] * 1.5
    
    # Session info
    df['InLondon'] = df.index.to_series().apply(lambda x: get_session_info(x)['london'])
    df['InNY'] = df.index.to_series().apply(lambda x: get_session_info(x)['ny_am'])
    df['InSilverBullet'] = df.index.to_series().apply(lambda x: get_session_info(x)['silver_bullet'])
    df['ValidSession'] = df.index.to_series().apply(lambda x: get_session_info(x)['valid_session'])
    
    # ═══════════════════════════════════════════════════════════════════════════
    # ALPHA EDGE STRATEGIES
    # ═══════════════════════════════════════════════════════════════════════════
    
    # 1. TREND FOLLOWING: Strong directional with momentum
    df['AlphaTrendBuy'] = (
        df['BullTrend'] & 
        df['AboveTrend'] & 
        df['BullCandle'] & 
        (df['RSI'] > 50) & 
        (df['RSI'] < 70)
    )
    df['AlphaTrendSell'] = (
        df['BearTrend'] & 
        df['BelowTrend'] & 
        df['BearCandle'] & 
        (df['RSI'] < 50) & 
        (df['RSI'] > 30)
    )
    
    # 2. MEAN REVERSION: RSI extreme + BB touch + recovery
    df['AlphaMeanRevBuy'] = (
        df['RSI_Oversold'] & 
        df['TouchedLowerBB'] & 
        df['BullCandle']
    )
    df['AlphaMeanRevSell'] = (
        df['RSI_Overbought'] & 
        df['TouchedUpperBB'] & 
        df['BearCandle']
    )
    
    # 3. SWING PULLBACKS: Trend + pullback + recovery
    df['AlphaPullbackBuy'] = (
        df['AboveTrend'] & 
        df['BullTrend'] & 
        df['PullbackZone'].shift(1) &  # Was in pullback
        (df['Close'] > df['EMA_Fast'])  # Now recovered
    )
    df['AlphaPullbackSell'] = (
        df['BelowTrend'] & 
        df['BearTrend'] & 
        (df['Close'].shift(1) > df['EMA_Fast'].shift(1)) &  # Was above fast EMA
        (df['Close'] < df['EMA_Fast'])  # Now below
    )
    
    # 4. BREAKOUT: BB Squeeze → Expansion
    df['AlphaBreakoutBuy'] = (
        df['BB_Squeeze'].shift(1) & 
        (df['Close'] > df['BB_Upper']) & 
        df['BullCandle']
    )
    df['AlphaBreakoutSell'] = (
        df['BB_Squeeze'].shift(1) & 
        (df['Close'] < df['BB_Lower']) & 
        df['BearCandle']
    )
    
    # ORIGINAL: BB-based signals
    df['OriginalBuy'] = (
        df['BullCandle'] & 
        df['TouchedLowerBB'] & 
        df['BullTrend']
    )
    df['OriginalSell'] = (
        df['BearCandle'] & 
        df['TouchedUpperBB'] & 
        df['BearTrend']
    )
    
    # ═══════════════════════════════════════════════════════════════════════════
    # STRATEGY SELECTION
    # ═══════════════════════════════════════════════════════════════════════════
    strategy = config.strategy
    
    if strategy == "Trend Following":
        df['RawBuySignal'] = df['AlphaTrendBuy']
        df['RawSellSignal'] = df['AlphaTrendSell']
    elif strategy == "Mean Reversion":
        df['RawBuySignal'] = df['AlphaMeanRevBuy']
        df['RawSellSignal'] = df['AlphaMeanRevSell']
    elif strategy == "Swing Pullbacks":
        df['RawBuySignal'] = df['AlphaPullbackBuy']
        df['RawSellSignal'] = df['AlphaPullbackSell']
    elif strategy == "Breakout":
        df['RawBuySignal'] = df['AlphaBreakoutBuy']
        df['RawSellSignal'] = df['AlphaBreakoutSell']
    elif strategy == "All Signals":
        df['RawBuySignal'] = (
            df['AlphaTrendBuy'] | 
            df['AlphaMeanRevBuy'] | 
            df['AlphaPullbackBuy'] | 
            df['AlphaBreakoutBuy']
        )
        df['RawSellSignal'] = (
            df['AlphaTrendSell'] | 
            df['AlphaMeanRevSell'] | 
            df['AlphaPullbackSell'] | 
            df['AlphaBreakoutSell']
        )
    else:  # Original
        df['RawBuySignal'] = df['OriginalBuy']
        df['RawSellSignal'] = df['OriginalSell']
    
    # Apply killzone filter
    if config.killzone_only:
        df['BuySignal'] = df['RawBuySignal'] & df['ValidSession']
        df['SellSignal'] = df['RawSellSignal'] & df['ValidSession']
    else:
        df['BuySignal'] = df['RawBuySignal']
        df['SellSignal'] = df['RawSellSignal']
    
    # Best setup detection (multi-confluence)
    df['BestBuySetup'] = (
        df['BuySignal'] & 
        df['TouchedLowerBB'] & 
        (df['InLondon'] | df['InNY']) & 
        df['HighVol']
    )
    df['BestSellSetup'] = (
        df['SellSignal'] & 
        df['TouchedUpperBB'] & 
        (df['InLondon'] | df['InNY']) & 
        df['HighVol']
    )
    
    # Silver Bullet bonus (higher confidence in 10-11 AM)
    df['SilverBulletBuy'] = df['BuySignal'] & df['InSilverBullet']
    df['SilverBulletSell'] = df['SellSignal'] & df['InSilverBullet']
    
    return df

# ═══════════════════════════════════════════════════════════════════════════════
# BACKTESTER
# ═══════════════════════════════════════════════════════════════════════════════
@dataclass
class Trade:
    entry_time: pd.Timestamp
    exit_time: Optional[pd.Timestamp]
    trade_type: str  # 'BUY' or 'SELL'
    entry_price: float
    sl_price: float
    tp_price: float
    exit_price: Optional[float]
    pnl: float
    r_multiple: float
    result: str  # 'WIN', 'LOSS', 'OPEN'
    setup_type: str  # 'normal', 'best', 'silver_bullet'


def run_backtest(df: pd.DataFrame, config: BacktestConfig) -> Tuple[List[Trade], float, List[float]]:
    """Run backtest with trade management."""
    balance = config.initial_balance
    trades: List[Trade] = []
    equity_curve = [balance]
    position: Optional[Dict] = None
    cooldown = 0
    
    for i in range(250, len(df)):
        row = df.iloc[i]
        
        if cooldown > 0:
            cooldown -= 1
            continue
        
        atr = row['ATR']
        if pd.isna(atr) or atr <= 0:
            continue
        
        # Check existing position
        if position is not None:
            if position['type'] == 'BUY':
                if row['Low'] <= position['sl']:
                    # Stop Loss Hit
                    pnl = -position['risk_amount']
                    balance += pnl
                    trades.append(Trade(
                        entry_time=position['entry_time'],
                        exit_time=row.name,
                        trade_type='BUY',
                        entry_price=position['entry'],
                        sl_price=position['sl'],
                        tp_price=position['tp'],
                        exit_price=position['sl'],
                        pnl=pnl,
                        r_multiple=-1.0,
                        result='LOSS',
                        setup_type=position['setup_type']
                    ))
                    position = None
                    cooldown = 5
                    equity_curve.append(balance)
                elif row['High'] >= position['tp']:
                    # Take Profit Hit
                    r_mult = config.tp_atr_mult / config.sl_atr_mult
                    pnl = position['risk_amount'] * r_mult
                    balance += pnl
                    trades.append(Trade(
                        entry_time=position['entry_time'],
                        exit_time=row.name,
                        trade_type='BUY',
                        entry_price=position['entry'],
                        sl_price=position['sl'],
                        tp_price=position['tp'],
                        exit_price=position['tp'],
                        pnl=pnl,
                        r_multiple=r_mult,
                        result='WIN',
                        setup_type=position['setup_type']
                    ))
                    position = None
                    cooldown = 5
                    equity_curve.append(balance)
            else:  # SELL
                if row['High'] >= position['sl']:
                    pnl = -position['risk_amount']
                    balance += pnl
                    trades.append(Trade(
                        entry_time=position['entry_time'],
                        exit_time=row.name,
                        trade_type='SELL',
                        entry_price=position['entry'],
                        sl_price=position['sl'],
                        tp_price=position['tp'],
                        exit_price=position['sl'],
                        pnl=pnl,
                        r_multiple=-1.0,
                        result='LOSS',
                        setup_type=position['setup_type']
                    ))
                    position = None
                    cooldown = 5
                    equity_curve.append(balance)
                elif row['Low'] <= position['tp']:
                    r_mult = config.tp_atr_mult / config.sl_atr_mult
                    pnl = position['risk_amount'] * r_mult
                    balance += pnl
                    trades.append(Trade(
                        entry_time=position['entry_time'],
                        exit_time=row.name,
                        trade_type='SELL',
                        entry_price=position['entry'],
                        sl_price=position['sl'],
                        tp_price=position['tp'],
                        exit_price=position['tp'],
                        pnl=pnl,
                        r_multiple=r_mult,
                        result='WIN',
                        setup_type=position['setup_type']
                    ))
                    position = None
                    cooldown = 5
                    equity_curve.append(balance)
            continue
        
        # Check for new signals
        risk_amount = balance * config.risk_per_trade
        
        # Determine setup type
        if row.get('SilverBulletBuy', False) or row.get('SilverBulletSell', False):
            setup_type = 'silver_bullet'
        elif row.get('BestBuySetup', False) or row.get('BestSellSetup', False):
            setup_type = 'best'
        else:
            setup_type = 'normal'
        
        if row['BuySignal']:
            entry = row['Close']
            sl = entry - (atr * config.sl_atr_mult)
            tp = entry + (atr * config.tp_atr_mult)
            position = {
                'type': 'BUY',
                'entry': entry,
                'sl': sl,
                'tp': tp,
                'entry_time': row.name,
                'risk_amount': risk_amount,
                'setup_type': setup_type
            }
        elif row['SellSignal']:
            entry = row['Close']
            sl = entry + (atr * config.sl_atr_mult)
            tp = entry - (atr * config.tp_atr_mult)
            position = {
                'type': 'SELL',
                'entry': entry,
                'sl': sl,
                'tp': tp,
                'entry_time': row.name,
                'risk_amount': risk_amount,
                'setup_type': setup_type
            }
    
    return trades, balance, equity_curve

# ═══════════════════════════════════════════════════════════════════════════════
# PERFORMANCE METRICS
# ═══════════════════════════════════════════════════════════════════════════════
def calculate_metrics(trades: List[Trade], initial_balance: float, final_balance: float, equity_curve: List[float]) -> Dict:
    """Calculate comprehensive performance metrics."""
    if len(trades) == 0:
        return {'error': 'No trades'}
    
    wins = [t for t in trades if t.result == 'WIN']
    losses = [t for t in trades if t.result == 'LOSS']
    
    total_trades = len(trades)
    win_rate = len(wins) / total_trades * 100
    total_r = sum(t.r_multiple for t in trades)
    avg_r = total_r / total_trades
    
    total_pnl = sum(t.pnl for t in trades)
    gross_profit = sum(t.pnl for t in wins) if wins else 0
    gross_loss = abs(sum(t.pnl for t in losses)) if losses else 0.01
    profit_factor = gross_profit / gross_loss if gross_loss > 0 else 0
    
    # Drawdown
    peak = equity_curve[0]
    max_dd = 0
    for eq in equity_curve:
        if eq > peak:
            peak = eq
        dd = (peak - eq) / peak * 100
        if dd > max_dd:
            max_dd = dd
    
    # Setup breakdown
    normal_trades = [t for t in trades if t.setup_type == 'normal']
    best_trades = [t for t in trades if t.setup_type == 'best']
    sb_trades = [t for t in trades if t.setup_type == 'silver_bullet']
    
    def setup_wr(trade_list):
        if not trade_list:
            return 0
        return len([t for t in trade_list if t.result == 'WIN']) / len(trade_list) * 100
    
    # Expectancy
    r_ratio = trades[0].r_multiple if trades and trades[0].result == 'WIN' else 3.0
    expectancy = (win_rate/100 * r_ratio) - ((100-win_rate)/100 * 1)
    min_wr_breakeven = 100 / (1 + r_ratio)
    
    return {
        'total_trades': total_trades,
        'wins': len(wins),
        'losses': len(losses),
        'win_rate': win_rate,
        'total_r': total_r,
        'avg_r': avg_r,
        'profit_factor': profit_factor,
        'total_pnl': total_pnl,
        'pnl_pct': (total_pnl / initial_balance) * 100,
        'max_drawdown': max_dd,
        'expectancy': expectancy,
        'min_wr_breakeven': min_wr_breakeven,
        'normal_trades': len(normal_trades),
        'normal_wr': setup_wr(normal_trades),
        'best_trades': len(best_trades),
        'best_wr': setup_wr(best_trades),
        'sb_trades': len(sb_trades),
        'sb_wr': setup_wr(sb_trades),
    }

# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════
def main():
    print("=" * 70)
    print("RetailBeastFX Premium - Enhanced Backtester v2.0")
    print("=" * 70)
    
    # Test all Alpha Edge strategies
    strategies = [
        "Original",
        "Trend Following",
        "Mean Reversion", 
        "Swing Pullbacks",
        "Breakout",
        "All Signals"
    ]
    
    print("\n📊 GENERATING SYNTHETIC DATA...")
    df = generate_realistic_data(5000, seed=42)
    print(f"   Generated {len(df)} candles")
    print(f"   Date range: {df.index[0]} to {df.index[-1]}")
    print(f"   Price range: {df['Low'].min():.4f} to {df['High'].max():.4f}")
    
    results = []
    
    print("\n" + "=" * 70)
    print("🎯 ALPHA EDGE STRATEGY COMPARISON")
    print("=" * 70)
    
    for strategy in strategies:
        config = BacktestConfig(
            strategy=strategy,
            killzone_only=True,
            sl_atr_mult=1.5,
            tp_atr_mult=4.5  # 3:1 R:R
        )
        
        df_signals = generate_signals(df.copy(), config)
        trades, final_balance, equity_curve = run_backtest(df_signals, config)
        
        if len(trades) == 0:
            print(f"\n❌ {strategy}: No trades generated")
            continue
        
        metrics = calculate_metrics(trades, config.initial_balance, final_balance, equity_curve)
        metrics['strategy'] = strategy
        results.append(metrics)
        
        print(f"\n📈 {strategy.upper()}")
        print(f"   Trades: {metrics['total_trades']:3} | Win Rate: {metrics['win_rate']:5.1f}%")
        print(f"   Total R: {metrics['total_r']:+6.1f}R | Avg R/Trade: {metrics['avg_r']:+5.2f}R")
        print(f"   P&L: ${metrics['total_pnl']:+7.2f} ({metrics['pnl_pct']:+5.1f}%)")
        print(f"   Profit Factor: {metrics['profit_factor']:.2f} | Max DD: {metrics['max_drawdown']:.1f}%")
        if metrics['sb_trades'] > 0:
            print(f"   🎯 Silver Bullet: {metrics['sb_trades']} trades @ {metrics['sb_wr']:.1f}% WR")
    
    # Best strategy
    if results:
        best = max(results, key=lambda x: x['profit_factor'])
        print("\n" + "=" * 70)
        print(f"🏆 BEST STRATEGY: {best['strategy']}")
        print("=" * 70)
        print(f"   Profit Factor: {best['profit_factor']:.2f}")
        print(f"   Win Rate: {best['win_rate']:.1f}%")
        print(f"   Total R: {best['total_r']:+.1f}R")
        print(f"   Expectancy: {best['expectancy']:+.2f}R per trade")
    
    # R:R sensitivity analysis for best strategy
    print("\n" + "=" * 70)
    print("📊 R:R SENSITIVITY ANALYSIS (Best Strategy)")
    print("=" * 70)
    
    if results:
        best_strat = best['strategy']
        
        rr_grid = [
            (1.0, 2.0),  # 2:1
            (1.0, 3.0),  # 3:1
            (1.5, 3.0),  # 2:1 wider SL
            (1.5, 4.5),  # 3:1 wider SL
            (2.0, 4.0),  # 2:1 very wide
            (2.0, 6.0),  # 3:1 very wide
        ]
        
        print(f"\n   {'SL Mult':>8} | {'TP Mult':>8} | {'R:R':>5} | {'Win Rate':>8} | {'Profit Factor':>13} | {'Total R':>8}")
        print("   " + "-" * 65)
        
        for sl_mult, tp_mult in rr_grid:
            config = BacktestConfig(
                strategy=best_strat,
                killzone_only=True,
                sl_atr_mult=sl_mult,
                tp_atr_mult=tp_mult
            )
            
            df_signals = generate_signals(df.copy(), config)
            trades, final_balance, equity_curve = run_backtest(df_signals, config)
            
            if trades:
                m = calculate_metrics(trades, config.initial_balance, final_balance, equity_curve)
                rr = tp_mult / sl_mult
                print(f"   {sl_mult:>8.1f} | {tp_mult:>8.1f} | {rr:>5.1f} | {m['win_rate']:>7.1f}% | {m['profit_factor']:>13.2f} | {m['total_r']:>+7.1f}R")
    
    print("\n" + "=" * 70)
    print("⚠️  DISCLAIMER: Synthetic data backtest")
    print("    Real market results will vary due to:")
    print("    - Actual market structure and liquidity")
    print("    - Spreads, slippage, and commissions")
    print("    - Psychological factors")
    print("=" * 70)


if __name__ == "__main__":
    main()
