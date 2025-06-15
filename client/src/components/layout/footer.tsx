import { Heart } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="py-16 px-4">
      <div className="container mx-auto">
        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard variant="strong" className="p-12 text-center mb-16">
            <motion.h2 
              className="text-3xl font-bold text-gray-800 dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Stay Squeezed In!
            </motion.h2>
            <motion.p 
              className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Get the latest updates on new arrivals, exclusive discounts, and stress-relief tips delivered to your inbox.
            </motion.p>
            
            <motion.div 
              className="max-w-md mx-auto flex space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div 
                className="flex-1"
                whileFocus={{ scale: 1.02 }}
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="glass border-0 focus:ring-2 focus:ring-primary transition-all duration-300"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-300">
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                  >
                    Subscribe
                  </motion.span>
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.p 
              className="text-gray-500 text-sm mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              No spam, unsubscribe at any time.
            </motion.p>
          </GlassCard>
        </motion.div>

        {/* Footer Content */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.div 
              className="flex items-center space-x-2 mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                className="w-10 h-10 liquid-gradient rounded-xl flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Heart className="text-white text-lg" fill="currentColor" />
                </motion.div>
              </motion.div>
              <span className="text-2xl font-bold text-gray-800 dark:text-white">
                taba squishy
              </span>
            </motion.div>
            <motion.p 
              className="text-gray-600 dark:text-gray-300 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Bringing joy and comfort through premium squishy toys that help you relax, focus, and find your happy place.
            </motion.p>
            <motion.div 
              className="flex space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              {['instagram', 'tiktok', 'youtube'].map((social, index) => (
                <motion.div
                  key={social}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="glass hover:glass-strong transition-all duration-300 rounded-full h-10 w-10 p-0"
                  >
                    <motion.span
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.3 }}
                      className="inline-block"
                    >
                      <i className={`fab fa-${social} text-gray-600 dark:text-gray-300`} />
                    </motion.span>
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Footer Links Columns */}
          {[
            {
              title: "Quick Links",
              links: [
                { href: "/about", text: "About Us" },
                { href: "/contact", text: "Contact" },
                { href: "/blog", text: "Blog" },
                { href: "/reviews", text: "Reviews" }
              ]
            },
            {
              title: "Support", 
              links: [
                { href: "/help", text: "Help Center" },
                { href: "/shipping", text: "Shipping Info" },
                { href: "/returns", text: "Returns" },
                { href: "/size-guide", text: "Size Guide" }
              ]
            },
            {
              title: "Legal",
              links: [
                { href: "/privacy", text: "Privacy Policy" },
                { href: "/terms", text: "Terms of Service" },
                { href: "/cookies", text: "Cookie Policy" }
              ]
            }
          ].map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + sectionIndex * 0.1 }}
            >
              <motion.h3 
                className="text-lg font-semibold text-gray-800 dark:text-white mb-6"
                whileHover={{ scale: 1.05 }}
              >
                {section.title}
              </motion.h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + sectionIndex * 0.1 + linkIndex * 0.05 }}
                  >
                    <motion.div
                      whileHover={{ x: 5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link 
                        href={link.href} 
                        className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors inline-block"
                      >
                        {link.text}
                      </Link>
                    </motion.div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="border-t border-gray-200 dark:border-gray-700 pt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.p 
            className="text-gray-600 dark:text-gray-300"
            whileHover={{ scale: 1.02 }}
          >
            © 2024 Taba Squishy Store. All rights reserved. Made with ❤️ for stress relief.
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
}
