'use client';
import { GlowButton } from '@/components/Marketing';

export default function DiscretionModePage() {
    return (
        <div className="relative pt-24 pb-12 min-h-screen">
            <div className="absolute inset-0 bg-grid opacity-20 fixed pointer-events-none" />

            <div className="container-narrow mx-auto px-4 relative z-10">

                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-beast-gold/30 bg-beast-gold/10 mb-4">
                        <span className="w-2 h-2 rounded-full bg-beast-gold animate-pulse" />
                        <span className="text-xs text-beast-gold font-bold uppercase tracking-widest">Discretion Mode (Hunter)</span>
                    </div>
                    <h1 className="heading-cyber text-3xl md:text-5xl text-white mb-6">
                        ANTICIPATORY FAILURE MODEL
                    </h1>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        For experienced ICT traders who see the trap early.
                        <br />
                        <span className="text-beast-gold">Tight stops. Failure logic. Early entry.</span>
                    </p>
                </div>

                {/* THE CHECKLIST CARD */}
                <div className="glass-card rounded-2xl p-8 md:p-12 border border-beast-gold/30 mb-12">
                    <div className="flex justify-between items-center border-b border-gray-700 pb-6 mb-8">
                        <h2 className="text-2xl font-bold text-white">The Execution Checklist</h2>
                        <span className="text-gray-500 text-sm font-mono">[ HUNT ]</span>
                    </div>

                    <div className="space-y-8">
                        {/* Gate 1 */}
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center text-gray-400 font-bold">1</div>
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-lg mb-1">Session Check</h3>
                                <p className="text-gray-400 text-sm mb-2">Is it NY Killzone (08:00 – 11:00 ET)?</p>
                                <div className="flex gap-4 text-xs font-mono">
                                    <span className="text-beast-green">YES → Proceed</span>
                                    <span className="text-red-500">NO → No Trade</span>
                                </div>
                            </div>
                        </div>

                        {/* Gate 2 */}
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center text-gray-400 font-bold">2</div>
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-lg mb-1">Context Scan (Trapped Liquidity)</h3>
                                <p className="text-gray-400 text-sm mb-2">Did price just sweep a high/low (Asia or Session)? Did it trap late participants?</p>
                                <div className="flex gap-4 text-xs font-mono">
                                    <span className="text-beast-green">YES → Proceed</span>
                                    <span className="text-red-500">NO → Wait</span>
                                </div>
                            </div>
                        </div>

                        {/* Gate 3 */}
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded bg-beast-gold text-black flex items-center justify-center font-bold">3</div>
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-lg mb-1">Displacement (The Punch)</h3>
                                <p className="text-gray-400 text-sm mb-2">Did price punch <strong>aggressively</strong> away from the trap?</p>
                                <p className="text-sm text-gray-300 italic mb-2">Must create an OB (Engulfing) or FVG.</p>
                                <div className="flex gap-4 text-xs font-mono">
                                    <span className="text-beast-green">YES → Proceed</span>
                                    <span className="text-red-500">NO → No Trade</span>
                                </div>
                            </div>
                        </div>

                        {/* Gate 4 - ENTRY */}
                        <div className="flex gap-4 bg-beast-gold/5 p-4 rounded-lg border border-beast-gold/20">
                            <div className="w-8 h-8 rounded bg-beast-gold text-black flex items-center justify-center font-bold">4</div>
                            <div className="flex-1">
                                <h3 className="text-beast-gold font-bold text-lg mb-1">Anticipatory Entry</h3>
                                <p className="text-gray-300 text-sm mb-3">Wait for pullback into the OB/FVG.</p>

                                <ul className="space-y-2 text-sm text-gray-300 mb-4">
                                    <li className="flex justify-between border-b border-gray-700/50 pb-1">
                                        <span>Entry Trigger:</span>
                                        <span className="text-white font-bold">Touch of the Level (Limit/Market)</span>
                                    </li>
                                    <li className="flex justify-between border-b border-gray-700/50 pb-1">
                                        <span>Stop Loss:</span>
                                        <span className="text-white font-bold">Tight (Just beyond Body/Wick)</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Invalidation:</span>
                                        <span className="text-white font-bold">If it breaks the level, you are wrong.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SELF SELECTION WARNING */}
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <p className="text-gray-400 mb-8 italic">
                        "This mode allows discretion. Discretion requires discipline.<br />
                        If you cannot define &apos;Wrong&apos; before you enter, go back to Strict Mode."
                    </p>

                    <div className="flex justify-center gap-4">
                        <GlowButton href="/journal" size="lg">I Accept. Open Hunter Journal.</GlowButton>
                        <GlowButton href="/examples" variant="outline" size="lg">Review Strict Mode Instead</GlowButton>
                    </div>
                </div>

            </div>
        </div>
    );
}
