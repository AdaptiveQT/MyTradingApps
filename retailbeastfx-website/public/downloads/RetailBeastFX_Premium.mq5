//+------------------------------------------------------------------+
//|                                      RetailBeastFX_Premium.mq5   |
//|                                 Copyright 2025, RetailBeastFX    |
//|       Professional ICT/SMC Indicator for MT5                     |
//|       Premium Edition - All Features Unlocked                    |
//+------------------------------------------------------------------+
#property copyright "Copyright 2025, RetailBeastFX"
#property link      "https://retailbeastfx.com"
#property version   "8.00"
#property description "RetailBeastFX Premium - ICT/SMC Indicator with Alpha Edge Strategies, Order Blocks, Killzones, BOS/CHoCH"
#property strict
#property indicator_chart_window
#property indicator_buffers 9
#property indicator_plots   9

//--- Bollinger Bands
#property indicator_label1  "BB Upper"
#property indicator_type1   DRAW_LINE
#property indicator_color1  C'100,180,255'
#property indicator_style1  STYLE_SOLID
#property indicator_width1  1

#property indicator_label2  "BB Middle"
#property indicator_type2   DRAW_LINE
#property indicator_color2  C'80,80,100'
#property indicator_style2  STYLE_DOT
#property indicator_width2  1

#property indicator_label3  "BB Lower"
#property indicator_type3   DRAW_LINE
#property indicator_color3  C'100,180,255'
#property indicator_style3  STYLE_SOLID
#property indicator_width3  1

//--- EMA Lines
#property indicator_label4  "EMA Fast"
#property indicator_type4   DRAW_LINE
#property indicator_color4  C'0,230,180'
#property indicator_style4  STYLE_SOLID
#property indicator_width4  2

#property indicator_label5  "EMA Slow"
#property indicator_type5   DRAW_LINE
#property indicator_color5  C'255,180,50'
#property indicator_style5  STYLE_SOLID
#property indicator_width5  2

#property indicator_label6  "EMA Trend"
#property indicator_type6   DRAW_LINE
#property indicator_color6  C'180,100,255'
#property indicator_style6  STYLE_DOT
#property indicator_width6  2

//--- Signal Arrows
#property indicator_label7  "Buy Signal"
#property indicator_type7   DRAW_ARROW
#property indicator_color7  C'0,255,150'
#property indicator_style7  STYLE_SOLID
#property indicator_width7  3

#property indicator_label8  "Sell Signal"
#property indicator_type8   DRAW_ARROW
#property indicator_color8  C'255,80,80'
#property indicator_style8  STYLE_SOLID
#property indicator_width8  3

#property indicator_label9  "Structure"
#property indicator_type9   DRAW_ARROW
#property indicator_color9  C'255,220,100'
#property indicator_style9  STYLE_SOLID
#property indicator_width9  2

//+------------------------------------------------------------------+
//| ENUMERATIONS                                                      |
//+------------------------------------------------------------------+
enum ENUM_GAME_MODE
{
   MODE_SCALPER = 0,    // Scalper Mode (Strict Killzones)
   MODE_DAYTRADER = 1,  // Day Trader Mode (Extended Hours)
   MODE_SWING = 2       // Swing Mode (24/7 with EMA 200)
};

enum ENUM_KZ_STYLE
{
   KZ_STYLE_FILLED = 0,    // Filled Box
   KZ_STYLE_OUTLINE = 1,   // Outline Only
   KZ_STYLE_GRADIENT = 2   // Gradient (Top/Bottom lines)
};

enum ENUM_DISPLAY_MODE
{
   DISPLAY_PRESENT = 0,    // Present (Today Only)
   DISPLAY_HISTORICAL = 1  // Historical (Full History)
};

//--- Alpha Edge A+ Strategy Selection
enum ENUM_ALPHA_STRATEGY
{
   ALPHA_OFF = 0,               // Off (Use Original Signals)
   ALPHA_TREND_FOLLOWING = 1,   // Trend Following (200 SMA)
   ALPHA_MEAN_REVERSION = 2,    // Mean Reversion (RSI Extremes)
   ALPHA_SWING_PULLBACKS = 3,   // Swing Pullbacks (Fib + EMA)
   ALPHA_BREAKOUT = 4           // Breakout Trading (Volatility)
};

//+------------------------------------------------------------------+
//| INPUT PARAMETERS                                                  |
//+------------------------------------------------------------------+
input group "=== MODE SELECTOR ==="
input ENUM_GAME_MODE InpGameMode = MODE_SCALPER;  // Game Mode

input group "=== KILLZONE SETTINGS ==="
input bool InpShowKillzones = true;          // Show Killzone Boxes
input ENUM_DISPLAY_MODE InpDisplayMode = DISPLAY_PRESENT; // Display Mode
input ENUM_KZ_STYLE InpKZStyle = KZ_STYLE_OUTLINE; // Killzone Style
input bool InpShowKZPivots = true;           // Show Session High/Low Pivots
input bool InpExtendKZPivots = true;         // Extend Pivots to Current Bar
input int InpKZHistoryDays = 3;              // Days of History (Historical Mode)

input group "=== SESSION TIMES ==="
input string InpBrokerNote = "Adjust GMT offset below to match your broker"; // Broker Note
input bool InpShowAsian = true;              // Show Asian Range
input int InpAsianStart = 2;                 // Asian Start (02:00 = 8PM EST)
input int InpAsianEnd = 8;                   // Asian End (08:00 = 1AM EST)
input color InpAsianColor = C'45,55,85';     // Asian Color (Midnight Blue)

input bool InpShowLondon = true;             // Show London Killzone  
input int InpLondonStart = 10;               // London Start (10:00 = 3AM EST)
input int InpLondonEnd = 12;                 // London End (12:00 = 5AM EST)
input color InpLondonColor = C'25,85,100';   // London Color (Deep Cyan)

input bool InpShowNY = true;                 // Show NY Killzone
input int InpNYStart = 15;                   // NY Start (15:00 = 8AM EST)
input int InpNYEnd = 19;                     // NY End (19:00 = 12PM EST)
input color InpNYColor = C'140,90,35';       // NY Color (Amber Gold)

input int InpScalperLondonStart = 10;        // Scalper London Start
input int InpScalperLondonEnd = 12;          // Scalper London End
input int InpScalperNYStart = 15;            // Scalper NY Start
input int InpScalperNYEnd = 19;              // Scalper NY End
input int InpDayTradeStart = 10;             // DayTrader Start Hour
input int InpDayTradeEnd = 21;               // DayTrader End Hour

input group "=== BOLLINGER BANDS ==="
input int InpBBPeriod = 20;                  // BB Period
input double InpBBDeviation = 2.0;           // BB Deviation (Standard: 2.0)
input bool InpShowBB = true;                 // Show Bollinger Bands

input group "=== EMA SETTINGS ==="
input int InpEMAFast = 8;                    // EMA Fast Period
input int InpEMASlow = 21;                   // EMA Slow Period
input int InpEMATrend = 200;                 // EMA Trend (Swing Mode)
input int InpEMATrail = 5;                   // EMA Trail (Visual Trailing)
input bool InpShowEMAs = true;               // Show EMA Lines

input group "=== SMC SETTINGS ==="
input bool InpShowOrderBlocks = true;        // Show Order Blocks
input bool InpShowBOS = true;                // Show Break of Structure
input bool InpShowCHoCH = true;              // Show Change of Character
input int InpSwingStrength = 3;              // Swing Detection Strength (2-10)
input int InpMaxOBCount = 5;                 // Max Order Blocks to Show
input color InpBullOBColor = C'0,100,80';     // Bullish OB Color (Teal Green)
input color InpBearOBColor = C'120,40,60';    // Bearish OB Color (Deep Red)
input color InpBOSColor = C'70,130,180';     // BOS Color (Steel Blue)
input color InpCHoCHColor = C'180,120,90';   // CHoCH Color (Muted Coral)

input group "=== SIGNAL SETTINGS ==="
input bool InpShowBBSignals = true;          // Show BB Touch Signals
input int InpLookback = 3;                   // BB Touch Lookback
input bool InpConfirmedSignalsOnly = true;   // Confirmed Signals Only (Anti-Repaint)

input group "=== ALERT SETTINGS ==="
input bool InpEnableAlerts = true;           // Enable Alerts
input bool InpAlertPush = true;              // Push Notification (Mobile)
input bool InpAlertSound = true;             // Sound Alert
input bool InpAlertPopup = true;             // Popup Alert
input string InpAlertSoundFile = "alert.wav"; // Sound File

input group "=== BROKER TIME SETTINGS ==="
input int InpGMTOffset = 2;                  // Broker GMT Offset (Common: IC Markets=2/3, FTMO=2/3, OANDA=0, Exness=0)

input group "=== VISUAL SETTINGS ==="
input int InpArrowSize = 3;                  // Arrow Size (1-5)
input color InpPivotHighColor = C'80,180,140';  // Pivot High Color (Soft Mint)
input color InpPivotLowColor = C'180,100,110';  // Pivot Low Color (Soft Rose)

input group "=== ALPHA EDGE STRATEGY ==="
input ENUM_ALPHA_STRATEGY InpAlphaStrategy = ALPHA_OFF;  // A+ Strategy Mode
input int InpRSIPeriod = 2;                   // RSI Period (2 for Mean Reversion)
input int InpRSIOversold = 15;                // RSI Oversold Level (Buy Zone)
input int InpRSIOverbought = 85;              // RSI Overbought Level (Sell Zone)
input int InpATRPeriod = 14;                  // ATR Period (Breakout Volatility)
input double InpATRMultiplier = 1.5;          // ATR Multiplier (Stop Distance)
input bool InpShowAlphaLabels = true;         // Show Alpha Edge Labels

