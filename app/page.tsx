"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { PageTransition } from "@/components/page-transition";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FeaturedCarousel } from "@/components/featured-carousel";
import { TestimonialSection } from "@/components/testimonial-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { CategoriesSection } from "@/components/categories-section";
import { StatsSection } from "@/components/stats-section";

const SLIDES = [
  {
    image: "/assets/hero-10.png",
    imageWrapperClassName: "w-[95%] md:w-[50%]",
    number: "01",
    subtitle: "THE MISSION",
    tagline: "THE STANDARD",
    headline: "FUNDFORGE",
    mission:
      "WE EMPOWER CREATORS WITH THE TOOLS, COMMUNITY, AND FUNDING THEY NEED TO BRING BOLD IDEAS TO LIFE.",
    quote: "DREAM BIG, FUND BIGGER. YOUR VISION STARTS HERE.",
    cta: { text: "EXPLORE CAMPAIGNS", href: "/explore" },
    metrics: [
      { label: "CAMPAIGNS", value: "500+" },
      { label: "FUNDED", value: "$2.4M+" },
      { label: "CREATORS", value: "10K+" },
    ],
    bottomTag: "NO LIMITS.\nONLY IMPACT.",
  },
  {
    image: "/assets/hero-11.png",
    imageWrapperClassName: "w-[95%] md:w-[50%]",
    number: "02",
    subtitle: "THE VISION",
    tagline: "THE MOVEMENT",
    headline: "CROWDFUND",
    mission:
      "DISCOVER INSPIRING CAMPAIGNS FROM CREATORS AROUND THE WORLD. FUND THE IDEAS YOU BELIEVE IN.",
    quote: "EVERY GREAT PROJECT STARTS WITH ONE SUPPORTER. BE THAT ONE.",
    cta: { text: "START A CAMPAIGN", href: "/creator/dashboard/create" },
    metrics: [
      { label: "BACKERS", value: "50K+" },
      { label: "PROJECTS", value: "1.2K+" },
      { label: "COUNTRIES", value: "45+" },
    ],
    bottomTag: "NO SHORTCUTS.\nONLY GROWTH.",
  },
  {
    image: "/assets/hero-13.png",
    imageWrapperClassName: "w-[85%] md:w-[42%]",
    number: "03",
    subtitle: "THE IMPACT",
    tagline: "THE FUTURE",
    headline: "INNOVATE",
    mission:
      "JOIN A GLOBAL COMMUNITY OF BACKERS AND CREATORS BUILDING THE NEXT GENERATION OF PRODUCTS.",
    quote: "TOGETHER, WE CAN MAKE THE IMPOSSIBLE, POSSIBLE.",
    cta: { text: "JOIN NOW", href: "/signup" },
    metrics: [
      { label: "BACKERS", value: "100K+" },
      { label: "RAISED", value: "$10M+" },
      { label: "SUCCESS", value: "95%" },
    ],
    bottomTag: "NO EXCUSES.\nONLY RESULTS.",
  },
];

