"use client";

import { motion } from "framer-motion";
import { Lightbulb, Rocket, Users } from "lucide-react";

const STEPS = [
  {
    id: 1,
    title: "Create Your Campaign",
    description: "Share your vision, set a funding goal, and build a compelling story to inspire backers around the world.",
    icon: Lightbulb,
  },
  {
    id: 2,
    title: "Build Your Community",
    description: "Launch your project and engage with early supporters. Spread the word and gain momentum.",
    icon: Users,
  },
  {
    id: 3,
    title: "Get Funded & Build",
    description: "Reach your goal, receive your funds securely, and start turning your dream project into reality.",
    icon: Rocket,
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-white dark:bg-black border-t border-neutral-100 dark:border-neutral-900">
      <motion.div
        initial={{ opacity: 0, scale: 1.15, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        viewport={{ amount: 0.2 }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20 px-4">
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
              The Process
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
              How It Works
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
              Start raising funds in three simple steps. We make it easy to connect with backers.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {STEPS.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  delay: 0.3 + (index * 0.15),
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="relative group"
              >
                {/* Connecting Line (Only visible on desktop between steps) */}
                {index !== STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-emerald-500/20 to-transparent z-0" />
                )}
                
                <div className="relative z-10 flex flex-col items-center text-center p-6 rounded-3xl transition-colors duration-300 hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                  {/* Icon Circle */}
                  <div className="w-24 h-24 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-8 relative group-hover:scale-110 transition-transform duration-500">
                    <step.icon className="w-10 h-10 text-emerald-500" />
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-emerald-500/30">
                      0{step.id}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-sm">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
