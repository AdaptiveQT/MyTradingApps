//+------------------------------------------------------------------+
//|                              RetailBeastFX_Institutional_v9.mq5 |
//|                                    Copyright 2026, RetailBeastFX |
//|                                    https://www.retailbeastfx.com |
//+------------------------------------------------------------------+
#property copyright "Copyright 2026, RetailBeastFX"
#property link      "https://www.retailbeastfx.com"
#property version   "9.10"
#property description "RetailBeastFX Institutional v9.1 - Smart Money Concepts"
#property indicator_chart_window
#property indicator_buffers 8
#property indicator_plots   8

//--- EMA Plots
#property indicator_label1  "EMA 8"
#property indicator_type1   DRAW_LINE
#property indicator_color1  clrLime
#property indicator_style1  STYLE_SOLID
#property indicator_width1  2

#property indicator_label2  "EMA 21"
#property indicator_type2   DRAW_LINE
#property indicator_color2  clrOrange
#property indicator_style2  STYLE_SOLID
#property indicator_width2  2

#property indicator_label3  "EMA 50"
#property indicator_type3   DRAW_LINE
#property indicator_color3  clrDodgerBlue
#property indicator_style3  STYLE_SOLID
#property indicator_width3  1

#property indicator_label4  "EMA 200"
#property indicator_type4   DRAW_LINE
#property indicator_color4  clrMagenta
#property indicator_style4  STYLE_SOLID
#property indicator_width4  2

//--- Buy/Sell Signal Arrows
#property indicator_label5  "Buy Signal"
#property indicator_type5   DRAW_ARROW
#property indicator_color5  clrLime
#property indicator_width5  3

#property indicator_label6  "Sell Signal"
#property indicator_type6   DRAW_ARROW
#property indicator_color6  clrRed
#property indicator_width6  3

#property indicator_label7  "Apex Buy"
#property indicator_type7   DRAW_ARROW
#property indicator_color7  clrGold
#property indicator_width7  4

#property indicator_label8  "Apex Sell"
#property indicator_type8   DRAW_ARROW
#property indicator_color8  clrDeepPink
#property indicator_width8  4

//+------------------------------------------------------------------+
//| Input Parameters                                                  |
//+------------------------------------------------------------------+
input group "══════ INSTITUTIONAL MODE ══════"
input bool   InpInstitutionalMode = true;          // Institutional Mode
input int    InpADXThreshold = 25;                 // ADX Threshold

input group "══════ MODE SELECTOR ══════"
enum ENUM_GAME_MODE { SCALPER, DAY_TRADER, SWING };
input ENUM_GAME_MODE InpGameMode = SCALPER;        // Trading Mode

input group "══════ KILLZONE SETTINGS ══════"
input bool   InpShowKillzones = true;              // Show Killzone Highlighting
input int    InpLondonStart = 8;                   // London Start (GMT)
input int    InpLondonEnd = 11;                    // London End (GMT)
input int    InpNYStart = 13;                      // New York Start (GMT)
input int    InpNYEnd = 17;                        // New York End (GMT)
input color  InpLondonColor = C'0,100,100';        // London Color
input color  InpNYColor = C'100,70,0';             // NY Color

input group "══════ ORDER BLOCKS ══════"
input bool   InpShowOB = true;                     // Show Order Blocks
input int    InpPivotLength = 5;                   // Swing Detection Length
input int    InpMaxOB = 2;                         // Max Order Blocks
input color  InpBullOBColor = C'0,100,80';         // Bull OB Color
input color  InpBearOBColor = C'100,40,40';        // Bear OB Color
input color  InpBreakerColor = C'100,80,180';      // Breaker Block Color (purple)

input group "══════ VISUAL SETTINGS ══════"
input bool   InpShowSignals = true;                // Show Signal Arrows
input bool   InpShowDashboard = true;              // Show Dashboard

//+------------------------------------------------------------------+
//| Order Block Structure                                             |
//+------------------------------------------------------------------+
struct OrderBlock
{
   double high;
   double low;
   datetime time;
   bool isBullish;
   bool valid;
   bool isBreaker;  // Becomes true when price breaks through
   string name;
};
OrderBlock bullOBs[];
OrderBlock bearOBs[];

