import React from 'react';
import { motion } from 'framer-motion';
import { Meteors } from '@/components/ui/meteors';

const Footer = () => {
  return (
    <footer className="relative w-full border-t border-border/50 bg-background overflow-hidden">
      {/* Meteors Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Meteors number={30} minDelay={0.2} maxDelay={1.5} minDuration={3} maxDuration={12} />
      </div>

      <div className="relative w-full py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center w-full"
        >
          <h2 className="text-7xl md:text-8xl lg:text-9xl xl:text-[12rem] font-bold tracking-tight w-full">
            Deplofiy
          </h2>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

