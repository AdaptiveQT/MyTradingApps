"""
RetailBeastFX v9 - Volume Sentinel REQUIRED Backtest
Tests what happens when we REQUIRE volume confirmation for all trades
"""

import numpy as np
import pandas as pd
from datetime import datetime

# Config
CONFIG = {
    'adx_threshold': 25,
    'ema_200': 200,
    'bb_length': 20,
    'bb_mult': 1.0,
    'atr_length': 14,
    'atr_mult_sl': 2.0,
    'atr_mult_tp': 6.0,
    'london_start': 3, 'london_end': 6,
    'ny_start': 8, 'ny_end': 11,
    'vol_zscore_min': 1.5,  # Require Z-Score >= 1.5
    'signal_cooldown': 5,
}

def generate_market_data(bars=10000):
    np.random.seed(42)
    dates = pd.date_range(end=datetime.now(), periods=bars, freq='15min')
    
    returns = np.random.normal(0, 0.002, bars)
    trend = np.zeros(bars)
    for i in range(0, bars, 500):
        trend_dir = np.random.choice([-1, 1])
        trend[i:min(i+500, bars)] = trend_dir * np.random.uniform(0.0001, 0.0003)
    returns += trend
    
    close = 2000.0 * np.exp(np.cumsum(returns))
    high = close * (1 + np.abs(np.random.normal(0, 0.001, bars)))
    low = close * (1 - np.abs(np.random.normal(0, 0.001, bars)))
    open_price = np.roll(close, 1)
    open_price[0] = 2000.0
    
    # Volume with institutional surges
    base_vol = np.random.uniform(1000, 5000, bars)
    surges = np.random.choice([1, 1, 1, 1, 2, 3, 5, 8], bars)  # More variance
    volume = base_vol * surges
    
    return pd.DataFrame({
        'datetime': dates, 'open': open_price, 'high': high,
        'low': low, 'close': close, 'volume': volume
    })

def calc_indicators(df):
    df['ema8'] = df['close'].ewm(span=8).mean()
    df['ema21'] = df['close'].ewm(span=21).mean()
    df['ema200'] = df['close'].ewm(span=200).mean()
    
    # ATR
    tr = pd.concat([
        df['high'] - df['low'],
        abs(df['high'] - df['close'].shift(1)),
        abs(df['low'] - df['close'].shift(1))
    ], axis=1).max(axis=1)
    df['atr'] = tr.rolling(14).mean()
    
    # ADX (simplified)
    plus_dm = df['high'].diff().clip(lower=0)
    minus_dm = (-df['low'].diff()).clip(lower=0)
    atr14 = tr.rolling(14).mean()
    plus_di = 100 * plus_dm.rolling(14).mean() / atr14
    minus_di = 100 * minus_dm.rolling(14).mean() / atr14
    dx = 100 * abs(plus_di - minus_di) / (plus_di + minus_di + 0.001)
    df['adx'] = dx.rolling(14).mean()
    
    # BB
    df['bb_basis'] = df['close'].rolling(20).mean()
    df['bb_std'] = df['close'].rolling(20).std()
    df['bb_upper'] = df['bb_basis'] + df['bb_std']
    df['bb_lower'] = df['bb_basis'] - df['bb_std']
    
    # Volume Z-Score (SENTINEL)
    avg_vol = df['volume'].rolling(20).mean()
    std_vol = df['volume'].rolling(20).std()
    df['vol_zscore'] = (df['volume'] - avg_vol) / (std_vol + 0.001)
    
    # Absorption: high volume + small body
    body = abs(df['close'] - df['open'])
    avg_body = body.rolling(20).mean()
    candle_range = df['high'] - df['low']
    df['is_absorption'] = (df['vol_zscore'] >= 1.5) & (body < candle_range * 0.3)
    
    return df

def is_killzone(dt):
    h = dt.hour
    if 3 <= h < 6: return True, 'LONDON'
    if 8 <= h < 11: return True, 'NY'
    return False, 'OFF'

