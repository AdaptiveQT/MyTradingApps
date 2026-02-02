//+------------------------------------------------------------------+
//|                             RetailBeastFX_Ultimate_EA_v3.mq5     |
//|                                   Copyright 2025, RetailBeastFX  |
//|                                       https://retailbeastfx.com  |
//+------------------------------------------------------------------+
#property copyright "Copyright 2025, RetailBeastFX"
#property link      "https://retailbeastfx.com"
#property version   "3.00"
#property description "ULTIMATE EA v3 - History Maker Edition"
#property description "Partial Profits + Break-Even + Dynamic Sizing + Streak Logic"

#include <Trade\Trade.mqh>
#include <Trade\PositionInfo.mqh>
#include <Trade\AccountInfo.mqh>

//+------------------------------------------------------------------+
//| INPUT PARAMETERS                                                  |
//+------------------------------------------------------------------+
// Strategy Settings
input ENUM_TIMEFRAMES InpTimeframe = PERIOD_M15;       // Entry Timeframe
input ENUM_TIMEFRAMES InpHTFTimeframe = PERIOD_H1;     // HTF Confirmation Timeframe
input int      InpADXPeriod = 14;                      // ADX Period
input int      InpADXThreshold = 30;                   // ADX Trend Threshold
input int      InpRSIPeriod = 2;                       // RSI Period
input int      InpRSIOversold = 10;                    // RSI Oversold
input int      InpRSIOverbought = 90;                  // RSI Overbought
input int      InpBBPeriod = 20;                       // Bollinger Band Period
input double   InpBBDeviation = 2.0;                   // BB Deviation

// EMA Settings
input int      InpEMAFast = 8;                         // Fast EMA Period
input int      InpEMASlow = 21;                        // Slow EMA Period
input int      InpEMATrend = 200;                      // Trend EMA Period

// Risk Management - Core
input double   InpBaseRiskPercent = 1.0;               // Base Risk % Per Trade
input double   InpATRMultSL = 2.5;                     // ATR x Stop Loss
input double   InpATRMultTP = 5.0;                     // ATR x Take Profit
input int      InpATRPeriod = 14;                      // ATR Period
input bool     InpSafeMode = true;                     // Safe Mode (Half Lot)
input double   InpMaxDailyLossPercent = 3.0;           // Max Daily Loss %
input int      InpMaxTradesPerDay = 3;                 // Max Trades Per Day

// PARTIAL PROFIT SYSTEM
input bool     InpUsePartialProfit = true;             // Use Partial Profit Taking
input double   InpPartialPercent = 50.0;               // % to Close at First Target
input double   InpPartialTPMultiplier = 1.0;           // First TP at X:1 R:R
input bool     InpMoveToBreakeven = true;              // Move SL to Break-Even After Partial

// DYNAMIC LOT SIZING
input bool     InpUseDynamicLots = true;               // Use Streak-Based Lot Sizing
input double   InpWinStreakMultiplier = 1.25;          // Lot Multiplier Per Win (max 2x)
input double   InpLossStreakReducer = 0.75;            // Lot Reducer Per Loss (min 0.5x)
input int      InpMaxWinStreak = 3;                    // Max Wins to Apply Multiplier
input int      InpMaxLossStreak = 2;                   // Max Losses to Apply Reducer

// SPREAD FILTER
input bool     InpUseSpreadFilter = true;              // Filter High Spread
input double   InpMaxSpreadATR = 0.5;                  // Max Spread as % of ATR

// TRAILING STOP
input bool     InpUseTrailingStop = true;              // Use Trailing Stop
input double   InpTrailStartATR = 1.5;                 // Start Trail at X ATR Profit
input double   InpTrailDistanceATR = 1.0;              // Trail Distance in ATR

// Smart Filters
input bool     InpRequireHTFConfirm = true;            // Require HTF Confirmation
input bool     InpAllowShorts = true;                  // Allow Short Trades
input int      InpCooldownBars = 5;                    // Bars After Loss Cooldown
input int      InpMinConfluence = 2;                   // Min Confluence Score

