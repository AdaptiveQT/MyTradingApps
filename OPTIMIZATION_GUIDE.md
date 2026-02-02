# RetailBeastFX EA Optimization Guide

## Quick Start: MT5 Strategy Tester Optimization

### Step 1: Open Strategy Tester

1. Press **Ctrl+R** or go to **View → Strategy Tester**
2. Select **RetailBeastFX_Pro_EA_v4**
3. Choose symbol (start with EURUSD)
4. Set date range (minimum 1 year recommended)

### Step 2: Enable Optimization Mode

1. Change mode from "Every tick" to **"Fast optimization (genetic algorithm)"**
2. Click the **Inputs** tab
3. Check the box next to parameters you want to optimize

---

## Recommended Parameters to Optimize

### High Impact Parameters

| Parameter | Start | Step | Stop | Purpose |
|-----------|-------|------|------|---------|
| InpADXThreshold | 20 | 5 | 40 | Trend detection sensitivity |
| InpATRMultSL | 1.5 | 0.5 | 3.5 | Stop loss distance |
| InpATRMultTP | 3.0 | 0.5 | 6.0 | Take profit distance |
| InpMinConfluence | 1 | 1 | 4 | Signal quality filter |

### Medium Impact Parameters

| Parameter | Start | Step | Stop | Purpose |
|-----------|-------|------|------|---------|
| InpEMAFast | 5 | 3 | 15 | Fast trend detection |
| InpEMASlow | 15 | 3 | 30 | Slow trend detection |
| InpRSIOversold | 5 | 5 | 20 | Mean reversion entry |
| InpRSIOverbought | 80 | 5 | 95 | Mean reversion entry |

### Session Parameters

| Parameter | Start | Step | Stop | Purpose |
|-----------|-------|------|------|---------|
| InpLondonStart | 2 | 1 | 5 | Session start time |
| InpNYStart | 7 | 1 | 10 | Session start time |

---

## Multi-Symbol Testing

### Best Pairs for This Strategy

| Pair | Recommended | Notes |
|------|-------------|-------|
| EURUSD | ✅ Highly | Low spread, smooth trends |
| GBPUSD | ✅ Highly | Good volatility |
| USDJPY | ⚠️ Moderate | Can be choppy |
| XAUUSD | ⚠️ Moderate | High volatility, widen SL |
| GBPJPY | ⚠️ Caution | Very volatile, reduce lot |

### Multi-Symbol Configuration

In v4 EA, set `InpSymbols` to:

```
EURUSD,GBPUSD,USDJPY
```

---

## Optimization Goals

### For Maximum Profit

- Optimize for: **Custom max (Profit Factor * Win Rate)**
- Accept Profit Factor > 1.3
- Accept Win Rate > 50%

### For Prop Firm Challenges

- Optimize for: **Minimal drawdown**
- Accept Max DD < 5% daily
- Accept Max DD < 8% total

### For Long-Term Growth

- Optimize for: **Sharpe Ratio**
- Accept Recovery Factor > 2
- Accept Expected Payoff > 0

---

## Sample Optimization Workflow

### Phase 1: Broad Search

1. Set wide parameter ranges
2. Run 1000 genetic iterations
3. Identify top 20 parameter sets

### Phase 2: Fine-Tuning

1. Narrow ranges around best results
2. Run 500 more iterations
3. Select top 5 candidates

### Phase 3: Walk-Forward Test

1. Test each candidate on unseen data
2. Compare forward vs backtest results
3. Select most consistent performer

---

## Avoiding Over-Optimization

### Warning Signs

- ❌ Profit Factor > 3.0 (too good to be true)
- ❌ Win Rate > 80% (curve-fitted)
- ❌ Max DD < 2% (unrealistic)
- ❌ Only works on specific date range

### Good Signs

- ✅ Profit Factor 1.2-2.0
- ✅ Win Rate 50-65%
- ✅ Works on multiple symbols
- ✅ Similar results forward and backward

---

## MT5 Optimization Criteria Explained

| Criterion | Best For |
|-----------|----------|
| **Balance max** | Maximum final profit |
| **Profit Factor** | Risk-adjusted returns |
| **Expected Payoff** | Average profit per trade |
| **Maximal Drawdown** | Capital preservation |
| **Sharpe Ratio** | Risk-adjusted performance |
| **Custom max** | Your own formula |

### Custom Formula Example

```
Profit Factor * (Win Rate / 100) * (1 - Max DD / 100)
```

---

## After Optimization

1. **Export settings** - Save optimized inputs
2. **Forward test** - Run on demo for 1 month
3. **Compare results** - Should be within 70% of backtest
4. **Deploy cautiously** - Start with minimum lot size
