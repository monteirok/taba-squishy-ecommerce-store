import { Heart } from "lucide-react";
import { Link } from "wouter";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="py-16 px-4">
      <div className="container mx-auto">
        {/* Newsletter Section */}
        <GlassCard variant="strong" className="p-12 text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Stay Squeezed In!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Get the latest updates on new arrivals, exclusive discounts, and stress-relief tips delivered to your inbox.
          </p>
          
          <div className="max-w-md mx-auto flex space-x-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 glass border-0 focus:ring-2 focus:ring-primary"
            />
            <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              Subscribe
            </Button>
          </div>
          
          <p className="text-gray-500 text-sm mt-4">
            No spam, unsubscribe at any time.
          </p>
        </GlassCard>

        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 liquid-gradient rounded-xl flex items-center justify-center">
                <Heart className="text-white text-lg" fill="currentColor" />
              </div>
              <span className="text-2xl font-bold text-gray-800 dark:text-white">
                taba squishy
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Bringing joy and comfort through premium squishy toys that help you relax, focus, and find your happy place.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="glass hover:glass-strong transition-all duration-300 rounded-full h-10 w-10 p-0"
              >
                <i className="fab fa-instagram text-gray-600 dark:text-gray-300" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="glass hover:glass-strong transition-all duration-300 rounded-full h-10 w-10 p-0"
              >
                <i className="fab fa-tiktok text-gray-600 dark:text-gray-300" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="glass hover:glass-strong transition-all duration-300 rounded-full h-10 w-10 p-0"
              >
                <i className="fab fa-youtube text-gray-600 dark:text-gray-300" />
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Reviews
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            © 2024 Taba Squishy Store. All rights reserved. Made with ❤️ for stress relief.
          </p>
        </div>
      </div>
    </footer>
  );
}
