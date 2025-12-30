'use client';
import { GlowButton } from '@/components/Marketing';

export default function SurvivalModePage() {
    return (
        <div className="relative pt-24 pb-12 min-h-screen">
            <div className="absolute inset-0 bg-grid opacity-20 fixed pointer-events-none" />

            <div className="container-narrow mx-auto px-4 relative z-10">

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-red-500/30 bg-red-500/10 mb-4">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs text-red-500 font-bold uppercase tracking-widest">Protocol strictly enforced</span>
                    </div>
                    <h1 className="heading-cyber text-3xl md:text-5xl text-white mb-4">
                        $20–$100 <span className="text-red-500">SURVIVAL MODE</span>
                    </h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Survival Mode exists to keep you in the game long enough to learn execution.
                        If you cannot follow these rules with $20, you will destroy $20,000.
                    </p>
                </div>

                {/* The Rules Card */}
                <div className="glass-card rounded-2xl border border-red-500/30 overflow-hidden max-w-2xl mx-auto mb-12">
                    <div className="bg-red-500/10 p-4 border-b border-red-500/20 text-center">
                        <span className="text-red-400 font-mono text-sm tracking-widest">[ SMALL ACCOUNT RULESET ]</span>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Rule 1 */}
                        <div className="flex gap-4">
                            <div className="text-3xl font-bold text-gray-700">01</div>
                            <div>
                                <h3 className="text-white font-bold text-lg">Max Trades Per Day</h3>
                                <p className="text-beast-green text-2xl font-bold font-mono">2 - 4 TRADES</p>
                                <p className="text-sm text-gray-500 mt-1">If you take a 5th trade, you are gambling. Close the charts.</p>
                            </div>
                        </div>

                        {/* Rule 2 */}
                        <div className="flex gap-4">
                            <div className="text-3xl font-bold text-gray-700">02</div>
                            <div>
                                <h3 className="text-white font-bold text-lg">Risk Per Trade</h3>
                                <p className="text-beast-green text-2xl font-bold font-mono">0.5% - 1%</p>
                                <p className="text-sm text-gray-500 mt-1">On a $50 account, this is $0.50 risk. Yes, it's boring. That's the point.</p>
                            </div>
                        </div>

                        {/* Rule 3 */}
                        <div className="flex gap-4">
                            <div className="text-3xl font-bold text-gray-700">03</div>
                            <div>
                                <h3 className="text-white font-bold text-lg">Daily Stop Loss</h3>
                                <p className="text-red-400 text-2xl font-bold font-mono">MAX 3R LOSS</p>
                                <p className="text-sm text-gray-500 mt-1">If you lose 3 units of risk, you are emotionally compromised. Walk away.</p>
                            </div>
                        </div>

                        {/* Rule 4 */}
                        <div className="flex gap-4 border-t border-gray-700 pt-6">
                            <div className="text-3xl font-bold text-gray-700">04</div>
                            <div>
                                <h3 className="text-white font-bold text-lg">The "Kill Switch"</h3>
                                <p className="text-gray-300">Trading stops immediately if:</p>
                                <ul className="list-disc pl-5 text-gray-400 mt-2 space-y-1">
                                    <li>You hit 2 full losses in a row.</li>
                                    <li>You hit 1 clean win (2R+) and feel "euphoric".</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <p className="text-gray-400 mb-6 text-sm">
                        Do you agree to these terms?
                    </p>
                    <div className="flex justify-center gap-4">
                        <GlowButton href="/journal">
                            I Accept. Open Journal.
                        </GlowButton>
                    </div>
                </div>

            </div>
        </div>
    );
}
