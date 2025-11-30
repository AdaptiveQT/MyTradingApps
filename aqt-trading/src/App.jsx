import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
    ArrowRight, TrendingUp, AlertCircle, DollarSign, Target, Shield,
    Download, Upload, Brain, Zap, Trash2, CheckCircle2, Bell, Clock,
    Building2, Calculator, PieChart as PieIcon, BarChart2,
    ChevronDown, ChevronUp, WifiOff, Save, Sun, Moon
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

// --- COLLAPSIBLE SECTION COMPONENT ---
const CollapsibleSection = ({ title, icon: Icon, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const contentRef = useRef(null);
    const [height, setHeight] = useState(defaultOpen ? 'auto' : 0);

    useEffect(() => {
        if (isOpen) {
            const scrollHeight = contentRef.current?.scrollHeight;
            setHeight(`${scrollHeight}px`);
        } else {
            setHeight('0px');
        }
    }, [isOpen, children]);

    return (
        <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden mb-6 transition-all shadow-sm dark:shadow-none">
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                className="w-full flex justify-between items-center p-4 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
                <div className="flex items-center gap-2 font-bold text-lg text-slate-800 dark:text-white">
                    {Icon && <Icon size={20} className="text-blue-600 dark:text-blue-400" />}
                    {title}
                </div>
                {isOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
            </button>

            <div
                ref={contentRef}
                style={{ height }}
                className="transition-[height] duration-300 ease-in-out overflow-hidden"
            >
                <div className="p-6 border-t border-slate-200 dark:border-white/10">
                    {children}
                </div>
            </div>
        </div>
    );
};

// --- TRADINGVIEW WIDGET COMPONENT ---
const TradingViewTicker = () => {
    const containerRef = useRef(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;
        containerRef.current.innerHTML = '';

        try {
            const script = document.createElement('script');
            script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
            script.async = true;
            script.onerror = () => setError(true);
            script.innerHTML = JSON.stringify({
                "symbols": [
                    { "proName": "FOREXCOM:SPX500", "title": "S&P 500" },
                    { "proName": "FOREXCOM:NSXUSD", "title": "US 100" },
                    { "proName": "FX_IDC:EURUSD", "title": "EUR/USD" },
                    { "proName": "BITSTAMP:BTCUSD", "title": "Bitcoin" },
                    { "proName": "BITSTAMP:ETHUSD", "title": "Ethereum" },
                    { "proName": "OANDA:XAUUSD", "title": "Gold" },
                    { "proName": "FX_IDC:USDJPY", "title": "USD/JPY" }
                ],
                "showSymbolLogo": true,
                "colorTheme": document.documentElement.classList.contains('dark') ? "dark" : "light",
                "isTransparent": true,
                "displayMode": "adaptive",
                "locale": "en"
            });
            containerRef.current.appendChild(script);
        } catch (e) {
            setError(true);
        }
        return () => { if (containerRef.current) containerRef.current.innerHTML = ''; };
    }, []);

    if (error) return (
        <div className="w-full h-12 mb-6 flex items-center justify-center bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs border-b border-red-200 dark:border-red-500/20">
            <WifiOff size={14} className="mr-2" /> Live Feed Offline
        </div>
    );

    return (
        <div className="tradingview-widget-container w-full h-12 mb-6 pointer-events-none">
            <div className="tradingview-widget-container__widget" ref={containerRef}></div>
        </div>
    );
};

// --- CONFIGURATION ---
const TIERS = [
    { name: 'SURVIVAL', min: 10, max: 19, pairs: 2, suggestedPairs: 'EURUSD, GBPUSD', desc: 'Capital preservation mode' },
    { name: 'BUILDING', min: 20, max: 49, pairs: 3, suggestedPairs: 'EURUSD, GBPUSD, USDJPY', desc: 'Steady growth phase' },
    { name: 'SCALING', min: 50, max: 99, pairs: 4, suggestedPairs: 'Majors + 1 Cross', desc: 'Accelerated scaling' },
    { name: 'GROWTH', min: 100, max: 249, pairs: 5, suggestedPairs: 'Majors + 2 Crosses', desc: 'Sustained growth' },
    { name: 'EXPANSION', min: 250, max: 499, pairs: 6, suggestedPairs: 'Majors + Crosses + Gold', desc: 'Portfolio expansion' },
    { name: 'ADVANCED', min: 500, max: 999, pairs: 7, suggestedPairs: 'Full Forex + Gold', desc: 'Advanced strategies' },
    { name: 'MASTERY', min: 1000, max: 2499, pairs: 8, suggestedPairs: 'Forex, Gold, Indices', desc: 'Full system mastery' },
    { name: 'ELITE', min: 2500, max: 4999, pairs: 10, suggestedPairs: 'Any Liquid Asset', desc: 'Elite trader status' },
    { name: 'LEGEND', min: 5000, max: 999999, pairs: 12, suggestedPairs: 'Full Market Access', desc: 'Legendary performance' }
];

const SETTINGS_DEFAULT = { pipValue: 10, stopLoss: 15, dailyGrowth: 20 };

const TAX_BRACKETS_2025 = [
    { rate: 0.10, label: '10% (< $11,925)', minIncome: 0 },
    { rate: 0.12, label: '12% ($11,925 - $48,475)', minIncome: 11925 },
    { rate: 0.22, label: '22% ($48,475 - $103,350)', minIncome: 48475 },
    { rate: 0.24, label: '24% ($103,350 - $197,300)', minIncome: 103350 },
    { rate: 0.32, label: '32% ($197,300 - $250,525)', minIncome: 197300 },
    { rate: 0.35, label: '35% ($250,525 - $626,350)', minIncome: 250525 },
    { rate: 0.37, label: '37% (> $626,350)', minIncome: 626350 },
];

const BROKERS = {
    'IC Markets': { minLot: 0.01, regulation: 'ASIC/CySEC/FSA', leverage: ['1:30', '1:100', '1:200', '1:500'], default: '1:500' },
    'Pepperstone': { minLot: 0.01, regulation: 'ASIC/FCA/CySEC', leverage: ['1:30', '1:100', '1:200', '1:500'], default: '1:500' },
    'OANDA': { minLot: 0.001, regulation: 'FCA/ASIC/NFA/CFTC', leverage: ['1:30', '1:50', '1:100', '1:200'], default: '1:50' },
    'Exness': { minLot: 0.01, regulation: 'FCA/CySEC/FSA', leverage: ['1:100', '1:200', '1:1000', '1:2000', '1:Unlimited'], default: '1:2000' },
    'XM': { minLot: 0.01, regulation: 'CySEC/ASIC/IFSC', leverage: ['1:30', '1:100', '1:500', '1:888'], default: '1:888' },
    'FTMO': { minLot: 0.01, regulation: 'Prop Firm (CZ)', leverage: ['1:100', '1:200'], default: '1:100' },
    'HankoTrade': { minLot: 0.01, regulation: 'Offshore/Unregulated', leverage: ['1:100', '1:200', '1:300', '1:400', '1:500'], default: '1:500' },
    'Coinexx': { minLot: 0.01, regulation: 'Offshore/Unregulated', leverage: ['1:100', '1:200', '1:300', '1:400', '1:500'], default: '1:500' },
    'Dura Markets': { minLot: 0.01, regulation: 'Offshore/Unregulated', leverage: ['1:100', '1:200', '1:300', '1:400', '1:500'], default: '1:500' },
    'Defco FX': { minLot: 0.01, regulation: 'Offshore/Unregulated', leverage: ['1:100', '1:200', '1:300', '1:400', '1:500'], default: '1:500' },
    'NordFX': { minLot: 0.01, regulation: 'Offshore/Unregulated', leverage: ['1:100', '1:200', '1:500', '1:1000'], default: '1:500' },
    'LHFX': { minLot: 0.01, regulation: 'Offshore/Unregulated', leverage: ['1:100', '1:200', '1:300', '1:400', '1:500'], default: '1:500' },
};

const COMMON_PAIRS = ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'USDCAD', 'BTCUSD', 'ETHUSD', 'US30', 'NAS100', 'SPX500'];

