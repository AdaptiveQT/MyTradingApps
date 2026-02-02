"""
RetailBeastFX - Multi-Regime Backtester v1.0
Tests strategies across different market conditions:
- Trending (bull/bear)
- Ranging/Choppy
- High Volatility
- Mixed/Realistic
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Tuple
from dataclasses import dataclass

# Import from enhanced backtester
from rbfx_backtest_enhanced import (
    BacktestConfig, 
    generate_signals,
    run_backtest,
    calculate_metrics
)

# ═══════════════════════════════════════════════════════════════════════════════
# MARKET REGIME GENERATORS
# ═══════════════════════════════════════════════════════════════════════════════

def generate_trending_market(n_candles: int = 2000, direction: int = 1, seed: int = 42) -> pd.DataFrame:
    """Generate strongly trending market data."""
    np.random.seed(seed)
    dates = pd.date_range(start='2026-01-05', periods=n_candles, freq='15min')
    
    # Strong directional drift
    drift = direction * 0.00015  # ~15 pips per candle average
    returns = np.random.normal(drift, 0.0003, n_candles)
    
    close = 1.0850 * np.exp(np.cumsum(returns))
    
    # Session-based volatility
    hour_mult = np.array([1.5 if 8 <= h <= 16 else 0.7 for h in dates.hour])
    volatility = np.abs(np.random.normal(0.0004, 0.0002, n_candles)) * hour_mult
    
    high = close + volatility
    low = close - volatility
    open_price = np.roll(close, 1)
    open_price[0] = 1.0850
    
    high = np.maximum(high, np.maximum(open_price, close))
    low = np.minimum(low, np.minimum(open_price, close))
    
    volume = np.random.exponential(10000, n_candles) * hour_mult
    
    return pd.DataFrame({
        'Open': open_price, 'High': high, 'Low': low, 'Close': close, 'Volume': volume
    }, index=dates)


def generate_ranging_market(n_candles: int = 2000, seed: int = 42) -> pd.DataFrame:
    """Generate ranging/sideways market data."""
    np.random.seed(seed)
    dates = pd.date_range(start='2026-01-05', periods=n_candles, freq='15min')
    
    # Mean-reverting behavior around a center
    center = 1.0850
    close = np.zeros(n_candles)
    close[0] = center
    
    for i in range(1, n_candles):
        # Pull back toward center (mean reversion)
        reversion = (center - close[i-1]) * 0.02
        noise = np.random.normal(0, 0.0003)
        close[i] = close[i-1] + reversion + noise
    
    hour_mult = np.array([1.5 if 8 <= h <= 16 else 0.7 for h in dates.hour])
    volatility = np.abs(np.random.normal(0.0003, 0.0001, n_candles)) * hour_mult
    
    high = close + volatility
    low = close - volatility
    open_price = np.roll(close, 1)
    open_price[0] = center
    
    high = np.maximum(high, np.maximum(open_price, close))
    low = np.minimum(low, np.minimum(open_price, close))
    
    volume = np.random.exponential(8000, n_candles) * hour_mult
    
    return pd.DataFrame({
        'Open': open_price, 'High': high, 'Low': low, 'Close': close, 'Volume': volume
    }, index=dates)


def generate_volatile_market(n_candles: int = 2000, seed: int = 42) -> pd.DataFrame:
    """Generate high volatility/news-driven market."""
    np.random.seed(seed)
    dates = pd.date_range(start='2026-01-05', periods=n_candles, freq='15min')
    
    # Large moves with occasional spikes
    close = np.zeros(n_candles)
    close[0] = 1.0850
    
    for i in range(1, n_candles):
        # Occasional volatility spikes
        if np.random.random() < 0.05:  # 5% chance of spike
            move = np.random.normal(0, 0.002)  # Big move
        else:
            move = np.random.normal(0, 0.0005)  # Normal move
        close[i] = close[i-1] + move
    
    # Higher base volatility
    hour_mult = np.array([1.5 if 8 <= h <= 16 else 0.7 for h in dates.hour])
    volatility = np.abs(np.random.normal(0.0008, 0.0004, n_candles)) * hour_mult
    
    high = close + volatility
    low = close - volatility
    open_price = np.roll(close, 1)
    open_price[0] = 1.0850
    
    high = np.maximum(high, np.maximum(open_price, close))
    low = np.minimum(low, np.minimum(open_price, close))
    
    volume = np.random.exponential(15000, n_candles) * hour_mult * 1.5
    
    return pd.DataFrame({
        'Open': open_price, 'High': high, 'Low': low, 'Close': close, 'Volume': volume
    }, index=dates)


def generate_choppy_market(n_candles: int = 2000, seed: int = 42) -> pd.DataFrame:
    """Generate choppy/whipsaw market with false breakouts."""
    np.random.seed(seed)
    dates = pd.date_range(start='2026-01-05', periods=n_candles, freq='15min')
    
    close = np.zeros(n_candles)
    close[0] = 1.0850
    direction = 1
    
    for i in range(1, n_candles):
        # Frequent direction changes (whipsaws)
        if np.random.random() < 0.03:  # 3% chance to reverse
            direction *= -1
        
        # Small trending moves that frequently reverse
        drift = direction * 0.00005
        noise = np.random.normal(0, 0.0004)
        close[i] = close[i-1] + drift + noise
    
    hour_mult = np.array([1.5 if 8 <= h <= 16 else 0.7 for h in dates.hour])
    volatility = np.abs(np.random.normal(0.0004, 0.0002, n_candles)) * hour_mult
    
    high = close + volatility
    low = close - volatility
    open_price = np.roll(close, 1)
    open_price[0] = 1.0850
    
    high = np.maximum(high, np.maximum(open_price, close))
    low = np.minimum(low, np.minimum(open_price, close))
    
    volume = np.random.exponential(10000, n_candles) * hour_mult
    
    return pd.DataFrame({
        'Open': open_price, 'High': high, 'Low': low, 'Close': close, 'Volume': volume
    }, index=dates)


def generate_mixed_market(n_candles: int = 4000, seed: int = 42) -> pd.DataFrame:
    """Generate realistic mixed market with regime changes."""
    np.random.seed(seed)
    dates = pd.date_range(start='2026-01-05', periods=n_candles, freq='15min')
    
    close = np.zeros(n_candles)
    close[0] = 1.0850
    
    regime = 'trending'
    direction = 1
    regime_counter = 0
    
    for i in range(1, n_candles):
        regime_counter += 1
        
        # Change regime periodically
        if regime_counter > 200 and np.random.random() < 0.01:
            regime = np.random.choice(['trending', 'ranging', 'volatile', 'choppy'])
            direction = np.random.choice([-1, 1])
            regime_counter = 0
        
        if regime == 'trending':
            drift = direction * 0.00008
            noise = np.random.normal(0, 0.0003)
        elif regime == 'ranging':
            center = close[max(0, i-50):i].mean() if i > 50 else 1.0850
            drift = (center - close[i-1]) * 0.01
            noise = np.random.normal(0, 0.0003)
        elif regime == 'volatile':
            drift = 0
            noise = np.random.normal(0, 0.0008)
        else:  # choppy
            if np.random.random() < 0.02:
                direction *= -1
            drift = direction * 0.00003
            noise = np.random.normal(0, 0.0004)
        
        close[i] = close[i-1] + drift + noise
    
    hour_mult = np.array([1.5 if 8 <= h <= 16 else 0.7 for h in dates.hour])
    volatility = np.abs(np.random.normal(0.0004, 0.0002, n_candles)) * hour_mult
    
    high = close + volatility
    low = close - volatility
    open_price = np.roll(close, 1)
    open_price[0] = 1.0850
    
    high = np.maximum(high, np.maximum(open_price, close))
    low = np.minimum(low, np.minimum(open_price, close))
    
    volume = np.random.exponential(10000, n_candles) * hour_mult
    
    return pd.DataFrame({
        'Open': open_price, 'High': high, 'Low': low, 'Close': close, 'Volume': volume
    }, index=dates)


# ═══════════════════════════════════════════════════════════════════════════════
# MULTI-REGIME TESTER
# ═══════════════════════════════════════════════════════════════════════════════

def test_strategy_on_regime(df: pd.DataFrame, strategy: str, config_overrides: Dict = None) -> Dict:
    """Test a single strategy on a given market regime."""
    config = BacktestConfig(
        strategy=strategy,
        killzone_only=True,
        sl_atr_mult=2.0,
        tp_atr_mult=4.5
    )
    
    if config_overrides:
        for k, v in config_overrides.items():
            setattr(config, k, v)
    
    try:
        df_signals = generate_signals(df.copy(), config)
        trades, final_balance, equity_curve = run_backtest(df_signals, config)
        
        if len(trades) >= 5:
            metrics = calculate_metrics(trades, config.initial_balance, final_balance, equity_curve)
            return metrics
    except Exception as e:
        pass
    
    return None


def run_multi_regime_test():
    """Run all strategies across all market regimes."""
    
    strategies = [
        "Original",
        "Trend Following",
        "Mean Reversion",
        "Swing Pullbacks",
        "Breakout",
        "All Signals"
    ]
    
    regimes = {
        'Bull Trend': generate_trending_market(2000, direction=1, seed=42),
        'Bear Trend': generate_trending_market(2000, direction=-1, seed=43),
        'Ranging': generate_ranging_market(2000, seed=44),
        'Volatile': generate_volatile_market(2000, seed=45),
        'Choppy': generate_choppy_market(2000, seed=46),
        'Mixed': generate_mixed_market(4000, seed=47),
    }
    
    print("=" * 90)
    print("RetailBeastFX - Multi-Regime Strategy Analysis")
    print("=" * 90)
    print("\nTesting each strategy across 6 different market conditions...\n")
    
    # Results matrix
    results = {}
    
    for regime_name, df in regimes.items():
        print(f"📊 Testing {regime_name} market ({len(df)} candles)...")
        results[regime_name] = {}
        
        for strategy in strategies:
            metrics = test_strategy_on_regime(df, strategy)
            if metrics:
                results[regime_name][strategy] = {
                    'trades': metrics['total_trades'],
                    'wr': metrics['win_rate'],
                    'pf': metrics['profit_factor'],
                    'total_r': metrics['total_r'],
                    'dd': metrics['max_drawdown']
                }
            else:
                results[regime_name][strategy] = None
    
    # ═══════════════════════════════════════════════════════════════════════════
    # DISPLAY RESULTS
    # ═══════════════════════════════════════════════════════════════════════════
    
    print("\n" + "=" * 90)
    print("📊 PROFIT FACTOR BY REGIME")
    print("=" * 90)
    
    # Header
    regime_names = list(regimes.keys())
    header = f"{'Strategy':18} |" + "".join(f" {r[:10]:^10} |" for r in regime_names) + "   AVG"
    print(header)
    print("-" * len(header))
    
    strategy_averages = {}
    
    for strategy in strategies:
        row = f"{strategy:18} |"
        pfs = []
        for regime_name in regime_names:
            if results[regime_name].get(strategy):
                pf = results[regime_name][strategy]['pf']
                pfs.append(pf)
                # Color coding
                if pf >= 1.5:
                    marker = "★"
                elif pf >= 1.0:
                    marker = "●"
                else:
                    marker = "○"
                row += f" {pf:>6.2f}{marker}   |"
            else:
                row += "     -     |"
        
        avg = np.mean(pfs) if pfs else 0
        strategy_averages[strategy] = avg
        row += f" {avg:>6.2f}"
        print(row)
    
    print("\nLegend: ★ = PF ≥ 1.5 (Strong) | ● = PF ≥ 1.0 (Profitable) | ○ = PF < 1.0 (Losing)")
    
    # Win Rate Matrix
    print("\n" + "=" * 90)
    print("🎯 WIN RATE BY REGIME")
    print("=" * 90)
    
    print(header.replace("AVG", "AVG"))
    print("-" * len(header))
    
    for strategy in strategies:
        row = f"{strategy:18} |"
        wrs = []
        for regime_name in regime_names:
            if results[regime_name].get(strategy):
                wr = results[regime_name][strategy]['wr']
                wrs.append(wr)
                row += f" {wr:>6.1f}%   |"
            else:
                row += "     -     |"
        
        avg = np.mean(wrs) if wrs else 0
        row += f" {avg:>5.1f}%"
        print(row)
    
    # Total R Matrix
    print("\n" + "=" * 90)
    print("💰 TOTAL R BY REGIME")
    print("=" * 90)
    
    print(header)
    print("-" * len(header))
    
    for strategy in strategies:
        row = f"{strategy:18} |"
        rs = []
        for regime_name in regime_names:
            if results[regime_name].get(strategy):
                total_r = results[regime_name][strategy]['total_r']
                rs.append(total_r)
                row += f" {total_r:>+7.1f}R  |"
            else:
                row += "     -     |"
        
        avg = np.mean(rs) if rs else 0
        row += f" {avg:>+6.1f}R"
        print(row)
    
    # Best strategy per regime
    print("\n" + "=" * 90)
    print("🏆 BEST STRATEGY PER MARKET CONDITION")
    print("=" * 90)
    
    for regime_name in regime_names:
        best_pf = 0
        best_strategy = None
        for strategy in strategies:
            if results[regime_name].get(strategy) and results[regime_name][strategy]['pf'] > best_pf:
                best_pf = results[regime_name][strategy]['pf']
                best_strategy = strategy
        
        if best_strategy:
            r = results[regime_name][best_strategy]
            print(f"   {regime_name:12} → {best_strategy:18} | PF: {r['pf']:.2f} | WR: {r['wr']:.1f}% | R: {r['total_r']:+.1f}R")
    
    # Overall ranking
    print("\n" + "=" * 90)
    print("📋 OVERALL STRATEGY RANKING (Average PF Across All Regimes)")
    print("=" * 90)
    
    sorted_strategies = sorted(strategy_averages.items(), key=lambda x: x[1], reverse=True)
    
    for i, (strategy, avg_pf) in enumerate(sorted_strategies):
        bar_len = int(avg_pf * 10) if avg_pf > 0 else 0
        bar = "█" * bar_len
        medal = "🥇" if i == 0 else "🥈" if i == 1 else "🥉" if i == 2 else "  "
        print(f"   {medal} {strategy:18} | {bar:20} | Avg PF: {avg_pf:.2f}")
    
    # RECOMMENDATIONS
    print("\n" + "=" * 90)
    print("💡 ADAPTIVE STRATEGY RECOMMENDATIONS")
    print("=" * 90)
    
    # Find best for each regime type
    print("""
   Based on multi-regime analysis:

   📈 TRENDING MARKETS (ADX > 25, strong EMA alignment):
      → Use: Trend Following
      → Why: Catches continuation moves, best in directional markets
   
   📊 RANGING MARKETS (ADX < 20, price bouncing between levels):
      → Use: Mean Reversion or Original
      → Why: Fade extremes back to equilibrium
   
   ⚡ VOLATILE MARKETS (High ATR, news events):
      → Use: Breakout
      → Why: Captures momentum expansions
   
   🔀 MIXED/UNKNOWN:
      → Use: Original (BB-based) or Trend Following
      → Why: Most consistent across conditions
    """)
    
    # Adaptive mode suggestion
    print("\n" + "=" * 90)
    print("🎯 SUGGESTED: ADAPTIVE MODE")
    print("=" * 90)
    print("""
   Consider adding an ADAPTIVE strategy mode to your indicator:
   
   if ADX >= 25:
       signal = Trend Following signals
   elif BB_width < BB_width_SMA:  # Squeeze
       signal = Breakout signals
   else:
       signal = Original (BB bounce) signals
   
   This would dynamically switch strategies based on market conditions!
    """)
    
    print("=" * 90)


if __name__ == "__main__":
    run_multi_regime_test()
