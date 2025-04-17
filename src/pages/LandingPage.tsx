import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Trophy,
  Users,
  Calendar,
  BarChart3,
  Zap,
  Star,
  Smartphone,
  Shield,
  Wallet,
  ChevronRight,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const LandingPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  // Redirect to home if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      navigate("/matches");
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
      transition: { type: "spring", stiffness: 300, damping: 10 },
    },
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-center">
        {/* Parallax Background with a cricket stadium overlay */}
        <div
          className="absolute inset-0 bg-[url('/cricket-stadium-dark.jpg')] bg-cover bg-center"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        />

        {/* Gradient overlay with neon glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-900/70 to-gray-950/90" />

        {/* Animated grid background for tech feel */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-20" />

        {/* Top glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent blur-sm" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block"
          >
            {/* App logo */}
            <div className="mb-8 relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-neon-green/40 to-blue-600/40 rounded-full blur-lg opacity-70"></div>
              <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center relative border border-neon-green/30">
                <span className="font-bold text-4xl bg-clip-text text-transparent bg-gradient-to-r from-neon-green to-cyan-400">
                  S
                </span>
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-neon-green animate-pulse"></div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mt-4"
              >
                <Badge className="text-sm font-medium bg-neon-green/10 text-neon-green border border-neon-green/30 px-3 py-1 rounded-full">
                  FANTASY CRICKET
                </Badge>
              </motion.div>
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-8xl font-extrabold mb-6 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-neon-green to-white relative">
              STRIKE
              <div className="absolute -inset-1 bg-neon-green/20 blur-xl rounded-full opacity-30"></div>
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl max-w-2xl mx-auto mb-8 text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Build your dream team.{" "}
            <span className="text-neon-green">Win big</span>. Experience cricket
            like never before.
          </motion.p>

          <motion.div
            className="flex flex-col md:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Button
              asChild
              className="relative group overflow-hidden bg-neon-green hover:bg-neon-green/90 text-gray-900 rounded-full px-8 py-6 text-lg font-semibold w-full md:w-auto"
            >
              <Link to="/auth/login">
                <span className="relative z-10 flex items-center justify-center">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-neon-green via-neon-green/80 to-neon-green transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="relative overflow-hidden bg-transparent border-2 border-neon-green/30 hover:border-neon-green/50 text-white hover:text-neon-green rounded-full px-8 py-6 text-lg font-semibold w-full md:w-auto group"
            >
              <Link to="/matches">
                <span className="relative z-10">Explore Matches</span>
                <span className="absolute inset-0 bg-neon-green/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
            </Button>
          </motion.div>

          {/* Live match indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="mt-12"
          >
            <div className="bg-gray-900/70 border border-gray-800 rounded-full inline-flex items-center px-4 py-2 backdrop-blur-sm">
              <div className="h-2 w-2 rounded-full bg-neon-green animate-pulse mr-2"></div>
              <span className="text-sm">
                MI vs CSK <span className="text-gray-400">• Live</span>
              </span>
              <ChevronRight className="h-4 w-4 ml-2 text-gray-400" />
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-neon-green/30 flex justify-center pt-2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-neon-green" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <motion.section
        className="py-20 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 relative"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* Glowing accent behind section */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent blur-md"></div>

        <div className="container mx-auto px-4">
          <motion.div
            variants={itemVariants}
            className="text-center mb-16 relative"
          >
            <span className="inline-block text-neon-green font-medium mb-3">
              GAME-CHANGING FEATURES
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-neon-green to-white">
              Your Ultimate Fantasy Cricket Experience
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              STRIKE brings you advanced fantasy cricket features designed to
              elevate your gaming experience and maximize your chances of
              winning.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              className="relative group"
              variants={itemVariants}
              whileHover={featureCardVariants.hover}
              initial={featureCardVariants.initial}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-green/50 to-blue-600/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-gray-900/90 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-800 p-6 h-full">
                <div className="h-12 w-12 rounded-full bg-neon-green/20 border border-neon-green/30 flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-neon-green" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  Live Match Analytics
                </h3>
                <p className="text-gray-400">
                  Real-time player performance metrics, match insights, and
                  predictive analysis to help you make winning decisions.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative group"
              variants={itemVariants}
              whileHover={featureCardVariants.hover}
              initial={featureCardVariants.initial}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-green/50 to-blue-600/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-gray-900/90 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-800 p-6 h-full">
                <div className="h-12 w-12 rounded-full bg-neon-green/20 border border-neon-green/30 flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-neon-green" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  Smart Team Builder
                </h3>
                <p className="text-gray-400">
                  AI-powered team suggestions, player form indicators, and
                  optimal team combinations based on historical data.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative group"
              variants={itemVariants}
              whileHover={featureCardVariants.hover}
              initial={featureCardVariants.initial}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-green/50 to-blue-600/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-gray-900/90 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-800 p-6 h-full">
                <div className="h-12 w-12 rounded-full bg-neon-green/20 border border-neon-green/30 flex items-center justify-center mb-6">
                  <DollarSign className="h-6 w-6 text-neon-green" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  Multi-Format Contests
                </h3>
                <p className="text-gray-400">
                  Choose from a wide range of contest formats - head-to-head,
                  leagues, mega contests, and winner-takes-all tournaments.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative group"
              variants={itemVariants}
              whileHover={featureCardVariants.hover}
              initial={featureCardVariants.initial}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-green/50 to-blue-600/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-gray-900/90 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-800 p-6 h-full">
                <div className="h-12 w-12 rounded-full bg-neon-green/20 border border-neon-green/30 flex items-center justify-center mb-6">
                  <BarChart3 className="h-6 w-6 text-neon-green" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  Player Statistics Hub
                </h3>
                <p className="text-gray-400">
                  Comprehensive player stats, match history, pitch reports, and
                  head-to-head records to inform your team selection.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative group"
              variants={itemVariants}
              whileHover={featureCardVariants.hover}
              initial={featureCardVariants.initial}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-green/50 to-blue-600/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-gray-900/90 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-800 p-6 h-full">
                <div className="h-12 w-12 rounded-full bg-neon-green/20 border border-neon-green/30 flex items-center justify-center mb-6">
                  <Wallet className="h-6 w-6 text-neon-green" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  Secure Transactions
                </h3>
                <p className="text-gray-400">
                  Fast and secure payment processing, instant withdrawals, and
                  multiple payment options for your convenience.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative group"
              variants={itemVariants}
              whileHover={featureCardVariants.hover}
              initial={featureCardVariants.initial}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-green/50 to-blue-600/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-gray-900/90 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-800 p-6 h-full">
                <div className="h-12 w-12 rounded-full bg-neon-green/20 border border-neon-green/30 flex items-center justify-center mb-6">
                  <Smartphone className="h-6 w-6 text-neon-green" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  Quick Team Updates
                </h3>
                <p className="text-gray-400">
                  Last-minute team changes, toss updates, and player
                  availability alerts to keep your fantasy team current.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Game Modes Section */}
      <motion.section
        className="py-20 bg-gray-950 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-[url('/cricket-pattern.svg')] opacity-5"></div>
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-neon-green font-medium mb-3">
              GAME MODES
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-neon-green to-white">
              Multiple Ways to Play and Win
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Choose your preferred format and put your cricket knowledge to the
              test
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border border-gray-800 h-full">
                <div className="bg-neon-green/10 p-3 rounded-xl inline-block mb-4">
                  <Trophy className="h-6 w-6 text-neon-green" />
                </div>
                <h3 className="text-xl font-bold mb-2">Mega Contests</h3>
                <p className="text-gray-400 mb-4">
                  Join thousands of players in high-prize pool contests with
                  multiple winning positions.
                </p>
                <Badge className="bg-neon-green/20 text-neon-green border border-neon-green/30">
                  Prize Pools up to ₹10 Crore
                </Badge>
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border border-gray-800 h-full">
                <div className="bg-blue-500/10 p-3 rounded-xl inline-block mb-4">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Head-to-Head</h3>
                <p className="text-gray-400 mb-4">
                  Direct competitions between two players. Beat your opponent to
                  win the prize.
                </p>
                <Badge className="bg-blue-500/20 text-blue-500 border border-blue-500/30">
                  50% Winning Chance
                </Badge>
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border border-gray-800 h-full">
                <div className="bg-purple-500/10 p-3 rounded-xl inline-block mb-4">
                  <Star className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Private Leagues</h3>
                <p className="text-gray-400 mb-4">
                  Create your own contest and invite friends to compete in a
                  private setting.
                </p>
                <Badge className="bg-purple-500/20 text-purple-500 border border-purple-500/30">
                  Customize Your Contest
                </Badge>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Upcoming Matches Section */}
      <motion.section
        className="py-20 bg-gray-950 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-neon-green font-medium mb-3">
              UPCOMING MATCHES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Create Your Winning Teams
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Join contests for these upcoming matches and put your fantasy
              skills to the test
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Match Card 1 */}
            <motion.div
              className="bg-gray-900/80 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-800 relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-neon-green/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30 mb-2">
                      IPL 2025
                    </Badge>
                    <h3 className="font-bold text-lg">MI vs CSK</h3>
                    <p className="text-sm text-gray-400">
                      April 18, 2025 - 7:30 PM
                    </p>
                  </div>
                  <div className="bg-gray-800 py-1 px-3 rounded-full">
                    <div className="flex items-center text-xs">
                      <span className="h-2 w-2 rounded-full bg-neon-green mr-1"></span>
                      <span>22h left</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-blue-900/30 flex items-center justify-center mr-2 border border-blue-800/50">
                      <img src="/mi-logo.png" alt="MI" className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="font-medium">Mumbai</p>
                      <p className="text-xs text-gray-400">Indians</p>
                    </div>
                  </div>

                  <div className="px-3 py-1 rounded-full bg-gray-800/50 text-sm font-medium">
                    VS
                  </div>

                  <div className="flex items-center">
                    <div>
                      <p className="font-medium text-right">Chennai</p>
                      <p className="text-xs text-gray-400 text-right">
                        Super Kings
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-yellow-900/30 flex items-center justify-center ml-2 border border-yellow-800/50">
                      <img src="/csk-logo.png" alt="CSK" className="h-8 w-8" />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">
                    Wankhede Stadium, Mumbai
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <Badge className="bg-gray-800 text-gray-300">
                        Prize Pool: ₹2 Crore
                      </Badge>
                    </div>
                    <Link to="/contests/ipl-mi-csk">
                      <Button className="bg-neon-green text-gray-900 hover:bg-neon-green/90">
                        Join
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Match Card 2 */}
            <motion.div
              className="bg-gray-900/80 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-800 relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-neon-green/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30 mb-2">
                      IPL 2025
                    </Badge>
                    <h3 className="font-bold text-lg">RCB vs KKR</h3>
                    <p className="text-sm text-gray-400">
                      April 19, 2025 - 3:30 PM
                    </p>
                  </div>
                  <div className="bg-gray-800 py-1 px-3 rounded-full">
                    <div className="flex items-center text-xs">
                      <span className="h-2 w-2 rounded-full bg-neon-green mr-1"></span>
                      <span>46h left</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-red-900/30 flex items-center justify-center mr-2 border border-red-800/50">
                      <img src="/rcb-logo.png" alt="RCB" className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="font-medium">Bangalore</p>
                      <p className="text-xs text-gray-400">Royal Challengers</p>
                    </div>
                  </div>

                  <div className="px-3 py-1 rounded-full bg-gray-800/50 text-sm font-medium">
                    VS
                  </div>

                  <div className="flex items-center">
                    <div>
                      <p className="font-medium text-right">Kolkata</p>
                      <p className="text-xs text-gray-400 text-right">
                        Knight Riders
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center ml-2 border border-purple-800/50">
                      <img src="/kkr-logo.png" alt="KKR" className="h-8 w-8" />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">
                    Chinnaswamy Stadium, Bangalore
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <Badge className="bg-gray-800 text-gray-300">
                        Prize Pool: ₹1.5 Crore
                      </Badge>
                    </div>
                    <Link to="/contests/ipl-rcb-kkr">
                      <Button className="bg-neon-green text-gray-900 hover:bg-neon-green/90">
                        Join
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Match Card 3 */}
            <motion.div
              className="bg-gray-900/80 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-800 relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-neon-green/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-600/30 mb-2">
                      T20 World Cup
                    </Badge>
                    <h3 className="font-bold text-lg">IND vs AUS</h3>
                    <p className="text-sm text-gray-400">
                      April 22, 2025 - 7:00 PM
                    </p>
                  </div>
                  <div className="bg-gray-800 py-1 px-3 rounded-full">
                    <div className="flex items-center text-xs">
                      <span className="h-2 w-2 rounded-full bg-blue-500 mr-1"></span>
                      <span>5d left</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-blue-900/30 flex items-center justify-center mr-2 border border-blue-800/50">
                      <img
                        src="/india-logo.png"
                        alt="India"
                        className="h-8 w-8"
                      />
                    </div>
                    <div>
                      <p className="font-medium">India</p>
                    </div>
                  </div>

                  <div className="px-3 py-1 rounded-full bg-gray-800/50 text-sm font-medium">
                    VS
                  </div>

                  <div className="flex items-center">
                    <div>
                      <p className="font-medium text-right">Australia</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-yellow-900/30 flex items-center justify-center ml-2 border border-yellow-800/50">
                      <img
                        src="/australia-logo.png"
                        alt="Australia"
                        className="h-8 w-8"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">
                    Melbourne Cricket Ground
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <Badge className="bg-gray-800 text-gray-300">
                        Prize Pool: ₹5 Crore
                      </Badge>
                    </div>
                    <Link to="/contests/t20wc-ind-aus">
                      <Button className="bg-neon-green text-gray-900 hover:bg-neon-green/90">
                        Join
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="text-center mt-8">
            <Link to="/matches">
              <Button
                variant="outline"
                className="border-neon-green/50 text-neon-green hover:bg-neon-green/10"
              >
                View All Matches <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        className="py-20 bg-gray-950 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900/50 to-gray-950"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-green/50 to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-neon-green font-medium mb-3">
              SUCCESS STORIES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Winners' Circle
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Hear from our community of winners who turned their cricket
              knowledge into real cash
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-neon-green/20 flex items-center justify-center mr-3">
                  <span className="text-neon-green font-bold">RK</span>
                </div>
                <div>
                  <p className="font-semibold">Rahul K.</p>
                  <p className="text-sm text-gray-400">Mumbai</p>
                </div>
                <div className="ml-auto">
                  <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">
                    ₹3,45,000
                  </Badge>
                </div>
              </div>
              <p className="text-gray-300">
                "I've been playing fantasy cricket for years, but the analytical
                tools in STRIKE gave me the edge to win my first major contest.
                The live updates and player form indicators were game-changers!"
              </p>
            </motion.div>

            <motion.div
              className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-neon-green/20 flex items-center justify-center mr-3">
                  <span className="text-neon-green font-bold">SP</span>
                </div>
                <div>
                  <p className="font-semibold">Sanjay P.</p>
                  <p className="text-sm text-gray-400">Delhi</p>
                </div>
                <div className="ml-auto">
                  <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">
                    ₹7,80,000
                  </Badge>
                </div>
              </div>
              <p className="text-gray-300">
                "Won the mega contest during the IPL final! The smart team
                builder feature helped me make last-minute adjustments after the
                toss. The UI is so clean and the stats are comprehensive."
              </p>
            </motion.div>

            <motion.div
              className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-neon-green/20 flex items-center justify-center mr-3">
                  <span className="text-neon-green font-bold">AK</span>
                </div>
                <div>
                  <p className="font-semibold">Anita K.</p>
                  <p className="text-sm text-gray-400">Bangalore</p>
                </div>
                <div className="ml-auto">
                  <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">
                    ₹5,20,000
                  </Badge>
                </div>
              </div>
              <p className="text-gray-300">
                "Started with just ₹100 and built it up to over 5 lakhs in just
                2 months! Love the private leagues where I compete with friends.
                The instant withdrawals are a huge plus too."
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
        <div className="absolute inset-0 bg-[url('/cricket-stadium-dark.jpg')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 to-gray-900/90 backdrop-blur-sm" />

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {/* This would ideally be a particle effect in a production app */}
          <div className="absolute h-2 w-2 rounded-full bg-neon-green/70 blur-sm top-1/4 left-1/4 animate-pulse"></div>
          <div className="absolute h-2 w-2 rounded-full bg-neon-green/70 blur-sm top-3/4 left-1/3 animate-pulse"></div>
          <div className="absolute h-2 w-2 rounded-full bg-neon-green/70 blur-sm top-1/2 left-2/3 animate-pulse"></div>
          <div className="absolute h-3 w-3 rounded-full bg-neon-green/70 blur-sm top-1/3 left-3/4 animate-pulse"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-green/20 to-blue-600/20 rounded-3xl blur-xl opacity-70 -z-10"></div>
            <div className="bg-gray-950/80 backdrop-blur-xl border border-gray-800 rounded-3xl px-6 py-16 md:p-16">
              <span className="inline-block text-neon-green font-medium mb-3">
                GET STARTED NOW
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-neon-green to-white">
                Ready to Strike Big?
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
                Join millions of cricket fans who are winning real cash daily.
                Sign up now to get a welcome bonus of ₹100!
              </p>

              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <Button
                  asChild
                  className="relative overflow-hidden bg-neon-green hover:bg-neon-green/90 text-gray-900 rounded-full px-8 py-6 text-lg font-bold w-full md:w-auto"
                >
                  <Link to="/auth/signup">
                    Create Account <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <span className="text-gray-400">or</span>

                <Button
                  asChild
                  variant="outline"
                  className="relative overflow-hidden bg-transparent border-2 border-neon-green/40 hover:border-neon-green/60 text-white hover:text-neon-green rounded-full px-8 py-6 text-lg font-semibold w-full md:w-auto"
                >
                  <Link to="/auth/login">Login</Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-6">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-neon-green mr-2" />
                  <span className="text-sm text-gray-300">Safe & Secure</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-neon-green mr-2" />
                  <span className="text-sm text-gray-300">
                    Instant Withdrawals
                  </span>
                </div>
                <div className="flex items-center">
                  <Trophy className="h-5 w-5 text-neon-green mr-2" />
                  <span className="text-sm text-gray-300">₹100 Bonus</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center relative border border-neon-green/30 mr-3">
                <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-neon-green to-cyan-400">
                  S
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">STRIKE</h2>
                <p className="text-sm">Fantasy Cricket Reimagined</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-12">
              <div>
                <h3 className="text-white font-semibold mb-3">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/matches"
                      className="hover:text-neon-green transition"
                    >
                      Matches
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/players"
                      className="hover:text-neon-green transition"
                    >
                      Players
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/leagues"
                      className="hover:text-neon-green transition"
                    >
                      Leagues
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contests"
                      className="hover:text-neon-green transition"
                    >
                      Contests
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">Account</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/auth/login"
                      className="hover:text-neon-green transition"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/auth/signup"
                      className="hover:text-neon-green transition"
                    >
                      Sign Up
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className="hover:text-neon-green transition"
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/wallet"
                      className="hover:text-neon-green transition"
                    >
                      Wallet
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">Support</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/faq"
                      className="hover:text-neon-green transition"
                    >
                      FAQs
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/how-to-play"
                      className="hover:text-neon-green transition"
                    >
                      How to Play
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="hover:text-neon-green transition"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/responsible-play"
                      className="hover:text-neon-green transition"
                    >
                      Responsible Play
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-gray-800/50" />

          <div className="text-center text-sm">
            <p>
              © {new Date().getFullYear()} STRIKE Fantasy Cricket. All rights
              reserved.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <Link to="/terms" className="hover:text-neon-green transition">
                Terms of Service
              </Link>
              <Link to="/privacy" className="hover:text-neon-green transition">
                Privacy Policy
              </Link>
              <Link to="/legal" className="hover:text-neon-green transition">
                Legal
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
