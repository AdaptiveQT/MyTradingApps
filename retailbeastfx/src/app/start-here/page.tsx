'use client';
import { GlowButton } from '@/components/Marketing';

export default function StartHerePage() {
    return (
        <div className="relative pt-24 pb-12 min-h-screen">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid opacity-20 fixed pointer-events-none" />
            <div className="absolute inset-0 bg-radial-glow fixed pointer-events-none" />

            <div className="container-narrow mx-auto px-4 relative z-10">

                {/* HERO */}
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-block border border-beast-green/30 bg-beast-green/10 rounded-full px-4 py-1 mb-6">
                        <span className="text-beast-green text-sm font-bold tracking-wider">MANDATORY READING</span>
                    </div>
                    <h1 className="heading-cyber text-4xl md:text-6xl text-white mb-6 leading-tight">
                        START HERE.<br />
                        <span className="text-gray-500">READ THIS BEFORE TRADING.</span>
                    </h1>
                </div>

                {/* 1. WHO THIS IS FOR */}
                <section className="mb-12 animate-slide-up">
                    <div className="glass-card rounded-2xl p-8 border-l-4 border-l-beast-green border-y border-r border-beast-green/20">
                        <h2 className="text-xl md:text-2xl text-white font-bold mb-6 flex items-center gap-3">
                            <span className="bg-beast-green text-black w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                            WHO THIS IS FOR
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {['Small accounts ($20–$100 welcome)', 'Scalpers / Intraday traders', 'ICT-literate but execution-confused', 'People who want rules, not opinions'].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="text-beast-green font-bold">✓</span>
                                    <span className="text-gray-300">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 2. WHO THIS IS NOT FOR (FILTER) */}
                <section className="mb-12">
                    <div className="glass-card rounded-2xl p-8 border-l-4 border-l-red-500 border-y border-r border-red-500/20 bg-red-500/5">
                        <h2 className="text-xl md:text-2xl text-white font-bold mb-6 flex items-center gap-3">
                            <span className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                            WHO THIS IS <span className="text-red-500 underline decoration-2 underline-offset-4">NOT</span> FOR
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {['Swing traders', 'HTF narrative traders', 'Signal seekers', '“Tell me where price is going” mindset'].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="text-red-500 font-bold text-xl">×</span>
                                    <span className="text-gray-300">{item}</span>
                                </div>
                            ))}
                        </div>
                        <p className="mt-6 text-sm text-gray-500 italic border-t border-red-500/20 pt-4">
                            If you fall into this category, close this tab. You will hate this system.
                        </p>
                    </div>
                </section>

                {/* 3. THE PROBLEM IT SOLVES */}
                <section className="mb-12">
                    <div className="glass-card rounded-2xl p-8 border border-gray-700">
                        <h2 className="text-xl md:text-2xl text-white font-bold mb-6 flex items-center gap-3">
                            <span className="bg-gray-700 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                            THE PROBLEM IT SOLVES
                        </h2>
                        <div className="space-y-4 text-gray-300 text-lg">
                            <p>“I understand ICT concepts, but I don't know <strong>when</strong> to enter.”</p>
                            <p>“I keep hesitating and missing the move, or entering late and getting stopped out.”</p>
                            <p>“Everything makes sense on the chart until it’s time to actually click the button.”</p>
                        </div>
                    </div>
                </section>

                {/* 4. WHAT THE FRAMEWORK ACTUALLY DOES */}
                <section className="mb-12">
                    <div className="glass-card rounded-2xl p-8 border border-beast-gold/30 bg-beast-gold/5">
                        <h2 className="text-xl md:text-2xl text-white font-bold mb-6 flex items-center gap-3">
                            <span className="bg-beast-gold text-black w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                            WHAT THIS SYSTEM DOES
                        </h2>
                        <div className="text-center py-6">
                            <p className="text-2xl md:text-3xl text-white font-bold leading-relaxed">
                                RetailBeastFX does not predict direction.<br />
                                It gives <span className="text-beast-green">permission to execute</span> when price fails.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 5. WHAT TO DO NEXT */}
                <section className="mb-16">
                    <h2 className="text-xl md:text-2xl text-white font-bold mb-8 text-center">
                        5. WHAT TO DO NEXT
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Step 1 */}
                        <div className="glass-card p-6 rounded-xl border border-gray-700 hover:border-beast-green transition-colors group">
                            <div className="text-4xl font-bold text-gray-700 group-hover:text-beast-green mb-4 transition-colors">01</div>
                            <h3 className="text-white font-bold text-lg mb-2">Learn The Setup</h3>
                            <p className="text-sm text-gray-400 mb-6">See the ONE candle pattern that validates an entry. No other pattern matters.</p>
                            <GlowButton href="/mental-model" variant="outline" className="w-full">
                                The One Candle →
                            </GlowButton>
                        </div>

                        {/* Step 2 */}
                        <div className="glass-card p-6 rounded-xl border border-gray-700 hover:border-beast-green transition-colors group">
                            <div className="text-4xl font-bold text-gray-700 group-hover:text-beast-green mb-4 transition-colors">02</div>
                            <h3 className="text-white font-bold text-lg mb-2">Respect The Risk</h3>
                            <p className="text-sm text-gray-400 mb-6">Small account? Good. Learn the $20-$100 Survival Ruleset before you deposit.</p>
                            <GlowButton href="/survival-mode" variant="outline" className="w-full">
                                Survival Rules →
                            </GlowButton>
                        </div>

                        {/* Step 3 */}
                        <div className="glass-card p-6 rounded-xl border border-gray-700 hover:border-beast-green transition-colors group">
                            <div className="text-4xl font-bold text-gray-700 group-hover:text-beast-green mb-4 transition-colors">03</div>
                            <h3 className="text-white font-bold text-lg mb-2">Enforce Execution</h3>
                            <p className="text-sm text-gray-400 mb-6">Open the journal. Paper trade 5 sessions. Prove you can follow instructions.</p>
                            <GlowButton href="/journal" className="w-full">
                                Open Journal →
                            </GlowButton>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