input group "=== HTF (HIGHER TIMEFRAME) ==="
input bool InpShowHTF = true;                 // Enable HTF Analysis
input ENUM_TIMEFRAMES InpHTFTimeframe = PERIOD_H1; // HTF Timeframe (e.g., H1 on M15)
input bool InpShowHTFOB = true;               // Show HTF Order Blocks
input bool InpShowHTFFVG = true;              // Show HTF Fair Value Gaps
input int InpHTFLookback = 100;               // HTF Bars to Analyze
input color InpHTFBullColor = C'0,150,100';   // HTF Bullish Color
input color InpHTFBearColor = C'150,50,70';   // HTF Bearish Color

input group "=== SUSPENSION BLOCKS ==="
input bool InpShowSB = false;                 // Show Suspension Blocks (ICT 2025)
input int InpSBLookback = 50;                 // SB Detection Lookback
input double InpSBMinGapATR = 0.1;            // Min Gap Size (ATR Multiple)
input color InpSBColor = C'255,180,0';        // Suspension Block Color (Amber)
input int InpMaxSBCount = 3;                  // Max Suspension Blocks to Show

//+------------------------------------------------------------------+
//| STRUCTURES                                                        |
//+------------------------------------------------------------------+
struct SwingPoint
{
   int      index;
   double   price;
   datetime time;
   bool     isHigh;
   bool     broken;
};

struct OrderBlock
{
   double   top;
   double   bottom;
   datetime startTime;
   datetime endTime;
   bool     isBullish;
   bool     valid;
   string   name;
};

struct KillzoneSession
{
   datetime startTime;
   datetime endTime;
   double   high;
   double   low;
   bool     valid;
   string   boxName;
   string   highLineName;
   string   lowLineName;
   string   labelName;
   string   sessionType;
};

// HTF (Higher Timeframe) structures
struct HTFOrderBlock
{
   double   top;
   double   bottom;
   datetime startTime;
   datetime endTime;
   bool     isBullish;
   bool     valid;
   string   name;
};

struct HTFFairValueGap
{
   double   top;
   double   bottom;
   datetime gapTime;
   bool     isBullish;
   bool     valid;
   string   name;
};

// Suspension Block (ICT 2025) - Dual imbalance zone
struct SuspensionBlock
{
   double   top;
   double   bottom;
   datetime startTime;
   datetime endTime;
   bool     isBullish;
   bool     valid;
   string   name;
};

//+------------------------------------------------------------------+
//| GLOBAL VARIABLES                                                  |
//+------------------------------------------------------------------+
SwingPoint swingHighs[];
SwingPoint swingLows[];
OrderBlock orderBlocks[];
KillzoneSession killzones[];

// HTF arrays
HTFOrderBlock htfOrderBlocks[];
HTFFairValueGap htfFVGs[];

// Suspension Blocks array
SuspensionBlock suspensionBlocks[];

double BBUpperBuffer[];
double BBMiddleBuffer[];
double BBLowerBuffer[];
double EMAFastBuffer[];
double EMASlowBuffer[];
double EMATrendBuffer[];
double BuyBuffer[];
double SellBuffer[];
double StructureBuffer[];

int handleBB;
int handleEMAFast;
int handleEMASlow;
int handleEMATrend;
int handleEMATrail;
int handleRSI;      // Alpha Edge: RSI for Mean Reversion
int handleATR;      // Alpha Edge: ATR for Breakout/Stops
int handleSMA200;   // Alpha Edge: 200 SMA for Trend Filter

// Alpha Edge buffers
double RSIBuffer[];
double ATRBuffer[];
double SMA200Buffer[];

string dashboardName = "RBFX_Dashboard";
string infoName = "RBFX_Info";
string prefix = "RBFX_";
int objCounter = 0;

// Alert tracking
datetime lastAlertTime = 0;
int lastAlertType = 0;  // 1 = Buy, -1 = Sell

//+------------------------------------------------------------------+
//| Initialization                                                     |
//+------------------------------------------------------------------+
int OnInit()
{
   SetIndexBuffer(0, BBUpperBuffer, INDICATOR_DATA);
   SetIndexBuffer(1, BBMiddleBuffer, INDICATOR_DATA);
   SetIndexBuffer(2, BBLowerBuffer, INDICATOR_DATA);
   SetIndexBuffer(3, EMAFastBuffer, INDICATOR_DATA);
   SetIndexBuffer(4, EMASlowBuffer, INDICATOR_DATA);
   SetIndexBuffer(5, EMATrendBuffer, INDICATOR_DATA);
   SetIndexBuffer(6, BuyBuffer, INDICATOR_DATA);
   SetIndexBuffer(7, SellBuffer, INDICATOR_DATA);
   SetIndexBuffer(8, StructureBuffer, INDICATOR_DATA);
   
   if(!InpShowBB)
   {
      PlotIndexSetInteger(0, PLOT_DRAW_TYPE, DRAW_NONE);
      PlotIndexSetInteger(1, PLOT_DRAW_TYPE, DRAW_NONE);
      PlotIndexSetInteger(2, PLOT_DRAW_TYPE, DRAW_NONE);
   }
   
   if(!InpShowEMAs)
   {
      PlotIndexSetInteger(3, PLOT_DRAW_TYPE, DRAW_NONE);
      PlotIndexSetInteger(4, PLOT_DRAW_TYPE, DRAW_NONE);
   }
   
   if(InpGameMode != MODE_SWING)
      PlotIndexSetInteger(5, PLOT_DRAW_TYPE, DRAW_NONE);
   
   PlotIndexSetInteger(6, PLOT_ARROW, 233);
   PlotIndexSetInteger(7, PLOT_ARROW, 234);
   PlotIndexSetInteger(8, PLOT_ARROW, 159);
   
   PlotIndexSetInteger(6, PLOT_ARROW_SHIFT, 25);
   PlotIndexSetInteger(7, PLOT_ARROW_SHIFT, -25);
   PlotIndexSetInteger(8, PLOT_ARROW_SHIFT, 0);
   
   PlotIndexSetInteger(6, PLOT_LINE_WIDTH, InpArrowSize);
   PlotIndexSetInteger(7, PLOT_LINE_WIDTH, InpArrowSize);
   PlotIndexSetInteger(8, PLOT_LINE_WIDTH, 2);
   
   PlotIndexSetDouble(6, PLOT_EMPTY_VALUE, EMPTY_VALUE);
   PlotIndexSetDouble(7, PLOT_EMPTY_VALUE, EMPTY_VALUE);
   PlotIndexSetDouble(8, PLOT_EMPTY_VALUE, EMPTY_VALUE);
   
   handleBB = iBands(_Symbol, PERIOD_CURRENT, InpBBPeriod, 0, InpBBDeviation, PRICE_CLOSE);
   handleEMAFast = iMA(_Symbol, PERIOD_CURRENT, InpEMAFast, 0, MODE_EMA, PRICE_CLOSE);
   handleEMASlow = iMA(_Symbol, PERIOD_CURRENT, InpEMASlow, 0, MODE_EMA, PRICE_CLOSE);
   handleEMATrend = iMA(_Symbol, PERIOD_CURRENT, InpEMATrend, 0, MODE_EMA, PRICE_CLOSE);
   handleEMATrail = iMA(_Symbol, PERIOD_CURRENT, InpEMATrail, 0, MODE_EMA, PRICE_CLOSE);
   
   // Alpha Edge indicators
   handleRSI = iRSI(_Symbol, PERIOD_CURRENT, InpRSIPeriod, PRICE_CLOSE);
   handleATR = iATR(_Symbol, PERIOD_CURRENT, InpATRPeriod);
   handleSMA200 = iMA(_Symbol, PERIOD_D1, 200, 0, MODE_SMA, PRICE_CLOSE);  // Daily 200 SMA for trend filter
   
   if(handleBB == INVALID_HANDLE || handleEMAFast == INVALID_HANDLE || 
      handleEMASlow == INVALID_HANDLE || handleEMATrend == INVALID_HANDLE ||
      handleEMATrail == INVALID_HANDLE || handleRSI == INVALID_HANDLE ||
      handleATR == INVALID_HANDLE || handleSMA200 == INVALID_HANDLE)
   {
      Print("Error creating indicator handles!");
      return(INIT_FAILED);
   }
   
   ArrayResize(swingHighs, 0);
   ArrayResize(swingLows, 0);
   ArrayResize(orderBlocks, 0);
   ArrayResize(killzones, 0);
   
   CreateDashboard();
   
   // Update indicator name based on mode
   string modeName = GetModeName();
   if(InpAlphaStrategy != ALPHA_OFF)
      modeName = modeName + " | Alpha: " + GetAlphaStrategyName();
   IndicatorSetString(INDICATOR_SHORTNAME, "RetailBeastFX [" + modeName + "]");
   
   string alertStatus = InpEnableAlerts ? "ON" : "OFF";
   string repaintStatus = InpConfirmedSignalsOnly ? "Protected" : "Aggressive";
   string alphaStatus = InpAlphaStrategy != ALPHA_OFF ? GetAlphaStrategyName() : "OFF";
   
   // Initialize HTF arrays
   ArrayResize(htfOrderBlocks, 0);
   ArrayResize(htfFVGs, 0);
   
   // Initialize Suspension Blocks array
   ArrayResize(suspensionBlocks, 0);
   
   // Process HTF zones on init
   ProcessHTFOrderBlocks();
   ProcessHTFFVGs();
   
   // Set timer to refresh HTF data every 60 seconds
   EventSetTimer(60);
   
   string htfStatus = InpShowHTF ? EnumToString(InpHTFTimeframe) : "OFF";
   Print(StringFormat("RetailBeastFX Premium v8.0 initialized | GMT%+d | Alerts: %s | Alpha: %s | HTF: %s",
                       InpGMTOffset, alertStatus, alphaStatus, htfStatus));
   
   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Deinitialization                                                   |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   if(handleBB != INVALID_HANDLE) IndicatorRelease(handleBB);
   if(handleEMAFast != INVALID_HANDLE) IndicatorRelease(handleEMAFast);
   if(handleEMASlow != INVALID_HANDLE) IndicatorRelease(handleEMASlow);
   if(handleEMATrend != INVALID_HANDLE) IndicatorRelease(handleEMATrend);
   if(handleEMATrail != INVALID_HANDLE) IndicatorRelease(handleEMATrail);
   
   // Alpha Edge handles
   if(handleRSI != INVALID_HANDLE) IndicatorRelease(handleRSI);
   if(handleATR != INVALID_HANDLE) IndicatorRelease(handleATR);
   if(handleSMA200 != INVALID_HANDLE) IndicatorRelease(handleSMA200);
   
   ObjectsDeleteAll(0, prefix);
   ObjectDelete(0, dashboardName);
   ObjectDelete(0, infoName);
   EventKillTimer();
   Comment("");
}

