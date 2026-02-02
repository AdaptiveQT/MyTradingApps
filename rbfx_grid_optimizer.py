"""
RetailBeastFX - Grid Optimizer v1.0
Systematic parameter sweep to find optimal strategy configurations.
"""

import pandas as pd
import numpy as np
from itertools import product
from typing import Dict, List, Tuple
from dataclasses import dataclass
import sys

# Import from enhanced backtester
from rbfx_backtest_enhanced import (
    BacktestConfig, 
    generate_realistic_data,
    generate_signals,
    run_backtest,
    calculate_metrics
)

# ═══════════════════════════════════════════════════════════════════════════════
# PARAMETER GRID
# ═══════════════════════════════════════════════════════════════════════════════
PARAM_GRID = {
    'strategy': ['Trend Following', 'Mean Reversion', 'Swing Pullbacks', 'Breakout', 'All Signals'],
    'sl_atr_mult': [1.0, 1.5, 2.0],
    'tp_atr_mult': [2.0, 3.0, 4.5, 6.0],
    'ema_fast': [5, 8, 13],
    'ema_slow': [21, 34],
    'bb_period': [14, 20],
    'rsi_oversold': [25, 30],
    'killzone_only': [True, False],
}

# Reduced grid for faster testing
FAST_GRID = {
    'strategy': ['Trend Following', 'Mean Reversion', 'Breakout', 'All Signals'],
    'sl_atr_mult': [1.5, 2.0],
    'tp_atr_mult': [3.0, 4.5],
    'ema_fast': [8],
    'ema_slow': [21],
    'bb_period': [20],
    'rsi_oversold': [30],
    'killzone_only': [True],
}

# ═══════════════════════════════════════════════════════════════════════════════
# OPTIMIZER
# ═══════════════════════════════════════════════════════════════════════════════
def run_grid_optimization(df: pd.DataFrame, param_grid: Dict, min_trades: int = 10) -> List[Dict]:
    """Run grid search over parameter combinations."""
    
    # Generate all combinations
    keys = list(param_grid.keys())
    values = list(param_grid.values())
    combinations = list(product(*values))
    
    print(f"   Testing {len(combinations)} parameter combinations...")
    
    results = []
    
    for i, combo in enumerate(combinations):
        params = dict(zip(keys, combo))
        
        # Create config
        config = BacktestConfig(
            strategy=params.get('strategy', 'All Signals'),
            sl_atr_mult=params.get('sl_atr_mult', 1.5),
            tp_atr_mult=params.get('tp_atr_mult', 4.5),
            ema_fast=params.get('ema_fast', 8),
            ema_slow=params.get('ema_slow', 21),
            bb_period=params.get('bb_period', 20),
            rsi_oversold=params.get('rsi_oversold', 30),
            killzone_only=params.get('killzone_only', True),
        )
        
        # Run backtest
        try:
            df_signals = generate_signals(df.copy(), config)
            trades, final_balance, equity_curve = run_backtest(df_signals, config)
            
            if len(trades) >= min_trades:
                metrics = calculate_metrics(trades, config.initial_balance, final_balance, equity_curve)
                metrics['params'] = params
                results.append(metrics)
        except Exception as e:
            pass  # Skip failed combinations
        
        # Progress
        if (i + 1) % 50 == 0:
            print(f"   Progress: {i+1}/{len(combinations)} ({(i+1)/len(combinations)*100:.0f}%)")
    
    return results

def rank_results(results: List[Dict], sort_key: str = 'profit_factor', top_n: int = 10) -> List[Dict]:
    """Rank results by specified metric."""
    sorted_results = sorted(results, key=lambda x: x.get(sort_key, 0), reverse=True)
    return sorted_results[:top_n]

def format_params(params: Dict) -> str:
    """Format parameters for display."""
    return f"{params['strategy'][:12]:12} | SL:{params['sl_atr_mult']:.1f} TP:{params['tp_atr_mult']:.1f} | EMA:{params['ema_fast']}/{params['ema_slow']} | KZ:{'Y' if params['killzone_only'] else 'N'}"

# ═══════════════════════════════════════════════════════════════════════════════
# HEAT MAP ANALYSIS
# ═══════════════════════════════════════════════════════════════════════════════
def analyze_parameter_impact(results: List[Dict]) -> Dict:
    """Analyze which parameters have the most impact on performance."""
    
    if not results:
        return {}
    
    # Group by each parameter
    param_impact = {}
    
    params_to_analyze = ['strategy', 'sl_atr_mult', 'tp_atr_mult', 'killzone_only']
    
    for param in params_to_analyze:
        groups = {}
        for r in results:
            val = str(r['params'].get(param, 'N/A'))
            if val not in groups:
                groups[val] = []
            groups[val].append(r['profit_factor'])
        
        # Calculate average for each value
        param_impact[param] = {k: np.mean(v) for k, v in groups.items()}
    
    return param_impact

