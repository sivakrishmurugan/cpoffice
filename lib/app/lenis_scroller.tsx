"use client";
import Lenis from "@studio-freight/lenis";
import { useEffect } from "react";

export const LenisScroller = () => {
  useEffect(() => {
    const lenis = new Lenis({ 
      duration: 2, 
      smoothTouch: false, 
      smoothWheel: false, 
      easing: (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
    });

    lenis.on("scroll", (e: any) => {
      // console.log(e);
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        //e.preventDefault();
        try { lenis.scrollTo(anchor.getAttribute('href'), { offset: -80 }) } catch(e) {console.log(e)}
      });
    })

    return () => {
      lenis.destroy();
    };
  }, []);

  return <></>;
};
