// Mock data for our fantasy cricket app
// In a real app, this would be fetched from an API

// Team logos
export const teamLogos = {
  india: "https://www.cricbuzz.com/a/img/v1/72x54/i1/c172115/india.jpg",
  australia: "https://www.cricbuzz.com/a/img/v1/72x54/i1/c172119/australia.jpg",
  england: "https://www.cricbuzz.com/a/img/v1/72x54/i1/c172116/england.jpg",
  newZealand:
    "https://www.cricbuzz.com/a/img/v1/72x54/i1/c172124/new-zealand.jpg",
  southAfrica:
    "https://www.cricbuzz.com/a/img/v1/72x54/i1/c172118/south-africa.jpg",
  pakistan: "https://www.cricbuzz.com/a/img/v1/72x54/i1/c172122/pakistan.jpg",
  westIndies:
    "https://www.cricbuzz.com/a/img/v1/72x54/i1/c172123/west-indies.jpg",
  bangladesh:
    "https://www.cricbuzz.com/a/img/v1/72x54/i1/c172120/bangladesh.jpg",
  rcb: "https://www.cricbuzz.com/a/img/v1/72x54/i1/c180950/royal-challengers-bangalore.jpg",
  csk: "https://www.cricbuzz.com/a/img/v1/72x54/i1/c180951/chennai-super-kings.jpg",
  mi: "https://www.cricbuzz.com/a/img/v1/72x54/i1/c180954/mumbai-indians.jpg",
  kkr: "https://www.cricbuzz.com/a/img/v1/72x54/i1/c180953/kolkata-knight-riders.jpg",
  dc: "https://www.cricbuzz.com/a/img/v1/72x54/i1/c180952/delhi-capitals.jpg",
  srh: "https://www.cricbuzz.com/a/img/v1/72x54/i1/c180955/sunrisers-hyderabad.jpg",
};

// Country flags
export const countryFlags = {
  india: "https://www.countryflags.io/in/flat/64.png",
  australia: "https://www.countryflags.io/au/flat/64.png",
  england: "https://www.countryflags.io/gb/flat/64.png",
  newZealand: "https://www.countryflags.io/nz/flat/64.png",
  southAfrica: "https://www.countryflags.io/za/flat/64.png",
  pakistan: "https://www.countryflags.io/pk/flat/64.png",
  westIndies: "https://www.countryflags.io/bb/flat/64.png", // Using Barbados flag for West Indies
  bangladesh: "https://www.countryflags.io/bd/flat/64.png",
};

// Since the country flags API might not work, let's provide fallbacks
const fallbackFlags = {
  india:
    "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/1200px-Flag_of_India.svg.png",
  australia:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Flag_of_Australia_%28converted%29.svg/1200px-Flag_of_Australia_%28converted%29.svg.png",
  england:
    "https://upload.wikimedia.org/wikipedia/en/thumb/b/be/Flag_of_England.svg/1200px-Flag_of_England.svg.png",
  newZealand:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Flag_of_New_Zealand.svg/1200px-Flag_of_New_Zealand.svg.png",
  southAfrica:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Flag_of_South_Africa.svg/1200px-Flag_of_South_Africa.svg.png",
  pakistan:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Flag_of_Pakistan.svg/1200px-Flag_of_Pakistan.svg.png",
  westIndies:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Flag_of_the_West_Indies_Cricket_Team.svg/1200px-Flag_of_the_West_Indies_Cricket_Team.svg.png",
  bangladesh:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Flag_of_Bangladesh.svg/1200px-Flag_of_Bangladesh.svg.png",
};

// Use the fallback flags instead of API
Object.keys(countryFlags).forEach((key) => {
  countryFlags[key as keyof typeof countryFlags] =
    fallbackFlags[key as keyof typeof fallbackFlags];
});

// Player images
export const playerImages = {
  viratKohli:
    "https://www.cricbuzz.com/a/img/v1/152x152/i1/c170661/virat-kohli.jpg",
  rohitSharma:
    "https://www.cricbuzz.com/a/img/v1/152x152/i1/c170658/rohit-sharma.jpg",
  jaspritBumrah:
    "https://www.cricbuzz.com/a/img/v1/152x152/i1/c170685/jasprit-bumrah.jpg",
  steveSmith:
    "https://www.cricbuzz.com/a/img/v1/152x152/i1/c170624/steven-smith.jpg",
  patCummins:
    "https://www.cricbuzz.com/a/img/v1/152x152/i1/c170651/pat-cummins.jpg",
  joeRoot: "https://www.cricbuzz.com/a/img/v1/152x152/i1/c170942/joe-root.jpg",
  benStokes:
    "https://www.cricbuzz.com/a/img/v1/152x152/i1/c170845/ben-stokes.jpg",
  kaneWilliamson:
    "https://www.cricbuzz.com/a/img/v1/152x152/i1/c170733/kane-williamson.jpg",
  trentBoult:
    "https://www.cricbuzz.com/a/img/v1/152x152/i1/c170752/trent-boult.jpg",
};

