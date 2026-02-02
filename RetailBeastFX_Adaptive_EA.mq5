//+------------------------------------------------------------------+
//|                                    RetailBeastFX_Adaptive_EA.mq5 |
//|                                   Copyright 2025, RetailBeastFX  |
//|                                       https://retailbeastfx.com  |
//+------------------------------------------------------------------+
#property copyright "Copyright 2025, RetailBeastFX"
#property link      "https://retailbeastfx.com"
#property version   "1.00"
#property description "Adaptive Strategy EA - Auto-switches strategies based on market regime"
#property description "Based on multi-regime backtest optimization"

#include <Trade\Trade.mqh>
#include <Trade\PositionInfo.mqh>
#include <Trade\AccountInfo.mqh>

//+------------------------------------------------------------------+
//| INPUT PARAMETERS                                                  |
//+------------------------------------------------------------------+
// Strategy Settings
input ENUM_TIMEFRAMES InpTimeframe = PERIOD_M15;       // Timeframe
input int      InpADXPeriod = 14;                      // ADX Period
input int      InpADXThreshold = 25;                   // ADX Trend Threshold
input int      InpRSIPeriod = 2;                       // RSI Period (Mean Reversion)
input int      InpRSIOversold = 15;                    // RSI Oversold Level
input int      InpRSIOverbought = 85;                  // RSI Overbought Level
input int      InpBBPeriod = 20;                       // Bollinger Band Period
input double   InpBBDeviation = 2.0;                   // BB Deviation

// EMA Settings
input int      InpEMAFast = 8;                         // Fast EMA Period
input int      InpEMASlow = 21;                        // Slow EMA Period
input int      InpEMATrend = 200;                      // Trend EMA Period

// Risk Management
input double   InpRiskPercent = 1.0;                   // Risk % Per Trade
input double   InpATRMultSL = 2.0;                     // ATR x Stop Loss
input double   InpATRMultTP = 4.5;                     // ATR x Take Profit
input int      InpATRPeriod = 14;                      // ATR Period
input bool     InpSafeMode = false;                    // Safe Mode (Half Lot Size)
input double   InpMaxDailyLossPercent = 3.0;           // Max Daily Loss %
input int      InpMaxTradesPerDay = 5;                 // Max Trades Per Day

// Session Filter
input bool     InpUseKillzones = true;                 // Trade Only In Killzones
input int      InpLondonStart = 3;                     // London Start Hour (EST)
input int      InpLondonEnd = 6;                       // London End Hour (EST)
input int      InpNYStart = 8;                         // NY Start Hour (EST)
input int      InpNYEnd = 11;                          // NY End Hour (EST)

// General
input ulong    InpMagicNumber = 20250109;              // Magic Number
input string   InpComment = "RBFX_Adaptive";           // Trade Comment

//+------------------------------------------------------------------+
//| GLOBAL VARIABLES                                                  |
//+------------------------------------------------------------------+
CTrade         trade;
CPositionInfo  posInfo;
CAccountInfo   accInfo;

// Indicator handles
int handleADX;
int handleRSI;
int handleBB;
int handleATR;
int handleEMAFast;
int handleEMASlow;
int handleEMATrend;

// Daily tracking
double dailyStartBalance = 0;
int    tradesOpenedToday = 0;
int    lastTradeDay = 0;

// Strategy types
enum STRATEGY_TYPE {
   STRAT_TREND_FOLLOWING,
   STRAT_MEAN_REVERSION,
   STRAT_BREAKOUT,
   STRAT_ORIGINAL
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
   
   // Initialize indicators
   handleADX = iADX(_Symbol, InpTimeframe, InpADXPeriod);
   handleRSI = iRSI(_Symbol, InpTimeframe, InpRSIPeriod, PRICE_CLOSE);
   handleBB = iBands(_Symbol, InpTimeframe, InpBBPeriod, 0, InpBBDeviation, PRICE_CLOSE);
   handleATR = iATR(_Symbol, InpTimeframe, InpATRPeriod);
   handleEMAFast = iMA(_Symbol, InpTimeframe, InpEMAFast, 0, MODE_EMA, PRICE_CLOSE);
   handleEMASlow = iMA(_Symbol, InpTimeframe, InpEMASlow, 0, MODE_EMA, PRICE_CLOSE);
   handleEMATrend = iMA(_Symbol, InpTimeframe, InpEMATrend, 0, MODE_EMA, PRICE_CLOSE);
   
