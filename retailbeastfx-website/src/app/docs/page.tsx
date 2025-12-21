import Link from 'next/link';
import { GlowButton } from '@/components/Marketing';

const docSections = [
    {
        title: 'Protocol v1',
        links: [
            { href: '#trinity-strategy', label: '⚔️ The Trinity Strategy' },
            { href: '#entry-protocol', label: '🎯 Entry Protocol' },
            { href: '#risk-management', label: '🛡️ Risk Management' },
        ],
    },
    {
        title: 'Getting Started',
        links: [
            { href: '#setup', label: 'Installation & Setup' },
            { href: '#tradingview', label: 'Adding to TradingView' },
            { href: '#first-signal', label: 'Your First Signal' },
        ],
    },
    {
        title: 'ICT Framework',
        links: [
            { href: '#ict-confluence', label: 'ICT Confluence Model' },
            { href: '#first-presented-fvg', label: '1st Presented FVG' },
            { href: '#suspension-blocks', label: 'Suspension Blocks' },
            { href: '#bb-extremes', label: 'BB 2.0 Extremes' },
            { href: '#mtf-analysis', label: 'Multi-Timeframe Analysis' },
            { href: '#best-pairs', label: 'Best Pairs for ICT' },
        ],
    },
    {
        title: 'Indicator Guide',
        links: [
            { href: '#order-blocks', label: 'Fresh Order Blocks' },
            { href: '#fvg', label: 'Fair Value Gaps' },
            { href: '#killzones', label: 'Killzone Sessions' },
            { href: '#quantum-lock', label: 'Quantum Lock™' },
            { href: '#ghost-tape', label: 'Ghost Tape' },
        ],
    },
    {
        title: 'Downloads',
        links: [
            { href: '/downloads/AQT_MinimalPlan_GS_V2_1_Simple.xlsx', label: '📊 Original Trading Plan (Excel)' },
            { href: '/downloads/RELEASE_NOTES_v84.md', label: '📝 RBFX v8.4 Release Notes' },
            { href: '/downloads/RELEASE_NOTES_Volume_v1.1.md', label: '📝 Volume v1.1 Release Notes' },
        ],
    },
];

