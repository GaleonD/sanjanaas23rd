import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  Heart,
  Music,
  BookOpen,
  Quote,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Star,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  PenTool,
  Flower,
  Users,
  MessageSquare,
  ExternalLink,
} from "lucide-react";

/**
 * COTTON CANDY CONFIGURATION
 */
const SITE_CONFIG = {
  friendName: "Sanjanaa.",
  birthDate: "2003-01-13T00:00:00",
  themeBg: "bg-gradient-to-br from-[#ffdee9] via-[#e5efff] to-[#f0eaff]",
  accentPink: "text-pink-500",
  accentBlue: "text-blue-500",
  accentViolet: "text-purple-500",
  cardBg: "bg-white/30 backdrop-blur-md border border-white/50",
  sounds: {
    nav: "https://www.soundjay.com/buttons/sounds/button-20.mp3",
    carousel: "https://www.soundjay.com/buttons/sounds/button-16.mp3",
    confetti: "https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3",
  },
};

/**
 * CHARACTER SPRITES CONFIGURATION
 */
const CHARACTER_LIST = [
  { name: "Totoro", url: "https://p7.hiclipart.com/preview/830/301/211/my-neighbor-totoro-catbus-mei-kusakabe-satsuki-kusakabe-studio-ghibli-totoro.jpg", tilt: "rotate-[15deg]" }, 
  { name: "Sanrio", url: "https://w7.pngwing.com/pngs/745/419/png-transparent-sanrio-my-melody-kuromi-hello-kitty-character-sanrio-love-child-flower.png", tilt: "rotate-[-12deg]" }, 
  { name: "Pikachu", url: "https://w7.pngwing.com/pngs/381/640/png-transparent-pikachu-pokemon-detective-pikachu-pokemon-party-pikachu-thumbnail.png", tilt: "rotate-[10deg]" }, 
  { name: "Cinnamoroll", url: "https://w7.pngwing.com/pngs/1000/775/png-transparent-cinnamoroll-sanrio-pompompurin-sticker-line-sanrio-white-mammal-face.png", tilt: "rotate-[-15deg]" }, 
  { name: "Kuromi", url: "https://w7.pngwing.com/pngs/677/853/png-transparent-kuromi-sanrio-my-melody-hello-kitty-sticker-others-miscellaneous-purple-mammal.png", tilt: "rotate-[12deg]" }, 
  { name: "Sailor Moon", url: "https://w7.pngwing.com/pngs/513/376/png-transparent-sailor-moon-art-usagi-tsukino-sailor-mercury-sailor-moon-mammal-child-face.png", tilt: "rotate-[-10deg]" }, 
  { name: "Chi", url: "https://w7.pngwing.com/pngs/731/100/png-transparent-chi-s-sweet-home-kitten-cat-manga-kitten-white-mammal-animals.png", tilt: "rotate-[15deg]" }, 
  { name: "Moomin", url: "https://w7.pngwing.com/pngs/454/980/png-transparent-moomintroll-the-moomins-moomin-valley-snork-maiden-character-others-white-mammal-hand.png", tilt: "rotate-[-12deg]" } 
];

/**
 * UI SUB-COMPONENTS
 */
const SectionSprite = ({ Icon, colorClass, delay = "0s", side }) => {
  const isLeft = side === "left";
  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-1000 z-0
        ${isLeft ? "-left-24 md:-left-32 rotate-[25deg]" : "-right-24 md:-right-32 rotate-[-25deg]"}
        ${colorClass} opacity-[0.08] md:opacity-15 animate-float-slow`}
      style={{ animationDelay: delay }}
    >
      <Icon className="w-48 h-48 md:w-[36rem] md:h-[36rem]" strokeWidth={0.5} />
    </div>
  );
};

const CharacterSprite = ({ side, imageUrl, tiltClass, delay = "0s" }) => {
  const isLeft = side === "left";
  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-1000 z-10
        ${isLeft ? "-left-4 md:-left-16" : "-right-4 md:-right-16"}
        ${tiltClass} opacity-20 md:opacity-60 animate-float-slow`}
      style={{ animationDelay: delay }}
    >
      <img
        src={imageUrl}
        alt=""
        className="w-20 h-auto md:w-64 object-contain transition-transform hover:scale-110"
        onError={(e) => { e.target.style.display = "none"; }}
      />
    </div>
  );
};

const NavButton = ({ direction, targetIndex, label, scrollTo }) => (
  <button
    onClick={() => scrollTo(targetIndex)}
    className={`absolute ${direction === "down" ? "bottom-2 md:bottom-8" : "top-2 md:top-8"} left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 text-slate-800 hover:text-pink-500 transition-all duration-300 group z-40 px-4 py-2`}
  >
    {direction === "up" && <ChevronUp size={16} className="md:w-5 md:h-5 group-hover:-translate-y-0.5 transition-transform" />}
    <span className="text-[6px] md:text-[10px] uppercase tracking-[0.4em] font-semibold">{label}</span>
    {direction === "down" && <ChevronDown size={16} className="md:w-5 md:h-5 group-hover:translate-y-0.5 transition-transform animate-bounce-gentle" />}
  </button>
);