//+------------------------------------------------------------------+
//| Timer Event - Refresh HTF Data                                     |
//+------------------------------------------------------------------+
void OnTimer()
{
   ProcessHTFOrderBlocks();
   ProcessHTFFVGs();
   ChartRedraw(0);
}

//+------------------------------------------------------------------+
//| Draw Killzone Box                                                  |
//+------------------------------------------------------------------+
void DrawKillzoneBox(KillzoneSession &kz, color kzColor)
{
   if(!kz.valid) return;
   
   ObjectDelete(0, kz.boxName);
   
   if(InpKZStyle == KZ_STYLE_FILLED || InpKZStyle == KZ_STYLE_OUTLINE)
   {
      ObjectCreate(0, kz.boxName, OBJ_RECTANGLE, 0, kz.startTime, kz.high, kz.endTime, kz.low);
      ObjectSetInteger(0, kz.boxName, OBJPROP_COLOR, kzColor);
      ObjectSetInteger(0, kz.boxName, OBJPROP_FILL, InpKZStyle == KZ_STYLE_FILLED);
      ObjectSetInteger(0, kz.boxName, OBJPROP_BACK, true);
      ObjectSetInteger(0, kz.boxName, OBJPROP_SELECTABLE, false);
      ObjectSetInteger(0, kz.boxName, OBJPROP_HIDDEN, true);
      ObjectSetInteger(0, kz.boxName, OBJPROP_WIDTH, 1);
   }
   else
   {
      string topLine = kz.boxName + "_top";
      string botLine = kz.boxName + "_bot";
      
      ObjectDelete(0, topLine);
      ObjectDelete(0, botLine);
      
      ObjectCreate(0, topLine, OBJ_TREND, 0, kz.startTime, kz.high, kz.endTime, kz.high);
      ObjectSetInteger(0, topLine, OBJPROP_COLOR, kzColor);
      ObjectSetInteger(0, topLine, OBJPROP_WIDTH, 2);
      ObjectSetInteger(0, topLine, OBJPROP_RAY_RIGHT, false);
      ObjectSetInteger(0, topLine, OBJPROP_BACK, true);
      ObjectSetInteger(0, topLine, OBJPROP_SELECTABLE, false);
      
      ObjectCreate(0, botLine, OBJ_TREND, 0, kz.startTime, kz.low, kz.endTime, kz.low);
      ObjectSetInteger(0, botLine, OBJPROP_COLOR, kzColor);
      ObjectSetInteger(0, botLine, OBJPROP_WIDTH, 2);
      ObjectSetInteger(0, botLine, OBJPROP_RAY_RIGHT, false);
      ObjectSetInteger(0, botLine, OBJPROP_BACK, true);
      ObjectSetInteger(0, botLine, OBJPROP_SELECTABLE, false);
   }
   
   ObjectDelete(0, kz.labelName);
   ObjectCreate(0, kz.labelName, OBJ_TEXT, 0, kz.startTime, kz.high);
   ObjectSetString(0, kz.labelName, OBJPROP_TEXT, kz.sessionType);
   
   // Use brighter label colors for readability
   color labelColor = kzColor;
   if(kz.sessionType == "ASIAN") labelColor = C'100,140,200';      // Bright Blue
   else if(kz.sessionType == "LONDON") labelColor = C'80,180,200'; // Bright Cyan
   else if(kz.sessionType == "NY") labelColor = C'220,170,80';     // Bright Gold
   
   ObjectSetInteger(0, kz.labelName, OBJPROP_COLOR, labelColor);
   ObjectSetInteger(0, kz.labelName, OBJPROP_FONTSIZE, 9);
   ObjectSetString(0, kz.labelName, OBJPROP_FONT, "Arial Bold");
   ObjectSetInteger(0, kz.labelName, OBJPROP_ANCHOR, ANCHOR_LEFT_LOWER);
   ObjectSetInteger(0, kz.labelName, OBJPROP_SELECTABLE, false);
}

//+------------------------------------------------------------------+
//| Draw Pivot Lines                                                   |
//+------------------------------------------------------------------+
void DrawPivotLines(KillzoneSession &kz, datetime extendTo)
{
   if(!InpShowKZPivots || !kz.valid) return;
   
   ObjectDelete(0, kz.highLineName);
   ObjectDelete(0, kz.lowLineName);
   
   datetime endTime = InpExtendKZPivots ? extendTo : kz.endTime;
   
   ObjectCreate(0, kz.highLineName, OBJ_TREND, 0, kz.endTime, kz.high, endTime, kz.high);
   ObjectSetInteger(0, kz.highLineName, OBJPROP_COLOR, InpPivotHighColor);
   ObjectSetInteger(0, kz.highLineName, OBJPROP_STYLE, STYLE_DOT);
   ObjectSetInteger(0, kz.highLineName, OBJPROP_WIDTH, 1);
   ObjectSetInteger(0, kz.highLineName, OBJPROP_RAY_RIGHT, InpExtendKZPivots);
   ObjectSetInteger(0, kz.highLineName, OBJPROP_BACK, true);
   ObjectSetInteger(0, kz.highLineName, OBJPROP_SELECTABLE, false);
   
   ObjectCreate(0, kz.lowLineName, OBJ_TREND, 0, kz.endTime, kz.low, endTime, kz.low);
   ObjectSetInteger(0, kz.lowLineName, OBJPROP_COLOR, InpPivotLowColor);
   ObjectSetInteger(0, kz.lowLineName, OBJPROP_STYLE, STYLE_DOT);
   ObjectSetInteger(0, kz.lowLineName, OBJPROP_WIDTH, 1);
   ObjectSetInteger(0, kz.lowLineName, OBJPROP_RAY_RIGHT, InpExtendKZPivots);
   ObjectSetInteger(0, kz.lowLineName, OBJPROP_BACK, true);
   ObjectSetInteger(0, kz.lowLineName, OBJPROP_SELECTABLE, false);
   
   string highLabel = kz.highLineName + "_lbl";
   string lowLabel = kz.lowLineName + "_lbl";
   
   ObjectDelete(0, highLabel);
   ObjectDelete(0, lowLabel);
   
   ObjectCreate(0, highLabel, OBJ_TEXT, 0, kz.endTime, kz.high);
   ObjectSetString(0, highLabel, OBJPROP_TEXT, kz.sessionType + " H");
   ObjectSetInteger(0, highLabel, OBJPROP_COLOR, InpPivotHighColor);
   ObjectSetInteger(0, highLabel, OBJPROP_FONTSIZE, 7);
   ObjectSetInteger(0, highLabel, OBJPROP_ANCHOR, ANCHOR_LEFT_LOWER);
   ObjectSetInteger(0, highLabel, OBJPROP_SELECTABLE, false);
   
   ObjectCreate(0, lowLabel, OBJ_TEXT, 0, kz.endTime, kz.low);
   ObjectSetString(0, lowLabel, OBJPROP_TEXT, kz.sessionType + " L");
   ObjectSetInteger(0, lowLabel, OBJPROP_COLOR, InpPivotLowColor);
   ObjectSetInteger(0, lowLabel, OBJPROP_FONTSIZE, 7);
   ObjectSetInteger(0, lowLabel, OBJPROP_ANCHOR, ANCHOR_LEFT_UPPER);
   ObjectSetInteger(0, lowLabel, OBJPROP_SELECTABLE, false);
}