def run_backtest(df, require_volume=True):
    """Run backtest with optional volume requirement"""
    df = calc_indicators(df)
    
    trades = []
    last_bar = -100
    
    for i in range(220, len(df)):
        row = df.iloc[i]
        
        if i - last_bar < 5: continue
        
        in_kz, session = is_killzone(row['datetime'])
        if not in_kz: continue
        
        if pd.isna(row['adx']) or row['adx'] < 25: continue
        
        bull_trend = row['ema8'] > row['ema21']
        bear_trend = row['ema8'] < row['ema21']
        above_200 = row['close'] > row['ema200']
        below_200 = row['close'] < row['ema200']
        bull_candle = row['close'] > row['open']
        bear_candle = row['close'] < row['open']
        touch_lower = row['low'] <= row['bb_lower']
        touch_upper = row['high'] >= row['bb_upper']
        
        # Volume Sentinel check
        vol_confirmed = row['vol_zscore'] >= CONFIG['vol_zscore_min'] or row['is_absorption']
        
        # If requiring volume, skip if not confirmed
        if require_volume and not vol_confirmed:
            continue
        
        # Signals
        buy = bull_candle and touch_lower and bull_trend and above_200
        sell = bear_candle and touch_upper and bear_trend and below_200
        
        if buy or sell:
            is_buy = buy
            entry = row['close']
            atr = row['atr']
            
            if is_buy:
                sl = entry - atr * 2.0
                tp = entry + atr * 6.0
            else:
                sl = entry + atr * 2.0
                tp = entry - atr * 6.0
            
            # Simulate outcome
            result = 'TIMEOUT'
            pnl = 0
            for j in range(i+1, min(i+100, len(df))):
                r = df.iloc[j]
                if is_buy:
                    if r['low'] <= sl: result, pnl = 'LOSS', -1.0; break
                    if r['high'] >= tp: result, pnl = 'WIN', 3.0; break
                else:
                    if r['high'] >= sl: result, pnl = 'LOSS', -1.0; break
                    if r['low'] <= tp: result, pnl = 'WIN', 3.0; break
            
            trades.append({
                'direction': 'BUY' if is_buy else 'SELL',
                'session': session,
                'vol_zscore': row['vol_zscore'],
                'vol_confirmed': vol_confirmed,
                'result': result,
                'pnl': pnl
            })
            last_bar = i
    
    return trades

def analyze(trades, label):
    if not trades:
        print(f"\n{label}: No trades")
        return
    
    total = len(trades)
    wins = sum(1 for t in trades if t['result'] == 'WIN')
    losses = sum(1 for t in trades if t['result'] == 'LOSS')
    wr = wins/total*100 if total > 0 else 0
    total_r = sum(t['pnl'] for t in trades)
    
    print(f"\n{'='*50}")
    print(f"  {label}")
    print(f"{'='*50}")
    print(f"  Trades:    {total}")
    print(f"  Wins:      {wins}")
    print(f"  Losses:    {losses}")
    print(f"  Win Rate:  {wr:.1f}%")
    print(f"  Total R:   {total_r:+.1f}R")
    
    if total > 0:
        pf = sum(t['pnl'] for t in trades if t['pnl'] > 0) / max(0.01, abs(sum(t['pnl'] for t in trades if t['pnl'] < 0)))
        print(f"  PF:        {pf:.2f}")

# Main
print("\n🦁 VOLUME SENTINEL IMPACT TEST")
print("=" * 50)

df = generate_market_data(10000)
print(f"Generated {len(df)} bars")

# Test WITHOUT volume requirement
trades_no_vol = run_backtest(df, require_volume=False)
analyze(trades_no_vol, "WITHOUT Volume Sentinel Required")

# Test WITH volume requirement
trades_with_vol = run_backtest(df, require_volume=True)
analyze(trades_with_vol, "WITH Volume Sentinel Required (Z≥1.5)")

# Compare
print("\n" + "=" * 50)
print("  📊 COMPARISON")
print("=" * 50)

if trades_no_vol and trades_with_vol:
    wr_no = sum(1 for t in trades_no_vol if t['result']=='WIN')/len(trades_no_vol)*100
    wr_with = sum(1 for t in trades_with_vol if t['result']=='WIN')/len(trades_with_vol)*100
    
    print(f"  Without Vol: {len(trades_no_vol)} trades, {wr_no:.1f}% WR")
    print(f"  With Vol:    {len(trades_with_vol)} trades, {wr_with:.1f}% WR")
    print(f"  Win Rate Δ:  {wr_with - wr_no:+.1f}%")
    print(f"  Trade Reduction: {100 - len(trades_with_vol)/len(trades_no_vol)*100:.0f}%")
