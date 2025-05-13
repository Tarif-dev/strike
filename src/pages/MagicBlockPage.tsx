import React from "react";
import { motion } from "framer-motion";
import { Zap, Cpu, ArrowRight, BarChart3, Clock } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import PageContainer from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MagicBlockIntegration from "@/components/common/MagicBlockIntegration";

const MagicBlockPage = () => {
  return (
    <>
      <Navbar />
      <PageContainer className="pb-20">
        {/* Hero Section */}
        <section className="relative pt-10 pb-16">
          <div className="absolute inset-0 bg-[url('/cricket-pitch-lines.svg')] bg-no-repeat bg-center opacity-5" />

          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 mb-4 px-3 py-1">
                MAGICBLOCK INTEGRATION
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Supercharged Fantasy Cricket with{" "}
                <span className="text-yellow-400">MagicBlock</span>{" "}
                Infrastructure
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Experience lightning-fast transactions, real-time updates, and
                seamless gameplay powered by MagicBlock's high-performance
                infrastructure on Solana
              </p>
            </motion.div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="bg-gunmetal-grey/30 backdrop-blur-md border border-yellow-700/30 rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-yellow-500/20 p-1.5 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">10ms</div>
                    <div className="text-xs text-gray-400">Response Time</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-gunmetal-grey/30 backdrop-blur-md border border-yellow-700/30 rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-yellow-500/20 p-1.5 rounded-lg">
                    <Cpu className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">99.9%</div>
                    <div className="text-xs text-gray-400">Uptime</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="bg-gunmetal-grey/30 backdrop-blur-md border border-yellow-700/30 rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-yellow-500/20 p-1.5 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">50M+</div>
                    <div className="text-xs text-gray-400">TPS Capacity</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-gunmetal-grey/30 backdrop-blur-md border border-yellow-700/30 rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-yellow-500/20 p-1.5 rounded-lg">
                    <Zap className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">Global</div>
                    <div className="text-xs text-gray-400">Edge Network</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <MagicBlockIntegration />

            <div className="my-16">
              <h2 className="text-3xl font-bold mb-8 text-center">
                How MagicBlock Powers Strike
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="bg-gunmetal-grey/30 backdrop-blur-md border border-yellow-700/20 rounded-xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="bg-yellow-500/20 p-1.5 rounded-lg inline-block">
                      <Zap className="h-5 w-5 text-yellow-400" />
                    </span>
                    Real-Time Match Updates
                  </h3>
                  <p className="text-gray-300 mb-4">
                    MagicBlock's infrastructure processes live cricket match
                    data in milliseconds, providing users with instant score
                    updates, player statistics, and performance analytics as the
                    match progresses.
                  </p>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-yellow-500/20 flex items-center justify-center text-xs mt-0.5">
                        ✓
                      </div>
                      Live ball-by-ball updates with sub-second delay
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-yellow-500/20 flex items-center justify-center text-xs mt-0.5">
                        ✓
                      </div>
                      Player performance metrics calculated in real-time
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-yellow-500/20 flex items-center justify-center text-xs mt-0.5">
                        ✓
                      </div>
                      Immediate point calculations for fantasy teams
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="bg-gunmetal-grey/30 backdrop-blur-md border border-yellow-700/20 rounded-xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="bg-yellow-500/20 p-1.5 rounded-lg inline-block">
                      <Cpu className="h-5 w-5 text-yellow-400" />
                    </span>
                    Scalable Transaction Processing
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Strike handles millions of concurrent fantasy cricket
                    transactions during peak match moments thanks to
                    MagicBlock's high-throughput parallel processing
                    capabilities.
                  </p>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-yellow-500/20 flex items-center justify-center text-xs mt-0.5">
                        ✓
                      </div>
                      Process millions of lineup changes before match deadlines
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-yellow-500/20 flex items-center justify-center text-xs mt-0.5">
                        ✓
                      </div>
                      Handle contest entries and team creation without slowdowns
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-yellow-500/20 flex items-center justify-center text-xs mt-0.5">
                        ✓
                      </div>
                      Simultaneous leaderboard updates for all contests
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="bg-gunmetal-grey/30 backdrop-blur-md border border-yellow-700/20 rounded-xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="bg-yellow-500/20 p-1.5 rounded-lg inline-block">
                      <BarChart3 className="h-5 w-5 text-yellow-400" />
                    </span>
                    Advanced Cricket Analytics
                  </h3>
                  <p className="text-gray-300 mb-4">
                    MagicBlock's computational power enables Strike to process
                    complex cricket data models and provide actionable insights
                    that help users build winning fantasy teams.
                  </p>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-yellow-500/20 flex items-center justify-center text-xs mt-0.5">
                        ✓
                      </div>
                      AI-powered match predictions based on historical data
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-yellow-500/20 flex items-center justify-center text-xs mt-0.5">
                        ✓
                      </div>
                      Player form analysis across different venues and
                      conditions
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-yellow-500/20 flex items-center justify-center text-xs mt-0.5">
                        ✓
                      </div>
                      Team composition recommendations optimized for scoring
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="bg-gunmetal-grey/30 backdrop-blur-md border border-yellow-700/20 rounded-xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="bg-yellow-500/20 p-1.5 rounded-lg inline-block">
                      <Clock className="h-5 w-5 text-yellow-400" />
                    </span>
                    Instant Settlements &amp; Rewards
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Strike leverages MagicBlock's lightning-fast finality to
                    distribute winnings and update user wallets immediately
                    after match completion.
                  </p>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-yellow-500/20 flex items-center justify-center text-xs mt-0.5">
                        ✓
                      </div>
                      Instant prize distribution to winners' wallets
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-yellow-500/20 flex items-center justify-center text-xs mt-0.5">
                        ✓
                      </div>
                      Automatic verification of contest results
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-yellow-500/20 flex items-center justify-center text-xs mt-0.5">
                        ✓
                      </div>
                      Transparent and verifiable transaction history
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="my-16 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto"
              >
                <div className="relative">
                  <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-yellow-500/30 to-yellow-800/30 blur-xl opacity-70"></div>
                  <div className="relative bg-gunmetal-grey/50 backdrop-blur-xl border border-yellow-500/20 rounded-3xl px-6 py-12 md:p-12 text-center">
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 mb-4 px-3 py-1">
                      EXPERIENCE THE POWER
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                      Ready to Experience MagicBlock Powered Cricket?
                    </h2>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                      Join Strike today and experience the future of fantasy
                      cricket with ultra-fast, decentralized gameplay.
                    </p>

                    <Button
                      size="lg"
                      className="bg-yellow-500 hover:bg-yellow-400 text-midnight-black text-lg font-bold rounded-full px-8 shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] transition-all"
                    >
                      Join a Contest Now <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </PageContainer>
    </>
  );
};

export default MagicBlockPage;
