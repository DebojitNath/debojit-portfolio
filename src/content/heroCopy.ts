export interface HeroCopySet {
  line1: string;
  line2: string;
  words: string[];
  lastLine: string;
  paragraph: string;
  srText: string;
}

export type HeroCopyKey = 'A' | 'B' | 'C';

export const HERO_COPY_SETS: Record<HeroCopyKey, HeroCopySet> = {
  A: {
    line1: "Hi, I'm Debojit",
    line2: "I build",
    words: [
      "AI agents",
      "neural networks",
      "distributed systems",
      "faster models",
      "voice apps"
    ],
    lastLine: "mostly in Python.",
    paragraph:
      "CS undergrad in Kolkata. Projects so far: a PyTorch model-compression pipeline, a Raft consensus engine in async Python, and a voice-command classifier that retrains from user feedback.",
    srText:
      "Hi, I'm Debojit. I build AI agents, neural networks, distributed systems, faster models and voice apps mostly in Python."
  },
  B: {
    line1: "Hi, I'm Debojit",
    line2: "I'm a",
    words: [
      "CS student",
      "hackathon winner",
      "open-source contributor",
      "Valorant player",
      "competitive gamer"
    ],
    lastLine: "from Kolkata.",
    paragraph:
      "I led a team of three to 1st place at a U.S. Consulate hackathon. I build projects in AI, NLP and distributed systems, mostly in Python.",
    srText:
      "Hi, I'm Debojit. I'm a CS student, hackathon winner, open-source contributor, Valorant player and competitive gamer from Kolkata."
  },
  C: {
    line1: "Hi, I'm Debojit",
    line2: "I build with",
    words: [
      "Python",
      "PyTorch",
      "FastAPI",
      "Java",
      "SQL"
    ],
    lastLine: "from Kolkata.",
    paragraph:
      "Mostly Python, some Java, picking up backend along the way. Projects in AI, NLP and distributed systems.",
    srText:
      "Hi, I'm Debojit. I build with Python, PyTorch, FastAPI, Java and SQL from Kolkata."
  }
};

/**
 * Active copy set selection: Set B is active.
 * Switch between 'A', 'B', or 'C' here to update the hero content.
 */
export const ACTIVE_HERO_COPY_SET: HeroCopyKey = 'B';

export const activeHeroCopy: HeroCopySet = HERO_COPY_SETS[ACTIVE_HERO_COPY_SET];

