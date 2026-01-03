'use client';
import { GlowButton } from '@/components/Marketing';
import Link from 'next/link';

export default function PriceActionEyesPage() {
    return (
        <div className="relative pt-24 pb-12 min-h-screen">
            <div className="absolute inset-0 bg-grid opacity-20 fixed pointer-events-none" />

            <div className="container-narrow mx-auto px-4 relative z-10">

                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-gray-600 bg-gray-800 mb-4">
                        <span className="w-2 h-2 rounded-full bg-gray-400" />
                        <span className="text-xs text-gray-300 font-bold uppercase tracking-widest">Read-Only Layer</span>
                    </div>
                    <h1 className="heading-cyber text-3xl md:text-5xl text-white mb-6">
                        SEEING WITHOUT ACTING
                    </h1>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        We translate Price Action concepts into observations.
                        <br />
                        <span className="text-red-400 font-bold">These do not grant permission to trade.</span>
                    </p>
                </div>

                {/* THE TRANSLATION TABLE */}
                <div className="glass-card rounded-2xl border border-gray-700 overflow-hidden mb-12">
                    <div className="bg-cyber-dark p-6 border-b border-gray-700">
                        <h2 className="text-xl font-bold text-white">Price Action Translation Matrix</h2>
                        <p className="text-sm text-gray-400">How we label standard ICT/SMC concepts without implying signals.</p>
                    </div>

                    <div className="divide-y divide-gray-700">
                        {/* ROW 1 */}
                        <div className="grid md:grid-cols-2 p-6 hover:bg-white/5 transition-colors">
                            <div>
                                <h3 className="text-gray-400 text-sm font-bold uppercase mb-1">Concept</h3>
                                <p className="text-white text-lg font-bold">Judas Swing / Stop Raid</p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <h3 className="text-beast-gold text-sm font-bold uppercase mb-1">Our Observation Label</h3>
                                <div className="bg-black/30 p-2 rounded border border-gray-600 inline-block">
                                    <span className="text-gray-200 font-mono text-sm">"Liquidity Sweep Observed"</span>
                                </div>
                            </div>
                        </div>

                        {/* ROW 2 */}
                        <div className="grid md:grid-cols-2 p-6 hover:bg-white/5 transition-colors">
                            <div>
                                <h3 className="text-gray-400 text-sm font-bold uppercase mb-1">Concept</h3>
                                <p className="text-white text-lg font-bold">Market Structure Shift (MSS)</p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <h3 className="text-beast-gold text-sm font-bold uppercase mb-1">Our Observation Label</h3>
                                <div className="bg-black/30 p-2 rounded border border-gray-600 inline-block">
                                    <span className="text-gray-200 font-mono text-sm">"Structure Shift Observed"</span>
                                </div>
                            </div>
                        </div>

                        {/* ROW 3 */}
                        <div className="grid md:grid-cols-2 p-6 hover:bg-white/5 transition-colors">
                            <div>
                                <h3 className="text-gray-400 text-sm font-bold uppercase mb-1">Concept</h3>
                                <p className="text-white text-lg font-bold">Imbalance / FVG</p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <h3 className="text-beast-gold text-sm font-bold uppercase mb-1">Our Observation Label</h3>
                                <div className="bg-black/30 p-2 rounded border border-gray-600 inline-block">
                                    <span className="text-gray-200 font-mono text-sm">"Inefficiency Present"</span>
                                </div>
                            </div>
                        </div>

                        {/* ROW 4 */}
                        <div className="grid md:grid-cols-2 p-6 hover:bg-white/5 transition-colors">
                            <div>
                                <h3 className="text-gray-400 text-sm font-bold uppercase mb-1">Concept</h3>
                                <p className="text-white text-lg font-bold">Strong Move Away</p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <h3 className="text-beast-gold text-sm font-bold uppercase mb-1">Our Observation Label</h3>
                                <div className="bg-black/30 p-2 rounded border border-gray-600 inline-block">
                                    <span className="text-gray-200 font-mono text-sm">"Displacement Detected"</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* WHY WE DO THIS */}
                <div className="bg-cyber-dark border bg-black/40 border-gray-700 p-8 rounded-xl max-w-3xl mx-auto mb-12">
                    <h3 className="text-white font-bold mb-4">Why "Read-Only"?</h3>
                    <p className="text-gray-300 transform leading-relaxed mb-6">
                        Knowing a "Shift" happened is useful for context. Using it as a signal is dangerous for beginners.
                        <br /><br />
                        By keeping these labels descriptive ("Observed") rather than prescriptive ("Buy Now"), we allow you to build context without forcing action.
                    </p>
                    <div className="flex items-center gap-4 bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
                        <span className="text-2xl">🛑</span>
                        <p className="text-sm text-red-200">
                            <strong>Rule:</strong> You never enter a trade because a label appeared. You enter because your plan allowed it.
                        </p>
                    </div>
                </div>

                <div className="text-center">
                    <GlowButton href="/start-here" size="lg">Back to Start Here</GlowButton>
                </div>

            </div>
        </div>
    );
}