//+------------------------------------------------------------------+
//| Process Killzones                                                  |
//+------------------------------------------------------------------+
void ProcessKillzones(const double &high[], const double &low[], 
                      const datetime &time[], int rates_total)
{
   if(!InpShowKillzones) return;
   
   for(int i = 0; i < ArraySize(killzones); i++)
   {
      ObjectDelete(0, killzones[i].boxName);
      ObjectDelete(0, killzones[i].highLineName);
      ObjectDelete(0, killzones[i].lowLineName);
      ObjectDelete(0, killzones[i].labelName);
      ObjectDelete(0, killzones[i].boxName + "_top");
      ObjectDelete(0, killzones[i].boxName + "_bot");
      ObjectDelete(0, killzones[i].highLineName + "_lbl");
      ObjectDelete(0, killzones[i].lowLineName + "_lbl");
   }
   ArrayResize(killzones, 0);
   
   datetime currentTime = time[rates_total - 1];
   
   // Calculate search start time based on display mode
   datetime startSearchTime;
   if(InpDisplayMode == DISPLAY_PRESENT)
   {
      // Present mode: Only show today's killzones
      MqlDateTime today;
      TimeToStruct(currentTime, today);
      today.hour = 0;
      today.min = 0;
      today.sec = 0;
      startSearchTime = StructToTime(today);
   }
   else
   {
      // Historical mode: Use full history days setting
      startSearchTime = currentTime - InpKZHistoryDays * 86400;
   }
   
   int startIdx = 0;
   for(int i = rates_total - 1; i >= 0; i--)
   {
      if(time[i] < startSearchTime)
      {
         startIdx = i;
         break;
      }
   }
   
   bool inAsian = false, inLondon = false, inNY = false;
   datetime asianStart = 0, londonStart = 0, nyStart = 0;
   double asianHigh = 0, asianLow = DBL_MAX;
   double londonHigh = 0, londonLow = DBL_MAX;
   double nyHigh = 0, nyLow = DBL_MAX;
   
   for(int i = startIdx; i < rates_total; i++)
   {
      MqlDateTime dt;
      TimeToStruct(time[i], dt);
      
      // Apply GMT offset adjustment for universal broker support
      int adjustment = 2 - InpGMTOffset;
      int hour = (dt.hour + adjustment + 24) % 24;
      
      // ASIAN SESSION
      if(InpShowAsian)
      {
         bool isAsianHour = (hour >= InpAsianStart && hour < InpAsianEnd);
         
         if(isAsianHour && !inAsian)
         {
            inAsian = true;
            asianStart = time[i];
            asianHigh = high[i];
            asianLow = low[i];
         }
         else if(isAsianHour && inAsian)
         {
            if(high[i] > asianHigh) asianHigh = high[i];
            if(low[i] < asianLow) asianLow = low[i];
         }
         else if(!isAsianHour && inAsian)
         {
            inAsian = false;
            if(i > 0)
               CreateKillzone("ASIAN", asianStart, time[i-1], asianHigh, asianLow, 
                              InpAsianColor, currentTime);
            asianHigh = 0;
            asianLow = DBL_MAX;
         }
      }
      
      // LONDON SESSION
      if(InpShowLondon)
      {
         bool isLondonHour = (hour >= InpLondonStart && hour < InpLondonEnd);
         
         if(isLondonHour && !inLondon)
         {
            inLondon = true;
            londonStart = time[i];
            londonHigh = high[i];
            londonLow = low[i];
         }
         else if(isLondonHour && inLondon)
         {
            if(high[i] > londonHigh) londonHigh = high[i];
            if(low[i] < londonLow) londonLow = low[i];
         }
         else if(!isLondonHour && inLondon)
         {
            inLondon = false;
            if(i > 0)
               CreateKillzone("LONDON", londonStart, time[i-1], londonHigh, londonLow,
                              InpLondonColor, currentTime);
            londonHigh = 0;
            londonLow = DBL_MAX;
         }
      }
      
      // NY SESSION
      if(InpShowNY)
      {
         bool isNYHour = (hour >= InpNYStart && hour < InpNYEnd);
         
         if(isNYHour && !inNY)
         {
            inNY = true;
            nyStart = time[i];
            nyHigh = high[i];
            nyLow = low[i];
         }
         else if(isNYHour && inNY)
         {
            if(high[i] > nyHigh) nyHigh = high[i];
            if(low[i] < nyLow) nyLow = low[i];
         }
         else if(!isNYHour && inNY)
         {
            inNY = false;
            if(i > 0)
               CreateKillzone("NY", nyStart, time[i-1], nyHigh, nyLow,
                              InpNYColor, currentTime);
            nyHigh = 0;
            nyLow = DBL_MAX;
         }
      }
   }
   
   datetime extendTime = currentTime + PeriodSeconds() * 5;
   
   if(inAsian && asianHigh > 0)
      CreateKillzone("ASIAN", asianStart, extendTime, asianHigh, asianLow, InpAsianColor, currentTime);
   if(inLondon && londonHigh > 0)
      CreateKillzone("LONDON", londonStart, extendTime, londonHigh, londonLow, InpLondonColor, currentTime);
   if(inNY && nyHigh > 0)
      CreateKillzone("NY", nyStart, extendTime, nyHigh, nyLow, InpNYColor, currentTime);
   
   // London/NY Overlap Highlight (Power Hour)
   if(inLondon && inNY && londonHigh > 0 && nyHigh > 0)
   {
      string overlapName = prefix + "LN_Overlap";
      ObjectDelete(0, overlapName);
      
      double overlapHigh = MathMax(londonHigh, nyHigh);
      double overlapLow = MathMin(londonLow, nyLow);
      datetime overlapStart = MathMax(londonStart, nyStart);
      
      ObjectCreate(0, overlapName, OBJ_RECTANGLE, 0, overlapStart, overlapHigh, extendTime, overlapLow);
      ObjectSetInteger(0, overlapName, OBJPROP_COLOR, C'30,144,255');  // Dodger Blue
      ObjectSetInteger(0, overlapName, OBJPROP_FILL, true);
      ObjectSetInteger(0, overlapName, OBJPROP_BACK, true);
      ObjectSetInteger(0, overlapName, OBJPROP_SELECTABLE, false);
      
      // Overlap Label
      string overlapLbl = prefix + "LN_Overlap_Lbl";
      ObjectDelete(0, overlapLbl);
      ObjectCreate(0, overlapLbl, OBJ_TEXT, 0, overlapStart, overlapHigh);
      ObjectSetString(0, overlapLbl, OBJPROP_TEXT, "POWER HOUR");
      ObjectSetInteger(0, overlapLbl, OBJPROP_COLOR, C'100,180,255');
      ObjectSetInteger(0, overlapLbl, OBJPROP_FONTSIZE, 8);
      ObjectSetString(0, overlapLbl, OBJPROP_FONT, "Arial Bold");
      ObjectSetInteger(0, overlapLbl, OBJPROP_ANCHOR, ANCHOR_LEFT_LOWER);
      ObjectSetInteger(0, overlapLbl, OBJPROP_SELECTABLE, false);
   }
   else
   {
      ObjectDelete(0, prefix + "LN_Overlap");
      ObjectDelete(0, prefix + "LN_Overlap_Lbl");
   }
}

//+------------------------------------------------------------------+
//| Create Killzone                                                    |
//+------------------------------------------------------------------+
void CreateKillzone(string sessionType, datetime startTime, datetime endTime,
                    double high, double low, color kzColor, datetime extendTo)
{
   int size = ArraySize(killzones);
   ArrayResize(killzones, size + 1);
   
   killzones[size].startTime = startTime;
   killzones[size].endTime = endTime;
   killzones[size].high = high;
   killzones[size].low = low;
   killzones[size].valid = true;
   killzones[size].sessionType = sessionType;
   killzones[size].boxName = prefix + "KZ_" + sessionType + "_" + IntegerToString(objCounter++);
   killzones[size].highLineName = prefix + "KZH_" + sessionType + "_" + IntegerToString(objCounter++);
   killzones[size].lowLineName = prefix + "KZL_" + sessionType + "_" + IntegerToString(objCounter++);
   killzones[size].labelName = prefix + "KZLbl_" + sessionType + "_" + IntegerToString(objCounter++);
   
   DrawKillzoneBox(killzones[size], kzColor);
   DrawPivotLines(killzones[size], extendTo);
}

//+------------------------------------------------------------------+
//| Detect Swing Points                                                |
//+------------------------------------------------------------------+
void DetectSwingPoints(const double &high[], const double &low[], 
                       const datetime &time[], int rates_total)
{
   ArrayResize(swingHighs, 0);
   ArrayResize(swingLows, 0);
   
   int strength = InpSwingStrength;
   
   for(int i = strength; i < rates_total - strength; i++)
   {
      bool isSwingHigh = true;
      for(int j = 1; j <= strength; j++)
      {
         if(high[i] <= high[i-j] || high[i] <= high[i+j])
         {
            isSwingHigh = false;
            break;
         }
      }
      
      if(isSwingHigh)
      {
         int size = ArraySize(swingHighs);
         ArrayResize(swingHighs, size + 1);
         swingHighs[size].index = i;
         swingHighs[size].price = high[i];
         swingHighs[size].time = time[i];
         swingHighs[size].isHigh = true;
         swingHighs[size].broken = false;
      }
      
      bool isSwingLow = true;
      for(int j = 1; j <= strength; j++)
      {
         if(low[i] >= low[i-j] || low[i] >= low[i+j])
         {
            isSwingLow = false;
            break;
         }
      }
      
      if(isSwingLow)
      {
         int size = ArraySize(swingLows);
         ArrayResize(swingLows, size + 1);
         swingLows[size].index = i;
         swingLows[size].price = low[i];
         swingLows[size].time = time[i];
         swingLows[size].isHigh = false;
         swingLows[size].broken = false;
      }
   }
}

//+------------------------------------------------------------------+
//| Draw Order Block (ICT Style)                                       |
//+------------------------------------------------------------------+
void DrawOrderBlock(OrderBlock &ob)
{
   if(!ob.valid) return;
   
   // Delete existing objects
   ObjectDelete(0, ob.name);
   ObjectDelete(0, ob.name + "_eq");
   ObjectDelete(0, ob.name + "_lbl");
   
   color obColor = ob.isBullish ? InpBullOBColor : InpBearOBColor;
   
   // Main OB rectangle - FILLED for better visibility
   if(!ObjectCreate(0, ob.name, OBJ_RECTANGLE, 0, ob.startTime, ob.top, ob.endTime, ob.bottom))
      return;
   
   ObjectSetInteger(0, ob.name, OBJPROP_COLOR, obColor);
   ObjectSetInteger(0, ob.name, OBJPROP_FILL, true);   // FILLED box for visibility
   ObjectSetInteger(0, ob.name, OBJPROP_WIDTH, 2);
   ObjectSetInteger(0, ob.name, OBJPROP_BACK, true);
   ObjectSetInteger(0, ob.name, OBJPROP_SELECTABLE, false);
   ObjectSetInteger(0, ob.name, OBJPROP_HIDDEN, true);
   
   // 50% Equilibrium line (key ICT concept)
   double eqPrice = (ob.top + ob.bottom) / 2.0;
   string eqName = ob.name + "_eq";
   ObjectCreate(0, eqName, OBJ_TREND, 0, ob.startTime, eqPrice, ob.endTime, eqPrice);
   ObjectSetInteger(0, eqName, OBJPROP_COLOR, obColor);
   ObjectSetInteger(0, eqName, OBJPROP_STYLE, STYLE_DOT);
   ObjectSetInteger(0, eqName, OBJPROP_WIDTH, 1);
   ObjectSetInteger(0, eqName, OBJPROP_RAY_RIGHT, false);
   ObjectSetInteger(0, eqName, OBJPROP_BACK, true);
   ObjectSetInteger(0, eqName, OBJPROP_SELECTABLE, false);
   
   // OB Label
   string lblName = ob.name + "_lbl";
   string lblText = ob.isBullish ? "Bull OB" : "Bear OB";
   ObjectCreate(0, lblName, OBJ_TEXT, 0, ob.startTime, ob.isBullish ? ob.bottom : ob.top);
   ObjectSetString(0, lblName, OBJPROP_TEXT, lblText);
   ObjectSetInteger(0, lblName, OBJPROP_COLOR, obColor);
   ObjectSetInteger(0, lblName, OBJPROP_FONTSIZE, 7);
   ObjectSetString(0, lblName, OBJPROP_FONT, "Arial");
   ObjectSetInteger(0, lblName, OBJPROP_ANCHOR, ob.isBullish ? ANCHOR_LEFT_UPPER : ANCHOR_LEFT_LOWER);
   ObjectSetInteger(0, lblName, OBJPROP_SELECTABLE, false);
}

