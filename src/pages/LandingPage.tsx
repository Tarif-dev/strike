import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Trophy,
  Calendar,
  Star,
  Users,
  Circle,
  Medal,
  ChevronDown,
  ChevronRight,
  Zap,
  BarChart3,
  FileKey,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const LandingPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  // Redirect to the main app if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate("/matches", { replace: true });
    }
  }, [user, loading, navigate]);

  // Track scroll for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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

  const cardHoverVariants = {
    rest: { scale: 1, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)" },
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 25px rgba(57, 255, 20, 0.2)",
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight-black">
        <div className="w-16 h-16 border-4 border-t-neon-green border-opacity-50 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midnight-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        {/* Dynamic background with parallax */}
        <div
          className="absolute inset-0 bg-[url('/cricket-stadium-night.jpg')] bg-cover bg-center"
          style={{ transform: `translateY(${scrollY * 0.4}px)` }}
        />

        {/* Dark gradient overlay with green accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-midnight-black/95 via-midnight-black/80 to-midnight-black/90" />

        {/* Animated cricket field lines overlay */}
        <div className="absolute inset-0 bg-[url('/cricket-pitch-lines.svg')] bg-no-repeat bg-center opacity-5" />

        {/* Glowing accents */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-green to-transparent blur-sm" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-green to-transparent blur-sm" />

        {/* Content container */}
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="relative inline-block mb-6"
            >
              <div className="text-neon-green text-6xl md:text-8xl font-black tracking-tight relative">
                <span className="inline-block">STRIKE</span>
                <div className="absolute -inset-4 bg-neon-green/10 rounded-full blur-2xl opacity-70 -z-10"></div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
            >
              Decentralized Fantasy Cricket{" "}
              <span className="text-neon-green">Reimagined</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto"
            >
              Build your dream team. Make strategic plays.
              <br />
              <span className="text-neon-green font-semibold">
                Win big
              </span>{" "}
              with every match on{" "}
              <span className="text-neon-green font-semibold">
                Solana blockchain
              </span>
              .
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex items-center justify-center mb-6 flex-wrap gap-2"
            >
              <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30 px-3 py-1">
                POWERED BY SOLANA
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1">
                DECENTRALIZED
              </Badge>
              <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30 px-3 py-1">
                ZK COMPRESSION
              </Badge>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 px-3 py-1">
                MAGICBLOCK ENABLED
              </Badge>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col md:flex-row gap-6 justify-center"
            >
              <Button
                asChild
                size="lg"
                className="bg-neon-green hover:bg-neon-green/90 text-midnight-black text-lg font-bold rounded-full px-8 shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:shadow-[0_0_30px_rgba(57,255,20,0.6)] transition-all"
              >
                <Link to="/auth/signup">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-neon-green/50 text-neon-green hover:bg-neon-green/10 rounded-full px-8 transition-all"
              >
                <Link to="/matches">Explore Matches</Link>
              </Button>
            </motion.div>

            {/* Live match indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-12"
            >
              <Link to="/matches">
                <div className="inline-flex items-center px-4 py-2 bg-gunmetal-grey/40 backdrop-blur-md rounded-full border border-neon-green/20 hover:border-neon-green/40 transition-all group">
                  <div className="h-2 w-2 rounded-full bg-neon-green animate-pulse mr-3"></div>
                  <span className="text-gray-300 mr-2">MI vs CSK</span>
                  <span className="text-neon-green text-xs">LIVE NOW</span>
                  <ChevronRight className="ml-2 h-4 w-4 text-neon-green group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-gray-400">Scroll to explore</span>
            <ChevronDown className="h-5 w-5 text-neon-green" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-gunmetal-grey/20">
        <div className="absolute inset-0 bg-[url('/cricket-pattern.svg')] bg-repeat opacity-5"></div>

        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neon-green/10 mb-4">
                <Users className="h-8 w-8 text-neon-green" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                15M+
              </h3>
              <p className="text-gray-400">Active Players</p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neon-green/10 mb-4">
                <Calendar className="h-8 w-8 text-neon-green" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                500+
              </h3>
              <p className="text-gray-400">Matches Every Season</p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neon-green/10 mb-4">
                <Trophy className="h-8 w-8 text-neon-green" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                10M USDC
              </h3>
              <p className="text-gray-400">Prize Pool</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gunmetal-grey/10 to-midnight-black"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30 mb-4 px-3 py-1">
              FEATURES
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Players Choose Strike
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience fantasy cricket like never before with our innovative
              features
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              variants={cardHoverVariants}
              initial="rest"
              whileHover="hover"
              whileInView={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
              viewport={{ once: true }}
              className="bg-yellow-500/10 backdrop-blur-md border border-yellow-700/30 rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-2xl"></div>
              <div className="bg-yellow-500/10 p-3 rounded-xl inline-block mb-4">
                <Zap className="h-6 w-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">
                MagicBlock Real-Time Gameplay
              </h3>
              <p className="text-gray-400">
                Ultra-low latency 10ms response time for real-time betting and
                team updates during live matches with our MagicBlock
                integration.
              </p>
            </motion.div>

            <motion.div
              variants={cardHoverVariants}
              initial="rest"
              whileHover="hover"
              whileInView={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
              viewport={{ once: true }}
              className="bg-gunmetal-grey/30 backdrop-blur-md border border-gray-700 rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-neon-green/5 rounded-full blur-2xl"></div>
              <div className="bg-neon-green/10 p-3 rounded-xl inline-block mb-4">
                <Users className="h-6 w-6 text-neon-green" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Team Builder</h3>
              <p className="text-gray-400">
                AI-powered team suggestions and player form indicators based on
                historical data.
              </p>
            </motion.div>

            <motion.div
              variants={cardHoverVariants}
              initial="rest"
              whileHover="hover"
              whileInView={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
              viewport={{ once: true }}
              className="bg-pink-500/10 backdrop-blur-md border border-pink-700/30 rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl"></div>
              <div className="bg-pink-500/10 p-3 rounded-xl inline-block mb-4">
                <FileKey className="h-6 w-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">ZK-Powered Contests</h3>
              <p className="text-gray-400">
                Choose from a variety of contests with ultra-low gas fees thanks
                to ZK Compression technology on Solana.
              </p>
            </motion.div>

            <motion.div
              variants={cardHoverVariants}
              initial="rest"
              whileHover="hover"
              whileInView={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
              viewport={{ once: true }}
              className="bg-gunmetal-grey/30 backdrop-blur-md border border-gray-700 rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-neon-green/5 rounded-full blur-2xl"></div>
              <div className="bg-neon-green/10 p-3 rounded-xl inline-block mb-4">
                <Circle className="h-6 w-6 text-neon-green" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Updates</h3>
              <p className="text-gray-400">
                Real-time score updates, player stats and match commentary as
                the action unfolds.
              </p>
            </motion.div>

            <motion.div
              variants={cardHoverVariants}
              initial="rest"
              whileHover="hover"
              whileInView={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
              viewport={{ once: true }}
              className="bg-gunmetal-grey/30 backdrop-blur-md border border-gray-700 rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-neon-green/5 rounded-full blur-2xl"></div>
              <div className="bg-neon-green/10 p-3 rounded-xl inline-block mb-4">
                <Medal className="h-6 w-6 text-neon-green" />
              </div>
              <h3 className="text-xl font-bold mb-3">
                Blockchain Secured Transactions
              </h3>
              <p className="text-gray-400">
                Fully on-chain transactions on Solana with compressed tokens for
                minimal fees and instant withdrawals.
              </p>
            </motion.div>

            <motion.div
              variants={cardHoverVariants}
              initial="rest"
              whileHover="hover"
              whileInView={{ opacity: 1, y: 0, transition: { delay: 0.6 } }}
              viewport={{ once: true }}
              className="bg-gunmetal-grey/30 backdrop-blur-md border border-gray-700 rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-neon-green/5 rounded-full blur-2xl"></div>
              <div className="bg-neon-green/10 p-3 rounded-xl inline-block mb-4">
                <Calendar className="h-6 w-6 text-neon-green" />
              </div>
              <h3 className="text-xl font-bold mb-3">All Cricket Formats</h3>
              <p className="text-gray-400">
                Play across all cricket formats from T20s and ODIs to Test
                matches and domestic leagues.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upcoming Matches Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30 mb-4 px-3 py-1">
              LIVE & UPCOMING
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Featured Matches
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join these popular contests and put your fantasy skills to the
              test
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Match Card 1 - Live */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-gunmetal-grey/30 backdrop-blur-md border border-gray-700/50 rounded-2xl overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse mr-2"></div>
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                        LIVE NOW
                      </Badge>
                    </div>
                    <h3 className="font-bold text-xl">MI vs CSK</h3>
                    <p className="text-sm text-gray-400">IPL 2025 • Match 24</p>
                  </div>
                  <div className="bg-gunmetal-grey/60 py-1 px-3 rounded-full">
                    <p className="text-sm text-neon-green">In Progress</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-blue-900/20 flex items-center justify-center mr-3 border border-blue-800/30">
                      <img
                        src="/team_logos/mi.jpeg"
                        alt="MI"
                        className="h-8 w-8"
                      />
                    </div>
                    <div>
                      <p className="font-medium">Mumbai</p>
                      <p className="text-xs text-gray-400">142/6 (16.3)</p>
                    </div>
                  </div>

                  <div className="px-3 py-1 rounded-full bg-gunmetal-grey/50 text-sm">
                    vs
                  </div>

                  <div className="flex items-center">
                    <div>
                      <p className="font-medium text-right">Chennai</p>
                      <p className="text-xs text-gray-400 text-right">
                        138/4 (20)
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-yellow-900/20 flex items-center justify-center ml-3 border border-yellow-800/30">
                      <img
                        src="/team_logos/csk.jpeg"
                        alt="CSK"
                        className="h-8 w-8"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-3">
                    Wankhede Stadium, Mumbai
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge className="bg-gunmetal-grey/60 text-gray-300">
                      Prize: 2M USDC
                    </Badge>
                    <Link to="/matches">
                      <Button
                        className="bg-neon-green hover:bg-neon-green/90 text-midnight-black group-hover:shadow-[0_0_15px_rgba(57,255,20,0.3)]"
                        size="sm"
                      >
                        Join Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Match Card 2 - Upcoming */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-gunmetal-grey/30 backdrop-blur-md border border-gray-700/50 rounded-2xl overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30 mb-2">
                      UPCOMING
                    </Badge>
                    <h3 className="font-bold text-xl">RCB vs KKR</h3>
                    <p className="text-sm text-gray-400">IPL 2025 • Match 25</p>
                  </div>
                  <div className="bg-gunmetal-grey/60 py-1 px-3 rounded-full">
                    <p className="text-sm">22h left</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-red-900/20 flex items-center justify-center mr-3 border border-red-800/30">
                      <img
                        src="/team_logos/rcb.jpeg"
                        alt="RCB"
                        className="h-8 w-8"
                      />
                    </div>
                    <div>
                      <p className="font-medium">Bangalore</p>
                      <p className="text-xs text-gray-400">Royal Challengers</p>
                    </div>
                  </div>

                  <div className="px-3 py-1 rounded-full bg-gunmetal-grey/50 text-sm">
                    vs
                  </div>

                  <div className="flex items-center">
                    <div>
                      <p className="font-medium text-right">Kolkata</p>
                      <p className="text-xs text-gray-400 text-right">
                        Knight Riders
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-purple-900/20 flex items-center justify-center ml-3 border border-purple-800/30">
                      <img
                        src="/team_logos/kkr.jpeg"
                        alt="KKR"
                        className="h-8 w-8"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-3">
                    Chinnaswamy Stadium, Bangalore
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge className="bg-gunmetal-grey/60 text-gray-300">
                      Prize: 1.5M USDC
                    </Badge>
                    <Link to="/matches">
                      <Button
                        className="bg-neon-green hover:bg-neon-green/90 text-midnight-black group-hover:shadow-[0_0_15px_rgba(57,255,20,0.3)]"
                        size="sm"
                      >
                        Join Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Match Card 3 - Upcoming International */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-gunmetal-grey/30 backdrop-blur-md border border-gray-700/50 rounded-2xl overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-2">
                      T20 WORLD CUP
                    </Badge>
                    <h3 className="font-bold text-xl">IND vs AUS</h3>
                    <p className="text-sm text-gray-400">Super 8 • Match 3</p>
                  </div>
                  <div className="bg-gunmetal-grey/60 py-1 px-3 rounded-full">
                    <p className="text-sm">3d left</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-blue-900/20 flex items-center justify-center mr-3 border border-blue-800/30">
                      <span className="text-blue-400 font-bold">IND</span>
                    </div>
                    <div>
                      <p className="font-medium">India</p>
                    </div>
                  </div>

                  <div className="px-3 py-1 rounded-full bg-gunmetal-grey/50 text-sm">
                    vs
                  </div>

                  <div className="flex items-center">
                    <div>
                      <p className="font-medium text-right">Australia</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-yellow-900/20 flex items-center justify-center ml-3 border border-yellow-800/30">
                      <span className="text-yellow-400 font-bold">AUS</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-3">
                    Melbourne Cricket Ground
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge className="bg-gunmetal-grey/60 text-gray-300">
                      Prize: 5M USDC
                    </Badge>
                    <Link to="/matches">
                      <Button
                        className="bg-neon-green hover:bg-neon-green/90 text-midnight-black group-hover:shadow-[0_0_15px_rgba(57,255,20,0.3)]"
                        size="sm"
                      >
                        Join Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="text-center mt-10">
            <Link to="/matches">
              <Button
                variant="outline"
                className="border-neon-green/50 text-neon-green hover:bg-neon-green/10 group"
              >
                View All Matches
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-midnight-black via-gunmetal-grey/5 to-midnight-black"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30 mb-4 px-3 py-1">
              TESTIMONIALS
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Winners&apos; Circle
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Hear from our players who turned cricket knowledge into real cash
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="bg-gunmetal-grey/30 backdrop-blur-md border border-gray-700 rounded-2xl p-6"
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
                    3,450 USDC
                  </Badge>
                </div>
              </div>
              <p className="text-gray-300">
                "STRIKE&apos;s analytical tools gave me the edge to win my first
                major contest. The live updates and player form indicators were
                game-changers!"
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-gunmetal-grey/30 backdrop-blur-md border border-gray-700 rounded-2xl p-6"
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
                    7,800 USDC
                  </Badge>
                </div>
              </div>
              <p className="text-gray-300">
                "Won the mega contest during the IPL final! The team builder
                helped me make last-minute adjustments after the toss. The UI is
                so clean!"
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-gunmetal-grey/30 backdrop-blur-md border border-gray-700 rounded-2xl p-6"
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
                    5,200 USDC
                  </Badge>
                </div>
              </div>
              <p className="text-gray-300">
                "Started with just 100 USDC and built it up to over 5,200 in 2
                months! Love the private leagues where I compete with friends."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ZK Compression Technology Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-midnight-black via-pink-900/5 to-midnight-black"></div>
        <div className="absolute inset-0 bg-[url('/cricket-pitch-lines.svg')] bg-no-repeat bg-center opacity-5"></div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="text-center mb-16">
            <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30 mb-4 px-3 py-1">
              POWERED BY ZK COMPRESSION
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ultimate Blockchain Efficiency
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Minimize costs and maximize scale with on-chain Zero-Knowledge
              proofs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="bg-gunmetal-grey/30 backdrop-blur-md border border-pink-600/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-pink-500/20 p-2 rounded-lg">
                    <FileKey className="h-5 w-5 text-pink-400" />
                  </div>
                  <h3 className="text-xl font-bold">95% Data Compression</h3>
                </div>
                <p className="text-gray-300">
                  Store player statistics, team compositions, and match data at
                  a fraction of the cost with ZK Compression technology that
                  securely minimizes on-chain footprint.
                </p>
              </div>

              <div className="bg-gunmetal-grey/30 backdrop-blur-md border border-pink-600/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-pink-500/20 p-2 rounded-lg">
                    <Shield className="h-5 w-5 text-pink-400" />
                  </div>
                  <h3 className="text-xl font-bold">
                    91% Lower Transaction Costs
                  </h3>
                </div>
                <p className="text-gray-300">
                  Players enjoy dramatically reduced gas fees while maintaining
                  the same security guarantees, enabling more frequent updates
                  and interactions.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative h-80 md:h-96 flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-pink-400/5 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gunmetal-grey/50 backdrop-blur-xl border border-pink-500/20 rounded-3xl px-6 py-8 w-full max-w-md">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-pink-400">
                      ZK Compression Stats
                    </h3>
                    <p className="text-sm text-gray-400">
                      Advanced data optimization metrics
                    </p>
                  </div>
                  <div className="bg-pink-500/20 p-2 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-pink-400" />
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-gunmetal-grey/30 rounded-lg p-3 border border-pink-600/20">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">
                        Compression Ratio
                      </span>
                      <span className="text-pink-400 font-bold">95.2%</span>
                    </div>
                  </div>
                  <div className="bg-gunmetal-grey/30 rounded-lg p-3 border border-pink-600/20">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">
                        Cost Savings
                      </span>
                      <span className="text-pink-400 font-bold">91%</span>
                    </div>
                  </div>
                  <div className="bg-gunmetal-grey/30 rounded-lg p-3 border border-pink-600/20">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">
                        Verification Time
                      </span>
                      <span className="text-pink-400 font-bold"> 2s</span>
                    </div>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full bg-pink-500 hover:bg-pink-400 text-midnight-black font-semibold"
                >
                  <Link to="/zk-compression">
                    Explore ZK Technology{" "}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* MagicBlock Technology Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-midnight-black via-yellow-900/5 to-midnight-black"></div>
        <div className="absolute inset-0 bg-[url('/cricket-pitch-lines.svg')] bg-no-repeat bg-center opacity-5"></div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="text-center mb-16">
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 mb-4 px-3 py-1">
              POWERED BY MAGICBLOCK
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Real-Time Fantasy Cricket
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ultra-fast performance with MagicBlock's high-throughput
              infrastructure
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="bg-gunmetal-grey/30 backdrop-blur-md border border-yellow-600/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-yellow-500/20 p-2 rounded-lg">
                    <Zap className="h-5 w-5 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold">
                    10ms Transaction Finality
                  </h3>
                </div>
                <p className="text-gray-300">
                  Experience instant updates and real-time player statistics
                  with MagicBlock's ultra-low latency infrastructure that
                  delivers 10ms response times on the Solana blockchain.
                </p>
              </div>

              <div className="bg-gunmetal-grey/30 backdrop-blur-md border border-yellow-600/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-yellow-500/20 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold">
                    Millions of Concurrent Users
                  </h3>
                </div>
                <p className="text-gray-300">
                  Our platform handles millions of simultaneous fantasy team
                  updates during peak IPL matches thanks to MagicBlock's
                  parallel processing capabilities.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative h-80 md:h-96 flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-yellow-400/5 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gunmetal-grey/50 backdrop-blur-xl border border-yellow-500/20 rounded-3xl px-6 py-8 w-full max-w-md">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-yellow-400">
                      MagicBlock Stats
                    </h3>
                    <p className="text-sm text-gray-400">
                      Real-time blockchain infrastructure
                    </p>
                  </div>
                  <div className="bg-yellow-500/20 p-2 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-yellow-400" />
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-gunmetal-grey/30 rounded-lg p-3 border border-yellow-600/20">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">
                        Response Time
                      </span>
                      <span className="text-yellow-400 font-bold">10ms</span>
                    </div>
                  </div>
                  <div className="bg-gunmetal-grey/30 rounded-lg p-3 border border-yellow-600/20">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">
                        Transaction Capacity
                      </span>
                      <span className="text-yellow-400 font-bold">
                        50M+ TPS
                      </span>
                    </div>
                  </div>
                  <div className="bg-gunmetal-grey/30 rounded-lg p-3 border border-yellow-600/20">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">
                        Edge Computing
                      </span>
                      <span className="text-yellow-400 font-bold">Global</span>
                    </div>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-midnight-black font-semibold"
                >
                  <Link to="/magicblock">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/cricket-stadium-night.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight-black/90 to-gunmetal-grey/90" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-neon-green/30 to-blue-500/30 blur-xl opacity-70"></div>
              <div className="relative bg-gunmetal-grey/50 backdrop-blur-xl border border-neon-green/20 rounded-3xl px-6 py-16 md:p-16 text-center">
                <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30 mb-6 px-3 py-1">
                  GET STARTED NOW
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Ready to Strike Big?
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
                  Join millions of cricket fans who are winning real USDC daily.
                  Sign up now to get a welcome bonus of 10 USDC!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-neon-green hover:bg-neon-green/90 text-midnight-black text-lg font-bold rounded-full px-8 shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:shadow-[0_0_30px_rgba(57,255,20,0.6)] transition-all"
                  >
                    <Link to="/auth/signup">
                      Create Account <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-neon-green/50 text-neon-green hover:bg-neon-green/10 rounded-full px-8 transition-all"
                  >
                    <Link to="/auth/login">Login</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center mb-6">
                <div className="h-10 w-10 rounded-full bg-neon-green/20 border border-neon-green/30 flex items-center justify-center mr-3">
                  <span className="text-neon-green font-bold text-xl">S</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">STRIKE</h3>
                  <p className="text-sm text-gray-400">
                    Fantasy Cricket Reimagined
                  </p>
                </div>
              </div>
              <p className="text-gray-400 mb-6">
                The ultimate fantasy cricket platform where strategy meets
                rewards.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    to="/matches"
                    className="hover:text-neon-green transition-colors"
                  >
                    Matches
                  </Link>
                </li>
                <li>
                  <Link
                    to="/leaderboard"
                    className="hover:text-neon-green transition-colors"
                  >
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/how-to-play"
                    className="hover:text-neon-green transition-colors"
                  >
                    How to Play
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-neon-green transition-colors"
                  >
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    to="/terms"
                    className="hover:text-neon-green transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-neon-green transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/fair-play"
                    className="hover:text-neon-green transition-colors"
                  >
                    Fair Play Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/responsible-gaming"
                    className="hover:text-neon-green transition-colors"
                  >
                    Responsible Gaming
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    to="/faq"
                    className="hover:text-neon-green transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-neon-green transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/feedback"
                    className="hover:text-neon-green transition-colors"
                  >
                    Feedback
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="bg-gray-800/50 my-6" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} STRIKE Fantasy Sports. All rights
              reserved.
            </p>
            <div className="flex space-x-4">
              <Link to="#" className="text-gray-400 hover:text-neon-green">
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link to="#" className="text-gray-400 hover:text-neon-green">
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link to="#" className="text-gray-400 hover:text-neon-green">
                <span className="sr-only">YouTube</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
