//+------------------------------------------------------------------+
//|                               RetailBeastFX_Adaptive_EA_v2.mq5   |
//|                                   Copyright 2025, RetailBeastFX  |
//|                                       https://retailbeastfx.com  |
//+------------------------------------------------------------------+
#property copyright "Copyright 2025, RetailBeastFX"
#property link      "https://retailbeastfx.com"
#property version   "2.00"
#property description "SMART Adaptive EA v2 - Multi-Timeframe Confluence"
#property description "Fixes: MTF confirmation, better short filtering, trailing stop"

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
input int      InpADXThreshold = 30;                   // ADX Trend Threshold (stricter)
input int      InpRSIPeriod = 2;                       // RSI Period (Mean Reversion)
input int      InpRSIOversold = 10;                    // RSI Oversold (stricter)
input int      InpRSIOverbought = 90;                  // RSI Overbought (stricter)
input int      InpBBPeriod = 20;                       // Bollinger Band Period
input double   InpBBDeviation = 2.0;                   // BB Deviation

// EMA Settings
input int      InpEMAFast = 8;                         // Fast EMA Period
input int      InpEMASlow = 21;                        // Slow EMA Period
input int      InpEMATrend = 200;                      // Trend EMA Period

// Risk Management
input double   InpRiskPercent = 1.0;                   // Risk % Per Trade
input double   InpATRMultSL = 2.5;                     // ATR x Stop Loss (wider)
input double   InpATRMultTP = 5.0;                     // ATR x Take Profit
input int      InpATRPeriod = 14;                      // ATR Period
input bool     InpSafeMode = true;                     // Safe Mode (Half Lot Size) - ON by default
input double   InpMaxDailyLossPercent = 3.0;           // Max Daily Loss %
input int      InpMaxTradesPerDay = 3;                 // Max Trades Per Day (reduced)

// Smart Filters
input bool     InpRequireHTFConfirm = true;            // Require HTF Trend Confirmation
input bool     InpAllowShorts = true;                  // Allow Short Trades
input int      InpCooldownBars = 5;                    // Bars to Wait After Loss
input int      InpMinConfluence = 2;                   // Min Confluence Score (1-4)

// Trailing Stop
input bool     InpUseTrailingStop = true;              // Use Trailing Stop
input double   InpTrailStartATR = 1.5;                 // Start Trailing at X ATR Profit
input double   InpTrailDistanceATR = 1.0;              // Trail Distance in ATR

// Session Filter
input bool     InpUseKillzones = true;                 // Trade Only In Killzones
input int      InpLondonStart = 3;                     // London Start Hour (EST)
input int      InpLondonEnd = 6;                       // London End Hour (EST)
input int      InpNYStart = 8;                         // NY Start Hour (EST)
input int      InpNYEnd = 11;                          // NY End Hour (EST)

// General
input ulong    InpMagicNumber = 20250109;              // Magic Number
input string   InpComment = "RBFXv2";                  // Trade Comment

//+------------------------------------------------------------------+
//| GLOBAL VARIABLES                                                  |
//+------------------------------------------------------------------+
CTrade         trade;
CPositionInfo  posInfo;
CAccountInfo   accInfo;

// Indicator handles - Entry TF
int handleADX;
int handleRSI;
int handleBB;
int handleATR;
int handleEMAFast;
int handleEMASlow;
int handleEMATrend;

// Indicator handles - HTF
int handleHTF_EMA50;
int handleHTF_EMA200;
int handleHTF_ADX;