//+------------------------------------------------------------------+
//| Draw BOS/CHoCH Line                                                |
//+------------------------------------------------------------------+
void DrawStructureLine(datetime time1, double price1, datetime time2, double price2, 
                       bool isBOS, bool isBullish)
{
   string name = prefix + (isBOS ? "BOS_" : "CHoCH_") + IntegerToString(objCounter++);
   ObjectDelete(0, name);
   
   if(!ObjectCreate(0, name, OBJ_TREND, 0, time1, price1, time2, price2))
      return;
   
   color lineColor = isBOS ? InpBOSColor : InpCHoCHColor;
   
   ObjectSetInteger(0, name, OBJPROP_COLOR, lineColor);
   ObjectSetInteger(0, name, OBJPROP_STYLE, STYLE_DASH);
   ObjectSetInteger(0, name, OBJPROP_WIDTH, 1);
   ObjectSetInteger(0, name, OBJPROP_RAY_RIGHT, false);
   ObjectSetInteger(0, name, OBJPROP_SELECTABLE, false);
   ObjectSetInteger(0, name, OBJPROP_BACK, true);
   
   string labelName = name + "_label";
   ObjectDelete(0, labelName);
   ObjectCreate(0, labelName, OBJ_TEXT, 0, time2, price2);
   ObjectSetString(0, labelName, OBJPROP_TEXT, isBOS ? "BOS" : "CHoCH");
   ObjectSetInteger(0, labelName, OBJPROP_COLOR, lineColor);
   ObjectSetInteger(0, labelName, OBJPROP_FONTSIZE, 7);
   ObjectSetString(0, labelName, OBJPROP_FONT, "Arial");
   ObjectSetInteger(0, labelName, OBJPROP_ANCHOR, isBullish ? ANCHOR_LOWER : ANCHOR_UPPER);
   ObjectSetInteger(0, labelName, OBJPROP_SELECTABLE, false);
}

//+------------------------------------------------------------------+
//| Create Order Block                                                 |
//+------------------------------------------------------------------+
void CreateOrderBlock(int swingIndex, const double &high[], const double &low[], 
                      const double &open[], const double &close[],
                      const datetime &time[], bool isBullish, int rates_total)
{
   if(swingIndex < 1 || swingIndex >= rates_total - 1) return;
   
   int obIndex = -1;
   
   if(isBullish)
   {
      for(int i = swingIndex - 1; i >= MathMax(0, swingIndex - 10); i--)
      {
         if(close[i] < open[i])
         {
            obIndex = i;
            break;
         }
      }
   }
   else
   {
      for(int i = swingIndex - 1; i >= MathMax(0, swingIndex - 10); i--)
      {
         if(close[i] > open[i])
         {
            obIndex = i;
            break;
         }
      }
   }
   
   if(obIndex < 0) return;
   
   int currentCount = 0;
   for(int i = 0; i < ArraySize(orderBlocks); i++)
   {
      if(orderBlocks[i].valid) currentCount++;
   }
   
   if(currentCount >= InpMaxOBCount)
   {
      for(int i = 0; i < ArraySize(orderBlocks); i++)
      {
         if(orderBlocks[i].valid)
         {
            ObjectDelete(0, orderBlocks[i].name);
            ObjectDelete(0, orderBlocks[i].name + "_eq");
            ObjectDelete(0, orderBlocks[i].name + "_lbl");
            orderBlocks[i].valid = false;
            break;
         }
      }
   }
   
   OrderBlock newOB;
   newOB.top = high[obIndex];
   newOB.bottom = low[obIndex];
   newOB.startTime = time[obIndex];
   newOB.endTime = time[rates_total - 1] + PeriodSeconds() * 20;
   newOB.isBullish = isBullish;
   newOB.valid = true;
   newOB.name = prefix + "OB_" + IntegerToString(objCounter++);
   
   int size = ArraySize(orderBlocks);
   ArrayResize(orderBlocks, size + 1);
   orderBlocks[size] = newOB;
   
   DrawOrderBlock(orderBlocks[size]);
}

//+------------------------------------------------------------------+
//| Detect Structure                                                   |
//+------------------------------------------------------------------+
void DetectStructure(const double &high[], const double &low[], 
                     const double &open[], const double &close[],
                     const datetime &time[], int rates_total)
{
   ObjectsDeleteAll(0, prefix + "BOS_");
   ObjectsDeleteAll(0, prefix + "CHoCH_");
   ObjectsDeleteAll(0, prefix + "OB_");
   ArrayResize(orderBlocks, 0);
   
   if(ArraySize(swingHighs) < 2 || ArraySize(swingLows) < 2) return;
   
   bool wasUptrend = false;
   bool wasDowntrend = false;
   
   int checkBars = MathMin(rates_total, 200);
   int startBar = rates_total - checkBars;
   
   for(int i = startBar; i < rates_total - 1; i++)
   {
      for(int j = ArraySize(swingHighs) - 1; j >= 0; j--)
      {
         if(swingHighs[j].index >= i) continue;
         if(swingHighs[j].broken) continue;
         if(i - swingHighs[j].index > 50) continue;
         
         if(close[i] > swingHighs[j].price)
         {
            swingHighs[j].broken = true;
            
            if(InpShowBOS || InpShowCHoCH)
            {
               bool isBOS = wasUptrend || !wasDowntrend;
               bool isCHoCH = wasDowntrend;
               
               if((isBOS && InpShowBOS) || (isCHoCH && InpShowCHoCH))
               {
                  DrawStructureLine(swingHighs[j].time, swingHighs[j].price,
                                    time[i], swingHighs[j].price, isBOS, true);
               }
               
               if(InpShowOrderBlocks)
                  CreateOrderBlock(swingHighs[j].index, high, low, open, close, time, true, rates_total);
            }
            
            wasUptrend = true;
            wasDowntrend = false;
            break;
         }
      }
      
      for(int j = ArraySize(swingLows) - 1; j >= 0; j--)
      {
         if(swingLows[j].index >= i) continue;
         if(swingLows[j].broken) continue;
         if(i - swingLows[j].index > 50) continue;
         
         if(close[i] < swingLows[j].price)
         {
            swingLows[j].broken = true;
            
            if(InpShowBOS || InpShowCHoCH)
            {
               bool isBOS = wasDowntrend || !wasUptrend;
               bool isCHoCH = wasUptrend;
               
               if((isBOS && InpShowBOS) || (isCHoCH && InpShowCHoCH))
               {
                  DrawStructureLine(swingLows[j].time, swingLows[j].price,
                                    time[i], swingLows[j].price, isBOS, false);
               }
               
               if(InpShowOrderBlocks)
                  CreateOrderBlock(swingLows[j].index, high, low, open, close, time, false, rates_total);
            }
            
            wasDowntrend = true;
            wasUptrend = false;
            break;
         }
      }
   }
}

//+------------------------------------------------------------------+
//| Draw Suspension Block                                              |
//+------------------------------------------------------------------+
void DrawSuspensionBlock(SuspensionBlock &sb)
{
   if(!sb.valid) return;
   
   ObjectDelete(0, sb.name);
   ObjectDelete(0, sb.name + "_lbl");
   
   // Main SB rectangle
   if(!ObjectCreate(0, sb.name, OBJ_RECTANGLE, 0, sb.startTime, sb.top, sb.endTime, sb.bottom))
      return;
   
   ObjectSetInteger(0, sb.name, OBJPROP_COLOR, InpSBColor);
   ObjectSetInteger(0, sb.name, OBJPROP_FILL, true);
   ObjectSetInteger(0, sb.name, OBJPROP_WIDTH, 2);
   ObjectSetInteger(0, sb.name, OBJPROP_BACK, true);
   ObjectSetInteger(0, sb.name, OBJPROP_SELECTABLE, false);
   ObjectSetInteger(0, sb.name, OBJPROP_HIDDEN, true);
   
   // SB Label
   string lblName = sb.name + "_lbl";
   double midPrice = (sb.top + sb.bottom) / 2.0;
   ObjectCreate(0, lblName, OBJ_TEXT, 0, sb.startTime, midPrice);
   ObjectSetString(0, lblName, OBJPROP_TEXT, "SB");
   ObjectSetInteger(0, lblName, OBJPROP_COLOR, InpSBColor);
   ObjectSetInteger(0, lblName, OBJPROP_FONTSIZE, 8);
   ObjectSetString(0, lblName, OBJPROP_FONT, "Arial Bold");
   ObjectSetInteger(0, lblName, OBJPROP_ANCHOR, ANCHOR_LEFT);
   ObjectSetInteger(0, lblName, OBJPROP_SELECTABLE, false);
}

