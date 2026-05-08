import { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import Nav from './nav/Nav.jsx';
import MobileNav from './nav/MobileNav.jsx';
import Footer from './Footer';
import languageData from './language.json';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

function UserLayout() {
  const [lang, setLang] = useState('en');
  const t = languageData[lang];
  const location = useLocation();
  const containerRef = useRef();
  const smootherRef = useRef();

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'ar' : 'en');
  };

  useGSAP(() => {
    // Initialize ScrollSmoother
    smootherRef.current = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 0.5,
      effects: true
    });

    // Nav Entrance Animation (Only on Home Page)
    if (location.pathname === '/') {
      const tl = gsap.timeline({ delay: 5.5 }); // Wait for loader
      tl.from('.nav-container', {
        y: -80,
        opacity: 0,
        duration: 0.8,
        ease: "power4.out"
      })
      .from('.nav-inner', {
        width: "70px",
        duration: 1.2,
        ease: "power4.inOut",
        clearProps: "width"
      }, "-=0.4")
      .from('.nav-links, .nav-lang', {
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "+=0.2"); // Start much later, near the end of the expansion
    } else {
      // If not on home, just show it
      gsap.set('.nav-container', { y: 0, opacity: 1 });
    }

    // On every route change, scroll to top
    smootherRef.current.scrollTo(0);
  }, { dependencies: [location.pathname] });

  return (
    <div ref={containerRef} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <MobileNav lang={lang} toggleLang={toggleLang} />
      <div className="hidden md:block">
        <Nav lang={lang} toggleLang={toggleLang} />
      </div>

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Outlet context={{ lang, t, toggleLang }} />
          <Footer lang={lang} />
        </div>
      </div>
    </div>
  );
}

export default UserLayout;