// Daily tracking
double dailyStartBalance = 0;
int    tradesOpenedToday = 0;
int    lastTradeDay = 0;
int    lastLossBar = 0;
bool   lastTradeWasLoss = false;

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
   
   // Initialize HTF indicators for multi-timeframe confirmation
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
   
   // Initialize daily tracking
   dailyStartBalance = accInfo.Balance();
   MqlDateTime dt;
   TimeToStruct(TimeCurrent(), dt);
   lastTradeDay = dt.day;
   tradesOpenedToday = 0;
   
   Print("=== RetailBeastFX SMART Adaptive EA v2 ===");
   Print("Account Balance: $", DoubleToString(accInfo.Balance(), 2));
   Print("Current Tier: ", GetTierName(accInfo.Balance()));
   Print("Lot Size: ", DoubleToString(CalculateLotSize(), 2));
   Print("HTF Confirmation: ", InpRequireHTFConfirm ? "ENABLED" : "DISABLED");
   Print("Trailing Stop: ", InpUseTrailingStop ? "ENABLED" : "DISABLED");
   Print("Safe Mode: ", InpSafeMode ? "ON" : "OFF");
   
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
   
   Print("RetailBeastFX SMART EA v2 deinitialized.");
}

//+------------------------------------------------------------------+
//| Expert tick function                                               |
//+------------------------------------------------------------------+
void OnTick() {
   // Manage trailing stop for open positions
   if(InpUseTrailingStop) {
      ManageTrailingStop();
   }
   
   // Reset daily counters at new day
   MqlDateTime dt;
   TimeToStruct(TimeCurrent(), dt);
   int currentDay = dt.day;
   
   if(currentDay != lastTradeDay) {
      dailyStartBalance = accInfo.Balance();
      tradesOpenedToday = 0;
      lastTradeDay = currentDay;
      lastTradeWasLoss = false;
   }
   
   // Check if new bar
   static datetime lastBarTime = 0;
   datetime currentBarTime = iTime(_Symbol, InpTimeframe, 0);
   if(lastBarTime == currentBarTime) return;
   lastBarTime = currentBarTime;
   
   // Increment bar counter for cooldown
   static int barCounter = 0;
   barCounter++;
   
   // Check daily limits
   if(!CheckDailyLimits()) return;
   
   // Check cooldown after loss
   if(lastTradeWasLoss && (barCounter - lastLossBar) < InpCooldownBars) {
      Comment("Cooldown: ", InpCooldownBars - (barCounter - lastLossBar), " bars remaining");
      return;
   }
   
   // Check session filter
   if(InpUseKillzones && !IsInKillzone()) return;
   
   // Check if already in position
   if(HasOpenPosition()) return;
   
   // Get HTF trend direction
   int htfBias = GetHTFBias();
   
   // Get market regime and generate signals
   STRATEGY_TYPE activeStrategy = DetectMarketRegime();
   
   if(activeStrategy == STRAT_NONE) return;
   
   int signal = GenerateSignal(activeStrategy);
   
   // Check HTF confirmation
   if(InpRequireHTFConfirm && signal != 0) {
      if(signal == 1 && htfBias != 1) {
         Comment("BUY blocked - HTF not bullish");
         return;
      }
      if(signal == -1 && htfBias != -1) {
         Comment("SELL blocked - HTF not bearish");
         return;
      }
   }
   
   // Check if shorts are allowed
   if(signal == -1 && !InpAllowShorts) {
      Comment("SHORT blocked - shorts disabled");
      return;
   }
   
   // Calculate confluence score
   int confluence = CalculateConfluence(signal);
   if(confluence < InpMinConfluence) {
      Comment("Signal blocked - confluence ", confluence, "/", InpMinConfluence);
      return;
   }
   
   if(signal != 0) {
      ExecuteTrade(signal, activeStrategy, confluence);
      lastLossBar = barCounter; // For cooldown tracking
   }
}

//+------------------------------------------------------------------+
//| GET HTF BIAS - Multi-Timeframe Confirmation                       |
//+------------------------------------------------------------------+
int GetHTFBias() {
   double htfEMA50[];
   double htfEMA200[];
   double htfADX[];
   
   ArraySetAsSeries(htfEMA50, true);
   ArraySetAsSeries(htfEMA200, true);
   ArraySetAsSeries(htfADX, true);
   
   CopyBuffer(handleHTF_EMA50, 0, 0, 3, htfEMA50);
   CopyBuffer(handleHTF_EMA200, 0, 0, 3, htfEMA200);
   CopyBuffer(handleHTF_ADX, 0, 0, 3, htfADX);
   
   bool htfBullish = htfEMA50[1] > htfEMA200[1];
   bool htfBearish = htfEMA50[1] < htfEMA200[1];
   bool htfTrending = htfADX[1] >= 20; // Lighter threshold for HTF
   
   if(htfBullish && htfTrending) return 1;   // Bullish
   if(htfBearish && htfTrending) return -1;  // Bearish
   return 0; // Neutral
}