//+------------------------------------------------------------------+
//| Global Variables                                                  |
//+------------------------------------------------------------------+
double EMA8Buffer[];
double EMA21Buffer[];
double EMA50Buffer[];
double EMA200Buffer[];
double BuySignalBuffer[];
double SellSignalBuffer[];
double ApexBuyBuffer[];
double ApexSellBuffer[];

int handleADX, handleATR;
int lastBuyBar = -100;
int lastSellBar = -100;
string prefix = "RBFX_";

//+------------------------------------------------------------------+
//| Initialization                                                    |
//+------------------------------------------------------------------+
int OnInit()
{
   SetIndexBuffer(0, EMA8Buffer, INDICATOR_DATA);
   SetIndexBuffer(1, EMA21Buffer, INDICATOR_DATA);
   SetIndexBuffer(2, EMA50Buffer, INDICATOR_DATA);
   SetIndexBuffer(3, EMA200Buffer, INDICATOR_DATA);
   SetIndexBuffer(4, BuySignalBuffer, INDICATOR_DATA);
   SetIndexBuffer(5, SellSignalBuffer, INDICATOR_DATA);
   SetIndexBuffer(6, ApexBuyBuffer, INDICATOR_DATA);
   SetIndexBuffer(7, ApexSellBuffer, INDICATOR_DATA);
   
   PlotIndexSetInteger(4, PLOT_ARROW, 233);
   PlotIndexSetInteger(5, PLOT_ARROW, 234);
   PlotIndexSetInteger(6, PLOT_ARROW, 233);
   PlotIndexSetInteger(7, PLOT_ARROW, 234);
   
   PlotIndexSetDouble(4, PLOT_EMPTY_VALUE, EMPTY_VALUE);
   PlotIndexSetDouble(5, PLOT_EMPTY_VALUE, EMPTY_VALUE);
   PlotIndexSetDouble(6, PLOT_EMPTY_VALUE, EMPTY_VALUE);
   PlotIndexSetDouble(7, PLOT_EMPTY_VALUE, EMPTY_VALUE);
   
   handleADX = iADX(_Symbol, PERIOD_CURRENT, 14);
   handleATR = iATR(_Symbol, PERIOD_CURRENT, 14);
   
   ArrayResize(bullOBs, InpMaxOB);
   ArrayResize(bearOBs, InpMaxOB);
   for(int i = 0; i < InpMaxOB; i++)
   {
      bullOBs[i].valid = false;
      bearOBs[i].valid = false;
   }
   
   IndicatorSetString(INDICATOR_SHORTNAME, "RBFX v9.1");
   
   return INIT_SUCCEEDED;
}

//+------------------------------------------------------------------+
//| Deinitialization                                                  |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   if(handleADX != INVALID_HANDLE) IndicatorRelease(handleADX);
   if(handleATR != INVALID_HANDLE) IndicatorRelease(handleATR);
   ObjectsDeleteAll(0, prefix);
   Comment("");
}

//+------------------------------------------------------------------+
//| Session Checks                                                    |
//+------------------------------------------------------------------+
bool IsInSession(int startHour, int endHour)
{
   MqlDateTime dt;
   TimeGMT(dt);
   return (dt.hour >= startHour && dt.hour < endHour);
}

bool IsInLondon() { return IsInSession(InpLondonStart, InpLondonEnd); }
bool IsInNY() { return IsInSession(InpNYStart, InpNYEnd); }
bool IsInKillzone() { return IsInLondon() || IsInNY(); }

bool IsValidSession()
{
   switch(InpGameMode)
   {
      case SCALPER: return IsInKillzone();
      case DAY_TRADER: return IsInSession(7, 17);
      case SWING: return true;
      default: return true;
   }
}

