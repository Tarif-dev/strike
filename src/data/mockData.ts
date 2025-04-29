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

// Create extended player mock data with 11 players for each team in sample match
// Following fantasy rules - 5 batsmen, 4 bowlers, 2 all-rounders per team
export const extendedPlayers = {
  // Mumbai Indians squad - 11 players (5 batsmen, 4 bowlers, 2 all-rounders)
  mi: [
    {
      id: "mi-bat-1",
      name: "Rohit Sharma",
      fullName: "Rohit Sharma",
      team: "Mumbai Indians",
      teamLogo: teamLogos.mi,
      position: "Batsman",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/6.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 243,
        runs: 6211,
        average: 30.2,
        strikeRate: 130.4,
      },
      points: 845,
    },
    {
      id: "mi-bat-2",
      name: "Ishan Kishan",
      fullName: "Ishan Kishan",
      team: "Mumbai Indians",
      teamLogo: teamLogos.mi,
      position: "Batsman",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/164.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 96,
        runs: 2324,
        average: 28.7,
        strikeRate: 136.8,
      },
      points: 765,
    },
    {
      id: "mi-bat-3",
      name: "Suryakumar Yadav",
      fullName: "Suryakumar Yadav",
      team: "Mumbai Indians",
      teamLogo: teamLogos.mi,
      position: "Batsman",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/108.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 139,
        runs: 3249,
        average: 32.5,
        strikeRate: 143.2,
      },
      points: 805,
    },
    {
      id: "mi-bat-4",
      name: "Tilak Varma",
      fullName: "Tilak Varma",
      team: "Mumbai Indians",
      teamLogo: teamLogos.mi,
      position: "Batsman",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/993.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 32,
        runs: 856,
        average: 30.6,
        strikeRate: 142.6,
      },
      points: 725,
    },
    {
      id: "mi-bat-5",
      name: "Tim David",
      fullName: "Timothy David",
      team: "Mumbai Indians",
      teamLogo: teamLogos.mi,
      position: "Batsman",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/636.png",
      country: "Australia",
      countryFlag: countryFlags.australia,
      stats: {
        matches: 38,
        runs: 643,
        average: 26.8,
        strikeRate: 158.9,
      },
      points: 715,
    },
    {
      id: "mi-all-1",
      name: "H. Pandya",
      fullName: "Hardik Pandya",
      team: "Mumbai Indians",
      teamLogo: teamLogos.mi,
      position: "All-rounder",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/54.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 127,
        runs: 2309,
        wickets: 53,
        average: 30.4,
        economy: 8.76,
        strikeRate: 147.6,
      },
      points: 875,
    },
    {
      id: "mi-all-2",
      name: "Naman Dhir",
      fullName: "Naman Dhir",
      team: "Mumbai Indians",
      teamLogo: teamLogos.mi,
      position: "All-rounder",
      image: null,
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 12,
        runs: 215,
        wickets: 8,
        average: 21.5,
        economy: 8.9,
        strikeRate: 132.7,
      },
      points: 655,
    },
    {
      id: "mi-bowl-1",
      name: "J. Bumrah",
      fullName: "Jasprit Bumrah",
      team: "Mumbai Indians",
      teamLogo: teamLogos.mi,
      position: "Bowler",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 120,
        wickets: 145,
        economy: 7.39,
        average: 23.31,
      },
      points: 895,
    },
    {
      id: "mi-bowl-2",
      name: "Piyush Chawla",
      fullName: "Piyush Chawla",
      team: "Mumbai Indians",
      teamLogo: teamLogos.mi,
      position: "Bowler",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/149.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 179,
        wickets: 173,
        economy: 8.19,
        average: 27.14,
      },
      points: 730,
    },
    {
      id: "mi-bowl-3",
      name: "N. Wadhera",
      fullName: "Nehal Wadhera",
      team: "Mumbai Indians",
      teamLogo: teamLogos.mi,
      position: "Bowler",
      image: null,
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 14,
        wickets: 13,
        economy: 8.76,
        average: 29.4,
      },
      points: 680,
    },
    {
      id: "mi-bowl-4",
      name: "Jason Behrendorff",
      fullName: "Jason Behrendorff",
      team: "Mumbai Indians",
      teamLogo: teamLogos.mi,
      position: "Bowler",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/4.png",
      country: "Australia",
      countryFlag: countryFlags.australia,
      stats: {
        matches: 25,
        wickets: 29,
        economy: 8.32,
        average: 25.76,
      },
      points: 710,
    },
  ],

  // Chennai Super Kings squad - 11 players (5 batsmen, 4 bowlers, 2 all-rounders)
  csk: [
    {
      id: "csk-bat-1",
      name: "R. Gaikwad",
      fullName: "Ruturaj Gaikwad",
      team: "Chennai Super Kings",
      teamLogo: teamLogos.csk,
      position: "Batsman",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/102.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 52,
        runs: 1797,
        average: 39.07,
        strikeRate: 135.5,
      },
      points: 790,
    },
    {
      id: "csk-bat-2",
      name: "D. Conway",
      fullName: "Devon Conway",
      team: "Chennai Super Kings",
      teamLogo: teamLogos.csk,
      position: "Batsman",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/601.png",
      country: "New Zealand",
      countryFlag: countryFlags.newZealand,
      stats: {
        matches: 23,
        runs: 924,
        average: 46.2,
        strikeRate: 141.2,
      },
      points: 775,
    },
    {
      id: "csk-bat-3",
      name: "A. Rayudu",
      fullName: "Ambati Rayudu",
      team: "Chennai Super Kings",
      teamLogo: teamLogos.csk,
      position: "Batsman",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/100.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 204,
        runs: 4348,
        average: 28.65,
        strikeRate: 127.5,
      },
      points: 735,
    },
    {
      id: "csk-bat-4",
      name: "S. Dube",
      fullName: "Shivam Dube",
      team: "Chennai Super Kings",
      teamLogo: teamLogos.csk,
      position: "Batsman",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/211.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 42,
        runs: 1057,
        average: 31.1,
        strikeRate: 147.6,
      },
      points: 760,
    },
    {
      id: "csk-bat-5",
      name: "M. Pathirana",
      fullName: "Matheesha Pathirana",
      team: "Chennai Super Kings",
      teamLogo: teamLogos.csk,
      position: "Batsman",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/991.png",
      country: "Sri Lanka",
      countryFlag: countryFlags.india, // Using India flag as placeholder
      stats: {
        matches: 16,
        runs: 84,
        average: 16.8,
        strikeRate: 120.0,
      },
      points: 695,
    },
    {
      id: "csk-all-1",
      name: "MS Dhoni",
      fullName: "Mahendra Singh Dhoni",
      team: "Chennai Super Kings",
      teamLogo: teamLogos.csk,
      position: "All-rounder",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/57.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 250,
        runs: 5082,
        wickets: 0,
        average: 39.1,
        economy: 0,
        strikeRate: 135.9,
      },
      points: 840,
    },
    {
      id: "csk-all-2",
      name: "R. Jadeja",
      fullName: "Ravindra Jadeja",
      team: "Chennai Super Kings",
      teamLogo: teamLogos.csk,
      position: "All-rounder",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/9.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 226,
        runs: 2692,
        wickets: 152,
        average: 26.9,
        economy: 7.58,
        strikeRate: 128.2,
      },
      points: 850,
    },
    {
      id: "csk-bowl-1",
      name: "D. Chahar",
      fullName: "Deepak Chahar",
      team: "Chennai Super Kings",
      teamLogo: teamLogos.csk,
      position: "Bowler",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/91.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 74,
        wickets: 72,
        economy: 8.22,
        average: 28.59,
      },
      points: 755,
    },
    {
      id: "csk-bowl-2",
      name: "M. Theekshana",
      fullName: "Maheesh Theekshana",
      team: "Chennai Super Kings",
      teamLogo: teamLogos.csk,
      position: "Bowler",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/629.png",
      country: "Sri Lanka",
      countryFlag: countryFlags.india, // Using India flag as placeholder
      stats: {
        matches: 23,
        wickets: 27,
        economy: 7.81,
        average: 25.22,
      },
      points: 720,
    },
    {
      id: "csk-bowl-3",
      name: "M. Santner",
      fullName: "Mitchell Santner",
      team: "Chennai Super Kings",
      teamLogo: teamLogos.csk,
      position: "Bowler",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/371.png",
      country: "New Zealand",
      countryFlag: countryFlags.newZealand,
      stats: {
        matches: 26,
        wickets: 14,
        economy: 7.91,
        average: 33.57,
      },
      points: 705,
    },
    {
      id: "csk-bowl-4",
      name: "S. Thakur",
      fullName: "Shardul Thakur",
      team: "Chennai Super Kings",
      teamLogo: teamLogos.csk,
      position: "Bowler",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/105.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 88,
        wickets: 89,
        economy: 9.15,
        average: 28.56,
      },
      points: 730,
    },
  ],

  // Royal Challengers Bangalore squad (added for more options)
  rcb: [
    {
      id: "rcb-bat-1",
      name: "V. Kohli",
      fullName: "Virat Kohli",
      team: "Royal Challengers Bangalore",
      teamLogo: teamLogos.rcb,
      position: "Batsman",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/2.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 237,
        runs: 7263,
        average: 37.24,
        strikeRate: 130.02,
      },
      points: 910,
    },
    {
      id: "rcb-bat-2",
      name: "F. du Plessis",
      fullName: "Faf du Plessis",
      team: "Royal Challengers Bangalore",
      teamLogo: teamLogos.rcb,
      position: "Batsman",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/94.png",
      country: "South Africa",
      countryFlag: countryFlags.southAfrica,
      stats: {
        matches: 129,
        runs: 3913,
        average: 34.94,
        strikeRate: 132.91,
      },
      points: 870,
    },
    {
      id: "rcb-bat-3",
      name: "R. Patidar",
      fullName: "Rajat Patidar",
      team: "Royal Challengers Bangalore",
      teamLogo: teamLogos.rcb,
      position: "Batsman",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/593.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 18,
        runs: 640,
        average: 35.56,
        strikeRate: 153.85,
      },
      points: 780,
    },
    {
      id: "rcb-bat-4",
      name: "G. Maxwell",
      fullName: "Glenn Maxwell",
      team: "Royal Challengers Bangalore",
      teamLogo: teamLogos.rcb,
      position: "Batsman",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/210.png",
      country: "Australia",
      countryFlag: countryFlags.australia,
      stats: {
        matches: 124,
        runs: 2719,
        average: 26.14,
        strikeRate: 154.01,
      },
      points: 855,
    },
    {
      id: "rcb-bat-5",
      name: "A. Rawat",
      fullName: "Anuj Rawat",
      team: "Royal Challengers Bangalore",
      teamLogo: teamLogos.rcb,
      position: "Batsman",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/183.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 22,
        runs: 318,
        average: 22.71,
        strikeRate: 121.37,
      },
      points: 710,
    },
    {
      id: "rcb-all-1",
      name: "W. Hasaranga",
      fullName: "Wanindu Hasaranga",
      team: "Royal Challengers Bangalore",
      teamLogo: teamLogos.rcb,
      position: "All-rounder",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/377.png",
      country: "Sri Lanka",
      countryFlag: countryFlags.india, // Using India flag as placeholder
      stats: {
        matches: 29,
        runs: 179,
        wickets: 35,
        average: 19.45,
        economy: 8.14,
        strikeRate: 115.48,
      },
      points: 830,
    },
    {
      id: "rcb-all-2",
      name: "M. Bracewell",
      fullName: "Michael Bracewell",
      team: "Royal Challengers Bangalore",
      teamLogo: teamLogos.rcb,
      position: "All-rounder",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/989.png",
      country: "New Zealand",
      countryFlag: countryFlags.newZealand,
      stats: {
        matches: 8,
        runs: 124,
        wickets: 7,
        average: 20.67,
        economy: 8.39,
        strikeRate: 128.9,
      },
      points: 760,
    },
    {
      id: "rcb-bowl-1",
      name: "H. Patel",
      fullName: "Harshal Patel",
      team: "Royal Challengers Bangalore",
      teamLogo: teamLogos.rcb,
      position: "Bowler",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/114.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 94,
        wickets: 115,
        economy: 8.58,
        average: 24.43,
      },
      points: 820,
    },
    {
      id: "rcb-bowl-2",
      name: "M. Siraj",
      fullName: "Mohammed Siraj",
      team: "Royal Challengers Bangalore",
      teamLogo: teamLogos.rcb,
      position: "Bowler",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/63.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 83,
        wickets: 78,
        economy: 8.78,
        average: 31.47,
      },
      points: 795,
    },
    {
      id: "rcb-bowl-3",
      name: "R. Chahal",
      fullName: "Yuzvendra Chahal",
      team: "Royal Challengers Bangalore",
      teamLogo: teamLogos.rcb,
      position: "Bowler",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/10.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 145,
        wickets: 187,
        economy: 7.67,
        average: 22.48,
      },
      points: 865,
    },
    {
      id: "rcb-bowl-4",
      name: "J. Hazlewood",
      fullName: "Josh Hazlewood",
      team: "Royal Challengers Bangalore",
      teamLogo: teamLogos.rcb,
      position: "Bowler",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/481.png",
      country: "Australia",
      countryFlag: countryFlags.australia,
      stats: {
        matches: 21,
        wickets: 32,
        economy: 7.72,
        average: 19.9,
      },
      points: 805,
    },
  ],

  // Delhi Capitals squad
  dc: [
    {
      id: "dc-bat-1",
      name: "P. Shaw",
      fullName: "Prithvi Shaw",
      team: "Delhi Capitals",
      teamLogo: teamLogos.dc,
      position: "Batsman",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/51.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 70,
        runs: 1694,
        average: 24.55,
        strikeRate: 147.42,
      },
      points: 795,
    },
    {
      id: "dc-bat-2",
      name: "D. Warner",
      fullName: "David Warner",
      team: "Delhi Capitals",
      teamLogo: teamLogos.dc,
      position: "Batsman",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/214.png",
      country: "Australia",
      countryFlag: countryFlags.australia,
      stats: {
        matches: 176,
        runs: 6397,
        average: 40.49,
        strikeRate: 139.94,
      },
      points: 900,
    },
    {
      id: "dc-bat-3",
      name: "R. Powell",
      fullName: "Rovman Powell",
      team: "Delhi Capitals",
      teamLogo: teamLogos.dc,
      position: "Batsman",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/580.png",
      country: "West Indies",
      countryFlag: countryFlags.westIndies,
      stats: {
        matches: 18,
        runs: 342,
        average: 22.8,
        strikeRate: 163.64,
      },
      points: 760,
    },
    {
      id: "dc-bat-4",
      name: "R. Pant",
      fullName: "Rishabh Pant",
      team: "Delhi Capitals",
      teamLogo: teamLogos.dc,
      position: "Batsman",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/19.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 98,
        runs: 2838,
        average: 34.61,
        strikeRate: 147.97,
      },
      points: 880,
    },
    {
      id: "dc-bat-5",
      name: "S. Bharat",
      fullName: "K.S. Bharat",
      team: "Delhi Capitals",
      teamLogo: teamLogos.dc,
      position: "Batsman",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/506.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 16,
        runs: 199,
        average: 16.58,
        strikeRate: 122.09,
      },
      points: 720,
    },
    {
      id: "dc-all-1",
      name: "A. Patel",
      fullName: "Axar Patel",
      team: "Delhi Capitals",
      teamLogo: teamLogos.dc,
      position: "All-rounder",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/110.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 136,
        runs: 1498,
        wickets: 105,
        average: 28.81,
        economy: 7.43,
        strikeRate: 127.91,
      },
      points: 850,
    },
    {
      id: "dc-all-2",
      name: "L. Yadav",
      fullName: "Lalit Yadav",
      team: "Delhi Capitals",
      teamLogo: teamLogos.dc,
      position: "All-rounder",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/538.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 21,
        runs: 247,
        wickets: 6,
        average: 22.45,
        economy: 8.33,
        strikeRate: 121.08,
      },
      points: 735,
    },
    {
      id: "dc-bowl-1",
      name: "K. Rabada",
      fullName: "Kagiso Rabada",
      team: "Delhi Capitals",
      teamLogo: teamLogos.dc,
      position: "Bowler",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/116.png",
      country: "South Africa",
      countryFlag: countryFlags.southAfrica,
      stats: {
        matches: 67,
        wickets: 109,
        economy: 8.39,
        average: 21.42,
      },
      points: 875,
    },
    {
      id: "dc-bowl-2",
      name: "A. Nortje",
      fullName: "Anrich Nortje",
      team: "Delhi Capitals",
      teamLogo: teamLogos.dc,
      position: "Bowler",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/142.png",
      country: "South Africa",
      countryFlag: countryFlags.southAfrica,
      stats: {
        matches: 33,
        wickets: 47,
        economy: 8.08,
        average: 22.57,
      },
      points: 845,
    },
    {
      id: "dc-bowl-3",
      name: "I. Sharma",
      fullName: "Ishant Sharma",
      team: "Delhi Capitals",
      teamLogo: teamLogos.dc,
      position: "Bowler",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/47.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 101,
        wickets: 84,
        economy: 8.23,
        average: 35.53,
      },
      points: 750,
    },
    {
      id: "dc-bowl-4",
      name: "K. Yadav",
      fullName: "Kuldeep Yadav",
      team: "Delhi Capitals",
      teamLogo: teamLogos.dc,
      position: "Bowler",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/14.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 69,
        wickets: 82,
        economy: 8.28,
        average: 27.22,
      },
      points: 825,
    },
  ],

  // Kolkata Knight Riders squad
  kkr: [
    {
      id: "kkr-bat-1",
      name: "S. Iyer",
      fullName: "Shreyas Iyer",
      team: "Kolkata Knight Riders",
      teamLogo: teamLogos.kkr,
      position: "Batsman",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/30.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 106,
        runs: 2761,
        average: 31.38,
        strikeRate: 126.38,
      },
      points: 845,
    },
    {
      id: "kkr-bat-2",
      name: "R. Gurbaz",
      fullName: "Rahmanullah Gurbaz",
      team: "Kolkata Knight Riders",
      teamLogo: teamLogos.kkr,
      position: "Batsman",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/633.png",
      country: "Afghanistan",
      countryFlag: countryFlags.india, // Placeholder
      stats: {
        matches: 11,
        runs: 227,
        average: 20.64,
        strikeRate: 137.58,
      },
      points: 760,
    },
    {
      id: "kkr-bat-3",
      name: "N. Rana",
      fullName: "Nitish Rana",
      team: "Kolkata Knight Riders",
      teamLogo: teamLogos.kkr,
      position: "Batsman",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/148.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 105,
        runs: 2617,
        average: 28.15,
        strikeRate: 135.01,
      },
      points: 805,
    },
    {
      id: "kkr-bat-4",
      name: "V. Iyer",
      fullName: "Venkatesh Iyer",
      team: "Kolkata Knight Riders",
      teamLogo: teamLogos.kkr,
      position: "Batsman",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/584.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 36,
        runs: 956,
        average: 28.12,
        strikeRate: 130.97,
      },
      points: 790,
    },
    {
      id: "kkr-bat-5",
      name: "R. Singh",
      fullName: "Rinku Singh",
      team: "Kolkata Knight Riders",
      teamLogo: teamLogos.kkr,
      position: "Batsman",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/152.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 31,
        runs: 725,
        average: 36.25,
        strikeRate: 142.16,
      },
      points: 815,
    },
    {
      id: "kkr-all-1",
      name: "A. Russell",
      fullName: "Andre Russell",
      team: "Kolkata Knight Riders",
      teamLogo: teamLogos.kkr,
      position: "All-rounder",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/141.png",
      country: "West Indies",
      countryFlag: countryFlags.westIndies,
      stats: {
        matches: 111,
        runs: 2262,
        wickets: 96,
        average: 30.16,
        economy: 9.14,
        strikeRate: 172.1,
      },
      points: 890,
    },
    {
      id: "kkr-all-2",
      name: "S. Narine",
      fullName: "Sunil Narine",
      team: "Kolkata Knight Riders",
      teamLogo: teamLogos.kkr,
      position: "All-rounder",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/156.png",
      country: "West Indies",
      countryFlag: countryFlags.westIndies,
      stats: {
        matches: 162,
        runs: 1144,
        wickets: 163,
        average: 26.05,
        economy: 6.73,
        strikeRate: 165.8,
      },
      points: 880,
    },
    {
      id: "kkr-bowl-1",
      name: "U. Yadav",
      fullName: "Umesh Yadav",
      team: "Kolkata Knight Riders",
      teamLogo: teamLogos.kkr,
      position: "Bowler",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/21.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 138,
        wickets: 136,
        economy: 8.39,
        average: 30.21,
      },
      points: 800,
    },
    {
      id: "kkr-bowl-2",
      name: "V. Chakravarthy",
      fullName: "Varun Chakravarthy",
      team: "Kolkata Knight Riders",
      teamLogo: teamLogos.kkr,
      position: "Bowler",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/197.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 47,
        wickets: 53,
        economy: 7.76,
        average: 26.51,
      },
      points: 785,
    },
    {
      id: "kkr-bowl-3",
      name: "L. Ferguson",
      fullName: "Lockie Ferguson",
      team: "Kolkata Knight Riders",
      teamLogo: teamLogos.kkr,
      position: "Bowler",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/145.png",
      country: "New Zealand",
      countryFlag: countryFlags.newZealand,
      stats: {
        matches: 35,
        wickets: 36,
        economy: 8.94,
        average: 31.44,
      },
      points: 765,
    },
    {
      id: "kkr-bowl-4",
      name: "T. Southee",
      fullName: "Tim Southee",
      team: "Kolkata Knight Riders",
      teamLogo: teamLogos.kkr,
      position: "Bowler",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/307.png",
      country: "New Zealand",
      countryFlag: countryFlags.newZealand,
      stats: {
        matches: 58,
        wickets: 48,
        economy: 8.44,
        average: 34.96,
      },
      points: 775,
    },
  ],

  // Sunrisers Hyderabad squad
  srh: [
    {
      id: "srh-bat-1",
      name: "A. Sharma",
      fullName: "Abhishek Sharma",
      team: "Sunrisers Hyderabad",
      teamLogo: teamLogos.srh,
      position: "Batsman",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/212.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 47,
        runs: 1008,
        average: 23.44,
        strikeRate: 134.04,
      },
      points: 780,
    },
    {
      id: "srh-bat-2",
      name: "H. Brook",
      fullName: "Harry Brook",
      team: "Sunrisers Hyderabad",
      teamLogo: teamLogos.srh,
      position: "Batsman",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1218.png",
      country: "England",
      countryFlag: countryFlags.england,
      stats: {
        matches: 11,
        runs: 190,
        average: 21.11,
        strikeRate: 123.38,
      },
      points: 760,
    },
    {
      id: "srh-bat-3",
      name: "R. Tripathi",
      fullName: "Rahul Tripathi",
      team: "Sunrisers Hyderabad",
      teamLogo: teamLogos.srh,
      position: "Batsman",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/188.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 93,
        runs: 2148,
        average: 27.89,
        strikeRate: 138.76,
      },
      points: 810,
    },
    {
      id: "srh-bat-4",
      name: "A. Markram",
      fullName: "Aiden Markram",
      team: "Sunrisers Hyderabad",
      teamLogo: teamLogos.srh,
      position: "Batsman",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/287.png",
      country: "South Africa",
      countryFlag: countryFlags.southAfrica,
      stats: {
        matches: 32,
        runs: 896,
        average: 40.73,
        strikeRate: 134.53,
      },
      points: 830,
    },
    {
      id: "srh-bat-5",
      name: "H. Klaasen",
      fullName: "Heinrich Klaasen",
      team: "Sunrisers Hyderabad",
      teamLogo: teamLogos.srh,
      position: "Batsman",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/202.png",
      country: "South Africa",
      countryFlag: countryFlags.southAfrica,
      stats: {
        matches: 22,
        runs: 483,
        average: 32.2,
        strikeRate: 175.82,
      },
      points: 825,
    },
    {
      id: "srh-all-1",
      name: "M. Marsh",
      fullName: "Mitchell Marsh",
      team: "Sunrisers Hyderabad",
      teamLogo: teamLogos.srh,
      position: "All-rounder",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/40.png",
      country: "Australia",
      countryFlag: countryFlags.australia,
      stats: {
        matches: 39,
        runs: 791,
        wickets: 26,
        average: 27.28,
        economy: 8.33,
        strikeRate: 133.28,
      },
      points: 815,
    },
    {
      id: "srh-all-2",
      name: "W. Sundar",
      fullName: "Washington Sundar",
      team: "Sunrisers Hyderabad",
      teamLogo: teamLogos.srh,
      position: "All-rounder",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/147.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 58,
        runs: 368,
        wickets: 34,
        average: 30.67,
        economy: 7.46,
        strikeRate: 129.58,
      },
      points: 795,
    },
    {
      id: "srh-bowl-1",
      name: "B. Kumar",
      fullName: "Bhuvneshwar Kumar",
      team: "Sunrisers Hyderabad",
      teamLogo: teamLogos.srh,
      position: "Bowler",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/15.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 159,
        wickets: 170,
        economy: 7.33,
        average: 25.8,
      },
      points: 855,
    },
    {
      id: "srh-bowl-2",
      name: "T. Natarajan",
      fullName: "T Natarajan",
      team: "Sunrisers Hyderabad",
      teamLogo: teamLogos.srh,
      position: "Bowler",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/224.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 39,
        wickets: 48,
        economy: 8.71,
        average: 29.04,
      },
      points: 795,
    },
    {
      id: "srh-bowl-3",
      name: "U. Malik",
      fullName: "Umran Malik",
      team: "Sunrisers Hyderabad",
      teamLogo: teamLogos.srh,
      position: "Bowler",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/637.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 24,
        wickets: 29,
        economy: 9.32,
        average: 30.41,
      },
      points: 770,
    },
    {
      id: "srh-bowl-4",
      name: "K. Ahmed",
      fullName: "Khaleel Ahmed",
      team: "Sunrisers Hyderabad",
      teamLogo: teamLogos.srh,
      position: "Bowler",
      image:
        "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/193.png",
      country: "India",
      countryFlag: countryFlags.india,
      stats: {
        matches: 54,
        wickets: 63,
        economy: 8.48,
        average: 27.06,
      },
      points: 780,
    },
  ],
};

