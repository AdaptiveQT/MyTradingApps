'use client';

import { useState } from 'react';
import { GlowButton } from '@/components/Marketing';
import Image from 'next/image';

// Alpha Edge Iron Rules
const ironRules = [
    { rule: '1% Risk Maximum', desc: 'Never risk more than 1% per trade. Beginners: 0.5%.' },
    { rule: 'Journal Everything', desc: 'Every trade logged. No exceptions. No excuses.' },
    { rule: 'Demo 100+ Trades First', desc: 'Prove profitability before going live.' },
    { rule: 'No Revenge Trading', desc: 'Lost 3 in a row? Walk away. Come back tomorrow.' },
    { rule: 'One Strategy at a Time', desc: 'Master one before adding complexity.' },
];

// Honorable Mentions
const honorableMentions = [
    {
        name: 'Carry Trade',
        desc: 'Long high-interest currency vs low (e.g., AUD/JPY). Collect rollover. Risk: Sudden unwinds.',
    },
    {
        name: 'Pure Price Action at S/R',
        desc: 'Trade pin bars/engulfing at clear horizontal support/resistance. Confluence only. Simplest edge.',
    },
];

// Strategy section data
const strategies = [
    // ========== ALPHA EDGE A+ STRATEGIES ==========
    {
        id: 'trend-following',
        name: 'Trend Following',
        tagline: 'The Patient Predator',
        icon: '📈',
        difficulty: 'Beginner-Friendly',
        winRate: '55-65%',
        description: 'Decades of evidence (Turtles, CTAs, Paul Tudor Jones). Long when price > 200 SMA, exit when below. Holds months to years. Minimal screen time. Outperforms buy-hold in trending regimes.',
        components: [
            {
                title: '200-Period SMA Filter',
                desc: 'The backbone. Long only above, short only below. Daily/weekly charts preferred.',
            },
            {
                title: '50/200 Golden Cross',
                desc: 'Optional entry filter. 50 EMA crossing above 200 SMA confirms the trend.',
            },
            {
                title: 'ATR Trailing Stop',
                desc: 'Trail stops with 2-3x ATR or prior swing highs/lows. Let winners run.',
            },
            {
                title: 'Position Sizing',
                desc: 'Fixed fractional sizing. Hold until signal reverses. No discretion.',
            },
        ],
        implementation: [
            'Identify price position relative to 200 SMA on daily chart',
            'If above 200 SMA, look for long entries on pullbacks',
            'Optional: Wait for 50/200 golden cross for extra confirmation',
            'Set ATR-based trailing stop. Hold for weeks to months.',
        ],
        stats: {
            winRate: '55-65%',
            avgRR: '3-5R',
            bestPairs: 'Indices, Forex Majors, BTC',
        },
    },
    {
        id: 'mean-reversion',
        name: 'Mean Reversion RSI',
        tagline: 'The Contrarian',
        icon: '🔄',
        difficulty: 'Beginner-Friendly',
        winRate: '70-75%',
        description: 'Quant-backed strategy. Buy RSI(2) < 10-15. Sell/short > 85. Exit at midline. Studies show 1-4% avg gain per trade in ranging markets. Always filter with trend.',
        components: [
            {
                title: 'RSI(2) Extremes',
                desc: 'Ultra-short RSI captures exhaustion. Below 10 = extreme oversold. Above 90 = extreme overbought.',
            },
            {
                title: '200 MA Trend Filter',
                desc: 'Only take longs above 200 MA. Only take shorts below. Avoid fighting the trend.',
            },
            {
                title: 'Midline Exit',
                desc: 'Exit at RSI 50 or opposite extreme. Quick, mechanical exits.',
            },
            {
                title: 'Tight Stop Management',
                desc: 'Stop beyond recent swing. Low exposure time reduces risk.',
            },
        ],
        implementation: [
            'Apply RSI(2) to daily chart',
            'Filter: Trade only in direction of 200 MA',
            'Enter when RSI(2) < 15 (long) or > 85 (short)',
            'Exit at RSI 50 or scale out at opposite extreme',
        ],
        stats: {
            winRate: '70-75%',
            avgRR: '1.5-2R',
            bestPairs: 'Forex Majors, Indices, Low-Vol Stocks',
        },
    },
    {
        id: 'swing-pullbacks',
        name: 'Swing Pullbacks',
        tagline: 'The Sniper',
        icon: '🎯',
        difficulty: 'Intermediate',
        winRate: '50-60%',
        description: 'Combines trend + reversion. Wait for HTF trend, then buy pullbacks to structure (Fib 50-61.8%, EMA cluster, prior swing). Enter on reversal candle. Targeting 2-4R.',
        components: [
            {
                title: 'HTF Trend Identification',
                desc: 'Daily chart: Price > 200 MA = bullish bias. Only look for longs.',
            },
            {
                title: 'LTF Pullback Zones',
                desc: 'H4/H1: Wait for pullback to 50-61.8% Fib, EMA cluster (8/21/50), or prior swing.',
            },
            {
                title: 'Reversal Confirmation',
                desc: 'Pin bar, engulfing candle, or RSI divergence on the LTF. No naked entries.',
            },
            {
                title: 'Structured Targets',
                desc: 'Target next swing high/low or fixed 2-4R. Trail remainder.',
            },
        ],
        implementation: [
            'Identify HTF trend (price > 200 MA on daily)',
            'Switch to H4/H1 and wait for pullback to structure',
            'Confirm reversal with candle pattern + momentum (RSI divergence)',
            'Enter with stop below swing. Target 2-4R.',
        ],
        stats: {
            winRate: '50-60%',
            avgRR: '2-4R',
            bestPairs: 'Forex, Indices, Crypto',
        },
    },
    {
        id: 'breakout-trading',
        name: 'Breakout Trading',
        tagline: 'The Volatility Hunter',
        icon: '💥',
        difficulty: 'Intermediate',
        winRate: '45-55%',
        description: 'Identify tight consolidation (narrow ATR, squeeze). Enter on close beyond range with volume spike. High reward on winners. Strong in volatile regimes like 2025 post-rate cycles.',
        components: [
            {
                title: 'Range Identification',
                desc: '20-period Bollinger squeeze or ATR at multi-week lows. Price coiling = explosion incoming.',
            },
            {
                title: 'Volume/Momentum Confirmation',
                desc: 'ADX > 25 or clear volume spike on breakout. Avoid low-volume fakeouts.',
            },
            {
                title: 'Measured Move Targets',
                desc: 'Project range height from breakout point. Classic 1:1 measured move.',
            },
            {
                title: 'Session Alignment',
                desc: 'Best during London/NY opens. Avoid Asian session breakouts.',
            },
        ],
        implementation: [
            'Identify consolidation zone (tight range, low ATR)',
            'Wait for close beyond range high/low',
            'Confirm with volume spike or ADX > 25',
            'Target measured move (range height) or 3:1 R:R',
        ],
        stats: {
            winRate: '45-55%',
            avgRR: '3-5R',
            bestPairs: 'Indices, BTC, High-Beta Forex',
        },
    },
    {
        id: 'ict-confluence',
        name: 'ICT Confluence Reversal',
        tagline: 'The Institutional Hunter',
        icon: '🏆',
        difficulty: 'Advanced',
        winRate: '68-75%',
        description: 'The 2025 hybrid model combining ICT smart money concepts with BB 2.0 and EMA filters. Hunt liquidity sweeps into confluent PD arrays, then enter on rejection. Backtested 70%+ win rate on Gold and USDJPY with 2.5+ RR.',
        components: [
            {
                title: 'HTF Bias (Daily/4H)',
                desc: '20/50/200 EMA stack alignment. Price above rising stack = bullish bias. Mark key liquidity pools (old highs/lows, equal H/L).',
            },
            {
                title: 'Mid-TF Confluence (1H/15M)',
                desc: 'Hunt for fresh OB/FVG/Breaker + Suspension Block overlap. The "golden zone" filters junk setups beautifully.',
            },
            {
                title: 'LTF Entry + Filters (5M/1M)',
                desc: 'Wait for liquidity sweep (raid beyond BB ±2 SD). Pullback touches BB band + holds above/below key EMA.',
            },
            {
                title: 'Killzone Timing',
                desc: 'NY open/reversal for Gold volatility. London/NY overlap for USDJPY trends. No trades outside killzones.',
            },
        ],
        implementation: [
            'Identify HTF bias: Check 20/50/200 EMA stack on Daily/4H chart',
            'Mark liquidity pools: Recent swing highs/lows, equal highs/lows, PDH/PDL',
            'Drop to 1H/15M: Find confluence zone (fresh OB + FVG + EMA cluster)',
            'Wait for displacement into liquidity (price raids beyond BB ±2 SD)',
            'Enter on rejection candle (engulfing/pin bar) at the confluent array',
            'SL beyond sweep extreme. TP at next opposing liquidity or 1:3+ RR',
        ],
        stats: {
            winRate: '68-75%',
            avgRR: '2.5-4R',
            bestPairs: 'XAUUSD, USDJPY, NAS100, EURUSD',
        },
    },
    // ========== ORIGINAL STRATEGIES ==========
    {
        id: 'retail-beast',
        name: 'Retail Beast',
        tagline: 'The Everyday Warrior',
        icon: '🦾',
        difficulty: 'Beginner-Friendly',
        winRate: '77-80%',
        description: 'Your custom TradingView/MT5 indicator blending ICT/SMC concepts with proven 2025 edges. Designed for retail traders to compete with institutions.',
        components: [
            {
                title: 'Fresh Internal Order Blocks',
                desc: 'Last opposite candle before the move — first touch reversal signals with high probability.',
            },
            {
                title: 'Bollinger Band 1.0 Extremes',
                desc: 'Statistical filter using tight bands — touches indicate exhaustion and reversal zones.',
            },
            {
                title: 'EMA 8/21 Bias',
                desc: 'Simple but effective — trade in the direction of the trend using EMA crossovers.',
            },
            {
                title: 'Killzone Filtering',
                desc: 'London and NY sessions only — avoid the noise, trade the volume.',
            },
        ],
        implementation: [
            'Load the indicator on 1-min or 5-min charts',
            'Wait for 3-confluence signals (OB + BB + EMA alignment)',
            'Enter on candle close with ATR-based stop loss',
            'Trail using 5-EMA for maximum trend capture',
        ],
        stats: {
            winRate: '77-80%',
            avgRR: '3.1R',
            bestPairs: 'BTC, ETH, XAU, EUR/USD',
        },
    },
    {
        id: 'quantum-oracle',
        name: 'Quantum Oracle Arb',
        tagline: 'The Future-Seer',
        icon: '🔮',
        difficulty: 'Advanced',
        winRate: '85%+',
        description: 'Quantum computing principles applied to arbitrage — process vast datasets, predict inefficiencies, and simulate multiple scenarios simultaneously.',
        components: [
            {
                title: 'Quantum Superposition',
                desc: 'Explore thousands of arbitrage paths simultaneously using qubits instead of classical bits.',
            },
            {
                title: 'Oracle Query System',
                desc: 'Quantum subroutine that queries order books and funding rates to find hidden patterns.',
            },
            {
                title: 'Triangular Arb Detection',
                desc: 'Uses Grover\'s algorithm for exponentially faster search across currency pairs.',
            },
            {
                title: 'Condition Number Estimation',
                desc: 'Quantum model estimates how sensitive the arbitrage is to market changes.',
            },
        ],
        implementation: [
            'Input market data: prices, volumes, latencies across exchanges',
            'Quantum model estimates "condition number" for sensitivity analysis',
            'If profitable path detected, execute via low-latency API',
            'Hybridize with classical ML for robustness against quantum noise',
        ],
        stats: {
            winRate: '85%+',
            avgRR: 'Risk-Free Arb',
            bestPairs: 'Cross-exchange BTC, ETH',
        },
    },
    {
        id: 'speed-demon',
        name: 'Low-Latency Basis Arb',
        tagline: 'The Speed Demon',
        icon: '⚡',
        difficulty: 'Professional',
        winRate: '90%+',
        description: 'A powerhouse hybrid: Statistical Basis trading + Gamma Scalping + Predictive Funding Arb. Built for HFT in perpetual markets.',
        components: [
            {
                title: 'Statistical Basis Trading',
                desc: 'Exploit perp vs spot price discrepancies using Z-score mean-reversion with <1ms execution.',
            },
            {
                title: 'Gamma Scalping',
                desc: 'Dynamic delta hedging to extract extra profits from basis positions — adds 10-30% yield.',
            },
            {
                title: 'Predictive Funding Arb',
                desc: 'ML models (LightGBM) predict funding rate shifts before they happen.',
            },
            {
                title: 'Kalman Filter Integration',
                desc: 'Advanced statistical filtering for optimal entry/exit timing.',
            },
        ],
        implementation: [
            'Monitor basis deviation: Z = (current - mean) / std dev',
            'Enter when Z > 2 (statistically significant)',
            'Predict funding shift using ML model on historical rates',
            'Gamma scalp the position with dynamic delta hedging',
        ],
        stats: {
            winRate: '90%+',
            avgRR: '2-5% per cycle',
            bestPairs: 'BTC/ETH Perps vs Spot',
        },
    },
];

