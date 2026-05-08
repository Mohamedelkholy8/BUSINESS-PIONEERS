import { useState, useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import SplitText from "gsap/SplitText";
import CompanyNumbers from './home/CompanyNumbers';
import GoalsCards from './GoalsCards';
import Footer from './Footer';
import './App.css'
import { ScrollTrigger } from "gsap/ScrollTrigger";
// ScrollSmoother requires ScrollTrigger
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(SplitText, ScrollTrigger, ScrollSmoother);

import supabase from './lib/supabase.js'
import bgimage from './assets/landingBg.jpeg'
import Nav from './nav/Nav.jsx';
import MobileNav from './nav/MobileNav.jsx';
import languageData from './language.json';

function App() {
  const [lang, setLang] = useState('en');
  const t = languageData[lang];

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'ar' : 'en');
  };

  console.log(supabase)
  const [blogs, setBlogs] = useState([])
  useEffect(() => {
    const fetchBlogs = async () => {
      const { data } = await supabase.from('product').select()
      if (data) {
        setBlogs(data)
        console.log(data)
      } else {
        console.error('Error fetching blogs:', data)
      }
    }
    fetchBlogs()
  }, [])

  const containerRef = useRef();
  const counterRef = useRef();
  const loaderRef = useRef();

  const [loading, setLoading] = useState(true);

  // 1. Initial Entrance Animation (Runs once)
  useGSAP(() => {
    ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 0.5,
      effects: true
    });
    const obj = { value: 0 };
    let tl = gsap.timeline({
      onComplete: () => setLoading(false)
    });
    const split = new SplitText(".heroTitle", { type: "words" });

    tl.to(obj, {
      value: 100,
      duration: 5,
      ease: "power4.inOut",
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = `${Math.round(obj.value)}%`;
        }
      }
    })
    tl.to(loaderRef.current, {
      yPercent: -100,
      duration: 1.5,
      ease: "power4.inOut"
    })
    tl.from('.hero', {
      duration: 1.5,
      scale: 1.2,
      ease: "power4.inOut"
    }, "<")
    tl.from('.nav-container', {
      y: -80,
      delay: 1,
      opacity: 0,
      duration: 0.5,
      ease: "power4.out"
    }, "<")
    tl.from('.nav-inner', {
      width: "70px",
      duration: 1.2,
      ease: "power4.inOut",
      clearProps: "width"
    }, "-=0.8")
    tl.from('.nav-links, .nav-lang', {
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "+=0.2")
    tl.from(split.words, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power4.out",
      stagger: 0.05
    }, "-=2");
    tl.from('.heroP', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power4.out",
    }, '-=1.85');
    tl.from('.heroButtons', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power4.out",
    }, '<');


  }, { scope: containerRef });

  // 2. Content Animation (Runs on language switch)
  useGSAP(() => {

  }, { scope: containerRef, dependencies: [lang] });

  return (
    <div ref={containerRef} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <MobileNav lang={lang} toggleLang={toggleLang} />
      <div className="hidden md:block"><Nav lang={lang} toggleLang={toggleLang} /></div>
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className='h-[100dvh] w-full flex justify-center items-center relative overflow-hidden'>
          <div className={`w-full h-[100dvh] absolute top-0 left-0 z-[5] hero bg-cover bg-center flex flex-col justify-center items-center md:justify-end md:items-start`}
            style={{ backgroundImage: `url(${bgimage})` }}
          >
            <div className='relative z-20 flex flex-col items-center text-center px-4 md:items-start md:text-start md:ms-4 md:mb-20 heroText'>
              <h2 className='heroTitle text-[3rem] md:text-[4rem] xl:text[5rem] text-fifth font-bold'>
                {t.hero.title}
                <span className='font-serif italic bg-gradient-to-r from-[#C9B59C] via-[#D9CFC7] to-[#EFE9E3] bg-clip-text text-transparent'>
                  {t.hero.pioneers}
                </span>
                <br />
                {t.hero.holding}
              </h2>
              <p className='text-second text-xl md:text-2xl mt-4 mb-8 max-w-2xl heroP'>{t.hero.subtitle}</p>
              <div className='flex gap-5 heroButtons'>
                <button className='btn-premium btn-shopping text-fifth bg-main p-3 pl-8 pr-8 rounded-full cursor-pointer font-semibold'>{t.hero.shopping}</button>
                <button className='btn-premium btn-contact text-second bg-fourth p-3 pl-8 pr-8 rounded-full cursor-pointer font-semibold'>{t.hero.contact}</button>
              </div>
            </div>
            <div className="absolute inset-0 bg-black/40 z-10"></div>

          </div>
          {loading && (
            <div ref={loaderRef} className='w-full h-[100dvh] bg-black text-main absolute top-0 left-0 z-50'>
              <div
                ref={counterRef}
                className='absolute bottom-4 left-4 text-[6rem] md:text-[10rem] text-white bg-black leading-none'
              >
                0%
              </div>
            </div>
          )}
        </div>
        <CompanyNumbers lang={lang} />
        <GoalsCards lang={lang} />
        <Footer lang={lang} />
        </div>
      </div>
    </div>
  );
}

export default App;
