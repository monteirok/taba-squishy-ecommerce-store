import { motion } from "framer-motion";
import { Heart, Shield, Truck, Award, Users, Sparkles } from "lucide-react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass/liquid-glass-card";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Heart,
    title: "Stress Relief Focused",
    description: "Every product is carefully selected to provide maximum stress relief and comfort during challenging times.",
    color: "from-pink-500 to-rose-500"
  },
  {
    icon: Shield,
    title: "Premium Quality",
    description: "We source only the highest quality materials that are safe, durable, and tested for long-lasting enjoyment.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    description: "Get your stress relief products quickly with our expedited shipping options and careful packaging.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Award,
    title: "Customer Satisfaction",
    description: "Our 100% satisfaction guarantee ensures you love your purchase or we'll make it right.",
    color: "from-purple-500 to-violet-500"
  }
];

const stats = [
  { number: "50,000+", label: "Happy Customers" },
  { number: "10,000+", label: "Products Sold" },
  { number: "99.8%", label: "Satisfaction Rate" },
  { number: "24/7", label: "Customer Support" }
];

const teamMembers = [
  {
    name: "Sarah Chen",
    role: "Founder & CEO",
    description: "Passionate about mental health and bringing joy through kawaii culture.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
  },
  {
    name: "Marcus Johnson",
    role: "Product Curator",
    description: "Expert in stress relief products with 10+ years of therapeutic experience.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
  },
  {
    name: "Emily Rodriguez",
    role: "Customer Experience",
    description: "Dedicated to ensuring every customer has an amazing shopping experience.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
  }
];

export default function About() {
  return (
    <div className="min-h-screen p-6 pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-block p-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white mb-6"
          >
            <Sparkles className="h-12 w-12" />
          </motion.div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-6">
            About KawaiiStress
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We believe that everyone deserves moments of joy and calm in their daily lives. 
            Our mission is to bring you the most adorable and effective stress relief products 
            that combine kawaii culture with therapeutic benefits.
          </p>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <LiquidGlassCard variant="frosted" className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Our Story
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Founded in 2020 during challenging times, KawaiiStress emerged from a simple idea: 
                  stress relief doesn't have to be boring. We discovered that combining the therapeutic 
                  benefits of fidget toys and squishies with the joy of kawaii aesthetics created 
                  something truly special.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  What started as a small collection has grown into a comprehensive range of products 
                  that bring smiles to faces and calm to minds around the world.
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600">
                  Shop Our Collection
                </Button>
              </div>
              <div className="relative">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1545249390-6bdfa286032f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                    alt="Kawaii products collection"
                    className="rounded-lg shadow-lg"
                  />
                </motion.div>
              </div>
            </div>
          </LiquidGlassCard>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="h-full"
                >
                  <LiquidGlassCard variant="default" className="p-6 h-full hover:scale-105 transition-transform duration-300">
                    <div className={`inline-block p-3 rounded-full bg-gradient-to-br ${feature.color} text-white mb-4`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </LiquidGlassCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <LiquidGlassCard variant="frosted" className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </LiquidGlassCard>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <LiquidGlassCard variant="default" className="p-6 text-center hover:scale-105 transition-transform duration-300">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-purple-600 dark:text-purple-400 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {member.description}
                  </p>
                </LiquidGlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center"
        >
          <LiquidGlassCard variant="frosted" className="p-8">
            <Users className="h-12 w-12 mx-auto text-purple-600 dark:text-purple-400 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Have Questions?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              We're here to help! Whether you need product recommendations, have questions about shipping, 
              or just want to chat about stress relief, our friendly team is ready to assist.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600">
                Contact Support
              </Button>
              <Button variant="outline" className="glass hover:glass-strong">
                Browse FAQ
              </Button>
            </div>
          </LiquidGlassCard>
        </motion.div>
      </div>
    </div>
  );
}