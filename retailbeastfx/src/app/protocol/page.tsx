'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Marketing/Footer';
import Header from '@/components/Marketing/Header';

const pineScriptCode = `// This Pine Script™ code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © RetailBeastFX Protocol - Professional Trend + ORB System

//@version=5
indicator("RetailBeastFX Protocol [Trend + ORB]", overlay=true, max_boxes_count=500, max_lines_count=500, max_labels_count=500)

// ══════════════════════════════════════════════════════════════════════════════
// ░░░ CORE SETTINGS ░░░
// ══════════════════════════════════════════════════════════════════════════════

grpCore = "Core Trend System"
string maType = input.string("EMA", "MA Type", options=["EMA", "SMA", "WMA", "VWMA"], group=grpCore)
int fastLen = input.int(9, "Fast MA Length", minval=1, group=grpCore, tooltip="Faster moving average for short-term trend")
int slowLen = input.int(30, "Slow MA Length", minval=1, group=grpCore, tooltip="Slower moving average for long-term trend")
int rsiLen = input.int(14, "RSI Length", minval=2, group=grpCore)
int rsiOB = input.int(70, "RSI Overbought", minval=50, maxval=100, group=grpCore)
int rsiOS = input.int(25, "RSI Oversold", minval=0, maxval=50, group=grpCore)

// ══════════════════════════════════════════════════════════════════════════════
// ░░░ CONSOLIDATION DETECTION ░░░
// ══════════════════════════════════════════════════════════════════════════════

grpChop = "Consolidation Filter"
float consolEMAPct = input.float(0.4, "EMA Distance Threshold %", minval=0.1, step=0.1, group=grpChop, 
 tooltip="When MAs are closer than this %, market is consolidating")
float consolMaxMovePct = input.float(0.6, "Max Range Move %", minval=0.1, step=0.1, group=grpChop,
 tooltip="Maximum price movement % to be considered consolidation")
int rangeBarCount = input.int(20, "Range Lookback Bars", minval=5, group=grpChop)

// ══════════════════════════════════════════════════════════════════════════════
// ░░░ OPENING RANGE BREAKOUT (ORB) ░░░
// ══════════════════════════════════════════════════════════════════════════════

grpORB = "Opening Range Breakout"
bool orbEnabled = input.bool(true, "Enable ORB System", group=grpORB)
string orbSession = input.session("0930-0945", "ORB Session (NY Time)", group=grpORB,
 tooltip="The opening 15 minutes establishes the range")
string tradingSession = input.session("0930-1600", "Trading Session", group=grpORB)
int orbHoldBars = input.int(15, "ORB Momentum Bars", minval=1, group=grpORB,
 tooltip="How many bars to ride the ORB breakout momentum")
bool blockCounterTrend = input.bool(true, "Block Counter-Trend During ORB", group=grpORB,
 tooltip="Prevent short signals during bullish ORB breakout (and vice versa)")
bool showORBLines = input.bool(true, "Show ORB Range Lines", group=grpORB)
float orbRetestTol = input.float(30.0, "Retest Tolerance %", minval=1.0, step=0.5, group=grpORB,
 tooltip="How close price needs to get to ORB levels for retest signal")
int maxBarsRetest = input.int(25, "Max Bars for Retest", minval=5, group=grpORB)

// ══════════════════════════════════════════════════════════════════════════════
// ░░░ SUPPLY & DEMAND ZONES ░░░
// ══════════════════════════════════════════════════════════════════════════════

grpSD = "Supply & Demand Zones"
bool showSDZones = input.bool(true, "Show S/D Zones", group=grpSD)
int pivotLeft = input.int(10, "Pivot Strength (Left)", minval=1, group=grpSD,
 tooltip="More bars = stronger but fewer pivots")
int pivotRight = input.int(3, "Pivot Confirmation (Right)", minval=1, group=grpSD)
int maxLevels = input.int(20, "Max Active Zones", minval=5, group=grpSD)
int zoneHeightTicks = input.int(28, "Zone Height (Ticks)", minval=1, group=grpSD)
bool showZoneLabels = input.bool(true, "Show Zone Labels", group=grpSD)
color supplyColor = input.color(color.new(color.red, 80), "Supply Color", group=grpSD)
color demandColor = input.color(color.new(color.blue, 80), "Demand Color", group=grpSD)

// ══════════════════════════════════════════════════════════════════════════════
// ░░░ VOLUME & MOMENTUM ░░░
// ══════════════════════════════════════════════════════════════════════════════

grpMomentum = "Volume & Momentum"
int volumePeriod = input.int(8, "Volume Average Period", minval=1, group=grpMomentum)
float momentumBodyMult = input.float(1.2, "Strong Candle Body Multiplier", minval=0.5, step=0.1, group=grpMomentum,
 tooltip="Candle body must be this many times larger than average")

// ══════════════════════════════════════════════════════════════════════════════
// ░░░ RISK MANAGEMENT ░░░
// ══════════════════════════════════════════════════════════════════════════════

grpRisk = "Risk Management"
float profitFactor = input.float(2.0, "Profit Target (R:R)", minval=0.5, step=0.5, group=grpRisk,
 tooltip="Profit target as multiple of ATR (e.g., 2.0 = 2:1 R:R)")
float stopFactor = input.float(1.0, "Stop Loss Factor", minval=0.5, step=0.5, group=grpRisk,
 tooltip="Stop loss as multiple of ATR")

// ══════════════════════════════════════════════════════════════════════════════
// ░░░ VISUAL SETTINGS ░░░
// ══════════════════════════════════════════════════════════════════════════════

grpVis = "Visual Settings"
bool showSignals = input.bool(true, "Show Entry Signals", group=grpVis)
bool drawMAs = input.bool(true, "Draw Moving Averages", group=grpVis)
bool fillBackground = input.bool(true, "Fill Background", group=grpVis)
bool showDashboard = input.bool(true, "Show Dashboard", group=grpVis)
color bullishCol = input.color(color.green, "Bullish Color", group=grpVis)
color bearishCol = input.color(color.red, "Bearish Color", group=grpVis)
color neutralCol = input.color(color.gray, "Neutral Color", group=grpVis)

// ══════════════════════════════════════════════════════════════════════════════
// ░░░ CALCULATIONS ░░░
// ══════════════════════════════════════════════════════════════════════════════

// --- Moving Averages ---
ma(src, len, type) =>
    switch type
        "EMA" => ta.ema(src, len)
        "SMA" => ta.sma(src, len)
        "WMA" => ta.wma(src, len)
        "VWMA" => ta.vwma(src, len)
        => ta.ema(src, len)

float fastMA = ma(close, fastLen, maType)
float slowMA = ma(close, slowLen, maType)
float rsiVal = ta.rsi(close, rsiLen)

// --- Trend Alignment ---
bool fastUp = fastMA > fastMA[3]
bool fastDn = fastMA < fastMA[3]
bool slowUp = slowMA > slowMA[3]
bool slowDn = slowMA < slowMA[3]

bool bullAlign = fastMA > slowMA and fastUp and slowUp
bool bearAlign = fastMA < slowMA and fastDn and slowDn

// --- Consolidation Detection ---
float maDistPct = (math.abs(fastMA - slowMA) / close) * 100
float rangeHi = ta.highest(high, rangeBarCount)
float rangeLo = ta.lowest(low, rangeBarCount)
float rangeMovePct = ((rangeHi - rangeLo) / rangeLo) * 100

bool isChop = maDistPct < consolEMAPct or rangeMovePct < consolMaxMovePct

// --- Pullback Detection ---
bool pullbackLong = bullAlign and close < fastMA and close > slowMA
bool pullbackShort = bearAlign and close > fastMA and close < slowMA

// --- Volume & Momentum ---
float avgVol = ta.sma(volume, volumePeriod)
bool volConfirm = volume > avgVol

float bodySize = math.abs(close - open)
float avgBody = ta.sma(bodySize, 3)
bool strongBody = bodySize > avgBody * momentumBodyMult

bool breakPrevHigh = close > high[1]
bool breakPrevLow = close < low[1]

// --- Market State ---
string mktState = isChop ? "CONSOLIDATION" : bullAlign ? "BULLISH" : bearAlign ? "BEARISH" : "NEUTRAL"

// ══════════════════════════════════════════════════════════════════════════════
// ░░░ OPENING RANGE BREAKOUT LOGIC ░░░
// ══════════════════════════════════════════════════════════════════════════════

bool inORB = not na(time(timeframe.period, orbSession, "America/New_York"))
bool inSession = not na(time(timeframe.period, tradingSession, "America/New_York"))

var float orbHigh = na
var float orbLow = na
var bool orbComplete = false
var int orbBarStart = na
var int orbDayKey = na

// Reset ORB on new day
if dayofweek != orbDayKey
    orbHigh := na
    orbLow := na
    orbComplete := false
    orbBarStart := na
    orbDayKey := dayofweek

// Build ORB range during session
if inORB and orbEnabled
    orbHigh := na(orbHigh) ? high : math.max(orbHigh, high)
    orbLow := na(orbLow) ? low : math.min(orbLow, low)
    if na(orbBarStart)
        orbBarStart := bar_index
    if not na(orbHigh) and not na(orbLow)
        orbComplete := true

// Track ORB breakout direction
var int orbBreakDir = 0  // 0=none, 1=bullish, -1=bearish
var int orbBreakBar = na

bool crossAboveORBHigh = ta.crossover(close, orbHigh)
bool crossBelowORBLow = ta.crossunder(close, orbLow)

if orbComplete and not inORB and orbEnabled
    if crossAboveORBHigh and orbBreakDir == 0
        orbBreakDir := 1
        orbBreakBar := bar_index
    if crossBelowORBLow and orbBreakDir == 0
        orbBreakDir := -1
        orbBreakBar := bar_index

// Reset breakout direction on new day
if dayofweek != dayofweek[1]
    orbBreakDir := 0
    orbBreakBar := na

// Calculate bars since ORB breakout
int barsSinceBreak = na(orbBreakBar) ? 999 : bar_index - orbBreakBar
bool inRetestWindow = barsSinceBreak <= maxBarsRetest

// ORB Retest Detection
float retestTolAmt = (orbHigh - orbLow) * (orbRetestTol / 100)

bool orbRetestLong = orbBreakDir == 1 and inRetestWindow and 
 low <= orbHigh + retestTolAmt and low >= orbHigh - retestTolAmt

bool orbRetestShort = orbBreakDir == -1 and inRetestWindow and 
 high >= orbLow - retestTolAmt and high <= orbLow + retestTolAmt

// ORB Midline
var float orbMid = na
if orbComplete
    orbMid := math.avg(orbHigh, orbLow)

// ══════════════════════════════════════════════════════════════════════════════
// ░░░ ORB VISUALIZATION ░░░
// ══════════════════════════════════════════════════════════════════════════════

var box orbBox = na
var line orbHighLine = na
var line orbLowLine = na
var line orbMidLine = na
var label orbMidLabel = na

bool canDrawORB = not na(orbBarStart) and (last_bar_index - orbBarStart) < 450

if orbComplete and not inORB and inORB[1] and showORBLines and orbEnabled and canDrawORB
    orbBox := box.new(orbBarStart, orbHigh, bar_index, orbLow, 
     border_color=color.new(color.purple, 50), bgcolor=color.new(color.purple, 90), border_width=1)
    orbHighLine := line.new(bar_index, orbHigh, bar_index + 100, orbHigh, 
     color=color.new(color.green, 40), style=line.style_dashed, width=2)
    orbLowLine := line.new(bar_index, orbLow, bar_index + 100, orbLow, 
     color=color.new(color.red, 40), style=line.style_dashed, width=2)
    orbMidLine := line.new(bar_index, orbMid, bar_index + 200, orbMid, 
     color=color.new(color.purple, 30), style=line.style_dotted, width=1)
    orbMidLabel := label.new(bar_index + 205, orbMid, "ORB 50%", 
     style=label.style_none, textcolor=color.purple, size=size.tiny)

if orbComplete and not na(orbHighLine) and showORBLines
    line.set_x2(orbHighLine, bar_index + 1)
    line.set_x2(orbLowLine, bar_index + 1)
    if not na(orbMidLine)
        line.set_x2(orbMidLine, bar_index + 1)
        label.set_x(orbMidLabel, bar_index + 5)

// ══════════════════════════════════════════════════════════════════════════════
// ░░░ SUPPLY & DEMAND ZONES ░░░
// ══════════════════════════════════════════════════════════════════════════════

float pivHi = ta.pivothigh(high, pivotLeft, pivotRight)
float pivLo = ta.pivotlow(low, pivotLeft, pivotRight)
float tickSize = syminfo.mintick
float zoneHeight = zoneHeightTicks * tickSize

var box[] supplyBoxes = array.new_box()
var box[] demandBoxes = array.new_box()
var label[] supplyLabels = array.new_label()
var label[] demandLabels = array.new_label()

int maxBoxLookback = 450
bool canDrawBox = (last_bar_index - bar_index) < maxBoxLookback

// Create Supply Zone (Resistance)
if not na(pivHi) and showSDZones and bar_index > pivotRight and canDrawBox
    int leftBar = bar_index - pivotRight
    int rightBar = bar_index + 50
    float zTop = pivHi
    float zBot = pivHi - zoneHeight
    
    box newBox = box.new(leftBar, zTop, rightBar, zBot, 
     border_color=color.new(color.red, 50), bgcolor=supplyColor, border_width=1)
    array.push(supplyBoxes, newBox)
    
    if showZoneLabels
        label newLbl = label.new(leftBar, zTop, "SUPPLY", 
         style=label.style_label_down, color=color.new(color.red, 30), 
         textcolor=color.white, size=size.tiny)
        array.push(supplyLabels, newLbl)
    
    if array.size(supplyBoxes) > maxLevels
        box.delete(array.shift(supplyBoxes))
        if array.size(supplyLabels) > 0
            label.delete(array.shift(supplyLabels))

// Create Demand Zone (Support)
if not na(pivLo) and showSDZones and bar_index > pivotRight and canDrawBox
    int leftBar = bar_index - pivotRight
    int rightBar = bar_index + 50
    float zBot = pivLo
    float zTop = pivLo + zoneHeight
    
    box newBox = box.new(leftBar, zTop, rightBar, zBot, 
     border_color=color.new(color.blue, 50), bgcolor=demandColor, border_width=1)
    array.push(demandBoxes, newBox)
    
    if showZoneLabels
        label newLbl = label.new(leftBar, zBot, "DEMAND", 
         style=label.style_label_up, color=color.new(color.blue, 30), 
         textcolor=color.white, size=size.tiny)
        array.push(demandLabels, newLbl)
    
    if array.size(demandBoxes) > maxLevels
        box.delete(array.shift(demandBoxes))
        if array.size(demandLabels) > 0
            label.delete(array.shift(demandLabels))

// Cleanup broken zones
if showSDZones and array.size(supplyBoxes) > 0
    for i = array.size(supplyBoxes) - 1 to 0
        box b = array.get(supplyBoxes, i)
        if close > box.get_top(b)
            box.set_bgcolor(b, color.new(color.red, 95))
            box.delete(b)
            array.remove(supplyBoxes, i)
            if i < array.size(supplyLabels)
                label.delete(array.get(supplyLabels, i))
                array.remove(supplyLabels, i)

if showSDZones and array.size(demandBoxes) > 0
    for i = array.size(demandBoxes) - 1 to 0
        box b = array.get(demandBoxes, i)
        if close < box.get_bottom(b)
            box.set_bgcolor(b, color.new(color.blue, 95))
            box.delete(b)
            array.remove(demandBoxes, i)
            if i < array.size(demandLabels)
                label.delete(array.get(demandLabels, i))
                array.remove(demandLabels, i)

// ══════════════════════════════════════════════════════════════════════════════
// ░░░ ENTRY SIGNAL LOGIC ░░░
// ══════════════════════════════════════════════════════════════════════════════

// Base entry conditions
bool longBase = bullAlign and not isChop and close > fastMA and volConfirm and strongBody
bool shortBase = bearAlign and not isChop and close < fastMA and volConfirm and strongBody

// Momentum entries
bool longMomo = bullAlign and close > fastMA and strongBody and breakPrevHigh and not isChop
bool shortMomo = bearAlign and close < fastMA and strongBody and breakPrevLow and not isChop

// Pullback entries
bool longPullbackEntry = pullbackLong[1] and close > fastMA and not isChop
bool shortPullbackEntry = pullbackShort[1] and close < fastMA and not isChop

// ORB retest entries
bool longRetestEntry = orbRetestLong and bullAlign and not isChop
bool shortRetestEntry = orbRetestShort and bearAlign and not isChop

// Combine all long signals
bool longSignal = (longBase or longMomo or longPullbackEntry or longRetestEntry) and showSignals and inSession

// Combine all short signals
bool shortSignal = (shortBase or shortMomo or shortPullbackEntry or shortRetestEntry) and showSignals and inSession

// Apply ORB momentum gate
if blockCounterTrend and orbEnabled and orbComplete and barsSinceBreak <= orbHoldBars
    if orbBreakDir == 1
        shortSignal := false  // Block shorts during bullish ORB breakout
    if orbBreakDir == -1
        longSignal := false   // Block longs during bearish ORB breakout

// Block signals during consolidation
if isChop
    longSignal := false
    shortSignal := false

// Prevent duplicate signals
longSignal := longSignal and not longSignal[1]
shortSignal := shortSignal and not shortSignal[1]

// ══════════════════════════════════════════════════════════════════════════════
// ░░░ TARGET & STOP CALCULATION ░░░
// ══════════════════════════════════════════════════════════════════════════════

float atrVal = ta.atr(14)

var float longTarget = na
var float longStop = na
var float shortTarget = na
var float shortStop = na

if longSignal
    longStop := close - atrVal * stopFactor
    longTarget := close + atrVal * profitFactor
    shortTarget := na
    shortStop := na

if shortSignal
    shortStop := close + atrVal * stopFactor
    shortTarget := close - atrVal * profitFactor
    longTarget := na
    longStop := na

// ══════════════════════════════════════════════════════════════════════════════
// ░░░ VISUALIZATION ░░░
// ══════════════════════════════════════════════════════════════════════════════

// Plot Moving Averages
plot(drawMAs ? fastMA : na, "Fast MA", color=color.blue, linewidth=2)
plot(drawMAs ? slowMA : na, "Slow MA", color=color.orange, linewidth=2)

// Background Color
color bgCol = isChop ? color.new(neutralCol, 92) : 
 bullAlign ? color.new(bullishCol, 94) : 
 bearAlign ? color.new(bearishCol, 94) : 
 color.new(neutralCol, 96)

bgcolor(fillBackground ? bgCol : na, title="Trend Background")

// Pullback bar coloring
barcolor(pullbackLong ? color.new(color.orange, 40) : 
 pullbackShort ? color.new(color.orange, 40) : na)

// ══════════════════════════════════════════════════════════════════════════════
// ░░░ ENTRY SIGNAL LABELS ░░░
// ══════════════════════════════════════════════════════════════════════════════

if longSignal
    label.new(bar_index, low, "LONG\nENTRY", 
     style=label.style_label_up, color=bullishCol, textcolor=color.white, size=size.normal)
    
    label.new(bar_index, longTarget, "TARGET\n" + str.tostring(longTarget, format.mintick), 
     style=label.style_label_left, color=color.new(bullishCol, 30), 
     textcolor=color.white, size=size.small)
    
    label.new(bar_index, longStop, "STOP\n" + str.tostring(longStop, format.mintick), 
     style=label.style_label_left, color=color.new(bearishCol, 30), 
     textcolor=color.white, size=size.small)

if shortSignal
    label.new(bar_index, high, "SHORT\nENTRY", 
     style=label.style_label_down, color=bearishCol, textcolor=color.white, size=size.normal)
    
    label.new(bar_index, shortTarget, "TARGET\n" + str.tostring(shortTarget, format.mintick), 
     style=label.style_label_left, color=color.new(bullishCol, 30), 
     textcolor=color.white, size=size.small)
    
    label.new(bar_index, shortStop, "STOP\n" + str.tostring(shortStop, format.mintick), 
     style=label.style_label_left, color=color.new(bearishCol, 30), 
     textcolor=color.white, size=size.small)

// Pullback zone labels
if pullbackLong and not pullbackLong[1]
    label.new(bar_index, low, "PULLBACK", 
     style=label.style_label_up, color=color.new(color.orange, 40), 
     textcolor=color.white, size=size.small)

if pullbackShort and not pullbackShort[1]
    label.new(bar_index, high, "PULLBACK", 
     style=label.style_label_down, color=color.new(color.orange, 40), 
     textcolor=color.white, size=size.small)

// ORB retest labels
if orbRetestLong and showSignals
    label.new(bar_index, low, "ORB RETEST", 
     style=label.style_label_up, color=color.new(color.purple, 30), 
     textcolor=color.white, size=size.small)

if orbRetestShort and showSignals
    label.new(bar_index, high, "ORB RETEST", 
     style=label.style_label_down, color=color.new(color.purple, 30), 
     textcolor=color.white, size=size.small)

// Consolidation warning
if isChop and not isChop[1]
    label.new(bar_index, high, "CHOP", 
     style=label.style_label_down, color=color.gray, textcolor=color.white, size=size.small)

// ══════════════════════════════════════════════════════════════════════════════
// ░░░ DASHBOARD ░░░
// ══════════════════════════════════════════════════════════════════════════════

var table dash = table.new(position.top_right, 2, 8, 
 bgcolor=color.new(color.black, 85), border_width=2, border_color=color.gray)

if barstate.islast and showDashboard
    // Header
    table.cell(dash, 0, 0, "RetailBeastFX", text_color=color.white, 
     text_size=size.normal, bgcolor=color.new(color.blue, 50))
    table.merge_cells(dash, 0, 0, 1, 0)
    
    // Market State
    color stCol = isChop ? neutralCol : bullAlign ? bullishCol : bearAlign ? bearishCol : neutralCol
    table.cell(dash, 0, 1, "Market", text_color=color.white, text_size=size.small)
    table.cell(dash, 1, 1, mktState, text_color=stCol, text_size=size.small)
    
    // Trend Alignment
    string trendTxt = bullAlign ? "BULLISH ↑" : bearAlign ? "BEARISH ↓" : "NEUTRAL →"
    color trendCol = bullAlign ? bullishCol : bearAlign ? bearishCol : neutralCol
    table.cell(dash, 0, 2, "Trend", text_color=color.white, text_size=size.small)
    table.cell(dash, 1, 2, trendTxt, text_color=trendCol, text_size=size.small)
    
    // RSI
    color rsiCol = rsiVal > rsiOB ? bearishCol : rsiVal < rsiOS ? bullishCol : neutralCol
    string rsiLabel = rsiVal > rsiOB ? "OB" : rsiVal < rsiOS ? "OS" : "NEUTRAL"
    table.cell(dash, 0, 3, "RSI", text_color=color.white, text_size=size.small)
    table.cell(dash, 1, 3, str.tostring(rsiVal, "#.0") + " (" + rsiLabel + ")", 
     text_color=rsiCol, text_size=size.small)
    
    // ORB Status
    string orbTxt = not orbEnabled ? "DISABLED" : 
     not orbComplete ? "BUILDING" : 
     orbBreakDir == 1 ? "LONG BREAKOUT" : 
     orbBreakDir == -1 ? "SHORT BREAKOUT" : 
     "RANGING"
    color orbCol = orbBreakDir == 1 ? bullishCol : 
     orbBreakDir == -1 ? bearishCol : neutralCol
    table.cell(dash, 0, 4, "ORB", text_color=color.white, text_size=size.small)
    table.cell(dash, 1, 4, orbTxt, text_color=orbCol, text_size=size.small)
    
    // Volume Status
    string volTxt = volConfirm ? "HIGH ✓" : "LOW"
    color volCol = volConfirm ? bullishCol : neutralCol
    table.cell(dash, 0, 5, "Volume", text_color=color.white, text_size=size.small)
    table.cell(dash, 1, 5, volTxt, text_color=volCol, text_size=size.small)
    
    // Active Zones
    string zonesTxt = str.tostring(array.size(supplyBoxes)) + " Supply / " + 
     str.tostring(array.size(demandBoxes)) + " Demand"
    table.cell(dash, 0, 6, "S/D Zones", text_color=color.white, text_size=size.small)
    table.cell(dash, 1, 6, zonesTxt, text_color=color.aqua, text_size=size.small)
    
    // Session Status
    string sessionTxt = inSession ? "ACTIVE ✓" : "CLOSED"
    color sessionCol = inSession ? bullishCol : neutralCol
    table.cell(dash, 0, 7, "Session", text_color=color.white, text_size=size.small)
    table.cell(dash, 1, 7, sessionTxt, text_color=sessionCol, text_size=size.small)

// ══════════════════════════════════════════════════════════════════════════════
// ░░░ ALERTS ░░░
// ══════════════════════════════════════════════════════════════════════════════

alertcondition(longSignal, title="Long Entry", message="RetailBeastFX: LONG Entry Signal")
alertcondition(shortSignal, title="Short Entry", message="RetailBeastFX: SHORT Entry Signal")
alertcondition(isChop and not isChop[1], title="Consolidation Alert", message="RetailBeastFX: Market Consolidating - Avoid Entries")
alertcondition(orbRetestLong or orbRetestShort, title="ORB Retest", message="RetailBeastFX: ORB Retest Opportunity")`;