//+------------------------------------------------------------------+
//| Detect Suspension Blocks (Dual Imbalance Zones)                    |
//| ICT 2025 Concept: Candle with FVG both above AND below           |
//+------------------------------------------------------------------+
void DetectSuspensionBlocks(const double &high[], const double &low[], 
                             const double &open[], const double &close[],
                             const datetime &time[], int rates_total)
{
   if(!InpShowSB) return;
   
   // Clear old SBs
   for(int i = 0; i < ArraySize(suspensionBlocks); i++)
   {
      if(suspensionBlocks[i].valid)
      {
         ObjectDelete(0, suspensionBlocks[i].name);
         ObjectDelete(0, suspensionBlocks[i].name + "_lbl");
      }
   }
   ArrayResize(suspensionBlocks, 0);
   
   // Get ATR for minimum gap filter
   double atrBuffer[];
   ArraySetAsSeries(atrBuffer, true);
   if(CopyBuffer(handleATR, 0, 0, 1, atrBuffer) <= 0) return;
   double atr = atrBuffer[0];
   double minGap = atr * InpSBMinGapATR;
   
   int searchStart = MathMax(2, rates_total - InpSBLookback);
   
   for(int i = searchStart; i < rates_total - 2; i++)
   {
      // Check for dual imbalance:
      // Gap ABOVE: Current candle low > previous candle high (bullish FVG above)
      // Gap BELOW: Current candle high < next candle low (bearish FVG below)
      // OR vice versa for opposite configuration
      
      bool gapAbove = false;
      bool gapBelow = false;
      
      // FVG above pattern: low[i] > high[i-1] (gap between this candle and previous)
      if(low[i] > high[i-1] + minGap)
         gapAbove = true;
      
      // FVG below pattern: high[i] < low[i+1] (gap between this candle and next)
      if(high[i] < low[i+1] - minGap)
         gapBelow = true;
      
      // Also check 3-candle pattern: gaps on both sides of middle candle body
      // low[i-1] > high[i+1] creates gap through middle candle
      if(!gapAbove && i > 0 && i < rates_total - 1)
      {
         // Three-candle FVG above: candle[i+1].low > candle[i-1].high
         if(low[i+1] > high[i-1] + minGap)
            gapAbove = true;
      }
      
      if(!gapBelow && i > 0 && i < rates_total - 1)
      {
         // Three-candle FVG below: candle[i-1].low > candle[i+1].high
         if(low[i-1] > high[i+1] + minGap)
            gapBelow = true;
      }
      
      // Suspension Block = dual imbalance (gap both directions)
      if(gapAbove && gapBelow)
      {
         // Check if we already have max SBs
         int validCount = 0;
         for(int j = 0; j < ArraySize(suspensionBlocks); j++)
            if(suspensionBlocks[j].valid) validCount++;
         
         if(validCount >= InpMaxSBCount)
         {
            // Remove oldest
            for(int j = 0; j < ArraySize(suspensionBlocks); j++)
            {
               if(suspensionBlocks[j].valid)
               {
                  ObjectDelete(0, suspensionBlocks[j].name);
                  ObjectDelete(0, suspensionBlocks[j].name + "_lbl");
                  suspensionBlocks[j].valid = false;
                  break;
               }
            }
         }
         
         SuspensionBlock newSB;
         newSB.top = high[i];
         newSB.bottom = low[i];
         newSB.startTime = time[i];
         newSB.endTime = time[rates_total - 1] + PeriodSeconds() * 20;
         newSB.isBullish = close[i] > open[i];
         newSB.valid = true;
         newSB.name = prefix + "SB_" + IntegerToString(objCounter++);
         
         int size = ArraySize(suspensionBlocks);
         ArrayResize(suspensionBlocks, size + 1);
         suspensionBlocks[size] = newSB;
         
         DrawSuspensionBlock(suspensionBlocks[size]);
      }
   }
}

//+------------------------------------------------------------------+
//| Main Calculation                                                   |
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
   int minBars = MathMax(InpBBPeriod, MathMax(InpEMASlow, InpEMATrend)) + 20;
   if(rates_total < minBars) return(0);
   
   int start;
   if(prev_calculated == 0)
   {
      start = minBars;
      ArrayInitialize(BuyBuffer, EMPTY_VALUE);
      ArrayInitialize(SellBuffer, EMPTY_VALUE);
      ArrayInitialize(StructureBuffer, EMPTY_VALUE);
   }
   else
   {
      start = prev_calculated - 1;
   }
   
   if(CopyBuffer(handleBB, 0, 0, rates_total, BBMiddleBuffer) <= 0) return(prev_calculated);
   if(CopyBuffer(handleBB, 1, 0, rates_total, BBUpperBuffer) <= 0) return(prev_calculated);
   if(CopyBuffer(handleBB, 2, 0, rates_total, BBLowerBuffer) <= 0) return(prev_calculated);
   if(CopyBuffer(handleEMAFast, 0, 0, rates_total, EMAFastBuffer) <= 0) return(prev_calculated);
   if(CopyBuffer(handleEMASlow, 0, 0, rates_total, EMASlowBuffer) <= 0) return(prev_calculated);
   if(CopyBuffer(handleEMATrend, 0, 0, rates_total, EMATrendBuffer) <= 0) return(prev_calculated);
   
   static datetime lastBarTime = 0;
   if(time[rates_total-1] != lastBarTime || prev_calculated == 0)
   {
      lastBarTime = time[rates_total-1];
      
      ProcessKillzones(high, low, time, rates_total);
      
      if(InpShowOrderBlocks || InpShowBOS || InpShowCHoCH)
      {
         DetectSwingPoints(high, low, time, rates_total);
         DetectStructure(high, low, open, close, time, rates_total);
      }
      
      // Detect Suspension Blocks (ICT 2025)
      DetectSuspensionBlocks(high, low, open, close, time, rates_total);
      
      // Draw 5-EMA Trail Line (visual trailing stop guide)
      if(InpShowEMAs && InpEMATrail > 0)
      {
         double trailEMA[];
         ArraySetAsSeries(trailEMA, true);
         if(CopyBuffer(handleEMATrail, 0, 0, 20, trailEMA) > 0)
         {
            string trailLineName = prefix + "EMA_Trail";
            ObjectDelete(0, trailLineName);
            ObjectCreate(0, trailLineName, OBJ_TREND, 0, 
                        time[rates_total-20], trailEMA[19], 
                        time[rates_total-1], trailEMA[0]);
            ObjectSetInteger(0, trailLineName, OBJPROP_COLOR, C'255,200,50');  // Gold
            ObjectSetInteger(0, trailLineName, OBJPROP_STYLE, STYLE_DOT);
            ObjectSetInteger(0, trailLineName, OBJPROP_WIDTH, 1);
            ObjectSetInteger(0, trailLineName, OBJPROP_RAY_RIGHT, true);
            ObjectSetInteger(0, trailLineName, OBJPROP_BACK, true);
            ObjectSetInteger(0, trailLineName, OBJPROP_SELECTABLE, false);
            
            // Trail label
            string trailLbl = prefix + "EMA_Trail_Lbl";
            ObjectDelete(0, trailLbl);
            ObjectCreate(0, trailLbl, OBJ_TEXT, 0, time[rates_total-1], trailEMA[0]);
            ObjectSetString(0, trailLbl, OBJPROP_TEXT, "5-EMA Trail");
            ObjectSetInteger(0, trailLbl, OBJPROP_COLOR, C'255,200,50');
            ObjectSetInteger(0, trailLbl, OBJPROP_FONTSIZE, 7);
            ObjectSetString(0, trailLbl, OBJPROP_FONT, "Arial");
            ObjectSetInteger(0, trailLbl, OBJPROP_ANCHOR, ANCHOR_LEFT);
            ObjectSetInteger(0, trailLbl, OBJPROP_SELECTABLE, false);
         }
      }
   }
   
   bool currentBarActive = false;
   int buyCount = 0, sellCount = 0;
   
   // Determine signal bar index based on confirmation mode
   int signalEndBar = rates_total;
   if(InpConfirmedSignalsOnly)
      signalEndBar = rates_total - 1;  // Skip live bar, only process closed bars
   
   for(int i = start; i < signalEndBar && !IsStopped(); i++)
   {
      BuyBuffer[i] = EMPTY_VALUE;
      SellBuffer[i] = EMPTY_VALUE;
      StructureBuffer[i] = EMPTY_VALUE;
      
      bool inSession = IsWithinTradingSession(time[i]);
      if(i == rates_total - 1) currentBarActive = inSession;
      
      if(!inSession) continue;
      if(i < InpLookback + 2) continue;
      
      bool bullishTrend = EMAFastBuffer[i] > EMASlowBuffer[i];
      bool bearishTrend = EMAFastBuffer[i] < EMASlowBuffer[i];
      
      bool touchedLowerBB = false;
      bool touchedUpperBB = false;
      
      for(int j = 0; j <= InpLookback && (i - j) >= 0; j++)
      {
         if(low[i-j] <= BBLowerBuffer[i-j]) touchedLowerBB = true;
         if(high[i-j] >= BBUpperBuffer[i-j]) touchedUpperBB = true;
      }
      
      bool swingBuyOK = true, swingSellOK = true;
      if(InpGameMode == MODE_SWING)
      {
         swingBuyOK = close[i] > EMATrendBuffer[i];
         swingSellOK = close[i] < EMATrendBuffer[i];
      }
      
      bool atBullOB = false, atBearOB = false;
      for(int j = 0; j < ArraySize(orderBlocks); j++)
      {
         if(!orderBlocks[j].valid) continue;
         if(low[i] <= orderBlocks[j].top && low[i] >= orderBlocks[j].bottom)
         {
            if(orderBlocks[j].isBullish) atBullOB = true;
            else atBearOB = true;
         }
      }
      
      if(InpShowBBSignals)
      {
         // BUY Signal
         if(bullishTrend && touchedLowerBB && swingBuyOK)
         {
            if(low[i] <= BBLowerBuffer[i] || atBullOB)
            {
               BuyBuffer[i] = low[i];
               buyCount++;
               
               // Alert on the most recent confirmed signal
               if(InpConfirmedSignalsOnly && i == rates_total - 2)
                  SendSignalAlert(true, close[i], time[i]);
               else if(!InpConfirmedSignalsOnly && i == rates_total - 1)
                  SendSignalAlert(true, close[i], time[i]);
            }
         }
         
         // SELL Signal
         if(bearishTrend && touchedUpperBB && swingSellOK)
         {
            if(high[i] >= BBUpperBuffer[i] || atBearOB)
            {
               SellBuffer[i] = high[i];
               sellCount++;
               
               // Alert on the most recent confirmed signal
               if(InpConfirmedSignalsOnly && i == rates_total - 2)
                  SendSignalAlert(false, close[i], time[i]);
               else if(!InpConfirmedSignalsOnly && i == rates_total - 1)
                  SendSignalAlert(false, close[i], time[i]);
            }
         }
      }
   }
   
   UpdateDashboard(currentBarActive, buyCount, sellCount);
   
   return(rates_total);
}

