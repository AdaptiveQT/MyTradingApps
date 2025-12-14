import Link from 'next/link';
import Image from 'next/image';

const footerLinks = {
    product: [
        { href: '/features', label: 'Features' },
        { href: '/journal', label: 'Trading Journal' },
        { href: '/pricing', label: 'Pricing' },
        { href: '/docs', label: 'Documentation' },
    ],
    community: [
        { href: '/community', label: 'Discord' },
        { href: '/blog', label: 'Blog' },
        { href: 'https://twitter.com/retailbeastfx', label: 'Twitter/X', external: true },
        { href: '/about', label: 'About Us' },
    ],
    legal: [
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/terms', label: 'Terms of Service' },
        { href: '/disclaimer', label: 'NFA Disclaimer' },
        { href: '/contact', label: 'Contact' },
    ],
};

export default function Footer() {
    return (
        <footer className="relative bg-cyber-dark border-t border-beast-green/10">
            {/* Newsletter Section */}
            <div className="border-b border-beast-green/10">
                <div className="container-wide mx-auto px-4 py-12">
                    <div className="glass-card rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <h3 className="heading-cyber text-2xl text-beast-green mb-2">
                                Track Your Beast Trades
                            </h3>
                            <p className="text-gray-400">
                                Get journal templates and weekly trading insights. Start free.
                            </p>
                        </div>
                        <form className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="px-4 py-3 bg-cyber-surface border border-cyber-border rounded-lg text-white placeholder-gray-500 focus:border-beast-green focus:outline-none min-w-[250px]"
                            />
                            <button type="submit" className="btn-glow whitespace-nowrap">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="container-wide mx-auto px-4 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-4 group">
                            <div className="relative w-14 h-14 overflow-visible">
                                <Image
                                    src="/mascot/beast-pose-1-card.png"
                                    alt="RetailBeastFX Mascot"
                                    width={56}
                                    height={56}
                                    className="object-contain drop-shadow-[0_0_15px_rgba(0,230,118,0.4)] group-hover:drop-shadow-[0_0_25px_rgba(0,230,118,0.6)] transition-all duration-300 group-hover:scale-110"
                                />
                            </div>
                            <span className="heading-cyber text-xl text-beast-green font-bold">
                                RetailBeastFX
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm mb-4">
                            The 2025-proof elite ICT/SMC trading indicator + journal ecosystem. Hunt liquidity with mechanical precision.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="https://twitter.com/retailbeastfx"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg bg-cyber-card border border-cyber-border flex items-center justify-center text-gray-400 hover:text-beast-green hover:border-beast-green/50 transition-colors"
                                aria-label="Twitter"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a
                                href="https://discord.gg/retailbeastfx"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg bg-cyber-card border border-cyber-border flex items-center justify-center text-gray-400 hover:text-beast-green hover:border-beast-green/50 transition-colors"
                                aria-label="Discord"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Product</h4>
                        <ul className="space-y-2">
                            {footerLinks.product.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-gray-400 hover:text-beast-green text-sm transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Community Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Community</h4>
                        <ul className="space-y-2">
                            {footerLinks.community.map((link) => (
                                <li key={link.href}>
                                    {link.external ? (
                                        <a
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-beast-green text-sm transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    ) : (
                                        <Link href={link.href} className="text-gray-400 hover:text-beast-green text-sm transition-colors">
                                            {link.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-gray-400 hover:text-beast-green text-sm transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-beast-green/10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-gray-500 text-sm text-center md:text-left">
                            © {new Date().getFullYear()} RetailBeastFX. All rights reserved.
                        </p>
                        <p className="text-gray-600 text-xs text-center md:text-right max-w-2xl">
                            <strong className="text-gray-500">NFA Disclaimer:</strong> Trading involves substantial risk. Past performance is not indicative of future results. This journal and indicator are for educational purposes only, not financial advice.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