//+------------------------------------------------------------------+
//| Draw Order Block                                                  |
//+------------------------------------------------------------------+
void DrawOrderBlock(OrderBlock &ob, datetime endTime)
{
   if(!ob.valid) return;
   
   // Delete old objects
   ObjectDelete(0, ob.name);
   ObjectDelete(0, ob.name + "_lbl");
   
   // Draw rectangle with semi-transparent fill
   ObjectCreate(0, ob.name, OBJ_RECTANGLE, 0, ob.time, ob.high, endTime, ob.low);
   
   // Choose color based on OB type and breaker status
   color obColor;
   string labelText;
   color labelColor;
   
   if(ob.isBreaker)
   {
      // Breaker Block - purple
      obColor = InpBreakerColor;
      labelText = ob.isBullish ? "BULL BREAKER" : "BEAR BREAKER";
      labelColor = C'180,140,255';  // Light purple
   }
   else
   {
      // Normal Order Block
      obColor = ob.isBullish ? C'0,180,120' : C'180,60,60';
      labelText = ob.isBullish ? "BULL OB" : "BEAR OB";
      labelColor = ob.isBullish ? clrLime : clrRed;
   }
   
   ObjectSetInteger(0, ob.name, OBJPROP_COLOR, obColor);
   ObjectSetInteger(0, ob.name, OBJPROP_FILL, true);
   ObjectSetInteger(0, ob.name, OBJPROP_STYLE, STYLE_SOLID);
   ObjectSetInteger(0, ob.name, OBJPROP_WIDTH, 2);
   ObjectSetInteger(0, ob.name, OBJPROP_BACK, true);
   ObjectSetInteger(0, ob.name, OBJPROP_SELECTABLE, false);
   
   // Add label
   string labelName = ob.name + "_lbl";
   ObjectCreate(0, labelName, OBJ_TEXT, 0, ob.time, ob.isBullish ? ob.low : ob.high);
   ObjectSetString(0, labelName, OBJPROP_TEXT, labelText);
   ObjectSetInteger(0, labelName, OBJPROP_COLOR, labelColor);
   ObjectSetInteger(0, labelName, OBJPROP_FONTSIZE, 8);
   ObjectSetString(0, labelName, OBJPROP_FONT, "Arial Bold");
   ObjectSetInteger(0, labelName, OBJPROP_ANCHOR, ob.isBullish ? ANCHOR_LEFT_UPPER : ANCHOR_LEFT_LOWER);
   ObjectSetInteger(0, labelName, OBJPROP_SELECTABLE, false);
}

//+------------------------------------------------------------------+
//| Add Bull OB                                                       |
//+------------------------------------------------------------------+
void AddBullOB(double h, double l, datetime t)
{
   for(int i = InpMaxOB - 1; i > 0; i--)
   {
      bullOBs[i] = bullOBs[i-1];
      bullOBs[i].name = prefix + "BullOB_" + IntegerToString(i);
   }
   bullOBs[0].high = h;
   bullOBs[0].low = l;
   bullOBs[0].time = t;
   bullOBs[0].isBullish = true;
   bullOBs[0].valid = true;
   bullOBs[0].isBreaker = false;
   bullOBs[0].name = prefix + "BullOB_0";
}

//+------------------------------------------------------------------+
//| Add Bear OB                                                       |
//+------------------------------------------------------------------+
void AddBearOB(double h, double l, datetime t)
{
   for(int i = InpMaxOB - 1; i > 0; i--)
   {
      bearOBs[i] = bearOBs[i-1];
      bearOBs[i].name = prefix + "BearOB_" + IntegerToString(i);
   }
   bearOBs[0].high = h;
   bearOBs[0].low = l;
   bearOBs[0].time = t;
   bearOBs[0].isBullish = false;
   bearOBs[0].valid = true;
   bearOBs[0].isBreaker = false;
   bearOBs[0].name = prefix + "BearOB_0";
}

//+------------------------------------------------------------------+
//| Check if price is in Bull OB                                      |
//+------------------------------------------------------------------+
bool IsInBullOB(double price)
{
   for(int i = 0; i < InpMaxOB; i++)
      if(bullOBs[i].valid && price >= bullOBs[i].low && price <= bullOBs[i].high)
         return true;
   return false;
}

