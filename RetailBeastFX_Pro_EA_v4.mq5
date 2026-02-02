//+------------------------------------------------------------------+
//|                               RetailBeastFX_Pro_EA_v4.mq5        |
//|                                   Copyright 2025, RetailBeastFX  |
//|                                       https://retailbeastfx.com  |
//+------------------------------------------------------------------+
#property copyright "Copyright 2025, RetailBeastFX"
#property link      "https://retailbeastfx.com"
#property version   "4.00"
#property description "PRO EA v4 - Prop Firm Ready + Multi-Symbol"
#property description "FTMO/MFF/TFT Compliant Drawdown Rules"

#include <Trade\Trade.mqh>
#include <Trade\PositionInfo.mqh>
#include <Trade\AccountInfo.mqh>

//+------------------------------------------------------------------+
//| INPUT PARAMETERS                                                  |
//+------------------------------------------------------------------+
// === PROP FIRM SETTINGS ===
input bool     InpPropFirmMode = true;                 // Enable Prop Firm Mode
input double   InpMaxTotalDrawdown = 10.0;             // Max Total Drawdown % (FTMO: 10%)
input double   InpMaxDailyDrawdown = 5.0;              // Max Daily Drawdown % (FTMO: 5%)
input double   InpProfitTarget = 10.0;                 // Profit Target % (FTMO Phase 1: 10%)
input bool     InpScaleAfterProfit = true;             // Scale Down After Profit Target
input double   InpMinBalanceForStrictDD = 1000.0;      // Min Balance for Strict DD Rules

// === MULTI-SYMBOL ===
input string   InpSymbols = "EURUSD,GBPUSD,USDJPY";    // Symbols to Trade (comma separated)
input bool     InpTradeAllSymbols = false;             // Trade All Visible Symbols
input int      InpMaxPositionsTotal = 3;               // Max Total Open Positions

// === STRATEGY SETTINGS ===
input ENUM_TIMEFRAMES InpTimeframe = PERIOD_M15;       // Entry Timeframe
input ENUM_TIMEFRAMES InpHTFTimeframe = PERIOD_H1;     // HTF Confirmation
input int      InpADXPeriod = 14;                      // ADX Period
input int      InpADXThreshold = 30;                   // ADX Trend Threshold
input int      InpRSIPeriod = 2;                       // RSI Period
input int      InpRSIOversold = 10;                    // RSI Oversold
input int      InpRSIOverbought = 90;                  // RSI Overbought
input int      InpBBPeriod = 20;                       // Bollinger Band Period
input double   InpBBDeviation = 2.0;                   // BB Deviation

// === EMA SETTINGS ===
input int      InpEMAFast = 8;                         // Fast EMA
input int      InpEMASlow = 21;                        // Slow EMA
input int      InpEMATrend = 200;                      // Trend EMA

// === RISK MANAGEMENT ===
input double   InpRiskPercent = 0.5;                   // Risk % Per Trade (Conservative for Prop)
input double   InpATRMultSL = 2.5;                     // ATR x Stop Loss
input double   InpATRMultTP = 5.0;                     // ATR x Take Profit
input int      InpATRPeriod = 14;                      // ATR Period
input int      InpMaxTradesPerDay = 2;                 // Max Trades Per Day (Per Symbol)

// === PARTIAL PROFITS ===
input bool     InpUsePartialProfit = true;             // Use Partial Profits
input double   InpPartialPercent = 50.0;               // % to Close at 1:1
input bool     InpMoveToBreakeven = true;              // Move to BE After Partial

// === TRAILING STOP ===
input bool     InpUseTrailingStop = true;              // Use Trailing Stop
input double   InpTrailStartATR = 1.5;                 // Trail Start at X ATR
input double   InpTrailDistanceATR = 1.0;              // Trail Distance in ATR

// === SESSION FILTER ===
input bool     InpUseKillzones = true;                 // Trade Only In Killzones
input int      InpLondonStart = 3;                     // London Start (EST)
input int      InpLondonEnd = 6;                       // London End (EST)
input int      InpNYStart = 8;                         // NY Start (EST)
input int      InpNYEnd = 11;                          // NY End (EST)

