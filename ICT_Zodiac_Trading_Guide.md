# ICT x Zodiac Protocol — Trading Guide

## Overview

The **ICT x Zodiac Protocol** combines Inner Circle Trader (ICT) mechanics with lunar zodiac context to create a complete, institutional-grade trading system.

---

## The Framework

### Zodiac Elements → ICT Bias

| Element | Zodiac Signs | ICT Profile | Trading Style |
|---------|--------------|-------------|---------------|
| 🔥 **FIRE** | Aries, Leo, Sagittarius | EXPANSION | Trust BOS, ride FVGs, trend days |
| 💧 **WATER** | Cancer, Scorpio, Pisces | MANIPULATION | Fade liquidity grabs, Turtle Soup |
| 🌪️ **AIR** | Gemini, Libra, Aquarius | CONSOLIDATION | Scalp internal range, no runners |
| 🌍 **EARTH** | Taurus, Virgo, Capricorn | STRUCTURE | Deep OTE entries, Breaker blocks |

---

## Daily Workflow

### 1. Pre-Market (Before 8 AM ET)

- Load `ICT_Zodiac_Protocol.pine` on your chart
- Check the **Dashboard** (top-right corner)
- Note today's **Element** and **ICT Bias**

### 2. Killzone Entry

| Session | Time (ET) | Character |
|---------|-----------|-----------|
| 🟡 Asia | 8 PM - 12 AM | Range-setting, accumulation |
| 🔵 London | 2 AM - 5 AM | First move, liquidity hunt |
| 🟢 NY AM | 7 AM - 10 AM | Major moves, reversals |
| 🟠 Silver Bullet | 10 AM - 11 AM | **Sniper hour** |

### 3. Structure Analysis

1. Wait for **BOS** (Break of Structure) label
2. Identify the **Order Block** (colored box with `▮ OB` label)
3. Mark any **FVG** (Fair Value Gap) zones

### 4. Entry Execution

**During Silver Bullet (10-11 AM):**

- Wait for price to enter an OB or FVG
- Confirm with displacement candle
- Enter on the **SB** (Silver Bullet) signal

### 5. Targets

- **R1/S1** pivot levels for first targets
- **PDH/PDL** for full runners
- **PWH/PWL** for swing trades

---

## Present Mode vs Historical Mode

| Mode | Setting | Use Case |
|------|---------|----------|
| **Present Mode ON** | Default | Clean chart, only fresh zones |
| **Present Mode OFF** | Toggle in settings | Backtesting, learning patterns |

### Mitigation Rules

- **Bull FVG** removed when price closes below
- **Bear FVG** removed when price closes above
- **Bull OB** invalidated when price closes below
- **Bear OB** invalidated when price closes above

---

## Trading Rules by Element

### 🔥 FIRE Days (Expansion)

- ✅ Trade breakouts aggressively
- ✅ Hold runners to PDH/PDL
- ✅ Trust BOS labels
- ❌ Don't fade the move
- ❌ Don't take counter-trend trades

### 💧 WATER Days (Manipulation)

- ✅ Fade killzone highs/lows
- ✅ Wait for liquidity sweeps
- ✅ Expect Judas swings
- ❌ Don't chase breakouts
- ❌ Don't trust first moves

### 🌪️ AIR Days (Consolidation)

- ✅ Scalp between pivots
- ✅ Take quick profits
- ✅ Trade internal range only
- ❌ Don't hold for runners
- ❌ Don't expect trending moves

### 🌍 EARTH Days (Structure)

- ✅ Wait for deep pullbacks
- ✅ Enter at OTE (Optimal Trade Entry)
- ✅ Use Breaker blocks
- ❌ Don't enter on first touch
- ❌ Don't rush entries

---

## Visual Legend

| Element | Color | Meaning |
|---------|-------|---------|
| 🟢 Green box | `▮ OB` | Bullish Order Block |
| 🔴 Red box | `▮ OB` | Bearish Order Block |
| 🔵 Teal box | `▮ FVG` | Bullish Fair Value Gap |
| 🔴 Maroon box | `▮ FVG` | Bearish Fair Value Gap |
| 🟡 Yellow BG | — | Asia Killzone |
| 🔵 Blue BG | — | London Killzone |
| 🟢 Green BG | — | NY AM Killzone |
| 🟠 Orange BG | — | Silver Bullet Hour |

---

## File Reference

| Script | Purpose |
|--------|---------|
| `ICT_Zodiac_Protocol.pine` | **Main indicator** - All features combined |
| `AEP_Protocol.pine` | Coach Eb trend-following logic |
| `AEP_Protocol_Strategy_GoldMaster.pine` | Backtesting with session filter |

---

## Alerts Available

- Silver Bullet LONG/SHORT
- Bullish/Bearish BOS
- London/NY Session Open

---

*Built with precision. Trade with purpose.* 🎯