//+------------------------------------------------------------------+
//| Check Trading Session (for Scalper/DayTrader modes)               |
//+------------------------------------------------------------------+
bool IsWithinTradingSession(datetime barTime)
{
   if(InpGameMode == MODE_SWING) return true;
   
   MqlDateTime dt;
   TimeToStruct(barTime, dt);
   
   // Convert broker hour to GMT+2 equivalent for comparison
   // Configured times are in GMT+2 (Coinexx standard)
   // If broker is GMT+0, we add 2 to get GMT+2 equivalent
   // Formula: adjustedHour = brokerHour + (2 - InpGMTOffset)
   int adjustment = 2 - InpGMTOffset;
   int hour = (dt.hour + adjustment + 24) % 24;  // Handle wrap-around
   
   if(InpGameMode == MODE_SCALPER)
   {
      // Use Scalper-specific killzone times
      return ((hour >= InpScalperLondonStart && hour < InpScalperLondonEnd) ||
              (hour >= InpScalperNYStart && hour < InpScalperNYEnd));
   }
   else if(InpGameMode == MODE_DAYTRADER)
   {
      return (hour >= InpDayTradeStart && hour < InpDayTradeEnd);
   }
   
   return true;
}

//+------------------------------------------------------------------+
//| Get Adjusted Hour for GMT offset                                   |
//+------------------------------------------------------------------+
int GetAdjustedHour(int brokerHour)
{
   // Convert broker hour to GMT+2 equivalent
   int adjustment = 2 - InpGMTOffset;
   return (brokerHour + adjustment + 24) % 24;
}

//+------------------------------------------------------------------+
//| Get Mode Name                                                      |
//+------------------------------------------------------------------+
string GetModeName()
{
   switch(InpGameMode)
   {
      case MODE_SCALPER:   return "SCALPER";
      case MODE_DAYTRADER: return "DAYTRADER";
      case MODE_SWING:     return "SWING";
   }
   return "UNKNOWN";
}

//+------------------------------------------------------------------+
//| Get Alpha Edge Strategy Name                                       |
//+------------------------------------------------------------------+
string GetAlphaStrategyName()
{
   switch(InpAlphaStrategy)
   {
      case ALPHA_OFF:             return "OFF";
      case ALPHA_TREND_FOLLOWING: return "Trend Follow";
      case ALPHA_MEAN_REVERSION:  return "Mean Reversion";
      case ALPHA_SWING_PULLBACKS: return "Swing Pullback";
      case ALPHA_BREAKOUT:        return "Breakout";
   }
   return "UNKNOWN";
}

//+------------------------------------------------------------------+
//| Send Signal Alert                                                  |
//+------------------------------------------------------------------+
void SendSignalAlert(bool isBuy, double price, datetime signalTime)
{
   if(!InpEnableAlerts) return;
   
   // Prevent duplicate alerts on same bar
   if(signalTime == lastAlertTime && ((isBuy && lastAlertType == 1) || (!isBuy && lastAlertType == -1)))
      return;
   
   lastAlertTime = signalTime;
   lastAlertType = isBuy ? 1 : -1;
   
   string direction = isBuy ? "BUY" : "SELL";
   string message = StringFormat("RetailBeast [%s] %s Signal @ %.5f on %s", 
                                  GetModeName(), direction, price, _Symbol);
   
   // Popup Alert
   if(InpAlertPopup)
      Alert(message);
   
   // Sound Alert
   if(InpAlertSound)
      PlaySound(InpAlertSoundFile);
   
   // Push Notification (Mobile)
   if(InpAlertPush)
      SendNotification(message);
   
   Print("ALERT: ", message);
}

//+------------------------------------------------------------------+
//| Get Session Info                                                   |
//+------------------------------------------------------------------+
string GetSessionInfo()
{
   MqlDateTime dt;
   TimeToStruct(TimeCurrent(), dt);
   
   // Apply GMT offset adjustment
   int adjustment = 2 - InpGMTOffset;
   int hour = (dt.hour + adjustment + 24) % 24;
   
   if(InpGameMode == MODE_SWING)
      return StringFormat("24/7 | %02d:%02d", dt.hour, dt.min);
   
   string session = "OFF";
   
   if(InpGameMode == MODE_SCALPER)
   {
      if(hour >= InpScalperLondonStart && hour < InpScalperLondonEnd)
         session = "LONDON KZ";
      else if(hour >= InpScalperNYStart && hour < InpScalperNYEnd)
         session = "NY KZ";
   }
   else if(InpGameMode == MODE_DAYTRADER)
   {
      if(hour >= InpDayTradeStart && hour < InpDayTradeEnd)
         session = "ACTIVE";
   }
   
   return StringFormat("%s | %02d:%02d", session, dt.hour, dt.min);
}

//+------------------------------------------------------------------+
//| Create Dashboard                                                   |
//+------------------------------------------------------------------+
void CreateDashboard()
{
   ObjectDelete(0, dashboardName);
   ObjectCreate(0, dashboardName, OBJ_LABEL, 0, 0, 0);
   ObjectSetInteger(0, dashboardName, OBJPROP_CORNER, CORNER_LEFT_UPPER);
   ObjectSetInteger(0, dashboardName, OBJPROP_XDISTANCE, 15);
   ObjectSetInteger(0, dashboardName, OBJPROP_YDISTANCE, 30);
   ObjectSetInteger(0, dashboardName, OBJPROP_FONTSIZE, 12);
   ObjectSetString(0, dashboardName, OBJPROP_FONT, "Arial Bold");
   ObjectSetInteger(0, dashboardName, OBJPROP_SELECTABLE, false);
   
   ObjectDelete(0, infoName);
   ObjectCreate(0, infoName, OBJ_LABEL, 0, 0, 0);
   ObjectSetInteger(0, infoName, OBJPROP_CORNER, CORNER_LEFT_UPPER);
   ObjectSetInteger(0, infoName, OBJPROP_XDISTANCE, 15);
   ObjectSetInteger(0, infoName, OBJPROP_YDISTANCE, 50);
   ObjectSetInteger(0, infoName, OBJPROP_FONTSIZE, 10);
   ObjectSetString(0, infoName, OBJPROP_FONT, "Arial");
   ObjectSetInteger(0, infoName, OBJPROP_COLOR, clrGray);
   ObjectSetInteger(0, infoName, OBJPROP_SELECTABLE, false);
   
   // Watermark - Bottom Right
   string watermarkName = prefix + "Watermark";
   ObjectDelete(0, watermarkName);
   ObjectCreate(0, watermarkName, OBJ_LABEL, 0, 0, 0);
   ObjectSetInteger(0, watermarkName, OBJPROP_CORNER, CORNER_RIGHT_LOWER);
   ObjectSetInteger(0, watermarkName, OBJPROP_XDISTANCE, 15);
   ObjectSetInteger(0, watermarkName, OBJPROP_YDISTANCE, 25);
   ObjectSetString(0, watermarkName, OBJPROP_TEXT, "RetailBeast 2025");
   ObjectSetInteger(0, watermarkName, OBJPROP_FONTSIZE, 9);
   ObjectSetString(0, watermarkName, OBJPROP_FONT, "Arial");
   ObjectSetInteger(0, watermarkName, OBJPROP_COLOR, C'80,80,100');
   ObjectSetInteger(0, watermarkName, OBJPROP_SELECTABLE, false);
}

//+------------------------------------------------------------------+
//| Update Dashboard                                                   |
//+------------------------------------------------------------------+
void UpdateDashboard(bool isActive, int buyCount, int sellCount)
{
   string modeName = GetModeName();
   string sessionInfo = GetSessionInfo();
   
   string dashText = StringFormat("RetailBeast [%s] | %s", modeName, sessionInfo);
   ObjectSetString(0, dashboardName, OBJPROP_TEXT, dashText);
   
   bool sessionActive = (StringFind(sessionInfo, "OFF") < 0);
   ObjectSetInteger(0, dashboardName, OBJPROP_COLOR, sessionActive ? clrLime : clrCyan);
   
   int obCount = 0;
   for(int i = 0; i < ArraySize(orderBlocks); i++)
      if(orderBlocks[i].valid) obCount++;
   
   string displayMode = (InpDisplayMode == DISPLAY_PRESENT) ? "LIVE" : "HIST";
   string infoText = StringFormat("GMT%+d [%s] | KZ: %d | OB: %d | Sig: %d/%d", 
                                   InpGMTOffset, displayMode, ArraySize(killzones), obCount, buyCount, sellCount);
   ObjectSetString(0, infoName, OBJPROP_TEXT, infoText);
   
   ChartRedraw(0);
}

