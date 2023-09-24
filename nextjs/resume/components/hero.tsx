'use client'
import React, {useEffect} from 'react';
import VideoThumb from '@/public/images/hero-image-01.jpg'
import ModalVideo from '@/components/modal-video'

export default function Hero() {
  useEffect(() => {
    const setHeroHeight = () => {
      const heroSection = document.getElementById('hero_section');
      if (heroSection) {
        heroSection.style.minHeight = `${window.innerHeight}px`;
      }
    };

    // Set initial height
    setHeroHeight();

    // Update on resize
    window.addEventListener('resize', setHeroHeight);

    // Cleanup
    return () => {
      window.removeEventListener('resize', setHeroHeight);
    };
  }, []);
  return (
    <section id="hero_section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">

        {/* Illustration behind hero content */}
        <div className="absolute left-0 bottom-0 -ml-20 hidden lg:block pointer-events-none" aria-hidden="true" data-aos="fade-up" data-aos-delay="400">
          <svg className="max-w-full" width="564" height="552" viewBox="0 0 564 552" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="illustration-02" x1="-3.766" y1="300.204" x2="284.352" y2="577.921" gradientUnits="userSpaceOnUse">
                <stop stopColor="#5D5DFF" stopOpacity=".01" />
                <stop offset="1" stopColor="#5D5DFF" stopOpacity=".32" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Hero content */}
        <div className="relative pt-56 pb-24 md:pt-72 md:pb-32">

          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <h1 className="h1 mb-4" data-aos="fade-up">Never write a resume again.</h1>
            <p className="text-xl text-gray-400 mb-8" data-aos="fade-up" data-aos-delay="200">Automatically write your resumes, cover letters, and job application questions with your personalized AI job assistant. Tailored for specific jobs and ATS-optimized.</p>
            <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center">
              <div data-aos="fade-up" data-aos-delay="400">
                <a className="btn text-white bg-purple-600 hover:bg-purple-700 w-full mb-4 sm:w-auto sm:mb-0" href="#upload_section">Get Started</a>
              </div>
              <div data-aos="fade-up" data-aos-delay="600">
                <a className="btn text-white bg-gray-700 hover:bg-gray-800 w-full sm:w-auto sm:ml-4" href="#0">Learn more</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
