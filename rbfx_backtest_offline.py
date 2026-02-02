"""
RetailBeastFX Institutional v9.0 - Offline Backtester
Uses synthetic data when live data unavailable
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

# ═══════════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════
INITIAL_BALANCE = 1000
RISK_PER_TRADE = 0.01  # 1% risk per trade
SL_ATR_MULT = 2.0
TP_ATR_MULT = 6.0  # 3:1 R:R target
ADX_THRESHOLD = 25
NUM_CANDLES = 2000  # ~2 weeks of 15m data

# ═══════════════════════════════════════════════════════════════════════════════
# SYNTHETIC DATA GENERATOR
# ═══════════════════════════════════════════════════════════════════════════════
def generate_realistic_data(n_candles=2000, start_price=1.0850):
    """Generate realistic OHLCV data for EURUSD-like pair"""
    np.random.seed(42)
    
    dates = pd.date_range(start='2026-01-01', periods=n_candles, freq='15min')
    
    # Generate price movement with trend + noise
    returns = np.random.normal(0, 0.0003, n_candles)  # ~3 pips volatility
    
    # Add some trending behavior
    trend = np.cumsum(returns * 0.5)
    
    close = start_price + trend + np.random.normal(0, 0.0005, n_candles).cumsum() * 0.1
    
    # Generate OHLC
    volatility = np.abs(np.random.normal(0.0005, 0.0003, n_candles))
    
    high = close + volatility
    low = close - volatility
    open_price = np.roll(close, 1)
    open_price[0] = start_price
    
    # Ensure OHLC consistency
    high = np.maximum(high, np.maximum(open_price, close))
    low = np.minimum(low, np.minimum(open_price, close))
    
    # Volume with session patterns
    base_volume = np.random.exponential(10000, n_candles)
    session_mult = [1.5 if 8 <= h <= 16 else 0.7 for h in dates.hour]
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
def calculate_ema(series, period):
    return series.ewm(span=period, adjust=False).mean()

def calculate_atr(df, period=14):
    high = df['High']
    low = df['Low']
    close = df['Close']
    
    tr1 = high - low
    tr2 = abs(high - close.shift())
    tr3 = abs(low - close.shift())
    tr = pd.concat([tr1, tr2, tr3], axis=1).max(axis=1)
    return tr.rolling(window=period).mean()

def calculate_adx(df, period=14):
    """Simplified ADX calculation"""
    high = df['High'].values
    low = df['Low'].values
    close = df['Close'].values
    
    n = len(close)
    adx = np.zeros(n)
    
    for i in range(period * 2, n):
        # Simple trending measure based on directional movement
        ups = sum(1 for j in range(i-period, i) if close[j] > close[j-1])
        downs = period - ups
        dm = abs(ups - downs) / period
        
        # Range-based volatility
        avg_range = np.mean(high[i-period:i] - low[i-period:i])
        avg_close_range = np.mean(np.abs(np.diff(close[i-period:i])))
        
        if avg_range > 0:
            adx[i] = (dm * 50) + (avg_close_range / avg_range) * 25
        
    return pd.Series(adx, index=df.index)

def calculate_bollinger_bands(series, period=20, mult=1.0):
    sma = series.rolling(window=period).mean()
    std = series.rolling(window=period).std()
    upper = sma + mult * std
    lower = sma - mult * std
    return sma, upper, lower

# ═══════════════════════════════════════════════════════════════════════════════
# SIGNAL LOGIC
# ═══════════════════════════════════════════════════════════════════════════════
def generate_signals(df):
    # EMAs
    df['EMA8'] = calculate_ema(df['Close'], 8)
    df['EMA21'] = calculate_ema(df['Close'], 21)
    df['EMA50'] = calculate_ema(df['Close'], 50)
    df['EMA200'] = calculate_ema(df['Close'], 200)
    
    # Bollinger Bands
    df['BB_Mid'], df['BB_Upper'], df['BB_Lower'] = calculate_bollinger_bands(df['Close'], 20, 1.0)
    
    # ATR
    df['ATR'] = calculate_atr(df, 14)
    
    # ADX
    df['ADX'] = calculate_adx(df, 14)
    
    # Trend Conditions
    df['BullTrend'] = df['EMA8'] > df['EMA21']
    df['BearTrend'] = df['EMA8'] < df['EMA21']
    df['BullishBias'] = (df['Close'] > df['EMA50']) & (df['Close'] > df['EMA200'])
    df['BearishBias'] = (df['Close'] < df['EMA50']) & (df['Close'] < df['EMA200'])
    df['BelowSMA50'] = df['Close'] < df['EMA50']
    
    # ADX Gate
    df['ADX_Gate'] = df['ADX'] >= ADX_THRESHOLD
    
    # BB Touch
    df['TouchedLowerBB'] = df['Low'] <= df['BB_Lower']
    df['TouchedUpperBB'] = df['High'] >= df['BB_Upper']
    
    # Candle Type
    df['BullCandle'] = df['Close'] > df['Open']
    df['BearCandle'] = df['Close'] < df['Open']
    
    # Classic Signals
    df['ClassicBuy'] = df['BullCandle'] & df['TouchedLowerBB'] & df['BullTrend']
    df['ClassicSell'] = df['BearCandle'] & df['TouchedUpperBB'] & df['BearTrend']
    
    # Institutional Filters
    df['InstBuyFilter'] = df['ADX_Gate'] & df['BullishBias']
    df['InstSellFilter'] = df['ADX_Gate'] & (df['BearishBias'] | df['BelowSMA50'] | df['BearTrend'])
    
    # Final Signals
    df['BuySignal'] = df['ClassicBuy'] & df['InstBuyFilter']
    df['SellSignal'] = df['ClassicSell'] & df['InstSellFilter']
    
    return df

# ═══════════════════════════════════════════════════════════════════════════════
# BACKTESTER
# ═══════════════════════════════════════════════════════════════════════════════
def run_backtest(df):
    balance = INITIAL_BALANCE
    trades = []
    position = None
    cooldown = 0
    
    for i in range(250, len(df)):
        row = df.iloc[i]
        
        if cooldown > 0:
            cooldown -= 1
            continue
        
        if position is not None:
            # Check SL/TP
            if position['type'] == 'BUY':
                if row['Low'] <= position['sl']:
                    pnl = -position['risk_amount']
                    balance += pnl
                    trades.append({
                        'entry_time': position['entry_time'],
                        'exit_time': row.name,
                        'type': 'BUY',
                        'entry': position['entry'],
                        'exit': position['sl'],
                        'pnl': pnl,
                        'result': 'LOSS',
                        'r_multiple': -1.0
                    })
                    position = None
                    cooldown = 5
                elif row['High'] >= position['tp']:
                    pnl = position['risk_amount'] * (TP_ATR_MULT / SL_ATR_MULT)
                    balance += pnl
                    trades.append({
                        'entry_time': position['entry_time'],
                        'exit_time': row.name,
                        'type': 'BUY',
                        'entry': position['entry'],
                        'exit': position['tp'],
                        'pnl': pnl,
                        'result': 'WIN',
                        'r_multiple': TP_ATR_MULT / SL_ATR_MULT
                    })
                    position = None
                    cooldown = 5
            else:  # SELL
                if row['High'] >= position['sl']:
                    pnl = -position['risk_amount']
                    balance += pnl
                    trades.append({
                        'entry_time': position['entry_time'],
                        'exit_time': row.name,
                        'type': 'SELL',
                        'entry': position['entry'],
                        'exit': position['sl'],
                        'pnl': pnl,
                        'result': 'LOSS',
                        'r_multiple': -1.0
                    })
                    position = None
                    cooldown = 5
                elif row['Low'] <= position['tp']:
                    pnl = position['risk_amount'] * (TP_ATR_MULT / SL_ATR_MULT)
                    balance += pnl
                    trades.append({
                        'entry_time': position['entry_time'],
                        'exit_time': row.name,
                        'type': 'SELL',
                        'entry': position['entry'],
                        'exit': position['tp'],
                        'pnl': pnl,
                        'result': 'WIN',
                        'r_multiple': TP_ATR_MULT / SL_ATR_MULT
                    })
                    position = None
                    cooldown = 5
            continue
        
        # Check for new signals
        atr = row['ATR']
        if pd.isna(atr) or atr == 0:
            continue
            
        risk_amount = balance * RISK_PER_TRADE
        
        if row['BuySignal']:
            entry = row['Close']
            sl = entry - (atr * SL_ATR_MULT)
            tp = entry + (atr * TP_ATR_MULT)
            position = {
                'type': 'BUY',
                'entry': entry,
                'sl': sl,
                'tp': tp,
                'entry_time': row.name,
                'risk_amount': risk_amount
            }
        elif row['SellSignal']:
            entry = row['Close']
            sl = entry + (atr * SL_ATR_MULT)
            tp = entry - (atr * TP_ATR_MULT)
            position = {
                'type': 'SELL',
                'entry': entry,
                'sl': sl,
                'tp': tp,
                'entry_time': row.name,
                'risk_amount': risk_amount
            }
    
    return trades, balance

# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════
def main():
    print("=" * 60)
    print("RetailBeastFX Institutional v9.0 - Backtest")
    print("=" * 60)
    print(f"Data: Synthetic EURUSD (realistic volatility)")
    print(f"Candles: {NUM_CANDLES} x 15min (~2 weeks)")
    print(f"Initial Balance: ${INITIAL_BALANCE}")
    print(f"Risk Per Trade: {RISK_PER_TRADE * 100}%")
    print(f"R:R Target: 1:{TP_ATR_MULT / SL_ATR_MULT:.1f}")
    print("-" * 60)
    
    # Generate data
    print("\nGenerating realistic price data...")
    df = generate_realistic_data(NUM_CANDLES)
    print(f"Generated {len(df)} candles")
    print(f"Date range: {df.index[0]} to {df.index[-1]}")
    print(f"Price range: {df['Low'].min():.4f} to {df['High'].max():.4f}")
    
    # Generate signals
    print("\nGenerating signals...")
    df = generate_signals(df)
    
    buy_signals = df['BuySignal'].sum()
    sell_signals = df['SellSignal'].sum()
    adx_gate_open = df['ADX_Gate'].sum()
    print(f"ADX Gate Open bars: {adx_gate_open} ({adx_gate_open/len(df)*100:.1f}%)")
    print(f"Buy signals: {buy_signals}")
    print(f"Sell signals: {sell_signals}")
    
    # Run backtest
    print("\nRunning backtest...")
    trades, final_balance = run_backtest(df)
    
    # Results
    print("\n" + "=" * 60)
    print("BACKTEST RESULTS")
    print("=" * 60)
    
    if len(trades) == 0:
        print("No trades executed.")
        return
    
    wins = [t for t in trades if t['result'] == 'WIN']
    losses = [t for t in trades if t['result'] == 'LOSS']
    
    total_trades = len(trades)
    win_rate = len(wins) / total_trades * 100 if total_trades > 0 else 0
    total_r = sum(t['r_multiple'] for t in trades)
    avg_r_per_trade = total_r / total_trades if total_trades > 0 else 0
    
    total_pnl = sum(t['pnl'] for t in trades)
    gross_profit = sum(t['pnl'] for t in wins) if wins else 0
    gross_loss = abs(sum(t['pnl'] for t in losses)) if losses else 0.01
    profit_factor = gross_profit / gross_loss if gross_loss > 0 else 0
    
    # Drawdown
    equity_curve = [INITIAL_BALANCE]
    for t in trades:
        equity_curve.append(equity_curve[-1] + t['pnl'])
    peak = equity_curve[0]
    max_dd = 0
    for eq in equity_curve:
        if eq > peak:
            peak = eq
        dd = (peak - eq) / peak * 100
        if dd > max_dd:
            max_dd = dd
    
    print(f"\n📊 PERFORMANCE METRICS")
    print(f"   Total Trades: {total_trades}")
    print(f"   Wins: {len(wins)} | Losses: {len(losses)}")
    print(f"   Win Rate: {win_rate:.1f}%")
    print(f"   Total R Earned: {total_r:+.1f}R")
    print(f"   Avg R/Trade: {avg_r_per_trade:+.2f}R")
    print(f"   Profit Factor: {profit_factor:.2f}")
    
    print(f"\n💰 CAPITAL METRICS")
    print(f"   Starting Balance: ${INITIAL_BALANCE:.2f}")
    print(f"   Final Balance: ${final_balance:.2f}")
    print(f"   Total P&L: ${total_pnl:+.2f} ({(total_pnl/INITIAL_BALANCE)*100:+.1f}%)")
    print(f"   Max Drawdown: {max_dd:.1f}%")
    
    print(f"\n📈 EXPECTANCY ANALYSIS")
    expectancy = (win_rate/100 * (TP_ATR_MULT/SL_ATR_MULT)) - ((100-win_rate)/100 * 1)
    print(f"   Expected R per trade: {expectancy:+.2f}R")
    print(f"   Minimum win rate for breakeven: {100 / (1 + TP_ATR_MULT/SL_ATR_MULT):.1f}%")
    
    # Trade breakdown
    buy_trades = [t for t in trades if t['type'] == 'BUY']
    sell_trades = [t for t in trades if t['type'] == 'SELL']
    buy_wins = len([t for t in buy_trades if t['result'] == 'WIN'])
    sell_wins = len([t for t in sell_trades if t['result'] == 'WIN'])
    
    print(f"\n📋 TRADE BREAKDOWN")
    print(f"   BUY trades: {len(buy_trades)} (Win rate: {buy_wins/len(buy_trades)*100:.1f}%)" if buy_trades else "   BUY trades: 0")
    print(f"   SELL trades: {len(sell_trades)} (Win rate: {sell_wins/len(sell_trades)*100:.1f}%)" if sell_trades else "   SELL trades: 0")
    
    print(f"\n📋 RECENT TRADES")
    print("-" * 60)
    for t in trades[-10:]:
        print(f"   {t['type']:4} | {t['result']:4} | {t['r_multiple']:+.1f}R | ${t['pnl']:+.2f}")
    
    print("\n" + "=" * 60)
    print("⚠️  DISCLAIMER: Synthetic data backtest")
    print("    Real market results will vary due to:")
    print("    - Actual market structure and liquidity")
    print("    - Spreads, slippage, and commissions")
    print("    - Order Block detection differences")
    print("=" * 60)

if __name__ == "__main__":
    main()