//+------------------------------------------------------------------+
//| Process HTF Order Blocks                                           |
//+------------------------------------------------------------------+
void ProcessHTFOrderBlocks()
{
   if(!InpShowHTF || !InpShowHTFOB) return;
   
   // Clean up old HTF OBs
   for(int i = 0; i < ArraySize(htfOrderBlocks); i++)
   {
      ObjectDelete(0, htfOrderBlocks[i].name);
      ObjectDelete(0, htfOrderBlocks[i].name + "_lbl");
   }
   ArrayResize(htfOrderBlocks, 0);
   
   // Get HTF data
   double htfHigh[], htfLow[], htfOpen[], htfClose[];
   datetime htfTime[];
   
   int copied = CopyHigh(_Symbol, InpHTFTimeframe, 0, InpHTFLookback, htfHigh);
   if(copied <= 0) return;
   
   CopyLow(_Symbol, InpHTFTimeframe, 0, InpHTFLookback, htfLow);
   CopyOpen(_Symbol, InpHTFTimeframe, 0, InpHTFLookback, htfOpen);
   CopyClose(_Symbol, InpHTFTimeframe, 0, InpHTFLookback, htfClose);
   CopyTime(_Symbol, InpHTFTimeframe, 0, InpHTFLookback, htfTime);
   
   ArraySetAsSeries(htfHigh, true);
   ArraySetAsSeries(htfLow, true);
   ArraySetAsSeries(htfOpen, true);
   ArraySetAsSeries(htfClose, true);
   ArraySetAsSeries(htfTime, true);
   
   int htfSwingStrength = 2;  // Use smaller swing detection for HTF
   
   // Detect HTF Order Blocks (swing point based)
   for(int i = htfSwingStrength; i < copied - htfSwingStrength - 1; i++)
   {
      // Bullish OB: Swing low followed by strong move up
      bool isSwingLow = true;
      for(int j = 1; j <= htfSwingStrength; j++)
      {
         if(htfLow[i] >= htfLow[i-j] || htfLow[i] >= htfLow[i+j])
         {
            isSwingLow = false;
            break;
         }
      }
      
      if(isSwingLow && htfClose[i-1] > htfOpen[i])  // Next candle bullish
      {
         int size = ArraySize(htfOrderBlocks);
         if(size < 5)  // Limit HTF OBs
         {
            ArrayResize(htfOrderBlocks, size + 1);
            htfOrderBlocks[size].top = htfHigh[i];
            htfOrderBlocks[size].bottom = htfLow[i];
            htfOrderBlocks[size].startTime = htfTime[i];
            htfOrderBlocks[size].endTime = htfTime[0] + PeriodSeconds(InpHTFTimeframe);
            htfOrderBlocks[size].isBullish = true;
            htfOrderBlocks[size].valid = true;
            htfOrderBlocks[size].name = prefix + "HTF_OB_Bull_" + IntegerToString(objCounter++);
            DrawHTFOrderBlock(htfOrderBlocks[size]);
         }
      }
      
      // Bearish OB: Swing high followed by strong move down
      bool isSwingHigh = true;
      for(int j = 1; j <= htfSwingStrength; j++)
      {
         if(htfHigh[i] <= htfHigh[i-j] || htfHigh[i] <= htfHigh[i+j])
         {
            isSwingHigh = false;
            break;
         }
      }
      
      if(isSwingHigh && htfClose[i-1] < htfOpen[i])  // Next candle bearish
      {
         int size = ArraySize(htfOrderBlocks);
         if(size < 5)
         {
            ArrayResize(htfOrderBlocks, size + 1);
            htfOrderBlocks[size].top = htfHigh[i];
            htfOrderBlocks[size].bottom = htfLow[i];
            htfOrderBlocks[size].startTime = htfTime[i];
            htfOrderBlocks[size].endTime = htfTime[0] + PeriodSeconds(InpHTFTimeframe);
            htfOrderBlocks[size].isBullish = false;
            htfOrderBlocks[size].valid = true;
            htfOrderBlocks[size].name = prefix + "HTF_OB_Bear_" + IntegerToString(objCounter++);
            DrawHTFOrderBlock(htfOrderBlocks[size]);
         }
      }
   }
}

//+------------------------------------------------------------------+
//| Draw HTF Order Block                                               |
//+------------------------------------------------------------------+
void DrawHTFOrderBlock(HTFOrderBlock &ob)
{
   if(!ob.valid) return;
   
   color obColor = ob.isBullish ? InpHTFBullColor : InpHTFBearColor;
   
   ObjectCreate(0, ob.name, OBJ_RECTANGLE, 0, ob.startTime, ob.top, ob.endTime, ob.bottom);
   ObjectSetInteger(0, ob.name, OBJPROP_COLOR, obColor);
   ObjectSetInteger(0, ob.name, OBJPROP_FILL, true);
   ObjectSetInteger(0, ob.name, OBJPROP_WIDTH, 2);
   ObjectSetInteger(0, ob.name, OBJPROP_BACK, true);
   ObjectSetInteger(0, ob.name, OBJPROP_SELECTABLE, false);
   
   // Label
   string lblName = ob.name + "_lbl";
   string lblText = ob.isBullish ? "HTF Bull OB" : "HTF Bear OB";
   ObjectCreate(0, lblName, OBJ_TEXT, 0, ob.startTime, ob.isBullish ? ob.bottom : ob.top);
   ObjectSetString(0, lblName, OBJPROP_TEXT, lblText);
   ObjectSetInteger(0, lblName, OBJPROP_COLOR, obColor);
   ObjectSetInteger(0, lblName, OBJPROP_FONTSIZE, 8);
   ObjectSetString(0, lblName, OBJPROP_FONT, "Arial Bold");
   ObjectSetInteger(0, lblName, OBJPROP_ANCHOR, ob.isBullish ? ANCHOR_LEFT_UPPER : ANCHOR_LEFT_LOWER);
   ObjectSetInteger(0, lblName, OBJPROP_SELECTABLE, false);
}

//+------------------------------------------------------------------+
//| Process HTF Fair Value Gaps                                        |
//+------------------------------------------------------------------+
void ProcessHTFFVGs()
{
   if(!InpShowHTF || !InpShowHTFFVG) return;
   
   // Clean up old FVGs
   for(int i = 0; i < ArraySize(htfFVGs); i++)
   {
      ObjectDelete(0, htfFVGs[i].name);
      ObjectDelete(0, htfFVGs[i].name + "_lbl");
   }
   ArrayResize(htfFVGs, 0);
   
   // Get HTF data
   double htfHigh[], htfLow[];
   datetime htfTime[];
   
   int copied = CopyHigh(_Symbol, InpHTFTimeframe, 0, InpHTFLookback, htfHigh);
   if(copied <= 0) return;
   
   CopyLow(_Symbol, InpHTFTimeframe, 0, InpHTFLookback, htfLow);
   CopyTime(_Symbol, InpHTFTimeframe, 0, InpHTFLookback, htfTime);
   
   ArraySetAsSeries(htfHigh, true);
   ArraySetAsSeries(htfLow, true);
   ArraySetAsSeries(htfTime, true);
   
   // Detect FVGs (3-candle pattern)
   for(int i = 1; i < copied - 1; i++)
   {
      // Bullish FVG: Low of candle 0 > High of candle 2,  gap between
      if(htfLow[i-1] > htfHigh[i+1])
      {
         int size = ArraySize(htfFVGs);
         if(size < 5)
         {
            ArrayResize(htfFVGs, size + 1);
            htfFVGs[size].top = htfLow[i-1];
            htfFVGs[size].bottom = htfHigh[i+1];
            htfFVGs[size].gapTime = htfTime[i];
            htfFVGs[size].isBullish = true;
            htfFVGs[size].valid = true;
            htfFVGs[size].name = prefix + "HTF_FVG_Bull_" + IntegerToString(objCounter++);
            DrawHTFFVG(htfFVGs[size]);
         }
      }
      
      // Bearish FVG: High of candle 0 < Low of candle 2
      if(htfHigh[i-1] < htfLow[i+1])
      {
         int size = ArraySize(htfFVGs);
         if(size < 5)
         {
            ArrayResize(htfFVGs, size + 1);
            htfFVGs[size].top = htfLow[i+1];
            htfFVGs[size].bottom = htfHigh[i-1];
            htfFVGs[size].gapTime = htfTime[i];
            htfFVGs[size].isBullish = false;
            htfFVGs[size].valid = true;
            htfFVGs[size].name = prefix + "HTF_FVG_Bear_" + IntegerToString(objCounter++);
            DrawHTFFVG(htfFVGs[size]);
         }
      }
   }
}

//+------------------------------------------------------------------+
//| Draw HTF Fair Value Gap                                            |
//+------------------------------------------------------------------+
void DrawHTFFVG(HTFFairValueGap &fvg)
{
   if(!fvg.valid) return;
   
   color fvgColor = fvg.isBullish ? InpHTFBullColor : InpHTFBearColor;
   datetime endTime = TimeCurrent() + PeriodSeconds(InpHTFTimeframe) * 5;
   
   ObjectCreate(0, fvg.name, OBJ_RECTANGLE, 0, fvg.gapTime, fvg.top, endTime, fvg.bottom);
   ObjectSetInteger(0, fvg.name, OBJPROP_COLOR, fvgColor);
   ObjectSetInteger(0, fvg.name, OBJPROP_FILL, true);
   ObjectSetInteger(0, fvg.name, OBJPROP_WIDTH, 1);
   ObjectSetInteger(0, fvg.name, OBJPROP_BACK, true);
   ObjectSetInteger(0, fvg.name, OBJPROP_SELECTABLE, false);
   ObjectSetInteger(0, fvg.name, OBJPROP_STYLE, STYLE_DOT);
   
   // Label
   string lblName = fvg.name + "_lbl";
   string lblText = fvg.isBullish ? "HTF FVG ↑" : "HTF FVG ↓";
   ObjectCreate(0, lblName, OBJ_TEXT, 0, fvg.gapTime, (fvg.top + fvg.bottom) / 2);
   ObjectSetString(0, lblName, OBJPROP_TEXT, lblText);
   ObjectSetInteger(0, lblName, OBJPROP_COLOR, fvgColor);
   ObjectSetInteger(0, lblName, OBJPROP_FONTSIZE, 7);
   ObjectSetString(0, lblName, OBJPROP_FONT, "Arial");
   ObjectSetInteger(0, lblName, OBJPROP_ANCHOR, ANCHOR_LEFT);
   ObjectSetInteger(0, lblName, OBJPROP_SELECTABLE, false);
}

//+------------------------------------------------------------------+
//| Chart Event                                                        |
//+------------------------------------------------------------------+
void OnChartEvent(const int id, const long &lparam, const double &dparam, const string &sparam)
{
   if(id == CHARTEVENT_CHART_CHANGE)
      ChartRedraw(0);
}
//+------------------------------------------------------------------+
