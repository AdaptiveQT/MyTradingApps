"""
RetailBeastFX - Confluence Optimizer v2
Find which conditions produce the highest win rates
"""

import pandas as pd
import numpy as np
from itertools import combinations

print("=" * 60)
print("LOADING...")
print("=" * 60)

# ═══════════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════
NUM_CANDLES = 3000
SL_ATR_MULT = 2.0
TP_ATR_MULT = 6.0

# ═══════════════════════════════════════════════════════════════════════════════
# SYNTHETIC DATA - More trending for realistic results
# ═══════════════════════════════════════════════════════════════════════════════
print("Generating price data...")
np.random.seed(123)
dates = pd.date_range(start='2026-01-01', periods=NUM_CANDLES, freq='15min')

# Create trending market with pullbacks
base = 1.0850
price = [base]
trend_dir = 1
for i in range(1, NUM_CANDLES):
    # Change trend occasionally
    if np.random.random() < 0.01:
        trend_dir *= -1
    
    # Trending move with noise
    change = trend_dir * 0.0002 + np.random.normal(0, 0.0004)
    price.append(price[-1] + change)

close = np.array(price)
volatility = np.abs(np.random.normal(0.0006, 0.0002, NUM_CANDLES))
high = close + volatility
low = close - volatility
open_price = np.roll(close, 1)
open_price[0] = base

# Ensure OHLC consistency
high = np.maximum(high, np.maximum(open_price, close))
low = np.minimum(low, np.minimum(open_price, close))

volume = np.random.exponential(10000, NUM_CANDLES) * np.array([1.5 if 8 <= h <= 16 else 0.8 for h in dates.hour])

df = pd.DataFrame({
    'Open': open_price, 'High': high, 'Low': low, 'Close': close, 'Volume': volume
}, index=dates)

print(f"Generated {len(df)} candles")
print(f"Price range: {df['Low'].min():.4f} to {df['High'].max():.4f}")

# ═══════════════════════════════════════════════════════════════════════════════
# INDICATORS
# ═══════════════════════════════════════════════════════════════════════════════
print("Calculating indicators...")

# EMAs
df['EMA8'] = df['Close'].ewm(span=8, adjust=False).mean()
df['EMA21'] = df['Close'].ewm(span=21, adjust=False).mean()
df['EMA50'] = df['Close'].ewm(span=50, adjust=False).mean()
df['EMA200'] = df['Close'].ewm(span=200, adjust=False).mean()

# BB
df['BB_Mid'] = df['Close'].rolling(20).mean()
df['BB_Std'] = df['Close'].rolling(20).std()
df['BB_Upper'] = df['BB_Mid'] + df['BB_Std']
df['BB_Lower'] = df['BB_Mid'] - df['BB_Std']

# ATR
tr = pd.concat([
    df['High'] - df['Low'],
    abs(df['High'] - df['Close'].shift()),
    abs(df['Low'] - df['Close'].shift())
], axis=1).max(axis=1)
df['ATR'] = tr.rolling(14).mean()

# Volume
df['VolZ'] = (df['Volume'] - df['Volume'].rolling(20).mean()) / (df['Volume'].rolling(20).std() + 1)

# Simple ADX proxy
df['ADX'] = (abs(df['Close'] - df['Close'].shift(14)) / df['ATR']).rolling(14).mean() * 25
df['ADX'] = df['ADX'].fillna(20)

print("Indicators ready!")

# ═══════════════════════════════════════════════════════════════════════════════
# CONDITIONS
# ═══════════════════════════════════════════════════════════════════════════════
print("Building conditions...")

conditions = {
    'Bull_Candle': df['Close'] > df['Open'],
    'EMA_Bull': df['EMA8'] > df['EMA21'],
    'Above_50': df['Close'] > df['EMA50'],
    'Above_200': df['Close'] > df['EMA200'],
    'BB_Touch': df['Low'] <= df['BB_Lower'],
    'ADX_High': df['ADX'] > 20,
    'Vol_Up': df['VolZ'] > 0.5,
    'Killzone': pd.Series(df.index.hour.isin([3,4,5,8,9,10,11]), index=df.index),
    'Higher_Low': df['Low'] > df['Low'].shift(1),
}