//+------------------------------------------------------------------+
//| CALCULATE CONFLUENCE SCORE                                         |
//+------------------------------------------------------------------+
int CalculateConfluence(int signal) {
   int score = 0;
   
   double emaFast[];
   double emaSlow[];
   double emaTrend[];
   double rsi[];
   double closeArr[];
   
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
   
   if(signal == 1) { // BUY confluence
      if(emaFast[1] > emaSlow[1]) score++;        // EMA trend aligned
      if(closeArr[1] > emaTrend[1]) score++;      // Above 200 EMA
      if(rsi[1] < 50) score++;                     // RSI has room to run
      if(GetHTFBias() == 1) score++;               // HTF bullish
   }
   else if(signal == -1) { // SELL confluence
      if(emaFast[1] < emaSlow[1]) score++;        // EMA trend aligned
      if(closeArr[1] < emaTrend[1]) score++;      // Below 200 EMA
      if(rsi[1] > 50) score++;                     // RSI has room to fall
      if(GetHTFBias() == -1) score++;              // HTF bearish
   }
   
   return score;
}

//+------------------------------------------------------------------+
//| DETECT MARKET REGIME (Adaptive Logic)                             |
//+------------------------------------------------------------------+
STRATEGY_TYPE DetectMarketRegime() {
   double adx[];
   double bbUpper[];
   double bbLower[];
   double bbMiddle[];
   
   ArraySetAsSeries(adx, true);
   ArraySetAsSeries(bbUpper, true);
   ArraySetAsSeries(bbLower, true);
   ArraySetAsSeries(bbMiddle, true);
   
   CopyBuffer(handleADX, 0, 0, 3, adx);
   CopyBuffer(handleBB, 1, 0, 21, bbUpper);
   CopyBuffer(handleBB, 2, 0, 21, bbLower);
   CopyBuffer(handleBB, 0, 0, 21, bbMiddle);
   
   double currentADX = adx[1];
   
   // Calculate BB width percentage
   double bbWidth = 0;
   if(bbMiddle[1] != 0) {
      bbWidth = (bbUpper[1] - bbLower[1]) / bbMiddle[1];
   }
   
   // Calculate average BB width for squeeze detection
   double avgWidth = 0;
   for(int i = 1; i <= 20; i++) {
      if(bbMiddle[i] != 0) {
         avgWidth += (bbUpper[i] - bbLower[i]) / bbMiddle[i];
      }
   }
   avgWidth /= 20;
   
   bool isTrending = currentADX >= InpADXThreshold;
   bool isRanging = currentADX < 20;
   bool isVolatile = bbWidth > avgWidth * 1.5;
   bool isSqueeze = bbWidth < avgWidth * 0.8;
   
   // Stricter regime selection
   if(isTrending) {
      Comment("Regime: TRENDING (ADX: ", DoubleToString(currentADX, 1), ") -> Trend Following");
      return STRAT_TREND_FOLLOWING;
   }
   else if(isRanging && !isVolatile) {
      Comment("Regime: RANGING (ADX: ", DoubleToString(currentADX, 1), ") -> Mean Reversion");
      return STRAT_MEAN_REVERSION;
   }
   else if(isSqueeze) {
      Comment("Regime: SQUEEZE -> Breakout");
      return STRAT_BREAKOUT;
   }
   else if(currentADX >= 15 && currentADX < InpADXThreshold) {
      Comment("Regime: MILD TREND -> Original BB");
      return STRAT_ORIGINAL;
   }
   else {
      Comment("Regime: CHOPPY - No trade");
      return STRAT_NONE; // Don't trade in choppy conditions
   }
}