// More realistic player photos in case the above don't work
const fallbackPlayerImages = {
  viratKohli:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Virat_Kohli_2018.jpg/330px-Virat_Kohli_2018.jpg",
  rohitSharma:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Rohit_Sharma_2021.jpg/330px-Rohit_Sharma_2021.jpg",
  jaspritBumrah:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Jasprit_Bumrah_%28cropped%29.jpg/330px-Jasprit_Bumrah_%28cropped%29.jpg",
  steveSmith:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Steven_Smith_2014.jpg/330px-Steven_Smith_2014.jpg",
  patCummins:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Pat_Cummins_2018.jpg/330px-Pat_Cummins_2018.jpg",
  joeRoot:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Joe_Root_2019.jpg/330px-Joe_Root_2019.jpg",
  benStokes:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Ben_Stokes_2019.jpg/330px-Ben_Stokes_2019.jpg",
  kaneWilliamson:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Kane_Williamson_2018.jpg/330px-Kane_Williamson_2018.jpg",
  trentBoult:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Trent_Boult_2016.jpg/330px-Trent_Boult_2016.jpg",
};

// Use the fallback player images
Object.keys(playerImages).forEach((key) => {
  playerImages[key as keyof typeof playerImages] =
    fallbackPlayerImages[key as keyof typeof fallbackPlayerImages];
});

// Mock players data
export const players = [
  {
    id: "p1",
    name: "Virat Kohli",
    fullName: "Virat Kohli",
    team: "Royal Challengers Bangalore",
    teamLogo: teamLogos.rcb,
    position: "Batsman",
    image: playerImages.viratKohli,
    country: "India",
    countryFlag: countryFlags.india,
    stats: {
      matches: 274,
      runs: 11414,
      average: 41.95,
      strikeRate: 135.93,
    },
    points: 837,
  },
  {
    id: "p2",
    name: "Rohit Sharma",
    fullName: "Rohit Sharma",
    team: "Mumbai Indians",
    teamLogo: teamLogos.mi,
    position: "Batsman",
    image: playerImages.rohitSharma,
    country: "India",
    countryFlag: countryFlags.india,
    stats: {
      matches: 248,
      runs: 6112,
      average: 30.25,
      strikeRate: 130.4,
    },
    points: 781,
  },
  {
    id: "p3",
    name: "J. Bumrah",
    fullName: "Jasprit Bumrah",
    team: "Mumbai Indians",
    teamLogo: teamLogos.mi,
    position: "Bowler",
    image: playerImages.jaspritBumrah,
    country: "India",
    countryFlag: countryFlags.india,
    stats: {
      matches: 120,
      wickets: 170,
      economy: 7.42,
      average: 23.27,
    },
    points: 802,
  },
  {
    id: "p4",
    name: "S. Smith",
    fullName: "Steven Smith",
    team: "Delhi Capitals",
    teamLogo: teamLogos.dc,
    position: "Batsman",
    image: playerImages.steveSmith,
    country: "Australia",
    countryFlag: countryFlags.australia,
    stats: {
      matches: 115,
      runs: 2876,
      average: 35.25,
      strikeRate: 129.1,
    },
    points: 721,
  },
  {
    id: "p5",
    name: "P. Cummins",
    fullName: "Pat Cummins",
    team: "Kolkata Knight Riders",
    teamLogo: teamLogos.kkr,
    position: "Bowler",
    image: playerImages.patCummins,
    country: "Australia",
    countryFlag: countryFlags.australia,
    stats: {
      matches: 50,
      wickets: 72,
      economy: 8.21,
      average: 27.18,
    },
    points: 695,
  },
  {
    id: "p6",
    name: "J. Root",
    fullName: "Joe Root",
    team: "Punjab Kings",
    teamLogo: teamLogos.rcb, // Using RCB logo as placeholder
    position: "Batsman",
    image: playerImages.joeRoot,
    country: "England",
    countryFlag: countryFlags.england,
    stats: {
      matches: 89,
      runs: 2569,
      average: 37.2,
      strikeRate: 126.5,
    },
    points: 685,
  },
  {
    id: "p7",
    name: "B. Stokes",
    fullName: "Ben Stokes",
    team: "Chennai Super Kings",
    teamLogo: teamLogos.csk,
    position: "All-rounder",
    image: playerImages.benStokes,
    country: "England",
    countryFlag: countryFlags.england,
    stats: {
      matches: 95,
      runs: 2142,
      wickets: 82,
      average: 32.8,
      economy: 8.76,
      strikeRate: 134.9,
    },
    points: 758,
  },
  {
    id: "p8",
    name: "K. Williamson",
    fullName: "Kane Williamson",
    team: "Sunrisers Hyderabad",
    teamLogo: teamLogos.srh,
    position: "Batsman",
    image: playerImages.kaneWilliamson,
    country: "New Zealand",
    countryFlag: countryFlags.newZealand,
    stats: {
      matches: 108,
      runs: 2932,
      average: 39.1,
      strikeRate: 127.2,
    },
    points: 724,
  },
  {
    id: "p9",
    name: "T. Boult",
    fullName: "Trent Boult",
    team: "Mumbai Indians",
    teamLogo: teamLogos.mi,
    position: "Bowler",
    image: playerImages.trentBoult,
    country: "New Zealand",
    countryFlag: countryFlags.newZealand,
    stats: {
      matches: 91,
      wickets: 126,
      economy: 7.97,
      average: 24.3,
    },
    points: 713,
  },
];

