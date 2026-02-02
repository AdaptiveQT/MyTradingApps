"""
RetailBeastFX Institutional v9.0 - Python Backtester
Replicates the Pine Script signal logic for realistic backtest results
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import yfinance as yf

# ═══════════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════
SYMBOL = "EURUSD=X"  # Forex pair
PERIOD = "3mo"  # 3 months of data
INTERVAL = "15m"  # 15-minute candles
INITIAL_BALANCE = 1000
RISK_PER_TRADE = 0.01  # 1% risk per trade
SL_ATR_MULT = 2.0
TP_ATR_MULT = 6.0  # 3:1 R:R target
ADX_THRESHOLD = 25

# ═══════════════════════════════════════════════════════════════════════════════
# INDICATOR CALCULATIONS
# ═══════════════════════════════════════════════════════════════════════════════
def calculate_ema(series, period):
    return series.ewm(span=period, adjust=False).mean()

def calculate_sma(series, period):
    return series.rolling(window=period).mean()

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
    """Calculate ADX indicator"""
    high = df['High']
    low = df['Low']
    close = df['Close']
    
    plus_dm = high.diff()
    minus_dm = low.diff().abs() * -1
    
    plus_dm = np.where((plus_dm > minus_dm.abs()) & (plus_dm > 0), plus_dm, 0)
    minus_dm = np.where((minus_dm.abs() > plus_dm) & (minus_dm < 0), minus_dm.abs(), 0)
    
    tr1 = high - low
    tr2 = abs(high - close.shift())
    tr3 = abs(low - close.shift())
    tr = pd.concat([pd.Series(tr1), pd.Series(tr2), pd.Series(tr3)], axis=1).max(axis=1)
    
    atr = tr.rolling(window=period).mean()
    
    plus_di = 100 * pd.Series(plus_dm).rolling(window=period).mean() / atr
    minus_di = 100 * pd.Series(minus_dm).rolling(window=period).mean() / atr
    
    dx = 100 * abs(plus_di - minus_di) / (plus_di + minus_di + 0.0001)
    adx = dx.rolling(window=period).mean()
    
    return adx

def calculate_bollinger_bands(series, period=20, mult=1.0):
    sma = series.rolling(window=period).mean()
    std = series.rolling(window=period).std()
    upper = sma + mult * std
    lower = sma - mult * std
    return sma, upper, lower

# ═══════════════════════════════════════════════════════════════════════════════
# SESSION FILTER (Killzones)
# ═══════════════════════════════════════════════════════════════════════════════
def is_in_killzone(timestamp):
    """Check if timestamp is in London or NY killzone (EST)"""
    hour = timestamp.hour
    # London: 3-6 AM EST, NY: 8-11 AM EST
    return (3 <= hour <= 6) or (8 <= hour <= 11)

# ═══════════════════════════════════════════════════════════════════════════════
# SIGNAL LOGIC
# ═══════════════════════════════════════════════════════════════════════════════
def generate_signals(df):
    """
    Replicate Beast_Institutional_v9 signal logic
    """
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
    """
    Run backtest with realistic trade management
    """
    balance = INITIAL_BALANCE
    trades = []
    position = None
    cooldown = 0
    
    for i in range(50, len(df)):
        row = df.iloc[i]
        
        # Cooldown between trades
        if cooldown > 0:
            cooldown -= 1
            continue
        
        # Skip if already in position
        if position is not None:
            # Check SL/TP
            if position['type'] == 'BUY':
                if row['Low'] <= position['sl']:
                    # Stop Loss Hit
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
                    # Take Profit Hit
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
                    # Stop Loss Hit
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
                    # Take Profit Hit
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
    print("RetailBeastFX Institutional v9.0 - Python Backtest")
    print("=" * 60)
    print(f"Symbol: {SYMBOL}")
    print(f"Period: {PERIOD}")
    print(f"Interval: {INTERVAL}")
    print(f"Initial Balance: ${INITIAL_BALANCE}")
    print(f"Risk Per Trade: {RISK_PER_TRADE * 100}%")
    print(f"R:R Target: 1:{TP_ATR_MULT / SL_ATR_MULT:.1f}")
    print("-" * 60)
    
    # Fetch data
    print("\nFetching market data...")
    df = yf.download(SYMBOL, period=PERIOD, interval=INTERVAL, progress=False)
    
    if df.empty:
        print("ERROR: Could not fetch data. Trying GBPUSD...")
        df = yf.download("GBPUSD=X", period=PERIOD, interval=INTERVAL, progress=False)
    
    print(f"Loaded {len(df)} candles")
    print(f"Date range: {df.index[0]} to {df.index[-1]}")
    
    # Generate signals
    print("\nGenerating signals...")
    df = generate_signals(df)
    
    buy_signals = df['BuySignal'].sum()
    sell_signals = df['SellSignal'].sum()
    print(f"Buy signals generated: {buy_signals}")
    print(f"Sell signals generated: {sell_signals}")
    
    # Run backtest
    print("\nRunning backtest...")
    trades, final_balance = run_backtest(df)
    
    # Results
    print("\n" + "=" * 60)
    print("BACKTEST RESULTS")
    print("=" * 60)
    
    if len(trades) == 0:
        print("No trades executed. Check signal conditions.")
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
    
    # Calculate drawdown
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
    
    print(f"\n📈 EXPECTANCY")
    expectancy = (win_rate/100 * (TP_ATR_MULT/SL_ATR_MULT)) - ((100-win_rate)/100 * 1)
    print(f"   Expectancy per trade: {expectancy:+.2f}R")
    
    print(f"\n⚠️ DISCLAIMER")
    print("   This is a simplified backtest. Real results may vary due to:")
    print("   - Slippage, spread, and commissions")
    print("   - Market conditions and liquidity")
    print("   - Emotional decision-making")
    print("   - Order Block detection (not fully replicated)")
    
    # Trade log sample
    print(f"\n📋 RECENT TRADES (Last 10)")
    print("-" * 60)
    for t in trades[-10:]:
        print(f"   {t['type']:4} | {t['result']:4} | {t['r_multiple']:+.1f}R | ${t['pnl']:+.2f}")
    
    print("\n" + "=" * 60)
    print("BACKTEST COMPLETE")
    print("=" * 60)

if __name__ == "__main__":
    main()
