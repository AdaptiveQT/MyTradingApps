'use client';

import { useState } from 'react';
import { GlowButton } from '@/components/Marketing';

// Checklist phases based on ICT Confluence Reversal strategy
const checklistPhases = [
    {
        id: 'htf-bias',
        title: 'HTF Bias Check',
        subtitle: 'Daily / 4H Timeframe',
        icon: '📊',
        items: [
            {
                id: 'ema-stack',
                label: 'EMA Stack Aligned',
                desc: '20/50/200 EMAs stacked in order. Price above rising stack = bullish bias.',
                critical: true,
            },
            {
                id: 'liquidity-marked',
                label: 'Key Liquidity Pools Marked',
                desc: 'Old highs/lows, equal highs/lows, PDH/PDL identified on chart.',
                critical: true,
            },
            {
                id: 'market-structure',
                label: 'Market Structure Clear',
                desc: 'BOS or CHoCH confirms the directional bias. No conflicting structure.',
                critical: false,
            },
            {
                id: 'news-check',
                label: 'High-Impact News Check',
                desc: 'No major news events within 30 min of entry. Fed/BOJ announcements avoided.',
                critical: true,
            },
        ],
    },
    {
        id: 'mid-tf-confluence',
        title: 'Mid-TF Confluence',
        subtitle: '1H / 15M Timeframe',
        icon: '🎯',
        items: [
            {
                id: 'fresh-array',
                label: 'Fresh PD Array Present',
                desc: 'Unmitigated Order Block, Fair Value Gap, or Breaker Block identified.',
                critical: true,
            },
            {
                id: 'array-overlap',
                label: 'Multiple Confluences Overlap',
                desc: 'OB + FVG + EMA cluster stacking in same zone (the "golden zone").',
                critical: true,
            },
            {
                id: 'discount-premium',
                label: 'Correct Discount/Premium',
                desc: 'Buying in discount (below 50% of range). Selling in premium (above 50%).',
                critical: false,
            },
            {
                id: 'suspension-block',
                label: 'Suspension Block Present',
                desc: 'Dual-imbalance candle present (FVG above AND below) = strong pause zone.',
                critical: false,
            },
        ],
    },
    {
        id: 'ltf-entry',
        title: 'LTF Entry Filters',
        subtitle: '5M / 1M Timeframe',
        icon: '⚡',
        items: [
            {
                id: 'bb-extreme',
                label: 'BB ±2 SD Touched',
                desc: 'Price touched or exceeded Bollinger Band ±2 SD (liquidity raid detected).',
                critical: true,
            },
            {
                id: 'ema-confirmation',
                label: 'EMA Confirmation',
                desc: 'Price holds above key EMA (e.g., 9/21) for longs after raid. Cross or rejection.',
                critical: true,
            },
            {
                id: 'killzone-active',
                label: 'Killzone Active',
                desc: 'Trading during London (3-6 AM EST), NY (8-11 AM EST), or Power Hour.',
                critical: true,
            },
            {
                id: 'rejection-candle',
                label: 'Rejection Candle Formed',
                desc: 'Pin bar, engulfing, or strong directional candle at the confluent zone.',
                critical: true,
            },
        ],
    },
    {
        id: 'risk-management',
        title: 'Risk Management',
        subtitle: 'Before Execution',
        icon: '🛡️',
        items: [
            {
                id: 'risk-percent',
                label: 'Risk ≤ 1% of Account',
                desc: 'Position sized correctly. Beginners: 0.5%. Never exceed 1%.',
                critical: true,
            },
            {
                id: 'sl-placement',
                label: 'SL Beyond Sweep Extreme',
                desc: 'Stop loss placed beyond the liquidity raid wick or array extreme.',
                critical: true,
            },
            {
                id: 'rr-minimum',
                label: 'Minimum 1:2.5 RR',
                desc: 'Target offers at least 2.5R. Higher RR for A+ setups (1:3+).',
                critical: false,
            },
            {
                id: 'tp-location',
                label: 'TP at Opposing Liquidity',
                desc: 'Target next liquidity pool, BB midline, or opposing array.',
                critical: false,
            },
        ],
    },
];

// Best pairs for this strategy
const bestPairs = [
    { symbol: 'XAUUSD', name: 'Gold', notes: 'Highly manipulated. Best for NY open reversals. Explosive moves.' },
    { symbol: 'USDJPY', name: 'USD/JPY', notes: 'Trendy. Respects OB/FVG. Great for London/NY overlap.' },
    { symbol: 'NAS100', name: 'Nasdaq', notes: 'NY open monster. Stop hunts around round numbers.' },
    { symbol: 'EURUSD', name: 'EUR/USD', notes: 'Clean structure. Tighter stops. High win rate.' },
];