// Mock leagues data
export const leagues = [
  {
    id: "l1",
    name: "IPL Fantasy League",
    participants: 14726,
    prize: "₹1,000,000",
    startDate: "Apr 5, 2023",
    endDate: "May 28, 2023",
    joined: true,
    position: 456,
    userPoints: 1245,
  },
  {
    id: "l2",
    name: "World Cup Challenge",
    participants: 32190,
    prize: "₹2,500,000",
    startDate: "June 10, 2023",
    endDate: "July 15, 2023",
  },
  {
    id: "l3",
    name: "Friends Premier League",
    participants: 24,
    startDate: "Apr 8, 2023",
    endDate: "May 28, 2023",
    joined: true,
    position: 3,
    userPoints: 1567,
  },
];

// Mock teams data
export const teams = [
  {
    id: "t1",
    name: "Super Strikers",
    captain: "V. Kohli",
    captainImage: playerImages.viratKohli,
    viceCaptain: "R. Sharma",
    viceCaptainImage: playerImages.rohitSharma,
    points: 1856,
    rank: 14523,
    totalPlayers: 11,
  },
  {
    id: "t2",
    name: "Thunder Bolts",
    captain: "J. Bumrah",
    captainImage: playerImages.jaspritBumrah,
    viceCaptain: "B. Stokes",
    viceCaptainImage: playerImages.benStokes,
    points: 1743,
    rank: 23651,
    totalPlayers: 11,
  },
];

// Mock player stats categories
export const playerStatsCategories = [
  {
    name: "Most Runs",
    players: players
      .filter((p) => p.stats.runs)
      .sort((a, b) => (b.stats.runs || 0) - (a.stats.runs || 0))
      .slice(0, 5),
  },
  {
    name: "Most Wickets",
    players: players
      .filter((p) => p.stats.wickets)
      .sort((a, b) => (b.stats.wickets || 0) - (a.stats.wickets || 0))
      .slice(0, 5),
  },
  {
    name: "Best Batting Average",
    players: players
      .filter((p) => p.stats.average)
      .sort((a, b) => (b.stats.average || 0) - (a.stats.average || 0))
      .slice(0, 5),
  },
  {
    name: "Best Bowling Economy",
    players: players
      .filter((p) => p.stats.economy)
      .sort((a, b) => (a.stats.economy || 0) - (b.stats.economy || 0))
      .slice(0, 5),
  },
];

// Mock notifications
export const notifications = [
  {
    id: "n1",
    title: "Match Starting",
    message: "RCB vs DC starts in 30 minutes!",
    timestamp: "15 mins ago",
    read: false,
  },
  {
    id: "n2",
    title: "Player Update",
    message: "Virat Kohli scored 82 runs in 47 balls",
    timestamp: "2 hours ago",
    read: true,
  },
  {
    id: "n3",
    title: "League Update",
    message: "You moved up 25 positions in IPL Fantasy League",
    timestamp: "5 hours ago",
    read: true,
  },
];
