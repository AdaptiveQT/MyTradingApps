'use client';
import Image from 'next/image';
import { GlowButton, FeatureCard, TestimonialCarousel } from '@/components/Marketing';

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
                <span className="text-sm text-beast-green font-medium">2025-Proof ICT/SMC Tool</span>
              </div>

              {/* Headline */}
              <h1 className="heading-cyber text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="text-white">Hunt Liquidity with</span>
                <br />
                <span className="gradient-text">Mechanical Precision</span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl md:text-2xl text-gray-300 mb-4">
                <span className="text-beast-green font-semibold">Indicator + Journal</span> = Unbeatable Edge
              </p>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0">
                Fresh Order Blocks, Killzones, Quantum Lock™, and a mechanical trading journal
                that turns your signals into consistent profits. No emotions. Just data.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <GlowButton href="https://tradingview.com" external size="lg">
                  Add to TradingView
                </GlowButton>
                <GlowButton href="/journal" variant="outline" size="lg">
                  Launch Journal
                </GlowButton>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 justify-center lg:justify-start">
                <div className="text-center">
                  <p className="text-3xl font-bold text-beast-green">2,500+</p>
                  <p className="text-sm text-gray-400">Active Traders</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-beast-gold">78%</p>
                  <p className="text-sm text-gray-400">Avg Win Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">4.9★</p>
                  <p className="text-sm text-gray-400">User Rating</p>
                </div>
              </div>
            </div>

            {/* Right: Widget with Mascot Peeking */}
            <div className="relative animate-slide-up">
              {/* Mascot peeking from behind the card - positioned to look like he's interacting */}
              <div className="absolute -right-8 md:-right-12 top-0 w-32 md:w-44 z-0 animate-float">
                <Image
                  src="/mascot/beast-pose-1-hero.png"
                  alt="The Beast peeking"
                  width={180}
                  height={180}
                  className="drop-shadow-[0_0_30px_rgba(0,230,118,0.4)] scale-x-[-1]"
                />
              </div>

              {/* Main Signal Widget */}
              <div className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden z-10">
                {/* Glowing background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-beast-green/5 via-transparent to-beast-green/10" />

                {/* Widget Header */}
                <div className="relative z-10 flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-beast-green animate-pulse" />
                    <span className="text-beast-green font-semibold">Live Signal Feed</span>
                  </div>
                  <span className="text-xs text-gray-500">NY Session Active</span>
                </div>

                {/* Chart Preview Mock */}
                <div className="relative z-10 bg-cyber-dark/50 rounded-xl p-4 mb-4 border border-beast-green/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-bold">EUR/USD</span>
                    <span className="text-beast-green text-sm">Fresh OB ↑</span>
                  </div>
                  {/* Simplified chart bars */}
                  <div className="flex items-end gap-1 h-20">
                    {[40, 55, 45, 70, 60, 85, 75, 90, 80, 95, 88, 100].map((h, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-sm ${i >= 9 ? 'bg-beast-green' : 'bg-gray-700'}`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Entry: 1.0850</span>
                    <span className="text-beast-green">TP: 1.0920</span>
                  </div>
                </div>

                {/* Signal Details */}
                <div className="relative z-10 grid grid-cols-3 gap-4 text-center">
                  <div className="bg-cyber-dark/30 rounded-lg p-3">
                    <p className="text-beast-green text-xl font-bold">3.2R</p>
                    <p className="text-xs text-gray-500">Target</p>
                  </div>
                  <div className="bg-cyber-dark/30 rounded-lg p-3">
                    <p className="text-beast-gold text-xl font-bold">78%</p>
                    <p className="text-xs text-gray-500">Win Rate</p>
                  </div>
                  <div className="bg-cyber-dark/30 rounded-lg p-3">
                    <p className="text-white text-xl font-bold">A+</p>
                    <p className="text-xs text-gray-500">Grade</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats Card - Beast pointing at it */}
              <div className="relative mt-6">
                {/* Small mascot pointing at the stats */}
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
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-beast-green animate-pulse" />
                      <span className="text-sm text-gray-400">Logged to Journal</span>
                    </div>
                    <span className="px-2 py-1 text-xs bg-beast-green/20 text-beast-green rounded font-medium">✓ SAVED</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <p className="font-semibold text-white">EUR/USD Long</p>
                      <p className="text-xs text-gray-500">Fresh OB + NY Killzone</p>
                    </div>
                    <div className="text-right">
                      <p className="text-beast-green font-bold text-lg">+2.4R</p>
                    </div>
                  </div>
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

      {/* ==================== JOURNAL SPOTLIGHT ==================== */}
      <section className="section-padding bg-cyber-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-glow opacity-30" />

        <div className="container-narrow mx-auto text-center relative z-10">
          <h2 className="heading-cyber text-3xl md:text-4xl text-white mb-4">
            Log Your First <span className="text-beast-green">RBFX Signal</span> in Seconds
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            The RetailBeastFX Journal is your mechanical execution enforcer.
            Analytics auto-update. Win rates calculate instantly. No emotions, just data.
          </p>

          <div className="glass-card rounded-2xl p-6 md:p-8 max-w-3xl mx-auto">
            <div className="aspect-[16/9] bg-cyber-surface rounded-xl border border-beast-green/20 flex items-center justify-center relative overflow-hidden">
              {/* Loading animation mockup */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 border-4 border-beast-green/30 border-t-beast-green rounded-full animate-spin" />
                <p className="text-beast-green font-semibold">Loading your data...</p>
                <p className="text-gray-500 text-sm mt-2">Your trades sync here automatically</p>
              </div>

              {/* Overlay hint */}
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-cyber-dark/80 rounded-lg border border-beast-green/20 text-sm text-gray-400">
                💡 Connect your TradingView alerts for auto-logging
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

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="section-padding bg-cyber-dark relative">
        <div className="container-wide mx-auto">
          <div className="text-center mb-12">
            <h2 className="heading-cyber text-3xl md:text-4xl text-white mb-4">
              Join the <span className="text-beast-gold">Beast Pack</span>
            </h2>
            <p className="text-gray-400">
              See what traders are saying about RetailBeastFX.
            </p>
          </div>

          <TestimonialCarousel />
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-beast-green/5 via-transparent to-beast-green/5" />

        <div className="container-narrow mx-auto text-center relative z-10">
          <div className="glass-card rounded-3xl p-8 md:p-16 border-beast-green/20">
            <h2 className="heading-cyber text-3xl md:text-5xl text-white mb-4">
              Ready to <span className="text-beast-green">Hunt Liquidity?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join 2,500+ traders using RetailBeastFX to find high-probability setups and log trades with mechanical precision.
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