   if(handleADX == INVALID_HANDLE || handleRSI == INVALID_HANDLE || 
      handleBB == INVALID_HANDLE || handleATR == INVALID_HANDLE ||
      handleEMAFast == INVALID_HANDLE || handleEMASlow == INVALID_HANDLE ||
      handleEMATrend == INVALID_HANDLE) {
      Print("Error creating indicators!");
      return INIT_FAILED;
   }
   
   // Initialize daily tracking
   dailyStartBalance = accInfo.Balance();
   MqlDateTime dt;
   TimeToStruct(TimeCurrent(), dt);
   lastTradeDay = dt.day;
   tradesOpenedToday = 0;
   
   Print("RetailBeastFX Adaptive EA initialized successfully!");
   Print("Account Balance: $", DoubleToString(accInfo.Balance(), 2));
   Print("Current Tier: ", GetTierName(accInfo.Balance()));
   Print("Lot Size: ", DoubleToString(CalculateLotSize(), 2));
   
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
   
   Print("RetailBeastFX Adaptive EA deinitialized.");
}

//+------------------------------------------------------------------+
//| Expert tick function                                               |
//+------------------------------------------------------------------+
void OnTick() {
   // Reset daily counters at new day
   MqlDateTime dt;
   TimeToStruct(TimeCurrent(), dt);
   int currentDay = dt.day;
   
   if(currentDay != lastTradeDay) {
      dailyStartBalance = accInfo.Balance();
      tradesOpenedToday = 0;
      lastTradeDay = currentDay;
   }
   
   // Check if new bar
   static datetime lastBarTime = 0;
   datetime currentBarTime = iTime(_Symbol, InpTimeframe, 0);
   if(lastBarTime == currentBarTime) return;
   lastBarTime = currentBarTime;
   
   // Check daily limits
   if(!CheckDailyLimits()) return;
   
   // Check session filter
   if(InpUseKillzones && !IsInKillzone()) return;
   
   // Check if already in position
   if(HasOpenPosition()) return;
   
   // Get market regime and generate signals
   STRATEGY_TYPE activeStrategy = DetectMarketRegime();
   int signal = GenerateSignal(activeStrategy);
   
   if(signal != 0) {
      ExecuteTrade(signal, activeStrategy);
   }
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
   bool isSqueeze = bbWidth < avgWidth;
   
   // Adaptive strategy selection based on multi-regime backtest results
   if(isTrending) {
      Comment("Market Regime: TRENDING (ADX: ", DoubleToString(currentADX, 1), ") -> Trend Following");
      return STRAT_TREND_FOLLOWING;
   }
   else if(isRanging || isVolatile) {
      string regime = isRanging ? "RANGING" : "VOLATILE";
      Comment("Market Regime: ", regime, " (ADX: ", DoubleToString(currentADX, 1), ") -> Mean Reversion");
      return STRAT_MEAN_REVERSION;
   }
   else if(isSqueeze) {
      Comment("Market Regime: SQUEEZE -> Breakout");
      return STRAT_BREAKOUT;
   }
   else {
      Comment("Market Regime: CHOPPY (ADX: ", DoubleToString(currentADX, 1), ") -> Original BB");
      return STRAT_ORIGINAL;
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
   
   ArraySetAsSeries(emaFast, true);
   ArraySetAsSeries(emaSlow, true);
   ArraySetAsSeries(emaTrend, true);
   ArraySetAsSeries(rsi, true);
   ArraySetAsSeries(bbUpper, true);
   ArraySetAsSeries(bbLower, true);
   ArraySetAsSeries(bbMiddle, true);
   ArraySetAsSeries(closeArr, true);
   
   CopyBuffer(handleEMAFast, 0, 0, 5, emaFast);
   CopyBuffer(handleEMASlow, 0, 0, 5, emaSlow);
   CopyBuffer(handleEMATrend, 0, 0, 5, emaTrend);
   CopyBuffer(handleRSI, 0, 0, 5, rsi);
   CopyBuffer(handleBB, 1, 0, 5, bbUpper);
   CopyBuffer(handleBB, 2, 0, 5, bbLower);
   CopyBuffer(handleBB, 0, 0, 5, bbMiddle);
   CopyClose(_Symbol, InpTimeframe, 0, 5, closeArr);
   
   bool bullTrend = emaFast[1] > emaSlow[1];
   bool bearTrend = emaFast[1] < emaSlow[1];
   bool aboveEMA200 = closeArr[1] > emaTrend[1];
   bool belowEMA200 = closeArr[1] < emaTrend[1];
   
   switch(strategy) {
      case STRAT_TREND_FOLLOWING:
         // Cross above/below EMA200
         if(closeArr[2] < emaTrend[2] && closeArr[1] > emaTrend[1]) return 1;  // Buy
         if(closeArr[2] > emaTrend[2] && closeArr[1] < emaTrend[1]) return -1; // Sell
         break;
         
      case STRAT_MEAN_REVERSION:
         // RSI extremes with trend filter
         if(rsi[1] < InpRSIOversold && aboveEMA200 && rsi[2] >= InpRSIOversold) return 1;  // Buy
         if(rsi[1] > InpRSIOverbought && belowEMA200 && rsi[2] <= InpRSIOverbought) return -1; // Sell
         break;
         
      case STRAT_BREAKOUT:
         // BB squeeze breakout
         if(closeArr[1] > bbUpper[1] && closeArr[2] <= bbUpper[2]) return 1;  // Buy breakout
         if(closeArr[1] < bbLower[1] && closeArr[2] >= bbLower[2]) return -1; // Sell breakout
         break;
         
      case STRAT_ORIGINAL:
         // Original BB bounce strategy
         if(closeArr[1] <= bbLower[1] && closeArr[1] > closeArr[2] && bullTrend) return 1;  // Buy
         if(closeArr[1] >= bbUpper[1] && closeArr[1] < closeArr[2] && bearTrend) return -1; // Sell
         break;
   }
   
   return 0; // No signal
}

//+------------------------------------------------------------------+
//| EXECUTE TRADE                                                      |
//+------------------------------------------------------------------+
void ExecuteTrade(int signal, STRATEGY_TYPE strategy) {
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
      case STRAT_TREND_FOLLOWING: strategyName = "TREND"; break;
      case STRAT_MEAN_REVERSION: strategyName = "MEANREV"; break;
      case STRAT_BREAKOUT: strategyName = "BREAKOUT"; break;
      case STRAT_ORIGINAL: strategyName = "ORIGINAL"; break;
   }
   
   string comment = InpComment + "_" + strategyName;
   
   if(signal == 1) { // BUY
      double sl = NormalizeDouble(ask - slDistance, _Digits);
      double tp = NormalizeDouble(ask + tpDistance, _Digits);
      
      if(trade.Buy(lotSize, _Symbol, ask, sl, tp, comment)) {
         tradesOpenedToday++;
         Print("BUY executed: ", lotSize, " lots, SL: ", sl, ", TP: ", tp, ", Strategy: ", strategyName);
      }
   }
   else if(signal == -1) { // SELL
      double sl = NormalizeDouble(bid + slDistance, _Digits);
      double tp = NormalizeDouble(bid - tpDistance, _Digits);
      
      if(trade.Sell(lotSize, _Symbol, bid, sl, tp, comment)) {
         tradesOpenedToday++;
         Print("SELL executed: ", lotSize, " lots, SL: ", sl, ", TP: ", tp, ", Strategy: ", strategyName);
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
   // Check max trades per day
   if(tradesOpenedToday >= InpMaxTradesPerDay) {
      Comment("Daily trade limit reached (", InpMaxTradesPerDay, ")");
      return false;
   }
   
   // Check max daily loss
   double currentBalance = accInfo.Balance();
   double dailyLoss = dailyStartBalance - currentBalance;
   double maxLossAmount = dailyStartBalance * (InpMaxDailyLossPercent / 100.0);
   
   if(dailyLoss >= maxLossAmount) {
      Comment("Daily loss limit reached ($", DoubleToString(dailyLoss, 2), " / $", DoubleToString(maxLossAmount, 2), ")");
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
   
   // Convert to EST (GMT-5)
   int hourEST = (dt.hour - 5 + 24) % 24;
   
   // London session
   if(hourEST >= InpLondonStart && hourEST < InpLondonEnd) return true;
   
   // NY session
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
