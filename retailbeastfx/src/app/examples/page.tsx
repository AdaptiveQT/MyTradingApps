'use client';
import { GlowButton } from '@/components/Marketing';
import Link from 'next/link';

export default function VisualEntryGuidePage() {
    return (
        <div className="relative pt-24 pb-12 min-h-screen">
            <div className="absolute inset-0 bg-grid opacity-20 fixed pointer-events-none" />

            <div className="container-narrow mx-auto px-4 relative z-10">

                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-beast-green/30 bg-beast-green/10 mb-4">
                        <span className="w-2 h-2 rounded-full bg-beast-green animate-pulse" />
                        <span className="text-xs text-beast-green font-bold uppercase tracking-widest">Strict Mode (Canon)</span>
                    </div>
                    <h1 className="heading-cyber text-3xl md:text-5xl text-white mb-4">
                        VISUAL ENTRY GUIDE
                    </h1>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        These are not predictions. This is what <span className="text-beast-green font-bold">permission to execute</span> looks like.
                    </p>

                    {/* The One Line That Ends Confusion */}
                    <div className="bg-cyber-dark border-l-4 border-beast-gold p-6 max-w-3xl mx-auto text-left rounded-r-xl">
                        <p className="text-white text-lg font-medium mb-2">The One Rule to End Confusion:</p>
                        <ul className="space-y-2 text-gray-300">
                            <li><span className="text-red-500 font-bold">×</span> You do NOT enter at the Bollinger Band (Stretch)</li>
                            <li><span className="text-red-500 font-bold">×</span> You do NOT enter "inside" the Order Block (Location)</li>
                            <li><span className="text-beast-green font-bold text-xl">✓</span> <span className="text-white font-bold">You enter on the candle CLOSE that proves price failed.</span></li>
                        </ul>
                    </div>
                </div>

                {/* ===================== LONG SETUP ===================== */}
                <div className="glass-card rounded-2xl p-8 border border-beast-green/30 mb-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-9xl text-beast-green select-none">LONG</div>

                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <span className="text-beast-green">▲</span> LONG SETUP
                    </h2>
                    <p className="text-gray-400 mb-8 text-lg font-mono">"Failure Down → Permission Up"</p>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* LEFT: TEXT RULES */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-white font-bold border-b border-gray-700 pb-2 mb-4">WHAT YOU WATCH</h3>
                                <ol className="space-y-4 text-sm text-gray-300">
                                    <li className="pl-4 border-l-2 border-gray-700">
                                        <strong className="text-white block">1. Killzone Only</strong>
                                        London (02-05 ET) or NY (08-11 ET). Outside? Don't look.
                                    </li>
                                    <li className="pl-4 border-l-2 border-gray-700">
                                        <strong className="text-white block">2. Bullsih OB Created</strong>
                                        Bearish displacement → Strong bullish candle. Fresh. Untouched.
                                    </li>
                                    <li className="pl-4 border-l-2 border-gray-700">
                                        <strong className="text-white block">3. The Return</strong>
                                        Price returns to the OB. First touch only.
                                    </li>
                                    <li className="pl-4 border-l-2 border-beast-gold">
                                        <strong className="text-white block">4. Exhaustion (The Stretch)</strong>
                                        Return tags <span className="text-beast-gold">BB 20/1.0 LOWER band</span>. Wick or Body.
                                    </li>
                                    <li className="pl-4 border-l-2 border-beast-green">
                                        <strong className="text-white block">5. THE TRIGGER CANDLE</strong>
                                        A <span className="text-beast-green">bullish candle CLOSES</span>. All gates are open.
                                    </li>
                                </ol>
                            </div>

                            <div className="bg-black/40 p-6 rounded-xl border border-gray-600">
                                <h3 className="text-beast-green font-bold mb-4 flex items-center gap-2">
                                    <span>⚡</span> EXECUTION (MECHANICAL)
                                </h3>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex justify-between border-b border-gray-800 pb-2">
                                        <span className="text-gray-400">ENTRY</span>
                                        <span className="text-white font-bold">Market on Candle CLOSE</span>
                                    </li>
                                    <li className="flex justify-between border-b border-gray-800 pb-2">
                                        <span className="text-gray-400">STOP</span>
                                        <span className="text-white font-bold">1 tick below OB Body</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-gray-400">TARGET</span>
                                        <span className="text-white font-bold">Fixed 3R</span>
                                    </li>
                                </ul>
                                <p className="mt-4 text-xs text-center text-gray-500 italic">No partials. No trailing. No thinking.</p>
                            </div>
                        </div>

                        {/* RIGHT: VISUALS */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="aspect-video bg-gray-900 rounded-xl border border-gray-700 flex items-center justify-center relative overflow-hidden group">
                                <img src="/examples/setup_0.png" alt="Order Block Schematic" className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-white">The Setup Logic</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="aspect-video bg-gray-900 rounded-xl border border-gray-700 relative overflow-hidden">
                                    <img src="/examples/setup_1.png" alt="Bollinger Stretch" className="object-cover w-full h-full opacity-80" />
                                    <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-white">Exhaustion</div>
                                </div>
                                <div className="aspect-video bg-gray-900 rounded-xl border border-gray-700 relative overflow-hidden">
                                    <img src="/examples/setup_4.png" alt="Killzones" className="object-cover w-full h-full opacity-80" />
                                    <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-white">Timing</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* ===================== SHORT SETUP ===================== */}
                <div className="glass-card rounded-2xl p-8 border border-red-500/30 mb-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-9xl text-red-500 select-none">SHORT</div>

                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <span className="text-red-500">▼</span> SHORT SETUP
                    </h2>
                    <p className="text-gray-400 mb-8 text-lg font-mono">"Failure Up → Permission Down"</p>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* LEFT: TEXT RULES */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-white font-bold border-b border-gray-700 pb-2 mb-4">WHAT YOU WATCH</h3>
                                <ol className="space-y-4 text-sm text-gray-300">
                                    <li className="pl-4 border-l-2 border-gray-700">
                                        <strong className="text-white block">1. Killzone Only</strong>
                                        Same rules. Same discipline.
                                    </li>
                                    <li className="pl-4 border-l-2 border-gray-700">
                                        <strong className="text-white block">2. Bearish OB Created</strong>
                                        Bullish displacement → Strong bearish candle. Untouched.
                                    </li>
                                    <li className="pl-4 border-l-2 border-gray-700">
                                        <strong className="text-white block">3. The Return</strong>
                                        Price returns to the OB. First tap only.
                                    </li>
                                    <li className="pl-4 border-l-2 border-beast-gold">
                                        <strong className="text-white block">4. Exhaustion (The Stretch)</strong>
                                        Return tags <span className="text-beast-gold">BB 20/1.0 UPPER band</span>. Wick or Body.
                                    </li>
                                    <li className="pl-4 border-l-2 border-red-500">
                                        <strong className="text-white block">5. THE TRIGGER CANDLE</strong>
                                        A <span className="text-red-500">bearish candle CLOSES</span>.
                                    </li>
                                </ol>
                            </div>

                            <div className="bg-black/40 p-6 rounded-xl border border-gray-600">
                                <h3 className="text-red-500 font-bold mb-4 flex items-center gap-2">
                                    <span>⚡</span> EXECUTION (MECHANICAL)
                                </h3>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex justify-between border-b border-gray-800 pb-2">
                                        <span className="text-gray-400">ENTRY</span>
                                        <span className="text-white font-bold">Market on Candle CLOSE</span>
                                    </li>
                                    <li className="flex justify-between border-b border-gray-800 pb-2">
                                        <span className="text-gray-400">STOP</span>
                                        <span className="text-white font-bold">1 tick above OB Body</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-gray-400">TARGET</span>
                                        <span className="text-white font-bold">Fixed 3R</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* RIGHT: VISUALS */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="aspect-video bg-gray-900 rounded-xl border border-gray-700 flex items-center justify-center relative overflow-hidden group">
                                <img src="/examples/setup_3.png" alt="Bearish Reversal Schematic" className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-white">Failure Up Logic</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="aspect-video bg-gray-900 rounded-xl border border-gray-700 relative overflow-hidden">
                                    <img src="/examples/setup_1.png" alt="Bollinger Bands" className="object-cover w-full h-full opacity-80" />
                                    <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-white">Exhaustion</div>
                                </div>
                                <div className="aspect-video bg-gray-900 rounded-xl border border-gray-700 relative overflow-hidden">
                                    <img src="/examples/setup_2.png" alt="EMA Bias" className="object-cover w-full h-full opacity-80" />
                                    <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-white">Trend Permission</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-gray-400 mb-6">Too strict? Need flexibility?</p>
                    <div className="flex justify-center gap-4">
                        <GlowButton href="/journal" size="lg">I can handle Strict Mode.</GlowButton>
                        <GlowButton href="/discretion" variant="outline" size="lg">Explore Discretion Mode</GlowButton>
                    </div>
                </div>

            </div>
        </div>
    );
}