// Session Filter
input bool     InpUseKillzones = true;                 // Trade Only In Killzones
input int      InpLondonStart = 3;                     // London Start (EST)
input int      InpLondonEnd = 6;                       // London End (EST)
input int      InpNYStart = 8;                         // NY Start (EST)
input int      InpNYEnd = 11;                          // NY End (EST)

// General
input ulong    InpMagicNumber = 20250109;              // Magic Number
input string   InpComment = "RBFXv3";                  // Trade Comment

//+------------------------------------------------------------------+
//| GLOBAL VARIABLES                                                  |
//+------------------------------------------------------------------+
CTrade         trade;
CPositionInfo  posInfo;
CAccountInfo   accInfo;

// Indicator handles - Entry TF
int handleADX, handleRSI, handleBB, handleATR;
int handleEMAFast, handleEMASlow, handleEMATrend;

// Indicator handles - HTF
int handleHTF_EMA50, handleHTF_EMA200, handleHTF_ADX;

// Tracking
double dailyStartBalance = 0;
int    tradesOpenedToday = 0;
int    lastTradeDay = 0;
int    lastLossBar = 0;
int    currentWinStreak = 0;
int    currentLossStreak = 0;
bool   lastTradeWasLoss = false;

// Partial profit tracking
struct PositionData {
   ulong  ticket;
   double originalLots;
   bool   partialTaken;
   double partialTPLevel;
   double originalSL;
};
PositionData trackedPositions[];

// Strategy types
enum STRATEGY_TYPE {
   STRAT_TREND_FOLLOWING,
   STRAT_MEAN_REVERSION,
   STRAT_BREAKOUT,
   STRAT_ORIGINAL,
   STRAT_NONE
};