// --- HELPERS ---
const getPairMetadata = (rawPair) => {
    const pair = rawPair ? rawPair.toUpperCase() : '';
    if (pair.includes('JPY')) return { placeholder: '145.50', step: 0.01, multiplier: 100, isYen: true };
    if (pair.includes('XAU')) return { placeholder: '2350.10', step: 0.01, multiplier: 100, isGold: true };
    if (pair.includes('BTC') || pair.includes('ETH')) return { placeholder: '62000', step: 1, multiplier: 1 };
    if (pair.includes('US30') || pair.includes('NAS') || pair.includes('SPX')) return { placeholder: '35000', step: 1, multiplier: 1 };
    return { placeholder: '1.0850', step: 0.0001, multiplier: 10000 };
};

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);
const roundToTwo = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

const normalizeTrade = (trade, lotSize) => ({
    ...trade,
    id: generateId(),
    entry: parseFloat(trade.entry),
    exit: parseFloat(trade.exit),
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    lots: parseFloat(lotSize),
    pair: trade.pair.toUpperCase()
});

function usePersistentState(key, defaultValue) {
    const [state, setState] = useState(() => {
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : defaultValue;
        } catch (e) { return defaultValue; }
    });
    useEffect(() => { localStorage.setItem(key, JSON.stringify(state)); }, [key, state]);
    return [state, setState];
}

