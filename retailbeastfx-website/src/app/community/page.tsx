import Image from 'next/image';
import { GlowButton } from '@/components/Marketing';

const galleryItems = [
    { winRate: '82%', trades: 47, streak: '12 wins' },
    { winRate: '71%', trades: 156, streak: '8 wins' },
    { winRate: '78%', trades: 89, streak: '15 wins' },
    { winRate: '69%', trades: 234, streak: '6 wins' },
    { winRate: '85%', trades: 31, streak: '9 wins' },
    { winRate: '74%', trades: 112, streak: '11 wins' },
];

export default function CommunityPage() {
    return (
        <div className="relative">
            {/* Hero */}
            <section className="section-padding relative overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-30" />
                <div className="absolute inset-0 bg-radial-glow" />

                <div className="container-wide mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Content */}
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-beast-green/10 border border-beast-green/30 mb-6 animate-pulse">
                                <span className="w-2 h-2 rounded-full bg-beast-green" />
                                <span className="text-sm text-beast-green font-medium">2,500+ Active Members</span>
                            </div>

                            <h1 className="heading-cyber text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                                <span className="text-white">Join the</span>
                                <br />
                                <span className="gradient-text">Beast Pack</span>
                            </h1>

                            <p className="text-xl text-gray-400 max-w-2xl mb-8">
                                Connect with elite traders, share journal insights, and hunt liquidity together
                                on our exclusive Discord server.
                            </p>

                            <GlowButton href="https://discord.gg/retailbeastfx" external size="lg">
                                Join Discord Server
                            </GlowButton>
                        </div>

                        {/* Right: Mascot */}
                        <div className="relative hidden lg:block">
                            <div className="relative aspect-square max-w-md mx-auto">
                                {/* Glowing background */}
                                <div className="absolute inset-0 bg-beast-green/20 rounded-full blur-3xl animate-pulse" />

                                {/* Mascot with hover effect */}
                                <div className="relative animate-float">
                                    <Image
                                        src="/mascot/beast-pose-3-hero.png"
                                        alt="Beast Pack Mascot"
                                        width={400}
                                        height={400}
                                        className="drop-shadow-[0_0_40px_rgba(0,230,118,0.5)] hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                {/* Floating badge */}
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 glass-card rounded-xl px-6 py-3 border border-beast-green/30">
                                    <p className="text-beast-green font-bold text-center">🐺 Join the Pack</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Discord Preview */}
            <section className="px-4 pb-20">
                <div className="container-wide mx-auto">
                    <div className="glass-card rounded-2xl p-8 md:p-12">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="heading-cyber text-2xl text-white mb-6">
                                    What&apos;s Inside the <span className="text-beast-green">Discord</span>
                                </h2>

                                <ul className="space-y-4">
                                    {[
                                        { channel: '#📈 daily-signals', desc: 'Live trade alerts from the community' },
                                        { channel: '#📊 journal-shares', desc: 'Post your journal stats and get feedback' },
                                        { channel: '#🎓 education', desc: 'ICT/SMC breakdowns and strategy discussions' },
                                        { channel: '#🔧 indicator-help', desc: 'Get support directly from the RBFX team' },
                                        { channel: '#💬 general', desc: 'Hang out with fellow traders 24/7' },
                                        { channel: '#🏆 wins-gallery', desc: 'Celebrate profitable trades together' },
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-4">
                                            <code className="text-beast-green bg-cyber-dark px-2 py-1 rounded text-sm shrink-0">
                                                {item.channel}
                                            </code>
                                            <span className="text-gray-400">{item.desc}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="glass-card rounded-xl p-6 bg-[#36393f]">
                                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                                    <div className="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold">RetailBeastFX</p>
                                        <p className="text-xs text-gray-400">2,547 members • 892 online</p>
                                    </div>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-beast-green/30 flex items-center justify-center text-xs">MT</div>
                                        <div>
                                            <p><span className="text-beast-green font-medium">Marcus_T</span> <span className="text-gray-500">Today at 2:34 PM</span></p>
                                            <p className="text-gray-300">Just closed +2.4R on EUR/USD using the Fresh OB signal 🔥</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-beast-gold/30 flex items-center justify-center text-xs">SK</div>
                                        <div>
                                            <p><span className="text-beast-gold font-medium">Sarah_K</span> <span className="text-gray-500">Today at 2:36 PM</span></p>
                                            <p className="text-gray-300">Nice! Journal shows I&apos;m at 78% WR this week 📊</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* User Gallery */}
            <section className="section-padding bg-cyber-dark">
                <div className="container-wide mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="heading-cyber text-3xl md:text-4xl text-white mb-4">
                            Community <span className="text-beast-green">Wins</span>
                        </h2>
                        <p className="text-gray-400">
                            Traders sharing their journey with the RetailBeastFX ecosystem
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {galleryItems.map((item, i) => (
                            <div key={i} className="glass-card rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-cyber-surface flex items-center justify-center">
                                            <span className="text-lg">👤</span>
                                        </div>
                                        <span className="text-gray-400 text-sm">Anonymous Trader</span>
                                    </div>
                                    <span className="px-2 py-1 bg-beast-green/20 text-beast-green text-xs rounded-full">Verified</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-2xl font-bold text-beast-green">{item.winRate}</p>
                                        <p className="text-xs text-gray-500">Win Rate</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{item.trades}</p>
                                        <p className="text-xs text-gray-500">Trades</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-beast-gold">{item.streak}</p>
                                        <p className="text-xs text-gray-500">Best Streak</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Affiliate Program */}
            <section className="section-padding">
                <div className="container-narrow mx-auto">
                    <div className="glass-card rounded-2xl p-8 md:p-12 border-beast-gold/20 text-center">
                        <span className="text-4xl mb-4 block">💰</span>
                        <h2 className="heading-cyber text-2xl md:text-3xl text-white mb-4">
                            Affiliate Program
                        </h2>
                        <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                            Love RetailBeastFX? Earn <span className="text-beast-gold font-bold">25% commission</span> on every
                            referral. Share your link, help traders find their edge, and get paid.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <GlowButton href="/affiliate">
                                Become an Affiliate
                            </GlowButton>
                            <GlowButton href="/affiliate-terms" variant="outline">
                                Learn More
                            </GlowButton>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
