import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import logo from "../assets/logo.png";
import languageData from '../language.json';
import AnimatedLink from '../components/AnimatedLink';

function MobileNav({ lang, toggleLang }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const t = languageData[lang].nav;

  const menuRef = useRef();
  const line1Ref = useRef();
  const line2Ref = useRef();
  const line3Ref = useRef();

  // ✅ handle toggle properly
  const toggleMenu = () => {
    if (isOpen) {
      setIsServicesOpen(false); // reset services when closing
    }
    setIsOpen(prev => !prev);
  };

  useGSAP(() => {
    if (isOpen) {
      // 👉 OPEN MENU
      gsap.to(menuRef.current, {
        x: 0,
        duration: 0.6,
        ease: "power4.inOut"
      });

      // Burger → X
      gsap.to(line1Ref.current, {
        rotation: 45,
        y: 8,
        duration: 0.3,
        ease: "power2.inOut"
      });

      gsap.to(line2Ref.current, {
        opacity: 0,
        duration: 0.2
      });

      gsap.to(line3Ref.current, {
        rotation: -45,
        y: -8,
        duration: 0.3,
        ease: "power2.inOut"
      });

      // Links stagger
      gsap.from(".mobile-link", {
        x: 40,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.3
      });

    } else {
      // 👉 CLOSE MENU
      gsap.to(menuRef.current, {
        x: "-100%",
        duration: 0.5,
        ease: "power4.inOut"
      });

      // X → Burger
      gsap.to(line1Ref.current, {
        rotation: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.inOut"
      });

      gsap.to(line2Ref.current, {
        opacity: 1,
        duration: 0.3
      });

      gsap.to(line3Ref.current, {
        rotation: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.inOut"
      });
    }
  }, { dependencies: [isOpen] });

  return (
    <div className="md:hidden absolute top-5 left-0 w-full z-[60] px-4 flex justify-between items-center">

      {/* Logo */}
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-2">
        <img src={logo} alt="Logo" className="h-8 object-contain" />
      </div>

      {/* Burger Button */}
      <button
        onClick={toggleMenu}
        className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex flex-col justify-center items-center gap-[6px] cursor-pointer z-[70]"
        aria-label="Toggle menu"
      >
        <span ref={line1Ref} className="block w-5 h-[2px] bg-white origin-center"></span>
        <span ref={line2Ref} className="block w-5 h-[2px] bg-white"></span>
        <span ref={line3Ref} className="block w-5 h-[2px] bg-white origin-center"></span>
      </button>

      {/* Slide-in Menu */}
      <div
        ref={menuRef}
        className="fixed top-0 left-0 h-[100dvh] w-[80vw] max-w-xs bg-black/90 backdrop-blur-xl border-r border-white/10 flex flex-col pt-24 px-8 z-[65]"
        style={{ transform: 'translateX(-100%)' }} // initial hidden
      >
        <p className="text-white/30 text-xs mb-10 tracking-widest uppercase">
          Menu
        </p>

        <ul className="flex flex-col gap-6 text-white font-semibold text-2xl">
          <li className="mobile-link" onClick={toggleMenu}>
            <AnimatedLink to="/" color="#111111" className="hover:text-main transition-colors duration-300">
              {t.Home}
            </AnimatedLink>
          </li>

          <li className="mobile-link" onClick={toggleMenu}>
            <AnimatedLink to="/about" color="#111111" className="hover:text-main transition-colors duration-300">
              {t.About}
            </AnimatedLink>
          </li>

          <li className="mobile-link">
            <button
              onClick={() => setIsServicesOpen(prev => !prev)}
              className="flex items-center gap-2 hover:text-main transition-colors duration-300 w-full text-left"
            >
              {t.Services}
              <span className={`text-base transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`}>
                ↓
              </span>
            </button>

            {/* Sub menu */}
            <ul
              className={`overflow-hidden transition-all duration-500 ease-in-out flex flex-col gap-3 pl-4 ${isServicesOpen
                  ? 'max-h-64 mt-4 opacity-100'
                  : 'max-h-0 opacity-0'
                }`}
            >
              {(() => {
                const serviceRoutes = ["/projects", "/portfolio", "/certifications", "/careers", "/profile"];
                return t.ServicesList.map((item, idx) => (
                  <li key={item} onClick={toggleMenu}>
                    <AnimatedLink
                      to={serviceRoutes[idx]}
                      color="#111111"
                      className="text-base text-white/60 hover:text-main transition-colors duration-300 block"
                    >
                      {item}
                    </AnimatedLink>
                  </li>
                ));
              })()}
            </ul>
          </li>

          <li className="mobile-link" onClick={toggleMenu}>
            <AnimatedLink to="/contact" color="#111111" className="hover:text-main transition-colors duration-300">
              {t.ContactUs}
            </AnimatedLink>
          </li>
        </ul>

        {/* Bottom */}
        <div className="mt-auto pb-10 flex flex-col gap-4">
          <button
            onClick={toggleLang}
            className="w-12 h-12 rounded-full border border-white/30 flex justify-center items-center text-white hover:bg-main hover:border-main transition-all duration-300 text-sm self-start"
          >
            {t.AR}
          </button>

          <a
            href="#"
            className="text-xs text-white/30 hover:text-white transition-colors duration-300"
          >
            {t.PrivacyTerms}
          </a>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[64] bg-black/20 backdrop-blur-sm"
          onClick={toggleMenu}
        />
      )}
    </div>
  );
}

export default MobileNav;