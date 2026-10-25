import {
  ArrowLeft,
  Music2,
  Play,
  Radio,
  Smartphone,
  Video,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

const videos = [
  { title: "Big Buck Bunny", creator: "Blender Open Movie", id: "aqz-KE-bpKQ" },
  {
    title: "Elephants Dream",
    creator: "Blender Open Movie",
    id: "TLkA0RELQ1g",
  },
  { title: "Sintel", creator: "Blender Open Movie", id: "eRsGyueVLvQ" },
  { title: "Tears of Steel", creator: "Blender Open Movie", id: "R6MlUcmOul8" },
  {
    title: "Cosmos Laundromat",
    creator: "Blender Open Movie",
    id: "Y-rmzh0PI3c",
  },
  {
    title: "Caminandes: Llamigos",
    creator: "Blender Open Movie",
    id: "nqBua7oeRCY",
  },
  {
    title: "Caminandes: Gran Dillama",
    creator: "Blender Open Movie",
    id: "0MgeBzzCBWM",
  },
  { title: "Spring", creator: "Blender Open Movie", id: "WhWc3b3KhnY" },
  { title: "Coffee Run", creator: "Blender Open Movie", id: "PVGeM4OdABA" },
  {
    title: "Agent 327: Operation Barbershop",
    creator: "Blender Open Movie",
    id: "mNOzP0pADL4",
  },
];

const primeVideoTrailers = [
  {
    title: "The Lord of the Rings: The Rings of Power",
    creator: "Prime Video · Official trailer",
    id: "x8UAUAuKNcU",
  },
  {
    title: "The Wheel of Time · Season 3",
    creator: "Prime Video · Official trailer",
    id: "qk0D4OV95bQ",
  },
  {
    title: "Reacher · Season 4",
    creator: "Prime Video · Official trailer",
    id: "PCbp1FfipPg",
  },
  {
    title: "The Boys · Final Season",
    creator: "Prime Video · Official teaser trailer",
    id: "Fv0leN8TmR8",
  },
  {
    title: "Invincible · Season 4",
    creator: "Prime Video · Official trailer",
    id: "ZnfUeVeMKjY",
  },
];

const primeVideoChannels = [
  {
    name: "AMC+",
    description: "Original series, films, and suspenseful stories.",
    theme: "amc",
  },
  {
    name: "Paramount+",
    description: "Entertainment, movies, news, and sports.",
    theme: "paramount",
  },
  {
    name: "STARZ",
    description: "Original series and feature films.",
    theme: "starz",
  },
  {
    name: "Apple TV",
    description: "Dramas, comedies, adventures, and movies.",
    theme: "appletv",
  },
  {
    name: "HBO Max",
    description: "Series, movies, sports, and news.",
    theme: "hbomax",
  },
  {
    name: "Crunchyroll",
    description: "Anime series and films.",
    theme: "crunchyroll",
  },
  {
    name: "MGM+",
    description: "Original series, movies, and more.",
    theme: "mgm",
  },
];

const rentBuyMovies = [
  {
    id: "paw-patrol-dino-movie",
    shelf: "comedy-deals",
    title: "PAW Patrol: The Dino Movie",
    year: "2026",
    rating: "PG",
    description:
      "The pups crash-land on a dinosaur-filled island and team up with Rex to save their new friends.",
    poster:
      "https://m.media-amazon.com/images/S/pv-target-images/a9a44d3ebfc5af69c0b91769af0435555a29a7a536a147101a38c3db1641a908._SX1080_FMpng_.png",
    rentPrice: 19.99,
    buyPrice: 24.99,
    primeVideoUrl:
      "https://www.primevideo.com/detail/0MOO17K1LQTHVFGQ7WYZ5VYIP0",
    availability: "Check Amazon availability",
  },
  {
    id: "trick-r-treat",
    shelf: "comedy-deals",
    title: "Trick 'r Treat",
    year: "2007",
    rating: "R",
    description:
      "Four interwoven Halloween tales mix dark comedy with supernatural horror.",
    poster:
      "https://m.media-amazon.com/images/S/pv-target-images/54621829c1305b47c403603a37d879f75acf97adc225e4213187baa3ca19a0b9._SX1080_FMpng_.png",
    rentPrice: 4.99,
    buyPrice: 7.99,
    primeVideoUrl:
      "https://www.primevideo.com/detail/0PQE65D4CV0XL6BEXMZC6GUIMU",
  },
  {
    id: "scary-movie-2000",
    shelf: "comedy-deals",
    title: "Scary Movie",
    year: "2000",
    rating: "R",
    description:
      "A group of teenagers is stalked by a masked killer in this horror-movie parody.",
    poster:
      "https://m.media-amazon.com/images/S/pv-target-images/854c82e2581a03d54a7132c4814889afb1164d7225cfd6bfd1f8ff369c0bacc0._SX1080_FMpng_.png",
    rentPrice: 3.99,
    buyPrice: 14.99,
    primeVideoUrl:
      "https://www.primevideo.com/detail/0H8KJPGM3DGBHXP44APKKG3PM7",
  },
  {
    id: "practical-magic",
    shelf: "comedy-deals",
    title: "Practical Magic",
    year: "1998",
    rating: "PG-13",
    description:
      "Witch sisters Sally and Gillian Owens use their family magic while searching for love and a way to break a curse.",
    poster:
      "https://m.media-amazon.com/images/S/pv-target-images/f1208b2f2d850b15aa246eecc3ac376e0ff0d5e7ed05b78610d58afddea9062d._SX1080_FMjpg_.jpg",
    rentPrice: 5.99,
    buyPrice: 9.99,
    primeVideoUrl:
      "https://www.primevideo.com/detail/0SXHE4BGHO46HIMTBA8IZQDBQ4",
  },
  {
    id: "pride-and-prejudice",
    shelf: "audience-favorites",
    title: "Pride & Prejudice",
    year: "2005",
    rating: "PG",
    description:
      "Elizabeth Bennet and Mr. Darcy navigate first impressions, family expectations, and unexpected romance.",
    poster:
      "https://m.media-amazon.com/images/S/pv-target-images/d07b26493fe03de6902d017c1c91cd00d4ce4f721725b80ab29bb941b5d44a5c._SX1080_FMjpg_.jpg",
    rentPrice: 3.99,
    buyPrice: 7.99,
    primeVideoUrl:
      "https://www.primevideo.com/detail/0J1PS71YN1V42WMLVT1LZMHPJN",
    availability: "Check Amazon availability",
  },
  {
    id: "batman-knightfall-part-1",
    shelf: "audience-favorites",
    title: "Batman: Knightfall Part 1",
    year: "2026",
    rating: "R",
    description:
      "After Arkham Asylum is destroyed, Batman faces a citywide escape and a new threat: Bane.",
    poster:
      "https://m.media-amazon.com/images/S/pv-target-images/4230fb5c6af6ad555f4efb40dd2f80633adfba775d99b5d56bc647c78854ddfa._SX1080_FMjpg_.jpg",
    rentPrice: 5.99,
    buyPrice: 19.99,
    primeVideoUrl:
      "https://www.primevideo.com/detail/0NK4WVGH93LSXBEKI0ONQ45ZCK",
  },
  {
    id: "tiny-fugitives",
    shelf: "premium",
    title: "Tiny Fugitives",
    year: "2026",
    rating: "R",
    description:
      "A reckless group of 12-year-olds escapes into a summer at camp, where counselor Bob (Johnny Knoxville) tries to keep their plans in check.",
    poster:
      "https://m.media-amazon.com/images/S/pv-target-images/fc85fb383953bd4106ad2285b9ffe009ec7a6dda4b5a2c6bbcdbfee743d9a547._SX1080_FMjpg_.jpg",
    rentPrice: 6.99,
    buyPrice: 14.99,
    primeVideoUrl:
      "https://www.primevideo.com/detail/0G9NCV2TE0TFJVML4YZPW8VSPG",
  },
  {
    id: "sunny-dancer",
    shelf: "premium",
    title: "Sunny Dancer",
    year: "2026",
    rating: "NR",
    description:
      "A teenager finds connection and a new outlook during an unforgettable summer at camp.",
    poster:
      "https://m.media-amazon.com/images/S/pv-target-images/6b26eea7298716c6b5ee00ddda62533ec7dfe101d5f2ce84788b8f9def0ab8d0._SX1080_FMjpg_.jpg",
    rentPrice: 19.98,
    buyPrice: 24.99,
    primeVideoUrl:
      "https://www.primevideo.com/detail/0I1STXIVCY7H95VOW86FSQHOU2",
    availability: "Check Amazon availability",
  },
  {
    id: "clean-hands",
    shelf: "premium",
    title: "Clean Hands",
    year: "2026",
    rating: "TV-MA",
    description:
      "Sergeant Kevin Simmers leads a taskforce battling drugs while his daughter Brooke faces an escalating addiction.",
    poster:
      "https://m.media-amazon.com/images/S/pv-target-images/b4256dd1b4db0047e351f5c3343fc9ed0a8951fe50bb01b5613cacd096548a74._SX1080_FMjpg_.jpg",
    rentPrice: 9.99,
    buyPrice: 14.99,
    primeVideoUrl:
      "https://www.primevideo.com/detail/0RE12LEMODI9B7PH9L37S5R1DU",
  },
  {
    id: "scream-2022",
    shelf: "deals",
    title: "Scream",
    year: "2022",
    rating: "R",
    description:
      "A new killer resurrects the Ghostface mask and targets a new generation of Woodsboro teens.",
    poster:
      "https://m.media-amazon.com/images/S/pv-target-images/61ddcbc08c8541b0de9714af3a662a9811636bb4a97c0e3f0e9e4d33423767bf._SX1080_FMjpg_.jpg",
    buyPrice: 4.99,
    primeVideoUrl:
      "https://www.primevideo.com/detail/0Q2HW78P4S9J4P1ICS0WWWWD4V",
  },
  {
    id: "scream-1996",
    shelf: "deals",
    title: "Scream",
    year: "1996",
    rating: "R",
    description:
      "A masked killer targets a group of teenagers in the sleepy town of Woodsboro.",
    poster:
      "https://m.media-amazon.com/images/S/pv-target-images/b17695bcac0c2dd8f24079ad78b95079589ed504ac87618e8f68c680605a379e._SX1080_FMjpg_.jpg",
    rentPrice: 3.99,
    buyPrice: 14.99,
    primeVideoUrl:
      "https://www.primevideo.com/detail/0JXFGTDLEOOLFR4B9ZPEX9K4JD",
  },
  {
    id: "bad-moms",
    shelf: "deals",
    title: "Bad Moms",
    year: "2016",
    rating: "R",
    description:
      "Three overworked mothers ditch their obligations for a little freedom and fun.",
    poster:
      "https://m.media-amazon.com/images/S/pv-target-images/951f1698e8a8db380ce62e1acff73a900ce4648f2906b20785ab2b4e5657dc27._SX1080_FMjpg_.jpg",
    rentPrice: 3.99,
    buyPrice: 14.99,
    primeVideoUrl:
      "https://www.primevideo.com/detail/0LGY7EQWM0QMTQ0EXW3RQTLUX7",
  },
  {
    id: "shutter-island",
    shelf: "deals",
    title: "Shutter Island",
    year: "2010",
    rating: "R",
    description:
      "A U.S. Marshal investigates the disappearance of a patient from a remote island hospital.",
    poster:
      "https://m.media-amazon.com/images/S/pv-target-images/0d5a1eab446a287322b867afa3d1aa54000568c4dfbba6d78cd6b2014e1313f5._SX1080_FMpng_.png",
    rentPrice: 3.99,
    buyPrice: 4.99,
    primeVideoUrl:
      "https://www.primevideo.com/detail/0INICTQA9DNNLBC8H72QO0J3NZ",
  },
  {
    id: "fall-bundle",
    shelf: "popular",
    title: "Fall 2-Movie Bundle",
    year: "2022–2026",
    rating: "PG-13",
    description:
      "Two survival stories follow climbers stranded high above the ground.",
    poster:
      "https://m.media-amazon.com/images/S/pv-target-images/32976f05777f27deb77fe1af317e94a01057f411f1d771c371c1e4bcc648c52a._SX1080_FMjpg_.jpg",
    buyPrice: 22.99,
    primeVideoUrl:
      "https://www.primevideo.com/detail/0LN39Y32CTGW6ESO08AR830GJ9",
  },
  {
    id: "the-uprising",
    shelf: "popular",
    title: "The Uprising",
    year: "2026",
    rating: "R",
    description:
      "Andrew Garfield leads a rebellion against King Richard II in a story tied to the Robin Hood legend.",
    poster:
      "https://m.media-amazon.com/images/S/pv-target-images/99d698e2b8f8877da5f6768ad8eb612aa052d560f6163bd14659c4e42f0ac269._SX1080_FMjpg_.jpg",
    rentPrice: 19.99,
    buyPrice: 24.99,
    primeVideoUrl:
      "https://www.primevideo.com/detail/0JHJL2UW93J71NNOU13J3H4Y25",
  },
  {
    id: "spider-man-bundle",
    shelf: "popular",
    title: "Spider-Man 4-Movie Bundle",
    year: "2017–2026",
    rating: "NR",
    description:
      "A four-film collection featuring Tom Holland as Spider-Man, including Brand New Day.",
    poster:
      "https://m.media-amazon.com/images/S/pv-target-images/c2a986d7059fdd439638b0d3beec9335ee8e6a1668b656d391e884843f3bffec._SX1080_FMjpg_.jpg",
    buyPrice: 44.99,
    primeVideoUrl:
      "https://www.primevideo.com/detail/0O2L60EPZIKYUOAM2Q3IFQ5DIP",
  },
  {
    id: "buddy",
    shelf: "premium",
    title: "Buddy",
    year: "2026",
    rating: "NR",
    description:
      "Children discover that their cheerful orange unicorn host has a darker side.",
    poster:
      "https://m.media-amazon.com/images/S/pv-target-images/ca2fe274185897fce88e6cba627858547f596c3d43ca97e98076674dea7d462e._SX1080_FMjpg_.jpg",
    primeVideoUrl:
      "https://www.primevideo.com/detail/0H2NAZERCMH7NWFJ4GZZ8IU05J",
    availability: "Check Amazon availability",
  },
  {
    id: "wicked",
    shelf: "more",
    title: "Wicked",
    year: "2024",
    rating: "PG",
    description:
      "A magical musical about two young women whose unlikely friendship changes the fate of Oz.",
    poster:
      "https://m.media-amazon.com/images/S/pv-target-images/2b204693f03756415c92ab5ae39af8b6ebfcee640afcd6e0fe2f3a2165e37a51._SX1080_FMjpg_.jpg",
    trailerId: "6COmYeLsz4c",
    rentPrice: 3.99,
    buyPrice: 14.99,
    primeVideoUrl:
      "https://www.primevideo.com/detail/0OWZLPZCZKLFFM69I3A60V1KQ6",
  },
  {
    id: "the-bad-guys-2",
    shelf: "more",
    title: "The Bad Guys 2",
    year: "2025",
    rating: "PG",
    description:
      "The reformed crew is pulled into a globe-trotting heist with a new group of criminals.",
    poster:
      "https://m.media-amazon.com/images/S/pv-target-images/234dc5d2f66caf26425f0fb42840be55cba21f60c19b1ebd1fb4f58ef410c839._SX1080_FMjpg_.jpg",
    trailerId: "TY1lWh20VSw",
    rentPrice: 3.99,
    buyPrice: 14.99,
    primeVideoUrl:
      "https://www.primevideo.com/detail/0QIS7651WQBV9QMBFYHMLT8PGZ",
  },
  {
    id: "obsession",
    shelf: "more",
    title: "Obsession",
    year: "2026",
    rating: "R",
    description:
      "A wish for love becomes a dark supernatural story with an unexpected cost.",
    poster:
      "https://m.media-amazon.com/images/S/pv-target-images/994789a22b07820e60a905f7e4dec1235c621b0c013bdc0e0baa57da4376ac2c._SX1080_FMjpg_.jpg",
    trailerId: "TaaDkbG3I7g",
    rentPrice: 5.99,
    buyPrice: 9.99,
    primeVideoUrl:
      "https://www.primevideo.com/detail/0M1G8W35R6LZYZ25OYBKKX3PBF",
  },
];

const ethiopianTracks = [
  { title: "Keteraraw Mado", artist: "Hailu Amerga", id: "asZszsycNNs" },
  {
    title: "Shih Bibal (Back to 90s)",
    artist: "Teddy Afro",
    id: "UlqLeuVHpEU",
  },
  { title: "Ze Tsedal", artist: "Teddy Afro", id: "DsH_LxBB4l8" },
  { title: "Tayegn", artist: "Teddy Afro", id: "pRHWe6Lz2mY" },
  { title: "Addis Ababa", artist: "Dagne Walle", id: "hWnPQAMq7hw" },
  { title: "Sememene (GuReggae)", artist: "Teddy Afro", id: "nw443G62EQc" },
  { title: "Ere Hagere", artist: "Dagne Walle", id: "DubZsVgdzSU" },
  { title: "Das Tal (Ansaw)", artist: "Teddy Afro", id: "ADc9JPeLYi4" },
  { title: "Ngezaka", artist: "Hana Girma", id: "7gUusZOB87w" },
  { title: "Merkeb", artist: "Teddy Afro", id: "BQSgYf4lfMg" },
];

const amazonMusicPicks = [
  {
    title: "All Hits",
    type: "Amazon Music playlist",
    image: "https://m.media-amazon.com/images/I/41MYRD7NW5L.jpg",
  },
  {
    title: "Afro Rotation",
    type: "Amazon Music playlist",
    image: "https://m.media-amazon.com/images/I/41xaNNu%2BaRL.jpg",
  },
  {
    title: "Country Heat",
    type: "Amazon Music playlist",
    image:
      "https://m.media-amazon.com/images/I/516Dn%2BFbNQL._SX354_SY354_BL0_QL100_.jpg",
  },
  {
    title: "Alternative Hits",
    type: "Amazon Music playlist",
    image:
      "https://m.media-amazon.com/images/I/41XBgM-dv%2BL._SX354_SY354_BL0_QL100_.jpg",
  },
  {
    title: "Pop Culture",
    type: "Amazon Music playlist",
    image:
      "https://m.media-amazon.com/images/I/41IJhliY1BL._SX354_SY354_BL0_QL100_.jpg",
  },
  {
    title: "Acoustic Chill",
    type: "Amazon Music playlist",
    image:
      "https://m.media-amazon.com/images/I/41nKAX2FbJL._SX354_SY354_BL0_QL100_.jpg",
  },
  {
    title: "Rock Arena",
    type: "Amazon Music playlist",
    image:
      "https://m.media-amazon.com/images/I/517G4%2BbMFZL._SX354_SY354_BL0_QL100_.jpg",
  },
  {
    title: "Heist at the Louvre",
    type: "Podcast · ABC News",
    image:
      "https://m.media-amazon.com/images/S/dmp-catalog-images-prod/images/04f0e385-0700-496c-9474-90f797b59497/04f0e385-0700-496c-9474-90f797b59497--1821984745._SX576_SY576_BL0_QL100_.jpg",
  },
  {
    title: "WHAT WENT WRONG",
    type: "Podcast · Sad Boom Media",
    image:
      "https://m.media-amazon.com/images/S/dmp-catalog-images-prod/images/e3c760fc-2b43-443b-9d08-a8cccd009a38/e3c760fc-2b43-443b-9d08-a8cccd009a38-767366223._SX576_SY576_BL0_QL100_.jpeg",
  },
  {
    title: "MrBallen’s Medical Mysteries",
    type: "Podcast · Audible",
    image:
      "https://m.media-amazon.com/images/S/dmp-catalog-images-prod/images/b0294e20-c582-475c-8faf-bd3b4ee80336/b0294e20-c582-475c-8faf-bd3b4ee80336-2036093706._SX576_SY576_BL0_QL100_.jpeg",
  },
  {
    title: "CNN 5 Things",
    type: "Podcast · CNN Podcasts",
    image:
      "https://m.media-amazon.com/images/S/dmp-catalog-images-prod/images/7f7ebc0c-b766-46d5-84d0-c3f78c606b85/7f7ebc0c-b766-46d5-84d0-c3f78c606b85-1354878359._SX576_SY576_BL0_QL100_.jpg",
  },
  {
    title: "Redditor",
    type: "Podcast · Redditor",
    image:
      "https://m.media-amazon.com/images/S/dmp-catalog-images-prod/images/9a809f0d-bb79-4182-a911-2c986a5f0c31/9a809f0d-bb79-4182-a911-2c986a5f0c31-1929145848._SX576_SY576_BL0_QL100_.jpeg",
  },
  {
    title: "The Daily",
    type: "Podcast · The New York Times",
    image:
      "https://m.media-amazon.com/images/S/dmp-catalog-images-prod/images/65957f22-45da-431f-8090-83fae75e505a/65957f22-45da-431f-8090-83fae75e505a-2081055492._SX576_SY576_BL0_QL100_.jpg",
  },
  {
    title: "Fox News Rewind: 9/11",
    type: "Podcast · FOX News Podcasts",
    image:
      "https://m.media-amazon.com/images/S/dmp-catalog-images-prod/images/a78eb6d1-afc7-4532-a274-11bdac70b092/a78eb6d1-afc7-4532-a274-11bdac70b092--325507196._SX576_SY576_BL0_QL100_FMpng_.png",
  },
  {
    title: "Against The Odds",
    type: "Podcast · Audible",
    image:
      "https://m.media-amazon.com/images/S/dmp-catalog-images-prod/images/3b12709d-206c-4643-97fc-d94acbddca06/3b12709d-206c-4643-97fc-d94acbddca06-60890367._SX576_SY576_BL0_QL100_.jpeg",
  },
  {
    title: "You’re Dead to Me",
    type: "Podcast · BBC Radio 4",
    image:
      "https://m.media-amazon.com/images/S/dmp-catalog-images-prod/images/3c000cd8-361d-4e10-a829-0614a77cc426/3c000cd8-361d-4e10-a829-0614a77cc426-1838481676._SX576_SY576_BL0_QL100_.jpg",
  },
  {
    title: "Mysteries at the Museum",
    type: "Podcast · Travel Channel",
    image:
      "https://m.media-amazon.com/images/S/dmp-catalog-images-prod/images/c9c2d799-84c8-4b5c-b28e-7cbeb12d7905/c9c2d799-84c8-4b5c-b28e-7cbeb12d7905-81267429._SX576_SY576_BL0_QL100_.jpg",
  },
  {
    title: "The Ancients",
    type: "Podcast · History Hit",
    image:
      "https://m.media-amazon.com/images/S/dmp-catalog-images-prod/images/0a26c8bf-0a23-4e2c-b0f9-779295cdfbf5/0a26c8bf-0a23-4e2c-b0f9-779295cdfbf5--1216850586._SX576_SY576_BL0_QL100_.jpeg",
  },
  {
    title: "British Scandal",
    type: "Podcast · Audible",
    image:
      "https://m.media-amazon.com/images/S/dmp-catalog-images-prod/images/5a0566f5-a879-4af4-88eb-0d27246a8e2f/5a0566f5-a879-4af4-88eb-0d27246a8e2f--1151830709._SX576_SY576_BL0_QL100_.jpeg",
  },
  {
    title: "American History Tellers",
    type: "Podcast · Audible",
    image:
      "https://m.media-amazon.com/images/S/dmp-catalog-images-prod/images/01d391f1-7e25-4014-88c5-593deb9e1ac3/01d391f1-7e25-4014-88c5-593deb9e1ac3--452828565._SX576_SY576_BL0_QL100_.jpeg",
  },
];

const amazonMusicArtists = [
  {
    name: "Taylor Swift",
    image: "https://m.media-amazon.com/images/I/61D0kwSaXUL.jpg",
  },
  {
    name: "Morgan Wallen",
    image: "https://m.media-amazon.com/images/I/911IyEoW9bL.jpg",
  },
  {
    name: "Drake",
    image: "https://m.media-amazon.com/images/I/716OFRUIorL.jpg",
  },
  {
    name: "Ella Langley",
    image: "https://m.media-amazon.com/images/I/61i3%2BOYkZoL.jpg",
  },
  {
    name: "Olivia Rodrigo",
    image: "https://m.media-amazon.com/images/I/717Oy0K6lvL.jpg",
  },
  {
    name: "Michael Jackson",
    image: "https://m.media-amazon.com/images/I/41973wZsbEL.jpg",
  },
  {
    name: "Luke Combs",
    image: "https://m.media-amazon.com/images/I/41n5T5-7zdL.jpg",
  },
];

const amazonMusicMenu = [
  "Stream Music",
  "Amazon Music Unlimited",
  "Free Streaming Music",
  "Podcasts",
  "Open Web Player",
  "Download the app",
];

const books = [
  {
    title: "A Morning in Addis",
    author: "Northstar Sample Library",
    excerpt:
      "The city woke slowly beneath the blue hills. Coffee steamed in small cups as the first buses crossed the square, and a new day opened with the sound of greetings.",
    cover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "The Weaver’s Story",
    author: "Northstar Sample Library",
    excerpt:
      "At the edge of the market, Hana chose bright threads for the cloth she had promised her grandmother. Every color carried a memory, and every knot brought the pattern closer.",
    cover:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Letters from Lalibela",
    author: "Northstar Sample Library",
    excerpt:
      "Dear friend, the stone paths are quiet in the early morning. I am writing before the bells, while the light moves across the old walls.",
    cover:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "The Little Blue Kite",
    author: "Northstar Sample Library",
    excerpt:
      "When the wind arrived, Sami ran up the hill with his blue kite. It rose above the rooftops, carrying his laughter into the wide afternoon sky.",
    cover:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Stories by the Lake",
    author: "Northstar Sample Library",
    excerpt:
      "The water was still enough to hold the mountains in its reflection. Grandfather began his story, and the children leaned close so they would not miss a word.",
    cover:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "A Garden of Stars",
    author: "Northstar Sample Library",
    excerpt:
      "Each evening, Meron counted the bright points above the garden. She imagined each one was a place waiting to be discovered.",
    cover:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=500&q=80",
  },
];

const featuredKindleVideo = {
  title: "Inside the Story",
  creator: "Kindle Studio Preview",
  id: "aqz-KE-bpKQ",
};

const kindleDevices = [
  {
    id: "kindle-2026",
    title: "Kindle",
    description: "Compact, glare-free reading with weeks of battery life.",
    detail: "6-inch display · 16 GB · up to 6 weeks",
    image:
      "https://assets.aboutamazon.com/dims4/default/01689ff/2147483647/strip/true/crop/1600x900%2B0%2B0/resize/1320x743%21/quality/90/?url=https%3A%2F%2Fassets.aboutamazon.com%2Fa8%2F33%2F66b7046946668542348ff5419e91%2Funtitled-september-29-2026-at-10-20-04.png",
    alt: "Kindle e-reader",
  },
  {
    id: "kindle-aluminum-2026",
    title: "Kindle Aluminum",
    description: "A light, compact Kindle with premium aluminum back.",
    detail: "6-inch display · 32 GB · aluminum finish",
    image:
      "https://assets.aboutamazon.com/dims4/default/aba6849/2147483647/strip/true/crop/1600x900%2B0%2B0/resize/1320x743%21/quality/90/?url=https%3A%2F%2Fassets.aboutamazon.com%2F51%2F2a%2F9aa4dcb94209b6409738224b9a8f%2Fkindle-buy-guide-inline-amazon-news-lt-aluminum.jpeg",
    alt: "Aluminum Kindle e-reader",
  },
  {
    id: "kindle-paperwhite-2026",
    title: "Kindle Paperwhite",
    description: "Waterproof reading with an adjustable warm light.",
    detail: "Waterproof · warm light · long battery life",
    image:
      "https://assets.aboutamazon.com/dims4/default/46d52ca/2147483647/strip/true/crop/1600x900%2B0%2B0/resize/1320x743%21/quality/90/?url=https%3A%2F%2Fassets.aboutamazon.com%2F1a%2F77%2F7ef02e3547f7842df3098e7db23d%2Fkindle-buy-guide-inline-amazon-news-lt-paperwhite-1.jpeg",
    alt: "Kindle Paperwhite e-reader",
  },
  {
    id: "kindle-paperwhite-signature-2026",
    title: "Kindle Paperwhite Signature Edition",
    description: "A premium Paperwhite reading experience.",
    detail: "32 GB · auto-adjusting light · wireless charging",
    image:
      "https://assets.aboutamazon.com/dims4/default/46d52ca/2147483647/strip/true/crop/1600x900%2B0%2B0/resize/1320x743%21/quality/90/?url=https%3A%2F%2Fassets.aboutamazon.com%2F1a%2F77%2F7ef02e3547f7842df3098e7db23d%2Fkindle-buy-guide-inline-amazon-news-lt-paperwhite-1.jpeg",
    alt: "Kindle Paperwhite Signature Edition",
  },
  {
    id: "kindle-colorsoft-2026",
    title: "Kindle Colorsoft",
    description: "A paper-like color display for covers, comics, and more.",
    detail: "Color display · adjustable light",
    image:
      "https://assets.aboutamazon.com/dims4/default/6327015/2147483647/strip/true/crop/1600x900%2B0%2B0/resize/1320x743%21/quality/90/?url=https%3A%2F%2Fassets.aboutamazon.com%2Fc5%2Fe5%2Fa4b796f54dd7a9a4b8261c148a1d%2Fkindle-buy-guide-inline-amazon-news-lt-colorsoft.jpeg",
    alt: "Kindle Colorsoft e-reader",
  },
  {
    id: "kindle-colorsoft-signature-2026",
    title: "Kindle Colorsoft Signature Edition",
    description: "Color reading with premium features and more storage.",
    detail: "32 GB · auto-adjusting light · wireless charging",
    image:
      "https://assets.aboutamazon.com/dims4/default/6327015/2147483647/strip/true/crop/1600x900%2B0%2B0/resize/1320x743%21/quality/90/?url=https%3A%2F%2Fassets.aboutamazon.com%2Fc5%2Fe5%2Fa4b796f54dd7a9a4b8261c148a1d%2Fkindle-buy-guide-inline-amazon-news-lt-colorsoft.jpeg",
    alt: "Kindle Colorsoft Signature Edition",
  },
  {
    id: "kindle-scribe-2026",
    title: "Kindle Scribe",
    description: "Read, take notes, and write on books and documents.",
    detail: "Large screen · included pen",
    image:
      "https://assets.aboutamazon.com/dims4/default/23d826b/2147483647/strip/true/crop/1600x900%2B0%2B0/resize/1320x743%21/quality/90/?url=https%3A%2F%2Fassets.aboutamazon.com%2Fa7%2Fae%2F89ecc197465e853f92adc15b287b%2Faa-oct2024-kindlescribe-standard-inline-v2-400kb-1600x900-1.jpg",
    alt: "Kindle Scribe with pen",
  },
  {
    id: "kindle-scribe-colorsoft",
    title: "Kindle Scribe Colorsoft",
    description: "A color writing and reading experience with a premium pen.",
    detail: "Color display · handwritten notes · pen included",
    image:
      "https://assets.aboutamazon.com/dims4/default/2fc3538/2147483647/strip/true/crop/1600x900%2B0%2B0/resize/1320x743%21/quality/90/?url=https%3A%2F%2Fassets.aboutamazon.com%2Ff8%2F9a%2Fdb4438604fa69f1fb37a8097858e%2Fabout-amazon-inline-devices-kindle-new-and-reimagined-amazon-news-cdlt-20260929.jpg",
    alt: "Kindle Scribe Colorsoft",
  },
  {
    id: "kindle-kids-2026",
    title: "Kindle Kids",
    description: "A kid-friendly reader with a protective cover.",
    detail: "Kids cover · child-friendly reading",
    image:
      "https://assets.aboutamazon.com/dims4/default/f2890d5/2147483647/strip/true/crop/1600x900%2B0%2B0/resize/1320x743%21/quality/90/?url=https%3A%2F%2Fassets.aboutamazon.com%2Fb9%2F3e%2Fdbecac40476bb20bf2a38adf7ff0%2Fkindle-buy-guide-inline-amazon-news-lt-kids-1.jpeg",
    alt: "Child reading on a Kindle Kids device",
  },
  {
    id: "kindle-page-turn-cover",
    title: "Kindle Page-Turn Cover",
    description: "A magnetic folio case with integrated page-turn buttons.",
    detail: "Page-turn buttons · magnetic fit",
    image:
      "https://assets.aboutamazon.com/dims4/default/99a3e5e/2147483647/strip/true/crop/1600x900%2B0%2B0/resize/1320x743%21/quality/90/?url=https%3A%2F%2Fassets.aboutamazon.com%2Ff7%2F2e%2F6a6f6dc84cc0a4cc537a9efe7743%2Fkindle-accessories-page-turner-amazonnews-cdlt-09292026.png",
    alt: "Kindle page-turn cover",
  },
  {
    id: "kindle-click",
    title: "Kindle Click",
    description: "Turn pages from a distance with a compact Bluetooth remote.",
    detail: "Bluetooth page-turn remote",
    image:
      "https://assets.aboutamazon.com/dims4/default/99a3e5e/2147483647/strip/true/crop/1600x900%2B0%2B0/resize/1320x743%21/quality/90/?url=https%3A%2F%2Fassets.aboutamazon.com%2Ff7%2F2e%2F6a6f6dc84cc0a4cc537a9efe7743%2Fkindle-accessories-page-turner-amazonnews-cdlt-09292026.png",
    alt: "Kindle Click page-turn remote",
  },
  {
    id: "kindle-charging-dock",
    title: "Kindle Charging Dock",
    description: "Keep a compatible Signature Edition upright and charged.",
    detail: "Charging stand · Signature Edition compatible",
    image:
      "https://assets.aboutamazon.com/dims4/default/99a3e5e/2147483647/strip/true/crop/1600x900%2B0%2B0/resize/1320x743%21/quality/90/?url=https%3A%2F%2Fassets.aboutamazon.com%2Ff7%2F2e%2F6a6f6dc84cc0a4cc537a9efe7743%2Fkindle-accessories-page-turner-amazonnews-cdlt-09292026.png",
    alt: "Kindle charging dock",
  },
  {
    id: "kindle-covers",
    title: "Kindle Covers",
    description: "Protective covers in fabric and premium finishes.",
    detail: "Knit fabric · plant-based leather · premium leather",
    image:
      "https://assets.aboutamazon.com/dims4/default/99a3e5e/2147483647/strip/true/crop/1600x900%2B0%2B0/resize/1320x743%21/quality/90/?url=https%3A%2F%2Fassets.aboutamazon.com%2Ff7%2F2e%2F6a6f6dc84cc0a4cc537a9efe7743%2Fkindle-accessories-page-turner-amazonnews-cdlt-09292026.png",
    alt: "Protective Kindle covers",
  },
];

const kindleStoreOptions = [
  {
    title: "Kindle Books",
    description: "Browse original sample books in this project.",
    image:
      "https://assets.aboutamazon.com/dims4/default/2fc3538/2147483647/strip/true/crop/1600x900%2B0%2B0/resize/1320x743%21/quality/90/?url=https%3A%2F%2Fassets.aboutamazon.com%2Ff8%2F9a%2Fdb4438604fa69f1fb37a8097858e%2Fabout-amazon-inline-devices-kindle-new-and-reimagined-amazon-news-cdlt-20260929.jpg",
    alt: "Kindle showing a colorful book cover",
    book: 0,
  },
  {
    title: "Kindle+",
    description: "Explore the sample reading collection in this project.",
    image:
      "https://assets.aboutamazon.com/dims4/default/01689ff/2147483647/strip/true/crop/1600x900%2B0%2B0/resize/1320x743%21/quality/90/?url=https%3A%2F%2Fassets.aboutamazon.com%2Fa8%2F33%2F66b7046946668542348ff5419e91%2Funtitled-september-29-2026-at-10-20-04.png",
    alt: "Kindle e-reader ready for reading",
    book: 1,
  },
  {
    title: "Prime Reading",
    description: "Open a sample from the reading library.",
    image:
      "https://assets.aboutamazon.com/dims4/default/a14337b/2147483647/strip/true/crop/2000x1125%2B0%2B0/resize/1320x743%21/quality/90/?url=https%3A%2F%2Fassets.aboutamazon.com%2F64%2F6d%2F05e8ac3d49c6ae6fef0e9beddf26%2Fabout-amazon-hero-devices-kindle-new-and-reimagined-amazon-news-cdlt-20260929.jpg",
    alt: "Reader enjoying a Kindle",
    book: 2,
  },
];

const kindleResources = [
  {
    title: "Free Kindle Reading Apps",
    description: "Open an original sample in the built-in reader.",
    image:
      "https://assets.aboutamazon.com/dims4/default/a14337b/2147483647/strip/true/crop/2000x1125%2B0%2B0/resize/1320x743%21/quality/90/?url=https%3A%2F%2Fassets.aboutamazon.com%2F64%2F6d%2F05e8ac3d49c6ae6fef0e9beddf26%2Fabout-amazon-hero-devices-kindle-new-and-reimagined-amazon-news-cdlt-20260929.jpg",
    alt: "Kindle reading on a mobile device",
    action: "reader",
  },
  {
    title: "Kindle for Web",
    description: "Read sample titles in this project’s browser reader.",
    image:
      "https://assets.aboutamazon.com/dims4/default/2fc3538/2147483647/strip/true/crop/1600x900%2B0%2B0/resize/1320x743%21/quality/90/?url=https%3A%2F%2Fassets.aboutamazon.com%2Ff8%2F9a%2Fdb4438604fa69f1fb37a8097858e%2Fabout-amazon-inline-devices-kindle-new-and-reimagined-amazon-news-cdlt-20260929.jpg",
    alt: "Kindle device displaying a book",
    action: "reader",
  },
  {
    title: "Manage Your Content and Devices",
    description: "Visit your project profile and saved items.",
    image:
      "https://assets.aboutamazon.com/dims4/default/01689ff/2147483647/strip/true/crop/1600x900%2B0%2B0/resize/1320x743%21/quality/90/?url=https%3A%2F%2Fassets.aboutamazon.com%2Fa8%2F33%2F66b7046946668542348ff5419e91%2Funtitled-september-29-2026-at-10-20-04.png",
    alt: "Kindle device",
    to: "/profile",
  },
  {
    title: "Trade-In",
    description: "Browse products and accessories in this project store.",
    image:
      "https://assets.aboutamazon.com/dims4/default/99a3e5e/2147483647/strip/true/crop/1600x900%2B0%2B0/resize/1320x743%21/quality/90/?url=https%3A%2F%2Fassets.aboutamazon.com%2Ff7%2F2e%2F6a6f6dc84cc0a4cc537a9efe7743%2Fkindle-accessories-page-turner-amazonnews-cdlt-09292026.png",
    alt: "Kindle accessories",
    to: "/products",
  },
  {
    title: "Accessories",
    description: "Browse reader accessories in this project store.",
    image:
      "https://assets.aboutamazon.com/dims4/default/99a3e5e/2147483647/strip/true/crop/1600x900%2B0%2B0/resize/1320x743%21/quality/90/?url=https%3A%2F%2Fassets.aboutamazon.com%2Ff7%2F2e%2F6a6f6dc84cc0a4cc537a9efe7743%2Fkindle-accessories-page-turner-amazonnews-cdlt-09292026.png",
    alt: "Kindle page-turner remote and accessories",
    to: "/products",
  },
  {
    title: "Pay over time",
    description: "Browse project products and review the checkout options.",
    image:
      "https://assets.aboutamazon.com/dims4/default/46d52ca/2147483647/strip/true/crop/1600x900%2B0%2B0/resize/1320x743%21/quality/90/?url=https%3A%2F%2Fassets.aboutamazon.com%2F1a%2F77%2F7ef02e3547f7842df3098e7db23d%2Fkindle-buy-guide-inline-amazon-news-lt-paperwhite-1.jpeg",
    alt: "Kindle Paperwhite device",
    to: "/products",
  },
];

const apps = [
  {
    name: "Prime Video",
    category: "Entertainment",
    description: "Watch a collection of short films in the project player.",
    icon: "▶",
    to: "/digital/video",
  },
  {
    name: "Amazon Music",
    category: "Music & Audio",
    description: "Explore Ethiopian songs in the built-in music player.",
    icon: "♫",
    to: "/digital/music",
  },
  {
    name: "Kindle",
    category: "Books & Comics",
    description: "Browse sample books, reading tools, and Kindle devices.",
    icon: "▤",
    to: "/digital/kindle",
  },
  {
    name: "Games & Play",
    category: "Games",
    description: "Explore games and play-ready products in the project store.",
    icon: "♟",
    to: "/products",
  },
  {
    name: "Kids & Family",
    category: "Kids",
    description: "Find family-friendly reading samples and devices.",
    icon: "☀",
    to: "/digital/kindle",
  },
  {
    name: "Shop Devices",
    category: "Shopping",
    description:
      "Browse electronics and accessories available in this project.",
    icon: "▣",
    to: "/products",
  },
  {
    name: "Sports & Live",
    category: "Sports",
    description: "Explore more video selections in the project player.",
    icon: "⚽",
    to: "/digital/video",
  },
  {
    name: "News & Information",
    category: "News",
    description: "Discover reading content and sample books.",
    icon: "◉",
    to: "/digital/kindle",
  },
];

const appStoreCategories = [
  "All apps",
  "Entertainment",
  "Games",
  "Books & Comics",
  "Music & Audio",
  "Kids",
  "Shopping",
  "Sports",
  "News",
];

const primeVideoMenu = [
  "All Videos",
  "Included with Prime",
  "Prime Video Channels",
  "Rent or Buy",
  "Your Watchlist",
  "Purchases & Rentals",
  "Watch Anywhere",
  "Getting Started",
];

function YouTubePlayer({ item, kind }) {
  return (
    <div className="embedded-player-frame">
      <iframe
        key={item.id}
        className="embedded-media-player"
        src={`https://www.youtube-nocookie.com/embed/${item.id}?rel=0&playsinline=1`}
        title={`${kind}: ${item.title} by ${item.creator || item.artist}`}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

function KindleMenuItem({ image, title, description, disabled, onClick }) {
  return (
    <button
      className="kindle-nav-item"
      type="button"
      disabled={disabled}
      onClick={onClick}
    >
      <img src={image} alt="" loading="lazy" />
      <span className="kindle-nav-copy">
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <span className="kindle-nav-chevron" aria-hidden="true">
        ›
      </span>
    </button>
  );
}

function Entertainment() {
  const { service } = useParams();
  const [selectedVideo, setSelectedVideo] = useState(0);
  const [selectedIncludedVideo, setSelectedIncludedVideo] = useState(0);
  const [selectedTrack, setSelectedTrack] = useState(0);
  const [amazonMusicSection, setAmazonMusicSection] = useState("Stream Music");
  const [selectedAmazonMusicPick, setSelectedAmazonMusicPick] = useState(
    amazonMusicPicks[0].title,
  );
  const [selectedAmazonArtist, setSelectedAmazonArtist] = useState(
    amazonMusicArtists[0].name,
  );
  const [kindleScreen, setKindleScreen] = useState(null);
  const [primeVideoSection, setPrimeVideoSection] = useState("All Videos");
  const [videoWatchlist, setVideoWatchlist] = useState(() => {
    try {
      return JSON.parse(
        window.localStorage.getItem("prime-video-watchlist") || "[]",
      );
    } catch {
      return [];
    }
  });
  const [selectedPrimeChannel, setSelectedPrimeChannel] = useState(
    primeVideoChannels[0],
  );
  const primeChannelDetailRef = useRef(null);
  const [rentBuyModes, setRentBuyModes] = useState({});
  const [rentBuyMessage, setRentBuyMessage] = useState("");
  const [selectedRentBuyMovie, setSelectedRentBuyMovie] = useState(
    rentBuyMovies[0].id,
  );
  const [appStoreCategory, setAppStoreCategory] = useState("All apps");
  const [appStoreQuery, setAppStoreQuery] = useState("");

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "prime-video-watchlist",
        JSON.stringify(videoWatchlist),
      );
    } catch {
      /* Storage can be disabled by the browser. */
    }
  }, [videoWatchlist]);

  if (!["video", "music", "kindle", "appstore"].includes(service))
    return <Navigate to="/" replace />;

  if (service === "kindle") {
    const openKindleScreen = (screen) => setKindleScreen(screen);
    const basicKindle = kindleDevices.find((item) => item.id === "kindle-2026");
    const scribeKindle = kindleDevices.find(
      (item) => item.id === "kindle-scribe-2026",
    );
    const accessoryItem = kindleDevices.find(
      (item) => item.id === "kindle-click",
    );
    const deviceItems = kindleDevices.filter((item) => {
      if (!kindleScreen?.filter || kindleScreen.filter === "all") return true;
      if (kindleScreen.filter === "scribe")
        return item.title.toLowerCase().includes("scribe");
      return ![
        "kindle-click",
        "kindle-page-turn-cover",
        "kindle-charging-dock",
        "kindle-covers",
      ].includes(item.id);
    });
    return (
      <div className="page-shell entertainment-page digital-catalog-page kindle-page">
        <div
          className={`kindle-slide-viewport ${kindleScreen ? "has-kindle-subscreen" : ""}`}
        >
          <section
            className={`kindle-menu-panel kindle-slide-screen kindle-menu-screen ${kindleScreen ? "is-slid-away" : ""}`}
            aria-label="Kindle menu"
            aria-hidden={Boolean(kindleScreen)}
          >
            <Link
              className="kindle-main-menu"
              to="/"
              tabIndex={kindleScreen ? -1 : undefined}
            >
              <span aria-hidden="true">←</span> MAIN MENU
            </Link>

            <section className="kindle-feature-hero" aria-label="Featured Kindle collections">
              <div className="kindle-feature-copy">
                <span className="media-kicker">Kindle books &amp; reading</span>
                <h2>Discover your next favorite read</h2>
                <p>
                  Thoughtful stories, immersive nonfiction, and beautifully paced
                  reads designed for your next quiet moment.
                </p>
                <div className="kindle-feature-meta">
                  <span>New picks</span>
                  <span>Curated lists</span>
                  <span>Instant reading</span>
                </div>
              </div>
              <div className="kindle-feature-visuals">
                <div className="kindle-feature-cover-wrap">
                  <img
                    src={books[0].cover}
                    alt={books[0].title}
                    loading="lazy"
                  />
                  <div className="kindle-feature-badge">Featured</div>
                </div>
                <div className="kindle-feature-video-card">
                  <YouTubePlayer item={featuredKindleVideo} kind="Book Preview" />
                </div>
              </div>
            </section>

            <nav className="kindle-navigation" aria-label="Kindle categories">
              <section className="kindle-navigation-group">
                <h1>Kindle</h1>
                <KindleMenuItem
                  image={kindleStoreOptions[0].image}
                  title="Visit the Kindle store"
                  description="Explore books and reading samples"
                  disabled={Boolean(kindleScreen)}
                  onClick={() =>
                    openKindleScreen({
                      kind: "books",
                      title: "Visit the Kindle store",
                    })
                  }
                />
                <KindleMenuItem
                  image={basicKindle.image}
                  title="Kindle"
                  description="Lightweight, glare-free e-reader"
                  disabled={Boolean(kindleScreen)}
                  onClick={() =>
                    openKindleScreen({
                      kind: "devices",
                      title: "Kindle",
                      filter: "readers",
                    })
                  }
                />
                <KindleMenuItem
                  image={scribeKindle.image}
                  title="Kindle Scribe"
                  description="Read, write, and take notes"
                  disabled={Boolean(kindleScreen)}
                  onClick={() =>
                    openKindleScreen({
                      kind: "devices",
                      title: "Kindle Scribe",
                      filter: "scribe",
                    })
                  }
                />
                <KindleMenuItem
                  image={accessoryItem.image}
                  title="Accessories"
                  description="Covers, page-turner, and charging"
                  disabled={Boolean(kindleScreen)}
                  onClick={() =>
                    openKindleScreen({
                      kind: "devices",
                      title: "Accessories",
                      filter: "accessories",
                    })
                  }
                />
                <KindleMenuItem
                  image={basicKindle.image}
                  title="Shop all Kindle devices"
                  description="Compare the full Kindle range"
                  disabled={Boolean(kindleScreen)}
                  onClick={() =>
                    openKindleScreen({
                      kind: "devices",
                      title: "Shop all Kindle devices",
                      filter: "all",
                    })
                  }
                />
              </section>
              <section className="kindle-navigation-group">
                <h2>Kindle Store</h2>
                {kindleStoreOptions.map((item) => (
                  <KindleMenuItem
                    image={item.image}
                    title={item.title}
                    description={item.description}
                    disabled={Boolean(kindleScreen)}
                    key={item.title}
                    onClick={() =>
                      openKindleScreen({
                        kind: "books",
                        title: item.title,
                        book: item.book,
                      })
                    }
                  />
                ))}
              </section>
              <section className="kindle-navigation-group">
                <h2>Apps &amp; Resources</h2>
                {kindleResources.map((item) => (
                  <KindleMenuItem
                    image={item.image}
                    title={item.title}
                    description={item.description}
                    disabled={Boolean(kindleScreen)}
                    key={item.title}
                    onClick={() =>
                      openKindleScreen({
                        kind: item.action === "reader" ? "books" : "resource",
                        title: item.title,
                        resource: item,
                      })
                    }
                  />
                ))}
              </section>
            </nav>
            <p className="kindle-demo-note">
              Kindle products and sample reading are available inside this
              project.
            </p>
          </section>

          <section
            className={`kindle-menu-panel kindle-slide-screen kindle-detail-screen ${kindleScreen ? "is-current" : ""}`}
            aria-label={kindleScreen?.title || "Kindle details"}
            aria-hidden={!kindleScreen}
          >
            {kindleScreen && (
              <>
                <button
                  className="kindle-main-menu"
                  type="button"
                  onClick={() => setKindleScreen(null)}
                >
                  <span aria-hidden="true">←</span> BACK TO KINDLE
                </button>
                <div className="kindle-detail-heading">
                  <span className="media-kicker">Kindle · Project store</span>
                  <h1>
                    {kindleScreen.kind === "reader"
                      ? books[kindleScreen.book].title
                      : kindleScreen.title}
                  </h1>
                  {kindleScreen.kind === "reader" && (
                    <p className="kindle-author">
                      by {books[kindleScreen.book].author}
                    </p>
                  )}
                </div>
                {kindleScreen.kind === "devices" && (
                  <div className="kindle-device-grid kindle-detail-grid">
                    {deviceItems.map((item) => (
                      <Link
                        className="kindle-product-card"
                        to={`/products/${item.id}`}
                        key={item.id}
                      >
                        <div className="kindle-product-image">
                          <img src={item.image} alt={item.alt} loading="lazy" />
                        </div>
                        <div className="kindle-product-copy">
                          <h2>{item.title}</h2>
                          <p>{item.description}</p>
                          <small>{item.detail}</small>
                          <span>
                            View details <span aria-hidden="true">›</span>
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                {(kindleScreen.kind === "books" ||
                  kindleScreen.kind === "reader") && (
                  <>
                    {kindleScreen.kind === "reader" ? (
                      <article className="kindle-reader-open">
                        <div className="kindle-page-copy">
                          {books[kindleScreen.book].excerpt}
                          <br />
                          <br />
                          This is an original sample written for the project’s
                          reading demo.
                        </div>
                        <button
                          className="reader-next"
                          type="button"
                          onClick={() =>
                            setKindleScreen({
                              ...kindleScreen,
                              book: (kindleScreen.book + 1) % books.length,
                            })
                          }
                        >
                          Next sample
                        </button>
                      </article>
                    ) : (
                      <>
                        <section className="kindle-books-showcase" aria-label="Featured books">
                          <div className="kindle-books-showcase-copy">
                            <span className="media-kicker">Featured collection</span>
                            <h2>{books[0].title}</h2>
                            <p>{books[0].excerpt}</p>
                            <div className="kindle-showcase-meta">
                              <span>{books[0].author}</span>
                              <span>Sample preview</span>
                            </div>
                          </div>
                          <div className="kindle-books-showcase-visuals">
                            <div className="kindle-books-cover-panel">
                              <img
                                src={books[0].cover}
                                alt={books[0].title}
                                loading="lazy"
                              />
                            </div>
                            <div className="kindle-books-video-panel">
                              <YouTubePlayer
                                item={{
                                  id: "aqz-KE-bpKQ",
                                  title: books[0].title,
                                  creator: books[0].author,
                                }}
                                kind="Book preview"
                              />
                            </div>
                          </div>
                        </section>

                        <div className="kindle-book-shelf">
                          {books.map((book, index) => (
                            <button
                              className="kindle-book-tile"
                              type="button"
                              key={book.title}
                              onClick={() =>
                                setKindleScreen({
                                  kind: "reader",
                                  title: book.title,
                                  book: index,
                                })
                              }
                            >
                              <span className="kindle-book-cover">
                                <img src={book.cover} alt="" loading="lazy" />
                              </span>
                              <strong>{book.title}</strong>
                              <small>{book.author}</small>
                              <span>Read sample ›</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}
                {kindleScreen.kind === "resource" && (
                  <article className="kindle-resource-detail">
                    <img
                      src={kindleScreen.resource.image}
                      alt={kindleScreen.resource.alt}
                    />
                    <p>{kindleScreen.resource.description}</p>
                    <Link
                      className="kindle-store-visit"
                      to={kindleScreen.resource.to || "/products"}
                    >
                      Continue in this project <span aria-hidden="true">›</span>
                    </Link>
                  </article>
                )}
                <p className="kindle-demo-note">
                  USD prices and stock are project demo values. Availability and
                  regional pricing can differ; this store does not connect to
                  Amazon inventory.
                </p>
              </>
            )}
          </section>
        </div>
      </div>
    );
  }
  if (service === "appstore") {
    const visibleApps = apps.filter(
      (app) =>
        (appStoreCategory === "All apps" ||
          app.category === appStoreCategory) &&
        `${app.name} ${app.category} ${app.description}`
          .toLowerCase()
          .includes(appStoreQuery.trim().toLowerCase()),
    );
    return (
      <div className="page-shell entertainment-page digital-catalog-page appstore-page">
        <section className="appstore-hero">
          <div className="appstore-hero-copy">
            <span className="eyebrow">
              <Smartphone size={14} /> Digital Content &amp; Devices
            </span>
            <h1>Find your next favorite</h1>
            <p>
              Explore entertainment, music, reading, games, and shopping
              experiences available in this project.
            </p>
            <label className="appstore-search">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                value={appStoreQuery}
                onChange={(event) => setAppStoreQuery(event.target.value)}
                placeholder="Search apps and categories"
                aria-label="Search apps and categories"
              />
            </label>
          </div>
          <div className="appstore-hero-art" aria-hidden="true">
            <div className="appstore-screen">
              <span>amazon</span>
              <b>appstore</b>
              <div className="appstore-screen-icons">
                <i>▶</i>
                <i>♫</i>
                <i>♟</i>
              </div>
            </div>
          </div>
        </section>
        <section className="appstore-discovery">
          <div className="appstore-section-heading">
            <div>
              <span className="media-kicker">Explore the collection</span>
              <h2>Apps for every day</h2>
            </div>
            <span className="appstore-result-count">
              {visibleApps.length}{" "}
              {visibleApps.length === 1 ? "experience" : "experiences"}
            </span>
          </div>
          <div
            className="appstore-filter-row"
            role="group"
            aria-label="Filter apps by category"
          >
            {appStoreCategories.map((category) => (
              <button
                className={`appstore-filter ${appStoreCategory === category ? "is-active" : ""}`}
                type="button"
                key={category}
                onClick={() => setAppStoreCategory(category)}
                aria-pressed={appStoreCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
          {visibleApps.length ? (
            <div className="appstore-grid">
              {visibleApps.map((app) => (
                <Link className="appstore-card" to={app.to} key={app.name}>
                  <span
                    className={`appstore-icon appstore-icon-${app.category.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`}
                    aria-hidden="true"
                  >
                    {app.icon}
                  </span>
                  <span className="appstore-category">{app.category}</span>
                  <h3>{app.name}</h3>
                  <p>{app.description}</p>
                  <span className="appstore-card-link">
                    Open in this project <span aria-hidden="true">›</span>
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="appstore-empty">
              <strong>No apps found</strong>
              <span>Try a different search or choose another category.</span>
              <button
                type="button"
                onClick={() => {
                  setAppStoreQuery("");
                  setAppStoreCategory("All apps");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
        <aside className="appstore-region-note">
          <span aria-hidden="true">ⓘ</span>
          <p>
            <strong>Project demo</strong>
            <br />
            These category cards open pages and sample content inside this
            project.
          </p>
        </aside>
      </div>
    );
  }

  const isVideo = service === "video";
  if (isVideo) {
    const isIncludedSection = primeVideoSection === "Included with Prime";
    const activeVideos = isIncludedSection ? primeVideoTrailers : videos;
    const activeVideoIndex = isIncludedSection
      ? selectedIncludedVideo
      : selectedVideo;
    const current = activeVideos[activeVideoIndex];
    const isSaved = videoWatchlist.includes(current.id);
    const listSections = ["All Videos", "Included with Prime", "Rent or Buy"];
    const savedVideoItems = [
      ...videos.map((item, index) => ({
        ...item,
        index,
        section: "All Videos",
      })),
      ...primeVideoTrailers.map((item, index) => ({
        ...item,
        index,
        section: "Included with Prime",
      })),
    ].filter((item) => videoWatchlist.includes(item.id));
    const savedMovieItems = rentBuyMovies.filter((movie) =>
      videoWatchlist.includes(movie.id),
    );
    const toggleWatchlist = (id) =>
      setVideoWatchlist((saved) =>
        saved.includes(id)
          ? saved.filter((savedId) => savedId !== id)
          : [...saved, id],
      );
    const selectPrimeChannel = (channel) => {
      setSelectedPrimeChannel(channel);
      requestAnimationFrame(() =>
        primeChannelDetailRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        }),
      );
    };

    return (
      <div className="page-shell entertainment-page entertainment-video prime-video-page">
        <Link
          className="prime-main-menu"
          to="/"
          aria-label="Return to main menu"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          <span>MAIN MENU</span>
        </Link>
        <div className="prime-video-heading">
          <span className="eyebrow">
            <Video size={14} /> Digital Content &amp; Devices
          </span>
          <h1>Prime Video</h1>
          <p>
            Explore trailers, sample videos, and rent-or-buy movie listings in
            this project.
          </p>
        </div>
        <div className="prime-video-layout">
          <aside className="prime-video-menu" aria-label="Prime Video menu">
            <h2>Prime Video</h2>
            <nav>
              {primeVideoMenu.map((item) => (
                <button
                  className={primeVideoSection === item ? "is-active" : ""}
                  type="button"
                  key={item}
                  onClick={() => setPrimeVideoSection(item)}
                  aria-current={primeVideoSection === item ? "page" : undefined}
                >
                  {item}
                </button>
              ))}
            </nav>
          </aside>
          <div className="prime-video-content">
            {primeVideoSection === "Rent or Buy" && (
              <section className="prime-rent-buy-section">
                <div className="prime-channels-heading">
                  <span className="media-kicker">Prime Video Store</span>
                  <h2>Rent or buy movies</h2>
                  <p>
                    Choose a movie to see its Amazon listing and offer options.
                  </p>
                </div>
                <p className="prime-video-demo-callout">
                  Movie listings and sample USD prices come from Amazon US and
                  were checked October 23, 2026. Prices and availability can
                  vary by country and change. This project does not process
                  payments or stream full movies.
                </p>
                {[
                  { id: "comedy-deals", title: "Comedy movie deals" },
                  {
                    id: "audience-favorites",
                    title: "Audience and critic approved",
                  },
                  { id: "premium", title: "Premium New Releases" },
                  { id: "deals", title: "$4.99 or less movie deals" },
                  { id: "popular", title: "Popular movies" },
                  { id: "more", title: "More movies to rent or buy" },
                ].map((shelf) => {
                  const shelfMovies = rentBuyMovies.filter(
                    (movie) => movie.shelf === shelf.id,
                  );
                  if (!shelfMovies.length) return null;
                  return (
                    <div className="prime-rent-buy-shelf" key={shelf.id}>
                      <h3>{shelf.title}</h3>
                      <div className="prime-rent-buy-grid">
                        {shelfMovies.map((movie) => (
                          <button
                            className={`prime-rent-buy-card ${selectedRentBuyMovie === movie.id ? "is-selected" : ""}`}
                            type="button"
                            key={movie.id}
                            onClick={() => {
                              setSelectedRentBuyMovie(movie.id);
                              setRentBuyMessage("");
                            }}
                            aria-pressed={selectedRentBuyMovie === movie.id}
                          >
                            <img
                              src={movie.poster}
                              alt={`${movie.title} poster`}
                              loading="lazy"
                            />
                            <span className="prime-rent-buy-card-copy">
                              <strong>{movie.title}</strong>
                              <small>
                                {movie.year} · Rated {movie.rating}
                              </small>
                              <small>
                                {movie.rentPrice != null &&
                                  `Rent $${movie.rentPrice.toFixed(2)}`}
                                {movie.rentPrice != null &&
                                  movie.buyPrice != null &&
                                  " · "}
                                {movie.buyPrice != null &&
                                  `Buy $${movie.buyPrice.toFixed(2)}`}
                                {movie.rentPrice == null &&
                                  movie.buyPrice == null &&
                                  (movie.availability ||
                                    "Check Amazon listing")}
                              </small>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {(() => {
                  const movie =
                    rentBuyMovies.find(
                      (item) => item.id === selectedRentBuyMovie,
                    ) ?? rentBuyMovies[0];
                  const selectedMode = rentBuyModes[movie.id];
                  const movieIsSaved = videoWatchlist.includes(movie.id);
                  return (
                    <article className="prime-rent-buy-detail">
                      {movie.trailerId ? (
                        <div className="prime-rent-buy-trailer">
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${movie.trailerId}?rel=0&playsinline=1`}
                            title={`${movie.title} official trailer`}
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <img
                          src={movie.poster}
                          alt={`${movie.title} poster`}
                          loading="lazy"
                        />
                      )}
                      <div className="prime-rent-buy-detail-copy">
                        <span className="media-kicker">
                          {movie.year} · Rated {movie.rating}
                        </span>
                        <h3>{movie.title}</h3>
                        <p>{movie.description}</p>
                        <div className="prime-rent-buy-actions">
                          {movie.rentPrice != null && (
                            <button
                              className="prime-video-action"
                              type="button"
                              onClick={() => {
                                setRentBuyModes((modes) => ({
                                  ...modes,
                                  [movie.id]: "rent",
                                }));
                                setRentBuyMessage(
                                  `Rent option selected for ${movie.title}. Continue on Prime Video to check availability and complete checkout.`,
                                );
                              }}
                            >
                              Rent · ${movie.rentPrice.toFixed(2)}
                            </button>
                          )}
                          {movie.buyPrice != null && (
                            <button
                              className="prime-video-action"
                              type="button"
                              onClick={() => {
                                setRentBuyModes((modes) => ({
                                  ...modes,
                                  [movie.id]: "buy",
                                }));
                                setRentBuyMessage(
                                  `Buy option selected for ${movie.title}. Continue on Prime Video to check availability and complete checkout.`,
                                );
                              }}
                            >
                              Buy · ${movie.buyPrice.toFixed(2)}
                            </button>
                          )}
                          <a
                            className="prime-rent-buy-link"
                            href={movie.primeVideoUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View listing on Prime Video{" "}
                            <span aria-hidden="true">↗</span>
                          </a>
                          <button
                            className={`prime-video-save ${movieIsSaved ? "is-saved" : ""}`}
                            type="button"
                            aria-pressed={movieIsSaved}
                            onClick={() => toggleWatchlist(movie.id)}
                          >
                            {movieIsSaved
                              ? "✓ Saved to Watchlist"
                              : "+ Add to Watchlist"}
                          </button>
                        </div>
                        {movie.availability && (
                          <p className="prime-rent-buy-status">
                            {movie.availability}; check the Amazon listing for
                            current offers.
                          </p>
                        )}
                        {rentBuyMessage && selectedMode && (
                          <p className="prime-rent-buy-status" role="status">
                            {rentBuyMessage}
                          </p>
                        )}
                      </div>
                    </article>
                  );
                })()}
              </section>
            )}
            {listSections.includes(primeVideoSection) &&
              primeVideoSection !== "Rent or Buy" && (
                <>
                  <section className="media-feature" aria-label="Video player">
                    <YouTubePlayer item={current} kind="Video" />
                    <div className="media-feature-copy">
                      <span className="media-kicker">
                        <Video size={15} /> Now selected
                      </span>
                      <h2>{current.title}</h2>
                      <p>{current.creator}</p>
                      <button
                        className={`prime-video-save ${isSaved ? "is-saved" : ""}`}
                        type="button"
                        aria-pressed={isSaved}
                        onClick={() => toggleWatchlist(current.id)}
                      >
                        {isSaved
                          ? "✓ Added to Watchlist"
                          : "+ Add to Watchlist"}
                      </button>
                    </div>
                  </section>
                  <section
                    className="media-collection"
                    aria-label="Choose a video"
                  >
                    <div className="section-heading">
                      <div>
                        <h2>
                          {isIncludedSection
                            ? "Prime Video official trailers"
                            : primeVideoSection === "All Videos"
                              ? "All videos"
                              : primeVideoSection}
                        </h2>
                        <p>{activeVideos.length} videos · play on this page</p>
                      </div>
                    </div>
                    {isIncludedSection && (
                      <p className="prime-video-demo-callout">
                        Official promotional trailers published by Prime Video.
                        They are previews, not full episodes, and this demo does
                        not verify membership availability in Ethiopia.
                      </p>
                    )}
                    <div className="media-choice-grid">
                      {activeVideos.map((item, index) => (
                        <button
                          className={`media-choice ${activeVideoIndex === index ? "is-selected" : ""}`}
                          type="button"
                          key={item.id}
                          onClick={() =>
                            isIncludedSection
                              ? setSelectedIncludedVideo(index)
                              : setSelectedVideo(index)
                          }
                          aria-pressed={activeVideoIndex === index}
                        >
                          <img
                            src={`https://i.ytimg.com/vi/${item.id}/mqdefault.jpg`}
                            alt=""
                            loading="lazy"
                          />
                          <span className="media-choice-copy">
                            <strong>{item.title}</strong>
                            <small>{item.creator}</small>
                          </span>
                          <span className="media-choice-play">
                            <Play
                              size={15}
                              fill="currentColor"
                              aria-hidden="true"
                            />
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>
                </>
              )}
            {primeVideoSection === "Your Watchlist" && (
              <section className="prime-video-info-panel">
                <span className="media-kicker">
                  Your Watchlist · Saved on this device
                </span>
                <h2>Watchlist</h2>
                <p>
                  Saved titles stay in this browser. Select a movie to open its
                  Amazon listing; this project does not share your watchlist
                  with Amazon.
                </p>
                {savedMovieItems.length > 0 && (
                  <>
                    <h3>Movies</h3>
                    <div className="prime-rent-buy-grid">
                      {savedMovieItems.map((movie) => (
                        <article
                          className="prime-watchlist-card"
                          key={movie.id}
                        >
                          <a
                            className="prime-watchlist-poster"
                            href={movie.primeVideoUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src={movie.poster}
                              alt={`${movie.title} poster`}
                              loading="lazy"
                            />
                          </a>
                          <div>
                            <strong>{movie.title}</strong>
                            <small>
                              {movie.year} ·{" "}
                              {movie.rentPrice != null
                                ? `Rent $${movie.rentPrice.toFixed(2)}`
                                : ""}
                              {movie.rentPrice != null && movie.buyPrice != null
                                ? " · "
                                : ""}
                              {movie.buyPrice != null
                                ? `Buy $${movie.buyPrice.toFixed(2)}`
                                : ""}
                            </small>
                            <a
                              className="prime-rent-buy-link"
                              href={movie.primeVideoUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Open Prime Video ↗
                            </a>
                            <button
                              className="prime-watchlist-remove"
                              type="button"
                              onClick={() => toggleWatchlist(movie.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  </>
                )}
                {savedVideoItems.length > 0 && (
                  <>
                    <h3>Project video previews</h3>
                    <div className="media-choice-grid">
                      {savedVideoItems.map((item) => (
                        <button
                          className="media-choice"
                          type="button"
                          key={item.id}
                          onClick={() => {
                            if (item.section === "Included with Prime")
                              setSelectedIncludedVideo(item.index);
                            else setSelectedVideo(item.index);
                            setPrimeVideoSection(item.section);
                          }}
                        >
                          <img
                            src={`https://i.ytimg.com/vi/${item.id}/mqdefault.jpg`}
                            alt=""
                            loading="lazy"
                          />
                          <span className="media-choice-copy">
                            <strong>{item.title}</strong>
                            <small>{item.creator}</small>
                          </span>
                          <span className="media-choice-play">
                            <Play
                              size={15}
                              fill="currentColor"
                              aria-hidden="true"
                            />
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
                {savedMovieItems.length === 0 &&
                  savedVideoItems.length === 0 && (
                    <>
                      <p>
                        Your watchlist is empty. Save a movie from Rent or Buy
                        or a preview from its player.
                      </p>
                      <button
                        className="prime-video-action"
                        type="button"
                        onClick={() => setPrimeVideoSection("Rent or Buy")}
                      >
                        Browse movies
                      </button>{" "}
                      <button
                        className="prime-video-action"
                        type="button"
                        onClick={() => setPrimeVideoSection("All Videos")}
                      >
                        Browse previews
                      </button>
                    </>
                  )}
              </section>
            )}
            {primeVideoSection === "Prime Video Channels" && (
              <section className="prime-channels-section">
                <div className="prime-channels-heading">
                  <span className="media-kicker">
                    Explore add-on subscriptions
                  </span>
                  <h2>Prime Video Channels</h2>
                  <p>Choose a channel to see its details in this project.</p>
                </div>
                <div
                  className="prime-channel-detail"
                  ref={primeChannelDetailRef}
                  aria-live="polite"
                >
                  <div>
                    <span className="media-kicker">Selected channel</span>
                    <h3>{selectedPrimeChannel.name}</h3>
                    <p>{selectedPrimeChannel.description}</p>
                  </div>
                  <div className="prime-channel-detail-actions">
                    <span className="prime-channel-detail-note">
                      This project demo does not stream channel subscriptions.
                      Availability and offers vary by country.
                    </span>
                    <button
                      className="prime-video-action"
                      type="button"
                      onClick={() => setPrimeVideoSection("All Videos")}
                    >
                      Browse project videos
                    </button>
                  </div>
                </div>
                <div className="prime-channel-grid">
                  {primeVideoChannels.map((channel) => (
                    <button
                      className={`prime-channel-card ${selectedPrimeChannel.name === channel.name ? "is-selected" : ""}`}
                      type="button"
                      key={channel.name}
                      onClick={() => selectPrimeChannel(channel)}
                      aria-pressed={selectedPrimeChannel.name === channel.name}
                    >
                      <span
                        className={`prime-channel-art prime-channel-${channel.theme}`}
                      >
                        <strong>{channel.name}</strong>
                        <small>CHANNEL</small>
                      </span>
                      <span className="prime-channel-description">
                        {channel.description}
                      </span>
                      <span className="prime-channel-link">
                        {selectedPrimeChannel.name === channel.name
                          ? "Selected"
                          : "View details"}{" "}
                        <span aria-hidden="true">›</span>
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}
            {primeVideoSection === "Purchases & Rentals" && (
              <section className="prime-video-info-panel">
                <span className="media-kicker">Purchases &amp; Rentals</span>
                <h2>Real movies on Prime Video</h2>
                <p>
                  These titles link to their Amazon detail pages. Choose an
                  offer and complete checkout on Amazon. This project cannot see
                  purchases in your account or process payments; completed
                  Amazon rentals and purchases appear in that account’s
                  Purchases &amp; Rentals section.
                </p>
                <p className="prime-video-demo-callout">
                  Prices shown are sample USD offers from Amazon US and may
                  change or differ by country. Check the Amazon listing before
                  checkout.
                </p>
                <div className="prime-rent-buy-grid">
                  {rentBuyMovies
                    .filter(
                      (movie) =>
                        movie.rentPrice != null || movie.buyPrice != null,
                    )
                    .map((movie) => (
                      <article className="prime-watchlist-card" key={movie.id}>
                        <a
                          className="prime-watchlist-poster"
                          href={movie.primeVideoUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={movie.poster}
                            alt={`${movie.title} poster`}
                            loading="lazy"
                          />
                        </a>
                        <div>
                          <strong>{movie.title}</strong>
                          <small>
                            {movie.year} ·{" "}
                            {movie.rentPrice != null
                              ? `Rent $${movie.rentPrice.toFixed(2)}`
                              : ""}
                            {movie.rentPrice != null && movie.buyPrice != null
                              ? " · "
                              : ""}
                            {movie.buyPrice != null
                              ? `Buy $${movie.buyPrice.toFixed(2)}`
                              : ""}
                          </small>
                          <a
                            className="prime-rent-buy-link"
                            href={movie.primeVideoUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View offer on Amazon ↗
                          </a>
                          <button
                            className="prime-watchlist-remove"
                            type="button"
                            onClick={() => toggleWatchlist(movie.id)}
                          >
                            {videoWatchlist.includes(movie.id)
                              ? "✓ In Watchlist · Remove"
                              : "+ Add to Watchlist"}
                          </button>
                        </div>
                      </article>
                    ))}
                </div>
                <p>
                  <a
                    className="prime-rent-buy-link"
                    href="https://www.primevideo.com/help?csTools=982&nodeId=TLKV1OADtdHSPuczvv"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Amazon: how renting and buying works ↗
                  </a>
                </p>
              </section>
            )}
            {primeVideoSection === "Watch Anywhere" && (
              <section className="prime-video-info-panel">
                <span className="media-kicker">Watch Anywhere</span>
                <h2>Watch on supported devices</h2>
                <p>
                  Amazon says Prime Video is available through a web browser and
                  supported smart TVs, streaming devices, game consoles, mobile
                  devices, and Fire tablets. Supported models and features can
                  vary by country.
                </p>
                <ol>
                  <li>
                    Open Prime Video on a supported device or visit
                    PrimeVideo.com.
                  </li>
                  <li>
                    Sign in to the Amazon account used for your membership or
                    purchase.
                  </li>
                  <li>
                    Open your title and select Play. Download options depend on
                    the title and device.
                  </li>
                </ol>
                <div className="prime-video-info-links">
                  <a
                    className="prime-rent-buy-link"
                    href="https://www.primevideo.com/help?language=en_US&nodeId=GXMWDGNCPX2JLPFH"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Amazon compatible devices ↗
                  </a>
                  <a
                    className="prime-rent-buy-link"
                    href="https://www.primevideo.com/help?avRegion=h7g3ljs&nodeId=G202095500"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Amazon playback and download rules ↗
                  </a>
                </div>
                <button
                  className="prime-video-action"
                  type="button"
                  onClick={() => setPrimeVideoSection("Rent or Buy")}
                >
                  Browse real movie listings
                </button>
              </section>
            )}
            {primeVideoSection === "Getting Started" && (
              <section className="prime-video-info-panel">
                <span className="media-kicker">
                  Getting Started · Amazon Prime Video
                </span>
                <h2>Find a movie and start watching</h2>
                <ol>
                  <li>
                    Browse real titles in this project, then open a title’s
                    Amazon listing.
                  </li>
                  <li>
                    Sign in to Amazon and confirm the offer, country, and
                    current price.
                  </li>
                  <li>
                    On Amazon, choose an available option such as Included with
                    Prime, rent, or buy, then complete checkout there.
                  </li>
                  <li>
                    Return to Prime Video and open your title from Watchlist or
                    Purchases &amp; Rentals.
                  </li>
                </ol>
                <p>
                  For a rental, Amazon’s usual viewing window is 30 days to
                  start and 48 hours to finish after playback begins; the title
                  page shows its specific terms. Availability and eligible
                  devices vary by country.
                </p>
                <div className="prime-video-info-links">
                  <a
                    className="prime-rent-buy-link"
                    href="https://www.primevideo.com/help?csTools=982&nodeId=TLKV1OADtdHSPuczvv"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Amazon: what can I watch? ↗
                  </a>
                  <a
                    className="prime-rent-buy-link"
                    href="https://www.primevideo.com/help?avRegion=h7g3ljs&nodeId=G202095500"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Amazon usage rules ↗
                  </a>
                </div>
                <p className="prime-video-demo-callout">
                  This project connects you to Amazon title pages, but it does
                  not access your Amazon account, place orders, stream full
                  movies, or record completed rentals and purchases.
                </p>
                <button
                  className="prime-video-action"
                  type="button"
                  onClick={() => setPrimeVideoSection("Rent or Buy")}
                >
                  Browse movies
                </button>
              </section>
            )}
          </div>
        </div>
        <p className="media-note">
          Videos play from embedded sources. This project does not connect to
          Prime membership or Amazon’s paid catalog.
        </p>
        <Link className="text-link entertainment-back" to="/">
          Back to the store
        </Link>
      </div>
    );
  }

  const collection = isVideo ? videos : ethiopianTracks;
  const selection = isVideo ? selectedVideo : selectedTrack;
  const selectItem = isVideo ? setSelectedVideo : setSelectedTrack;
  const current = collection[selection];
  const visibleAmazonMusicPicks =
    amazonMusicSection === "Podcasts"
      ? amazonMusicPicks.filter((pick) => pick.type.includes("Podcast"))
      : amazonMusicPicks.filter((pick) => pick.type.includes("playlist"));
  const activeAmazonMusicPick =
    amazonMusicPicks.find((pick) => pick.title === selectedAmazonMusicPick) ??
    amazonMusicPicks[0];

  return (
    <div className="page-shell entertainment-page entertainment-music">
      <Link className="prime-main-menu" to="/" aria-label="Return to main menu">
        <ArrowLeft size={18} aria-hidden="true" />
        <span>MAIN MENU</span>
      </Link>
      <div className="amazon-music-layout">
        <aside
          className="amazon-music-sidebar"
          aria-label="Amazon Music navigation"
        >
          <h2>Stream Music</h2>
          <nav>
            {amazonMusicMenu.map((item) => (
              <button
                className={amazonMusicSection === item ? "is-current" : ""}
                type="button"
                key={item}
                onClick={() => {
                  setAmazonMusicSection(item);
                  const firstPick =
                    item === "Podcasts"
                      ? amazonMusicPicks.find((pick) =>
                          pick.type.includes("Podcast"),
                        )
                      : item === "Amazon Music Unlimited"
                        ? amazonMusicPicks.find((pick) =>
                            pick.type.includes("playlist"),
                          )
                        : amazonMusicPicks[0];
                  if (firstPick) setSelectedAmazonMusicPick(firstPick.title);
                }}
                aria-current={amazonMusicSection === item ? "page" : undefined}
              >
                {item}
              </button>
            ))}
          </nav>
        </aside>
        <main className="amazon-music-main" id="amazon-music-stream-player">
          <div className="entertainment-heading">
            <span className="eyebrow">
              <Radio size={14} /> Digital Content &amp; Devices
            </span>
            <h1>
              {amazonMusicSection === "Open Web Player"
                ? "Stream Music"
                : amazonMusicSection}
            </h1>
            <p>
              {amazonMusicSection === "Download the app"
                ? "Explore the app information and music samples inside this project."
                : "Browse music and podcast artwork here; project previews play below."}
            </p>
          </div>
          {amazonMusicSection === "Download the app" ? (
            <section className="amazon-music-local-info">
              <h2>Amazon Music app</h2>
              <p>
                This project page does not install apps. You can still browse
                the artwork and play the project’s music previews here.
              </p>
              <button
                className="prime-video-action"
                type="button"
                onClick={() => setAmazonMusicSection("Stream Music")}
              >
                Browse project music
              </button>
            </section>
          ) : (
            <>
              {(amazonMusicSection === "Stream Music" ||
                amazonMusicSection === "Open Web Player" ||
                amazonMusicSection === "Free Streaming Music") && (
                <section
                  className="amazon-music-home"
                  aria-label="Amazon Music discovery"
                >
                  <div className="amazon-music-home-section">
                    <div className="section-heading">
                      <div>
                        <h2>Popular artists</h2>
                        <p>
                          Select an artist to highlight them in this project.
                        </p>
                      </div>
                    </div>
                    <div className="amazon-music-artist-row">
                      {amazonMusicArtists.map((artist) => (
                        <button
                          className={`amazon-music-artist-card ${selectedAmazonArtist === artist.name ? "is-selected" : ""}`}
                          type="button"
                          key={artist.name}
                          onClick={() => setSelectedAmazonArtist(artist.name)}
                          aria-pressed={selectedAmazonArtist === artist.name}
                        >
                          <img src={artist.image} alt="" loading="lazy" />
                          <span>{artist.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="amazon-music-home-section amazon-music-home-playlists">
                    <div className="section-heading">
                      <div>
                        <h2>New Release Playlists</h2>
                        <p>
                          Amazon Music playlist artwork · choose a card to view
                          it here.
                        </p>
                      </div>
                    </div>
                    <div className="amazon-music-playlist-row">
                      {amazonMusicPicks
                        .filter((pick) => pick.type.includes("playlist"))
                        .map((pick) => (
                          <button
                            className={`amazon-music-playlist-card ${activeAmazonMusicPick.title === pick.title ? "is-selected" : ""}`}
                            type="button"
                            onClick={() =>
                              setSelectedAmazonMusicPick(pick.title)
                            }
                            aria-pressed={
                              activeAmazonMusicPick.title === pick.title
                            }
                            key={pick.title}
                          >
                            <img
                              src={pick.image}
                              alt={`${pick.title} cover`}
                              loading="lazy"
                            />
                            <strong>{pick.title}</strong>
                            <small>Amazon Music playlist</small>
                          </button>
                        ))}
                    </div>
                  </div>
                  <div className="amazon-music-free-banner">
                    <p>
                      Play free project music previews on this page. No purchase
                      needed.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setAmazonMusicSection("Free Streaming Music");
                        document
                          .getElementById("project-music-player")
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                      }}
                    >
                      Listen Free
                    </button>
                  </div>
                  <article className="amazon-music-pick-detail">
                    <img
                      src={activeAmazonMusicPick.image}
                      alt={`${activeAmazonMusicPick.title} cover`}
                      loading="lazy"
                    />
                    <div>
                      <span className="media-kicker">
                        Selected playlist · {selectedAmazonArtist}
                      </span>
                      <h3>{activeAmazonMusicPick.title}</h3>
                      <p>
                        This project shows playlist artwork and plays its own
                        music previews below. Amazon catalog audio is not
                        streamed here.
                      </p>
                    </div>
                  </article>
                </section>
              )}
              {amazonMusicSection === "Podcasts" && (
                <section
                  className="amazon-music-home amazon-podcast-discovery"
                  aria-label="Amazon Music podcasts"
                >
                  {[
                    {
                      title: "Featured Ad-free",
                      id: "podcast-featured-row",
                      items: visibleAmazonMusicPicks.slice(0, 6),
                    },
                    {
                      title: "Ad-Free History",
                      id: "podcast-history-row",
                      items: visibleAmazonMusicPicks.slice(6),
                    },
                  ].map((row) => (
                    <section
                      className="amazon-podcast-row-section"
                      key={row.id}
                    >
                      <div className="amazon-podcast-row-heading">
                        <h2>{row.title}</h2>
                        <div className="amazon-podcast-row-controls">
                          <button
                            type="button"
                            aria-label={`Scroll ${row.title} left`}
                            onClick={() =>
                              document
                                .getElementById(row.id)
                                ?.scrollBy({ left: -420, behavior: "smooth" })
                            }
                          >
                            ‹
                          </button>
                          <button
                            type="button"
                            aria-label={`Scroll ${row.title} right`}
                            onClick={() =>
                              document
                                .getElementById(row.id)
                                ?.scrollBy({ left: 420, behavior: "smooth" })
                            }
                          >
                            ›
                          </button>
                          <button
                            className="amazon-podcast-see-more"
                            type="button"
                            onClick={() => {
                              const carousel = document.getElementById(row.id);
                              if (carousel)
                                carousel.scrollTo({
                                  left: carousel.scrollWidth,
                                  behavior: "smooth",
                                });
                            }}
                          >
                            SEE MORE
                          </button>
                        </div>
                      </div>
                      <div className="amazon-podcast-carousel" id={row.id}>
                        {row.items.map((pick) => (
                          <button
                            className={`amazon-podcast-card ${activeAmazonMusicPick.title === pick.title ? "is-selected" : ""}`}
                            type="button"
                            key={pick.title}
                            onClick={() =>
                              setSelectedAmazonMusicPick(pick.title)
                            }
                            aria-pressed={
                              activeAmazonMusicPick.title === pick.title
                            }
                          >
                            <img
                              src={pick.image}
                              alt={`${pick.title} cover`}
                              loading="lazy"
                            />
                            <strong>{pick.title}</strong>
                            <small>{pick.type.replace("Podcast · ", "")}</small>
                          </button>
                        ))}
                      </div>
                    </section>
                  ))}
                  <article className="amazon-music-pick-detail">
                    <img
                      src={activeAmazonMusicPick.image}
                      alt={`${activeAmazonMusicPick.title} cover`}
                      loading="lazy"
                    />
                    <div>
                      <span className="media-kicker">
                        Podcast catalog reference
                      </span>
                      <h3>{activeAmazonMusicPick.title}</h3>
                      <p>
                        {activeAmazonMusicPick.type}. This project shows the
                        title and artwork; podcast audio does not play here.
                      </p>
                    </div>
                  </article>
                </section>
              )}
              {amazonMusicSection === "Amazon Music Unlimited" && (
                <section
                  className="amazon-music-picks"
                  aria-label="Amazon Music playlists"
                >
                  <div className="section-heading">
                    <div>
                      <h2>Amazon Music playlists</h2>
                      <p>
                        Select a playlist to view its artwork in this project.
                      </p>
                    </div>
                  </div>
                  <div className="amazon-music-picks-grid">
                    {visibleAmazonMusicPicks.map((pick) => (
                      <button
                        className={`amazon-music-pick-card ${activeAmazonMusicPick.title === pick.title ? "is-selected" : ""}`}
                        type="button"
                        onClick={() => setSelectedAmazonMusicPick(pick.title)}
                        aria-pressed={
                          activeAmazonMusicPick.title === pick.title
                        }
                        key={pick.title}
                      >
                        <img
                          src={pick.image}
                          alt={`${pick.title} cover`}
                          loading="lazy"
                        />
                        <span>
                          <strong>{pick.title}</strong>
                          <small>{pick.type}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                  <article className="amazon-music-pick-detail">
                    <img
                      src={activeAmazonMusicPick.image}
                      alt={`${activeAmazonMusicPick.title} cover`}
                      loading="lazy"
                    />
                    <div>
                      <span className="media-kicker">
                        Amazon Music catalog reference
                      </span>
                      <h3>{activeAmazonMusicPick.title}</h3>
                      <p>
                        This project displays the title and artwork; it does not
                        stream Amazon catalog audio.
                      </p>
                    </div>
                  </article>
                </section>
              )}
              {(amazonMusicSection === "Stream Music" ||
                amazonMusicSection === "Open Web Player" ||
                amazonMusicSection === "Free Streaming Music") && (
                <>
                  <section
                    id="project-music-player"
                    className="media-feature"
                    aria-label="Project music video player"
                  >
                    <YouTubePlayer item={current} kind="Music video" />
                    <div className="media-feature-copy">
                      <span className="media-kicker">
                        <Music2 size={15} /> Project preview · now selected
                      </span>
                      <h2>{current.title}</h2>
                      <p>{current.artist}</p>
                    </div>
                  </section>
                  <section
                    className="media-collection"
                    aria-label="Choose project music"
                  >
                    <div className="section-heading">
                      <div>
                        <h2>Ethiopian music selection</h2>
                        <p>
                          {collection.length} project previews · plays on this
                          page
                        </p>
                      </div>
                    </div>
                    <div className="media-choice-grid">
                      {collection.map((item, index) => (
                        <button
                          className={`media-choice ${selection === index ? "is-selected" : ""}`}
                          type="button"
                          key={item.id}
                          onClick={() => selectItem(index)}
                          aria-pressed={selection === index}
                        >
                          <img
                            src={`https://i.ytimg.com/vi/${item.id}/mqdefault.jpg`}
                            alt=""
                            loading="lazy"
                          />
                          <span className="media-choice-copy">
                            <strong>{item.title}</strong>
                            <small>{item.artist}</small>
                          </span>
                          <span className="media-choice-play">
                            <Play
                              size={15}
                              fill="currentColor"
                              aria-hidden="true"
                            />
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>
                  <p className="media-note">
                    Project previews play using embedded YouTube videos. Amazon
                    catalog songs and podcasts do not play inside this project.
                  </p>
                </>
              )}
            </>
          )}
          <Link className="text-link entertainment-back" to="/">
            Back to the store
          </Link>
        </main>
      </div>
    </div>
  );
}

export default Entertainment;
