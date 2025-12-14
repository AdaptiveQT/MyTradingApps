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
        description: 'Full MT5 indicator - no limits',
        features: [
            '🔥 Full MT5 Indicator Download',
            'Killzones (Asian, London, NY)',
            'Order Blocks & BOS/CHoCH',
            'Bollinger Bands + EMAs',
            'All Trading Modes (Scalper, Day, Swing)',
            'Community Discord access',
            'Basic journal (10 entries/month)',
        ],
        badge: '100% FREE',
        cta: 'Download MT5 Indicator',
        ctaVariant: 'outline',
    },
    {
        name: 'Pro',
        price: '$9.99',
        period: '/month',
        description: 'Unlimited journaling + analytics',
        features: [
            'Everything in Free',
            'Unlimited Journal Entries',
            'Advanced Analytics Dashboard',
            'Setup Expectancy Tracking',
            'Session Heatmaps',
            'TradingView Webhook Auto-Log',
            'Export to CSV/PDF',
            'Email Support',
        ],
        highlighted: true,
        badge: 'Most Popular',
        cta: 'Go Pro',
        ctaVariant: 'primary',
    },
    {
        name: 'Elite',
        price: '$14.99',
        period: '/month',
        description: 'For traders who want the edge',
        features: [
            'Everything in Pro',
            'AI Journal Insights',
            'Custom Journal Templates',
            'Advanced Backtesting Tools',
            'Private Discord Channel',
            'Early Access to New Features',
            'Priority Support',
        ],
        badge: 'Best Value',
        cta: 'Go Elite',
        ctaVariant: 'primary',
    },
];

const faqItems = [
    {
        q: 'Can I cancel anytime?',
        a: 'Yes! No contracts, no commitments. Cancel with one click and keep access until the end of your billing period.',
    },
    {
        q: 'Is there a refund policy?',
        a: 'We offer a 30-day money-back guarantee. If you\'re not satisfied, contact us for a full refund.',
    },
    {
        q: 'Do I need TradingView to use the indicator?',
        a: 'Yes, the indicator runs on TradingView. You\'ll need at least a free TradingView account.',
    },
    {
        q: 'Can I use the journal without the indicator?',
        a: 'Absolutely! The journal works standalone. You can manually log trades or import from MT4/MT5.',
    },
    {
        q: 'Is my trading data private?',
        a: 'Yes. Your data is encrypted and never shared. You can export or delete it anytime.',
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
                                            href="#"
                                            variant={tier.ctaVariant}
                                            className="w-full justify-center"
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