//+------------------------------------------------------------------+
//| Check if price is in Bear OB                                      |
//+------------------------------------------------------------------+
bool IsInBearOB(double price)
{
   for(int i = 0; i < InpMaxOB; i++)
      if(bearOBs[i].valid && price >= bearOBs[i].low && price <= bearOBs[i].high)
         return true;
   return false;
}

//+------------------------------------------------------------------+
//| Check and update OB mitigation (invalidate when broken)           |
//+------------------------------------------------------------------+
void CheckOBMitigation(double closePrice)
{
   // Check Bull OBs - if price closes below the low, invalidate it
   for(int i = 0; i < InpMaxOB; i++)
   {
      if(bullOBs[i].valid)
      {
         if(closePrice < bullOBs[i].low)
         {
            bullOBs[i].valid = false;
            ObjectDelete(0, bullOBs[i].name);
            ObjectDelete(0, bullOBs[i].name + "_lbl");
         }
      }
   }
   
   // Check Bear OBs - if price closes above the high, invalidate it
   for(int i = 0; i < InpMaxOB; i++)
   {
      if(bearOBs[i].valid)
      {
         if(closePrice > bearOBs[i].high)
         {
            bearOBs[i].valid = false;
            ObjectDelete(0, bearOBs[i].name);
            ObjectDelete(0, bearOBs[i].name + "_lbl");
         }
      }
   }
}

//+------------------------------------------------------------------+
//| Calculate Confluence Score                                        |
//+------------------------------------------------------------------+
double CalcConfluence(bool isBuy, double adxVal, bool bullTrend, bool bearTrend,
                      bool above200, bool below200, bool inKillzone, bool inOB)
{
   double score = 0;
   
   // ADX (up to 3 points)
   if(adxVal >= InpADXThreshold) score += 1.5;
   if(adxVal >= 30) score += 1.0;
   if(adxVal >= 35) score += 0.5;
   
   // Trend alignment (2 points)
   if(isBuy && bullTrend && above200) score += 2.0;
   else if(!isBuy && bearTrend && below200) score += 2.0;
   else if(isBuy && above200) score += 1.0;
   else if(!isBuy && below200) score += 1.0;
   
   // Session (2 points)
   if(inKillzone) score += 2.0;
   
   // Order Block (3 points)
   if(inOB) score += 3.0;
   
   return MathMin(score, 10.0);
}