// === FILTERS ===
input bool     InpRequireHTFConfirm = true;            // Require HTF Confirmation
input int      InpCooldownBars = 5;                    // Cooldown After Loss
input int      InpMinConfluence = 2;                   // Min Confluence Score

// === GENERAL ===
input ulong    InpMagicNumber = 20250109;              // Magic Number
input string   InpComment = "RBFXv4";                  // Trade Comment

//+------------------------------------------------------------------+
//| GLOBAL VARIABLES                                                  |
//+------------------------------------------------------------------+
CTrade         trade;
CPositionInfo  posInfo;
CAccountInfo   accInfo;

// Prop Firm Tracking
double initialBalance = 0;
double dailyStartBalance = 0;
double highWaterMark = 0;
int    lastTradeDay = 0;
bool   drawdownBreached = false;
bool   profitTargetReached = false;

// Symbol tracking
string tradingSymbols[];
int    symbolCount = 0;
int    tradesOpenedToday[];

// Strategy types
enum STRATEGY_TYPE {
   STRAT_TREND_FOLLOWING,
   STRAT_MEAN_REVERSION,
   STRAT_BREAKOUT,
   STRAT_ORIGINAL,
   STRAT_NONE
};

//+------------------------------------------------------------------+
//| Get Tier Lot Size                                                  |
//+------------------------------------------------------------------+
double GetTierLotSize(double balance) {
   // For prop firms, use conservative fixed % based on account
   if(InpPropFirmMode) {
      // Risk 0.5% of account per trade
      return NormalizeDouble(balance * 0.005 / 100, 2);
   }
   
   double baseLot = 0.01;
   if(balance >= 5000)       baseLot = 5.00;
   else if(balance >= 2500)  baseLot = 2.50;
   else if(balance >= 1000)  baseLot = 1.00;
   else if(balance >= 500)   baseLot = 0.50;
   else if(balance >= 250)   baseLot = 0.25;
   else if(balance >= 100)   baseLot = 0.10;
   else if(balance >= 50)    baseLot = 0.05;
   else if(balance >= 20)    baseLot = 0.02;
   else                      baseLot = 0.01;
   
   return baseLot;
}

//+------------------------------------------------------------------+
//| Parse Symbols String                                               |
//+------------------------------------------------------------------+
void ParseSymbols() {
   string symbols = InpSymbols;
   StringReplace(symbols, " ", "");
   
   string parts[];
   int count = StringSplit(symbols, ',', parts);
   
   ArrayResize(tradingSymbols, count);
   ArrayResize(tradesOpenedToday, count);
   
   symbolCount = 0;
   for(int i = 0; i < count; i++) {
      if(SymbolSelect(parts[i], true)) {
         tradingSymbols[symbolCount] = parts[i];
         tradesOpenedToday[symbolCount] = 0;
         symbolCount++;
      }
   }
   
   ArrayResize(tradingSymbols, symbolCount);
   ArrayResize(tradesOpenedToday, symbolCount);
}

//+------------------------------------------------------------------+
//| Find Symbol Index                                                  |
//+------------------------------------------------------------------+
int FindSymbolIndex(string symbol) {
   for(int i = 0; i < symbolCount; i++) {
      if(tradingSymbols[i] == symbol) return i;
   }
   return -1;
}

