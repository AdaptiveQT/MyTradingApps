'use client';

import { useState } from 'react';
import Image from 'next/image';
import { GlowButton } from '@/components/Marketing';

interface PricingTier {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    highlighted?: boolean;
    badge?: string;
    cta: string;
    ctaVariant: 'primary' | 'outline';
}

const pricingTiers: PricingTier[] = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        description: 'Full MT5 indicator - get started free',
        features: [
            '🔥 Full MT5 Indicator Download',
            'Killzones (Asian, London, NY)',
            'Order Blocks & BOS/CHoCH',
            'Bollinger Bands + EMAs',
            'All Trading Modes (Scalper, Day, Swing)',
            'Community Discord access',
            'Basic Trading Journal',
        ],
        badge: '100% FREE',
        cta: 'Download MT5 Indicator',
        ctaVariant: 'outline',
    },
    {
        name: 'Premium',
        price: '$97',
        period: 'one-time',
        description: 'Full ICT/SMC indicator suite',
        features: [
            'Everything in Free, PLUS:',
            '♾️ Unlimited Order Blocks',
            '📊 Higher Timeframe OB/FVG Analysis',
            '🎯 Fair Value Gaps + iFVG',
            '💧 Liquidity Sweep Detection',
            '🎯 ATR-based SL/TP Levels',
            '⚡ Silver Bullet & Power Hour',
            '🔮 Alpha Edge A+ Strategies',
            '📈 Multi-Timeframe Trend Table',
            '🔄 Lifetime Updates',
            '💬 Discord Community Access',
        ],
        highlighted: true,
        badge: 'MOST POPULAR',
        cta: 'Get Premium',
        ctaVariant: 'primary',
    },
];

