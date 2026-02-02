"""
RetailBeastFX v9 Institutional Backtester
Replicates the Pine Script logic for offline testing
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import random

# ═══════════════════════════════════════════════════════════════════
# CONFIGURATION (matches Pine Script inputs)
# ═══════════════════════════════════════════════════════════════════
CONFIG = {
    # Institutional Mode
    'adx_period': 14,
    'adx_threshold': 25,
    'atr_trail_mult': 3.0,
    
    # EMAs
    'ema_fast': 8,
    'ema_slow': 21,
    'ema_50': 50,
    'ema_200': 200,
    
    # Bollinger Bands
    'bb_length': 20,
    'bb_mult': 1.0,
    
    # Risk Management
    'atr_length': 14,
    'atr_mult_sl': 2.0,
    'atr_mult_tp': 6.0,  # 3:1 R:R target
    
    # Session (EST hours)
    'london_start': 3,
    'london_end': 6,
    'ny_start': 8,
    'ny_end': 11,
    
    # Confluence minimums
    'min_confluence': 6,
    'apex_confluence': 8,
    
    # Signal cooldown
    'signal_cooldown': 5,
}

# ═══════════════════════════════════════════════════════════════════
# SYNTHETIC DATA GENERATOR
# ═══════════════════════════════════════════════════════════════════
def generate_market_data(bars=5000, base_price=2000.0, volatility=0.002):
    """Generate synthetic OHLCV data with realistic patterns"""
    np.random.seed(42)
    
    dates = pd.date_range(end=datetime.now(), periods=bars, freq='15min')
    
    # Generate price with trend changes
    returns = np.random.normal(0, volatility, bars)
    
    # Add trend periods
    trend = np.zeros(bars)
    for i in range(0, bars, 500):
        trend_dir = np.random.choice([-1, 1])
        trend_strength = np.random.uniform(0.0001, 0.0003)
        end = min(i + 500, bars)
        trend[i:end] = trend_dir * trend_strength
    
    returns += trend
    
    close = base_price * np.exp(np.cumsum(returns))
    
    # Generate OHLC from close
    high = close * (1 + np.abs(np.random.normal(0, volatility/2, bars)))
    low = close * (1 - np.abs(np.random.normal(0, volatility/2, bars)))
    open_price = np.roll(close, 1)
    open_price[0] = base_price
    
    # Volume with surges
    base_volume = np.random.uniform(1000, 5000, bars)
    volume_surges = np.random.choice([1, 1, 1, 2, 3, 5], bars)
    volume = base_volume * volume_surges
    
    df = pd.DataFrame({
        'datetime': dates,
        'open': open_price,
        'high': high,
        'low': low,
        'close': close,
        'volume': volume
    })
    
    return df

# ═══════════════════════════════════════════════════════════════════
# TECHNICAL INDICATORS
# ═══════════════════════════════════════════════════════════════════
def calculate_ema(series, period):
    return series.ewm(span=period, adjust=False).mean()

def calculate_sma(series, period):
    return series.rolling(window=period).mean()

def calculate_atr(df, period):
    high = df['high']
    low = df['low']
    close = df['close']
    
    tr1 = high - low
    tr2 = abs(high - close.shift(1))
    tr3 = abs(low - close.shift(1))
    tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
    
    return tr.rolling(window=period).mean()

def calculate_adx(df, period=14):
    """Calculate ADX indicator"""
    high = df['high']
    low = df['low']
    close = df['close']
    
    # +DM and -DM
    plus_dm = high.diff()
    minus_dm = -low.diff()
    
    plus_dm = np.where((plus_dm > minus_dm) & (plus_dm > 0), plus_dm, 0)
    minus_dm = np.where((minus_dm > plus_dm) & (minus_dm > 0), minus_dm, 0)
    
    # True Range
    tr1 = high - low
    tr2 = abs(high - close.shift(1))
    tr3 = abs(low - close.shift(1))
    tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
    
    # Smoothed
    atr = tr.rolling(window=period).mean()
    plus_di = 100 * pd.Series(plus_dm).rolling(window=period).mean() / atr
    minus_di = 100 * pd.Series(minus_dm).rolling(window=period).mean() / atr
    
    # DX and ADX
    dx = 100 * abs(plus_di - minus_di) / (plus_di + minus_di + 0.0001)
    adx = dx.rolling(window=period).mean()
    
    return adx

def calculate_bollinger_bands(df, period=20, mult=1.0):
    """Calculate Bollinger Bands"""
    close = df['close']
    basis = close.rolling(window=period).mean()
    std = close.rolling(window=period).std()
    upper = basis + mult * std
    lower = basis - mult * std
    return basis, upper, lower

def calculate_volume_zscore(df, period=20):
    """Calculate volume Z-score for Sentinel"""
    vol = df['volume']
    avg_vol = vol.rolling(window=period).mean()
    std_vol = vol.rolling(window=period).std()
    zscore = (vol - avg_vol) / (std_vol + 0.0001)
    return zscore

# ═══════════════════════════════════════════════════════════════════
# SESSION DETECTION
# ═══════════════════════════════════════════════════════════════════
def is_in_killzone(dt):
    """Check if time is in London or NY killzone (EST)"""
    hour = dt.hour
    
    # London: 3-6 EST
    if CONFIG['london_start'] <= hour < CONFIG['london_end']:
        return True, 'LONDON'
    
    # NY: 8-11 EST  
    if CONFIG['ny_start'] <= hour < CONFIG['ny_end']:
        return True, 'NY'
    
    return False, 'OFF'

def is_silver_bullet(dt):
    """Silver Bullet: 10-11 EST"""
    return 10 <= dt.hour < 11

def is_power_hour(dt):
    """Power Hour: 9:30-10:30 EST"""
    hour = dt.hour
    minute = dt.minute
    if hour == 9 and minute >= 30:
        return True
    if hour == 10 and minute < 30:
        return True
    return False

# ═══════════════════════════════════════════════════════════════════
# CONFLUENCE CALCULATOR
# ═══════════════════════════════════════════════════════════════════
def calculate_confluence(is_buy, row, indicators):
    """Calculate confluence score (0-10) matching v9 logic"""
    score = 0.0
    
    adx = indicators['adx']
    vol_zscore = indicators['vol_zscore']
    in_kz = indicators['in_killzone']
    in_sb = indicators['in_silver_bullet']
    in_ph = indicators['in_power_hour']
    
    # 1. ADX Strength (+3 max)
    if adx >= CONFIG['adx_threshold']:
        score += 1.5
    if adx >= 30:
        score += 1.0
    if adx >= 35:
        score += 0.5
    
    # 2. SMA Alignment (+2 max)
    if is_buy:
        if row['close'] > indicators['ema50'] and row['close'] > indicators['ema200']:
            score += 2.0
        elif row['close'] > indicators['ema200']:
            score += 1.0
    else:
        if row['close'] < indicators['ema50'] and row['close'] < indicators['ema200']:
            score += 2.0
        elif row['close'] < indicators['ema200']:
            score += 1.0
    
    # 3. EMA Trend Alignment (+1.5 max)
    if is_buy and indicators['ema8'] > indicators['ema21']:
        score += 1.5
    elif not is_buy and indicators['ema8'] < indicators['ema21']:
        score += 1.5
    
    # 4. Session Timing (+1.5 max)
    if in_sb or in_ph:
        score += 1.5
    elif in_kz:
        score += 1.0
    
    # 5. BB Touch (+1 max)
    if is_buy and row['low'] <= indicators['bb_lower']:
        score += 1.0
    elif not is_buy and row['high'] >= indicators['bb_upper']:
        score += 1.0
    
    # 6. Volume Sentinel (+3 max)
    if vol_zscore >= 2.0:
        score += 3.0
    elif vol_zscore >= 1.5:
        score += 2.0
    elif vol_zscore >= 1.0:
        score += 1.0
    
    return min(score, 10.0)

# ═══════════════════════════════════════════════════════════════════
# MAIN BACKTESTER
# ═══════════════════════════════════════════════════════════════════
def run_backtest(df):
    """Run the v9 institutional backtest"""
    
    print("=" * 60)
    print("  RETAILBEASTFX v9 INSTITUTIONAL BACKTEST")
    print("=" * 60)
    print(f"  Bars: {len(df)}")
    print(f"  Period: {df['datetime'].iloc[0]} to {df['datetime'].iloc[-1]}")
    print("=" * 60)
    
    # Calculate indicators
    df['ema8'] = calculate_ema(df['close'], CONFIG['ema_fast'])
    df['ema21'] = calculate_ema(df['close'], CONFIG['ema_slow'])
    df['ema50'] = calculate_ema(df['close'], CONFIG['ema_50'])
    df['ema200'] = calculate_ema(df['close'], CONFIG['ema_200'])
    df['atr'] = calculate_atr(df, CONFIG['atr_length'])
    df['adx'] = calculate_adx(df, CONFIG['adx_period'])
    df['bb_basis'], df['bb_upper'], df['bb_lower'] = calculate_bollinger_bands(
        df, CONFIG['bb_length'], CONFIG['bb_mult']
    )
    df['vol_zscore'] = calculate_volume_zscore(df, 20)
    
    # Track trades
    trades = []
    last_signal_bar = -100
    
    # Skip warmup period
    start_bar = CONFIG['ema_200'] + 10
    
    for i in range(start_bar, len(df)):
        row = df.iloc[i]
        prev_row = df.iloc[i-1]
        
        # Cooldown check
        if i - last_signal_bar < CONFIG['signal_cooldown']:
            continue
        
        # Session check
        in_kz, session = is_in_killzone(row['datetime'])
        in_sb = is_silver_bullet(row['datetime'])
        in_ph = is_power_hour(row['datetime'])
        
        # Must be in killzone (v9 institutional requirement)
        if not in_kz:
            continue
        
        # ADX Gate
        adx = row['adx']
        if pd.isna(adx) or adx < CONFIG['adx_threshold']:
            continue
        
        # Trend conditions
        bull_trend = row['ema8'] > row['ema21']
        bear_trend = row['ema8'] < row['ema21']
        above_200 = row['close'] > row['ema200']
        below_200 = row['close'] < row['ema200']
        
        # Candle type
        bull_candle = row['close'] > row['open']
        bear_candle = row['close'] < row['open']
        
        # Entry zones (BB touch simplified - no OB in this backtest)
        touched_lower_bb = row['low'] <= row['bb_lower']
        touched_upper_bb = row['high'] >= row['bb_upper']
        
        # Build indicators dict for confluence
        indicators = {
            'adx': adx,
            'ema8': row['ema8'],
            'ema21': row['ema21'],
            'ema50': row['ema50'],
            'ema200': row['ema200'],
            'bb_upper': row['bb_upper'],
            'bb_lower': row['bb_lower'],
            'vol_zscore': row['vol_zscore'],
            'in_killzone': in_kz,
            'in_silver_bullet': in_sb,
            'in_power_hour': in_ph,
        }
        
        # BUY Signal (v9 institutional)
        # Killzone + Above 200 + Bull Trend + Bull Candle + BB Touch
        buy_signal = (
            bull_candle and
            touched_lower_bb and
            bull_trend and
            above_200 and
            in_kz
        )
        
        # SELL Signal (v9 institutional - stricter)
        # Killzone + Below 200 + Bear Trend + Bear Candle + BB Touch
        sell_signal = (
            bear_candle and
            touched_upper_bb and
            bear_trend and
            below_200 and
            in_kz
        )
        
        if buy_signal or sell_signal:
            is_buy = buy_signal
            confluence = calculate_confluence(is_buy, row, indicators)
            
            # Minimum confluence filter
            if confluence < CONFIG['min_confluence']:
                continue
            
            is_apex = confluence >= CONFIG['apex_confluence'] and row['vol_zscore'] >= 2.0
            
            # Calculate SL/TP
            atr = row['atr']
            entry_price = row['close']
            
            if is_buy:
                sl = entry_price - (atr * CONFIG['atr_mult_sl'])
                tp = entry_price + (atr * CONFIG['atr_mult_tp'])
            else:
                sl = entry_price + (atr * CONFIG['atr_mult_sl'])
                tp = entry_price - (atr * CONFIG['atr_mult_tp'])
            
            # Simulate trade outcome (look ahead)
            result = simulate_trade(df, i, is_buy, entry_price, sl, tp)
            
            trade = {
                'bar': i,
                'datetime': row['datetime'],
                'direction': 'BUY' if is_buy else 'SELL',
                'entry': entry_price,
                'sl': sl,
                'tp': tp,
                'confluence': confluence,
                'is_apex': is_apex,
                'adx': adx,
                'session': session,
                'vol_zscore': row['vol_zscore'],
                'result': result['outcome'],
                'pnl_r': result['pnl_r'],
                'exit_bar': result['exit_bar'],
            }
            
            trades.append(trade)
            last_signal_bar = i
    
    return analyze_results(trades)

def simulate_trade(df, entry_bar, is_buy, entry, sl, tp):
    """Simulate trade outcome by looking ahead"""
    max_bars = 100  # Max hold time
    
    for i in range(entry_bar + 1, min(entry_bar + max_bars, len(df))):
        row = df.iloc[i]
        
        if is_buy:
            # Check SL first (worst case)
            if row['low'] <= sl:
                return {'outcome': 'LOSS', 'pnl_r': -1.0, 'exit_bar': i}
            # Check TP
            if row['high'] >= tp:
                return {'outcome': 'WIN', 'pnl_r': CONFIG['atr_mult_tp'] / CONFIG['atr_mult_sl'], 'exit_bar': i}
        else:
            # Check SL first
            if row['high'] >= sl:
                return {'outcome': 'LOSS', 'pnl_r': -1.0, 'exit_bar': i}
            # Check TP
            if row['low'] <= tp:
                return {'outcome': 'WIN', 'pnl_r': CONFIG['atr_mult_tp'] / CONFIG['atr_mult_sl'], 'exit_bar': i}
    
    # Timeout - close at current price
    final_price = df.iloc[min(entry_bar + max_bars - 1, len(df) - 1)]['close']
    if is_buy:
        pnl = (final_price - entry) / (entry - sl)
    else:
        pnl = (entry - final_price) / (sl - entry)
    
    return {'outcome': 'TIMEOUT', 'pnl_r': pnl, 'exit_bar': entry_bar + max_bars}

def analyze_results(trades):
    """Analyze backtest results"""
    if not trades:
        print("\n❌ No trades generated!")
        return None
    
    df_trades = pd.DataFrame(trades)
    
    total = len(trades)
    wins = len(df_trades[df_trades['result'] == 'WIN'])
    losses = len(df_trades[df_trades['result'] == 'LOSS'])
    timeouts = len(df_trades[df_trades['result'] == 'TIMEOUT'])
    
    win_rate = wins / total * 100 if total > 0 else 0
    
    total_r = df_trades['pnl_r'].sum()
    
    gross_profit = df_trades[df_trades['pnl_r'] > 0]['pnl_r'].sum()
    gross_loss = abs(df_trades[df_trades['pnl_r'] < 0]['pnl_r'].sum())
    profit_factor = gross_profit / gross_loss if gross_loss > 0 else float('inf')
    
    # APEX stats
    apex_trades = df_trades[df_trades['is_apex'] == True]
    apex_wins = len(apex_trades[apex_trades['result'] == 'WIN'])
    apex_total = len(apex_trades)
    apex_wr = apex_wins / apex_total * 100 if apex_total > 0 else 0
    
    # By direction
    buys = df_trades[df_trades['direction'] == 'BUY']
    sells = df_trades[df_trades['direction'] == 'SELL']
    buy_wr = len(buys[buys['result'] == 'WIN']) / len(buys) * 100 if len(buys) > 0 else 0
    sell_wr = len(sells[sells['result'] == 'WIN']) / len(sells) * 100 if len(sells) > 0 else 0
    
    # By session
    london = df_trades[df_trades['session'] == 'LONDON']
    ny = df_trades[df_trades['session'] == 'NY']
    london_wr = len(london[london['result'] == 'WIN']) / len(london) * 100 if len(london) > 0 else 0
    ny_wr = len(ny[ny['result'] == 'WIN']) / len(ny) * 100 if len(ny) > 0 else 0
    
    print("\n" + "=" * 60)
    print("  📊 BACKTEST RESULTS - RBFX v9 INSTITUTIONAL")
    print("=" * 60)
    
    print(f"\n  OVERALL PERFORMANCE")
    print(f"  {'─' * 40}")
    print(f"  Total Trades:     {total}")
    print(f"  Wins:             {wins}")
    print(f"  Losses:           {losses}")
    print(f"  Timeouts:         {timeouts}")
    print(f"  Win Rate:         {win_rate:.1f}%")
    print(f"  Profit Factor:    {profit_factor:.2f}")
    print(f"  Total R:          {total_r:+.1f}R")
    
    print(f"\n  🔥 APEX BEAST SIGNALS")
    print(f"  {'─' * 40}")
    print(f"  APEX Trades:      {apex_total}")
    print(f"  APEX Win Rate:    {apex_wr:.1f}%")
    
    print(f"\n  BY DIRECTION")
    print(f"  {'─' * 40}")
    print(f"  BUY Trades:       {len(buys)} ({buy_wr:.1f}% WR)")
    print(f"  SELL Trades:      {len(sells)} ({sell_wr:.1f}% WR)")
    
    print(f"\n  BY SESSION")
    print(f"  {'─' * 40}")
    print(f"  London:           {len(london)} trades ({london_wr:.1f}% WR)")
    print(f"  NY:               {len(ny)} trades ({ny_wr:.1f}% WR)")
    
    print(f"\n  CONFLUENCE ANALYSIS")
    print(f"  {'─' * 40}")
    for conf_level in [6, 7, 8, 9]:
        subset = df_trades[df_trades['confluence'] >= conf_level]
        if len(subset) > 0:
            wr = len(subset[subset['result'] == 'WIN']) / len(subset) * 100
            print(f"  Confluence ≥{conf_level}:   {len(subset)} trades ({wr:.1f}% WR)")
    
    print("\n" + "=" * 60)
    
    # Save results
    df_trades.to_csv('c:/Users/Owner/Desktop/MyTradingApps/v9_backtest_results.csv', index=False)
    print(f"\n  📁 Results saved to v9_backtest_results.csv")
    
    return {
        'total': total,
        'win_rate': win_rate,
        'profit_factor': profit_factor,
        'total_r': total_r,
        'apex_wr': apex_wr,
    }

# ═══════════════════════════════════════════════════════════════════
# RUN BACKTEST
# ═══════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    print("\n🦁 Generating synthetic market data...")
    df = generate_market_data(bars=10000, base_price=2000.0, volatility=0.002)
    
    print("📈 Running v9 Institutional backtest...")
    results = run_backtest(df)
    
    if results:
        print("\n" + "=" * 60)
        if results['win_rate'] >= 60:
            print("  ✅ STRATEGY PASSED - Win rate meets institutional standards")
        elif results['profit_factor'] >= 1.3:
            print("  ✅ STRATEGY VIABLE - Profit factor positive")
        else:
            print("  ⚠️ NEEDS OPTIMIZATION - Consider adjusting parameters")
        print("=" * 60)