export default function ChecklistPage() {
    const [checked, setChecked] = useState<Record<string, boolean>>({});

    const toggleItem = (id: string) => {
        setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const getPhaseProgress = (phase: typeof checklistPhases[0]) => {
        const checkedCount = phase.items.filter((item) => checked[item.id]).length;
        return { checkedCount, total: phase.items.length };
    };

    const getCriticalMissing = () => {
        return checklistPhases.flatMap((phase) =>
            phase.items.filter((item) => item.critical && !checked[item.id])
        );
    };

    const allCriticalChecked = getCriticalMissing().length === 0;
    const totalChecked = Object.values(checked).filter(Boolean).length;
    const totalItems = checklistPhases.reduce((acc, p) => acc + p.items.length, 0);

    const resetChecklist = () => setChecked({});

    return (
        <div className="relative">
            {/* Hero */}
            <section className="section-padding relative overflow-hidden pb-8">
                <div className="absolute inset-0 bg-grid opacity-30" />
                <div className="absolute inset-0 bg-radial-glow" />

                <div className="container-narrow mx-auto relative z-10 text-center">
                    <span className="inline-block px-4 py-2 rounded-full bg-beast-green/10 text-beast-green text-sm font-medium mb-6 border border-beast-green/20">
                        ICT Confluence Reversal Model
                    </span>
                    <h1 className="heading-cyber text-4xl md:text-5xl font-bold mb-4">
                        <span className="text-white">Trade Setup</span>
                        <br />
                        <span className="gradient-text">Checklist</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Validate every trade against the A+ confluence criteria.
                        No shortcuts. Beast mode execution.
                    </p>
                </div>
            </section>

            {/* Progress Bar */}
            <section className="px-4 pb-8">
                <div className="container-narrow mx-auto">
                    <div className="glass-card rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <span className="text-lg font-bold text-white">
                                    {totalChecked} / {totalItems} Complete
                                </span>
                                <p className="text-sm text-gray-500">
                                    {allCriticalChecked ? (
                                        <span className="text-beast-green">✓ All critical items checked</span>
                                    ) : (
                                        <span className="text-red-400">
                                            {getCriticalMissing().length} critical items remaining
                                        </span>
                                    )}
                                </p>
                            </div>
                            <button
                                onClick={resetChecklist}
                                className="px-4 py-2 rounded-lg bg-cyber-dark text-gray-400 hover:text-white border border-cyber-border hover:border-red-500/50 transition-colors text-sm"
                            >
                                Reset
                            </button>
                        </div>
                        <div className="w-full h-3 bg-cyber-dark rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-300 ${allCriticalChecked ? 'bg-beast-green' : 'bg-beast-gold'
                                    }`}
                                style={{ width: `${(totalChecked / totalItems) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Checklist Phases */}
            <section className="section-padding pt-0">
                <div className="container-narrow mx-auto space-y-8">
                    {checklistPhases.map((phase) => {
                        const { checkedCount, total } = getPhaseProgress(phase);
                        const isComplete = checkedCount === total;

                        return (
                            <div
                                key={phase.id}
                                className={`glass-card rounded-2xl p-8 transition-all ${isComplete ? 'border-beast-green/50' : ''
                                    }`}
                            >
                                {/* Phase Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <span className="text-4xl">{phase.icon}</span>
                                        <div>
                                            <h2 className="heading-cyber text-xl text-white">{phase.title}</h2>
                                            <p className="text-gray-500 text-sm">{phase.subtitle}</p>
                                        </div>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-bold ${isComplete
                                            ? 'bg-beast-green/20 text-beast-green'
                                            : 'bg-cyber-dark text-gray-400'
                                            }`}
                                    >
                                        {checkedCount}/{total}
                                    </span>
                                </div>

                                {/* Items */}
                                <div className="space-y-4">
                                    {phase.items.map((item) => (
                                        <label
                                            key={item.id}
                                            className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all ${checked[item.id]
                                                ? 'bg-beast-green/10 border border-beast-green/30'
                                                : 'bg-cyber-dark border border-cyber-border hover:border-gray-600'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked[item.id] || false}
                                                onChange={() => toggleItem(item.id)}
                                                className="w-5 h-5 mt-0.5 rounded border-gray-600 text-beast-green focus:ring-beast-green focus:ring-offset-0 bg-cyber-dark"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`font-medium ${checked[item.id] ? 'text-beast-green' : 'text-white'
                                                            }`}
                                                    >
                                                        {item.label}
                                                    </span>
                                                    {item.critical && (
                                                        <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400 border border-red-500/30">
                                                            CRITICAL
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Ready to Trade */}
            {allCriticalChecked && (
                <section className="px-4 pb-12">
                    <div className="container-narrow mx-auto">
                        <div className="glass-card rounded-2xl p-8 text-center border-beast-green/50 bg-beast-green/5">
                            <div className="text-5xl mb-4">🚀</div>
                            <h2 className="heading-cyber text-2xl text-beast-green mb-2">
                                SETUP VALIDATED
                            </h2>
                            <p className="text-gray-400 mb-6">
                                All critical items checked. Execute with confidence.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <GlowButton href="/journal">
                                    Log Trade in Journal
                                </GlowButton>
                                <button
                                    onClick={resetChecklist}
                                    className="px-6 py-3 rounded-xl bg-cyber-dark text-gray-300 border border-cyber-border hover:border-beast-green/50 transition-colors"
                                >
                                    Start New Setup
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Best Pairs */}
            <section className="section-padding bg-cyber-dark">
                <div className="container-narrow mx-auto">
                    <h2 className="heading-cyber text-2xl text-white text-center mb-8">
                        Best Pairs for <span className="text-beast-green">This Strategy</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {bestPairs.map((pair) => (
                            <div key={pair.symbol} className="glass-card rounded-xl p-6">
                                <div className="flex items-center gap-4 mb-3">
                                    <span className="text-2xl font-bold text-beast-green font-mono">
                                        {pair.symbol}
                                    </span>
                                    <span className="text-gray-400">{pair.name}</span>
                                </div>
                                <p className="text-gray-500 text-sm">{pair.notes}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding">
                <div className="container-narrow mx-auto text-center">
                    <h2 className="heading-cyber text-2xl text-white mb-4">
                        New to <span className="text-beast-green">ICT Trading?</span>
                    </h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                        Learn the full strategy breakdown and get the free indicator.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <GlowButton href="/strategies">
                            View Full Strategy
                        </GlowButton>
                        <GlowButton href="/pricing" variant="outline">
                            Get Free Indicator
                        </GlowButton>
                    </div>
                </div>
            </section>
        </div>
    );
}