const calculateTradingMetrics = (balance, broker, safeMode, brokerList, settings, leverage, currentPair) => {
    const safeBal = !isNaN(balance) && balance !== null ? parseFloat(balance) : 0;
    const currentTier = TIERS.find(t => safeBal >= t.min && safeBal <= t.max) || TIERS[0];
    const brokerData = brokerList[broker] || brokerList['IC Markets'];
    const baseLot = Math.max(brokerData.minLot, parseFloat((Math.floor(currentTier.min / 10) * 0.01).toFixed(2)));
    const lotSize = safeMode ? Math.max(brokerData.minLot, parseFloat((baseLot * 0.5).toFixed(2))) : baseLot;
    const dailyGoal = (safeBal * (settings.dailyGrowth / 100)).toFixed(2);
    const pipValueForLot = lotSize * settings.pipValue;
    const maxLoss = (pipValueForLot * settings.stopLoss).toFixed(2);

    const leverageNum = parseInt(leverage.replace('1:', '').replace('Unlimited', '2000')) || 500;
    const pairMeta = getPairMetadata(currentPair || 'EURUSD');
    const proxyPrice = parseFloat(pairMeta.placeholder);
    let contractSize = 100000;
    if (pairMeta.isGold) contractSize = 100;

    const marginRequired = (safeBal > 0 && lotSize > 0) ? ((lotSize * contractSize * proxyPrice) / leverageNum).toFixed(2) : '0.00';
    const nextTierIndex = TIERS.indexOf(currentTier) + 1;
    const nextTier = TIERS[nextTierIndex];

    let progress = 100;
    if (nextTier) {
        const range = nextTier.min - currentTier.min;
        const current = safeBal - currentTier.min;
        progress = Math.min(100, Math.max(0, (current / range) * 100));
    }
    return { currentTier, lotSize, dailyGoal, maxLoss, nextTier, progress: progress.toFixed(1), pipValueForLot, marginRequired };
};

