import { useState } from 'react';
import AnimatedLink from '../components/AnimatedLink';
import logo from "../assets/logo.png";
import languageData from '../language.json';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { Observer } from "gsap/Observer";

gsap.registerPlugin(Observer);
function Nav({ lang, toggleLang }) {
  const [isServicesHovered, setIsServicesHovered] = useState(false);
  const t = languageData[lang].nav;

  useGSAP(() => {
  function down() {
    gsap.to(".nav-container", {
      y: -100,
      duration: 0.6,
      ease: "power4.out",
    });
  }

  function up() {
    gsap.to(".nav-container", {
      y: 0,
      duration: 0.6,
      ease: "power4.out",
    });
  }

  Observer.create({
    type: "wheel",
    tolerance: 40,
    onUp: up,
    onDown: down,
  });
}, []);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-[80%] nav-container flex justify-center">
      <div
        className={`nav-inner bg-black/40 backdrop-blur-md border border-white/10 transition-all duration-500 ease-in-out overflow-hidden flex flex-col w-full rounded-[35px] ${isServicesHovered ? ' max-h-[500px]' : ' max-h-[70px]'}`}
        onMouseLeave={() => setIsServicesHovered(false)}
      >
        {/* Main Nav Bar */}
        <div className="flex justify-start items-center px-[15px] md:px-4 h-[70px] relative w-full">
          {/* Logo */}
          <div className="nav-logo flex-shrink-0 flex items-center justify-center h-fit z-10 bg-white rounded-full">
            <img src={logo} alt="Logo" className="h-10 object-contain" />
          </div>

          {/* Links */}
          <div className="nav-links hidden md:flex overflow-hidden whitespace-nowrap h-full items-center absolute left-1/2 -translate-x-1/2 z-10">
            <ul className="flex text-white gap-10 font-semibold items-center h-full">
              <li><AnimatedLink to="/" color="#111111" className="hover:text-main transition-colors duration-300">{t.Home}</AnimatedLink></li>
              <li><AnimatedLink to="/about" color="#111111" className="hover:text-main transition-colors duration-300">{t.About}</AnimatedLink></li>
              <li
                className="hover:text-main transition-colors duration-300 cursor-pointer h-full flex items-center"
                onMouseEnter={() => setIsServicesHovered(true)}
              >
                {t.Services} <span className={`ml-3 transition-all duration-500 ${isServicesHovered ? 'rotate-[-180deg]' : ''}`}>↓</span>
              </li>
              <li><AnimatedLink to="/contact" color="#111111" className="hover:text-main transition-colors duration-300">{t.ContactUs}</AnimatedLink></li>
            </ul>
          </div>

          {/* Language Button */}
          <div className="nav-lang flex-shrink-0 flex items-center h-full absolute right-[15px] md:right-8 rtl:right-auto rtl:left-[15px] md:rtl:left-8 z-10">
            <button
              onClick={toggleLang}
              className="w-10 h-10 rounded-full border border-white/30 flex justify-center items-center text-white hover:bg-main hover:border-main transition-all duration-300 text-sm"
            >
              {t.AR}
            </button>
          </div>
        </div>

        {/* Expanded Services Menu */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 px-10 transition-all duration-500 ease-in-out ${isServicesHovered ? 'max-h-[300px] opacity-100 py-8 border-t border-white/10' : 'max-h-0 opacity-0 py-0 border-t-0 border-transparent'}`}
        >
          {(() => {
            const serviceRoutes = ["/projects", "/portfolio", "/certifications", "/careers", "/profile"];
            return (
              <>
                <div>
                  <ul className="text-white space-y-4">
                    {t.ServicesList.slice(0, 3).map((item, idx) => (
                      <li key={item} onClick={() => setIsServicesHovered(false)}>
                        <AnimatedLink to={serviceRoutes[idx]} color="#111111" className="hover:text-main transition-colors duration-300 block">
                          {item}
                        </AnimatedLink>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col justify-between">
                  <ul className="text-white space-y-4">
                    {t.ServicesList.slice(3).map((item, idx) => (
                      <li key={item} onClick={() => setIsServicesHovered(false)}>
                        <AnimatedLink to={serviceRoutes[idx + 3]} color="#111111" className="hover:text-main transition-colors duration-300 block">
                          {item}
                        </AnimatedLink>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-6 mt-2">
                    <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors duration-300">{t.PrivacyTerms}</a>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

export default Nav;