//+------------------------------------------------------------------+
//| Tier-based lot sizing                                             |
//+------------------------------------------------------------------+
double GetTierLotSize(double balance) {
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

string GetTierName(double balance) {
   if(balance >= 5000)       return "LEGEND";
   else if(balance >= 2500)  return "ELITE";
   else if(balance >= 1000)  return "MASTERY";
   else if(balance >= 500)   return "ADVANCED";
   else if(balance >= 250)   return "EXPANSION";
   else if(balance >= 100)   return "GROWTH";
   else if(balance >= 50)    return "SCALING";
   else if(balance >= 20)    return "BUILDING";
   else                      return "SURVIVAL";
}

//+------------------------------------------------------------------+
//| Expert initialization function                                     |
//+------------------------------------------------------------------+
int OnInit() {
   trade.SetExpertMagicNumber(InpMagicNumber);
   trade.SetTypeFilling(ORDER_FILLING_IOC);
   trade.SetDeviationInPoints(10);
   
   // Initialize Entry TF indicators
   handleADX = iADX(_Symbol, InpTimeframe, InpADXPeriod);
   handleRSI = iRSI(_Symbol, InpTimeframe, InpRSIPeriod, PRICE_CLOSE);
   handleBB = iBands(_Symbol, InpTimeframe, InpBBPeriod, 0, InpBBDeviation, PRICE_CLOSE);
   handleATR = iATR(_Symbol, InpTimeframe, InpATRPeriod);
   handleEMAFast = iMA(_Symbol, InpTimeframe, InpEMAFast, 0, MODE_EMA, PRICE_CLOSE);
   handleEMASlow = iMA(_Symbol, InpTimeframe, InpEMASlow, 0, MODE_EMA, PRICE_CLOSE);
   handleEMATrend = iMA(_Symbol, InpTimeframe, InpEMATrend, 0, MODE_EMA, PRICE_CLOSE);
   
   // Initialize HTF indicators
   handleHTF_EMA50 = iMA(_Symbol, InpHTFTimeframe, 50, 0, MODE_EMA, PRICE_CLOSE);
   handleHTF_EMA200 = iMA(_Symbol, InpHTFTimeframe, 200, 0, MODE_EMA, PRICE_CLOSE);
   handleHTF_ADX = iADX(_Symbol, InpHTFTimeframe, 14);
   
   if(handleADX == INVALID_HANDLE || handleRSI == INVALID_HANDLE || 
      handleBB == INVALID_HANDLE || handleATR == INVALID_HANDLE ||
      handleEMAFast == INVALID_HANDLE || handleEMASlow == INVALID_HANDLE ||
      handleEMATrend == INVALID_HANDLE || handleHTF_EMA50 == INVALID_HANDLE ||
      handleHTF_EMA200 == INVALID_HANDLE || handleHTF_ADX == INVALID_HANDLE) {
      Print("Error creating indicators!");
      return INIT_FAILED;
   }
   
   dailyStartBalance = accInfo.Balance();
   MqlDateTime dt;
   TimeToStruct(TimeCurrent(), dt);
   lastTradeDay = dt.day;
   
   Print("╔═══════════════════════════════════════════╗");
   Print("║  RETAILBEASTFX ULTIMATE EA v3             ║");
   Print("║  History Maker Edition                    ║");
   Print("╠═══════════════════════════════════════════╣");
   Print("║  Balance: $", DoubleToString(accInfo.Balance(), 2));
   Print("║  Tier: ", GetTierName(accInfo.Balance()));
   Print("║  Lot Size: ", DoubleToString(CalculateLotSize(), 2));
   Print("║  Partial Profits: ", InpUsePartialProfit ? "ON" : "OFF");
   Print("║  Dynamic Lots: ", InpUseDynamicLots ? "ON" : "OFF");
   Print("║  Spread Filter: ", InpUseSpreadFilter ? "ON" : "OFF");
   Print("╚═══════════════════════════════════════════╝");
   
   return INIT_SUCCEEDED;
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                   |
//+------------------------------------------------------------------+
void OnDeinit(const int reason) {
   IndicatorRelease(handleADX);
   IndicatorRelease(handleRSI);
   IndicatorRelease(handleBB);
   IndicatorRelease(handleATR);
   IndicatorRelease(handleEMAFast);
   IndicatorRelease(handleEMASlow);
   IndicatorRelease(handleEMATrend);
   IndicatorRelease(handleHTF_EMA50);
   IndicatorRelease(handleHTF_EMA200);
   IndicatorRelease(handleHTF_ADX);
}

//+------------------------------------------------------------------+
//| OnTrade - Track closed trades for streak                          |
//+------------------------------------------------------------------+
void OnTrade() {
   static int lastDealsTotal = 0;
   int currentDealsTotal = HistoryDealsTotal();
   
   if(currentDealsTotal > lastDealsTotal) {
      // Check last deal
      HistorySelect(0, TimeCurrent());
      ulong lastDealTicket = HistoryDealGetTicket(HistoryDealsTotal() - 1);
      
      if(lastDealTicket > 0) {
         double profit = HistoryDealGetDouble(lastDealTicket, DEAL_PROFIT);
         long magic = HistoryDealGetInteger(lastDealTicket, DEAL_MAGIC);
         long entry = HistoryDealGetInteger(lastDealTicket, DEAL_ENTRY);
         
         if(magic == InpMagicNumber && entry == DEAL_ENTRY_OUT) {
            if(profit > 0) {
               currentWinStreak++;
               currentLossStreak = 0;
               lastTradeWasLoss = false;
               Print("WIN! Streak: +", currentWinStreak);
            }
            else if(profit < 0) {
               currentLossStreak++;
               currentWinStreak = 0;
               lastTradeWasLoss = true;
               Print("LOSS. Streak: -", currentLossStreak);
            }
         }
      }
   }
   lastDealsTotal = currentDealsTotal;
}

//+------------------------------------------------------------------+
//| Expert tick function                                               |
//+------------------------------------------------------------------+
void OnTick() {
   // Manage partial profits
   if(InpUsePartialProfit) {
      ManagePartialProfits();
   }
   
   // Manage trailing stop
   if(InpUseTrailingStop) {
      ManageTrailingStop();
   }
   
   // Reset daily counters
   MqlDateTime dt;
   TimeToStruct(TimeCurrent(), dt);
   if(dt.day != lastTradeDay) {
      dailyStartBalance = accInfo.Balance();
      tradesOpenedToday = 0;
      lastTradeDay = dt.day;
      lastTradeWasLoss = false;
   }
   
   // Check new bar
   static datetime lastBarTime = 0;
   datetime currentBarTime = iTime(_Symbol, InpTimeframe, 0);
   if(lastBarTime == currentBarTime) return;
   lastBarTime = currentBarTime;
   
   static int barCounter = 0;
   barCounter++;
   
   // Daily limits check
   if(!CheckDailyLimits()) return;
   
   // Loss cooldown
   if(lastTradeWasLoss && (barCounter - lastLossBar) < InpCooldownBars) return;
   
   // Session filter
   if(InpUseKillzones && !IsInKillzone()) return;
   
   // Already in position
   if(HasOpenPosition()) return;
   
   // Spread filter
   if(InpUseSpreadFilter && !CheckSpread()) return;
   
   // Get bias and regime
   int htfBias = GetHTFBias();
   STRATEGY_TYPE activeStrategy = DetectMarketRegime();
   
   if(activeStrategy == STRAT_NONE) return;
   
   int signal = GenerateSignal(activeStrategy);
   
   // HTF confirmation
   if(InpRequireHTFConfirm && signal != 0) {
      if(signal == 1 && htfBias != 1) return;
      if(signal == -1 && htfBias != -1) return;
   }
   
   // Short filter
   if(signal == -1 && !InpAllowShorts) return;
   
   // Confluence check
   int confluence = CalculateConfluence(signal);
   if(confluence < InpMinConfluence) return;
   
   if(signal != 0) {
      ExecuteTrade(signal, activeStrategy, confluence);
      lastLossBar = barCounter;
   }
}

//+------------------------------------------------------------------+
//| CHECK SPREAD                                                       |
//+------------------------------------------------------------------+
bool CheckSpread() {
   double atr[];
   ArraySetAsSeries(atr, true);
   CopyBuffer(handleATR, 0, 0, 3, atr);
   
   long spreadPoints = SymbolInfoInteger(_Symbol, SYMBOL_SPREAD);
   double spread = spreadPoints * _Point;
   double maxSpread = atr[1] * InpMaxSpreadATR;
   
   if(spread > maxSpread) {
      Comment("Spread too high: ", DoubleToString(spread/_Point, 1), " > ", DoubleToString(maxSpread/_Point, 1));
      return false;
   }
   return true;
}

//+------------------------------------------------------------------+
//| MANAGE PARTIAL PROFITS                                             |
//+------------------------------------------------------------------+
void ManagePartialProfits() {
   for(int i = PositionsTotal() - 1; i >= 0; i--) {
      if(!posInfo.SelectByIndex(i)) continue;
      if(posInfo.Symbol() != _Symbol || posInfo.Magic() != InpMagicNumber) continue;
      
      ulong ticket = posInfo.Ticket();
      double openPrice = posInfo.PriceOpen();
      double currentPrice = posInfo.PriceCurrent();
      double currentSL = posInfo.StopLoss();
      double currentTP = posInfo.TakeProfit();
      double currentLots = posInfo.Volume();
      
      // Check if already tracked
      int idx = FindTrackedPosition(ticket);
      if(idx < 0) {
         // New position - add to tracking
         idx = ArraySize(trackedPositions);
         ArrayResize(trackedPositions, idx + 1);
         trackedPositions[idx].ticket = ticket;
         trackedPositions[idx].originalLots = currentLots;
         trackedPositions[idx].partialTaken = false;
         trackedPositions[idx].originalSL = currentSL;
         
         // Calculate partial TP level (1:1 R:R)
         double slDistance = MathAbs(openPrice - currentSL);
         if(posInfo.PositionType() == POSITION_TYPE_BUY) {
            trackedPositions[idx].partialTPLevel = openPrice + (slDistance * InpPartialTPMultiplier);
         } else {
            trackedPositions[idx].partialTPLevel = openPrice - (slDistance * InpPartialTPMultiplier);
         }
         continue;
      }
      
      // Check if partial already taken
      if(trackedPositions[idx].partialTaken) continue;
      
      // Check if price reached partial TP level
      bool reachedPartialTP = false;
      if(posInfo.PositionType() == POSITION_TYPE_BUY) {
         reachedPartialTP = currentPrice >= trackedPositions[idx].partialTPLevel;
      } else {
         reachedPartialTP = currentPrice <= trackedPositions[idx].partialTPLevel;
      }
      
      if(reachedPartialTP) {
         // Close partial
         double lotsToClose = NormalizeDouble(trackedPositions[idx].originalLots * (InpPartialPercent / 100.0), 2);
         double minLot = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
         lotsToClose = MathMax(minLot, lotsToClose);
         
         // Ensure we leave at least min lot
         if(currentLots - lotsToClose < minLot) {
            lotsToClose = currentLots - minLot;
         }
         
         if(lotsToClose >= minLot) {
            if(trade.PositionClosePartial(ticket, lotsToClose)) {
               Print("PARTIAL PROFIT taken: ", lotsToClose, " lots at ", DoubleToString(currentPrice, _Digits));
               trackedPositions[idx].partialTaken = true;
               
               // Move to break-even
               if(InpMoveToBreakeven) {
                  long spreadPts = SymbolInfoInteger(_Symbol, SYMBOL_SPREAD);
                  double spreadVal = spreadPts * _Point;
                  double bePrice = openPrice;
                  if(posInfo.PositionType() == POSITION_TYPE_BUY) {
                     bePrice = openPrice + spreadVal + _Point;
                  } else {
                     bePrice = openPrice - spreadVal - _Point;
                  }
                  
                  if(trade.PositionModify(ticket, NormalizeDouble(bePrice, _Digits), currentTP)) {
                     Print("Moved to BREAK-EVEN at ", DoubleToString(bePrice, _Digits));
                  }
               }
            }
         }
      }
   }
   
   // Clean up closed positions from tracking
   CleanTrackedPositions();
}

//+------------------------------------------------------------------+
//| FIND TRACKED POSITION                                              |
//+------------------------------------------------------------------+
int FindTrackedPosition(ulong ticket) {
   for(int i = 0; i < ArraySize(trackedPositions); i++) {
      if(trackedPositions[i].ticket == ticket) return i;
   }
   return -1;
}

//+------------------------------------------------------------------+
//| CLEAN TRACKED POSITIONS                                            |
//+------------------------------------------------------------------+
void CleanTrackedPositions() {
   for(int i = ArraySize(trackedPositions) - 1; i >= 0; i--) {
      bool found = false;
      for(int j = PositionsTotal() - 1; j >= 0; j--) {
         if(posInfo.SelectByIndex(j)) {
            if(posInfo.Ticket() == trackedPositions[i].ticket) {
               found = true;
               break;
            }
         }
      }
      if(!found) {
         // Remove from array
         for(int k = i; k < ArraySize(trackedPositions) - 1; k++) {
            trackedPositions[k] = trackedPositions[k + 1];
         }
         ArrayResize(trackedPositions, ArraySize(trackedPositions) - 1);
      }
   }
}

//+------------------------------------------------------------------+
//| GET HTF BIAS                                                       |
//+------------------------------------------------------------------+
int GetHTFBias() {
   double htfEMA50[], htfEMA200[], htfADX[];
   ArraySetAsSeries(htfEMA50, true);
   ArraySetAsSeries(htfEMA200, true);
   ArraySetAsSeries(htfADX, true);
   
   CopyBuffer(handleHTF_EMA50, 0, 0, 3, htfEMA50);
   CopyBuffer(handleHTF_EMA200, 0, 0, 3, htfEMA200);
   CopyBuffer(handleHTF_ADX, 0, 0, 3, htfADX);
   
   bool htfBullish = htfEMA50[1] > htfEMA200[1];
   bool htfBearish = htfEMA50[1] < htfEMA200[1];
   bool htfTrending = htfADX[1] >= 20;
   
   if(htfBullish && htfTrending) return 1;
   if(htfBearish && htfTrending) return -1;
   return 0;
}

//+------------------------------------------------------------------+
//| CALCULATE CONFLUENCE                                               |
//+------------------------------------------------------------------+
int CalculateConfluence(int signal) {
   int score = 0;
   
   double emaFast[], emaSlow[], emaTrend[], rsi[], closeArr[];
   ArraySetAsSeries(emaFast, true);
   ArraySetAsSeries(emaSlow, true);
   ArraySetAsSeries(emaTrend, true);
   ArraySetAsSeries(rsi, true);
   ArraySetAsSeries(closeArr, true);
   
   CopyBuffer(handleEMAFast, 0, 0, 3, emaFast);
   CopyBuffer(handleEMASlow, 0, 0, 3, emaSlow);
   CopyBuffer(handleEMATrend, 0, 0, 3, emaTrend);
   CopyBuffer(handleRSI, 0, 0, 3, rsi);
   CopyClose(_Symbol, InpTimeframe, 0, 3, closeArr);
   
   if(signal == 1) {
      if(emaFast[1] > emaSlow[1]) score++;
      if(closeArr[1] > emaTrend[1]) score++;
      if(rsi[1] < 50) score++;
      if(GetHTFBias() == 1) score++;
   }
   else if(signal == -1) {
      if(emaFast[1] < emaSlow[1]) score++;
      if(closeArr[1] < emaTrend[1]) score++;
      if(rsi[1] > 50) score++;
      if(GetHTFBias() == -1) score++;
   }
   
   return score;
}

//+------------------------------------------------------------------+
//| DETECT MARKET REGIME                                               |
//+------------------------------------------------------------------+
STRATEGY_TYPE DetectMarketRegime() {
   double adx[], bbUpper[], bbLower[], bbMiddle[];
   ArraySetAsSeries(adx, true);
   ArraySetAsSeries(bbUpper, true);
   ArraySetAsSeries(bbLower, true);
   ArraySetAsSeries(bbMiddle, true);
   
   CopyBuffer(handleADX, 0, 0, 3, adx);
   CopyBuffer(handleBB, 1, 0, 21, bbUpper);
   CopyBuffer(handleBB, 2, 0, 21, bbLower);
   CopyBuffer(handleBB, 0, 0, 21, bbMiddle);
   
   double currentADX = adx[1];
   
   double bbWidth = 0;
   if(bbMiddle[1] != 0) bbWidth = (bbUpper[1] - bbLower[1]) / bbMiddle[1];
   
   double avgWidth = 0;
   for(int i = 1; i <= 20; i++) {
      if(bbMiddle[i] != 0) avgWidth += (bbUpper[i] - bbLower[i]) / bbMiddle[i];
   }
   avgWidth /= 20;
   
   bool isTrending = currentADX >= InpADXThreshold;
   bool isRanging = currentADX < 20;
   bool isVolatile = bbWidth > avgWidth * 1.5;
   bool isSqueeze = bbWidth < avgWidth * 0.8;
   
   string streakInfo = " [W:" + IntegerToString(currentWinStreak) + " L:" + IntegerToString(currentLossStreak) + "]";
   
   if(isTrending) {
      Comment("TRENDING (ADX:", DoubleToString(currentADX,1), ")", streakInfo);
      return STRAT_TREND_FOLLOWING;
   }
   else if(isRanging && !isVolatile) {
      Comment("RANGING (ADX:", DoubleToString(currentADX,1), ")", streakInfo);
      return STRAT_MEAN_REVERSION;
   }
   else if(isSqueeze) {
      Comment("SQUEEZE", streakInfo);
      return STRAT_BREAKOUT;
   }
   else if(currentADX >= 15) {
      Comment("MILD TREND", streakInfo);
      return STRAT_ORIGINAL;
   }
   else {
      Comment("CHOPPY - NO TRADE", streakInfo);
      return STRAT_NONE;
   }
}

//+------------------------------------------------------------------+
//| GENERATE SIGNAL                                                    |
//+------------------------------------------------------------------+
int GenerateSignal(STRATEGY_TYPE strategy) {
   double emaFast[], emaSlow[], emaTrend[], rsi[];
   double bbUpper[], bbLower[], bbMiddle[];
   double closeArr[], highArr[], lowArr[];
   
   ArraySetAsSeries(emaFast, true);
   ArraySetAsSeries(emaSlow, true);
   ArraySetAsSeries(emaTrend, true);
   ArraySetAsSeries(rsi, true);
   ArraySetAsSeries(bbUpper, true);
   ArraySetAsSeries(bbLower, true);
   ArraySetAsSeries(bbMiddle, true);
   ArraySetAsSeries(closeArr, true);
   ArraySetAsSeries(highArr, true);
   ArraySetAsSeries(lowArr, true);
   
   CopyBuffer(handleEMAFast, 0, 0, 5, emaFast);
   CopyBuffer(handleEMASlow, 0, 0, 5, emaSlow);
   CopyBuffer(handleEMATrend, 0, 0, 5, emaTrend);
   CopyBuffer(handleRSI, 0, 0, 5, rsi);
   CopyBuffer(handleBB, 1, 0, 5, bbUpper);
   CopyBuffer(handleBB, 2, 0, 5, bbLower);
   CopyBuffer(handleBB, 0, 0, 5, bbMiddle);
   CopyClose(_Symbol, InpTimeframe, 0, 5, closeArr);
   CopyHigh(_Symbol, InpTimeframe, 0, 5, highArr);
   CopyLow(_Symbol, InpTimeframe, 0, 5, lowArr);
   
   bool bullTrend = emaFast[1] > emaSlow[1];
   bool bearTrend = emaFast[1] < emaSlow[1];
   bool aboveEMA200 = closeArr[1] > emaTrend[1];
   bool belowEMA200 = closeArr[1] < emaTrend[1];
   bool bullishCandle = closeArr[1] > closeArr[2];
   bool bearishCandle = closeArr[1] < closeArr[2];
   
   switch(strategy) {
      case STRAT_TREND_FOLLOWING:
         if(closeArr[2] < emaTrend[2] && closeArr[1] > emaTrend[1] && bullishCandle) return 1;
         if(closeArr[2] > emaTrend[2] && closeArr[1] < emaTrend[1] && bearishCandle) return -1;
         break;
      case STRAT_MEAN_REVERSION:
         if(rsi[1] < InpRSIOversold && aboveEMA200 && bullishCandle && lowArr[1] <= bbLower[1]) return 1;
         if(rsi[1] > InpRSIOverbought && belowEMA200 && bearishCandle && highArr[1] >= bbUpper[1]) return -1;
         break;
      case STRAT_BREAKOUT:
         if(closeArr[1] > bbUpper[1] && closeArr[2] <= bbUpper[2] && bullTrend) return 1;
         if(closeArr[1] < bbLower[1] && closeArr[2] >= bbLower[2] && bearTrend) return -1;
         break;
      case STRAT_ORIGINAL:
         if(lowArr[1] <= bbLower[1] && closeArr[1] > closeArr[2] && bullTrend && aboveEMA200) return 1;
         if(highArr[1] >= bbUpper[1] && closeArr[1] < closeArr[2] && bearTrend && belowEMA200) return -1;
         break;
      default: break;
   }
   
   return 0;
}

//+------------------------------------------------------------------+
//| EXECUTE TRADE                                                      |
//+------------------------------------------------------------------+
void ExecuteTrade(int signal, STRATEGY_TYPE strategy, int confluence) {
   double atr[];
   ArraySetAsSeries(atr, true);
   CopyBuffer(handleATR, 0, 0, 3, atr);
   
   double currentATR = atr[1];
   double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
   double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   
   double slDistance = currentATR * InpATRMultSL;
   double tpDistance = currentATR * InpATRMultTP;
   
   double lotSize = CalculateLotSize();
   
   string strategyName = "";
   switch(strategy) {
      case STRAT_TREND_FOLLOWING: strategyName = "TRD"; break;
      case STRAT_MEAN_REVERSION: strategyName = "MRV"; break;
      case STRAT_BREAKOUT: strategyName = "BRK"; break;
      case STRAT_ORIGINAL: strategyName = "ORI"; break;
      default: strategyName = "UNK"; break;
   }
   
   string comment = InpComment + "_" + strategyName + "_C" + IntegerToString(confluence);
   
   if(signal == 1) {
      double sl = NormalizeDouble(ask - slDistance, _Digits);
      double tp = NormalizeDouble(ask + tpDistance, _Digits);
      
      if(trade.Buy(lotSize, _Symbol, ask, sl, tp, comment)) {
         tradesOpenedToday++;
         Print("▲ BUY [", strategyName, "] Conf:", confluence, " Lots:", lotSize);
      }
   }
   else if(signal == -1) {
      double sl = NormalizeDouble(bid + slDistance, _Digits);
      double tp = NormalizeDouble(bid - tpDistance, _Digits);
      
      if(trade.Sell(lotSize, _Symbol, bid, sl, tp, comment)) {
         tradesOpenedToday++;
         Print("▼ SELL [", strategyName, "] Conf:", confluence, " Lots:", lotSize);
      }
   }
}

//+------------------------------------------------------------------+
//| MANAGE TRAILING STOP                                               |
//+------------------------------------------------------------------+
void ManageTrailingStop() {
   double atr[];
   ArraySetAsSeries(atr, true);
   CopyBuffer(handleATR, 0, 0, 3, atr);
   double currentATR = atr[1];
   
   for(int i = PositionsTotal() - 1; i >= 0; i--) {
      if(!posInfo.SelectByIndex(i)) continue;
      if(posInfo.Symbol() != _Symbol || posInfo.Magic() != InpMagicNumber) continue;
      
      double openPrice = posInfo.PriceOpen();
      double currentSL = posInfo.StopLoss();
      double currentTP = posInfo.TakeProfit();
      double currentPrice = posInfo.PriceCurrent();
      
      double trailStartDistance = currentATR * InpTrailStartATR;
      double trailDistance = currentATR * InpTrailDistanceATR;
      
      if(posInfo.PositionType() == POSITION_TYPE_BUY) {
         double profit = currentPrice - openPrice;
         if(profit >= trailStartDistance) {
            double newSL = NormalizeDouble(currentPrice - trailDistance, _Digits);
            if(newSL > currentSL) {
               trade.PositionModify(posInfo.Ticket(), newSL, currentTP);
            }
         }
      }
      else {
         double profit = openPrice - currentPrice;
         if(profit >= trailStartDistance) {
            double newSL = NormalizeDouble(currentPrice + trailDistance, _Digits);
            if(newSL < currentSL || currentSL == 0) {
               trade.PositionModify(posInfo.Ticket(), newSL, currentTP);
            }
         }
      }
   }
}

//+------------------------------------------------------------------+
//| CALCULATE LOT SIZE (Dynamic + Tier-Based)                         |
//+------------------------------------------------------------------+
double CalculateLotSize() {
   double balance = accInfo.Balance();
   double baseLot = GetTierLotSize(balance);
   
   // Safe mode
   if(InpSafeMode) baseLot *= 0.5;
   
   // Dynamic lot sizing based on streak
   if(InpUseDynamicLots) {
      double multiplier = 1.0;
      
      if(currentWinStreak > 0) {
         int streakToApply = MathMin(currentWinStreak, InpMaxWinStreak);
         multiplier = MathPow(InpWinStreakMultiplier, streakToApply);
         multiplier = MathMin(multiplier, 2.0); // Cap at 2x
      }
      else if(currentLossStreak > 0) {
         int streakToApply = MathMin(currentLossStreak, InpMaxLossStreak);
         multiplier = MathPow(InpLossStreakReducer, streakToApply);
         multiplier = MathMax(multiplier, 0.5); // Floor at 0.5x
      }
      
      baseLot *= multiplier;
   }
   
   // Normalize
   double minLot = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
   double maxLot = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MAX);
   double lotStep = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP);
   
   baseLot = MathMax(minLot, baseLot);
   baseLot = MathMin(maxLot, baseLot);
   baseLot = NormalizeDouble(MathFloor(baseLot / lotStep) * lotStep, 2);
   
   return baseLot;
}

//+------------------------------------------------------------------+
//| CHECK DAILY LIMITS                                                 |
//+------------------------------------------------------------------+
bool CheckDailyLimits() {
   if(tradesOpenedToday >= InpMaxTradesPerDay) return false;
   
   double dailyLoss = dailyStartBalance - accInfo.Balance();
   double maxLoss = dailyStartBalance * (InpMaxDailyLossPercent / 100.0);
   
   if(dailyLoss >= maxLoss) return false;
   
   return true;
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
//| CHECK IF HAS OPEN POSITION                                         |
//+------------------------------------------------------------------+
bool HasOpenPosition() {
   for(int i = PositionsTotal() - 1; i >= 0; i--) {
      if(posInfo.SelectByIndex(i)) {
         if(posInfo.Symbol() == _Symbol && posInfo.Magic() == InpMagicNumber) return true;
      }
   }
   return false;
}
//+------------------------------------------------------------------+