const App = () => {
  const [lifeTime, setLifeTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [cakeStage, setCakeStage] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [songIdx, setSongIdx] = useState(0);
  const [wishIdx, setWishIdx] = useState(0);
  const [bookIdx, setBookIdx] = useState(0);

  const sectionRefs = useRef([]);
  
  const sfx = useMemo(() => {
    if (typeof window === "undefined") return {};
    const audioObj = {
      nav: new Audio(SITE_CONFIG.sounds.nav),
      carousel: new Audio(SITE_CONFIG.sounds.carousel),
      confetti: new Audio(SITE_CONFIG.sounds.confetti),
    };
    return audioObj;
  }, []);

  const particles = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 90}%`,
      top: `${Math.random() * 95}%`,
      type: i % 3,
      duration: 15 + Math.random() * 10,
      delay: Math.random() * 10,
    }));
  }, []);

  const songs = useMemo(() => [
    { title: "Dhurandhar", artist: "From the movie we all loved, never stopped listening to, yet never watched.", color: "text-pink-500", cover: "bg-pink-100", imageUrl: "assets/1.jpg", spotifyUrl: "https://open.spotify.com/album/2e7HNQJ0BcMoqwsVDwDhK8?si=eSKq9XpSSrWD0XlVsDn6kA" },
    { title: "Sweet Venom", artist: "The one ENHYPEN song I still have in my playlist.", color: "text-blue-500", cover: "bg-blue-100", imageUrl: "assets/2.jpg", spotifyUrl: "https://open.spotify.com/track/2YmfV4lAjrAQvuggKCUX6m?si=28c43501f71a483d" },
    { title: "Fantasy Reading Playlist", artist: "For all those pre-sleep sessions where you temporarily logout from this world, and login to a newer, fancier one.", color: "text-purple-500", cover: "bg-purple-100", imageUrl: "assets/3.jpg", spotifyUrl: "https://open.spotify.com/playlist/11ec2U2x8XwJQF9aDNzENg?si=32d615cc984344a2" },
    { title: "Dream Sweet in Sea Major", artist: "A window into the boomer music I occasionally enjoy.", color: "text-indigo-500", cover: "bg-indigo-100", imageUrl: "assets/4.jpg", spotifyUrl: "https://open.spotify.com/track/3RznzRnsl8mzP63l4AF2M7?si=60076329a77b46da" },
    { title: "KATSEYE", artist: "Self-explanatory much?", color: "text-rose-500", cover: "bg-rose-100", imageUrl: "assets/5.jpg", spotifyUrl: "https://open.spotify.com/playlist/4inCE68BLhsabxlw2FEyDK?si=9824c2fdd902404f" },
  ], []);

  const wishes = useMemo(() => [
    { text: "Heyy sanjj!\nMany many happy returns of the day gorgeous!!! I’m so proud of everything you’ve achieved and everything you continue to become. I couldn’t be happier or more grateful to be part of every chapter of this book you’re writing, and I’m excited to stand by and witness everything that comes next!!\n\nI love you to the stars and back - plus a little more ♥️. Thank you for always being there for me and for being my constant in literally EVERYTHING. Words really can’t describe what our friendship means to me and I can’t wait to see you soonn!!\n\nHappy 23rd to the one who makes me smile the most and to the one I’m missing soo much today 😭\nHope all your wishes come true sanjj, you deserve them all and so much more!\nHave a great year ahead babe 💗", author: "- Sakshi" },
    { text: "Happy Birthday sanjanaa 💖 Thank you for always being there for me, for your kindness, and for making everything feel a little brighter just by being you. I’m so grateful to have a friend like you. We'll definitely catch up soon and celebrate properly! Until then, sending you lots of love, hugs, and the biggest birthday wishes 🥳✨\nxx varuni 🥰", author: "- Varuni" },
    { text: "Happy birthday Sanjanaa!! Stay cuchuswee😉 and have a wonderful day <3 I hope this trip around the sun is your best yet! I can't wait to make more memories together 💗", author: "- Pahal" },
    { text: "Happy birthday Sanjjj!!!🥳\nI appreciate chu more than you could know\nHope you have a great year ahead of you✨\nHopefully we get to meet again really soon\n\n- Mr. Owl🦉", author: "- Zanil" },
    { text: "What day is it? 😁💃💃\nIt’s the day my favorite roommie turns 23💃💓💓\nHappy birthday Sanjanaa 🌸\nMoving to Amersfoort has been so much nicer because of you. I’m really grateful to know you. It’s always inspiring to see how much you do and how many interests and talents you carry so naturally.\nI hope this year brings you new joys, meaningful moments, and little discoveries that make you happy. I’m excited to see where life takes you, and I know it’ll be something wonderful.\nThank you for being you, and for always being there.\nHappy birthday once again ✨🫶🏼", author: "- Selena" },
    { text: "Happiest birthday, Sanjanaa! 🎉💖\nYou are genuinely one of the sweetest people I’ve ever met, and getting to know you has been such a wonderful experience. You’re sooo fun to be around, and always have a way of cheering people up.🥰✨\nI absolutely love the random questions you ask out of nowhere; they make conversations so much fun and interesting. I feel like I relate to your personality in so many ways, and that makes our bond even more special to me.💫🤍\nThank you for always being you, for the laughs, the warmth, and the good vibes you bring.💕\nI hope this year brings you happiness, success, and everything your heart wishes for. You truly deserve it.✨", author: "Sakshi S." },
    { text: "Happy Birthday, Sanjana! Wishing you all the very best in your future endeavors. May you keep dancing your way across different parts of the world. I’ll always cherish our daily bus convos during school days - it feels like it happened just yesterday, yet it’s already been 10 years.\n\nLet’s stay in touch and keep sharing life updates for the next 10 years too. You and Sakshi will always be the two juniors who made school life more fun and memorable. I truly miss those carefree days filled with silly conversations, so different from the serious ones we have now( not completely true tho).\n\nOnce again, wishing you the best of everything, and may you achieve success in all that you do.", author: "Asita" },
    { videoUrl: "https://drive.google.com/file/d/1NcxDw7Ul3kIEETzMIXUaLGJ3IALFYZsI/preview", author: "- Saai" },
    { text: "And now, for the final wish of the day..." },
    { videoUrl: "https://drive.google.com/file/d/1AktBmYP_GydPGNpEYLdl0Fk6QmT0T1CG/preview", imageUrl: "assets/18.jpg", author: "- Amma and Naina" },
  ], []);

  const books = useMemo(() => [
    { title: "Emily Wilde's Encyclopaedia of Faeries", author: "Heather Fawcett", desc: "A dryly witty scholar ventures into a snowy village to study the hidden folk and navigate a charming academic rivalry.", color: "text-pink-500", cover: "bg-pink-100", imageUrl: "assets/6.jpg", goodreadsUrl: "https://www.goodreads.com/book/show/60657589-emily-wilde-s-encyclopaedia-of-faeries" },
    { title: "Tress of the Emerald Sea", author: "Brandon Sanderson", desc: "A whimsical, fairy-tale adventure on a sea of deadly spores, following a girl determined to rescue her true love.", color: "text-blue-500", cover: "bg-blue-100", imageUrl: "assets/7.png", spotifyUrl: "https://www.goodreads.com/book/show/60531406-tress-of-the-emerald-sea" },
    { title: "Belladonna", author: "Adalyn Grace", desc: "A gothic mystery where a girl who can't die must team up with Death himself to solve a high-stakes poisoning.", color: "text-purple-500", cover: "bg-purple-100", imageUrl: "assets/8.jpg", goodreadsUrl: "https://www.goodreads.com/book/show/58505881-belladonna" },
    { title: "A Wizard's Guide to Defensive Baking", author: "T. Kingfisher", desc: "A 14-year-old with minor magic (useful only for bread) finds herself the unlikely protector of her besieged city.", color: "text-indigo-500", cover: "bg-indigo-100", imageUrl: "assets/9.jpg", goodreadsUrl: "https://www.goodreads.com/book/show/54339351-a-wizard-s-guide-to-defensive-baking" },
    { title: "The Lies of Locke Lamora", author: "Scott Lynch", desc: "Master con artists navigate a Venice-inspired city of canals, high-stakes heists, and ancient deadly secrets.", color: "text-rose-500", cover: "bg-rose-100", imageUrl: "assets/10.jpg", goodreadsUrl: "https://www.goodreads.com/book/show/127455.The_Lies_of_Locke_Lamora" },
    { title: "Six of Crows", author: "Leigh Bardugo", desc: "A criminal prodigy leads a crew of social outcasts on an impossible heist into a high-security military stronghold.", color: "text-pink-500", cover: "bg-pink-100", imageUrl: "assets/11.jpg", goodreadsUrl: "https://www.goodreads.com/book/show/23437156-six-of-crows" },
    { title: "The Secret History", author: "Donna Tartt", desc: "An atmospheric 'reverse whodunnit' where a group of elite classics students slip into a world of obsession and murder.", color: "text-blue-500", cover: "bg-blue-100", imageUrl: "assets/12.jpg", goodreadsUrl: "https://www.goodreads.com/book/show/29044.The_Secret_History" },
    { title: "The Devil in the White City", author: "Erik Larson", desc: "The true, chilling story of the 1893 World's Fair in Chicago and the serial killer who used it to lure his victims.", color: "text-purple-500", cover: "bg-purple-100", imageUrl: "assets/13.jpg", goodreadsUrl: "https://www.goodreads.com/book/show/397483.The_Devil_in_the_White_City" },
    { title: "Shōgun", author: "James Clavell", desc: "An epic tale of power, honor, and intrigue in 17th-century Japan as seen through the eyes of an English pilot.", color: "text-indigo-500", cover: "bg-indigo-100", imageUrl: "assets/14.jpg", goodreadsUrl: "https://www.goodreads.com/book/show/52382.Sh_gun" },
    { title: "Tomorrow, and Tomorrow, and Tomorrow", author: "Gabrielle Zevin", desc: "A spanning, emotional journey of two lifelong friends who become superstars in the world of video game design.", color: "text-rose-500", cover: "bg-rose-100", imageUrl: "assets/15.jpg", goodreadsUrl: "https://www.goodreads.com/book/show/58784475-tomorrow-and-tomorrow-and-tomorrow" },
  ], []);

  useEffect(() => {
    const musicTimer = setInterval(() => setSongIdx((p) => (p === songs.length - 1 ? 0 : p + 1)), 5000);
    const bookTimer = setInterval(() => setBookIdx((p) => (p === books.length - 1 ? 0 : p + 1)), 5000);
    return () => { clearInterval(musicTimer); clearInterval(bookTimer); };
  }, [songs.length, books.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date().getTime() - new Date(SITE_CONFIG.birthDate).getTime();
      setLifeTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const index = sectionRefs.current.findIndex((r) => r === e.target);
            if (index !== -1) setActiveSection(index);
          }
        }),
      { threshold: 0.5 }
    );
    sectionRefs.current.forEach((r) => r && observer.observe(r));
    return () => observer.disconnect();
  }, []);

  const playSfx = useCallback((key) => {
    const audio = sfx[key];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }, [sfx]);

  const scrollTo = useCallback((idx) => {
    const target = sectionRefs.current[idx];
    if (target) {
      playSfx("nav");
      target.scrollIntoView({ behavior: "smooth" });
    }
  }, [playSfx]);

  const handleLinearPrev = (c, s) => { if (c > 0) { playSfx("carousel"); s(c - 1); } };
  const handleLinearNext = (c, s, m) => { if (c < m - 1) { playSfx("carousel"); s(c + 1); } };
  const handleNext = (c, s, m) => { playSfx("carousel"); s(c === m - 1 ? 0 : c + 1); };
  const handlePrev = (c, s, m) => { playSfx("carousel"); s(c === 0 ? m - 1 : c - 1); };

  const handleCakeClick = () => {
    if (cakeStage < 3) {
      if (cakeStage === 2) playSfx("confetti");
      setCakeStage((p) => p + 1);
    }
  };

  const resetCake = (e) => {
    e.stopPropagation();
    playSfx("nav");
    setCakeStage(0);
  };

  const getCakeMessage = useCallback(() => {
    switch (cakeStage) {
      case 0: return "Make a wish and blow out the candles. \n (tap the cake emoji)";
      case 1: return "Wait, the flames are stubborn! Try again! 🌬️";
      case 2: return "Nearly there... give it all you've got! 😤";
      case 3: return "A wish made in sweetness. Happy Birthday. ✨";
      default: return "";
    }
  }, [cakeStage]);

  return (
    <div className={`h-svh overflow-y-scroll snap-y snap-mandatory scroll-smooth ${SITE_CONFIG.themeBg} font-serif text-slate-700 selection:bg-pink-100 selection:text-pink-600 overflow-x-hidden`}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-50 md:opacity-70">
        {particles.map((p) => {
          const P_Icon = p.type === 0 ? Heart : p.type === 1 ? Star : Sparkles;
          return (
            <div key={p.id} className={`absolute animate-float ${p.id % 3 === 0 ? "text-pink-400" : p.id % 3 === 1 ? "text-blue-400" : "text-purple-400"}`} style={{ top: p.top, left: p.left, animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s` }}>
              <P_Icon size={p.type === 1 ? 36 : 24} fill={p.type !== 2 ? "currentColor" : "none"} />
            </div>
          );
        })}
      </div>

      {/* 0: HERO */}
      <header ref={el => sectionRefs.current[0] = el} className="relative h-svh flex flex-col items-center justify-center text-center px-4 md:px-6 gap-2 md:gap-10 snap-start snap-always animate-reveal overflow-hidden">
        <SectionSprite Icon={Heart} colorClass="text-pink-400" side="left" />
        <CharacterSprite side="right" imageUrl={CHARACTER_LIST[0].url} tiltClass={CHARACTER_LIST[0].tilt} />
        <div className={`flex gap-2 transition-all duration-1000 ${activeSection === 0 ? "opacity-100" : "opacity-0 translate-y-4"}`}>
          <div className="w-2 h-2 rounded-full bg-pink-400 animate-ping"></div>
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping" style={{ animationDelay: "0.4s" }}></div>
        </div>
        <div className={`space-y-1 md:space-y-3 transition-all duration-1000 delay-200 ${activeSection === 0 ? "opacity-100" : "opacity-0 translate-y-4"}`}>
          <h1 className="text-3xl sm:text-6xl md:text-8xl font-bold italic tracking-tight text-slate-800 break-words max-w-xs sm:max-w-none mx-auto">Happy Birthday, <span className="text-pink-500 font-bold block md:inline">{SITE_CONFIG.friendName}</span></h1>
          <p className="text-sm md:text-2xl text-slate-800 font-medium italic px-4">Celebrating your sweet presence in our lives.</p>
        </div>
        <div className={`flex flex-col items-center gap-2 md:gap-4 transition-all duration-1000 delay-400 ${activeSection === 0 ? "opacity-100" : "opacity-0 translate-y-4"}`}>
          <span className="text-[8px] md:text-[12px] uppercase tracking-[0.4em] font-semibold bg-white/70 px-3 py-1 rounded-full border border-white/60">Days of Brilliance</span>
          <div className="flex flex-wrap justify-center gap-1.5 md:gap-6 max-w-[240px] md:max-w-none">
            {Object.entries(lifeTime).map(([label, value]) => (
              <div key={label} className={`${SITE_CONFIG.cardBg} min-w-[50px] md:min-w-[125px] p-1.5 md:p-6 rounded-lg md:rounded-2xl shadow-lg`}>
                <span className={`block text-lg md:text-6xl font-bold ${label === "days" ? "text-pink-400" : "text-slate-900"}`}>{value.toLocaleString(undefined, { minimumIntegerDigits: label === "days" ? 1 : 2 })}</span>
                <span className="text-[7px] md:text-[11px] uppercase tracking-[0.3em] text-slate-700 font-bold">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <NavButton direction="down" targetIndex={1} label="A Little Note" scrollTo={scrollTo} />
      </header>

      {/* 1: NOTE */}
      <section ref={el => sectionRefs.current[1] = el} className="relative h-svh flex flex-col items-center justify-center text-center px-4 md:px-8 snap-start snap-always overflow-hidden">
        <SectionSprite Icon={Sparkles} colorClass="text-purple-400" side="right" />
        <CharacterSprite side="left" imageUrl={CHARACTER_LIST[1].url} tiltClass={CHARACTER_LIST[1].tilt} />
        <NavButton direction="up" targetIndex={0} label="Home" scrollTo={scrollTo} />
        <div className={`max-w-2xl w-full flex flex-col gap-2 md:gap-6 transition-all duration-1000 ${activeSection === 1 ? "opacity-100" : "opacity-0 translate-y-4"}`}>
          <PenTool className="text-pink-400 w-8 h-8 md:w-12 md:h-12 mx-auto" />
          <div className={`${SITE_CONFIG.cardBg} px-4 md:px-14 py-5 md:py-10 rounded-[1.5rem] md:rounded-[3rem] shadow-xl text-left min-h-[320px] md:min-h-[400px] flex flex-col justify-center`}>
            <p className="text-[13px] md:text-xl text-slate-700 leading-relaxed italic">
              <span className="block mb-2 md:mb-4 text-pink-500 font-bold text-lg md:text-2xl">Dear Sanjanaa,</span>
              I'll be honest with you: I gave this a lot of thought. From niche LEGO<sup className="text-[0.6em] ml-0.5">®</sup> sets to Capricorn-themed earrings, every idea met the daunting challenges of logistics, hidden addresses, and the simple reality of <span className="font-bold text-slate-900">6,300 kilometers.</span> So, what better replacement for something tangible than something intangible?
              <br /><br />
              Hence, this small website came to fruition. I - <span className="font-bold text-slate-900 italic">rather, we</span> - came together to compile a few of your favorites across different mediums for you to explore here, and we genuinely hope that you will love all of this.
              <br /><br />
              To begin this experience, please <span className="font-bold text-slate-900">tap the arrow-text</span> below or <span className="font-bold text-slate-900">swipe down.</span>
            </p>
          </div>
        </div>
        <NavButton direction="down" targetIndex={2} label="Birthday Beats" scrollTo={scrollTo} />
      </section>

      {/* 2: BEATS */}
      <section ref={el => sectionRefs.current[2] = el} className="relative h-svh flex flex-col items-center justify-center text-center px-4 md:px-8 snap-start snap-always overflow-hidden">
        <SectionSprite Icon={Music} colorClass="text-blue-400" side="left" />
        <NavButton direction="up" targetIndex={1} label="Back" scrollTo={scrollTo} />
        <div className={`max-w-2xl w-full flex flex-col gap-2 md:gap-4 transition-all duration-1000 ${activeSection === 2 ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
          <div className="flex items-center justify-center gap-2">
            <Music className="text-blue-400 w-5 h-5 md:w-8 md:h-8" />
            <span className="text-[9px] md:text-xs uppercase tracking-[0.4em] font-bold text-blue-500 bg-blue-50/50 px-3 md:px-4 py-1.5 rounded-full border border-blue-100 shadow-sm">Birthday Beats</span>
          </div>
          <div className={`${SITE_CONFIG.cardBg} px-4 md:px-6 py-2 md:py-4 rounded-xl md:rounded-2xl shadow-sm max-w-lg mx-auto`}>
            <p className="text-[11px] md:text-base text-slate-800 italic leading-relaxed text-center">
              While you may not know it, your taste in music is incredibly diverse and wide ranging. This curated selection might not match the sheer scale of your grandiose, but I hope these tracks light up your week!
            </p>
          </div>
          <div className="relative group px-1">
            <button onClick={() => handlePrev(songIdx, setSongIdx, songs.length)} className="absolute -left-6 md:-left-16 top-1/2 -translate-y-1/2 p-2 text-slate-900 hover:text-blue-400 z-20 touch-manipulation"><ChevronLeft size={28} className="md:w-[50px] md:h-[50px]" /></button>
            <div className={`${SITE_CONFIG.cardBg} rounded-[1rem] md:rounded-[2.5rem] shadow-xl min-h-[180px] md:min-h-[320px] flex flex-col overflow-hidden m-1 md:m-6`}>
              <div className="flex flex-1 transition-transform duration-700 ease-in-out h-full items-center" style={{ transform: `translateX(-${songIdx * 100}%)` }}>
                {songs.map((s, i) => (
                  <div key={i} className="min-w-full p-3 md:p-12 flex flex-col sm:flex-row items-center gap-2 md:gap-10">
                    <div className={`w-20 h-20 md:w-44 md:h-44 ${s.cover} rounded-lg md:rounded-[1.5rem] shadow flex-shrink-0 flex items-center justify-center text-blue-400/60 shadow-inner`}><img src={s.imageUrl} className="rounded-lg md:rounded-[1.5rem] shadow object-cover h-full w-full" alt={s.title} /></div>
                    <div className="flex-1 text-center sm:text-left overflow-hidden">
                      <p className={`text-xs md:text-xl font-bold uppercase ${s.color} leading-tight whitespace-normal`}>{s.title}</p>
                      <p className="text-[9px] md:text-sm text-slate-800 italic font-normal mt-1 md:mt-2 leading-tight md:leading-relaxed whitespace-normal line-clamp-2 md:line-clamp-none">{s.artist}</p>
                      <div className="mt-2 md:mt-3">
                        <a href={s.spotifyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[#1DB954] hover:text-[#1ed760] transition-colors">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.49 17.31c-.21.34-.65.45-.99.24-2.81-1.72-6.35-2.11-10.51-1.16-.38.09-.76-.14-.85-.53-.09-.38.14-.76.53-.85 4.54-1.04 8.46-.59 11.58 1.32.34.21.45.65.24.98zm1.46-3.26c-.26.43-.82.57-1.25.3-3.22-1.98-8.12-2.55-11.93-1.4-.48.15-1-.13-1.15-.61-.15-.48.13-1 .61-1.15 4.36-1.32 9.77-.67 13.43 1.58.42.26.56.81.3 1.25zm.13-3.41c-3.86-2.29-10.24-2.51-13.93-1.39-.59.18-1.23-.15-1.41-.74-.18-.59.15-1.23.74-1.41 4.25-1.29 11.29-1.04 15.71 1.58.53.31.7.99.39 1.52-.31.53-.99.7-1.5 0z"/></svg>
                          <span className="text-[8px] uppercase tracking-widest font-bold">Listen</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => handleNext(songIdx, setSongIdx, songs.length)} className="absolute -right-6 md:-right-16 top-1/2 -translate-y-1/2 p-2 text-slate-900 hover:text-blue-400 z-20 touch-manipulation"><ChevronRight size={28} className="md:w-[50px] md:h-[50px]" /></button>
          </div>
        </div>
        <NavButton direction="down" targetIndex={3} label="Curated Shelf" scrollTo={scrollTo} />
      </section>

      {/* 3: SHELF */}
      <section ref={el => sectionRefs.current[3] = el} className="relative h-[100dvh] flex flex-col items-center justify-center text-center px-4 md:px-8 snap-start snap-always overflow-hidden">
        <SectionSprite Icon={BookOpen} colorClass="text-purple-400" side="right" />
        <NavButton direction="up" targetIndex={2} label="Back" scrollTo={scrollTo} />
        <div className={`max-w-4xl w-full flex flex-col gap-2 md:gap-4 transition-all duration-1000 ${activeSection === 3 ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="text-purple-400 w-5 h-5 md:w-8 md:h-8" />
            <span className="text-[9px] md:text-xs uppercase tracking-[0.4em] font-bold text-purple-500 bg-purple-50/50 px-3 md:px-4 py-1.5 rounded-full border border-purple-100 shadow-sm">Curated Shelf</span>
          </div>
          <div className={`${SITE_CONFIG.cardBg} px-4 md:px-6 py-2 md:py-4 rounded-xl md:rounded-2xl shadow-sm max-w-xl mx-auto text-left`}>
            <p className="text-[10px] md:text-base text-slate-800 italic leading-relaxed text-center">
              Your love for books (and fantasy) knows no bounds. So taking into account every nuance of your "exquisite" palette, please peruse this collection that I hope will accompany you throughout 2026.
            </p>
          </div>
          <div className="relative group px-1">
            <button onClick={() => handlePrev(bookIdx, setBookIdx, books.length)} className="absolute -left-6 md:-left-16 top-1/2 -translate-y-1/2 p-2 text-slate-900 hover:text-purple-400 z-10"><ChevronLeft size={28} className="md:w-[50px] md:h-[50px]" /></button>
            <div className={`${SITE_CONFIG.cardBg} rounded-[1.2rem] md:rounded-[2.5rem] shadow-xl min-h-[260px] md:min-h-[380px] flex flex-col overflow-hidden m-2 md:m-6`}>
              <div className="flex flex-1 transition-transform duration-700 ease-in-out h-full items-center" style={{ transform: `translateX(-${bookIdx * 100}%)` }}>
                {books.map((b, i) => (
                  <div key={i} className="min-w-full p-4 md:p-8 flex flex-col md:flex-row items-center gap-3 md:gap-10 text-left h-full">
                    <div className="w-20 h-32 md:w-48 md:h-64 flex-shrink-0 flex items-center justify-center rounded-lg md:rounded-xl overflow-hidden shadow-lg bg-black/5">
                      <img src={b.imageUrl} className="h-full w-full object-contain" alt={b.title} />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h4 className={`font-bold text-sm md:text-2xl uppercase ${b.color} leading-tight whitespace-normal`}>{b.title}</h4>
                      <p className={`text-[10px] md:text-sm font-bold mt-0.5 md:mb-2 ${b.color} brightness-75`}>{b.author}</p>
                      <p className="text-[10px] md:text-base text-slate-800 italic font-normal leading-tight md:leading-relaxed whitespace-normal line-clamp-3 md:line-clamp-none">{b.desc}</p>
                      <div className="mt-3 md:mt-4">
                        <a href={b.goodreadsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[#372213] hover:text-pink-600 transition-colors">
                          <ExternalLink size={14} className="md:w-4 md:h-4" />
                          <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold">Read More</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => handleNext(bookIdx, setBookIdx, books.length)} className="absolute -right-6 md:-right-16 top-1/2 -translate-y-1/2 p-2 text-slate-900 hover:text-purple-400 z-10"><ChevronRight size={32} className="md:w-[50px] md:h-[50px]" /></button>
          </div>
        </div>
        <NavButton direction="down" targetIndex={4} label="A Circle of Love" scrollTo={scrollTo} />
      </section>

      {/* 4: VOICES */}
      <section ref={el => sectionRefs.current[4] = el} className="relative h-[100dvh] flex flex-col items-center justify-center text-center px-4 md:px-8 snap-start snap-always overflow-hidden">
        <SectionSprite Icon={Users} colorClass="text-pink-400" delay="2s" side="left" />
        <NavButton direction="up" targetIndex={3} label="Back" scrollTo={scrollTo} />
        <div className={`max-w-lg w-full flex flex-col gap-3 md:gap-4 transition-all duration-1000 ${activeSection === 4 ? "opacity-100" : "opacity-0"}`}>
          <MessageSquare className="text-pink-400 mx-auto w-8 h-8 md:w-12 md:h-12" />
          <div className={`${SITE_CONFIG.cardBg} px-4 md:px-12 py-5 md:py-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl text-center min-h-[180px] md:min-h-[220px] flex flex-col justify-center`}>
            <p className="text-sm md:text-xl text-slate-700 leading-relaxed italic px-2 md:px-4">
              Over the years and across so many parts of the world, you have gathered so many friends from all walks of life - each of us so lucky to know you. 
              <br /><br />
              Today, as we all join hands to celebrate 23 incredibly <span className="text-pink-500 font-bold">sanj-astic</span> years, we would all like to collectively thank you for the pocket-sized yet dynamic impact you've had on every one of us. 
              <br /><br />
              Please scroll down to read, see, and hear what some of your favorite people have to share.
            </p>
          </div>
        </div>
        <NavButton direction="down" targetIndex={5} label="The Wishes" scrollTo={scrollTo} />
      </section>

      {/* 5: WISHES */}
      <section ref={el => sectionRefs.current[5] = el} className="relative h-[100dvh] flex flex-col items-center justify-center text-center px-4 md:px-8 snap-start snap-always overflow-hidden">
        <SectionSprite Icon={Flower} colorClass="text-purple-400" delay="2.5s" side="right" />
        <CharacterSprite side="left" imageUrl={CHARACTER_LIST[5].url} tiltClass={CHARACTER_LIST[5].tilt} />
        <NavButton direction="up" targetIndex={4} label="Back" scrollTo={scrollTo} />
        <div className={`max-w-xl w-full flex flex-col gap-2 md:gap-4 transition-all duration-1000 ${activeSection === 5 ? "opacity-100" : "opacity-0"}`}>
          <div className="flex items-center justify-center gap-3">
            <Quote className="text-pink-400 w-6 h-6 md:w-8 md:h-8" />
            <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold text-pink-500 bg-pink-50/50 px-4 py-1.5 rounded-full border border-pink-100 shadow-sm">Love & Wishes</span>
          </div>

          <div className="relative group px-1">
            {wishIdx > 0 && <button onClick={() => handleLinearPrev(wishIdx, setWishIdx)} className="absolute -left-6 md:-left-16 top-1/2 -translate-y-1/2 p-1 text-slate-900 hover:text-pink-500 z-20 touch-manipulation"><ChevronLeft size={24} /></button>}
            <div className={`${SITE_CONFIG.cardBg} rounded-[1.5rem] md:rounded-[3rem] shadow-xl min-h-[280px] md:min-h-[420px] flex flex-col overflow-hidden`}>
              <div className="flex flex-1 transition-transform duration-700 h-full items-center" style={{ transform: `translateX(-${wishIdx * 100}%)` }}>
                {wishes.map((w, i) => (
                  <div key={i} className="min-w-full px-4 md:px-12 flex flex-col items-center justify-center text-center h-full">
                    {w.videoUrl ? (
                      <div className="w-full flex flex-col items-center justify-center gap-1 py-1 h-full">
                        <div className="w-full aspect-video md:max-w-[450px] overflow-hidden rounded-lg md:rounded-xl shadow-sm bg-black/5">
                          <iframe 
                            src={w.videoUrl} 
                            allow="autoplay" 
                            allowFullScreen 
                            className="w-full h-full" 
                          />
                        </div>
                        {w.imageUrl && (
                          <div className="w-full h-24 md:h-48 mt-1 flex items-center justify-center overflow-hidden rounded-lg md:rounded-xl">
                            <img src={w.imageUrl} className="h-full w-full object-contain" alt="Family" />
                          </div>
                        )}
                        <p className="text-[9px] md:text-md font-bold text-pink-600 uppercase tracking-[0.4em] mt-1">{w.author}</p>
                      </div>
                    ) : (
                      <div className="py-2 px-1 text-center">
                        <p className={`italic ${i === 8 ? "text-base md:text-2xl font-bold text-pink-500" : "text-[10px] sm:text-[13px] md:text-lg text-slate-900"} leading-snug md:leading-relaxed whitespace-pre-wrap`}>
                          "{w.text}"
                        </p>
                        <p className="mt-1 md:mt-4 text-[8px] md:text-xs font-bold text-pink-600 uppercase tracking-[0.4em]">{w.author}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {wishIdx < wishes.length - 1 && <button onClick={() => handleLinearNext(wishIdx, setWishIdx, wishes.length)} className="absolute -right-6 md:-right-16 top-1/2 -translate-y-1/2 p-1 text-slate-900 hover:text-pink-500 z-20 touch-manipulation"><ChevronRight size={24} /></button>}
          </div>
        </div>
        <NavButton direction="down" targetIndex={6} label="My Heart" scrollTo={scrollTo} />
      </section>

      {/* 6: HEART */}
      <section ref={el => sectionRefs.current[6] = el} className="relative h-svh flex flex-col items-center justify-center text-center px-4 md:px-8 snap-start snap-always overflow-hidden">
        <SectionSprite Icon={Star} colorClass="text-pink-400" delay="3s" side="left" />
        <CharacterSprite side="right" imageUrl={CHARACTER_LIST[6].url} tiltClass={CHARACTER_LIST[6].tilt} />
        <NavButton direction="up" targetIndex={5} label="Back" scrollTo={scrollTo} />
        <div className={`max-w-md w-full flex flex-col gap-2 md:gap-4 transition-all duration-1000 ${activeSection === 6 ? "opacity-100" : "opacity-0"}`}>
          <PenTool className="text-purple-400 w-8 h-8 md:w-12 md:h-12 mx-auto" />
          <div className={`${SITE_CONFIG.cardBg} px-6 md:px-10 py-6 md:py-10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl text-left min-h-[300px] flex flex-col justify-center`}>
            <p className="text-[12px] md:text-[15px] text-slate-700 leading-relaxed font-normal italic">
              Sanjanaa, I hardly ever find it difficult to put a word or two together, yet at this crucial juncture, all my divine powers of yap seem to have flown out the window.
              <br /><br />
              Anyway - last but certainly not least (and as much as I know you hate the word) - I am so incredibly thankful for your presence in my life. Never once in these jagged few years did I imagine I'd run into such <span className="font-bold text-slate-900">a perfect concoction of joy, infectious energy, laughter, and warmth.</span>
              <br /><br />
              I am so proud of the growth I've seen in you over the past few years, and I'm even more excited to see where life takes you next. I know it will be something spectacular, because an amazing person like you deserves nothing less. I'm forever grateful to the universe to call you my NYT partner-in-crime, my go-to for guidance, my personal "sit-down" comedian, and most importantly, <span className="font-bold text-slate-900">my dearest friend.</span>
              <br /><br />A very <span className="font-bold text-slate-900">happy birthday</span> to you, Sanju. Thank you for everything you do for us, and I hope to see you soon.
            </p>
          </div>
        </div>
        <NavButton direction="down" targetIndex={7} label="Final Gift" scrollTo={scrollTo} />
      </section>

      {/* 7: CAKE GAME */}
      <section ref={el => sectionRefs.current[7] = el} className="relative h-svh flex flex-col items-center justify-center text-center px-4 md:px-8 snap-start snap-always overflow-hidden">
        <SectionSprite Icon={Sparkles} colorClass="text-purple-400" delay="3.5s" side="right" />
        <CharacterSprite side="left" imageUrl={CHARACTER_LIST[7].url} tiltClass={CHARACTER_LIST[7].tilt} />
        <NavButton direction="up" targetIndex={6} label="Back" scrollTo={scrollTo} />
        <div className={`flex flex-col items-center gap-4 md:gap-8 transition-all duration-1000 ${activeSection === 7 ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}>
          <div className="relative h-32 md:h-64 flex items-center justify-center">
            <div
              className={`text-6xl sm:text-9xl md:text-[200px] cursor-pointer transition-all ${cakeStage === 3 ? "opacity-50 grayscale scale-95" : "hover:scale-110"}`}
              onClick={handleCakeClick}
            >
              🎂
              {cakeStage === 3 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {[...Array(60)].map((_, i) => (
                    <div key={i} className="absolute w-2 h-2 rounded-sm animate-confetti-pop" style={{ backgroundColor: ["#f472b6", "#3b82f6", "#a855f7", "#fbbf24", "#10b981"][i % 5], "--tx": `${Math.cos((i / 60) * Math.PI * 2) * (150 + Math.random() * 250)}px`, "--ty": `${Math.sin((i / 60) * Math.PI * 2) * (150 + Math.random() * 250)}px`, "--rot": `${Math.random() * 720}deg`, animationDelay: `${Math.random() * 0.2}s` }} />
                  ))}
                  <div className="text-pink-500 animate-ping opacity-80">
                    <Sparkles size={80} />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={`${SITE_CONFIG.cardBg} px-6 md:px-14 py-4 md:py-8 rounded-full shadow-2xl transition-all ${cakeStage === 3 ? "scale-110 border-pink-400" : "animate-bounce-gentle"}`}>
            <p className="text-pink-500 font-bold italic text-sm md:text-xl">{getCakeMessage()}</p>
            {cakeStage === 3 && <button onClick={resetCake} className="ml-4 p-1 text-pink-400 hover:text-pink-600 hover:rotate-[-90deg] transition-all duration-300 inline-flex align-middle"><RotateCcw size={20} /></button>}
          </div>
        </div>
        <footer className="absolute bottom-4 py-2 opacity-60 text-[10px] md:text-md uppercase tracking-[0.4em] font-bold text-slate-800">
          made with ❤️ by indru · 13/01/2026
        </footer>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-gentle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        .animate-bounce-gentle { animation: bounce-gentle 3s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-5px) rotate(3deg); } }
        .animate-float { animation: float 12s ease-in-out infinite; }
        @keyframes float-slow { 0%, 100% { transform: translateY(-50%) translateX(0); } 50% { transform: translateY(-51%) translateX(5px); } }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        @keyframes confetti-pop { 0% { transform: translate(0,0) scale(0); opacity: 1; } 100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(1.1); opacity: 0; } }
        .animate-confetti-pop { animation: confetti-pop 1.8s forwards; }
        @keyframes reveal { 0% { opacity: 0; transform: translateY(15px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-reveal { animation: reveal 2s forwards; }
        ::-webkit-scrollbar { display: none; }
        .snap-always { scroll-snap-stop: always; }
      `}} />
    </div>
  );
};

export default App;
