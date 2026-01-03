'use client';
import Image from 'next/image';
import { GlowButton, FeatureCard } from '@/components/Marketing';

// Icons for feature cards
const IndicatorIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const JournalIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const EdgeIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

const CommunityIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);

export default function HomePage() {
  return (
    <div className="relative">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute inset-0 bg-radial-glow" />

        {/* Animated background orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-beast-green/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-beast-green/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="container-wide mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="text-center lg:text-left animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-beast-green/10 border border-beast-green/30 mb-6">
                <span className="w-2 h-2 rounded-full bg-beast-green animate-pulse" />
                <span className="text-sm text-beast-green font-medium">Tier-3 Execution Framework</span>
              </div>

              {/* Headline - HARD GATE */}
              <h1 className="heading-cyber text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="text-white">RETAIL BEAST FX</span>
                <br />
                <span className="gradient-text">THE SYSTEM.</span>
              </h1>

              {/* Subheadline - AUTHORITY */}
              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Hunt Liquidity with <span className="text-beast-green font-bold">Mechanical Precision</span>.
              </p>

              {/* CHOOSE YOUR PATH - MODE SELECTOR */}
              <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto lg:mx-0 mb-8">
                {/* Strict Mode Card */}
                <div className="bg-cyber-dark/80 p-4 rounded-xl border border-beast-green/30 hover:border-beast-green transition-colors text-left group cursor-default">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-beast-green rounded-full animate-pulse"></div>
                    <h3 className="text-white font-bold group-hover:text-beast-green transition-colors">STRICT MODE</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">Locked Trinity. Zero Flexibility.</p>
                  <p className="text-xs text-beast-green uppercase font-bold tracking-wider">For Enforcers</p>
                </div>

                {/* Discretion Mode Card */}
                <div className="bg-cyber-dark/80 p-4 rounded-xl border border-beast-gold/30 hover:border-beast-gold transition-colors text-left group cursor-default">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-beast-gold rounded-full animate-pulse"></div>
                    <h3 className="text-white font-bold group-hover:text-beast-gold transition-colors">DISCRETION MODE</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">ICT Fallure Execution. Anticipatory.</p>
                  <p className="text-xs text-beast-gold uppercase font-bold tracking-wider">For Hunters</p>
                </div>
              </div>

              {/* Protocol Line */}
              <div className="mb-8 border-l-2 border-red-500 pl-4 py-1">
                <p className="text-white font-medium italic">
                  "No Setup. No Shot. No Cope. Accept or Exit."
                </p>
              </div>

              {/* SCOPE LOCK BOX */}
              <div className="bg-cyber-dark p-6 rounded-xl border border-gray-700 mb-8 max-w-xl mx-auto lg:mx-0">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <span className="text-beast-gold">🔒</span> SCOPE LOCK (NON-NEGOTIABLE)
                </h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-beast-green">✓</span> FX Majors + Gold ONLY
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-beast-green">✓</span> London (02:00–05:00 ET) / NY (08:00–11:00 ET)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-beast-green">✓</span> BB 20/1.0 Locked
                  </li>
                </ul>
                <div className="mt-4 pt-3 border-t border-gray-700 text-xs text-gray-500 italic">
                  Anything else is outside the system.
                </div>
              </div>

              {/* CTA - PERMISSION-BASED */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <GlowButton href="/start-here" size="lg">
                  See If You&apos;re Even Allowed to Trade This
                </GlowButton>
                <GlowButton href="/pricing" variant="outline" size="lg">
                  View Requirements
                </GlowButton>
              </div>

              {/* Trust Signal - HONEST */}
              <p className="text-sm text-gray-500">
                ✓ Free journal, no signup required &nbsp;•&nbsp; ✓ Premium indicator optional &nbsp;•&nbsp; ✓ Built by a trader, for traders
              </p>
            </div>

            {/* Right: Indicator Showcase with Mascot */}
            <div className="relative animate-slide-up">
              {/* Mascot peeking from behind the card */}
              <div className="absolute -right-8 md:-right-12 top-0 w-32 md:w-44 z-0 animate-float">
                <Image
                  src="/mascot/beast-pose-1-hero.png"
                  alt="The Beast peeking"
                  width={180}
                  height={180}
                  className="drop-shadow-[0_0_30px_rgba(0,230,118,0.4)] scale-x-[-1]"
                />
              </div>

              {/* Main Indicator Feature Card */}
              <div className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden z-10">
                {/* Glowing background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-beast-green/5 via-transparent to-beast-green/10" />

                {/* Card Header */}
                <div className="relative z-10 flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/indicator-icon.jpg"
                      alt="RetailBeastFX Indicator"
                      width={40}
                      height={40}
                      className="rounded-lg shadow-lg shadow-beast-green/30"
                    />
                    <span className="text-beast-green font-bold text-lg">RetailBeastFX Indicator</span>
                  </div>
                  <span className="text-xs text-gray-400 bg-cyber-dark/50 px-2 py-1 rounded">TradingView + MT5</span>
                </div>

                {/* Features List */}
                <div className="relative z-10 space-y-3 mb-6">
                  {[
                    { icon: '🎯', label: 'Fresh Order Blocks' },
                    { icon: '⏰', label: 'Killzone Overlays' },
                    { icon: '🔒', label: 'Quantum Lock™ Signals' },
                    { icon: '📊', label: 'Multi-Timeframe Analysis' },
                    { icon: '🔔', label: 'Real-Time Alerts' },
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 bg-cyber-dark/30 rounded-lg px-4 py-2">
                      <span>{feature.icon}</span>
                      <span className="text-gray-300">{feature.label}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom Stats */}
                <div className="relative z-10 grid grid-cols-2 gap-4 text-center">
                  <div className="bg-cyber-dark/30 rounded-lg p-3">
                    <p className="text-beast-green text-lg font-bold">Strict</p>
                    <p className="text-xs text-gray-500">Mechanical Trinity</p>
                  </div>
                  <div className="bg-cyber-dark/30 rounded-lg p-3">
                    <p className="text-beast-gold text-lg font-bold">Hunter</p>
                    <p className="text-xs text-gray-500">Anticipatory ICT</p>
                  </div>
                </div>
              </div>

              {/* Journal Card - Beast pointing at it */}
              <div className="relative mt-6">
                <div className="absolute -left-16 md:-left-20 top-1/2 -translate-y-1/2 w-20 md:w-28 z-20">
                  <Image
                    src="/mascot/beast-pose-3-card.png"
                    alt="Beast pointing"
                    width={112}
                    height={112}
                    className="drop-shadow-[0_0_20px_rgba(0,230,118,0.5)]"
                  />
                </div>

                <div className="glass-card rounded-xl p-4 border border-beast-green/20 ml-8">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">+ Trading Journal Included</span>
                    <span className="px-2 py-1 text-xs bg-beast-green/20 text-beast-green rounded font-medium">FREE</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Track every trade, analyze your stats, improve your edge</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
          <svg className="w-6 h-6 text-beast-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ==================== EXCLUSION SECTION ==================== */}
      <section className="section-padding bg-cyber-dark/50 relative">
        <div className="absolute inset-0 bg-grid opacity-20" />

        <div className="container-narrow mx-auto relative z-10">
          <div className="glass-card rounded-2xl p-8 md:p-12 border border-red-400/20">
            <h2 className="heading-cyber text-3xl md:text-4xl text-white mb-6 text-center">
              THIS IS <span className="text-red-400">NOT</span> FOR YOU IF —
            </h2>

            <div className="space-y-4 max-w-2xl mx-auto mb-8">
              <div className="flex items-start gap-3">
                <span className="text-red-400 font-bold text-xl">×</span>
                <p className="text-gray-300">You need constant trades</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-400 font-bold text-xl">×</span>
                <p className="text-gray-300">You trade Asia or random hours</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-400 font-bold text-xl">×</span>
                <p className="text-gray-300">You want signals or alerts</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-400 font-bold text-xl">×</span>
                <p className="text-gray-300">You change rules after losses</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-400 font-bold text-xl">×</span>
                <p className="text-gray-300">You stack concepts to feel smart</p>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <p className="text-lg text-white text-center max-w-xl mx-auto mb-6">
                Retail Beast doesn&apos;t teach confidence.<br />
                <span className="text-beast-green font-medium">It exposes whether you already have discipline.</span>
              </p>

              {/* WHY WE DON'T PREDICT */}
              <div className="bg-black/40 p-6 rounded-xl border border-gray-700 max-w-2xl mx-auto text-left">
                <h3 className="text-beast-gold font-bold mb-3">Why We Don&apos;t Predict</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Prediction is ego. Execution is submission.
                  <br /><br />
                  Markets move to liquidity. We do not guess where. We wait for the trap, see the failure, and act on permission.
                </p>
                <p className="text-white font-medium italic text-sm border-l-2 border-beast-gold pl-3">
                  "Price action explains WHY a level exists. The system decides IF you act."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== JOURNAL SPOTLIGHT ==================== */}
      <section className="section-padding bg-cyber-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-glow opacity-30" />

        <div className="container-narrow mx-auto text-center relative z-10">
          <h2 className="heading-cyber text-3xl md:text-4xl text-white mb-4">
            <span className="text-beast-green">The Journal</span> Is the Enforcer
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-4">
            <span className="text-white font-medium">Every violation is logged. Every deviation is visible.</span>
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            You can&apos;t hide from your own behavior. The market doesn&apos;t forgive mistakes — the journal makes sure you don&apos;t forget them either.
          </p>

          <div className="glass-card rounded-2xl p-6 md:p-8 max-w-3xl mx-auto">
            <div className="aspect-[16/9] bg-cyber-surface rounded-xl border border-beast-green/20 overflow-hidden">
              {/* Journal Preview Mockup */}
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-cyber-border">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-beast-green animate-pulse" />
                    <span className="text-sm text-white font-medium">Today&apos;s Trades</span>
                  </div>
                  <span className="text-xs text-beast-green font-bold">Win Rate: 72%</span>
                </div>

                {/* Trade Rows */}
                <div className="flex-1 overflow-hidden p-3 space-y-2">
                  {[
                    { pair: 'XAUUSD', dir: 'BUY', rr: '+2.5R', result: 'WIN', time: '9:32 AM' },
                    { pair: 'EURUSD', dir: 'SELL', rr: '+1.8R', result: 'WIN', time: '10:15 AM' },
                    { pair: 'NAS100', dir: 'BUY', rr: '-1R', result: 'LOSS', time: '11:02 AM' },
                    { pair: 'USDJPY', dir: 'BUY', rr: '+3.2R', result: 'WIN', time: '2:45 PM' },
                  ].map((trade, i) => (
                    <div key={i} className="flex items-center justify-between bg-cyber-dark/50 rounded-lg px-3 py-2 text-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-medium">{trade.pair}</span>
                        <span className={trade.dir === 'BUY' ? 'text-beast-green' : 'text-red-400'}>{trade.dir}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 text-xs">{trade.time}</span>
                        <span className={trade.result === 'WIN' ? 'text-beast-green font-bold' : 'text-red-400'}>{trade.rr}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Stats */}
                <div className="flex items-center justify-around px-4 py-3 border-t border-cyber-border bg-cyber-dark/30">
                  <div className="text-center">
                    <p className="text-beast-green font-bold">+6.5R</p>
                    <p className="text-xs text-gray-500">Today</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold">4</p>
                    <p className="text-xs text-gray-500">Trades</p>
                  </div>
                  <div className="text-center">
                    <p className="text-beast-gold font-bold">3W / 1L</p>
                    <p className="text-xs text-gray-500">Record</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <GlowButton href="/journal" className="mt-8">
            Open Full Journal →
          </GlowButton>
        </div>
      </section>

      {/* ==================== ECOSYSTEM SECTION ==================== */}
      <section className="section-padding relative">
        <div className="absolute inset-0 bg-grid opacity-30" />

        <div className="container-wide mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="heading-cyber text-3xl md:text-4xl text-white mb-4">
              The Complete <span className="text-beast-green">Trading Ecosystem</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From signal detection to journal analysis – everything you need to become a consistently profitable trader.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<IndicatorIcon />}
              title="The Indicator"
              description="Fresh Order Blocks, Fair Value Gaps, Killzones, Quantum Lock™ confirmation. ICT/SMC concepts that actually work in 2025."
              highlighted={true}
            />
            <FeatureCard
              icon={<JournalIcon />}
              title="The Journal"
              description="Mechanical logging for every signal. Win rates, R:R tracking, streak monitoring. Your execution enforcer."
            />
            <FeatureCard
              icon={<EdgeIcon />}
              title="The Edge"
              description="2025-proof for Forex, Crypto, and Futures. No patched concepts. Continuous updates based on market evolution."
            />
            <FeatureCard
              icon={<CommunityIcon />}
              title="The Community"
              description="Share journal insights, review setups, and learn from elite traders on Discord. We hunt together."
            />
          </div>
        </div>
      </section>



      {/* Testimonials section removed - will add back when we have real customer reviews */}


      {/* ==================== THE OATH (FINAL GATE) ==================== */}
      <section className="section-padding bg-cyber-dark relative">
        <div className="absolute inset-0 bg-grid opacity-20" />

        <div className="container-narrow mx-auto text-center relative z-10">
          <div className="glass-card rounded-2xl p-8 md:p-12 border border-beast-green/20">
            <h2 className="heading-cyber text-3xl md:text-4xl text-white mb-8">
              THE RETAIL BEAST OATH
            </h2>

            <div className="max-w-lg mx-auto space-y-4 mb-8 text-left">
              <p className="text-lg text-gray-300 border-l-2 border-beast-green pl-4">
                I will not trade without confluence.
              </p>
              <p className="text-lg text-gray-300 border-l-2 border-beast-green pl-4">
                I will not trade outside killzones.
              </p>
              <p className="text-lg text-gray-300 border-l-2 border-beast-green pl-4">
                I will not bend rules to feel better.
              </p>
            </div>

            <p className="text-xl text-white font-medium mb-8">
              No trade. No debate. No cope.
            </p>

            <GlowButton href="/journal" size="lg">
              Enter Under These Rules
            </GlowButton>
          </div>
        </div>
      </section>


      {/* ==================== CTA SECTION ==================== */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-beast-green/5 via-transparent to-beast-green/5" />

        <div className="container-narrow mx-auto text-center relative z-10">
          <div className="glass-card rounded-3xl p-8 md:p-16 border-beast-green/20">
            <h2 className="heading-cyber text-3xl md:text-5xl text-white mb-4">
              Ready to <span className="text-beast-green">Trade with Discipline?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              The indicator finds setups. The journal grades execution. Together, they force you to improve.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <GlowButton href="/pricing" size="lg">
                Get Started Free
              </GlowButton>
              <GlowButton href="/features" variant="outline" size="lg">
                Explore Features
              </GlowButton>
            </div>

            <p className="text-sm text-gray-500">
              ✓ Free tier available &nbsp;•&nbsp; ✓ No credit card required &nbsp;•&nbsp; ✓ Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
