'use client';

import { useState, useEffect } from 'react';

interface Testimonial {
    id: number;
    name: string;
    role: string;
    avatar: string;
    quote: string;
    rating: number;
    winRate?: string;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: 'Marcus T.',
        role: 'Day Trader',
        avatar: '👨‍💻',
        quote: 'The journal forced me to actually track my trades instead of guessing how I was doing. Seeing the data changed how I approach risk.',
        rating: 5,
    },
    {
        id: 2,
        name: 'Sarah K.',
        role: 'Swing Trader',
        avatar: '👩‍💼',
        quote: 'RetailBeastFX killed my revenge trading. Seeing my stats in real-time after each trade makes me think twice before breaking rules.',
        rating: 5,
    },
    {
        id: 3,
        name: 'David L.',
        role: 'Crypto Trader',
        avatar: '🧑‍🚀',
        quote: 'The Killzone overlays are chef\'s kiss. Combined with the journal expectancy tracking, I finally understand where my edge actually is.',
        rating: 5,
    },
    {
        id: 4,
        name: 'Aisha M.',
        role: 'Forex Trader',
        avatar: '👩‍🔬',
        quote: 'Weekly journal reviews are now part of my routine. I can actually see which setups work for me and which ones I should avoid.',
        rating: 5,
    },
];

export default function TestimonialCarousel() {
    const [current, setCurrent] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const handleDotClick = (index: number) => {
        setCurrent(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    return (
        <div className="relative max-w-4xl mx-auto">
            {/* Testimonial Card */}
            <div className="glass-card rounded-2xl p-8 md:p-12 relative overflow-hidden">
                {/* Quote mark */}
                <div className="absolute top-6 left-6 text-6xl text-beast-green/20 font-serif leading-none">
                    &ldquo;
                </div>

                {/* Content */}
                <div className="relative z-10 min-h-[200px] flex flex-col justify-between">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={testimonial.id}
                            className={`transition-all duration-500 ${index === current
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 absolute translate-y-4'
                                }`}
                        >
                            {index === current && (
                                <>
                                    {/* Stars */}
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className="w-5 h-5 text-beast-gold"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>

                                    {/* Quote */}
                                    <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-8">
                                        {testimonial.quote}
                                    </p>

                                    {/* Author */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-cyber-card border border-beast-green/30 flex items-center justify-center text-2xl">
                                                {testimonial.avatar}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">{testimonial.name}</p>
                                                <p className="text-sm text-gray-400">{testimonial.role}</p>
                                            </div>
                                        </div>
                                        {testimonial.winRate && (
                                            <div className="px-4 py-2 rounded-lg bg-beast-green/10 border border-beast-green/30">
                                                <span className="text-beast-green font-bold">{testimonial.winRate}</span>
                                                <span className="text-gray-400 text-sm ml-1">Win Rate</span>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === current
                            ? 'bg-beast-green w-8'
                            : 'bg-gray-600 hover:bg-gray-500'
                            }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