//+------------------------------------------------------------------+
//| GENERATE SIGNAL                                                    |
//+------------------------------------------------------------------+
int GenerateSignal(STRATEGY_TYPE strategy) {
   double emaFast[];
   double emaSlow[];
   double emaTrend[];
   double rsi[];
   double bbUpper[];
   double bbLower[];
   double bbMiddle[];
   double closeArr[];
   double highArr[];
   double lowArr[];
   
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
         // Cross above/below EMA200 with candle confirmation
         if(closeArr[2] < emaTrend[2] && closeArr[1] > emaTrend[1] && bullishCandle) return 1;
         if(closeArr[2] > emaTrend[2] && closeArr[1] < emaTrend[1] && bearishCandle) return -1;
         break;
         
      case STRAT_MEAN_REVERSION:
         // RSI extremes with trend filter + candle confirmation
         if(rsi[1] < InpRSIOversold && aboveEMA200 && bullishCandle && lowArr[1] <= bbLower[1]) return 1;
         if(rsi[1] > InpRSIOverbought && belowEMA200 && bearishCandle && highArr[1] >= bbUpper[1]) return -1;
         break;
         
      case STRAT_BREAKOUT:
         // BB squeeze breakout with momentum
         if(closeArr[1] > bbUpper[1] && closeArr[2] <= bbUpper[2] && bullTrend) return 1;
         if(closeArr[1] < bbLower[1] && closeArr[2] >= bbLower[2] && bearTrend) return -1;
         break;
         
      case STRAT_ORIGINAL:
         // Original BB bounce with extra confirmation
         if(lowArr[1] <= bbLower[1] && closeArr[1] > closeArr[2] && bullTrend && aboveEMA200) return 1;
         if(highArr[1] >= bbUpper[1] && closeArr[1] < closeArr[2] && bearTrend && belowEMA200) return -1;
         break;
         
      default:
         break;
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
   
   if(signal == 1) { // BUY
      double sl = NormalizeDouble(ask - slDistance, _Digits);
      double tp = NormalizeDouble(ask + tpDistance, _Digits);
      
      if(trade.Buy(lotSize, _Symbol, ask, sl, tp, comment)) {
         tradesOpenedToday++;
         Print("BUY [", strategyName, "] Confluence:", confluence, " Lots:", lotSize, " SL:", sl, " TP:", tp);
      }
   }
   else if(signal == -1) { // SELL
      double sl = NormalizeDouble(bid + slDistance, _Digits);
      double tp = NormalizeDouble(bid - tpDistance, _Digits);
      
      if(trade.Sell(lotSize, _Symbol, bid, sl, tp, comment)) {
         tradesOpenedToday++;
         Print("SELL [", strategyName, "] Confluence:", confluence, " Lots:", lotSize, " SL:", sl, " TP:", tp);
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
      if(posInfo.SelectByIndex(i)) {
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
         else if(posInfo.PositionType() == POSITION_TYPE_SELL) {
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
}

//+------------------------------------------------------------------+
//| CALCULATE LOT SIZE (Tier-Based from Journal)                      |
//+------------------------------------------------------------------+
double CalculateLotSize() {
   double balance = accInfo.Balance();
   double baseLot = GetTierLotSize(balance);
   
   // Apply safe mode (halves lot size)
   if(InpSafeMode) {
      baseLot = baseLot * 0.5;
   }
   
   // Ensure minimum lot
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
   if(tradesOpenedToday >= InpMaxTradesPerDay) {
      Comment("Daily trade limit reached (", InpMaxTradesPerDay, ")");
      return false;
   }
   
   double currentBalance = accInfo.Balance();
   double dailyLoss = dailyStartBalance - currentBalance;
   double maxLossAmount = dailyStartBalance * (InpMaxDailyLossPercent / 100.0);
   
   if(dailyLoss >= maxLossAmount) {
      Comment("Daily loss limit reached ($", DoubleToString(dailyLoss, 2), ")");
      return false;
   }
   
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
         if(posInfo.Symbol() == _Symbol && posInfo.Magic() == InpMagicNumber) {
            return true;
         }
      }
   }
   return false;
}
//+------------------------------------------------------------------+