// --- MAIN COMPONENT ---
const App = () => {
    const [balance, setBalance] = usePersistentState('aqt_balance', 1000);
    const [balanceInput, setBalanceInput] = useState(balance ? balance.toString() : '0');
    const [broker, setBroker] = usePersistentState('aqt_broker', 'IC Markets');
    const [leverage, setLeverage] = usePersistentState('aqt_leverage', BROKERS['IC Markets'].default);
    const [safeMode, setSafeMode] = usePersistentState('aqt_safemode', true);
    const [trades, setTrades] = usePersistentState('aqt_trades', []);
    const [taxBracketIndex, setTaxBracketIndex] = usePersistentState('aqt_tax_bracket_v2', 2);
    const [isSection1256, setIsSection1256] = usePersistentState('aqt_tax_1256', false);
    const [alertsEnabled, setAlertsEnabled] = usePersistentState('aqt_alerts_enabled', false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [darkMode, setDarkMode] = usePersistentState('aqt_darkmode', true);

    // --- THEME MANAGEMENT ---
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    // Alerts
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!alertsEnabled) return;
        const now = new Date();
        const londonTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/London" }));
        const isLondonOpen = londonTime.getHours() === 8 && londonTime.getMinutes() === 0 && now.getSeconds() === 0;
        const nyTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
        const isNYOpen = nyTime.getHours() === 8 && nyTime.getMinutes() === 0 && now.getSeconds() === 0;

        if (isLondonOpen) new Notification(`MARKET ALERT: London Open`, { body: `08:00 London Time - High Volatility`, icon: '/favicon.ico' });
        if (isNYOpen) new Notification(`MARKET ALERT: New York Open`, { body: `08:00 New York Time - Session Start`, icon: '/favicon.ico' });
    }, [currentTime, alertsEnabled]);

    const requestNotificationPermission = async () => {
        if (!('Notification' in window)) return alert('Browser notifications not supported');
        const permission = await Notification.requestPermission();
        if (permission === 'granted') setAlertsEnabled(true);
    };

    // Sync Input
    useEffect(() => {
        const timer = setTimeout(() => {
            const num = parseFloat(balanceInput);
            if (!isNaN(num) && Math.abs(num - balance) > 0.001) setBalance(num);
            else if (balanceInput === '') setBalance(0);
        }, 600);
        return () => clearTimeout(timer);
    }, [balanceInput, balance]);

    useEffect(() => {
        const currentNum = parseFloat(balanceInput);
        if (Math.abs(balance - currentNum) > 0.01) setBalanceInput(balance.toString());
    }, [balance]);

    // Trade State
    const initialTradeState = { pair: '', direction: 'Long', entry: '', exit: '', setup: 'Breakout', emotion: 'Calm', notes: '' };
    const [newTrade, setNewTrade] = useState(initialTradeState);
    const pairMeta = useMemo(() => getPairMetadata(newTrade.pair), [newTrade.pair]);

    // Metrics & Logic
    const metrics = useMemo(() => {
        return calculateTradingMetrics(balance, broker, safeMode, BROKERS, SETTINGS_DEFAULT, leverage, newTrade.pair);
    }, [balance, broker, safeMode, leverage, newTrade.pair]);

    const { currentTier, lotSize, dailyGoal, maxLoss, progress, pipValueForLot, marginRequired } = metrics;

    const calculatePnL = useCallback((tradeVals) => {
        const { entry, exit, pair, direction } = tradeVals;
        const entryNum = parseFloat(entry);
        const exitNum = parseFloat(exit);
        if (isNaN(entryNum) || isNaN(exitNum)) return 0;
        const meta = getPairMetadata(pair);
        const dirMult = direction === 'Long' ? 1 : -1;
        return roundToTwo((exitNum - entryNum) * dirMult * meta.multiplier * pipValueForLot);
    }, [pipValueForLot]);

    const isFormValid = useMemo(() => {
        const e = parseFloat(newTrade.entry);
        const x = parseFloat(newTrade.exit);
        return newTrade.pair.length >= 2 && !isNaN(e) && e > 0 && !isNaN(x) && x > 0 && e !== x;
    }, [newTrade]);

    const addTrade = () => {
        if (!isFormValid) return;
        const pnlValue = calculatePnL(newTrade);
        const tradeEntry = { ...normalizeTrade(newTrade, lotSize), pnl: pnlValue };
        setTrades(prev => [tradeEntry, ...prev]);
        setBalance(prev => roundToTwo(prev + pnlValue));
        setNewTrade(initialTradeState);
    };

    const deleteTrade = (id) => {
        const trade = trades.find(t => t.id === id);
        if (trade && window.confirm('Delete trade? Balance will be reverted.')) {
            setBalance(prev => roundToTwo(prev - trade.pnl));
            setTrades(prev => prev.filter(t => t.id !== id));
        }
    };

    // --- DATA MANAGEMENT ---
    const exportToCSV = () => {
        const headers = "Date,Time,Pair,Direction,Lots,PnL";
        const rows = trades.map(t => `${t.date},${t.time},${t.pair},${t.direction},${t.lots},${t.pnl.toFixed(2)}`).join("\n");
        const blob = new Blob([headers + "\n" + rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aqt_journal_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
    };

    const backupData = () => {
        const data = {
            version: '2.5',
            timestamp: new Date().toISOString(),
            balance,
            trades,
            settings: { broker, leverage, safeMode, taxBracketIndex, isSection1256, darkMode }
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aqt_backup_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
    };

    const restoreData = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (confirm(`Restore backup from ${new Date(data.timestamp).toLocaleDateString()}? Current data will be replaced.`)) {
                    setBalance(data.balance);
                    setTrades(data.trades);
                    if (data.settings) {
                        setBroker(data.settings.broker || 'IC Markets');
                        setLeverage(data.settings.leverage || '1:500');
                        setSafeMode(data.settings.safeMode ?? true);
                        setTaxBracketIndex(data.settings.taxBracketIndex ?? 2);
                        setIsSection1256(data.settings.isSection1256 ?? false);
                        setDarkMode(data.settings.darkMode ?? true);
                    }
                    alert('System restored successfully.');
                }
            } catch (err) {
                alert('Invalid backup file.');
            }
        };
        reader.readAsText(file);
    };

    // Analytics
    const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0);
    const winCount = trades.filter(t => t.pnl > 0).length;
    const lossCount = trades.filter(t => t.pnl < 0).length;
    const activeTaxRate = isSection1256 ? ((0.60 * 0.15) + (0.40 * TAX_BRACKETS_2025[taxBracketIndex].rate)) : TAX_BRACKETS_2025[taxBracketIndex].rate;
    const estimatedTax = Math.max(0, totalPnL) * activeTaxRate;
    const netPocket = totalPnL - estimatedTax;

    const balanceHistory = useMemo(() => {
        let runningBal = balance - trades.reduce((acc, t) => acc + t.pnl, 0);
        const points = [{ trade: 0, balance: roundToTwo(runningBal) }];
        [...trades].reverse().forEach((t, i) => {
            runningBal += t.pnl;
            points.push({ trade: i + 1, balance: roundToTwo(runningBal) });
        });
        return points;
    }, [trades, balance]);

    return (
        <div className={`min-h-screen font-sans overflow-x-hidden pb-12 transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white' : 'bg-slate-50 text-slate-800'}`}>
            <TradingViewTicker />

            <div className="max-w-7xl mx-auto space-y-4 p-4">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-center py-2">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">AQT <span className="text-blue-600 dark:text-blue-400">v2.5</span></h1>
                        <p className="text-slate-600 dark:text-blue-300 text-sm">Adaptive Quantitative Trading System</p>
                    </div>
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <div className="text-right hidden sm:block">
                            <div className="text-xs text-slate-500 dark:text-slate-400">System Time</div>
                            <div className="font-mono text-xl">{currentTime.toLocaleTimeString()}</div>
                        </div>

                        {/* MODE TOGGLE */}
                        <button onClick={() => setDarkMode(!darkMode)}
                            className={`p-3 rounded-full transition-all ${darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-slate-200 text-orange-500'}`}>
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* NOTIFICATIONS */}
                        <button onClick={alertsEnabled ? () => setAlertsEnabled(false) : requestNotificationPermission}
                            className={`p-3 rounded-full transition-all ${alertsEnabled ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                            <Bell size={20} />
                        </button>
                    </div>
                </div>

                {/* SECTION 1: CONFIGURATION */}
                <CollapsibleSection title="Configuration" icon={Shield}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <label className="text-blue-700 dark:text-blue-200 text-xs font-bold uppercase tracking-wider mb-2 block">Balance ($)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-blue-600 dark:text-blue-400">$</span>
                                <input type="text" value={balanceInput} onChange={(e) => setBalanceInput(e.target.value)}
                                    className="w-full pl-8 pr-4 py-2 bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-lg" />
                            </div>
                        </div>
                        <div>
                            <label className="text-blue-700 dark:text-blue-200 text-xs font-bold uppercase tracking-wider mb-2 block">Broker & Lev</label>
                            <div className="flex gap-2">
                                <select value={broker} onChange={(e) => setBroker(e.target.value)}
                                    className="w-full px-2 py-2 bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm">
                                    {Object.keys(BROKERS).map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                                <select value={leverage} onChange={(e) => setLeverage(e.target.value)}
                                    className="w-24 px-2 py-2 bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm">
                                    {BROKERS[broker].leverage.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>
                            <div className="mt-1 text-[10px] text-slate-500 dark:text-slate-400 text-right">
                                {BROKERS[broker].regulation}
                            </div>
                        </div>
                        <div>
                            <label className="text-blue-700 dark:text-blue-200 text-xs font-bold uppercase tracking-wider mb-2 block">Risk Mode</label>
                            <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-lg border border-slate-300 dark:border-white/20">
                                <button onClick={() => setSafeMode(true)} className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${safeMode ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' : 'text-slate-400'}`}>Safe</button>
                                <button onClick={() => setSafeMode(false)} className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${!safeMode ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' : 'text-slate-400'}`}>Aggr.</button>
                            </div>
                        </div>
                        <div>
                            <label className="text-blue-700 dark:text-blue-200 text-xs font-bold uppercase tracking-wider mb-2 block">Tax (2025)</label>
                            <select value={taxBracketIndex} onChange={(e) => setTaxBracketIndex(parseInt(e.target.value))}
                                className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-white/20 rounded-lg text-slate-900 dark:text-white text-sm">
                                {TAX_BRACKETS_2025.map((b, i) => <option key={i} value={i}>{b.label}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* DATA BACKUP CONTROLS */}
                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10 flex justify-between items-center">
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                            <Save size={14} /> System Data Control
                        </div>
                        <div className="flex gap-3">
                            <button onClick={backupData} className="text-xs flex items-center gap-1 bg-blue-100 dark:bg-blue-600/20 hover:bg-blue-200 dark:hover:bg-blue-600/40 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded transition-colors border border-blue-300 dark:border-blue-500/30">
                                <Download size={12} /> Backup JSON
                            </button>
                            <label className="cursor-pointer text-xs flex items-center gap-1 bg-green-100 dark:bg-green-600/20 hover:bg-green-200 dark:hover:bg-green-600/40 text-green-700 dark:text-green-300 px-3 py-1.5 rounded transition-colors border border-green-300 dark:border-green-500/30">
                                <Upload size={12} /> Restore
                                <input type="file" accept=".json" onChange={restoreData} className="hidden" />
                            </label>
                        </div>
                    </div>
                </CollapsibleSection>

                {/* SECTION 2: METRICS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white dark:bg-gradient-to-br dark:from-blue-600/20 dark:to-indigo-600/20 rounded-xl p-6 border border-slate-200 dark:border-white/10 relative overflow-hidden shadow-sm dark:shadow-none">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white"><TrendingUp size={20} /> Tier Status</h3>
                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between border-b border-slate-200 dark:border-white/10 pb-2">
                                <span className="text-blue-700 dark:text-blue-200">Current Tier</span>
                                <span className="font-bold text-green-600 dark:text-green-400 text-lg">{currentTier.name}</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-black/30 h-3 rounded-full overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-400 to-green-400 h-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                            </div>
                            <p className="text-xs text-slate-500 dark:text-blue-300 italic">{currentTier.desc}</p>
                        </div>
                    </div>

                    <div className={`rounded-xl p-6 border border-slate-200 dark:border-white/10 relative overflow-hidden transition-colors duration-500 shadow-sm dark:shadow-none ${safeMode ? 'bg-emerald-50 dark:bg-emerald-600/20' : 'bg-orange-50 dark:bg-orange-600/20'}`}>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white"><Target size={20} /> Risk Controls</h3>
                        <div className="space-y-2 relative z-10 text-sm">
                            <div className="flex justify-between pb-2 border-b border-slate-200 dark:border-white/10">
                                <span className="text-slate-700 dark:text-white">Rec. Lots</span>
                                <span className="font-bold text-xl text-slate-900 dark:text-white">{lotSize}</span>
                            </div>
                            <div className="flex justify-between pb-2 border-b border-slate-200 dark:border-white/10">
                                <span className="text-slate-700 dark:text-white">Max Loss</span>
                                <span className="font-bold text-red-600 dark:text-red-300">${maxLoss}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-700 dark:text-white">Margin ({newTrade.pair || 'EURUSD'})</span>
                                <span className="font-mono text-blue-600 dark:text-blue-200">${marginRequired}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gradient-to-br dark:from-slate-700/50 dark:to-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-white/10 relative overflow-hidden shadow-sm dark:shadow-none">
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white"><Calculator size={20} /> Tax Est.</h3>
                            <button onClick={() => setIsSection1256(!isSection1256)}
                                className={`text-[10px] px-2 py-1 rounded border ${isSection1256 ? 'bg-purple-100 dark:bg-purple-500/20 border-purple-500 text-purple-700 dark:text-purple-300' : 'bg-slate-100 dark:bg-slate-600/20 border-slate-500 text-slate-500 dark:text-slate-400'}`}>
                                {isSection1256 ? '1256 (60/40)' : 'Ord. Income'}
                            </button>
                        </div>
                        <div className="space-y-3 relative z-10 text-sm">
                            <div className="flex justify-between text-slate-600 dark:text-slate-300">
                                <span>Gross P&L</span>
                                <span className={totalPnL >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>${totalPnL.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-600 dark:text-slate-300">
                                <span>Est. Tax ({(activeTaxRate * 100).toFixed(1)}%)</span>
                                <span className="text-red-500 dark:text-red-300">-${estimatedTax.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-slate-200 dark:border-white/20 pt-2 flex justify-between">
                                <span className="font-bold text-slate-800 dark:text-white">Net Pocket</span>
                                <span className={`font-bold text-lg ${netPocket >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>${netPocket.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION 3: ENTRY */}
                <div className="bg-white dark:bg-white/10 dark:backdrop-blur-md rounded-xl p-6 border border-slate-200 dark:border-white/20 mb-6 shadow-md dark:shadow-blue-900/10">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white"><DollarSign /> Trade Entry</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="col-span-2 md:col-span-1">
                            <label className="text-xs text-blue-700 dark:text-blue-200 block mb-1">Pair</label>
                            <input type="text" placeholder="EURUSD" value={newTrade.pair}
                                onChange={e => setNewTrade({ ...newTrade, pair: e.target.value.toUpperCase() })}
                                className="w-full bg-slate-100 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded px-3 py-3 uppercase focus:ring-blue-500 outline-none text-lg font-bold text-slate-900 dark:text-white"
                                list="common-pairs"
                            />
                            <datalist id="common-pairs">{COMMON_PAIRS.map(p => <option key={p} value={p} />)}</datalist>
                        </div>
                        <div>
                            <label className="text-xs text-blue-700 dark:text-blue-200 block mb-1">Dir</label>
                            <select value={newTrade.direction} onChange={e => setNewTrade({ ...newTrade, direction: e.target.value })}
                                className="w-full bg-slate-100 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded px-3 py-3 focus:ring-blue-500 outline-none text-sm text-slate-900 dark:text-white">
                                <option value="Long">Long</option><option value="Short">Short</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-blue-700 dark:text-blue-200 block mb-1">Entry</label>
                            <input type="number" placeholder={pairMeta.placeholder} step={pairMeta.step} value={newTrade.entry}
                                onChange={e => setNewTrade({ ...newTrade, entry: e.target.value })}
                                className="w-full bg-slate-100 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded px-3 py-3 focus:ring-blue-500 outline-none text-slate-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="text-xs text-blue-700 dark:text-blue-200 block mb-1">Exit</label>
                            <input type="number" placeholder={pairMeta.placeholder} step={pairMeta.step} value={newTrade.exit}
                                onChange={e => setNewTrade({ ...newTrade, exit: e.target.value })}
                                className="w-full bg-slate-100 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded px-3 py-3 focus:ring-blue-500 outline-none text-slate-900 dark:text-white" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <button onClick={addTrade} disabled={!isFormValid}
                            className={`w-full font-bold py-3 rounded-lg text-lg transition-all shadow-xl ${isFormValid ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20' : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                            {isFormValid ? `Log Result ($${calculatePnL(newTrade)})` : 'Enter Trade Details'}
                        </button>
                    </div>
                </div>

                {/* SECTION 4: CHARTS */}
                {trades.length > 0 && (
                    <CollapsibleSection title="Performance Charts" icon={PieIcon} defaultOpen={false}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 bg-slate-100 dark:bg-white/5 rounded-xl p-4 border border-slate-200 dark:border-white/10">
                                <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">Growth Curve</h3>
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={balanceHistory}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                                        <XAxis dataKey="trade" stroke="#64748b" tick={{ fontSize: 10 }} />
                                        <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                                        <Tooltip contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#ffffff', borderColor: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? '#fff' : '#000' }} />
                                        <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="bg-slate-100 dark:bg-white/5 rounded-xl p-4 border border-slate-200 dark:border-white/10">
                                <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">Win/Loss Ratio</h3>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie data={[{ name: 'Wins', value: winCount }, { name: 'Losses', value: lossCount }]} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                                            {[{ name: 'Wins', value: winCount }, { name: 'Losses', value: lossCount }].map((entry, index) => <Cell key={`cell-${index}`} fill={['#10b981', '#ef4444'][index]} />)}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#ffffff', borderColor: darkMode ? '#334155' : '#e2e8f0' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </CollapsibleSection>
                )}

                {/* SECTION 5: JOURNAL */}
                <CollapsibleSection title={`Journal (${trades.length})`} icon={Brain}>
                    <div className="flex justify-end mb-4">
                        <button onClick={exportToCSV} className="text-xs flex items-center gap-1 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 px-3 py-1.5 rounded transition-colors text-slate-600 dark:text-white">
                            <Download size={14} /> Export CSV
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-blue-600 dark:text-blue-300 border-b border-slate-200 dark:border-white/10">
                                    <th className="pb-3 pl-2">Time</th>
                                    <th className="pb-3">Pair</th>
                                    <th className="pb-3">Dir</th>
                                    <th className="pb-3">P&L</th>
                                    <th className="pb-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trades.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center py-6 text-slate-500">No trades recorded.</td></tr>
                                ) : (
                                    trades.map(t => (
                                        <tr key={t.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                                            <td className="py-3 pl-2 text-slate-600 dark:text-white">{t.date} <span className="text-xs text-slate-400 dark:text-slate-500">{t.time}</span></td>
                                            <td className="py-3 font-bold text-slate-800 dark:text-white">{t.pair}</td>
                                            <td className="py-3"><span className={`px-2 py-0.5 rounded text-xs ${t.direction === 'Long' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'}`}>{t.direction}</span></td>
                                            <td className={`py-3 font-bold ${t.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>${t.pnl.toFixed(2)}</td>
                                            <td className="py-3 text-right">
                                                <button onClick={() => deleteTrade(t.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CollapsibleSection>

            </div>
        </div>
    );
};

export default App;