//+------------------------------------------------------------------+
//| Expert initialization function                                     |
//+------------------------------------------------------------------+
int OnInit() {
   trade.SetExpertMagicNumber(InpMagicNumber);
   trade.SetTypeFilling(ORDER_FILLING_IOC);
   trade.SetDeviationInPoints(10);
   
   // Parse trading symbols
   ParseSymbols();
   
   // Initialize prop firm tracking
   initialBalance = accInfo.Balance();
   dailyStartBalance = initialBalance;
   highWaterMark = initialBalance;
   
   MqlDateTime dt;
   TimeToStruct(TimeCurrent(), dt);
   lastTradeDay = dt.day;
   
   Print("╔═══════════════════════════════════════════════╗");
   Print("║  RETAILBEASTFX PRO EA v4                      ║");
   Print("║  Prop Firm Ready Edition                      ║");
   Print("╠═══════════════════════════════════════════════╣");
   Print("║  Balance: $", DoubleToString(accInfo.Balance(), 2));
   Print("║  Prop Firm Mode: ", InpPropFirmMode ? "ON" : "OFF");
   if(InpPropFirmMode) {
      Print("║  Max Daily DD: ", InpMaxDailyDrawdown, "%");
      Print("║  Max Total DD: ", InpMaxTotalDrawdown, "%");
      Print("║  Profit Target: ", InpProfitTarget, "%");
   }
   Print("║  Symbols: ", InpSymbols);
   Print("║  Symbol Count: ", symbolCount);
   Print("╚═══════════════════════════════════════════════╝");
   
   if(symbolCount == 0) {
      Print("ERROR: No valid symbols found!");
      return INIT_FAILED;
   }
   
   return INIT_SUCCEEDED;
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                   |
//+------------------------------------------------------------------+
void OnDeinit(const int reason) {
   Print("RetailBeastFX Pro EA v4 stopped.");
}

//+------------------------------------------------------------------+
//| Expert tick function                                               |
//+------------------------------------------------------------------+
void OnTick() {
   // Check prop firm status first
   if(InpPropFirmMode) {
      CheckPropFirmStatus();
      if(drawdownBreached) {
         Comment("⛔ DRAWDOWN BREACHED - Trading Halted");
         return;
      }
      if(profitTargetReached && InpScaleAfterProfit) {
         Comment("🎯 PROFIT TARGET REACHED - Reducing Risk");
      }
   }
   
   // Reset daily counters
   MqlDateTime dt;
   TimeToStruct(TimeCurrent(), dt);
   if(dt.day != lastTradeDay) {
      dailyStartBalance = accInfo.Balance();
      lastTradeDay = dt.day;
      for(int i = 0; i < symbolCount; i++) {
         tradesOpenedToday[i] = 0;
      }
   }
   
   // Process each symbol
   for(int s = 0; s < symbolCount; s++) {
      ProcessSymbol(tradingSymbols[s], s);
   }
}

//+------------------------------------------------------------------+
//| CHECK PROP FIRM STATUS                                             |
//+------------------------------------------------------------------+
void CheckPropFirmStatus() {
   double currentBalance = accInfo.Balance();
   double currentEquity = accInfo.Equity();
   
   // Update high water mark
   if(currentBalance > highWaterMark) {
      highWaterMark = currentBalance;
   }
   
   // Calculate drawdowns
   double totalDrawdown = ((initialBalance - currentEquity) / initialBalance) * 100;
   double dailyDrawdown = ((dailyStartBalance - currentEquity) / dailyStartBalance) * 100;
   double profitPercent = ((currentBalance - initialBalance) / initialBalance) * 100;
   
   // Use relaxed limits for small accounts (under threshold)
   double maxDailyDD = InpMaxDailyDrawdown;
   double maxTotalDD = InpMaxTotalDrawdown;
   bool isSmallAccount = initialBalance < InpMinBalanceForStrictDD;
   
   if(isSmallAccount) {
      // Relaxed limits for testing with small accounts
      maxDailyDD = 20.0;  // 20% daily for small accounts
      maxTotalDD = 40.0;  // 40% total for small accounts
   }
   
   // Check daily drawdown
   if(dailyDrawdown >= maxDailyDD) {
      Print("⛔ DAILY DRAWDOWN LIMIT BREACHED: ", DoubleToString(dailyDrawdown, 2), "%");
      drawdownBreached = true;
      CloseAllPositions();
   }
   
   // Check total drawdown
   if(totalDrawdown >= maxTotalDD) {
      Print("⛔ TOTAL DRAWDOWN LIMIT BREACHED: ", DoubleToString(totalDrawdown, 2), "%");
      drawdownBreached = true;
      CloseAllPositions();
   }
   
   // Check profit target
   if(profitPercent >= InpProfitTarget) {
      if(!profitTargetReached) {
         Print("🎯 PROFIT TARGET REACHED: ", DoubleToString(profitPercent, 2), "%");
         profitTargetReached = true;
      }
   }
   
   // Display status
   string accountMode = isSmallAccount ? "TEST MODE" : "PROP FIRM";
   string status = accountMode + " | ";
   status += "Daily DD: " + DoubleToString(dailyDrawdown, 2) + "/" + DoubleToString(maxDailyDD, 1) + "% | ";
   status += "Total DD: " + DoubleToString(totalDrawdown, 2) + "/" + DoubleToString(maxTotalDD, 1) + "% | ";
   status += "Profit: " + DoubleToString(profitPercent, 2) + "/" + DoubleToString(InpProfitTarget, 1) + "%";
   Comment(status);
}

//+------------------------------------------------------------------+
//| CLOSE ALL POSITIONS                                                |
//+------------------------------------------------------------------+
void CloseAllPositions() {
   for(int i = PositionsTotal() - 1; i >= 0; i--) {
      if(posInfo.SelectByIndex(i)) {
         if(posInfo.Magic() == InpMagicNumber) {
            trade.PositionClose(posInfo.Ticket());
         }
      }
   }
}

//+------------------------------------------------------------------+
//| PROCESS SYMBOL                                                     |
//+------------------------------------------------------------------+
void ProcessSymbol(string symbol, int symbolIndex) {
   // Check new bar for this symbol
   static datetime lastBarTime[];
   if(ArraySize(lastBarTime) < symbolCount) {
      ArrayResize(lastBarTime, symbolCount);
      ArrayInitialize(lastBarTime, 0);
   }
   
   datetime currentBarTime = iTime(symbol, InpTimeframe, 0);
   if(lastBarTime[symbolIndex] == currentBarTime) return;
   lastBarTime[symbolIndex] = currentBarTime;
   
   // Check max trades per day
   if(tradesOpenedToday[symbolIndex] >= InpMaxTradesPerDay) return;
   
   // Check total open positions
   if(CountTotalPositions() >= InpMaxPositionsTotal) return;
   
   // Check killzone
   if(InpUseKillzones && !IsInKillzone()) return;
   
   // Check if already in position on this symbol
   if(HasPositionOnSymbol(symbol)) return;
   
   // Get indicators for this symbol
   int handleADX = iADX(symbol, InpTimeframe, InpADXPeriod);
   int handleRSI = iRSI(symbol, InpTimeframe, InpRSIPeriod, PRICE_CLOSE);
   int handleBB = iBands(symbol, InpTimeframe, InpBBPeriod, 0, InpBBDeviation, PRICE_CLOSE);
   int handleATR = iATR(symbol, InpTimeframe, InpATRPeriod);
   int handleEMAFast = iMA(symbol, InpTimeframe, InpEMAFast, 0, MODE_EMA, PRICE_CLOSE);
   int handleEMASlow = iMA(symbol, InpTimeframe, InpEMASlow, 0, MODE_EMA, PRICE_CLOSE);
   int handleEMATrend = iMA(symbol, InpTimeframe, InpEMATrend, 0, MODE_EMA, PRICE_CLOSE);
   int handleHTF_EMA50 = iMA(symbol, InpHTFTimeframe, 50, 0, MODE_EMA, PRICE_CLOSE);
   int handleHTF_EMA200 = iMA(symbol, InpHTFTimeframe, 200, 0, MODE_EMA, PRICE_CLOSE);
   
   if(handleADX == INVALID_HANDLE || handleRSI == INVALID_HANDLE) {
      IndicatorRelease(handleADX);
      IndicatorRelease(handleRSI);
      IndicatorRelease(handleBB);
      IndicatorRelease(handleATR);
      IndicatorRelease(handleEMAFast);
      IndicatorRelease(handleEMASlow);
      IndicatorRelease(handleEMATrend);
      IndicatorRelease(handleHTF_EMA50);
      IndicatorRelease(handleHTF_EMA200);
      return;
   }
   
   // Get HTF bias
   double htfEMA50[], htfEMA200[];
   ArraySetAsSeries(htfEMA50, true);
   ArraySetAsSeries(htfEMA200, true);
   CopyBuffer(handleHTF_EMA50, 0, 0, 3, htfEMA50);
   CopyBuffer(handleHTF_EMA200, 0, 0, 3, htfEMA200);
   
   int htfBias = 0;
   if(htfEMA50[1] > htfEMA200[1]) htfBias = 1;
   else if(htfEMA50[1] < htfEMA200[1]) htfBias = -1;
   
   // Detect regime
   double adx[], bbUpper[], bbLower[], bbMiddle[];
   ArraySetAsSeries(adx, true);
   ArraySetAsSeries(bbUpper, true);
   ArraySetAsSeries(bbLower, true);
   ArraySetAsSeries(bbMiddle, true);
   
   CopyBuffer(handleADX, 0, 0, 3, adx);
   CopyBuffer(handleBB, 1, 0, 21, bbUpper);
   CopyBuffer(handleBB, 2, 0, 21, bbLower);
   CopyBuffer(handleBB, 0, 0, 21, bbMiddle);
   
   STRATEGY_TYPE strategy = STRAT_NONE;
   if(adx[1] >= InpADXThreshold) strategy = STRAT_TREND_FOLLOWING;
   else if(adx[1] < 20) strategy = STRAT_MEAN_REVERSION;
   
   if(strategy == STRAT_NONE) {
      IndicatorRelease(handleADX);
      IndicatorRelease(handleRSI);
      IndicatorRelease(handleBB);
      IndicatorRelease(handleATR);
      IndicatorRelease(handleEMAFast);
      IndicatorRelease(handleEMASlow);
      IndicatorRelease(handleEMATrend);
      IndicatorRelease(handleHTF_EMA50);
      IndicatorRelease(handleHTF_EMA200);
      return;
   }
   
   // Get signals
   double emaFast[], emaSlow[], emaTrend[], rsi[], closeArr[];
   ArraySetAsSeries(emaFast, true);
   ArraySetAsSeries(emaSlow, true);
   ArraySetAsSeries(emaTrend, true);
   ArraySetAsSeries(rsi, true);
   ArraySetAsSeries(closeArr, true);
   
   CopyBuffer(handleEMAFast, 0, 0, 5, emaFast);
   CopyBuffer(handleEMASlow, 0, 0, 5, emaSlow);
   CopyBuffer(handleEMATrend, 0, 0, 5, emaTrend);
   CopyBuffer(handleRSI, 0, 0, 5, rsi);
   CopyClose(symbol, InpTimeframe, 0, 5, closeArr);
   
   int signal = 0;
   
   if(strategy == STRAT_TREND_FOLLOWING) {
      if(closeArr[2] < emaTrend[2] && closeArr[1] > emaTrend[1]) signal = 1;
      if(closeArr[2] > emaTrend[2] && closeArr[1] < emaTrend[1]) signal = -1;
   }
   else if(strategy == STRAT_MEAN_REVERSION) {
      if(rsi[1] < InpRSIOversold && closeArr[1] > emaTrend[1]) signal = 1;
      if(rsi[1] > InpRSIOverbought && closeArr[1] < emaTrend[1]) signal = -1;
   }
   
   // HTF confirmation
   if(InpRequireHTFConfirm && signal != 0) {
      if(signal == 1 && htfBias != 1) signal = 0;
      if(signal == -1 && htfBias != -1) signal = 0;
   }
   
   // Execute trade
   if(signal != 0) {
      double atr[];
      ArraySetAsSeries(atr, true);
      CopyBuffer(handleATR, 0, 0, 3, atr);
      
      double currentATR = atr[1];
      int digits = (int)SymbolInfoInteger(symbol, SYMBOL_DIGITS);
      double point = SymbolInfoDouble(symbol, SYMBOL_POINT);
      double ask = SymbolInfoDouble(symbol, SYMBOL_ASK);
      double bid = SymbolInfoDouble(symbol, SYMBOL_BID);
      
      double slDistance = currentATR * InpATRMultSL;
      double tpDistance = currentATR * InpATRMultTP;
      
      double lotSize = CalculateLotSize(symbol);
      
      // Reduce risk if profit target reached
      if(profitTargetReached) {
         lotSize = lotSize * 0.5;
      }
      
      string comment = InpComment + "_" + symbol;
      
      if(signal == 1) {
         double sl = NormalizeDouble(ask - slDistance, digits);
         double tp = NormalizeDouble(ask + tpDistance, digits);
         
         if(trade.Buy(lotSize, symbol, ask, sl, tp, comment)) {
            tradesOpenedToday[symbolIndex]++;
            Print("▲ BUY ", symbol, " Lots:", lotSize);
         }
      }
      else if(signal == -1) {
         double sl = NormalizeDouble(bid + slDistance, digits);
         double tp = NormalizeDouble(bid - tpDistance, digits);
         
         if(trade.Sell(lotSize, symbol, bid, sl, tp, comment)) {
            tradesOpenedToday[symbolIndex]++;
            Print("▼ SELL ", symbol, " Lots:", lotSize);
         }
      }
   }
   
   // Release handles
   IndicatorRelease(handleADX);
   IndicatorRelease(handleRSI);
   IndicatorRelease(handleBB);
   IndicatorRelease(handleATR);
   IndicatorRelease(handleEMAFast);
   IndicatorRelease(handleEMASlow);
   IndicatorRelease(handleEMATrend);
   IndicatorRelease(handleHTF_EMA50);
   IndicatorRelease(handleHTF_EMA200);
}

//+------------------------------------------------------------------+
//| CALCULATE LOT SIZE                                                 |
//+------------------------------------------------------------------+
double CalculateLotSize(string symbol) {
   double balance = accInfo.Balance();
   double baseLot = GetTierLotSize(balance);
   
   double minLot = SymbolInfoDouble(symbol, SYMBOL_VOLUME_MIN);
   double maxLot = SymbolInfoDouble(symbol, SYMBOL_VOLUME_MAX);
   double lotStep = SymbolInfoDouble(symbol, SYMBOL_VOLUME_STEP);
   
   baseLot = MathMax(minLot, baseLot);
   baseLot = MathMin(maxLot, baseLot);
   baseLot = NormalizeDouble(MathFloor(baseLot / lotStep) * lotStep, 2);
   
   return baseLot;
}

//+------------------------------------------------------------------+
//| COUNT TOTAL POSITIONS                                              |
//+------------------------------------------------------------------+
int CountTotalPositions() {
   int count = 0;
   for(int i = PositionsTotal() - 1; i >= 0; i--) {
      if(posInfo.SelectByIndex(i)) {
         if(posInfo.Magic() == InpMagicNumber) {
            count++;
         }
      }
   }
   return count;
}

//+------------------------------------------------------------------+
//| HAS POSITION ON SYMBOL                                             |
//+------------------------------------------------------------------+
bool HasPositionOnSymbol(string symbol) {
   for(int i = PositionsTotal() - 1; i >= 0; i--) {
      if(posInfo.SelectByIndex(i)) {
         if(posInfo.Symbol() == symbol && posInfo.Magic() == InpMagicNumber) {
            return true;
         }
      }
   }
   return false;
}

//+------------------------------------------------------------------+
//| CHECK IF IN KILLZONE                                               |
//+------------------------------------------------------------------+
bool IsInKillzone() {
   MqlDateTime dt;
   TimeToStruct(TimeGMT(), dt);
   int hourEST = (dt.hour - 5 + 24) % 24;
   
   if(hourEST >= InpLondonStart && hourEST < InpLondonEnd) return true;
   if(hourEST >= InpNYStart && hourEST < InpNYEnd) return true;
   
   return false;
}
//+------------------------------------------------------------------+