// Mock matches data
export const matches = [
  {
      "id": "m1",
      "teams": {
        "home": {
          "name": "Kolkata Knight Riders",
          "code": "KKR",
          "logo": "teamLogos.kkr"
        },
        "away": {
          "name": "Royal Challengers Bengaluru",
          "code": "RCB",
          "logo": "teamLogos.rcb"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Eden Gardens, Kolkata",
      "startTime": "Sat Mar 22 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Match abandoned due to rain",
      "scores": {
        "home": "7/0 (1)",
        "away": null
      },
      "fantasy": {
        "contestCount": 40,
        "prizePool": "₹7 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 35000,
        "percentageJoined": 90,
        "isHotMatch": true
      }
    },
    {
      "id": "m2",
      "teams": {
        "home": {
          "name": "Sunrisers Hyderabad",
          "code": "SRH",
          "logo": "teamLogos.srh"
        },
        "away": {
          "name": "Rajasthan Royals",
          "code": "RR",
          "logo": "teamLogos.rr"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Rajiv Gandhi International Cricket Stadium, Hyderabad",
      "startTime": "Sun Mar 23 2025 15:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Sunrisers Hyderabad won by 44 runs",
      "scores": {
        "home": "180/5 (20)",
        "away": "136/8 (20)"
      },
      "fantasy": {
        "contestCount": 35,
        "prizePool": "₹5 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 30000,
        "percentageJoined": 85,
        "isHotMatch": true
      }
    },
    {
      "id": "m3",
      "teams": {
        "home": {
          "name": "Chennai Super Kings",
          "code": "CSK",
          "logo": "teamLogos.csk"
        },
        "away": {
          "name": "Mumbai Indians",
          "code": "MI",
          "logo": "teamLogos.mi"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "MA Chidambaram Stadium, Chennai",
      "startTime": "Sun Mar 23 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Mumbai Indians won by 54 runs",
      "scores": {
        "home": "120/7 (20)",
        "away": "174/6 (20)"
      },
      "fantasy": {
        "contestCount": 45,
        "prizePool": "₹10 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 40000,
        "percentageJoined": 95,
        "isHotMatch": true
      }
    },
    {
      "id": "m4",
      "teams": {
        "home": {
          "name": "Delhi Capitals",
          "code": "DC",
          "logo": "teamLogos.dc"
        },
        "away": {
          "name": "Lucknow Super Giants",
          "code": "LSG",
          "logo": "teamLogos.lsg"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium, Visakhapatnam",
      "startTime": "Mon Mar 24 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Delhi Capitals won by 6 wickets",
      "scores": {
        "home": "165/4 (18.2)",
        "away": "162/7 (20)"
      },
      "fantasy": {
        "contestCount": 30,
        "prizePool": "₹4 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 25000,
        "percentageJoined": 80,
        "isHotMatch": false
      }
    },
    {
      "id": "m5",
      "teams": {
        "home": {
          "name": "Punjab Kings",
          "code": "PBKS",
          "logo": "teamLogos.pbks"
        },
        "away": {
          "name": "Gujarat Titans",
          "code": "GT",
          "logo": "teamLogos.gt"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "New PCA Stadium, Chandigarh",
      "startTime": "Tue Mar 25 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Gujarat Titans won by 3 wickets",
      "scores": {
        "home": "148/6 (20)",
        "away": "149/7 (19.4)"
      },
      "fantasy": {
        "contestCount": 28,
        "prizePool": "₹3.5 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 22000,
        "percentageJoined": 75,
        "isHotMatch": false
      }
    },
    {
      "id": "m6",
      "teams": {
        "home": {
          "name": "Rajasthan Royals",
          "code": "RR",
          "logo": "teamLogos.rr"
        },
        "away": {
          "name": "Kolkata Knight Riders",
          "code": "KKR",
          "logo": "teamLogos.kkr"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Barsapara Cricket Stadium, Guwahati",
      "startTime": "Wed Mar 26 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Kolkata Knight Riders won by 7 wickets",
      "scores": {
        "home": "155/8 (20)",
        "away": "156/3 (18.1)"
      },
      "fantasy": {
        "contestCount": 32,
        "prizePool": "₹5 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 28000,
        "percentageJoined": 85,
        "isHotMatch": true
      }
    },
    {
      "id": "m7",
      "teams": {
        "home": {
          "name": "Sunrisers Hyderabad",
          "code": "SRH",
          "logo": "teamLogos.srh"
        },
        "away": {
          "name": "Lucknow Super Giants",
          "code": "LSG",
          "logo": "teamLogos.lsg"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Rajiv Gandhi International Cricket Stadium, Hyderabad",
      "startTime": "Thu Mar 27 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Sunrisers Hyderabad won by 22 runs",
      "scores": {
        "home": "188/4 (20)",
        "away": "166/9 (20)"
      },
      "fantasy": {
        "contestCount": 30,
        "prizePool": "₹4 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 26000,
        "percentageJoined": 80,
        "isHotMatch": false
      }
    },
    {
      "id": "m8",
      "teams": {
        "home": {
          "name": "Royal Challengers Bengaluru",
          "code": "RCB",
          "logo": "teamLogos.rcb"
        },
        "away": {
          "name": "Chennai Super Kings",
          "code": "CSK",
          "logo": "teamLogos.csk"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "M Chinnaswamy Stadium, Bengaluru",
      "startTime": "Fri Mar 28 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Royal Challengers Bengaluru won by 6 wickets",
      "scores": {
        "home": "171/4 (19.1)",
        "away": "170/6 (20)"
      },
      "fantasy": {
        "contestCount": 42,
        "prizePool": "₹8 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 38000,
        "percentageJoined": 92,
        "isHotMatch": true
      }
    },
    {
      "id": "m9",
      "teams": {
        "home": {
          "name": "Gujarat Titans",
          "code": "GT",
          "logo": "teamLogos.gt"
        },
        "away": {
          "name": "Mumbai Indians",
          "code": "MI",
          "logo": "teamLogos.mi"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Narendra Modi Stadium, Ahmedabad",
      "startTime": "Sat Mar 29 2025 15:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Mumbai Indians won by 8 wickets",
      "scores": {
        "home": "145/7 (20)",
        "away": "146/2 (16.3)"
      },
      "fantasy": {
        "contestCount": 34,
        "prizePool": "₹5.5 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 29000,
        "percentageJoined": 85,
        "isHotMatch": true
      }
    },
    {
      "id": "m10",
      "teams": {
        "home": {
          "name": "Delhi Capitals",
          "code": "DC",
          "logo": "teamLogos.dc"
        },
        "away": {
          "name": "Sunrisers Hyderabad",
          "code": "SRH",
          "logo": "teamLogos.srh"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium, Visakhapatnam",
      "startTime": "Sat Mar 29 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Sunrisers Hyderabad won by 44 runs",
      "scores": {
        "home": "132/9 (20)",
        "away": "176/5 (20)"
      },
      "fantasy": {
        "contestCount": 30,
        "prizePool": "₹4 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 25000,
        "percentageJoined": 80,
        "isHotMatch": false
      }
    },
    {
      "id": "m11",
      "teams": {
        "home": {
          "name": "Rajasthan Royals",
          "code": "RR",
          "logo": "teamLogos.rr"
        },
        "away": {
          "name": "Chennai Super Kings",
          "code": "CSK",
          "logo": "teamLogos.csk"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Barsapara Cricket Stadium, Guwahati",
      "startTime": "Sun Mar 30 2025 15:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Rajasthan Royals won by 5 wickets",
      "scores": {
        "home": "160/5 (19.2)",
        "away": "159/6 (20)"
      },
      "fantasy": {
        "contestCount": 36,
        "prizePool": "₹6 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 31000,
        "percentageJoined": 88,
        "isHotMatch": true
      }
    },
    {
      "id": "m12",
      "teams": {
        "home": {
          "name": "Kolkata Knight Riders",
          "code": "KKR",
          "logo": "teamLogos.kkr"
        },
        "away": {
          "name": "Mumbai Indians",
          "code": "MI",
          "logo": "teamLogos.mi"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Eden Gardens, Kolkata",
      "startTime": "Sun Mar 30 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Kolkata Knight Riders won by 4 wickets",
      "scores": {
        "home": "178/6 (19.5)",
        "away": "177/5 (20)"
      },
      "fantasy": {
        "contestCount": 38,
        "prizePool": "₹7 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 34000,
        "percentageJoined": 90,
        "isHotMatch": true
      }
    },
    {
      "id": "m13",
      "teams": {
        "home": {
          "name": "Lucknow Super Giants",
          "code": "LSG",
          "logo": "teamLogos.lsg"
        },
        "away": {
          "name": "Punjab Kings",
          "code": "PBKS",
          "logo": "teamLogos.pbks"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "BRSABV Ekana Cricket Stadium, Lucknow",
      "startTime": "Mon Mar 31 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Punjab Kings won by 12 runs",
      "scores": {
        "home": "150/8 (20)",
        "away": "162/6 (20)"
      },
      "fantasy": {
        "contestCount": 30,
        "prizePool": "₹4 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 26000,
        "percentageJoined": 80,
        "isHotMatch": false
      }
    },
    {
      "id": "m14",
      "teams": {
        "home": {
          "name": "Royal Challengers Bengaluru",
          "code": "RCB",
          "logo": "teamLogos.rcb"
        },
        "away": {
          "name": "Gujarat Titans",
          "code": "GT",
          "logo": "teamLogos.gt"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "M Chinnaswamy Stadium, Bengaluru",
      "startTime": "Tue Apr 01 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Royal Challengers Bengaluru won by 6 wickets",
      "scores": {
        "home": "152/4 (18.4)",
        "away": "151/7 (20)"
      },
      "fantasy": {
        "contestCount": 34,
        "prizePool": "₹5.5 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 29000,
        "percentageJoined": 85,
        "isHotMatch": true
      }
    },
    {
      "id": "m15",
      "teams": {
        "home": {
          "name": "Kolkata Knight Riders",
          "code": "KKR",
          "logo": "teamLogos.kkr"
        },
        "away": {
          "name": "Sunrisers Hyderabad",
          "code": "SRH",
          "logo": "teamLogos.srh"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Eden Gardens, Kolkata",
      "startTime": "Wed Apr 02 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Kolkata Knight Riders won by 15 runs",
      "scores": {
        "home": "185/5 (20)",
        "away": "170/6 (20)"
      },
      "fantasy": {
        "contestCount": 36,
        "prizePool": "₹6 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 31000,
        "percentageJoined": 88,
        "isHotMatch": true
      }
    },
    {
      "id": "m16",
      "teams": {
        "home": {
          "name": "Lucknow Super Giants",
          "code": "LSG",
          "logo": "teamLogos.lsg"
        },
        "away": {
          "name": "Mumbai Indians",
          "code": "MI",
          "logo": "teamLogos.mi"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "BRSABV Ekana Cricket Stadium, Lucknow",
      "startTime": "Thu Apr 03 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Mumbai Indians won by 7 wickets",
      "scores": {
        "home": "143/8 (20)",
        "away": "144/3 (17.5)"
      },
      "fantasy": {
        "contestCount": 32,
        "prizePool": "₹5 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 28000,
        "percentageJoined": 85,
        "isHotMatch": true
      }
    },
    {
      "id": "m17",
      "teams": {
        "home": {
          "name": "Delhi Capitals",
          "code": "DC",
          "logo": "teamLogos.dc"
        },
        "away": {
          "name": "Chennai Super Kings",
          "code": "CSK",
          "logo": "teamLogos.csk"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Arun Jaitley Stadium, Delhi",
      "startTime": "Fri Apr 04 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Chennai Super Kings won by 5 wickets",
      "scores": {
        "home": "165/6 (20)",
        "away": "166/5 (19.3)"
      },
      "fantasy": {
        "contestCount": 34,
        "prizePool": "₹5.5 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 29000,
        "percentageJoined": 85,
        "isHotMatch": true
      }
    },
    {
      "id": "m18",
      "teams": {
        "home": {
          "name": "Rajasthan Royals",
          "code": "RR",
          "logo": "teamLogos.rr"
        },
        "away": {
          "name": "Punjab Kings",
          "code": "PBKS",
          "logo": "teamLogos.pbks"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Sawai Mansingh Stadium, Jaipur",
      "startTime": "Sat Apr 05 2025 15:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Rajasthan Royals won by 9 wickets",
      "scores": {
        "home": "130/1 (15.4)",
        "away": "129/8 (20)"
      },
      "fantasy": {
        "contestCount": 30,
        "prizePool": "₹4 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 26000,
        "percentageJoined": 80,
        "isHotMatch": false
      }
    },
    {
      "id": "m19",
      "teams": {
        "home": {
          "name": "Sunrisers Hyderabad",
          "code": "SRH",
          "logo": "teamLogos.srh"
        },
        "away": {
          "name": "Gujarat Titans",
          "code": "GT",
          "logo": "teamLogos.gt"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Rajiv Gandhi International Cricket Stadium, Hyderabad",
      "startTime": "Sat Apr 05 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Sunrisers Hyderabad won by 6 wickets",
      "scores": {
        "home": "154/4 (18.3)",
        "away": "153/7 (20)"
      },
      "fantasy": {
        "contestCount": 32,
        "prizePool": "₹5 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 28000,
        "percentageJoined": 85,
        "isHotMatch": false
      }
    },
    {
      "id": "m20",
      "teams": {
        "home": {
          "name": "Royal Challengers Bengaluru",
          "code": "RCB",
          "logo": "teamLogos.rcb"
        },
        "away": {
          "name": "Mumbai Indians",
          "code": "MI",
          "logo": "teamLogos.mi"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "M Chinnaswamy Stadium, Bengaluru",
      "startTime": "Sun Apr 06 2025 15:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Mumbai Indians won by 5 wickets",
      "scores": {
        "home": "182/5 (20)",
        "away": "183/5 (19.2)"
      },
      "fantasy": {
        "contestCount": 40,
        "prizePool": "₹8 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 35000,
        "percentageJoined": 90,
        "isHotMatch": true
      }
    },
    {
      "id": "m21",
      "teams": {
        "home": {
          "name": "Lucknow Super Giants",
          "code": "LSG",
          "logo": "teamLogos.lsg"
        },
        "away": {
          "name": "Kolkata Knight Riders",
          "code": "KKR",
          "logo": "teamLogos.kkr"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "BRSABV Ekana Cricket Stadium, Lucknow",
      "startTime": "Sun Apr 06 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Kolkata Knight Riders won by 8 wickets",
      "scores": {
        "home": "135/9 (20)",
        "away": "136/2 (16.1)"
      },
      "fantasy": {
        "contestCount": 34,
        "prizePool": "₹5.5 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 29000,
        "percentageJoined": 85,
        "isHotMatch": true
      }
    },
    {
      "id": "m22",
      "teams": {
        "home": {
          "name": "Punjab Kings",
          "code": "PBKS",
          "logo": "teamLogos.pbks"
        },
        "away": {
          "name": "Chennai Super Kings",
          "code": "CSK",
          "logo": "teamLogos.csk"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "New PCA Stadium, Chandigarh",
      "startTime": "Mon Apr 07 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Chennai Super Kings won by 4 wickets",
      "scores": {
        "home": "168/5 (20)",
        "away": "169/6 (19.4)"
      },
      "fantasy": {
        "contestCount": 32,
        "prizePool": "₹5 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 28000,
        "percentageJoined": 85,
        "isHotMatch": true
      }
    },
    {
      "id": "m23",
      "teams": {
        "home": {
          "name": "Gujarat Titans",
          "code": "GT",
          "logo": "teamLogos.gt"
        },
        "away": {
          "name": "Rajasthan Royals",
          "code": "RR",
          "logo": "teamLogos.rr"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Narendra Modi Stadium, Ahmedabad",
      "startTime": "Tue Apr 08 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Rajasthan Royals won by 3 wickets",
      "scores": {
        "home": "175/6 (20)",
        "away": "176/7 (19.5)"
      },
      "fantasy": {
        "contestCount": 30,
        "prizePool": "₹4 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 26000,
        "percentageJoined": 80,
        "isHotMatch": false
      }
    },
    {
      "id": "m24",
      "teams": {
        "home": {
          "name": "Royal Challengers Bengaluru",
          "code": "RCB",
          "logo": "teamLogos.rcb"
        },
        "away": {
          "name": "Delhi Capitals",
          "code": "DC",
          "logo": "teamLogos.dc"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "M Chinnaswamy Stadium, Bengaluru",
      "startTime": "Wed Apr 09 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Royal Challengers Bengaluru won by 6 wickets",
      "scores": {
        "home": "163/4 (18.2)",
        "away": "162/8 (20)"
      },
      "fantasy": {
        "contestCount": 36,
        "prizePool": "₹6 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 31000,
        "percentageJoined": 88,
        "isHotMatch": true
      }
    },
    {
      "id": "m25",
      "teams": {
        "home": {
          "name": "Chennai Super Kings",
          "code": "CSK",
          "logo": "teamLogos.csk"
        },
        "away": {
          "name": "Kolkata Knight Riders",
          "code": "KKR",
          "logo": "teamLogos.kkr"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "MA Chidambaram Stadium, Chennai",
      "startTime": "Thu Apr 10 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Kolkata Knight Riders won by 6 wickets",
      "scores": {
        "home": "154/7 (20)",
        "away": "155/4 (18.3)"
      },
      "fantasy": {
        "contestCount": 40,
        "prizePool": "₹8 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 35000,
        "percentageJoined": 90,
        "isHotMatch": true
      }
    },
    {
      "id": "m26",
      "teams": {
        "home": {
          "name": "Gujarat Titans",
          "code": "GT",
          "logo": "teamLogos.gt"
        },
        "away": {
          "name": "Lucknow Super Giants",
          "code": "LSG",
          "logo": "teamLogos.lsg"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Narendra Modi Stadium, Ahmedabad",
      "startTime": "Fri Apr 11 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Lucknow Super Giants won by 5 wickets",
      "scores": {
        "home": "160/6 (20)",
        "away": "161/5 (19.1)"
      },
      "fantasy": {
        "contestCount": 30,
        "prizePool": "₹4 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 26000,
        "percentageJoined": 80,
        "isHotMatch": false
      }
    },
    {
      "id": "m27",
      "teams": {
        "home": {
          "name": "Punjab Kings",
          "code": "PBKS",
          "logo": "teamLogos.pbks"
        },
        "away": {
          "name": "Sunrisers Hyderabad",
          "code": "SRH",
          "logo": "teamLogos.srh"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "New PCA Stadium, Chandigarh",
      "startTime": "Sat Apr 12 2025 15:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Sunrisers Hyderabad won by 7 wickets",
      "scores": {
        "home": "145/8 (20)",
        "away": "146/3 (17.4)"
      },
      "fantasy": {
        "contestCount": 32,
        "prizePool": "₹5 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 28000,
        "percentageJoined": 85,
        "isHotMatch": false
      }
    },
    {
      "id": "m28",
      "teams": {
        "home": {
          "name": "Rajasthan Royals",
          "code": "RR",
          "logo": "teamLogos.rr"
        },
        "away": {
          "name": "Royal Challengers Bengaluru",
          "code": "RCB",
          "logo": "teamLogos.rcb"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Sawai Mansingh Stadium, Jaipur",
      "startTime": "Sat Apr 12 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Rajasthan Royals won by 4 wickets",
      "scores": {
        "home": "172/6 (19.3)",
        "away": "171/5 (20)"
      },
      "fantasy": {
        "contestCount": 38,
        "prizePool": "₹7 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 34000,
        "percentageJoined": 90,
        "isHotMatch": true
      }
    },
    {
      "id": "m29",
      "teams": {
        "home": {
          "name": "Mumbai Indians",
          "code": "MI",
          "logo": "teamLogos.mi"
        },
        "away": {
          "name": "Delhi Capitals",
          "code": "DC",
          "logo": "teamLogos.dc"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Wankhede Stadium, Mumbai",
      "startTime": "Sun Apr 13 2025 15:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Mumbai Indians won by 6 wickets",
      "scores": {
        "home": "158/4 (18.1)",
        "away": "157/7 (20)"
      },
      "fantasy": {
        "contestCount": 36,
        "prizePool": "₹6 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 31000,
        "percentageJoined": 88,
        "isHotMatch": true
      }
    },
    {
      "id": "m30",
      "teams": {
        "home": {
          "name": "Lucknow Super Giants",
          "code": "LSG",
          "logo": "teamLogos.lsg"
        },
        "away": {
          "name": "Chennai Super Kings",
          "code": "CSK",
          "logo": "teamLogos.csk"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "BRSABV Ekana Cricket Stadium, Lucknow",
      "startTime": "Sun Apr 13 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Chennai Super Kings won by 8 wickets",
      "scores": {
        "home": "140/9 (20)",
        "away": "141/2 (16.2)"
      },
      "fantasy": {
        "contestCount": 34,
        "prizePool": "₹5.5 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 29000,
        "percentageJoined": 85,
        "isHotMatch": true
      }
    },
    {
      "id": "m31",
      "teams": {
        "home": {
          "name": "Punjab Kings",
          "code": "PBKS",
          "logo": "teamLogos.pbks"
        },
        "away": {
          "name": "Kolkata Knight Riders",
          "code": "KKR",
          "logo": "teamLogos.kkr"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "New PCA Stadium, Chandigarh",
      "startTime": "Mon Apr 14 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Kolkata Knight Riders won by 5 wickets",
      "scores": {
        "home": "165/6 (20)",
        "away": "166/5 (19.1)"
      },
      "fantasy": {
        "contestCount": 32,
        "prizePool": "₹5 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 28000,
        "percentageJoined": 85,
        "isHotMatch": true
      }
    },
    {
      "id": "m32",
      "teams": {
        "home": {
          "name": "Delhi Capitals",
          "code": "DC",
          "logo": "teamLogos.dc"
        },
        "away": {
          "name": "Rajasthan Royals",
          "code": "RR",
          "logo": "teamLogos.rr"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Arun Jaitley Stadium, Delhi",
      "startTime": "Tue Apr 15 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Rajasthan Royals won by 7 wickets",
      "scores": {
        "home": "148/8 (20)",
        "away": "149/3 (17.3)"
      },
      "fantasy": {
        "contestCount": 30,
        "prizePool": "₹4 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 26000,
        "percentageJoined": 80,
        "isHotMatch": false
      }
    },
    {
      "id": "m33",
      "teams": {
        "home": {
          "name": "Sunrisers Hyderabad",
          "code": "SRH",
          "logo": "teamLogos.srh"
        },
        "away": {
          "name": "Mumbai Indians",
          "code": "MI",
          "logo": "teamLogos.mi"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Rajiv Gandhi International Cricket Stadium, Hyderabad",
      "startTime": "Wed Apr 16 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Mumbai Indians won by 4 wickets",
      "scores": {
        "home": "170/5 (20)",
        "away": "171/6 (19.4)"
      },
      "fantasy": {
        "contestCount": 36,
        "prizePool": "₹6 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 31000,
        "percentageJoined": 88,
        "isHotMatch": true
      }
    },
    {
      "id": "m34",
      "teams": {
        "home": {
          "name": "Royal Challengers Bengaluru",
          "code": "RCB",
          "logo": "teamLogos.rcb"
        },
        "away": {
          "name": "Punjab Kings",
          "code": "PBKS",
          "logo": "teamLogos.pbks"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "M Chinnaswamy Stadium, Bengaluru",
      "startTime": "Thu Apr 17 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Royal Challengers Bengaluru won by 6 wickets",
      "scores": {
        "home": "175/4 (18.3)",
        "away": "174/6 (20)"
      },
      "fantasy": {
        "contestCount": 34,
        "prizePool": "₹5.5 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 29000,
        "percentageJoined": 85,
        "isHotMatch": true
      }
    },
    {
      "id": "m35",
      "teams": {
        "home": {
          "name": "Delhi Capitals",
          "code": "DC",
          "logo": "teamLogos.dc"
        },
        "away": {
          "name": "Gujarat Titans",
          "code": "GT",
          "logo": "teamLogos.gt"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Arun Jaitley Stadium, Delhi",
      "startTime": "Fri Apr 18 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Delhi Capitals won by 5 wickets",
      "scores": {
        "home": "150/5 (19.2)",
        "away": "149/7 (20)"
      },
      "fantasy": {
        "contestCount": 30,
        "prizePool": "₹4 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 26000,
        "percentageJoined": 80,
        "isHotMatch": false
      }
    },
    {
      "id": "m36",
      "teams": {
        "home": {
          "name": "Lucknow Super Giants",
          "code": "LSG",
          "logo": "teamLogos.lsg"
        },
        "away": {
          "name": "Rajasthan Royals",
          "code": "RR",
          "logo": "teamLogos.rr"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "BRSABV Ekana Cricket Stadium, Lucknow",
      "startTime": "Sat Apr 19 2025 15:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Rajasthan Royals won by 6 wickets",
      "scores": {
        "home": "160/7 (20)",
        "away": "161/4 (18.4)"
      },
      "fantasy": {
        "contestCount": 32,
        "prizePool": "₹5 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 28000,
        "percentageJoined": 85,
        "isHotMatch": true
      }
    },
    {
      "id": "m37",
      "teams": {
        "home": {
          "name": "Punjab Kings",
          "code": "PBKS",
          "logo": "teamLogos.pbks"
        },
        "away": {
          "name": "Royal Challengers Bengaluru",
          "code": "RCB",
          "logo": "teamLogos.rcb"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "New PCA Stadium, Chandigarh",
      "startTime": "Sat Apr 19 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Royal Challengers Bengaluru won by 7 wickets",
      "scores": {
        "home": "155/8 (20)",
        "away": "156/3 (17.2)"
      },
      "fantasy": {
        "contestCount": 34,
        "prizePool": "₹5.5 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 29000,
        "percentageJoined": 85,
        "isHotMatch": true
      }
    },
    {
      "id": "m38",
      "teams": {
        "home": {
          "name": "Chennai Super Kings",
          "code": "CSK",
          "logo": "teamLogos.csk"
        },
        "away": {
          "name": "Mumbai Indians",
          "code": "MI",
          "logo": "teamLogos.mi"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "MA Chidambaram Stadium, Chennai",
      "startTime": "Sun Apr 20 2025 15:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Mumbai Indians won by 5 wickets",
      "scores": {
        "home": "176/4 (20)",
        "away": "177/5 (19.3)"
      },
      "fantasy": {
        "contestCount": 45,
        "prizePool": "₹10 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 40000,
        "percentageJoined": 95,
        "isHotMatch": true
      }
    },
    {
      "id": "m39",
      "teams": {
        "home": {
          "name": "Gujarat Titans",
          "code": "GT",
          "logo": "teamLogos.gt"
        },
        "away": {
          "name": "Kolkata Knight Riders",
          "code": "KKR",
          "logo": "teamLogos.kkr"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Narendra Modi Stadium, Ahmedabad",
      "startTime": "Sun Apr 20 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Kolkata Knight Riders won by 6 wickets",
      "scores": {
        "home": "165/7 (20)",
        "away": "166/4 (18.2)"
      },
      "fantasy": {
        "contestCount": 34,
        "prizePool": "₹5.5 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 29000,
        "percentageJoined": 85,
        "isHotMatch": true
      }
    },
    {
      "id": "m40",
      "teams": {
        "home": {
          "name": "Lucknow Super Giants",
          "code": "LSG",
          "logo": "teamLogos.lsg"
        },
        "away": {
          "name": "Delhi Capitals",
          "code": "DC",
          "logo": "teamLogos.dc"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "BRSABV Ekana Cricket Stadium, Lucknow",
      "startTime": "Mon Apr 21 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Delhi Capitals won by 4 wickets",
      "scores": {
        "home": "170/6 (20)",
        "away": "171/6 (19.4)"
      },
      "fantasy": {
        "contestCount": 30,
        "prizePool": "₹4 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 26000,
        "percentageJoined": 80,
        "isHotMatch": false
      }
    },
    {
      "id": "m41",
      "teams": {
        "home": {
          "name": "Sunrisers Hyderabad",
          "code": "SRH",
          "logo": "teamLogos.srh"
        },
        "away": {
          "name": "Mumbai Indians",
          "code": "MI",
          "logo": "teamLogos.mi"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Rajiv Gandhi International Cricket Stadium, Hyderabad",
      "startTime": "Tue Apr 22 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Mumbai Indians won by 7 wickets",
      "scores": {
        "home": "150/8 (20)",
        "away": "151/3 (17.1)"
      },
      "fantasy": {
        "contestCount": 36,
        "prizePool": "₹6 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 31000,
        "percentageJoined": 88,
        "isHotMatch": true
      }
    },
    {
      "id": "m42",
      "teams": {
        "home": {
          "name": "Royal Challengers Bengaluru",
          "code": "RCB",
          "logo": "teamLogos.rcb"
        },
        "away": {
          "name": "Rajasthan Royals",
          "code": "RR",
          "logo": "teamLogos.rr"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "M Chinnaswamy Stadium, Bengaluru",
      "startTime": "Wed Apr 23 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Royal Challengers Bengaluru won by 5 wickets",
      "scores": {
        "home": "180/5 (19.2)",
        "away": "179/6 (20)"
      },
      "fantasy": {
        "contestCount": 38,
        "prizePool": "₹7 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 34000,
        "percentageJoined": 90,
        "isHotMatch": true
      }
    },
    {
      "id": "m43",
      "teams": {
        "home": {
          "name": "Chennai Super Kings",
          "code": "CSK",
          "logo": "teamLogos.csk"
        },
        "away": {
          "name": "Sunrisers Hyderabad",
          "code": "SRH",
          "logo": "teamLogos.srh"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "MA Chidambaram Stadium, Chennai",
      "startTime": "Thu Apr 24 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Sunrisers Hyderabad won by 44 runs",
      "scores": {
        "home": "135/9 (20)",
        "away": "179/5 (20)"
      },
      "fantasy": {
        "contestCount": 40,
        "prizePool": "₹8 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 35000,
        "percentageJoined": 90,
        "isHotMatch": true
      }
    },
    {
      "id": "m44",
      "teams": {
        "home": {
          "name": "Punjab Kings",
          "code": "PBKS",
          "logo": "teamLogos.pbks"
        },
        "away": {
          "name": "Kolkata Knight Riders",
          "code": "KKR",
          "logo": "teamLogos.kkr"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "New PCA Stadium, Chandigarh",
      "startTime": "Fri Apr 25 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Match abandoned due to rain",
      "scores": {
        "home": "201/4 (20)",
        "away": "7/0 (1)"
      },
      "fantasy": {
        "contestCount": 38,
        "prizePool": "₹7 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 34000,
        "percentageJoined": 90,
        "isHotMatch": true
      }
    },
    {
      "id": "m45",
      "teams": {
        "home": {
          "name": "Mumbai Indians",
          "code": "MI",
          "logo": "teamLogos.mi"
        },
        "away": {
          "name": "Lucknow Super Giants",
          "code": "LSG",
          "logo": "teamLogos.lsg"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Wankhede Stadium, Mumbai",
      "startTime": "Sat Apr 26 2025 15:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Mumbai Indians won by 6 wickets",
      "scores": {
        "home": "165/4 (18.2)",
        "away": "164/7 (20)"
      },
      "fantasy": {
        "contestCount": 36,
        "prizePool": "₹6 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 31000,
        "percentageJoined": 88,
        "isHotMatch": true
      }
    },
    {
      "id": "m46",
      "teams": {
        "home": {
          "name": "Delhi Capitals",
          "code": "DC",
          "logo": "teamLogos.dc"
        },
        "away": {
          "name": "Royal Challengers Bengaluru",
          "code": "RCB",
          "logo": "teamLogos.rcb"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Arun Jaitley Stadium, Delhi",
      "startTime": "Sat Apr 26 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Royal Challengers Bengaluru won by 6 wickets",
      "scores": {
        "home": "162/8 (20)",
        "away": "163/4 (18.3)"
      },
      "fantasy": {
        "contestCount": 38,
        "prizePool": "₹7 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 34000,
        "percentageJoined": 90,
        "isHotMatch": true
      }
    },
    {
      "id": "m47",
      "teams": {
        "home": {
          "name": "Rajasthan Royals",
          "code": "RR",
          "logo": "teamLogos.rr"
        },
        "away": {
          "name": "Gujarat Titans",
          "code": "GT",
          "logo": "teamLogos.gt"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Sawai Mansingh Stadium, Jaipur",
      "startTime": "Sun Apr 27 2025 15:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Rajasthan Royals won by 7 wickets",
      "scores": {
        "home": "210/3 (15.5)",
        "away": "209/6 (20)"
      },
      "fantasy": {
        "contestCount": 34,
        "prizePool": "₹5.5 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 29000,
        "percentageJoined": 85,
        "isHotMatch": true
      }
    },
    {
      "id": "m48",
      "teams": {
        "home": {
          "name": "Delhi Capitals",
          "code": "DC",
          "logo": "teamLogos.dc"
        },
        "away": {
          "name": "Kolkata Knight Riders",
          "code": "KKR",
          "logo": "teamLogos.kkr"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Arun Jaitley Stadium, Delhi",
      "startTime": "Mon Apr 28 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "completed",
      "result": "Kolkata Knight Riders won by 5 wickets",
      "scores": {
        "home": "170/6 (20)",
        "away": "171/5 (19.2)"
      },
      "fantasy": {
        "contestCount": 36,
        "prizePool": "₹6 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 31000,
        "percentageJoined": 88,
        "isHotMatch": true
      }
    },
    {
      "id": "m49",
      "teams": {
        "home": {
          "name": "Chennai Super Kings",
          "code": "CSK",
          "logo": "teamLogos.csk"
        },
        "away": {
          "name": "Punjab Kings",
          "code": "PBKS",
          "logo": "teamLogos.pbks"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "MA Chidambaram Stadium, Chennai",
      "startTime": "Tue Apr 29 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "upcoming",
      "result": null,
      "scores": {
        "home": null,
        "away": null
      },
      "fantasy": {
        "contestCount": 40,
        "prizePool": "₹8 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 35000,
        "percentageJoined": 90,
        "isHotMatch": true
      }
    },
    {
      "id": "m50",
      "teams": {
        "home": {
          "name": "Rajasthan Royals",
          "code": "RR",
          "logo": "teamLogos.rr"
        },
        "away": {
          "name": "Mumbai Indians",
          "code": "MI",
          "logo": "teamLogos.mi"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Sawai Mansingh Stadium, Jaipur",
      "startTime": "Wed Apr 30 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "upcoming",
      "result": null,
      "scores": {
        "home": null,
        "away": null
      },
      "fantasy": {
        "contestCount": 38,
        "prizePool": "₹7 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 34000,
        "percentageJoined": 90,
        "isHotMatch": true
      }
    },
    {
      "id": "m51",
      "teams": {
        "home": {
          "name": "Gujarat Titans",
          "code": "GT",
          "logo": "teamLogos.gt"
        },
        "away": {
          "name": "Sunrisers Hyderabad",
          "code": "SRH",
          "logo": "teamLogos.srh"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Narendra Modi Stadium, Ahmedabad",
      "startTime": "Thu May 01 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "upcoming",
      "result": null,
      "scores": {
        "home": null,
        "away": null
      },
      "fantasy": {
        "contestCount": 32,
        "prizePool": "₹5 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 28000,
        "percentageJoined": 85,
        "isHotMatch": false
      }
    },
    {
      "id": "m52",
      "teams": {
        "home": {
          "name": "Royal Challengers Bengaluru",
          "code": "RCB",
          "logo": "teamLogos.rcb"
        },
        "away": {
          "name": "Chennai Super Kings",
          "code": "CSK",
          "logo": "teamLogos.csk"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "M Chinnaswamy Stadium, Bengaluru",
      "startTime": "Fri May 02 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "upcoming",
      "result": null,
      "scores": {
        "home": null,
        "away": null
      },
      "fantasy": {
        "contestCount": 42,
        "prizePool": "₹8 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 38000,
        "percentageJoined": 92,
        "isHotMatch": true
      }
    },
    {
      "id": "m53",
      "teams": {
        "home": {
          "name": "Kolkata Knight Riders",
          "code": "KKR",
          "logo": "teamLogos.kkr"
        },
        "away": {
          "name": "Rajasthan Royals",
          "code": "RR",
          "logo": "teamLogos.rr"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Eden Gardens, Kolkata",
      "startTime": "Sat May 03 2025 15:30:00 GMT+0530 (India Standard Time)",
      "status": "upcoming",
      "result": null,
      "scores": {
        "home": null,
        "away": null
      },
      "fantasy": {
        "contestCount": 38,
        "prizePool": "₹7 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 34000,
        "percentageJoined": 90,
        "isHotMatch": true
      }
    },
    {
      "id": "m54",
      "teams": {
        "home": {
          "name": "Punjab Kings",
          "code": "PBKS",
          "logo": "teamLogos.pbks"
        },
        "away": {
          "name": "Lucknow Super Giants",
          "code": "LSG",
          "logo": "teamLogos.lsg"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "HPCA Cricket Stadium, Dharamsala",
      "startTime": "Sat May 03 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "upcoming",
      "result": null,
      "scores": {
        "home": null,
        "away": null
      },
      "fantasy": {
        "contestCount": 32,
        "prizePool": "₹5 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 28000,
        "percentageJoined": 85,
        "isHotMatch": false
      }
    },
    {
      "id": "m55",
      "teams": {
        "home": {
          "name": "Sunrisers Hyderabad",
          "code": "SRH",
          "logo": "teamLogos.srh"
        },
        "away": {
          "name": "Delhi Capitals",
          "code": "DC",
          "logo": "teamLogos.dc"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Rajiv Gandhi International Cricket Stadium, Hyderabad",
      "startTime": "Sun May 04 2025 15:30:00 GMT+0530 (India Standard Time)",
      "status": "upcoming",
      "result": null,
      "scores": {
        "home": null,
        "away": null
      },
      "fantasy": {
        "contestCount": 30,
        "prizePool": "₹4 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 26000,
        "percentageJoined": 80,
        "isHotMatch": false
      }
    },
    {
      "id": "m56",
      "teams": {
        "home": {
          "name": "Mumbai Indians",
          "code": "MI",
          "logo": "teamLogos.mi"
        },
        "away": {
          "name": "Gujarat Titans",
          "code": "GT",
          "logo": "teamLogos.gt"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Wankhede Stadium, Mumbai",
      "startTime": "Sun May 04 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "upcoming",
      "result": null,
      "scores": {
        "home": null,
        "away": null
      },
      "fantasy": {
        "contestCount": 36,
        "prizePool": "₹6 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 31000,
        "percentageJoined": 88,
        "isHotMatch": true
      }
    },
    {
      "id": "m57",
      "teams": {
        "home": {
          "name": "Kolkata Knight Riders",
          "code": "KKR",
          "logo": "teamLogos.kkr"
        },
        "away": {
          "name": "Chennai Super Kings",
          "code": "CSK",
          "logo": "teamLogos.csk"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "Eden Gardens, Kolkata",
      "startTime": "Mon May 05 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "upcoming",
      "result": null,
      "scores": {
        "home": null,
        "away": null
      },
      "fantasy": {
        "contestCount": 40,
        "prizePool": "₹8 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 35000,
        "percentageJoined": 90,
        "isHotMatch": true
      }
    },
    {
      "id": "m58",
      "teams": {
        "home": {
          "name": "Punjab Kings",
          "code": "PBKS",
          "logo": "teamLogos.pbks"
        },
        "away": {
          "name": "Delhi Capitals",
          "code": "DC",
          "logo": "teamLogos.dc"
        }
      },
      "tournament": {
        "name": "IPL 2025",
        "shortName": "IPL"
      },
      "venue": "HPCA Cricket Stadium, Dharamsala",
      "startTime": "Tue May 06 2025 19:30:00 GMT+0530 (India Standard Time)",
      "status": "upcoming",
      "result": null,
      "scores": {
        "home": null,
        "away": null
      },
      "fantasy": {
        "contestCount": 30,
        "prizePool": "₹4 Lakh",
        "entryFees": [49, 99, 499, 999],
        "teamsCreated": 26000,
        "percentageJoined": 80,
        "isHotMatch": false
      }
    },
      {
        "id": "m59",
        "teams": {
          "home": {
            "name": "Lucknow Super Giants",
            "code": "LSG",
            "logo": "teamLogos.lsg"
          },
          "away": {
            "name": "Royal Challengers Bengaluru",
            "code": "RCB",
            "logo": "teamLogos.rcb"
          }
        },
        "tournament": {
          "name": "IPL 2025",
          "shortName": "IPL"
        },
        "venue": "BRSABV Ekana Cricket Stadium, Lucknow",
        "startTime": "Wed May 07 2025 19:30:00 GMT+0530 (India Standard Time)",
        "status": "upcoming",
        "result": null,
        "scores": {
          "home": null,
          "away": null
        },
        "fantasy": {
          "contestCount": 34,
          "prizePool": "₹5.5 Lakh",
          "entryFees": [49, 99, 499, 999],
          "teamsCreated": 29000,
          "percentageJoined": 85,
          "isHotMatch": true
        }
      },
      {
        "id": "m60",
        "teams": {
          "home": {
            "name": "Mumbai Indians",
            "code": "MI",
            "logo": "teamLogos.mi"
          },
          "away": {
            "name": "Kolkata Knight Riders",
            "code": "KKR",
            "logo": "teamLogos.kkr"
          }
        },
        "tournament": {
          "name": "IPL 2025",
          "shortName": "IPL"
        },
        "venue": "Wankhede Stadium, Mumbai",
        "startTime": "Thu May 08 2025 19:30:00 GMT+0530 (India Standard Time)",
        "status": "upcoming",
        "result": null,
        "scores": {
          "home": null,
          "away": null
        },
        "fantasy": {
          "contestCount": 40,
          "prizePool": "₹8 Lakh",
          "entryFees": [49, 99, 499, 999],
          "teamsCreated": 35000,
          "percentageJoined": 90,
          "isHotMatch": true
        }
      },
      {
        "id": "m61",
        "teams": {
          "home": {
            "name": "Rajasthan Royals",
            "code": "RR",
            "logo": "teamLogos.rr"
          },
          "away": {
            "name": "Sunrisers Hyderabad",
            "code": "SRH",
            "logo": "teamLogos.srh"
          }
        },
        "tournament": {
          "name": "IPL 2025",
          "shortName": "IPL"
        },
        "venue": "Sawai Mansingh Stadium, Jaipur",
        "startTime": "Fri May 09 2025 19:30:00 GMT+0530 (India Standard Time)",
        "status": "upcoming",
        "result": null,
        "scores": {
          "home": null,
          "away": null
        },
        "fantasy": {
          "contestCount": 36,
          "prizePool": "₹6 Lakh",
          "entryFees": [49, 99, 499, 999],
          "teamsCreated": 31000,
          "percentageJoined": 88,
          "isHotMatch": true
        }
      },
      {
        "id": "m62",
        "teams": {
          "home": {
            "name": "Chennai Super Kings",
            "code": "CSK",
            "logo": "teamLogos.csk"
          },
          "away": {
            "name": "Gujarat Titans",
            "code": "GT",
            "logo": "teamLogos.gt"
          }
        },
        "tournament": {
          "name": "IPL 2025",
          "shortName": "IPL"
        },
        "venue": "MA Chidambaram Stadium, Chennai",
        "startTime": "Sat May 10 2025 15:30:00 GMT+0530 (India Standard Time)",
        "status": "upcoming",
        "result": null,
        "scores": {
          "home": null,
          "away": null
        },
        "fantasy": {
          "contestCount": 34,
          "prizePool": "₹5.5 Lakh",
          "entryFees": [49, 99, 499, 999],
          "teamsCreated": 29000,
          "percentageJoined": 85,
          "isHotMatch": true
        }
      },
      {
        "id": "m63",
        "teams": {
          "home": {
            "name": "Delhi Capitals",
            "code": "DC",
            "logo": "teamLogos.dc"
          },
          "away": {
            "name": "Mumbai Indians",
            "code": "MI",
            "logo": "teamLogos.mi"
          }
        },
        "tournament": {
          "name": "IPL 2025",
          "shortName": "IPL"
        },
        "venue": "Arun Jaitley Stadium, Delhi",
        "startTime": "Sat May 10 2025 19:30:00 GMT+0530 (India Standard Time)",
        "status": "upcoming",
        "result": null,
        "scores": {
          "home": null,
          "away": null
        },
        "fantasy": {
          "contestCount": 38,
          "prizePool": "₹7 Lakh",
          "entryFees": [49, 99, 499, 999],
          "teamsCreated": 34000,
          "percentageJoined": 90,
          "isHotMatch": true
        }
      },
      {
        "id": "m64",
        "teams": {
          "home": {
            "name": "Royal Challengers Bengaluru",
            "code": "RCB",
            "logo": "teamLogos.rcb"
          },
          "away": {
            "name": "Kolkata Knight Riders",
            "code": "KKR",
            "logo": "teamLogos.kkr"
          }
        },
        "tournament": {
          "name": "IPL 2025",
          "shortName": "IPL"
        },
        "venue": "M Chinnaswamy Stadium, Bengaluru",
        "startTime": "Sun May 11 2025 15:30:00 GMT+0530 (India Standard Time)",
        "status": "upcoming",
        "result": null,
        "scores": {
          "home": null,
          "away": null
        },
        "fantasy": {
          "contestCount": 40,
          "prizePool": "₹8 Lakh",
          "entryFees": [49, 99, 499, 999],
          "teamsCreated": 35000,
          "percentageJoined": 90,
          "isHotMatch": true
        }
      },
      {
        "id": "m65",
        "teams": {
          "home": {
            "name": "Lucknow Super Giants",
            "code": "LSG",
            "logo": "teamLogos.lsg"
          },
          "away": {
            "name": "Sunrisers Hyderabad",
            "code": "SRH",
            "logo": "teamLogos.srh"
          }
        },
        "tournament": {
          "name": "IPL 2025",
          "shortName": "IPL"
        },
        "venue": "BRSABV Ekana Cricket Stadium, Lucknow",
        "startTime": "Sun May 11 2025 19:30:00 GMT+0530 (India Standard Time)",
        "status": "upcoming",
        "result": null,
        "scores": {
          "home": null,
          "away": null
        },
        "fantasy": {
          "contestCount": 32,
          "prizePool": "₹5 Lakh",
          "entryFees": [49, 99, 499, 999],
          "teamsCreated": 28000,
          "percentageJoined": 85,
          "isHotMatch": false
        }
      },
      {
        "id": "m66",
        "teams": {
          "home": {
            "name": "Punjab Kings",
            "code": "PBKS",
            "logo": "teamLogos.pbks"
          },
          "away": {
            "name": "Rajasthan Royals",
            "code": "RR",
            "logo": "teamLogos.rr"
          }
        },
        "tournament": {
          "name": "IPL 2025",
          "shortName": "IPL"
        },
        "venue": "HPCA Cricket Stadium, Dharamsala",
        "startTime": "Mon May 12 2025 19:30:00 GMT+0530 (India Standard Time)",
        "status": "upcoming",
        "result": null,
        "scores": {
          "home": null,
          "away": null
        },
        "fantasy": {
          "contestCount": 30,
          "prizePool": "₹4 Lakh",
          "entryFees": [49, 99, 499, 999],
          "teamsCreated": 26000,
          "percentageJoined": 80,
          "isHotMatch": false
        }
      },
      {
        "id": "m67",
        "teams": {
          "home": {
            "name": "Gujarat Titans",
            "code": "GT",
            "logo": "teamLogos.gt"
          },
          "away": {
            "name": "Royal Challengers Bengaluru",
            "code": "RCB",
            "logo": "teamLogos.rcb"
          }
        },
        "tournament": {
          "name": "IPL 2025",
          "shortName": "IPL"
        },
        "venue": "Narendra Modi Stadium, Ahmedabad",
        "startTime": "Tue May 13 2025 19:30:00 GMT+0530 (India Standard Time)",
        "status": "upcoming",
        "result": null,
        "scores": {
          "home": null,
          "away": null
        },
        "fantasy": {
          "contestCount": 34,
          "prizePool": "₹5.5 Lakh",
          "entryFees": [49, 99, 499, 999],
          "teamsCreated": 29000,
          "percentageJoined": 85,
          "isHotMatch": true
        }
      },
      {
        "id": "m68",
        "teams": {
          "home": {
            "name": "Mumbai Indians",
            "code": "MI",
            "logo": "teamLogos.mi"
          },
          "away": {
            "name": "Chennai Super Kings",
            "code": "CSK",
            "logo": "teamLogos.csk"
          }
        },
        "tournament": {
          "name": "IPL 2025",
          "shortName": "IPL"
        },
        "venue": "Wankhede Stadium, Mumbai",
        "startTime": "Wed May 14 2025 19:30:00 GMT+0530 (India Standard Time)",
        "status": "upcoming",
        "result": null,
        "scores": {
          "home": null,
          "away": null
        },
        "fantasy": {
          "contestCount": 45,
          "prizePool": "₹10 Lakh",
          "entryFees": [49, 99, 499, 999],
          "teamsCreated": 40000,
          "percentageJoined": 95,
          "isHotMatch": true
        }
      },
      {
        "id": "m69",
        "teams": {
          "home": {
            "name": "Kolkata Knight Riders",
            "code": "KKR",
            "logo": "teamLogos.kkr"
          },
          "away": {
            "name": "Lucknow Super Giants",
            "code": "LSG",
            "logo": "teamLogos.lsg"
          }
        },
        "tournament": {
          "name": "IPL 2025",
          "shortName": "IPL"
        },
        "venue": "Eden Gardens, Kolkata",
        "startTime": "Thu May 15 2025 19:30:00 GMT+0530 (India Standard Time)",
        "status": "upcoming",
        "result": null,
        "scores": {
          "home": null,
          "away": null
        },
        "fantasy": {
          "contestCount": 36,
          "prizePool": "₹6 Lakh",
          "entryFees": [49, 99, 499, 999],
          "teamsCreated": 31000,
          "percentageJoined": 88,
          "isHotMatch": true
        }
      },
      {
        "id": "m70",
        "teams": {
          "home": {
            "name": "TBD",
            "code": "TBD",
            "logo": "teamLogos.tbd"
          },
          "away": {
            "name": "TBD",
            "code": "TBD",
            "logo": "teamLogos.tbd"
          }
        },
        "tournament": {
          "name": "IPL 2025",
          "shortName": "IPL"
        },
        "venue": "MA Chidambaram Stadium, Chennai",
        "startTime": "Tue May 20 2025 19:30:00 GMT+0530 (India Standard Time)",
        "status": "upcoming",
        "result": null,
        "scores": {
          "home": null,
          "away": null
        },
        "fantasy": {
          "contestCount": 50,
          "prizePool": "₹15 Lakh",
          "entryFees": [49, 99, 499, 999],
          "teamsCreated": 45000,
          "percentageJoined": 95,
          "isHotMatch": true
        }
      },
      {
        "id": "m71",
        "teams": {
          "home": {
            "name": "TBD",
            "code": "TBD",
            "logo": "teamLogos.tbd"
          },
          "away": {
            "name": "TBD",
            "code": "TBD",
            "logo": "teamLogos.tbd"
          }
        },
        "tournament": {
          "name": "IPL 2025",
          "shortName": "IPL"
        },
        "venue": "Narendra Modi Stadium, Ahmedabad",
        "startTime": "Wed May 21 2025 19:30:00 GMT+0530 (India Standard Time)",
        "status": "upcoming",
        "result": null,
        "scores": {
          "home": null,
          "away": null
        },
        "fantasy": {
          "contestCount": 50,
          "prizePool": "₹15 Lakh",
          "entryFees": [49, 99, 499, 999],
          "teamsCreated": 45000,
          "percentageJoined": 95,
          "isHotMatch": true
        }
      },
      {
        "id": "m72",
        "teams": {
          "home": {
            "name": "TBD",
            "code": "TBD",
            "logo": "teamLogos.tbd"
          },
          "away": {
            "name": "TBD",
            "code": "TBD",
            "logo": "teamLogos.tbd"
          }
        },
        "tournament": {
          "name": "IPL 2025",
          "shortName": "IPL"
        },
        "venue": "Narendra Modi Stadium, Ahmedabad",
        "startTime": "Fri May 23 2025 19:30:00 GMT+0530 (India Standard Time)",
        "status": "upcoming",
        "result": null,
        "scores": {
          "home": null,
          "away": null
        },
        "fantasy": {
          "contestCount": 50,
          "prizePool": "₹15 Lakh",
          "entryFees": [49, 99, 499, 999],
          "teamsCreated": 45000,
          "percentageJoined": 95,
          "isHotMatch": true
        }
      },
      {
        "id": "m73",
        "teams": {
          "home": {
            "name": "TBD",
            "code": "TBD",
            "logo": "teamLogos.tbd"
          },
          "away": {
            "name": "TBD",
            "code": "TBD",
            "logo": "teamLogos.tbd"
          }
        },
        "tournament": {
          "name": "IPL 2025",
          "shortName": "IPL"
        },
        "venue": "MA Chidambaram Stadium, Chennai",
        "startTime": "Sat May 24 2025 19:30:00 GMT+0530 (India Standard Time)",
        "status": "upcoming",
        "result": null,
        "scores": {
          "home": null,
          "away": null
        },
        "fantasy": {
          "contestCount": 50,
          "prizePool": "₹15 Lakh",
          "entryFees": [49, 99, 499, 999],
          "teamsCreated": 45000,
          "percentageJoined": 95,
          "isHotMatch": true
        }
      },
      {
        "id": "m74",
        "teams": {
          "home": {
            "name": "TBD",
            "code": "TBD",
            "logo": "teamLogos.tbd"
          },
          "away": {
            "name": "TBD",
            "code": "TBD",
            "logo": "teamLogos.tbd"
          }
        },
        "tournament": {
          "name": "IPL 2025",
          "shortName": "IPL"
        },
        "venue": "Narendra Modi Stadium, Ahmedabad",
        "startTime": "Sun May 25 2025 19:30:00 GMT+0530 (India Standard Time)",
        "status": "upcoming",
        "result": null,
        "scores": {
          "home": null,
          "away": null
        },
        "fantasy": {
          "contestCount": 60,
          "prizePool": "₹20 Lakh",
          " Hawkins": true,
          "entryFees": [49, 99, 499, 999, 1999],
          "teamsCreated": 50000,
          "percentageJoined": 98,
          "isHotMatch": true
        }
      }
  ]

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
