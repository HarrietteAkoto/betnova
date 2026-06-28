"use client";
import { useState, useEffect } from "react";

const carouselItems = [
  { id: 1, type: 'promo', title: '⚡ 10% Acca Boost!', subtitle: 'Get 10% extra on your winnings for 5+ selections.', cta: 'Claim Now', bg: 'bg-gradient-to-r from-green-600 to-green-800' },
  { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80', title: 'FIFA World Cup 2026', subtitle: 'Ghana vs Brazil - Special Odds!' },
  { id: 3, type: 'image', url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80', title: 'NBA Playoffs', subtitle: 'Lakers vs Celtics Live Now' },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
      {carouselItems.map((item, i) => (
        <div 
          key={item.id} 
          className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          {item.type === 'image' ? (
            <>
              <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent"></div>
            </>
          ) : (
            <div className={`w-full h-full ${item.bg} flex items-center justify-center`}></div>
          )}
          <div className="absolute bottom-0 left-0 p-6">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{item.title}</h3>
            <p className="text-sm md:text-base text-green-400 font-medium mb-3">{item.subtitle}</p>
            {item.cta && (
              <button className="px-6 py-2 bg-white text-gray-950 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">
                {item.cta}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