const SLIDE_DURATION = 7000;

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [allCampaigns, setAllCampaigns] = useState<any[]>([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns`);
        const json = await res.json();
        if (json.success) {
          setAllCampaigns(json.data);
          // Sort by raisedCredits and take top 5 for featured
          const sorted = [...json.data].sort((a: any, b: any) => (b.raisedCredits || 0) - (a.raisedCredits || 0));
          setCampaigns(sorted.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to fetch featured campaigns", err);
      }
    };
    fetchCampaigns();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = SLIDES[currentSlide];

  return (
    <PageTransition className="flex flex-col flex-1 bg-white dark:bg-black font-sans min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <div className="relative w-full min-h-[calc(100vh-64px)] bg-white dark:bg-[#0a0a0a] overflow-hidden flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 1.15, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ amount: 0.2 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
        {/* Giant Watermark Text Behind Everything */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`watermark-${currentSlide}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-x-0 top-[12%] md:top-[15%] flex justify-center pointer-events-none select-none z-[1]"
          >
            <h2 className="text-[12vw] md:text-[14vw] font-black text-transparent bg-clip-text bg-gradient-to-b from-neutral-300 to-white dark:from-white/[0.04] dark:to-white/[0.04] tracking-[0.05em] leading-none whitespace-nowrap uppercase">
              {slide.headline}
            </h2>
          </motion.div>
        </AnimatePresence>

        {/* Center Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`image-${currentSlide}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0 z-[2] flex items-end justify-center"
          >
            <div className={`relative h-[100%] ${slide.imageWrapperClassName}`}>
              <Image
                src={slide.image}
                alt="Hero"
                fill
                className="object-contain object-center md:object-bottom drop-shadow-[0_30px_30px_rgba(255,255,255,1)] dark:drop-shadow-[0_30px_30px_rgba(0,0,0,1)]"
                priority
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlays for edges */}
        <div className="absolute inset-y-0 left-0 w-[35%] bg-gradient-to-r from-white via-white/70 dark:from-[#0a0a0a] dark:via-[#0a0a0a]/70 to-transparent z-[3] pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-[35%] bg-gradient-to-l from-white via-white/70 dark:from-[#0a0a0a] dark:via-[#0a0a0a]/70 to-transparent z-[3] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-[60vh] md:h-32 bg-gradient-to-t from-white dark:from-[#0a0a0a] via-white/80 dark:via-[#0a0a0a]/80 md:via-transparent to-transparent z-[3] pointer-events-none" />

        {/* Vertical Side Text (Far Left) */}
        <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-[5] hidden 2xl:block">
          <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-[0.3em] [writing-mode:vertical-lr] rotate-180">
            FUNDFORGE
          </p>
        </div>

        {/* container wrapper for text content */}
        <div className="absolute inset-0 w-full container mx-auto pointer-events-none z-[10]">
          {/* LEFT CONTENT */}
          <div className="absolute left-4 right-4 md:right-auto bottom-24 top-auto md:bottom-auto md:top-[60%] md:-translate-y-1/2 z-[5] md:max-w-xs pointer-events-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={`left-${currentSlide}`}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <p className="text-xs md:text-sm font-black text-neutral-900 dark:text-white uppercase tracking-[0.2em] mb-5">
                  {slide.subtitle}
                </p>
                <p className="text-[10px] md:text-xs text-neutral-600 dark:text-neutral-400 font-bold uppercase tracking-wider leading-relaxed mb-8">
                  {slide.mission}
                </p>

                {/* Accent Line */}
                <div className="w-10 h-[3px] bg-emerald-500 mb-8" />

                <p className="text-[10px] md:text-xs text-neutral-700 dark:text-neutral-500 font-bold uppercase tracking-wider leading-relaxed mb-8">
                  {slide.quote}
                </p>

                <Link
                  href={slide.cta.href}
                  className="inline-flex items-center gap-3 px-6 py-3 border-2 border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600 hover:border-emerald-600 dark:bg-transparent dark:border-emerald-500 dark:text-emerald-500 dark:hover:bg-emerald-500 dark:hover:text-black text-xs font-black uppercase tracking-[0.15em] rounded-md transition-all group"
                >
                  {slide.cta.text}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT CONTENT */}
          <div className="absolute right-4 top-[60%] -translate-y-1/2 z-[5] text-right hidden md:block pointer-events-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={`right-${currentSlide}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {/* Slide Number */}
                <p className="text-7xl lg:text-8xl font-black text-neutral-100 dark:text-white/10 leading-none mb-2">
                  {slide.number}
                </p>
                <p className="text-xs font-black text-emerald-500 uppercase tracking-[0.2em] mb-12">
                  {slide.tagline}
                </p>

                {/* Key Metrics */}
                <div className="mb-12">
                  <p className="text-xs font-black text-neutral-900 dark:text-white uppercase tracking-[0.2em] mb-5">
                    KEY METRICS
                  </p>
                  <div className="space-y-3">
                    {slide.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="flex items-center justify-end gap-8"
                      >
                        <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                          {metric.label}
                        </span>
                        <span className="text-sm font-black text-neutral-900 dark:text-white w-16 text-right">
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Tag */}
                <p className="text-xs font-black text-neutral-600 dark:text-white uppercase tracking-wider leading-relaxed whitespace-pre-line">
                  {slide.bottomTag}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Slide Indicators */}
          <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-[5] flex items-center gap-3 pointer-events-auto">
            {SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className="relative h-1 rounded-full overflow-hidden transition-all duration-300"
                style={{ width: index === currentSlide ? "48px" : "24px" }}
              >
                <div className="absolute inset-0 bg-neutral-200 dark:bg-white/20 rounded-full" />
                {index === currentSlide && (
                  <motion.div
                    className="absolute inset-0 bg-emerald-500 rounded-full origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: SLIDE_DURATION / 1000,
                      ease: "linear",
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
        </motion.div>
      </div>

      {/* Featured Campaigns Section */}
      {campaigns.length > 0 && (
        <FeaturedCarousel campaigns={campaigns} />
      )}
      
      {/* How It Works */}
      <HowItWorksSection />
      
      {/* Categories */}
      <CategoriesSection campaigns={allCampaigns} />
      
      {/* Stats */}
      <StatsSection />
      
      {/* Testimonials */}
      <TestimonialSection />
    </PageTransition>
  );
}