// Math formulas for display
const mathConcepts = [
    {
        name: 'Z-Score (Basis)',
        formula: 'Z = (Current Basis - Mean) / Std Dev',
        desc: 'Measures how many standard deviations the current basis is from the mean.',
    },
    {
        name: 'Gamma',
        formula: 'Γ = ∂²V / ∂S²',
        desc: 'Second derivative of option/position value with respect to spot price.',
    },
    {
        name: 'Quantum Speedup',
        formula: 'O(√N) vs O(N)',
        desc: 'Quantum algorithms solve search problems quadratically faster than classical.',
    },
];

export default function StrategiesPage() {
    const [activeStrategy, setActiveStrategy] = useState(strategies[0].id);
    const active = strategies.find(s => s.id === activeStrategy) || strategies[0];

    return (
        <div className="relative">
            {/* Hero */}
            <section className="section-padding relative overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-30" />
                <div className="absolute inset-0 bg-radial-glow" />

                <div className="container-narrow mx-auto relative z-10 text-center">
                    <span className="inline-block px-4 py-2 rounded-full bg-beast-green/10 text-beast-green text-sm font-medium mb-6 border border-beast-green/20">
                        Advanced Trading Strategies
                    </span>
                    <h1 className="heading-cyber text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        <span className="text-white">The 2025</span>
                        <br />
                        <span className="gradient-text">Strategy Arsenal</span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                        From beginner-friendly retail setups to quantum-powered institutional strategies.
                        Master the edge that separates profitable traders from the crowd.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        {strategies.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setActiveStrategy(s.id)}
                                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${activeStrategy === s.id
                                    ? 'bg-beast-green text-black'
                                    : 'glass-card text-gray-300 hover:text-white hover:border-beast-green/50'
                                    }`}
                            >
                                <span className="text-xl">{s.icon}</span>
                                {s.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Strategy Detail */}
            <section className="section-padding">
                <div className="container-wide mx-auto">
                    <div className="glass-card rounded-2xl p-8 md:p-12">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-5xl">{active.icon}</span>
                                    <div>
                                        <h2 className="heading-cyber text-3xl text-white">{active.name}</h2>
                                        <p className="text-beast-green">{active.tagline}</p>
                                    </div>
                                </div>
                                <p className="text-gray-400 max-w-2xl">{active.description}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${active.difficulty === 'Beginner-Friendly'
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : active.difficulty === 'Advanced'
                                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    }`}>
                                    {active.difficulty}
                                </span>
                                <span className="text-2xl font-bold text-beast-green">{active.winRate} Win Rate</span>
                            </div>
                        </div>

                        {/* Components Grid */}
                        <div className="mb-12">
                            <h3 className="heading-cyber text-xl text-white mb-6">Core Components</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {active.components.map((comp, i) => (
                                    <div key={i} className="bg-cyber-dark rounded-xl p-6 border border-cyber-border">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="w-8 h-8 rounded-lg bg-beast-green/20 text-beast-green flex items-center justify-center text-sm font-bold">
                                                {i + 1}
                                            </span>
                                            <h4 className="font-medium text-white">{comp.title}</h4>
                                        </div>
                                        <p className="text-gray-400 text-sm">{comp.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Implementation Steps */}
                        <div className="mb-12">
                            <h3 className="heading-cyber text-xl text-white mb-6">Implementation</h3>
                            <div className="bg-cyber-dark rounded-xl p-6 border border-cyber-border">
                                <ol className="space-y-4">
                                    {active.implementation.map((step, i) => (
                                        <li key={i} className="flex items-start gap-4">
                                            <span className="w-6 h-6 rounded-full bg-beast-green text-black flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                                {i + 1}
                                            </span>
                                            <span className="text-gray-300">{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 mb-8">
                            <div className="text-center p-6 rounded-xl bg-cyber-dark border border-cyber-border">
                                <div className="text-2xl font-bold text-beast-green mb-1">{active.stats.winRate}</div>
                                <div className="text-gray-500 text-sm">Win Rate</div>
                            </div>
                            <div className="text-center p-6 rounded-xl bg-cyber-dark border border-cyber-border">
                                <div className="text-2xl font-bold text-beast-gold mb-1">{active.stats.avgRR}</div>
                                <div className="text-gray-500 text-sm">Avg Return</div>
                            </div>
                            <div className="text-center p-6 rounded-xl bg-cyber-dark border border-cyber-border">
                                <div className="text-lg font-bold text-white mb-1">{active.stats.bestPairs}</div>
                                <div className="text-gray-500 text-sm">Best Markets</div>
                            </div>
                        </div>

                        {/* CTA */}
                        {active.id === 'retail-beast' && (
                            <div className="text-center">
                                <GlowButton href="/pricing">
                                    Download Free MT5 Indicator
                                </GlowButton>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Math Section */}
            <section className="section-padding bg-cyber-dark">
                <div className="container-narrow mx-auto">
                    <h2 className="heading-cyber text-3xl text-white text-center mb-12">
                        The Math <span className="text-beast-green">Behind the Edge</span>
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {mathConcepts.map((concept, i) => (
                            <div key={i} className="glass-card rounded-xl p-6 text-center">
                                <h3 className="font-medium text-white mb-3">{concept.name}</h3>
                                <div className="font-mono text-beast-green text-lg mb-3 p-3 rounded-lg bg-cyber-dark border border-cyber-border">
                                    {concept.formula}
                                </div>
                                <p className="text-gray-400 text-sm">{concept.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Hybrid Strategy */}
            <section className="section-padding">
                <div className="container-narrow mx-auto">
                    <div className="glass-card rounded-2xl p-8 md:p-12 border-beast-green/30">
                        <div className="text-center mb-8">
                            <span className="text-4xl mb-4 block">🔥</span>
                            <h2 className="heading-cyber text-3xl text-white mb-4">
                                The Ultimate <span className="gradient-text">Hybrid Strategy</span>
                            </h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">
                                Combine all three strategies for maximum edge. Here&apos;s how the pros do it.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="font-medium text-beast-green flex items-center gap-2">
                                    <span className="w-6 h-6 rounded bg-beast-green/20 flex items-center justify-center text-xs">B</span>
                                    Beginner Hybrid
                                </h3>
                                <ol className="space-y-2 text-gray-300 text-sm">
                                    <li>1. Use Retail Beast for signal generation</li>
                                    <li>2. Check funding rate direction before entry</li>
                                    <li>3. Hold positions through positive funding</li>
                                    <li>4. Exit on Beast trail-stop signal</li>
                                </ol>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-medium text-beast-gold flex items-center gap-2">
                                    <span className="w-6 h-6 rounded bg-beast-gold/20 flex items-center justify-center text-xs">P</span>
                                    Pro Hybrid
                                </h3>
                                <ol className="space-y-2 text-gray-300 text-sm">
                                    <li>1. Low-latency execute on Beast confluence</li>
                                    <li>2. Predict funding shift with ML model</li>
                                    <li>3. Gamma scalp basis during hold</li>
                                    <li>4. Quantum optimize multi-leg positions</li>
                                </ol>
                            </div>
                        </div>

                        <div className="mt-8 p-6 rounded-xl bg-cyber-dark border border-beast-green/30 text-center">
                            <div className="text-3xl font-bold text-beast-green mb-2">380-1,400% Annualized</div>
                            <div className="text-gray-400">Potential returns with full hybrid implementation</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== ALPHA EDGE IRON RULES ========== */}
            <section className="section-padding">
                <div className="container-narrow mx-auto">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-2 rounded-full bg-red-500/10 text-red-400 text-sm font-medium mb-4 border border-red-500/20">
                            ⚡ Alpha Edge Protocol
                        </span>
                        <h2 className="heading-cyber text-3xl text-white mb-4">
                            The <span className="text-red-400">Iron Rules</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Break these and you lose. No exceptions. No excuses. This is what separates profitable traders from the crowd.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-5 gap-4">
                        {ironRules.map((item, i) => (
                            <div key={i} className="glass-card rounded-xl p-6 text-center border-red-500/20 hover:border-red-500/40 transition-colors">
                                <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                                    <span className="text-red-400 font-bold">{i + 1}</span>
                                </div>
                                <h3 className="font-medium text-white text-sm mb-2">{item.rule}</h3>
                                <p className="text-gray-500 text-xs">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== HONORABLE MENTIONS ========== */}
            <section className="section-padding bg-cyber-dark">
                <div className="container-narrow mx-auto">
                    <h2 className="heading-cyber text-2xl text-white text-center mb-8">
                        Honorable <span className="text-beast-gold">Mentions</span>
                    </h2>
                    <p className="text-gray-400 text-center max-w-xl mx-auto mb-8 text-sm">
                        Regime-dependent strategies. Use only when conditions align.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        {honorableMentions.map((item, i) => (
                            <div key={i} className="bg-cyber-surface rounded-xl p-6 border border-cyber-border">
                                <h3 className="font-medium text-beast-gold mb-2 flex items-center gap-2">
                                    <span className="text-lg">⭐</span>
                                    {item.name}
                                </h3>
                                <p className="text-gray-400 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding bg-cyber-dark">
                <div className="container-narrow mx-auto text-center">
                    <h2 className="heading-cyber text-3xl md:text-4xl text-white mb-4">
                        Ready to <span className="text-beast-green">Unleash the Beast?</span>
                    </h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                        Start with the free MT5 indicator and work your way up. The edge is waiting.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <GlowButton href="/pricing">
                            Get Started Free
                        </GlowButton>
                        <GlowButton href="/docs" variant="outline">
                            Read the Docs
                        </GlowButton>
                    </div>
                </div>
            </section>
        </div>
    );
}
