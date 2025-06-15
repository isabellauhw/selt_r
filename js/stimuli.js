const AVATARS = [
    { "file": "female1",  "gender": "f", "ethnicity": "white",        "name": "Joan"},
    { "file": "female2",  "gender": "f", "ethnicity": "white/asian",  "name": "Sue"},
    { "file": "female3",  "gender": "f", "ethnicity": "asian",        "name": "Kim"},
    { "file": "female4",  "gender": "f", "ethnicity": "asian",        "name": "Chen"},
    { "file": "female5",  "gender": "f", "ethnicity": "white",        "name": "Susan"},
    { "file": "female6",  "gender": "f", "ethnicity": "black",        "name": "Gemma"},
    { "file": "female7",  "gender": "f", "ethnicity": "white",        "name": "Karen"},
    { "file": "female8",  "gender": "f", "ethnicity": "muslim",       "name": "Sara"},
    { "file": "female9",  "gender": "f", "ethnicity": "black",        "name": "Zara"},
    { "file": "female10", "gender": "f", "ethnicity": "white/asian",  "name": "Lucy"},
    { "file": "female11", "gender": "f", "ethnicity": "black",        "name": "Amy"},
    { "file": "female12", "gender": "f", "ethnicity": "muslim",       "name": "Layla"},
    { "file": "female13", "gender": "f", "ethnicity": "white",        "name": "Kate"},
    { "file": "female14", "gender": "f", "ethnicity": "white/asian",  "name": "Dora"},
    { "file": "male1",    "gender": "m", "ethnicity": "white",        "name": "Tim"},
    { "file": "male2",    "gender": "m", "ethnicity": "white",        "name": "John"},
    { "file": "male3",    "gender": "m", "ethnicity": "white/asian",  "name": "Mark"},
    { "file": "male4",    "gender": "m", "ethnicity": "black",        "name": "Fred"},
    { "file": "male5",    "gender": "m", "ethnicity": "black",        "name": "Colin"},
    { "file": "male6",    "gender": "m", "ethnicity": "white/muslim", "name": "Isaac"},
    { "file": "male7",    "gender": "m", "ethnicity": "white/asian",  "name": "Tony"},
    { "file": "male8",    "gender": "m", "ethnicity": "white",        "name": "George"},
    { "file": "male9",    "gender": "m", "ethnicity": "muslim",       "name": "Mo"},
    { "file": "male10",   "gender": "m", "ethnicity": "white",        "name": "Jason"},
    { "file": "male11",   "gender": "m", "ethnicity": "asian",        "name": "Lau"},
    { "file": "male12",   "gender": "m", "ethnicity": "white",        "name": "Phil"},
    { "file": "male13",   "gender": "m", "ethnicity": "asian",        "name": "Song"},
    { "file": "male14",   "gender": "m", "ethnicity": "white",        "name": "Tom"},
    { "file": "male15",   "gender": "m", "ethnicity": "black",        "name": "Marcus"},
    { "file": "male16",   "gender": "m", "ethnicity": "black",        "name": "Jordan" }
];

   const WORDS_group1 = [
    {"pos": "wise",           "neg": "naive"}, //group 1
    {"pos": "mature",         "neg": "childish"},
    {"pos": "trustworthy",    "neg": "untrustworthy"},
    {"pos": "diligent",       "neg": "thoughtless"},
    {"pos": "caring",         "neg": "indifferent"},
    {"pos": "polite",         "neg": "rude"},
    {"pos": "generous",       "neg": "greedy"},
    {"pos": "precise",        "neg": "clumsy"},
    {"pos": "active",         "neg": "lazy"},
    {"pos": "focused",        "neg": "distracted"},
    {"pos": "friendly",       "neg": "hostile"},
    {"pos": "relaxed",        "neg": "tense"},
    {"pos": "confident",      "neg": "self-doubting"},
    {"pos": "sociable",       "neg": "avoidant"},
    {"pos": "versatile",      "neg": "inflexible"},
    {"pos": "consistent",     "neg": "inconsistent"},
    {"pos": "exceptional",    "neg": "mediocre"},
    {"pos": "organised",      "neg": "disorganised"},
    {"pos": "supportive",     "neg": "critical"},
    {"pos": "fun",            "neg": "boring"} //20th
];

   const WORDS_group2 = [
    {"pos": "trusting",       "neg": "suspicious"}, //group 2
    {"pos": "rational",       "neg": "unrealistic"},
    {"pos": "smart",          "neg": "foolish"},
    {"pos": "responsible",    "neg": "reckless"},
    {"pos": "warm-hearted",   "neg": "uncaring"},
    {"pos": "helpful",        "neg": "selfish"},
    {"pos": "lively",         "neg": "inactive"},
    {"pos": "tidy",           "neg": "messy"},
    {"pos": "patient",        "neg": "impatient"},
    {"pos": "flexible",       "neg": "strict"},
    {"pos": "alert",          "neg": "inattentive"},
    {"pos": "enthusiastic",   "neg": "unenthusiastic"},
    {"pos": "peaceful",       "neg": "argumentative"},
    {"pos": "approachable",   "neg": "unfriendly"},
    {"pos": "pleasant",       "neg": "obnoxious"},
    {"pos": "tactful",        "neg": "tactless"},
    {"pos": "committed",      "neg": "uncomitted"},
    {"pos": "imaginative",    "neg": "uninventive"},
    {"pos": "brave",          "neg": "cowardly"},
    {"pos": "encouraging",    "neg": "negative"} //20th
];

   const WORDS_group3 = [
    {"pos": "sensible",       "neg": "immature"}, //group 3
    {"pos": "honest",         "neg": "dishonest"},
    {"pos": "loyal",          "neg": "disloyal"},
    {"pos": "thoughtful",     "neg": "inconsiderate"},
    {"pos": "sympathetic",    "neg": "mean"},
    {"pos": "accurate",       "neg": "sloppy"},
    {"pos": "motivated",      "neg": "aimless"},
    {"pos": "settled",        "neg": "restless"},
    {"pos": "curious",        "neg": "closed-minded"},
    {"pos": "cooperative",    "neg": "unhelpful"},
    {"pos": "easygoing",      "neg": "irritable"},
    {"pos": "gentle",         "neg": "harsh"},
    {"pos": "outgoing",       "neg": "unsociable"},
    {"pos": "modest",         "neg": "smug"},
    {"pos": "fair",           "neg": "bossy"},
    {"pos": "logical",        "neg": "irrational"},
    {"pos": "witty",          "neg": "dull"},
    {"pos": "talented",       "neg": "ordinary"},
    {"pos": "competent",      "neg": "incompetent"},
    {"pos": "productive",     "neg": "unproductive"} //20th
];

   const WORDS_group4 = [
    {"pos": "clever",       "neg": "silly"}, //loop 1
    {"pos": "reliable",     "neg": "unreliable"},
    {"pos": "sincere",      "neg": "fake"},
    {"pos": "attentive",    "neg": "careless"},
    {"pos": "considerate",  "neg": "self-absorbed"},
    {"pos": "kind",         "neg": "cruel"},
    {"pos": "neat",         "neg": "untidy"},
    {"pos": "open-minded",  "neg": "stubborn"},
    {"pos": "eager",        "neg": "passive"},
    {"pos": "charming",     "neg": "disagreeable"},
    {"pos": "laidback",     "neg": "aggressive"},
    {"pos": "calm",         "neg": "angry"},
    {"pos": "humble",       "neg": "arrogant"},
    {"pos": "well-liked",   "neg": "unpopular"},
    {"pos": "determined",   "neg": "indecisive"},
    {"pos": "practical",    "neg": "impractical"},
    {"pos": "efficient",    "neg": "inefficient"},
    {"pos": "cheerful",     "neg": "gloomy"},
    {"pos": "bold",         "neg": "timid"},
    {"pos": "tolerant",     "neg": "intolerant"}

];

// Demo purposes
const validParticipants = ["AmazingStudent"];
