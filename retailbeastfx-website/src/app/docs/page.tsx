import Link from 'next/link';
import { GlowButton } from '@/components/Marketing';

const docSections = [
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
        title: 'Journal Mastery',
        links: [
            { href: '#journal-setup', label: 'Setting Up Your Journal' },
            { href: '#quick-entry', label: 'Quick Trade Entry' },
            { href: '#webhooks', label: 'TradingView Webhooks' },
            { href: '#analytics', label: 'Understanding Analytics' },
            { href: '#export', label: 'Export & Backup' },
        ],
    },
    {
        title: 'Advanced',
        links: [
            { href: '#templates', label: 'Custom Templates' },
            { href: '#mt4-import', label: 'MT4/MT5 Import' },
            { href: '#api', label: 'API Reference' },
        ],
    },
    {
        title: 'Downloads',
        links: [
            { href: '/downloads/AQT_MinimalPlan_GS_V2_1_Simple.xlsx', label: '📊 Original Trading Plan (Excel)' },
            { href: '/downloads/RELEASE_NOTES_v84.md', label: '📝 RBFX v8.4 Release Notes' },
            { href: '/downloads/RELEASE_NOTES_Volume_v1.md', label: '📝 Volume v1.0 Release Notes' },
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
                        <h1 className="heading-cyber text-4xl md:text-5xl font-bold mb-4">
                            <span className="text-white">Documentation &</span>
                            <span className="text-beast-green"> User Guide</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Everything you need to master RetailBeastFX. From setup to advanced strategies.
                        </p>
                    </div>

                    {/* Search */}
                    <div className="max-w-xl mx-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search documentation..."
                                className="w-full px-6 py-4 bg-cyber-card border border-cyber-border rounded-xl text-white placeholder-gray-500 focus:border-beast-green focus:outline-none"
                            />
                            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
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

                                {/* Video Embed Placeholder */}
                                <div className="glass-card rounded-xl p-4 overflow-hidden">
                                    <div className="aspect-video bg-cyber-surface rounded-lg flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-16 h-16 rounded-full bg-beast-green/20 flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-8 h-8 text-beast-green" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-400">Setup Tutorial Video</p>
                                            <p className="text-sm text-gray-500">Coming Soon</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* ICT Confluence Model */}
                            <section id="ict-confluence" className="mb-16">
                                <h2 className="heading-cyber text-2xl text-white mb-6">ICT Confluence Model</h2>
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-gray-300 mb-4">
                                        The <span className="text-beast-green font-semibold">2025 ICT Confluence Reversal</span> model
                                        combines smart money concepts with statistical filters. Backtested 68-75% win rate on Gold and USDJPY.
                                    </p>

                                    <div className="glass-card rounded-xl p-6 my-6">
                                        <h4 className="text-white font-semibold mb-4">The Three-Phase Workflow</h4>
                                        <ol className="space-y-4">
                                            <li className="flex gap-4">
                                                <span className="w-8 h-8 rounded-full bg-beast-green/20 text-beast-green flex items-center justify-center font-bold shrink-0">1</span>
                                                <div>
                                                    <p className="font-medium text-white">HTF Bias (Daily/4H)</p>
                                                    <p className="text-sm text-gray-400">20/50/200 EMA stack direction. Mark key liquidity pools.</p>
                                                </div>
                                            </li>
                                            <li className="flex gap-4">
                                                <span className="w-8 h-8 rounded-full bg-beast-green/20 text-beast-green flex items-center justify-center font-bold shrink-0">2</span>
                                                <div>
                                                    <p className="font-medium text-white">Mid-TF Confluence (1H/15M)</p>
                                                    <p className="text-sm text-gray-400">Fresh OB + FVG + Suspension Block overlap = golden zone.</p>
                                                </div>
                                            </li>
                                            <li className="flex gap-4">
                                                <span className="w-8 h-8 rounded-full bg-beast-green/20 text-beast-green flex items-center justify-center font-bold shrink-0">3</span>
                                                <div>
                                                    <p className="font-medium text-white">LTF Entry (5M/1M)</p>
                                                    <p className="text-sm text-gray-400">BB ±2 SD raid → pullback → rejection candle at confluent array.</p>
                                                </div>
                                            </li>
                                        </ol>
                                    </div>

                                    <GlowButton href="/checklist">
                                        Use Interactive Checklist
                                    </GlowButton>
                                </div>
                            </section>

                            {/* Suspension Blocks */}
                            <section id="suspension-blocks" className="mb-16">
                                <h2 className="heading-cyber text-2xl text-white mb-6">Suspension Blocks</h2>
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-gray-300 mb-4">
                                        A <span className="text-beast-green font-semibold">Suspension Block</span> is an ICT 2025 concept:
                                        a candlestick with <strong>Volume Imbalance above AND below</strong> its body, while the left candle&apos;s wick overlaps the body (preventing FVG formation).
                                    </p>

                                    <div className="glass-card rounded-xl p-6 my-6">
                                        <h4 className="text-white font-semibold mb-4">How to Identify (3 Requirements)</h4>
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-3">
                                                <span className="text-beast-green">1.</span>
                                                <div>
                                                    <p className="text-gray-300">Volume Imbalance ABOVE body</p>
                                                    <p className="text-sm text-gray-400 mt-1">Gap between SB candle&apos;s body top and left candle&apos;s low wick</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="text-beast-green">2.</span>
                                                <div>
                                                    <p className="text-gray-300">Volume Imbalance BELOW body</p>
                                                    <p className="text-sm text-gray-400 mt-1">Gap between SB candle&apos;s body bottom and right candle&apos;s high wick</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="text-beast-green">3.</span>
                                                <div>
                                                    <p className="text-gray-300">Left candle wick overlaps SB body</p>
                                                    <p className="text-sm text-gray-400 mt-1">Prevents FVG formation - the candle is &quot;suspended&quot; between imbalances</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="glass-card rounded-xl p-6 my-6">
                                        <h4 className="text-white font-semibold mb-4">How to Trade</h4>
                                        <ul className="space-y-2 text-gray-300">
                                            <li>• <span className="text-beast-green">Bullish SB:</span> Wait for MSS in discount zone → retrace to SB → buy on support</li>
                                            <li>• <span className="text-red-400">Bearish SB:</span> Wait for MSS in premium zone → retrace to SB → sell on resistance</li>
                                            <li>• SL: Beyond the SB candle or recent swing</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* 1st Presented FVG */}
                            <section id="first-presented-fvg" className="mb-16">
                                <h2 className="heading-cyber text-2xl text-white mb-6">1st Presented FVG</h2>
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-gray-300 mb-4">
                                        The <span className="text-beast-green font-semibold">1st Presented FVG</span> is the first Fair Value Gap that forms after the NY market opens at 9:30 AM within the Opening Range (until 10:00 AM). It acts as a key daily reference level.
                                    </p>

                                    <div className="glass-card rounded-xl p-6 my-6">
                                        <h4 className="text-white font-semibold mb-4">Time Window</h4>
                                        <ul className="space-y-2 text-gray-300">
                                            <li>• <span className="text-beast-green">Start:</span> 9:30 AM NY (market open)</li>
                                            <li>• <span className="text-beast-green">End:</span> 10:00 AM NY (Opening Range closes)</li>
                                            <li>• <span className="text-beast-green">Earliest FVG:</span> 9:31 AM candle</li>
                                            <li>• <span className="text-beast-green">Display Until:</span> 3:45 PM NY</li>
                                        </ul>
                                    </div>

                                    <div className="glass-card rounded-xl p-6 my-6">
                                        <h4 className="text-white font-semibold mb-4">Validation Rule</h4>
                                        <p className="text-gray-300 mb-3">The FVG candle must <strong>break the range</strong> of previous candles to qualify:</p>
                                        <ul className="space-y-2 text-gray-300">
                                            <li>• <span className="text-beast-green">Bullish:</span> FVG candle high &gt; previous candles high</li>
                                            <li>• <span className="text-red-400">Bearish:</span> FVG candle low &lt; previous candles low</li>
                                        </ul>
                                    </div>

                                    <div className="glass-card rounded-xl p-6 my-6">
                                        <h4 className="text-white font-semibold mb-4">How to Trade</h4>
                                        <ul className="space-y-2 text-gray-300">
                                            <li>• Use as a <span className="text-beast-green">PD-Array</span> for trade execution</li>
                                            <li>• Watch for price to retrace and react to the zone</li>
                                            <li>• Can become an <span className="text-beast-green">iFVG</span> (inverse) if mitigated</li>
                                            <li>• Strongest when aligned with HTF bias</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* BB 2.0 Extremes */}
                            <section id="bb-extremes" className="mb-16">
                                <h2 className="heading-cyber text-2xl text-white mb-6">BB 2.0 Extremes</h2>
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-gray-300 mb-4">
                                        Bollinger Bands at <span className="text-beast-green font-semibold">±2 standard deviations</span> capture
                                        liquidity raids and overextensions. When price touches/exceeds these bands, smart money is often engineering a reversal.
                                    </p>

                                    <div className="glass-card rounded-xl p-6 my-6">
                                        <h4 className="text-white font-semibold mb-4">Trading BB Extremes</h4>
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-3">
                                                <span className="text-beast-green">•</span>
                                                <div>
                                                    <p className="text-gray-300">Price touches upper BB = potential liquidity grab above</p>
                                                    <p className="text-sm text-gray-400 mt-1">Wait for rejection back inside bands before shorting</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="text-beast-green">•</span>
                                                <div>
                                                    <p className="text-gray-300">Price touches lower BB = potential stop hunt below</p>
                                                    <p className="text-sm text-gray-400 mt-1">Wait for bullish candle close inside bands before longing</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="text-beast-green">•</span>
                                                <div>
                                                    <p className="text-gray-300">Combine with EMA trend filter</p>
                                                    <p className="text-sm text-gray-400 mt-1">Only long BB extremes when price &gt; 200 EMA</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
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

                            {/* Order Blocks */}
                            <section id="order-blocks" className="mb-16">
                                <h2 className="heading-cyber text-2xl text-white mb-6">Fresh Order Blocks</h2>
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-gray-300 mb-4">
                                        Order Blocks are areas where institutional traders have placed significant orders.
                                        RetailBeastFX identifies <span className="text-beast-green font-semibold">unmitigated (fresh)</span> order blocks
                                        that price is likely to return to.
                                    </p>

                                    <div className="glass-card rounded-xl p-6 my-6">
                                        <h4 className="text-white font-semibold mb-4">Key Settings</h4>
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-3">
                                                <span className="text-beast-green">•</span>
                                                <div>
                                                    <code className="text-beast-green bg-cyber-dark px-2 py-1 rounded">Show Fresh OBs Only</code>
                                                    <p className="text-sm text-gray-400 mt-1">Toggle to hide mitigated blocks</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="text-beast-green">•</span>
                                                <div>
                                                    <code className="text-beast-green bg-cyber-dark px-2 py-1 rounded">OB Lookback</code>
                                                    <p className="text-sm text-gray-400 mt-1">Number of candles to scan (default: 50)</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="text-beast-green">•</span>
                                                <div>
                                                    <code className="text-beast-green bg-cyber-dark px-2 py-1 rounded">Min OB Size</code>
                                                    <p className="text-sm text-gray-400 mt-1">Filter small OBs by ATR percentage</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* More sections would continue here */}
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
                        Downloadable <span className="text-beast-green">Templates</span>
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { name: 'Scalper Journal Template', format: 'CSV', size: '12KB' },
                            { name: 'Swing Trader Template', format: 'CSV', size: '14KB' },
                            { name: 'Trade Review Checklist', format: 'PDF', size: '45KB' },
                        ].map((file, i) => (
                            <div key={i} className="glass-card rounded-xl p-6 flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-white">{file.name}</p>
                                    <p className="text-sm text-gray-500">{file.format} • {file.size}</p>
                                </div>
                                <button className="text-beast-green hover:text-beast-green-300 transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
