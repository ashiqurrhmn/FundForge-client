"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Star } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Mike Thomas",
    date: "July 7, 2025",
    image: "/assets/testimonial-1 (1).jpg",
    quote: "Great experience! Super informative meeting. He took the time to go over everything in detail and made sure to answer all my questions. Would highly recommend.",
    rotation: "-rotate-2 mt-4"
  },
  {
    id: 2,
    name: "Anonymous",
    date: "July 2025",
    image: "/assets/testimonial-2.jpg",
    quote: "I would highly recommend FundForge to anyone looking to have their project properly and professionally funded. Thank you for a job well done!",
    rotation: "rotate-2 mb-4"
  },
  {
    id: 3,
    name: "Sue Rebello",
    date: "July 3, 2025",
    image: "/assets/testimonial-5.jpg",
    quote: "We recently had our campaign funded, and the entire experience was exceptional from start to finish. The project was scheduled efficiently—something that's become all too rare these days! They were professional, courteous, and incredibly mindful.",
    rotation: "-rotate-1 mt-2"
  },
  {
    id: 4,
    name: "David Kim",
    date: "August 12, 2025",
    image: "/assets/testimonial-4 (1).jpg",
    quote: "From setting up the campaign to receiving the final funds, the entire process was seamless and transparent.",
    rotation: "rotate-1 mt-4"
  }
];

export function TestimonialSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-neutral-50 dark:bg-[#0a0a0a]  dark:border-neutral-900">
      <motion.div
        initial={{ opacity: 0, scale: 1.15, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        viewport={{ amount: 0.2 }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 px-4">
            <motion.p 
              initial={{ opacity: 0, y: 30, scale: 1.2 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ amount: 0.5 }}
              transition={{
                duration: 0.7,
                delay: 0.2,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="text-emerald-500 font-bold uppercase tracking-[0.25em] text-xs mb-3"
            >
              Customer Testimonials
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 30, scale: 1.3 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ amount: 0.5 }}
              transition={{
                duration: 0.7,
                delay: 0.3,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="text-3xl md:text-5xl font-black text-neutral-900 dark:text-white mb-4"
            >
              What They're Saying
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 30, scale: 1.2 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ amount: 0.5 }}
              transition={{
                duration: 0.7,
                delay: 0.4,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto text-sm"
            >
              Hear from the community of creators and backers making ideas a reality.
            </motion.p>
          </div>

          <div className="max-w-6xl mx-auto relative px-4">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={40}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              pagination={{ 
                clickable: true,
              }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              className="pb-25"
            >
              {TESTIMONIALS.map((testimonial, index) => (
                <SwiperSlide key={testimonial.id} className="h-auto px-2 py-10">
                  <motion.div 
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ amount: 0.2 }}
                    transition={{ 
                      duration: 0.7, 
                      delay: 0.5 + (index * 0.15), 
                      ease: [0.25, 0.1, 0.25, 1] 
                    }}
                    className={`h-full ${testimonial.rotation} transition-transform hover:rotate-0 duration-300`}
                  >
                  <div className={`bg-white dark:bg-neutral-900/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl h-full flex flex-col border border-neutral-200 dark:border-neutral-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]`}>
                    
                    {/* Stars */}
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                      ))}
                    </div>
                    
                    <p className={`text-sm md:text-base text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed mb-8 flex-1 italic`}>
                      "{testimonial.quote}"
                    </p>
                    
                    {/* Divider */}
                    <div className="w-16 h-px bg-neutral-200 dark:bg-neutral-800 mb-6" />
                    
                    <div className="flex items-center gap-4 mt-auto">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-lg shrink-0 relative overflow-hidden`}>
                        <Image src={testimonial.image} alt={testimonial.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-neutral-900 dark:text-white text-sm">
                          {testimonial.name}
                        </h4>
                        <p className="text-xs text-neutral-500 font-medium tracking-wide mt-1">
                          {testimonial.date}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background-color: #737373 !important;
          opacity: 0.5 !important;
        }
        .swiper-pagination-bullet-active {
          background-color: #10b981 !important;
          width: 24px;
          border-radius: 8px;
          opacity: 1 !important;
        }
      `}} />
      </motion.div>
    </section>
  );
}
