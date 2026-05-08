import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import image from "../assets/numbersImg.jpg";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import languageData from "../language.json";

gsap.registerPlugin(ScrollTrigger);


function CompanyNumbers({ lang }) {
  const container = useRef();
  const t = languageData[lang].companyNumbers;

  useGSAP(() => {
    // 🔥 Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
      }
    })

    // 👉 Image reveal
    tl.from(".imgCover", {
      clipPath: "inset(0 0 100% 0)",
      duration: 1,
      ease: "power4.inOut"
    })
    tl.from(".numberImg", {
      scale: 1.3,
      duration: 1,
      ease: "power4.inOut"
    }, '<')

      // 👉 Title
      .from(".title", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power4.out",
      }, "-=0.4")

      // 👉 Paragraph
      .from(".desc", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power4.out",
      }, "-=0.6")

      // 👉 Numbers counter
      .from(".numbers", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: "power4.out"
      }, "-=0.4");

    gsap.utils.toArray(".numbers").forEach((el) => {
      const targetValue = parseInt(el.innerText);
      const suffix = el.innerText.replace(/[0-9]/g, '');
      const obj = { value: 0 };

      // Initialize to 0 immediately to avoid jump
      el.innerText = "0" + suffix;

      tl.to(obj, {
        value: targetValue,
        duration: 2,
        ease: "power4.out",
        onUpdate: () => {
          el.innerText = Math.round(obj.value) + suffix;
        }
      }, "<"); // Starts at the same time as the .numbers fade-in
    });

  });

  return (
    <div
      ref={container}
      className="w-screen h-[150vh] bg-third md:flex md:justify-between md:items-center p-4 md:p-8 xl:p-20"
    >
      <div className="w-full md:w-1/2 h-full flex flex-col gap-16 items-center justify-center">

        <div className={`w-full flex flex-col items-center ${lang === 'ar' ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} text-center`}>
          <h3 className="title text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl font-semibold">
            {t.title}
          </h3>

          <p className="desc w-full md:w-[90%] lg:w-[80%] text-lg mt-4">
            {t.desc}
          </p>
        </div>

        <div className="flex justify-between w-full md:w-[90%] lg:w-[80%]">
          <div className="flex flex-col items-center">
            <p className="numbers text-4xl md:text-5xl xl:text-6xl font-semibold">150+</p>
            <p className="text-lg mt-4">{t.clients}</p>
          </div>

          <div className="flex flex-col items-center">
            <p className="numbers text-4xl md:text-5xl xl:text-6xl font-semibold">5</p>
            <p className="text-lg mt-4">{t.years}</p>
          </div>
        </div>

      </div>

      <div className="imgCover hidden md:flex md:w-[50%] lg:w-[40%] xl:w-[30%] aspect-[2/3] justify-center items-center overflow-hidden">
        <img src={image} className="numberImg h-full w-auto object-cover" alt="" />
      </div>
    </div>
  );
}

export default CompanyNumbers;