# ═══════════════════════════════════════════════════════════════════════════════
# BACKTEST FUNCTION
# ═══════════════════════════════════════════════════════════════════════════════
def test_combo(condition_names):
    # Build signal
    signal = conditions['Bull_Candle'].copy()
    for name in condition_names:
        signal = signal & conditions[name]
    
    wins = 0
    losses = 0
    position = None
    cooldown = 0
    
    for i in range(250, len(df)):
        if cooldown > 0:
            cooldown -= 1
            continue
        
        row = df.iloc[i]
        atr = row['ATR']
        if pd.isna(atr) or atr <= 0:
            continue
        
        if position:
            if row['Low'] <= position['sl']:
                losses += 1
                position = None
                cooldown = 3
            elif row['High'] >= position['tp']:
                wins += 1
                position = None
                cooldown = 3
            continue
        
        if signal.iloc[i]:
            position = {
                'sl': row['Close'] - atr * SL_ATR_MULT,
                'tp': row['Close'] + atr * TP_ATR_MULT
            }
    
    total = wins + losses
    if total < 3:
        return None
    return {'wins': wins, 'losses': losses, 'total': total, 'wr': wins/total*100}

# ═══════════════════════════════════════════════════════════════════════════════
# RUN TESTS
# ═══════════════════════════════════════════════════════════════════════════════
print("\n" + "=" * 60)
print("TESTING CONDITION COMBINATIONS")
print("=" * 60)

test_conditions = ['EMA_Bull', 'Above_50', 'Above_200', 'BB_Touch', 'ADX_High', 'Vol_Up', 'Killzone', 'Higher_Low']

results = []

# Test single conditions first
print("\n📊 SINGLE CONDITIONS:")
print("-" * 40)
for cond in test_conditions:
    r = test_combo([cond])
    if r:
        print(f"   {cond:15} | {r['wr']:5.1f}% WR | {r['total']:3} trades")
        results.append({'combo': [cond], **r})

# Test pairs
print("\n📊 BEST 2-CONDITION COMBOS:")
print("-" * 40)
for c1, c2 in combinations(test_conditions, 2):
    r = test_combo([c1, c2])
    if r and r['total'] >= 3:
        results.append({'combo': [c1, c2], **r})

# Test triples
print("Testing 3-condition combos...")
for combo in combinations(test_conditions, 3):
    r = test_combo(list(combo))
    if r and r['total'] >= 3:
        results.append({'combo': list(combo), **r})

# Sort and display
results.sort(key=lambda x: x['wr'], reverse=True)

print("\n" + "=" * 60)
print("🏆 TOP 15 COMBINATIONS BY WIN RATE")
print("=" * 60)

for i, r in enumerate(results[:15]):
    star = "⭐" if r['wr'] >= 70 else "  "
    bar = "█" * int(r['wr'] / 10)
    print(f"{star} {r['wr']:5.1f}% | {bar:10} | {r['wins']}W/{r['losses']}L | {' + '.join(r['combo'])}")

# Find 70%+
top_combos = [r for r in results if r['wr'] >= 70]
print("\n" + "=" * 60)
print(f"🎯 COMBOS WITH 70%+ WIN RATE: {len(top_combos)}")
print("=" * 60)

if top_combos:
    for r in top_combos[:10]:
        print(f"   ✅ {r['wr']:.1f}% | {' + '.join(r['combo'])}")
else:
    print("   No 70%+ combos found at 3:1 R:R")
    print("   This is normal - high R:R means lower win rate")
    print("\n   Best combo found:")
    if results:
        best = results[0]
        print(f"   {best['wr']:.1f}% WR with: {' + '.join(best['combo'])}")

# Frequency analysis
print("\n" + "=" * 60)
print("📊 WHICH CONDITIONS APPEAR MOST IN TOP 10?")
print("=" * 60)

freq = {}
for r in results[:10]:
    for c in r['combo']:
        freq[c] = freq.get(c, 0) + 1

for cond, count in sorted(freq.items(), key=lambda x: x[1], reverse=True):
    bar = "█" * (count * 2)
    print(f"   {cond:15} | {bar} ({count})")

print("\n" + "=" * 60)
print("DONE!")
print("=" * 60)