def print_heat_map(param_impact: Dict):
    """Print a text-based heat map of parameter impact."""
    
    print("\n📊 PARAMETER IMPACT ANALYSIS")
    print("-" * 60)
    
    for param, values in param_impact.items():
        print(f"\n   {param.upper()}:")
        
        # Sort by average profit factor
        sorted_vals = sorted(values.items(), key=lambda x: x[1], reverse=True)
        max_pf = max(values.values()) if values else 1
        
        for val, avg_pf in sorted_vals:
            bar_len = int(avg_pf / max_pf * 20) if max_pf > 0 else 0
            bar = "█" * bar_len
            print(f"      {val:15} | {bar:20} | PF: {avg_pf:.2f}")

# ═══════════════════════════════════════════════════════════════════════════════
# R:R ANALYSIS
# ═══════════════════════════════════════════════════════════════════════════════
def analyze_rr_combinations(df: pd.DataFrame, strategy: str = "All Signals") -> pd.DataFrame:
    """Analyze all R:R combinations for a given strategy."""
    
    sl_values = [1.0, 1.5, 2.0, 2.5, 3.0]
    tp_values = [1.5, 2.0, 3.0, 4.0, 4.5, 6.0]
    
    rr_results = []
    
    for sl_mult in sl_values:
        for tp_mult in tp_values:
            if tp_mult <= sl_mult:  # Skip negative R:R
                continue
            
            config = BacktestConfig(
                strategy=strategy,
                killzone_only=True,
                sl_atr_mult=sl_mult,
                tp_atr_mult=tp_mult
            )
            
            df_signals = generate_signals(df.copy(), config)
            trades, final_balance, equity_curve = run_backtest(df_signals, config)
            
            if len(trades) >= 5:
                metrics = calculate_metrics(trades, config.initial_balance, final_balance, equity_curve)
                rr_results.append({
                    'SL_Mult': sl_mult,
                    'TP_Mult': tp_mult,
                    'R:R': tp_mult / sl_mult,
                    'Trades': metrics['total_trades'],
                    'Win_Rate': metrics['win_rate'],
                    'Profit_Factor': metrics['profit_factor'],
                    'Total_R': metrics['total_r'],
                    'Max_DD': metrics['max_drawdown']
                })
    
    return pd.DataFrame(rr_results)

def print_rr_matrix(rr_df: pd.DataFrame):
    """Print R:R analysis as a matrix."""
    
    if rr_df.empty:
        print("   No valid R:R combinations found.")
        return
    
    print("\n📊 R:R PROFIT FACTOR MATRIX")
    print("-" * 60)
    
    # Pivot to matrix
    sl_values = sorted(rr_df['SL_Mult'].unique())
    tp_values = sorted(rr_df['TP_Mult'].unique())
    
    # Header
    header = "   SL\\TP |" + "".join(f" {tp:5.1f} |" for tp in tp_values)
    print(header)
    print("   " + "-" * (len(header) - 3))
    
    for sl in sl_values:
        row = f"    {sl:4.1f} |"
        for tp in tp_values:
            match = rr_df[(rr_df['SL_Mult'] == sl) & (rr_df['TP_Mult'] == tp)]
            if not match.empty:
                pf = match['Profit_Factor'].values[0]
                # Color code (text-based)
                if pf >= 1.5:
                    marker = "★"
                elif pf >= 1.0:
                    marker = "●"
                else:
                    marker = "○"
                row += f" {pf:4.2f}{marker}|"
            else:
                row += "   -   |"
        print(row)
    
    print("\n   Legend: ★ = PF ≥ 1.5 (Strong) | ● = PF ≥ 1.0 (Profitable) | ○ = PF < 1.0 (Losing)")

# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════
def main():
    print("=" * 70)
    print("RetailBeastFX - Grid Optimizer v1.0")
    print("=" * 70)
    
    # Generate data
    print("\n📊 GENERATING SYNTHETIC DATA...")
    df = generate_realistic_data(5000, seed=42)
    print(f"   Generated {len(df)} candles")
    
    # Ask for mode
    use_fast = True  # Default to fast mode
    if len(sys.argv) > 1 and sys.argv[1] == "--full":
        use_fast = False
    
    grid = FAST_GRID if use_fast else PARAM_GRID
    print(f"\n   Mode: {'FAST' if use_fast else 'FULL'} (use --full for comprehensive search)")
    
    # Run optimization
    print("\n" + "=" * 70)
    print("🔍 RUNNING GRID OPTIMIZATION")
    print("=" * 70)
    
    results = run_grid_optimization(df, grid, min_trades=10)
    print(f"\n   Valid combinations: {len(results)}")
    
    if not results:
        print("❌ No valid results. Try adjusting parameters or increasing data.")
        return
    
    # Top by Profit Factor
    print("\n" + "=" * 70)
    print("🏆 TOP 10 BY PROFIT FACTOR")
    print("=" * 70)
    
    top_pf = rank_results(results, 'profit_factor', 10)
    print(f"\n   {'#':>2} | {'Params':42} | {'WR':>6} | {'PF':>6} | {'Total R':>8}")
    print("   " + "-" * 72)
    
    for i, r in enumerate(top_pf):
        params_str = format_params(r['params'])
        print(f"   {i+1:>2} | {params_str:42} | {r['win_rate']:5.1f}% | {r['profit_factor']:6.2f} | {r['total_r']:+7.1f}R")
    
    # Top by Win Rate
    print("\n" + "=" * 70)
    print("🎯 TOP 10 BY WIN RATE")
    print("=" * 70)
    
    top_wr = rank_results(results, 'win_rate', 10)
    print(f"\n   {'#':>2} | {'Params':42} | {'WR':>6} | {'PF':>6} | {'Total R':>8}")
    print("   " + "-" * 72)
    
    for i, r in enumerate(top_wr):
        params_str = format_params(r['params'])
        print(f"   {i+1:>2} | {params_str:42} | {r['win_rate']:5.1f}% | {r['profit_factor']:6.2f} | {r['total_r']:+7.1f}R")
    
    # Top by Total R
    print("\n" + "=" * 70)
    print("💰 TOP 10 BY TOTAL R EARNED")
    print("=" * 70)
    
    top_r = rank_results(results, 'total_r', 10)
    print(f"\n   {'#':>2} | {'Params':42} | {'WR':>6} | {'PF':>6} | {'Total R':>8}")
    print("   " + "-" * 72)
    
    for i, r in enumerate(top_r):
        params_str = format_params(r['params'])
        print(f"   {i+1:>2} | {params_str:42} | {r['win_rate']:5.1f}% | {r['profit_factor']:6.2f} | {r['total_r']:+7.1f}R")
    
    # Parameter impact analysis
    print("\n" + "=" * 70)
    param_impact = analyze_parameter_impact(results)
    print_heat_map(param_impact)
    
    # R:R Matrix for best strategy
    print("\n" + "=" * 70)
    print("📊 R:R SENSITIVITY (Best Strategy)")
    print("=" * 70)
    
    best_strategy = top_pf[0]['params']['strategy'] if top_pf else "All Signals"
    print(f"\n   Analyzing: {best_strategy}")
    
    rr_df = analyze_rr_combinations(df, best_strategy)
    print_rr_matrix(rr_df)
    
    # Final recommendations
    print("\n" + "=" * 70)
    print("📋 OPTIMIZATION SUMMARY")
    print("=" * 70)
    
    if top_pf:
        best = top_pf[0]
        print(f"\n   🥇 RECOMMENDED CONFIGURATION:")
        print(f"      Strategy: {best['params']['strategy']}")
        print(f"      SL Multiplier: {best['params']['sl_atr_mult']}x ATR")
        print(f"      TP Multiplier: {best['params']['tp_atr_mult']}x ATR")
        print(f"      R:R Ratio: 1:{best['params']['tp_atr_mult']/best['params']['sl_atr_mult']:.1f}")
        print(f"      EMA Fast/Slow: {best['params']['ema_fast']}/{best['params']['ema_slow']}")
        print(f"      Killzone Only: {'Yes' if best['params']['killzone_only'] else 'No'}")
        print(f"\n   📊 EXPECTED PERFORMANCE:")
        print(f"      Win Rate: {best['win_rate']:.1f}%")
        print(f"      Profit Factor: {best['profit_factor']:.2f}")
        print(f"      Expectancy: {best['expectancy']:+.2f}R per trade")
        print(f"      Max Drawdown: {best['max_drawdown']:.1f}%")
    
    print("\n" + "=" * 70)
    print("⚠️  DISCLAIMER: Synthetic data optimization")
    print("    Parameters may be overfit to this specific dataset.")
    print("    Validate with walk-forward analysis before live trading.")
    print("=" * 70)


if __name__ == "__main__":
    main()