const faqItems = [
    {
        q: 'Is this a one-time purchase?',
        a: 'Yes! Pay once, use forever. You also get lifetime updates at no extra cost.',
    },
    {
        q: 'Is there a refund policy?',
        a: 'We offer a 14-day money-back guarantee. If you\'re not satisfied, contact us for a full refund.',
    },
    {
        q: 'How do I install the MT5 indicator?',
        a: 'After purchase, download the .ex5 file and copy it to your MT5 Indicators folder. Restart MT5 and it will appear in your Navigator.',
    },
    {
        q: 'Does it work on any broker?',
        a: 'Yes! The indicator has universal broker support with adjustable GMT offset. Works with IC Markets, FTMO, OANDA, Exness, and more.',
    },
    {
        q: 'What markets can I trade?',
        a: 'Forex, crypto, indices, commodities – any market available on MT5.',
    },
];

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const yearlyDiscount = 0.2; // 20% off

    return (
        <div className="relative">
            {/* Hero */}
            <section className="section-padding relative overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-30" />
                <div className="absolute inset-0 bg-radial-glow" />

                <div className="container-narrow mx-auto relative z-10 text-center">
                    <h1 className="heading-cyber text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        <span className="text-white">Simple, Transparent</span>
                        <br />
                        <span className="gradient-text">Pricing</span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                        Start free. Upgrade when you&apos;re ready. All plans include the core ecosystem.
                    </p>

                    {/* Billing Toggle */}
                    <div className="inline-flex items-center gap-3 p-1 rounded-full bg-cyber-card border border-cyber-border">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'monthly'
                                ? 'bg-beast-green text-black'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'yearly'
                                ? 'bg-beast-green text-black'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Yearly
                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-beast-gold/20 text-beast-gold">
                                -20%
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="pb-20 px-4">
                <div className="container-wide mx-auto">
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {pricingTiers.map((tier) => {
                            const price = tier.price.startsWith('$') && tier.price !== '$0'
                                ? billingCycle === 'yearly'
                                    ? `$${(parseFloat(tier.price.slice(1)) * (1 - yearlyDiscount) * 12).toFixed(0)}`
                                    : tier.price
                                : tier.price;

                            const period = tier.price === '$0'
                                ? tier.period
                                : billingCycle === 'yearly'
                                    ? '/year'
                                    : tier.period;

                            return (
                                <div
                                    key={tier.name}
                                    className={`glass-card rounded-2xl p-8 relative ${tier.highlighted
                                        ? 'border-beast-green/50 shadow-neon-green scale-105 z-10'
                                        : ''
                                        }`}
                                >
                                    {/* Badge */}
                                    {tier.badge && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                            <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${tier.highlighted
                                                ? 'bg-beast-green text-black'
                                                : 'bg-beast-gold/20 text-beast-gold border border-beast-gold/30'
                                                }`}>
                                                {tier.badge}
                                            </span>
                                        </div>
                                    )}

                                    {/* Header */}
                                    <div className="text-center mb-6 pt-2">
                                        <h3 className="heading-cyber text-2xl text-white mb-2">{tier.name}</h3>
                                        <p className="text-gray-400 text-sm mb-4">{tier.description}</p>
                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className="text-4xl font-bold text-beast-green">{price}</span>
                                            <span className="text-gray-500">{period}</span>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <ul className="space-y-3 mb-8">
                                        {tier.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <svg className="w-5 h-5 text-beast-green mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-300 text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA */}
                                    {tier.name === 'Free' ? (
                                        <a
                                            href="/downloads/RetailBeastFX_Free.mq5"
                                            download
                                            className="glow-button glow-button--outline w-full justify-center flex items-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            {tier.cta}
                                        </a>
                                    ) : (
                                        <GlowButton
                                            href="https://whop.com/retailbeastfx/retailbeastfx-premium"
                                            variant={tier.ctaVariant}
                                            className="w-full justify-center"
                                            external
                                        >
                                            {tier.cta}
                                        </GlowButton>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Journal Standalone */}
            <section className="section-padding bg-cyber-dark">
                <div className="container-narrow mx-auto">
                    <div className="glass-card rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="heading-cyber text-2xl text-white mb-2">
                                Journal Only?
                            </h3>
                            <p className="text-gray-400">
                                Don&apos;t need the indicator? Get the journal standalone for just <span className="text-beast-green font-bold">$9.99/month</span> or <span className="text-beast-gold font-bold">$49 lifetime</span>.
                            </p>
                        </div>
                        <GlowButton href="/journal" variant="outline">
                            Learn More
                        </GlowButton>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="section-padding">
                <div className="container-narrow mx-auto">
                    <h2 className="heading-cyber text-3xl md:text-4xl text-white text-center mb-12">
                        Frequently Asked <span className="text-beast-green">Questions</span>
                    </h2>

                    <div className="space-y-4 max-w-2xl mx-auto">
                        {faqItems.map((item, i) => (
                            <div
                                key={i}
                                className="glass-card rounded-xl overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full p-6 text-left flex items-center justify-between"
                                >
                                    <span className="font-medium text-white">{item.q}</span>
                                    <svg
                                        className={`w-5 h-5 text-beast-green transition-transform ${openFaq === i ? 'rotate-180' : ''
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {openFaq === i && (
                                    <div className="px-6 pb-6 text-gray-400 animate-fade-in">
                                        {item.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding bg-cyber-dark relative overflow-hidden">
                {/* Background mascot */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none hidden lg:block">
                    <Image
                        src="/mascot/beast-pose-4-hero.png"
                        alt=""
                        width={400}
                        height={400}
                        className="drop-shadow-[0_0_60px_rgba(0,230,118,0.3)]"
                    />
                </div>

                <div className="container-narrow mx-auto text-center relative z-10">
                    <h2 className="heading-cyber text-3xl md:text-4xl text-white mb-4">
                        Still Have Questions?
                    </h2>
                    <p className="text-gray-400 mb-8">
                        Reach out to our team. We&apos;re here to help you find the right plan.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <GlowButton href="/contact">
                            Contact Sales
                        </GlowButton>
                        <GlowButton href="https://discord.gg/retailbeastfx" variant="outline" external>
                            Join Discord
                        </GlowButton>
                    </div>
                </div>
            </section>
        </div>
    );
}
