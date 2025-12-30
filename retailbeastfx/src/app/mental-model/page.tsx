'use client';
import { GlowButton } from '@/components/Marketing';

export default function MentalModelPage() {
    return (
        <div className="relative pt-24 pb-12 min-h-screen">
            <div className="absolute inset-0 bg-grid opacity-20 fixed pointer-events-none" />

            <div className="container-narrow mx-auto px-4 relative z-10">

                <div className="text-center mb-12">
                    <h1 className="heading-cyber text-3xl md:text-5xl text-white mb-4">
                        THE ONE CANDLE THAT MATTERS
                    </h1>
                    <p className="text-xl text-gray-300">
                        "I don't trade direction. I trade failure."
                    </p>
                </div>

                {/* VISUAL MODEL CARD */}
                <div className="glass-card rounded-2xl p-4 md:p-12 border border-beast-green/30 bg-black/40 max-w-3xl mx-auto mb-12">

                    {/* The Chart Visualization */}
                    <div className="aspect-[4/3] md:aspect-[16/9] bg-[#0c0c0c] rounded-xl border border-gray-800 relative overflow-hidden mb-8 shadow-2xl">
                        {/* Grid Lines */}
                        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                        <div className="absolute inset-0 flex items-center justify-center translate-y-8 md:translate-y-0">
                            <div className="relative w-64 h-64">

                                {/* 1. Liquidity Line */}
                                <div className="absolute top-[30%] left-[-20%] right-[-20%] h-px bg-gray-500 border-t border-dashed opacity-50"></div>
                                <div className="absolute top-[26%] right-0 text-xs text-gray-500 font-mono">LIQUIDITY (EQUAL HIGHS)</div>

                                {/* 2. The Sweep Candle (Green/White up) */}
                                <div className="absolute top-[20%] left-[30%] w-4 h-[40%] bg-gray-600"></div> {/* Body */}
                                <div className="absolute top-[10%] left-[calc(30%+7px)] w-0.5 h-[60%] bg-gray-600"></div> {/* Wick */}

                                {/* 3. The ENGULFING KILL Candle (Red/Down) */}
                                <div className="absolute top-[20%] left-[45%] w-6 h-[50%] bg-beast-green shadow-[0_0_20px_rgba(34,197,94,0.4)] z-10 animate-pulse-slow"></div> {/* Body */}
                                <div className="absolute top-[15%] left-[calc(45%+11px)] w-0.5 h-[60%] bg-beast-green"></div> {/* Wick */}

                                {/* Labels */}
                                <div className="absolute top-[-10%] left-[45%] text-beast-green text-xs font-bold text-center">
                                    THE SIGNAL<br />↓
                                </div>

                                {/* Entry Line */}
                                <div className="absolute top-[70%] left-[45%] right-[-20%] h-px bg-white/20"></div>
                                <div className="absolute top-[72%] right-[-10%] text-xs text-white font-mono">ENTRY</div>

                                {/* Stop Line */}
                                <div className="absolute top-[10%] left-[45%] right-[-20%] h-px bg-red-500/30"></div>
                                <div className="absolute top-[6%] right-[-10%] text-xs text-red-400 font-mono">STOP</div>

                            </div>
                        </div>
                    </div>

                    {/* Explanation */}
                    <div className="space-y-6">
                        <div className="flex gap-4 items-start">
                            <div className="w-6 h-6 rounded bg-gray-700 flex items-center justify-center text-xs font-bold text-white mt-1">1</div>
                            <div>
                                <h3 className="text-white font-bold">Liquidity Sweep</h3>
                                <p className="text-gray-400 text-sm">Price pushes above a previous high (or below a low). Traders chase the breakout. They are trapped.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-6 h-6 rounded bg-beast-green flex items-center justify-center text-xs font-bold text-black mt-1">2</div>
                            <div>
                                <h3 className="text-white font-bold">Engulfing Close</h3>
                                <p className="text-gray-400 text-sm">The very next candle (or shortly after) closes forcefully back inside the range, engulfing the previous candle body. This proves the breakout failed.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-6 h-6 rounded bg-gray-700 flex items-center justify-center text-xs font-bold text-white mt-1">3</div>
                            <div>
                                <h3 className="text-white font-bold">Execution</h3>
                                <p className="text-gray-400 text-sm">Enter on the close of the engulfing candle. Stop loss goes above the swing high. Target the next liquidity pool.</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* FAQ: Entry vs Confirmation */}
                <div className="max-w-2xl mx-auto mb-16 px-6 py-6 border-l-2 border-beast-green bg-beast-green/5">
                    <h3 className="text-white font-bold mb-2">Entry vs. Confirmation (Critically Important)</h3>
                    <p className="text-gray-300">
                        <span className="text-white font-bold">Price creates the entry. Indicators only confirm permission.</span>
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                        Do not wait for an indicator to say "Sell." Wait for the candle to fail. Check the indicators only to see if you are allowed to pull the trigger.
                    </p>
                </div>

                <div className="text-center">
                    <GlowButton href="/journal" size="lg">
                        I See It. Let Me Trade.
                    </GlowButton>
                </div>

            </div>
        </div>
    );
}