export default function DocsPage() {
    return (
        <div className="relative">
            {/* Hero */}
            <section className="section-padding relative overflow-hidden pb-12">
                <div className="absolute inset-0 bg-grid opacity-30" />

                <div className="container-wide mx-auto relative z-10">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-beast-green/10 border border-beast-green/30 mb-6">
                            <span className="text-sm text-beast-green font-medium">📋 Operational Manual</span>
                        </div>
                        <h1 className="heading-cyber text-4xl md:text-5xl font-bold mb-4">
                            <span className="text-white">Protocol</span>
                            <span className="text-beast-green"> v1</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            DO NOT DEVIATE. The system works if you remain mechanical.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="pb-20 px-4">
                <div className="container-wide mx-auto">
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Sidebar */}
                        <aside className="lg:col-span-1">
                            <div className="glass-card rounded-xl p-6 sticky top-24">
                                {docSections.map((section, i) => (
                                    <div key={i} className="mb-6 last:mb-0">
                                        <h3 className="text-sm font-semibold text-beast-green uppercase tracking-wider mb-3">
                                            {section.title}
                                        </h3>
                                        <ul className="space-y-2">
                                            {section.links.map((link) => (
                                                <li key={link.href}>
                                                    <Link
                                                        href={link.href}
                                                        className="text-gray-400 hover:text-white text-sm transition-colors block py-1"
                                                    >
                                                        {link.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="lg:col-span-3">
                            {/* THE TRINITY STRATEGY */}
                            <section id="trinity-strategy" className="mb-16">
                                <div className="border-l-4 border-beast-green pl-6 mb-6">
                                    <h2 className="heading-cyber text-2xl text-white">Section 1: The Trinity Strategy</h2>
                                    <p className="text-gray-400 italic">Core Logic — The system works if you remain mechanical.</p>
                                </div>

                                <div className="glass-card rounded-xl p-8 mb-8 border border-beast-green/30">
                                    <h3 className="text-lg font-semibold text-beast-green mb-6 uppercase tracking-wider">⚔️ The Setup Condition</h3>

                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <span className="w-10 h-10 rounded-full bg-beast-green/20 text-beast-green flex items-center justify-center font-bold shrink-0 text-lg">1</span>
                                            <div>
                                                <p className="font-semibold text-white text-lg">Structure</p>
                                                <p className="text-gray-400">Price must tap a <span className="text-beast-green font-semibold">Fresh OB</span> (Gray Box on Chart). Unmitigated, no prior sweeps in 4+ hours.</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <span className="w-10 h-10 rounded-full bg-beast-green/20 text-beast-green flex items-center justify-center font-bold shrink-0 text-lg">2</span>
                                            <div>
                                                <p className="font-semibold text-white text-lg">Exhaustion</p>
                                                <p className="text-gray-400">Price must pierce or touch the <span className="text-beast-green font-semibold">BB 2.0 Outer Band</span> (±2 SD).</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <span className="w-10 h-10 rounded-full bg-beast-green/20 text-beast-green flex items-center justify-center font-bold shrink-0 text-lg">3</span>
                                            <div>
                                                <p className="font-semibold text-white text-lg">Confirmation</p>
                                                <p className="text-gray-400"><span className="text-beast-green font-semibold">Volume Beast</span> must show a Delta Flip (Color Change) + 150% Volume Spike.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                        <p className="text-red-400 font-semibold text-center">
                                            ⚠️ ALL THREE CONDITIONS MUST ALIGN — No exceptions.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* ENTRY PROTOCOL */}
                            <section id="entry-protocol" className="mb-16">
                                <div className="border-l-4 border-beast-green pl-6 mb-6">
                                    <h2 className="heading-cyber text-2xl text-white">Entry Protocol</h2>
                                    <p className="text-gray-400 italic">Mechanical execution rules.</p>
                                </div>

                                <div className="glass-card rounded-xl p-8 mb-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">🎯 Trigger</h3>
                                    <p className="text-gray-300">
                                        Enter <span className="text-beast-green font-semibold">Market Execution</span> on the close of the 1M or 5M candle that confirms the Volume Spike.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div className="glass-card rounded-xl p-6">
                                        <h3 className="text-lg font-semibold text-red-400 mb-4">🛑 Stop Loss</h3>
                                        <p className="text-gray-300">
                                            Fixed at <span className="text-white font-semibold">1x ATR(14)</span> below the OB body (longs) or above the OB body (shorts).
                                        </p>
                                    </div>

                                    <div className="glass-card rounded-xl p-6">
                                        <h3 className="text-lg font-semibold text-beast-green mb-4">🎯 Take Profit</h3>
                                        <p className="text-gray-300">
                                            Target the opposite BB Band or the next unmitigated OB. <span className="text-white font-semibold">Trail SL to Breakeven after +1R.</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="glass-card rounded-xl p-8 border border-red-500/30">
                                    <h3 className="text-lg font-semibold text-red-400 mb-4">❌ Invalidation (Hard Rules)</h3>
                                    <ul className="space-y-3 text-gray-300">
                                        <li className="flex gap-3">
                                            <span className="text-red-400">•</span>
                                            <span>If the 1M candle closes <span className="text-red-400 font-semibold">through</span> the OB body → <span className="text-white">Setup Invalid. Cut immediately.</span></span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-red-400">•</span>
                                            <span>If the setup occurs <span className="text-red-400 font-semibold">5 minutes before Red Folder News</span> → <span className="text-white">Stand Down.</span></span>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* RISK MANAGEMENT */}
                            <section id="risk-management" className="mb-16">
                                <div className="border-l-4 border-beast-green pl-6 mb-6">
                                    <h2 className="heading-cyber text-2xl text-white">Section 2: Risk Management</h2>
                                    <p className="text-gray-400 italic">The Shield — Survive first, profit second.</p>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6 mb-6">
                                    <div className="glass-card rounded-xl p-6 text-center">
                                        <div className="w-16 h-16 rounded-full bg-beast-green/20 flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl">🎲</span>
                                        </div>
                                        <h3 className="text-white font-semibold mb-2">Quarter-Kelly Rule</h3>
                                        <p className="text-gray-400 text-sm">Never risk more than <span className="text-beast-green font-semibold">2-3.5%</span> on a regulated account.</p>
                                    </div>

                                    <div className="glass-card rounded-xl p-6 text-center">
                                        <div className="w-16 h-16 rounded-full bg-beast-green/20 flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl">📈</span>
                                        </div>
                                        <h3 className="text-white font-semibold mb-2">The Staircase</h3>
                                        <p className="text-gray-400 text-sm">Only increase risk after a <span className="text-beast-green font-semibold">+20% equity gain</span>.</p>
                                    </div>

                                    <div className="glass-card rounded-xl p-6 text-center">
                                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl">🔌</span>
                                        </div>
                                        <h3 className="text-white font-semibold mb-2">Daily Circuit Breaker</h3>
                                        <p className="text-gray-400 text-sm">If Daily DD &gt; <span className="text-red-400 font-semibold">5%</span>, terminal is closed. <span className="text-gray-500 italic">Go outside.</span></p>
                                    </div>
                                </div>

                                <div className="glass-card rounded-xl p-8 bg-gradient-to-r from-beast-green/10 to-transparent border border-beast-green/30">
                                    <p className="text-center text-lg text-gray-300">
                                        &ldquo;If the matrix isn&apos;t green, hands stay flat. <span className="text-beast-green font-semibold">Measure or die.</span>&rdquo;
                                    </p>
                                </div>
                            </section>

                            <hr className="border-beast-green/20 my-12" />

                            {/* Quick Start */}
                            <section id="setup" className="mb-16">
                                <h2 className="heading-cyber text-2xl text-white mb-6">Getting Started</h2>

                                <div className="glass-card rounded-xl p-8 mb-8">
                                    <h3 className="text-lg font-semibold text-white mb-4">🚀 Quick Start (5 minutes)</h3>
                                    <ol className="space-y-4 text-gray-300">
                                        <li className="flex gap-4">
                                            <span className="w-8 h-8 rounded-full bg-beast-green/20 text-beast-green flex items-center justify-center font-bold shrink-0">1</span>
                                            <div>
                                                <p className="font-medium text-white">Add the indicator to TradingView</p>
                                                <p className="text-sm text-gray-400">Search &quot;RetailBeastFX&quot; in the indicators menu and add to your chart.</p>
                                            </div>
                                        </li>
                                        <li className="flex gap-4">
                                            <span className="w-8 h-8 rounded-full bg-beast-green/20 text-beast-green flex items-center justify-center font-bold shrink-0">2</span>
                                            <div>
                                                <p className="font-medium text-white">Configure your settings</p>
                                                <p className="text-sm text-gray-400">Adjust killzone times for your timezone and select your trading mode.</p>
                                            </div>
                                        </li>
                                        <li className="flex gap-4">
                                            <span className="w-8 h-8 rounded-full bg-beast-green/20 text-beast-green flex items-center justify-center font-bold shrink-0">3</span>
                                            <div>
                                                <p className="font-medium text-white">Set up the journal</p>
                                                <p className="text-sm text-gray-400">Create your account and log your first trade to start tracking.</p>
                                            </div>
                                        </li>
                                    </ol>
                                </div>
                            </section>

                            {/* Best Pairs */}
                            <section id="best-pairs" className="mb-16">
                                <h2 className="heading-cyber text-2xl text-white mb-6">Best Pairs for ICT</h2>
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-gray-300 mb-4">
                                        The ICT Confluence model works across any liquid market, but these pairs shine brightest
                                        due to heavy institutional participation and clean liquidity engineering.
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-4 my-6">
                                        <div className="glass-card rounded-xl p-6">
                                            <h4 className="text-beast-green font-bold text-lg mb-2">XAUUSD (Gold)</h4>
                                            <p className="text-gray-400 text-sm">Highly manipulated, volatile. Best for NY open reversals. Explosive moves post-raid.</p>
                                        </div>
                                        <div className="glass-card rounded-xl p-6">
                                            <h4 className="text-beast-green font-bold text-lg mb-2">USDJPY</h4>
                                            <p className="text-gray-400 text-sm">Trendy, respects OB/FVG. Great during London/NY overlap. BOJ/USD policy drives moves.</p>
                                        </div>
                                        <div className="glass-card rounded-xl p-6">
                                            <h4 className="text-beast-green font-bold text-lg mb-2">NAS100</h4>
                                            <p className="text-gray-400 text-sm">NY open monster. Massive stop hunts around round numbers and ATHs.</p>
                                        </div>
                                        <div className="glass-card rounded-xl p-6">
                                            <h4 className="text-beast-green font-bold text-lg mb-2">EURUSD</h4>
                                            <p className="text-gray-400 text-sm">Cleaner structure, tighter stops. Higher win rate in ranging periods.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* More sections placeholder */}
                            <div className="glass-card rounded-xl p-8 text-center">
                                <p className="text-gray-400 mb-4">
                                    📚 Full documentation is being expanded. Check back soon for more guides.
                                </p>
                                <GlowButton href="https://discord.gg/retailbeastfx" variant="outline" external>
                                    Get Help on Discord
                                </GlowButton>
                            </div>
                        </main>
                    </div>
                </div>
            </section>

            {/* Downloads */}
            <section className="section-padding bg-cyber-dark">
                <div className="container-narrow mx-auto">
                    <h2 className="heading-cyber text-2xl text-white text-center mb-8">
                        Downloadable <span className="text-beast-green">Resources</span>
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { name: 'Trading Plan Template', format: 'XLSX', size: '24KB', href: '/downloads/AQT_MinimalPlan_GS_V2_1_Simple.xlsx' },
                            { name: 'Premium v8.4 Release Notes', format: 'MD', size: '12KB', href: '/downloads/RELEASE_NOTES_v84.md' },
                            { name: 'Volume v1.1 Release Notes', format: 'MD', size: '8KB', href: '/downloads/RELEASE_NOTES_Volume_v1.1.md' },
                        ].map((file, i) => (
                            <Link key={i} href={file.href} className="glass-card rounded-xl p-6 flex items-center justify-between hover:border-beast-green/50 transition-colors">
                                <div>
                                    <p className="font-medium text-white">{file.name}</p>
                                    <p className="text-sm text-gray-500">{file.format} • {file.size}</p>
                                </div>
                                <svg className="w-6 h-6 text-beast-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