//+------------------------------------------------------------------+
//| Main Calculation                                                  |
//+------------------------------------------------------------------+
int OnCalculate(const int rates_total,
                const int prev_calculated,
                const datetime &time[],
                const double &open[],
                const double &high[],
                const double &low[],
                const double &close[],
                const long &tick_volume[],
                const long &volume[],
                const int &spread[])
{
   if(rates_total < 250) return 0;
   
   int start = (prev_calculated > 0) ? prev_calculated - 1 : 0;
   
   // EMA multipliers
   double m8 = 2.0 / 9.0;
   double m21 = 2.0 / 22.0;
   double m50 = 2.0 / 51.0;
   double m200 = 2.0 / 201.0;
   
   // Get ADX/ATR data
   double adx[], atr[];
   CopyBuffer(handleADX, 0, 0, rates_total, adx);
   CopyBuffer(handleATR, 0, 0, rates_total, atr);
   int adxSize = ArraySize(adx);
   int atrSize = ArraySize(atr);
   
   // Calculate
   for(int i = start; i < rates_total; i++)
   {
      // Calculate EMAs
      if(i == 0)
      {
         EMA8Buffer[i] = close[i];
         EMA21Buffer[i] = close[i];
         EMA50Buffer[i] = close[i];
         EMA200Buffer[i] = close[i];
      }
      else
      {
         EMA8Buffer[i] = close[i] * m8 + EMA8Buffer[i-1] * (1 - m8);
         EMA21Buffer[i] = close[i] * m21 + EMA21Buffer[i-1] * (1 - m21);
         EMA50Buffer[i] = close[i] * m50 + EMA50Buffer[i-1] * (1 - m50);
         EMA200Buffer[i] = close[i] * m200 + EMA200Buffer[i-1] * (1 - m200);
      }
      
      // Initialize signal buffers
      BuySignalBuffer[i] = EMPTY_VALUE;
      SellSignalBuffer[i] = EMPTY_VALUE;
      ApexBuyBuffer[i] = EMPTY_VALUE;
      ApexSellBuffer[i] = EMPTY_VALUE;
      
      // Skip early bars
      if(i < 250) continue;
      
      // Trend
      bool bullTrend = EMA8Buffer[i] > EMA21Buffer[i];
      bool bearTrend = EMA8Buffer[i] < EMA21Buffer[i];
      bool above200 = close[i] > EMA200Buffer[i];
      bool below200 = close[i] < EMA200Buffer[i];
      
      // ADX Gate
      double adxVal = (i < adxSize) ? adx[i] : 20.0;
      bool adxGate = adxVal >= InpADXThreshold;
      
      // ATR for positioning
      double atrVal = (i < atrSize && atr[i] > 0) ? atr[i] : (high[i] - low[i]);
      
      // Candle type
      bool bullCandle = close[i] > open[i];
      bool bearCandle = close[i] < open[i];
      
      // Session
      bool validSession = IsValidSession();
      bool inKillzone = IsInKillzone();
      
      // Order Block Detection (swing points)
      if(InpShowOB && i > InpPivotLength && i < rates_total - InpPivotLength)
      {
         bool isSwingHigh = true;
         bool isSwingLow = true;
         
         for(int j = 1; j <= InpPivotLength; j++)
         {
            if(high[i] <= high[i - j] || high[i] <= high[i + j]) isSwingHigh = false;
            if(low[i] >= low[i - j] || low[i] >= low[i + j]) isSwingLow = false;
         }
         
         // Bear OB at swing high - look back for last bullish candle
         if(isSwingHigh)
         {
            for(int k = 1; k <= 10; k++)
            {
               if((i - k) >= 0 && close[i - k] > open[i - k])
               {
                  double obSize = high[i - k] - low[i - k];
                  if(obSize >= atrVal * 0.3)
                  {
                     AddBearOB(high[i - k], low[i - k], time[i - k]);
                     break;
                  }
               }
            }
         }
         
         // Bull OB at swing low - look back for last bearish candle
         if(isSwingLow)
         {
            for(int k = 1; k <= 10; k++)
            {
               if((i - k) >= 0 && close[i - k] < open[i - k])
               {
                  double obSize = high[i - k] - low[i - k];
                  if(obSize >= atrVal * 0.3)
                  {
                     AddBullOB(high[i - k], low[i - k], time[i - k]);
                     break;
                  }
               }
            }
         }
      }
      
      // Check for OB mitigation - convert to Breakers
      CheckOBMitigation(close[i]);
      
      // Check if in OB (including Breakers for opposite direction)
      bool inBullOB = IsInBullOB(low[i]) || IsInBullOB(close[i]);
      bool inBearOB = IsInBearOB(high[i]) || IsInBearOB(close[i]);
      
      // Simple BB touch detection
      double bbSum = 0;
      int lookback = MathMin(20, i);
      for(int j = 0; j < lookback; j++) bbSum += close[i - j];
      double bbBasis = bbSum / lookback;
      double bbSumSq = 0;
      for(int j = 0; j < lookback; j++) bbSumSq += MathPow(close[i - j] - bbBasis, 2);
      double bbStd = MathSqrt(bbSumSq / lookback);
      double bbLower = bbBasis - 2.0 * bbStd;
      double bbUpper = bbBasis + 2.0 * bbStd;
      
      bool touchedLowerBB = low[i] <= bbLower;
      bool touchedUpperBB = high[i] >= bbUpper;
      
      // Signal Logic
      bool buyZone = touchedLowerBB || inBullOB;
      bool sellZone = touchedUpperBB || inBearOB;
      
      bool classicBuy = bullCandle && buyZone && bullTrend && validSession;
      bool classicSell = bearCandle && sellZone && bearTrend && validSession;
      
      bool instBuy = classicBuy && adxGate && above200 && inKillzone;
      bool instSell = classicSell && adxGate && below200 && inKillzone;
      
      bool rawBuy = InpInstitutionalMode ? instBuy : classicBuy;
      bool rawSell = InpInstitutionalMode ? instSell : classicSell;
      
      // Cooldown
      bool buyCooldownOk = (i - lastBuyBar) >= 5;
      bool sellCooldownOk = (i - lastSellBar) >= 5;
      
      // Confluence scores
      double buyConf = CalcConfluence(true, adxVal, bullTrend, bearTrend, above200, below200, inKillzone, inBullOB);
      double sellConf = CalcConfluence(false, adxVal, bullTrend, bearTrend, above200, below200, inKillzone, inBearOB);
      
      // Apex detection (confluence >= 8)
      bool isApexBuy = rawBuy && buyConf >= 8.0;
      bool isApexSell = rawSell && sellConf >= 8.0;
      
      // Final signals
      bool buySignal = rawBuy && buyCooldownOk && InpShowSignals;
      bool sellSignal = rawSell && sellCooldownOk && InpShowSignals;
      
      // Plot
      if(buySignal)
      {
         lastBuyBar = i;
         if(isApexBuy)
            ApexBuyBuffer[i] = low[i] - atrVal * 0.5;
         else
            BuySignalBuffer[i] = low[i] - atrVal * 0.3;
      }
      
      if(sellSignal)
      {
         lastSellBar = i;
         if(isApexSell)
            ApexSellBuffer[i] = high[i] + atrVal * 0.5;
         else
            SellSignalBuffer[i] = high[i] + atrVal * 0.3;
      }
      
      // Dashboard on last bar
      if(i == rates_total - 1 && InpShowDashboard)
      {
         string mode = InpInstitutionalMode ? "INSTITUTIONAL" : "CLASSIC";
         string bias = above200 ? "BULLISH" : below200 ? "BEARISH" : "NEUTRAL";
         string adxStatus = adxGate ? "OPEN" : "CLOSED";
         string session = inKillzone ? (IsInLondon() ? "LONDON" : "NEW YORK") : "OFF HOURS";
         string signalStr = buySignal ? "BUY" : sellSignal ? "SELL" : "SCANNING...";
         double conf = buySignal ? buyConf : sellSignal ? sellConf : 0;
         string apex = (isApexBuy || isApexSell) ? " [APEX]" : "";
         
         Comment("=== RBFX v9.1 ===\n",
                 "Mode: ", mode, "\n",
                 "Bias: ", bias, "\n",
                 "ADX: ", DoubleToString(adxVal, 1), " Gate: ", adxStatus, "\n",
                 "Session: ", session, "\n",
                 "Signal: ", signalStr, apex, "\n",
                 "Confluence: ", DoubleToString(conf, 1), "/10");
      }
   }
   
   // Draw Order Blocks
   if(InpShowOB)
   {
      datetime futureTime = time[rates_total - 1] + PeriodSeconds() * 20;
      for(int i = 0; i < InpMaxOB; i++)
      {
         DrawOrderBlock(bullOBs[i], futureTime);
         DrawOrderBlock(bearOBs[i], futureTime);
      }
   }
   
   // Draw Killzone highlighting (simple vertical line approach)
   if(InpShowKillzones && rates_total > 0)
   {
      string kzName = prefix + "KZ_Current";
      ObjectDelete(0, kzName);
      
      if(IsInLondon())
      {
         ObjectCreate(0, kzName, OBJ_VLINE, 0, time[rates_total - 1], 0);
         ObjectSetInteger(0, kzName, OBJPROP_COLOR, InpLondonColor);
         ObjectSetInteger(0, kzName, OBJPROP_WIDTH, 2);
         ObjectSetInteger(0, kzName, OBJPROP_BACK, true);
      }
      else if(IsInNY())
      {
         ObjectCreate(0, kzName, OBJ_VLINE, 0, time[rates_total - 1], 0);
         ObjectSetInteger(0, kzName, OBJPROP_COLOR, InpNYColor);
         ObjectSetInteger(0, kzName, OBJPROP_WIDTH, 2);
         ObjectSetInteger(0, kzName, OBJPROP_BACK, true);
      }
   }
   
   return rates_total;
}
//+------------------------------------------------------------------+
