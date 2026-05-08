import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import languageData from './language.json';

gsap.registerPlugin(ScrollTrigger);

const goalsData = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    imagePosition: "left"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
    imagePosition: "right"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3cae10c3?w=800&q=80",
    imagePosition: "left"
  }
];

const GoalsCards = ({ lang }) => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const t = languageData[lang].goals;

  const localizedGoals = goalsData.map((goal, index) => ({
    ...goal,
    title: t.cards[index].title,
    description: t.cards[index].description
  }));

  useEffect(() => {
    const cards = cardsRef.current;
    const section = sectionRef.current;

    // Set initial states - all cards stacked at center, hidden except first
    gsap.set(cards, { 
      position: 'absolute',
      top: '50%',
      left: '50%',
      xPercent: -50,
      yPercent: -50,
      width: '80%',
      height: '80%',
      scale: 1,
      opacity: 1,
      y: '100vh'
    });

    // First card visible initially
    gsap.set(cards[0], { scale: 1, opacity: 1, y: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${window.innerHeight * 3}`,
        pin: true,
        scrub: 1,
        snap: {
          snapTo: (progress) => {
            const step = 1 / (cards.length);
            return Math.round(progress / step) * step;
          },
          duration: { min: 0.2, max: 0.5 },
          ease: "power1.inOut"
        }
      }
    });

    // Card 1: scale down when Card 2 comes
    tl.to(cards[0], {
      scale: 0.7,
      duration: 1,
      ease: "power2.inOut"
    }, 0);

    // Card 2: slide up from bottom with full opacity
    tl.fromTo(cards[1], 
      { y: '100vh', scale: 1, opacity: 1 },
      { y: 0, scale: 1, opacity: 1, duration: 1, ease: "power2.out" },
      0
    );

    // Card 2: scale down when Card 3 comes
    tl.to(cards[1], {
      scale: 0.7,
      duration: 1,
      ease: "power2.inOut"
    }, 1);

    // Card 3: slide up from bottom with full opacity
    tl.fromTo(cards[2], 
      { y: '100vh', scale: 1, opacity: 1 },
      { y: 0, scale: 1, opacity: 1, duration: 1, ease: "power2.out" },
      1
    );

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative h-screen w-full bg-fourth overflow-hidden"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >

      {/* Section Title (fixed) */}
      <div className={`absolute top-8 ${lang === 'ar' ? 'right-8 text-right' : 'left-8 text-left'} z-20`}>
        <h2 className="text-main text-5xl font-bold tracking-wider">{t.our}</h2>
        <h2 className="text-fifth text-5xl font-bold tracking-wider -mt-2">{t.goals}</h2>
      </div>

      {/* Cards Container */}
      <div className="relative w-full h-full">
        {localizedGoals.map((goal, index) => (
          <div
            key={goal.id}
            ref={el => cardsRef.current[index] = el}
            className="rounded-[20px] overflow-hidden shadow-2xl"
            style={{ 
              background: 'linear-gradient(135deg, #1a1a1a 0%, #111111 100%)',
              border: '1px solid rgba(201, 181, 156, 0.2)'
            }}
          >
            <div className={`grid grid-cols-1 md:grid-cols-2 h-full ${
              goal.imagePosition === 'right' ? 'md:flex-row-reverse' : ''
            }`}>
              {/* Image Side */}
              <div className={`relative h-full min-h-[300px] md:min-h-0 overflow-hidden ${
                goal.imagePosition === 'right' ? 'md:order-2' : 'md:order-1'
              }`}>
                <img 
                  src={goal.image} 
                  alt={goal.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-fourth/50" />

                {/* Decorative Target Icon */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 opacity-20">
                  
                </div>
              </div>

              {/* Content Side */}
              <div className={`flex flex-col justify-center p-8 md:p-12 ${lang === 'ar' ? 'text-right' : 'text-left'} ${
                goal.imagePosition === 'right' ? 'md:order-1' : 'md:order-2'
              }`}>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-main/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-6 h-6 text-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-main">
                    {goal.title}
                  </h3>
                </div>

                <div className="w-16 h-1 bg-main/30 mb-6" />

                <p className="text-second text-lg leading-relaxed">
                  {goal.description}
                </p>

                <div className="mt-8 flex items-center gap-2 text-main/40 text-sm">
                  <span className="w-8 h-[1px] bg-main/40" />
                  <span>0{goal.id} / 0{goalsData.length}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GoalsCards;