export default function Protocol() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(pineScriptCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-black text-gray-200 selection:bg-beast-green selection:text-black">
            <Header />

            <main className="pt-24 pb-20">
                <div className="container mx-auto px-4 max-w-5xl">

                    {/* HERO SECTION */}
                    <div className="text-center mb-16 space-y-6">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-beast-green/10 border border-beast-green/20 text-beast-green text-sm font-bold tracking-wider mb-4 animate-fade-in">
                            NOW AVAILABLE
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold heading-cyber bg-clip-text text-transparent bg-gradient-to-r from-beast-green via-white to-beast-green/50 mb-6 drop-shadow-[0_0_15px_rgba(32,194,14,0.3)]">
                            RetailBeastFX Protocol
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            The professional-grade trend & momentum system previously sold for <span className="text-red-400 line-through decoration-2">$2,400/year</span>.
                            <br />
                            <span className="text-beast-green font-bold glow-text">Yours for $0.</span>
                        </p>
                    </div>

                    {/* ACTION GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">

                        {/* LEFT: DOWNLOADS */}
                        <div className="glass p-8 rounded-2xl border border-gray-800 hover:border-beast-green/30 transition-all duration-300">
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <span className="text-beast-green">Wait a minute...</span>
                                <span>What is this?</span>
                            </h3>
                            <p className="text-gray-400 mb-6 leading-relaxed">
                                This isn't a "free trial." This is the full, unlocked source code of a premium trading system.
                                Same signals. Same logic. Same edge.
                            </p>

                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">Included Documentation</h4>

                                <a href="/protocol/RetailBeastFX_Quick_Start.md" download className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-beast-green/50 hover:bg-beast-green/5 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                        </div>
                                        <div>
                                            <div className="font-bold text-white group-hover:text-beast-green transition-colors">Quick Start Guide</div>
                                            <div className="text-xs text-gray-500">Installation, Signals, & Setup</div>
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                </a>

                                <a href="/protocol/RetailBeastFX_Technical_Breakdown.md" download className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-beast-green/50 hover:bg-beast-green/5 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                        </div>
                                        <div>
                                            <div className="font-bold text-white group-hover:text-beast-green transition-colors">Technical Breakdown</div>
                                            <div className="text-xs text-gray-500">Deep dive into the 5 core components</div>
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                </a>

                                <a href="/protocol/AEP_vs_RetailBeastFX_Comparison.md" download className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-beast-green/50 hover:bg-beast-green/5 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                                        </div>
                                        <div>
                                            <div className="font-bold text-white group-hover:text-beast-green transition-colors">Reality Check Comparison</div>
                                            <div className="text-xs text-gray-500">Marketing vs. Math</div>
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                </a>

                            </div>
                        </div>

                        {/* RIGHT: CODE PREVIEW */}
                        <div className="glass rounded-xl border border-gray-800 overflow-hidden flex flex-col h-[500px]">
                            <div className="bg-gray-900 px-4 py-3 flex items-center justify-between border-b border-gray-800">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                    <span className="ml-2 text-xs text-gray-500 font-mono">RetailBeastFX_Protocol.pine</span>
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${copied ? 'bg-beast-green text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                                >
                                    {copied ? 'COPIED!' : 'COPY CODE'}
                                </button>
                            </div>
                            <div className="flex-1 overflow-auto bg-[#0d1117] p-4 font-mono text-xs text-gray-400">
                                <pre>
                                    <code>{pineScriptCode}</code>
                                </pre>
                            </div>
                        </div>

                    </div>

                    {/* FEATURES SECTION */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold text-center mb-12">The <span className="text-beast-green glow-text">Edge</span> You've Been Looking For</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 rounded-2xl bg-gray-900/40 border border-gray-800 hover:border-beast-green/30 transition-colors">
                                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                </div>
                                <h4 className="text-xl font-bold text-white mb-2">Trend Filtration</h4>
                                <p className="text-gray-400 text-sm">Automated 9/30 EMA filtering ensures you never trade against the dominant market force.</p>
                            </div>

                            <div className="p-6 rounded-2xl bg-gray-900/40 border border-gray-800 hover:border-beast-green/30 transition-colors">
                                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <h4 className="text-xl font-bold text-white mb-2">ORB Breakouts</h4>
                                <p className="text-gray-400 text-sm">Captures the explosive volatility of the NY Session Open (09:30 AM EST) with clear retest entries.</p>
                            </div>

                            <div className="p-6 rounded-2xl bg-gray-900/40 border border-gray-800 hover:border-beast-green/30 transition-colors">
                                <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 mb-4">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                                </div>
                                <h4 className="text-xl font-bold text-white mb-2">Chop Prevention</h4>
                                <p className="text-gray-400 text-sm">Advanced consolidation detection keeps you OUT of low-probability, ranging markets.</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center pb-12">
                        <p className="text-gray-500 mb-4">Ready to upgrade your trading?</p>
                        <button
                            onClick={handleCopy}
                            className="btn-glow px-8 py-4 text-lg font-bold"
                        >
                            COPY THE CODE NOW
                        </button>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}
