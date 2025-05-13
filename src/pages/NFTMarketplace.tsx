import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  ArrowUpDown,
  Zap,
  Flame,
  TrendingUp,
  Star,
  ChevronRight,
  Clock,
  Activity,
  Bookmark,
  Share2,
  ChevronLeft,
  Trophy,
  Users,
  Shield,
  HelpCircle,
  Globe,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { useNFT } from "@/contexts/NFTContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

// Marquee component for trending players
const TrendingMarquee = () => {
  const trendingPlayers = [
    { name: "Virat Kohli", change: "+12.5%", team: "RCB" },
    { name: "Jasprit Bumrah", change: "+8.2%", team: "MI" },
    { name: "Jos Buttler", change: "+15.7%", team: "RR" },
    { name: "Rashid Khan", change: "+6.8%", team: "GT" },
    { name: "MS Dhoni", change: "+9.3%", team: "CSK" },
    { name: "Rishabh Pant", change: "+18.4%", team: "DC" },
  ];

  return (
    <div className="bg-midnight-black py-3 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap flex">
        {[...trendingPlayers, ...trendingPlayers].map((player, i) => (
          <div key={i} className="flex items-center mx-6">
            <div className="h-2 w-2 rounded-full bg-electric-lime mr-2"></div>
            <span className="font-medium text-soft-white">{player.name}</span>
            <span className="mx-2 text-platinum-silver">•</span>
            <span className="text-sm text-electric-lime">{player.change}</span>
            <span className="ml-2 px-1.5 py-0.5 bg-gunmetal-grey rounded text-xs text-platinum-silver">
              {player.team}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Team badge component with colors
const TeamBadge = ({ team }) => {
  const teamColors = {
    "Royal Challengers Bangalore": "bg-crimson-red",
    "Mumbai Indians": "bg-royal-blue",
    "Chennai Super Kings": "bg-gold-500",
    "Gujarat Titans": "bg-deep-emerald",
    "Rajasthan Royals": "bg-royal-blue",
    "Delhi Capitals": "bg-royal-blue",
    "Kolkata Knight Riders": "bg-royal-blue",
    "Sunrisers Hyderabad": "bg-royal-gold",
  };

  const bgColor = teamColors[team] || "bg-grey-600";
  const shortName = team
    .split(" ")
    .map((word) => word[0])
    .join("");

  return (
    <div
      className={`${bgColor} text-soft-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold`}
    >
      {shortName}
    </div>
  );
};

// Rarity badge component
const RarityBadge = ({ rarity }) => {
  const rarityConfig = {
    Legendary: {
      bg: "bg-gradient-to-r from-royal-gold to-gold-600",
      border: "border-gold-400",
      icon: <Star className="h-3 w-3" />,
    },
    Epic: {
      bg: "bg-gradient-to-r from-royal-blue to-deep-emerald",
      border: "border-royal-blue",
      icon: <Flame className="h-3 w-3" />,
    },
    Rare: {
      bg: "bg-gradient-to-r from-deep-emerald to-emerald-700",
      border: "border-emerald-400",
      icon: <TrendingUp className="h-3 w-3" />,
    },
  };

  const config = rarityConfig[rarity] || rarityConfig["Rare"];

  return (
    <div
      className={`${config.bg} border ${config.border} rounded-full px-2.5 py-0.5 flex items-center gap-1 shadow-lg text-soft-white text-xs font-medium`}
    >
      {config.icon}
      {rarity}
    </div>
  );
};

// Modern NFT Card Component - Updated to use real NFT data
const NFTCard = ({ nft, onBuy }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isAdmin } = useNFT();
  const { publicKey, connected } = useWallet();

  // Determine rarity based on attributes
  const determineRarity = (performance) => {
    if (performance >= 90) return "Legendary";
    if (performance >= 80) return "Epic";
    return "Rare";
  };

  // Check if the NFT is owned by the current user
  const isOwner = publicKey && nft.owner === publicKey.toString();

  // Get role from attributes
  const getRole = () => {
    const roleAttr = nft.attributes.find((attr) => attr.trait_type === "Role");
    return roleAttr ? roleAttr.value : "Player";
  };

  // Calculate performance score as average of numerical attributes
  const performanceScore =
    nft.attributes
      .filter(
        (attr) => !isNaN(Number(attr.value)) && attr.trait_type !== "Price"
      )
      .reduce((sum, attr) => sum + parseInt(attr.value), 0) /
      nft.attributes.filter(
        (attr) => !isNaN(attr.value) && attr.trait_type !== "Price"
      ).length || 80;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="h-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden h-full border-0 bg-gradient-to-b from-gunmetal-grey to-grey-900 shadow-xl rounded-xl">
        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden">
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full h-full object-cover transition-all duration-700"
              style={{
                transform: isHovered ? "scale(1.08)" : "scale(1)",
              }}
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-midnight-black/50 to-transparent opacity-0 transition-opacity duration-300"
              style={{ opacity: isHovered ? 1 : 0 }}
            ></div>
          </div>

          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <RarityBadge rarity={determineRarity(performanceScore)} />
          </div>

          <div className="absolute bottom-3 left-3">
            <TeamBadge team={nft.team} />
          </div>

          <div
            className="absolute top-3 left-3 right-3 flex justify-between items-center"
            style={{
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          >
            <div className="flex gap-1.5">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 bg-soft-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-soft-white hover:bg-soft-white/30 transition-colors"
              >
                <Bookmark size={16} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 bg-soft-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-soft-white hover:bg-soft-white/30 transition-colors"
              >
                <Share2 size={16} />
              </motion.button>
            </div>
          </div>
        </div>

        <CardHeader className="pb-2 pt-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-soft-white">
                {nft.name}
              </h3>
              <p className="text-sm text-platinum-silver mt-0.5 flex items-center">
                {getRole()} •{" "}
                <span className="text-xs text-platinum-silver ml-1">
                  {nft.team}
                </span>
              </p>
            </div>
            <div className="relative">
              <Avatar className="h-10 w-10 ring-2 ring-gunmetal-grey">
                <AvatarImage src={nft.image} alt={nft.name} />
                <AvatarFallback className="bg-midnight-black text-soft-white">
                  {nft.name[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-platinum-silver">Performance</span>
            <div className="flex items-center">
              <span
                className={cn(
                  "font-semibold",
                  performanceScore >= 90
                    ? "text-electric-lime"
                    : nft.performanceScore >= 80
                      ? "text-royal-blue"
                      : "text-royal-gold"
                )}
              >
                {Math.round(performanceScore)}
              </span>
              <span className="text-platinum-silver">/100</span>
            </div>
          </div>
          <Progress
            value={performanceScore}
            className={cn(
              "h-1.5 rounded-full bg-grey-800",
              "[&>[data-state=progress]]:bg-gradient-to-r",
              performanceScore >= 90
                ? "[&>[data-state=progress]]:from-electric-lime [&>[data-state=progress]]:to-deep-emerald"
                : nft.performanceScore >= 80
                  ? "[&>[data-state=progress]]:from-royal-blue [&>[data-state=progress]]:to-deep-emerald"
                  : "[&>[data-state=progress]]:from-royal-gold [&>[data-state=progress]]:to-gold-600"
            )}
          />

          <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
            {nft.attributes
              .filter(
                (attr) =>
                  attr.trait_type !== "Price" && attr.trait_type !== "Role"
              )
              .slice(0, 3)
              .map((attr, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center bg-midnight-black rounded-lg py-2.5"
                >
                  <span className="text-platinum-silver mb-0.5">
                    {attr.trait_type}
                  </span>
                  <span className="font-semibold text-sm text-soft-white">
                    {attr.value}
                  </span>
                </div>
              ))}
          </div>

          <div className="space-x-2 mt-4 flex">
            {/* <Badge
              className="bg-neon-green/20 text-neon-green hover:bg-neon-green/30 cursor-pointer"
              onClick={() => {
                Badge click handler 
              }}>
              {nft.series}
            </Badge> */}
            <Link
              to="/matches"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input shadow-sm h-8 px-3 py-2 bg-neon-green/20 text-neon-green hover:bg-neon-green/30"
            >
              View Player
            </Link>
          </div>
        </CardContent>

        <CardFooter className="pt-0 pb-4">
          <div className="w-full flex justify-between items-center">
            <div>
              <p className="text-base font-bold text-soft-white">
                {nft.price} USDC
              </p>
              <p className="text-xs text-platinum-silver">${nft.price}</p>
            </div>
            <Button
              className="bg-gradient-to-r from-deep-emerald to-emerald-700 hover:from-emerald-700 hover:to-deep-emerald text-soft-white border-0 shadow-md shadow-emerald-500/20"
              onClick={() => onBuy(nft)}
              disabled={isOwner || !connected}
            >
              {isOwner ? "Owned" : "Buy Now"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// Featured collection carousel component
const FeaturedCollections = () => {
  const collections = [
    {
      id: 1,
      title: "IPL 2025 Star Players",
      description: "Exclusive collection of top-performing cricket players",
      floorPrice: 0.85,
      background:
        "bg-gradient-to-r from-royal-blue via-deep-emerald to-emerald-700",
      items: 24,
      volume: "138.5 ETH",
      image: "/players/featured_nft.jpg",
    },
    {
      id: 2,
      title: "Cricket World Cup Heroes",
      description: "Iconic moments from the World Cup history",
      floorPrice: 1.12,
      background:
        "bg-gradient-to-r from-royal-gold via-crimson-red to-royal-gold",
      items: 18,
      volume: "95.2 ETH",
      image: "/players/virat_kohli.jpg",
    },
    {
      id: 3,
      title: "T20 Powerhouses",
      description: "The most explosive T20 specialists",
      floorPrice: 0.65,
      background:
        "bg-gradient-to-r from-deep-emerald via-emerald-700 to-electric-lime",
      items: 32,
      volume: "76.8 ETH",
      image: "/players/ms_dhoni.jpg",
    },
  ];

  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % collections.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [collections.length]);

  return (
    <div className="relative">
      <div className="absolute -top-12 right-0 flex items-center gap-2">
        {collections.map((_, index) => (
          <button
            key={index}
            onClick={() => setActive(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              active === index
                ? "bg-neon-green w-8"
                : "bg-grey-300 dark:bg-gunmetal-grey"
            }`}
          />
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0.5, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0.5, x: -100 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div
              className={`${collections[active].background} h-[280px] w-full`}
            >
              <div className="absolute inset-0 flex items-center p-8">
                <div className="w-1/2">
                  <Badge className="mb-3 bg-soft-white/20 backdrop-blur-md text-soft-white border-none">
                    Featured Collection
                  </Badge>
                  <h3 className="text-2xl font-bold text-soft-white mb-2">
                    {collections[active].title}
                  </h3>
                  <p className="text-sm text-soft-white/80 mb-6">
                    {collections[active].description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-soft-white/10 backdrop-blur-md rounded-lg p-3">
                      <p className="text-soft-white/70 text-xs">Floor Price</p>
                      <p className="text-soft-white font-bold">
                        {collections[active].floorPrice} ETH
                      </p>
                    </div>
                    <div className="bg-soft-white/10 backdrop-blur-md rounded-lg p-3">
                      <p className="text-soft-white/70 text-xs">
                        Volume Traded
                      </p>
                      <p className="text-soft-white font-bold">
                        {collections[active].volume}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="bg-soft-white text-deep-emerald hover:bg-soft-white/90 rounded-full px-6"
                  >
                    View Collection <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>

                <div className="w-1/2 relative pl-6">
                  <div className="aspect-square rounded-2xl overflow-hidden border-4 border-soft-white/30 shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
                    <img
                      src={collections[active].image}
                      alt={collections[active].title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-5 -left-10 bg-soft-white/20 backdrop-blur-lg rounded-lg py-2 px-4 shadow-xl">
                    <p className="text-soft-white/80 text-xs">Items</p>
                    <p className="text-soft-white font-bold text-lg">
                      {collections[active].items}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Stats section component
const StatsSection = () => {
  const stats = [
    {
      label: "Total NFTs",
      value: "12,856",
      icon: <Activity size={20} className="text-neon-green" />,
    },
    {
      label: "Collections",
      value: "24",
      icon: <Bookmark size={20} className="text-royal-blue" />,
    },
    {
      label: "Active Traders",
      value: "6,492",
      icon: <TrendingUp size={20} className="text-deep-emerald" />,
    },
    {
      label: "Trading Volume",
      value: "485 ETH",
      icon: <Flame size={20} className="text-royal-gold" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          className="bg-gunmetal-grey rounded-xl p-4 shadow-md border border-grey-800"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-midnight-black rounded-lg">{stat.icon}</div>
            <div>
              <p className="text-2xl font-bold text-soft-white">{stat.value}</p>
              <p className="text-sm text-platinum-silver">{stat.label}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Live auctions section
const LiveAuctionsSection = () => {
  const auctions = [
    {
      name: "Virat Kohli",
      team: "Royal Challengers Bangalore",
      timeLeft: "02:14:36",
      currentBid: "1.85 ETH",
      image: "/players/virat_kohli.jpg",
      bidders: 12,
    },
    {
      name: "Rishabh Pant",
      team: "Delhi Capitals",
      timeLeft: "00:45:12",
      currentBid: "1.15 ETH",
      image: "/players/rishabh_pant.jpg",
      bidders: 8,
    },
  ];

  return (
    <div className="bg-gradient-to-r from-crimson-red/10 to-royal-gold/10 rounded-xl p-6 mt-10 border border-grey-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-crimson-red rounded-lg">
            <Zap size={18} className="text-soft-white" />
          </div>
          <h3 className="text-xl font-bold text-soft-white">Live Auctions</h3>
        </div>
        <Button
          variant="outline"
          className="rounded-full border-grey-700 text-soft-white hover:bg-grey-800"
        >
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {auctions.map((auction, idx) => (
          <div
            key={idx}
            className="bg-gunmetal-grey rounded-xl p-3 shadow-md border border-grey-800 flex overflow-hidden"
          >
            <div className="w-24 h-24 rounded-lg overflow-hidden">
              <img
                src={auction.image}
                alt={auction.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 ml-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-soft-white">
                    {auction.name}
                  </h4>
                  <p className="text-xs text-platinum-silver">{auction.team}</p>
                </div>
                <Badge className="bg-crimson-red text-soft-white">
                  {auction.bidders} bidders
                </Badge>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <div>
                  <p className="text-xs text-platinum-silver">Current bid</p>
                  <p className="font-semibold text-soft-white">
                    {auction.currentBid}
                  </p>
                </div>
                <Separator orientation="vertical" className="h-8 bg-grey-700" />
                <div>
                  <p className="text-xs text-platinum-silver">Ends in</p>
                  <div className="flex items-center gap-1 text-crimson-red">
                    <Clock size={14} />
                    <p className="font-semibold">{auction.timeLeft}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function NFTMarketplace() {
  const {
    nfts,
    loading,
    error,
    purchaseNFT,
    createNFTCollection,
    mintPlayerNFT,
    isAdmin,
    collectionAddress,
  } = useNFT();
  const { connected, publicKey } = useWallet();

  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);

  const tokenOptions = [
    {
      mint: "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr",
      symbol: "MockUSDC",
      name: "Mock USDC",
    },
    {
      mint: "So11111111111111111111111111111111111111112",
      symbol: "SOL",
      name: "Solana",
    },
    {
      mint: "USDC1111111111111111111111111111111111111111",
      symbol: "USDC",
      name: "USD Coin",
    },
    {
      mint: "DA11111111111111111111111111111111111111111",
      symbol: "DAI",
      name: "Dai",
    },
    // Add more tokens as needed
  ];

  // Handle NFT purchase
  const handleBuyNFT = async (nft) => {
    if (!connected) {
      return;
    }

    setIsPurchasing(true);
    try {
      await purchaseNFT(nft);
    } catch (error) {
      console.error("Error purchasing NFT:", error);
    } finally {
      setIsPurchasing(false);
    }
  };

  // Handle collection creation - for admin only
  const handleCreateCollection = async () => {
    if (!isAdmin()) return;

    setIsCreatingCollection(true);
    try {
      await createNFTCollection();
    } catch (error) {
      console.error("Error creating collection:", error);
    } finally {
      setIsCreatingCollection(false);
    }
  };

  // Handle NFT minting - for admin only
  const handleMintNFT = async (player) => {
    if (!isAdmin()) return;

    setIsMinting(true);
    try {
      // Example for minting the first player as an NFT
      await mintPlayerNFT({
        name: player.name,
        image: player.image,
        description: player.description,
        team: player.team,
        attributes: player.attributes,
        price: player.price,
      });
    } catch (error) {
      console.error("Error minting NFT:", error);
    } finally {
      setIsMinting(false);
    }
  };

  // Filter NFTs based on search query and type
  const filteredNFTs = nfts.filter((nft) => {
    // Filter by search query
    if (
      searchQuery &&
      !nft.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by rarity
    const performanceScore =
      nft.attributes
        .filter(
          (attr) => !isNaN(Number(attr.value)) && attr.trait_type !== "Price"
        )
        .reduce((sum, attr) => sum + parseInt(attr.value), 0) /
        nft.attributes.filter(
          (attr) => !isNaN(Number(attr.value)) && attr.trait_type !== "Price"
        ).length || 80;

    if (filter === "legendary" && performanceScore < 90) return false;
    if (filter === "epic" && (performanceScore < 80 || performanceScore >= 90))
      return false;
    if (filter === "rare" && performanceScore >= 80) return false;

    return true;
  });

  // Sort NFTs
  const sortedNFTs = [...filteredNFTs].sort((a, b) => {
    if (sort === "price-low") return a.price - b.price;
    if (sort === "price-high") return b.price - a.price;
    if (sort === "performance") {
      const aPerformance =
        a.attributes
          .filter(
            (attr) => !isNaN(Number(attr.value)) && attr.trait_type !== "Price"
          )
          .reduce((sum, attr) => sum + parseInt(attr.value), 0) /
          a.attributes.filter(
            (attr) => !isNaN(Number(attr.value)) && attr.trait_type !== "Price"
          ).length || 0;

      const bPerformance =
        b.attributes
          .filter(
            (attr) => !isNaN(Number(attr.value)) && attr.trait_type !== "Price"
          )
          .reduce((sum, attr) => sum + parseInt(attr.value), 0) /
          b.attributes.filter(
            (attr) => !isNaN(Number(attr.value)) && attr.trait_type !== "Price"
          ).length || 0;

      return bPerformance - aPerformance;
    }
    // Default sort by recent (id)
    return b.id.localeCompare(a.id);
  });

  return (
    <div className="min-h-screen bg-midnight-black text-soft-white">
      {/* Trending ticker */}
      <TrendingMarquee />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero section with depth and dimension */}
        <div className="relative rounded-2xl overflow-hidden mb-12">
          <div className="absolute inset-0 bg-gradient-to-br from-royal-blue via-deep-emerald to-emerald-700" />
          <div className="absolute inset-0 opacity-30 mix-blend-soft-light bg-[radial-gradient(circle_at_50%_0%,hsl(0,0%,40%),transparent)]" />

          <div className="relative z-10 px-8 py-16 md:py-24 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-soft-white mb-10 md:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge className="mb-4 bg-soft-white/20 backdrop-blur-md text-soft-white border-none px-3 py-1 text-sm">
                  IPL 2025 SEASON
                </Badge>

                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
                  Own{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-royal-gold to-gold-400">
                    Legendary
                  </span>{" "}
                  Cricket Moments
                </h1>

                <p className="text-xl text-soft-white/90 max-w-xl mb-8 leading-relaxed">
                  Collect, trade, and own exclusive digital collectibles of your
                  favorite cricket players on the Solana blockchain. Commission
                  goes to the players themselves!
                </p>

                <div className="flex flex-wrap gap-4">
                  {connected ? (
                    <Button
                      size="lg"
                      className="bg-soft-white text-deep-emerald hover:bg-soft-white/90 rounded-full px-8 py-6"
                      onClick={() =>
                        window.scrollTo({
                          top: document.getElementById("explore-nfts")
                            ?.offsetTop,
                          behavior: "smooth",
                        })
                      }
                    >
                      Start Collecting
                    </Button>
                  ) : (
                    <div className="px-2 py-1 bg-transparent rounded-full shadow-lg">
                      <WalletMultiButton />
                    </div>
                  )}
                  {isAdmin() && (
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-soft-white text-soft-white hover:bg-soft-white/10 rounded-full px-8 py-6"
                      onClick={handleCreateCollection}
                      disabled={isCreatingCollection}
                    >
                      {isCreatingCollection ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Collection...
                        </>
                      ) : (
                        "Create Collection"
                      )}
                    </Button>
                  )}
                </div>

                {collectionAddress && (
                  <p className="mt-4 text-sm text-soft-white/70">
                    Collection Address:{" "}
                    <span className="text-soft-white/90 font-mono text-xs">
                      {collectionAddress}
                    </span>
                  </p>
                )}
              </motion.div>
            </div>

            <div className="md:w-1/2 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative z-10"
              >
                {/* Premium NFT Card */}
                <div className="relative mx-auto max-w-sm">
                  {/* Animated glow effect */}
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-royal-gold via-soft-white to-neon-green opacity-75 blur-lg group-hover:opacity-100 animate-pulse-glow"></div>

                  {/* Outer frame with premium gold gradient */}
                  <div className="relative rounded-2xl p-1.5 bg-gradient-to-r from-royal-gold via-gold-400 to-royal-gold shadow-[0_0_25px_rgba(255,215,0,0.5)]">
                    {/* Inner content */}
                    <div className="relative rounded-xl overflow-hidden">
                      {/* Badge overlay */}
                      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full">
                          <Star className="h-4 w-4 text-royal-gold fill-royal-gold" />
                          <span className="text-xs font-bold text-soft-white">
                            NFT COLLECTION
                          </span>
                        </div>
                      </div>

                      {/* Price tag overlay */}
                      <div className="absolute bottom-4 left-4 z-20">
                        <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-2 rounded-lg">
                          <span className="text-xs text-soft-white/80">
                            Cricket Stars
                          </span>
                          <span className="text-base font-bold text-royal-gold">
                            Exclusive NFTs
                          </span>
                        </div>
                      </div>

                      {/* Limited edition overlay */}
                      <div className="absolute top-4 right-4 z-20">
                        <div className="bg-crimson-red/90 px-2.5 py-1 rounded-full text-xs font-bold text-soft-white">
                          On Solana
                        </div>
                      </div>

                      {/* NFT Image with hover effect */}
                      <div className="aspect-[4/5] relative group">
                        <img
                          src="/players/featured_nft.jpg"
                          alt="Featured NFT"
                          className="w-full h-full object-cover transform transition-all duration-700 group-hover:scale-110"
                        />

                        {/* Image overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>

                        {/* Bottom content overlay */}
                        <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col gap-1">
                          <h3 className="text-xl font-bold text-soft-white drop-shadow-md">
                            Cricket Player NFTs
                          </h3>
                          <p className="text-sm text-soft-white/90 drop-shadow-md">
                            World&apos;s Most Valuable Cricket NFT
                          </p>

                          <div className="mt-2 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-soft-white/20 backdrop-blur-md flex items-center justify-center">
                                <div className="w-5 h-5 rounded-full bg-royal-gold flex items-center justify-center">
                                  <Flame className="h-3 w-3 text-midnight-black" />
                                </div>
                              </div>
                              <span className="text-xs text-soft-white/80">
                                Powered by Metaplex
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3D effect elements */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br from-royal-gold to-crimson-red blur-xl opacity-60 animate-pulse"></div>
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-gradient-to-br from-royal-blue to-deep-emerald blur-xl opacity-60 animate-pulse"></div>

                  {/* Reflection effect */}
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-gradient-to-r from-transparent via-royal-gold/50 to-transparent"></div>
                  <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 w-3/5 h-[1px] bg-gradient-to-r from-transparent via-royal-gold/20 to-transparent"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <StatsSection />

        {/* Featured collections */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-soft-white">
            Featured Collections
          </h2>
          <FeaturedCollections />
        </div>

        {/* Live auctions */}
        <LiveAuctionsSection />

        {/* Filters and search */}
        <div id="explore-nfts" className="mt-16 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-soft-white">
            Explore NFTs
          </h2>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex-1 w-full lg:max-w-md">
              <div className="relative">
                <Input
                  placeholder="Search players, teams or collections..."
                  className="pl-10 rounded-full border-gunmetal-grey focus:ring-2 focus:ring-neon-green/30 bg-gunmetal-grey text-soft-white placeholder:text-grey-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              <Tabs
                defaultValue="all"
                className="w-full lg:w-auto"
                onValueChange={setFilter}
                value={filter}
              >
                <TabsList className="bg-midnight-black p-1 rounded-full border border-gunmetal-grey">
                  <TabsTrigger
                    value="all"
                    className="rounded-full px-4 text-soft-white data-[state=active]:bg-deep-emerald data-[state=active]:text-soft-white"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="legendary"
                    className="rounded-full px-4 text-soft-white data-[state=active]:bg-deep-emerald data-[state=active]:text-soft-white"
                  >
                    Legendary
                  </TabsTrigger>
                  <TabsTrigger
                    value="epic"
                    className="rounded-full px-4 text-soft-white data-[state=active]:bg-deep-emerald data-[state=active]:text-soft-white"
                  >
                    Epic
                  </TabsTrigger>
                  <TabsTrigger
                    value="rare"
                    className="rounded-full px-4 text-soft-white data-[state=active]:bg-deep-emerald data-[state=active]:text-soft-white"
                  >
                    Rare
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex gap-2 rounded-full border-gunmetal-grey bg-midnight-black text-soft-white hover:bg-gunmetal-grey"
                  >
                    <Filter size={16} />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-xl bg-gunmetal-grey border-grey-800"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="text-soft-white hover:bg-grey-800"
                      onClick={() => setFilter("all")}
                    >
                      All NFTs
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-soft-white hover:bg-grey-800"
                      onClick={() => setFilter("legendary")}
                    >
                      Legendary
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-soft-white hover:bg-grey-800"
                      onClick={() => setFilter("epic")}
                    >
                      Epic
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-soft-white hover:bg-grey-800"
                      onClick={() => setFilter("rare")}
                    >
                      Rare
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex gap-2 rounded-full border-gunmetal-grey bg-midnight-black text-soft-white hover:bg-gunmetal-grey"
                  >
                    <ArrowUpDown size={16} />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-xl bg-gunmetal-grey border-grey-800"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="text-soft-white hover:bg-grey-800"
                      onClick={() => setSort("recent")}
                    >
                      Recently added
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-soft-white hover:bg-grey-800"
                      onClick={() => setSort("price-low")}
                    >
                      Price: Low to High
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-soft-white hover:bg-grey-800"
                      onClick={() => setSort("price-high")}
                    >
                      Price: High to Low
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-soft-white hover:bg-grey-800"
                      onClick={() => setSort("performance")}
                    >
                      Performance score
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* NFT Grid with staggered animation */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-deep-emerald" />
            <span className="ml-4 text-soft-white text-lg">
              Loading NFTs...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedNFTs.length > 0 ? (
              sortedNFTs.map((nft, index) => (
                <motion.div
                  key={nft.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <NFTCard nft={nft} onBuy={handleBuyNFT} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center py-16">
                <p className="text-platinum-silver text-lg">
                  No NFTs found matching your criteria.
                </p>
              </div>
            )}
          </div>
        )}

        {isAdmin() && (
          <div className="mt-12 flex justify-center">
            <Button
              className="bg-gradient-to-r from-royal-gold to-gold-400 hover:from-gold-400 hover:to-royal-gold text-midnight-black rounded-full px-8 shadow-lg"
              onClick={() =>
                handleMintNFT({
                  name: "Virat Kohli",
                  image: "/players/virat_kohli.jpg",
                  description:
                    "One of the greatest batsmen in cricket history.",
                  team: "RCB",
                  price: 10,
                  attributes: [
                    { trait_type: "Role", value: "Batsman" },
                    { trait_type: "Batting", value: "95" },
                    { trait_type: "Fielding", value: "88" },
                  ],
                })
              }
              disabled={isMinting || !collectionAddress}
            >
              {isMinting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Minting NFT...
                </>
              ) : (
                "Mint New Player NFT"
              )}
            </Button>
          </div>
        )}

        {/* CTA section with token selection dropdown */}
        <div className="mt-20 mb-10 bg-gradient-to-r from-deep-emerald to-emerald-700 rounded-2xl overflow-hidden">
          <div className="relative px-8 py-12 text-soft-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(57,255,20,0.15),transparent)]"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">
                  Ready to start your NFT collection?
                </h3>
                <p className="text-soft-white/80 max-w-md">
                  Join thousands of cricket fans collecting and trading unique
                  digital player cards on Solana using any SPL token.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {connected && (
                  <div className="flex items-center gap-2">
                    <span className="text-soft-white">Pay with:</span>
                    <select
                      className="px-3 py-2 rounded-lg bg-gunmetal-grey border border-grey-800 text-soft-white"
                      value={selectedToken?.symbol}
                      onChange={(e) => {
                        const token = tokenOptions.find(
                          (t) => t.symbol === e.target.value
                        );
                        if (token) setSelectedToken(token);
                      }}
                    >
                      {tokenOptions.map((token) => (
                        <option key={token.mint} value={token.symbol}>
                          {token.name} ({token.symbol})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {!connected ? (
                  <div className="px-3 py-2 bg-transparent rounded-full shadow-lg">
                    <WalletMultiButton />
                  </div>
                ) : (
                  <Button
                    size="lg"
                    className="bg-gunmetal-grey text-neon-green hover:bg-grey-800 rounded-full px-8 shadow-lg"
                    onClick={() =>
                      window.scrollTo({
                        top: document.getElementById("explore-nfts")?.offsetTop,
                        behavior: "smooth",
                      })
                    }
                  >
                    Explore NFTs
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 pt-10 pb-24 border-t border-gunmetal-grey">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Logo and tag line */}
              <div className="md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-neon-green rounded-full flex items-center justify-center">
                    <Zap className="h-5 w-5 text-midnight-black" />
                  </div>
                  <span className="font-bold text-xl text-soft-white">
                    Strike
                  </span>
                </div>
                <p className="text-sm text-platinum-silver mb-6">
                  The ultimate fantasy cricket platform with exclusive NFTs and
                  immersive gameplay
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-8 w-8 border-gunmetal-grey"
                  >
                    <Globe size={16} className="text-soft-white" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-8 w-8 border-gunmetal-grey"
                  >
                    <svg
                      width="16"
                      height="16"
                      className="text-soft-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22 5.92375C21.2563 6.25 20.4637 6.46625 19.6375 6.57125C20.4875 6.06375 21.1363 5.26625 21.4412 4.305C20.6488 4.7775 19.7738 5.11125 18.8412 5.2975C18.0887 4.49625 17.0162 4 15.8462 4C13.5763 4 11.7487 5.8425 11.7487 8.10125C11.7487 8.42625 11.7762 8.73875 11.8438 9.03625C8.435 8.87 5.41875 7.23625 3.3925 4.7475C3.03875 5.36125 2.83125 6.06375 2.83125 6.82C2.83125 8.23875 3.5625 9.49875 4.6525 10.2275C3.99375 10.2150 3.3475 10.0225 2.8 9.7225C2.8 9.735 2.8 9.75125 2.8 9.7675C2.8 11.76 4.22125 13.415 6.085 13.7962C5.75125 13.8875 5.3875 13.9312 5.01 13.9312C4.7475 13.9312 4.4825 13.9163 4.23375 13.8612C4.765 15.485 6.2725 16.6788 8.065 16.7175C6.67 17.8088 4.89875 18.4662 2.98125 18.4662C2.645 18.4662 2.3225 18.4513 2 18.41C3.81625 19.5813 5.96875 20.25 8.29 20.25C15.835 20.25 19.96 13.9988 19.96 8.5825C19.96 8.40125 19.9538 8.22625 19.945 8.0525C20.7588 7.475 21.4425 6.75375 22 5.92375Z"
                        fill="currentColor"
                      />
                    </svg>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-8 w-8 border-gunmetal-grey"
                  >
                    <svg
                      width="16"
                      height="16"
                      className="text-soft-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.5 3C14.76 3 13.09 3.81 12 5.09C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.42 2 8.5C2 12.28 5.4 15.36 10.55 20.04L12 21.35L13.45 20.03C18.6 15.36 22 12.28 22 8.5C22 8.40125 22 8.22625 22 8.0525C20.7588 7.475 21.4425 6.75375 22 5.92375Z"
                        fill="currentColor"
                      />
                    </svg>
                  </Button>
                </div>
              </div>

              {/* Quick links */}
              <div className="md:col-span-1">
                <h4 className="font-bold text-soft-white mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/home"
                      className="text-platinum-silver hover:text-neon-green transition-colors text-sm"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/matches"
                      className="text-platinum-silver hover:text-neon-green transition-colors text-sm"
                    >
                      Matches
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/leagues"
                      className="text-platinum-silver hover:text-neon-green transition-colors text-sm"
                    >
                      Leagues
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/players"
                      className="text-platinum-silver hover:text-neon-green transition-colors text-sm"
                    >
                      Players
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Features */}
              <div className="md:col-span-1">
                <h4 className="font-bold text-soft-white mb-4">Features</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Trophy size={14} className="text-neon-green" />
                    <span className="text-platinum-silver text-sm">
                      Fantasy Contests
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Users size={14} className="text-neon-green" />
                    <span className="text-platinum-silver text-sm">
                      Private Leagues
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Flame size={14} className="text-neon-green" />
                    <span className="text-platinum-silver text-sm">
                      Cricket NFTs
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star size={14} className="text-neon-green" />
                    <span className="text-platinum-silver text-sm">
                      Live Scoring
                    </span>
                  </li>
                </ul>
              </div>

              {/* Help & support */}
              <div className="md:col-span-1">
                <h4 className="font-bold text-soft-white mb-4">Support</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <HelpCircle size={14} className="text-neon-green" />
                    <span className="text-platinum-silver text-sm">
                      Help Center
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield size={14} className="text-neon-green" />
                    <span className="text-platinum-silver text-sm">
                      Privacy Policy
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      width="14"
                      height="14"
                      className="text-neon-green"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2ZM18 11.09C18 15.09 15.45 18.79 12 19.92C8.55 18.79 6 15.1 6 11.09V6.39L12 4.14L18 6.39V11.09Z"
                        fill="currentColor"
                      />
                      <path d="M13 10H11V16H13V10Z" fill="currentColor" />
                      <path d="M13 7H11V9H13V7Z" fill="currentColor" />
                    </svg>
                    <span className="text-platinum-silver text-sm">
                      Legal Terms
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      width="14"
                      height="14"
                      className="text-neon-green"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="text-platinum-silver text-sm">
                      Contact Us
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gunmetal-grey flex flex-col md:flex-row justify-between items-center">
              <p className="text-xs text-platinum-silver mb-4 md:mb-0">
                © 2025 Strike Fantasy Sports. All rights reserved.
              </p>
              <div className="text-xs text-platinum-silver">
                <span className="bg-neon-green/20 text-neon-green px-2 py-1 rounded font-medium">
                  BETA
                </span>
                <span className="ml-2">Version 2.5.4</span>
              </div>
            </div>
          </div>
        </footer>

        {/* Include the Navbar component for consistent navigation */}
        <Navbar />
      </div>
    </div>
  );
}
