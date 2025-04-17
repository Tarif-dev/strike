
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Trophy, Users, Calendar, BarChart3, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";

const LandingPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  // Redirect to home if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      navigate('/matches');
    }
  }, [user, isLoading, navigate]);

  // Track scroll for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const featureCardVariants = {
    initial: { scale: 0.9, opacity: 0.8 },
    hover: { 
      scale: 1.05, 
      opacity: 1,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      transition: { type: "spring", stiffness: 300, damping: 10 }
    }
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-center">
        {/* Parallax Background */}
        <div
          className="absolute inset-0 bg-[url('/cricket-stadium.jpg')] bg-cover bg-center"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        
        {/* Content */}
        <motion.div
          className="relative z-10 container mx-auto px-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block"
          >
            <div className="flex items-center mb-4 justify-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                <Trophy className="h-8 w-8 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-amber-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Cricket Pulse
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl max-w-2xl mx-auto mb-8 text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Live scores, player stats, and match details - everything cricket, all in one place
          </motion.p>

          <motion.div
            className="flex flex-col md:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Button 
              asChild
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full px-8 py-6 text-lg font-semibold w-full md:w-auto"
            >
              <Link to="/auth/login">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              className="bg-transparent border-2 border-white/20 hover:bg-white/10 text-white rounded-full px-8 py-6 text-lg font-semibold w-full md:w-auto"
            >
              <Link to="/matches">
                Explore Matches
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <motion.div 
            className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <motion.section 
        className="py-20 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500">
              Experience Cricket Like Never Before
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Our platform offers comprehensive cricket coverage with cutting-edge features designed for the modern cricket fan.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-700 p-6"
              variants={itemVariants}
              whileHover={featureCardVariants.hover}
              initial={featureCardVariants.initial}
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Live Match Updates</h3>
              <p className="text-gray-400">
                Get ball-by-ball updates, real-time scores, and instantly refreshed statistics as the action unfolds.
              </p>
            </motion.div>

            <motion.div 
              className="bg-gray-800/50 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-700 p-6"
              variants={itemVariants}
              whileHover={featureCardVariants.hover}
              initial={featureCardVariants.initial}
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Player Profiles</h3>
              <p className="text-gray-400">
                Detailed player statistics, career highlights, and performance analytics for all your favorite cricketers.
              </p>
            </motion.div>

            <motion.div 
              className="bg-gray-800/50 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-700 p-6"
              variants={itemVariants}
              whileHover={featureCardVariants.hover}
              initial={featureCardVariants.initial}
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-6">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Match Schedules</h3>
              <p className="text-gray-400">
                Stay updated with upcoming matches, series calendars, and tournament schedules from around the world.
              </p>
            </motion.div>

            <motion.div 
              className="bg-gray-800/50 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-700 p-6"
              variants={itemVariants}
              whileHover={featureCardVariants.hover}
              initial={featureCardVariants.initial}
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Advanced Analytics</h3>
              <p className="text-gray-400">
                Dive deep into match analytics, player comparisons, and performance trends with our statistical tools.
              </p>
            </motion.div>

            <motion.div 
              className="bg-gray-800/50 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-700 p-6"
              variants={itemVariants}
              whileHover={featureCardVariants.hover}
              initial={featureCardVariants.initial}
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">League Coverage</h3>
              <p className="text-gray-400">
                Comprehensive coverage of all major cricket leagues including IPL, BBL, PSL, and international tournaments.
              </p>
            </motion.div>

            <motion.div 
              className="bg-gray-800/50 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-700 p-6"
              variants={itemVariants}
              whileHover={featureCardVariants.hover}
              initial={featureCardVariants.initial}
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Team Insights</h3>
              <p className="text-gray-400">
                Team performance metrics, historical data, and head-to-head records for informed match predictions.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Background with blur effect */}
        <div className="absolute inset-0 bg-[url('/cricket-action.jpg')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-indigo-900/80 backdrop-blur-sm" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Ready to Elevate Your Cricket Experience?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
              Join thousands of cricket enthusiasts who have already made Cricket Pulse their go-to destination for all things cricket.
            </p>
            <Button 
              asChild
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full px-10 py-7 text-xl font-semibold"
            >
              <Link to="/auth/signup">
                Sign Up Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-white mb-2">Cricket Pulse</h2>
              <p className="text-sm">The ultimate cricket companion</p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h3 className="text-white font-semibold mb-3">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link to="/matches" className="hover:text-white transition">Matches</Link></li>
                  <li><Link to="/players" className="hover:text-white transition">Players</Link></li>
                  <li><Link to="/leagues" className="hover:text-white transition">Leagues</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-3">Account</h3>
                <ul className="space-y-2">
                  <li><Link to="/auth/login" className="hover:text-white transition">Login</Link></li>
                  <li><Link to="/auth/signup" className="hover:text-white transition">Sign Up</Link></li>
                  <li><Link to="/profile" className="hover:text-white transition">Profile</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <Separator className="my-8 bg-gray-800" />
          <div className="text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Cricket Pulse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
