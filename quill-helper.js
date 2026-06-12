/* ───────────────────────────────────────────────────────────────
   Quill Helper — a tiny no-AI "fake chatbot" for Sunny's guides.
   How it works: it scores the visitor's question against a hand-built
   knowledge base (keywords + synonyms) and replies with the best match
   plus a link to the relevant guide. No API, no AI, fully static.

   To add to a page: <script src="quill-helper.js"></script> before </body>.
   To grow its brain: add entries to the KB array below.
   ─────────────────────────────────────────────────────────────── */
(function () {
  "use strict";
  if (window.__quillHelperLoaded) return;
  window.__quillHelperLoaded = true;

  /* ── Knowledge base ─────────────────────────────────────────────
     Each entry:
       q    : canonical question (shown as a suggestion chip if chip:true)
       k    : keywords/synonyms used for matching (lowercase)
       a    : answer HTML (Sunny's voice)
       link : { href, label }  (optional "read more")
       chip : show as a starter suggestion chip (optional)
  */
  var KB = [

    /* ══════════════════════════════════════════════════════════════
       1. GUIDE — BOT MAKING
       ══════════════════════════════════════════════════════════════ */
    {
      q: "What is a token?",
      k: ["token", "tokens", "token count", "building blocks", "how many tokens", "token limit", "1500"],
      a: "Tokens are the building blocks of your bot &mdash; every character you type gets broken down into them, and they make up your whole chat (your messages, the bot's, and your system prompt too). The ideal range is widely considered to be around <strong>1200&ndash;1500</strong>, so don't panic if you're near the cap. Your bot will be fine, trust me!",
      link: { href: "guide-bot-making.html#b-tokens", label: "Tokens section" },
      chip: true
    },
    {
      q: "What is the context window?",
      k: ["context", "context window", "window", "forget", "forgetting", "cup", "spill", "10000", "10,000", "remembers"],
      a: "Think of the context window like a cup slowly filling with water. When it's full and you keep adding, it spills over &mdash; that's why long chats start forgetting earlier things. The Memory Nexus helps by condensing key points into bite-sized pieces so the cup takes longer to fill. I wrote a whole guide on how the window fills up and what falls out.",
      link: { href: "guide-context.html", label: "What is Context?" }
    },
    {
      q: "How do I come up with a name for my bot?",
      k: ["name", "names", "naming", "bot name", "character name", "what to name", "what should i call", "name ideas", "cant think of a name", "can't think of a name", "name for my", "pick a name", "naming my character", "good name"],
      a: "For names, look up baby-name sites and popular names from different countries and eras of history. In the rush to make bots &#8220;unique&#8221; with cool names, we&#8217;ve actually made them more unoriginal &mdash; an everyday name like Joseph stands out way more than yet another Silas or Elara! There&#8217;s a bit more on this in the guide.",
      link: { href: "guide-bot-making.html#b-usingai", label: "Names & ideas" }
    },
    {
      q: "How should I write the Persona?",
      k: ["persona", "brain", "traits", "psychology", "personality"],
      a: "I treat \"think of this as the brain\" literally &mdash; it's how they think and process things. I used to split it into loads of sections, but now I just do two written narratively: <strong>Traits</strong> and <strong>Psychology</strong>. I don't separate into good or bad; the LLM can decide that.",
      link: { href: "guide-bot-making.html#b-persona", label: "Persona & Details" }
    },
    {
      q: "What goes in Details?",
      k: ["details", "appearance", "fears", "speech pattern", "conflict", "love language", "background", "relationships", "hobbies"],
      a: "Everything you didn't cover in the Persona &mdash; appearance, fears, speech pattern, conflict style, love language, background, relationships. Try to drop in a few likes or hobbies so they have depth beyond their main issue. If you don't, the LLM will invent something, and 95% of the time it's a secret sketchbook they don't tell anyone about.",
      link: { href: "guide-bot-making.html#b-persona", label: "Persona & Details" }
    },
    {
      q: "Do I need an Author's Note?",
      k: ["author's note", "authors note", "author note", "an", "note", "always present"],
      a: "Honestly? Most of my bots <em>don't even have one</em>. The Author's Note is heavily weighted &mdash; it's like screaming \"HEY! REMEMBER THIS!\" at the LLM every single message, so if you're not careful you can freeze a character and stop them ever developing. I use them sparingly, only for characters very set in their ways or to prevent specific biases like spilling secrets.",
      link: { href: "guide-bot-making.html#b-notes", label: "Author's Notes" },
      chip: true
    },
    {
      q: "Should I put NSFW or jailbreaks in the Author's Note?",
      k: ["nsfw author note", "jailbreak", "jailbreaks", "nsfw=true", "goon", "filthy", "write nsfw"],
      a: "I'd leave both out. There are no filters on DreamJourney, so there's no need for an NSFW=True situation, and NSFW in such a heavily-weighted spot makes it bleed into non-horny scenes (Poor Sarah). Leave it to the user and their system prompt &mdash; unless your bot is an obvious goon-bot or you've said so in the public Author Comment.",
      link: { href: "guide-bot-making.html#b-notes", label: "Author's Notes" }
    },
    {
      q: "Can I use pseudo-code or emoji (W++, P-lists)?",
      k: ["pseudo-code", "pseudocode", "w++", "p-list", "plist", "emoji", "code", "ammoral_content"],
      a: "You really don't need to anymore. LLMs are large <em>language</em> models &mdash; they're extensively trained on plain written language, so it's far simpler to just tell them what you want in normal sentences. A lot of the W++/P-list advice floating around online is outdated.",
      link: { href: "guide-bot-making.html#b-notes", label: "Author's Notes" }
    },
    {
      q: "How do I write a good first message?",
      k: ["first message", "firstmessage", "greeting", "intro", "scene", "scenes", "anypov", "pov", "opening"],
      a: "For public use, go third-person AnyPOV (third person from the bot, user can be anyone) and use gender-neutral language so people can be whoever they want. Avoid writing actions or dialogue <em>for</em> the user. My favourite loopholes are \"person\" and \"figure\" &mdash; a figure approached! A man, a woman, a leprechaun?! Bonus: your first message doesn't trigger the lorebook, so go wild with lore.",
      link: { href: "guide-bot-making.html#b-firstmsg", label: "First Message & Scenes" }
    },
    {
      q: "Should I mark my bot as NSFW?",
      k: ["nsfw", "mark nsfw", "sfw", "standard bot", "filtered", "credits", "commission"],
      a: "Standard bots aren't limited or filtered &mdash; the roleplay is still unlimited, NSFW just isn't their primary focus. Unless your first message or description is heavily NSFW, you don't need to mark it. Bonus: you don't earn credit commissions on NSFW bots, so unless you're sure, leaving them unmarked is usually the move.",
      link: { href: "guide-bot-making.html#b-nsfw", label: "NSFW or Standard Bot?" }
    },
    {
      q: "What are system prompts?",
      k: ["system prompt", "system prompts", "preset", "minerva", "temp", "settings", "response builder"],
      a: "System prompts are user-end instructions that control format, tone, etc. If you're new, try the response builder tool in settings before writing your own. I prefer long replies with a balance of dialogue and narration (a little heavier on narration), and I share my Minerva presets in the guide.",
      link: { href: "guide-bot-making.html#b-system", label: "System Prompts" }
    },
    {
      q: "Should I use AI to write my bots?",
      k: ["ai", "chatgpt", "gpt", "claude", "gemini", "slop", "use ai", "write my bot", "generate"],
      a: "Using AI to <em>help</em> is totally fine &mdash; for refinement, ideas, or cutting a long backstory down. Using it to write the <em>whole</em> bot gives you stale tropes, no real personality, and \"so, tell me about yourself?\" loops. Slop in, slop out. The more human your input, the more human your output.",
      link: { href: "guide-bot-making.html#b-usingai", label: "Using AI in your Bot Creation" }
    },

    /* ══════════════════════════════════════════════════════════════
       2. GUIDE — LOREBOOKS
       ══════════════════════════════════════════════════════════════ */
    {
      q: "What are lorebooks for?",
      k: ["lorebook", "lorebooks", "lore", "entry", "entries", "continuity"],
      a: "For me, lorebooks are mostly about continuity and setting. I almost always include the character's family, no matter the setting, so your bot's mum doesn't morph into someone else 50 messages in. Entries only get pulled when their triggers are mentioned, so you use the info only when you need it.",
      link: { href: "guide-bot-making.html#b-lorebooks", label: "Lorebooks" },
      chip: true
    },
    {
      q: "What are triggers and cascading?",
      k: ["trigger", "triggers", "cascade", "cascading", "pull", "wrapping"],
      a: "Triggers are the words that bring a lorebook entry into the chat. <strong>Cascading</strong> is when one entry's content triggers other entries &mdash; fine if they're small, but four big entries firing at once eats loads of tokens (too much water in the cup!). I've since figured out how to reference entries without cascading using trigger wrapping &mdash; it's all in the updated guide.",
      link: { href: "guide-lorebooks.html#u-cascade", label: "Updated Lorebook Guide" }
    },
    {
      q: "What are entry weight, pinned, and hidden entries?",
      k: ["weight", "entry weight", "pinned", "pin", "hidden", "priority"],
      a: "These are newer DJ lorebook features: <strong>entry weight</strong> (1&ndash;10 priority), <strong>pinned entries</strong> (up to 3, always loaded), and <strong>hidden entries</strong>. I cover all of them with worked examples in the updated lorebook guide.",
      link: { href: "guide-lorebooks.html#u-weight", label: "Updated Lorebook Guide" }
    },

    /* ══════════════════════════════════════════════════════════════
       3. PLATFORM — DREAMJOURNEY
       ══════════════════════════════════════════════════════════════ */
    {
      q: "I'm brand new to DreamJourney, where do I start?",
      k: ["new", "start", "beginner", "dreamjourney", "dj", "getting started", "intro", "how do i begin"],
      a: "Welcome! Start with the DreamJourney intro guide for the lay of the land, then the bot-making guide when you're ready to build. Take your time &mdash; none of this is the \"right\" way, it's just how I do it.",
      link: { href: "guide-dreamjourney-intro.html", label: "DreamJourney Intro" },
      chip: true
    },
    {
      q: "Who makes DreamJourney / who's the dev?",
      k: ["dev", "developer", "who made dreamjourney", "who makes dreamjourney", "rishi", "owner", "founder", "creator of dreamjourney", "runs dreamjourney", "behind dreamjourney", "dj dev", "staff"],
      a: "Rishi! You can find him on the DreamJourney Discord as <strong>@rishi.mg</strong>.",
      link: { href: "links.html", label: "Links" }
    },
    {
      q: "Is DreamJourney free?",
      k: ["free", "cost", "price", "pay", "paid", "credits", "subscription", "patreon", "lemonsqueezy", "expensive", "money", "trial", "how much", "afford"],
      a: "DreamJourney uses credits and a subscription model through Patreon or LemonSqueezy. Coming from another site and want to try, or used up your trial credits and want to test a little more? Use the contact form on this site and I'll send you a small gift so you can try our wonderful models a little longer. Creators can also earn credits from other people chatting with their bots (great incentive to make quality content!), and there are community + official events on Discord where you can win credits!",
      link: { href: "contact.html", label: "Contact form" }
    },
    {
      q: "What models does DreamJourney use?",
      k: ["models", "model", "minerva", "athena", "llm", "what model", "which model", "base model", "gpt or claude", "what ai"],
      a: "DreamJourney uses its own models, blends and weights that aren't public &mdash; though there are often guesses about the base models floating around the Discord."
    },
    {
      q: "What's the Memory Nexus?",
      k: ["memory nexus", "nexus", "chat memory", "memory", "long term memory", "auto memory", "bot remember"],
      a: "It's DreamJourney's automatic memory system. It condenses the key points of your chat into bite-sized pieces so your context window takes longer to fill up and things stick around longer. There's more on how that works in the context guide.",
      link: { href: "guide-context.html", label: "What is Context?" }
    },
    {
      q: "Can I use DreamJourney on mobile?",
      k: ["mobile", "phone", "app", "android", "ios", "tablet", "download app", "play store", "app store", "on my phone"],
      a: "Yep! Use the webapp in your browser. There's no actual app though &mdash; you won't find it on any stores."
    },
    {
      q: "Is JanitorAI different from DreamJourney? Which should I use?",
      k: ["janitor", "janitorai", "janitor vs", "difference", "which site", "which should i use", "jllm", "proxy", "proxies", "compare", "dreamjourney or janitor", "vs"],
      a: "I'd say DreamJourney. Janitor is free, but the JLLM is&hellip; ass, and my bots there currently have proxies disabled.",
      link: { href: "links.html", label: "Links" }
    },
    {
      q: "Is there a Discord?",
      k: ["discord", "community", "server", "join discord", "chat community", "discord link"],
      a: "Yep &mdash; the DreamJourney community Discord is linked on the Links page. It's where you'll find events, credit giveaways, and the dev @rishi.mg.",
      link: { href: "links.html", label: "Links" }
    },
    {
      q: "Are these bots safe for minors? What's the age requirement?",
      k: ["18+", "age", "minor", "minors", "safe for kids", "under 18", "adult", "old enough", "age requirement", "age limit"],
      a: "DreamJourney and JanitorAI are both <strong>18+ platforms</strong>, so please make sure you meet the age requirements before diving in."
    },

    /* ══════════════════════════════════════════════════════════════
       4. TOOLS
       ══════════════════════════════════════════════════════════════ */
    {
      q: "What is Aster?",
      k: ["aster", "extension", "browser extension", "tool"],
      a: "Aster is my browser extension for DreamJourney &mdash; it adds creator tools like testing how your lorebook actually pulls. There's a help page that walks through it.",
      link: { href: "aster.html", label: "Aster" }
    },
    {
      q: "What is Quill?",
      k: ["quill", "you", "who are you", "what are you"],
      a: "Hi! I'm Quill &mdash; a little helper that answers questions using Sunny's guides. I'm not a real AI, just a friendly index of everything in the guides, so I'll always point you to the proper section to read more. There's also a Quill tool guide if you meant that!",
      link: { href: "quill-guide.html", label: "Quill guide" }
    },

    /* ══════════════════════════════════════════════════════════════
       5. ABOUT SUNNY & HER BOTS
       ══════════════════════════════════════════════════════════════ */
    {
      q: "Who is Sunny?",
      k: ["sunny", "who is sunny", "about sunny", "sunny age", "sunny real name", "tell me about sunny", "sunny irl", "about the creator", "what is sunflowers", "who is sunflower seeds"],
      a: "Sunny is a timeless being from beyond time and space, nobody can know the ways of her madness&mdash;I'm lying, I just don't know.",
      link: { href: "about.html", label: "About" }
    },
    {
      q: "Is Sunny part of the DreamJourney team?",
      k: ["sunny team", "sunny staff", "work for dreamjourney", "sunny employee", "official", "part of the team", "sunny dev", "does sunny work", "sunny moderator", "sunny admin"],
      a: "Nope! Sunny is just a creator with too much time on her hands and too much ADHD to focus on her real job."
    },
    {
      q: "How do I contact Sunny?",
      k: ["contact", "message sunny", "reach sunny", "email", "dm", "get in touch", "talk to sunny", "request credits", "free credits", "gift credits", "ask sunny"],
      a: "Easiest way is the contact form on this site &mdash; it comes straight to me (you can pop a Discord handle in there too). It's also where to ask if you'd like a few gift credits to try the models.",
      link: { href: "contact.html", label: "Contact" }
    },
    {
      q: "Where can I find Sunny's bots?",
      k: ["find bots", "where bots", "sunny bots", "platforms", "janitor", "janitorai", "dreamjourney profile", "profile", "play bots", "links", "where to play"],
      a: "I'm on <strong>DreamJourney</strong> (@Sunflower__Seeds_) and <strong>JanitorAI</strong> (@Sunflower_Seeds). All the links are on the Links page, and every character page has buttons straight to the bot.",
      link: { href: "links.html", label: "Links" }
    },
    {
      q: "Do you take bot requests or commissions?",
      k: ["request", "requests", "commission", "commissions", "take requests", "custom bot", "hire", "pay you", "make me a bot", "do you take"],
      a: "Requests, yes &mdash; but they're not guaranteed! Commissions, not currently, but I'm considering it.",
      link: { href: "contact.html", label: "Contact" }
    },
    {
      q: "Can I repost or re-upload your bots or guides?",
      k: ["repost", "reupload", "re-upload", "steal", "copy your bot", "copy guide", "translate", "share your bot", "use your bot", "redistribute", "upload your bot", "rehost"],
      a: "No >:( I hand write my stinkies! Write your own &mdash; my guide tells you how! That said, if you really want a copy of one of my characters for <em>personal or private</em> use, use the contact form and I'll see what I can do.",
      link: { href: "contact.html", label: "Contact" }
    },
    {
      q: "How often do you post new bots? Where do I hear about releases?",
      k: ["how often", "new bots", "schedule", "new release", "releases", "when new bot", "post new", "upcoming", "updates", "next bot"],
      a: "Sporadically! I'm hoping to get back into a regular schedule with posting and improving my own workflow. For now, the best places for updates are the homepage of this site or the DreamJourney Discord.",
      link: { href: "index.html", label: "Home" }
    },
    {
      q: "What's your most popular bot? Who should I start with?",
      k: ["most popular", "popular bot", "start with", "recommend", "which bot", "best bot", "favourite bot", "favorite bot", "who should i try", "first bot", "where to start bot"],
      a: "Hideo, Summer, or Veldrin &mdash; it depends on the setting you want or the gender. Some of my own favourites are Luka, Aleksei, Rowan, Temerity and Carys.",
      link: { href: "characters.html", label: "Characters" }
    },
    {
      q: "Do you do collabs or creator groups?",
      k: ["collab", "collabs", "collaboration", "creator group", "groups", "team up", "ass collab", "university bounty", "join you", "open collab"],
      a: "No groups at present! The A.S.S. collab event is permanently open for submissions, though.",
      link: { href: "ass-world.html", label: "A.S.S." }
    },
    {
      q: "Can I suggest a character or world idea?",
      k: ["suggest", "suggestion", "idea", "character idea", "world idea", "propose", "recommend a character", "can i suggest", "request a character"],
      a: "Yep! Drop it in the contact form &mdash; I'd love to hear your ideas (no promises, but I read them all).",
      link: { href: "contact.html", label: "Contact" }
    },
    {
      q: "Why are some characters blurred or 'coming soon'?",
      k: ["blurred", "blur", "coming soon", "locked", "why blurred", "greyed out", "not clickable", "unreleased", "cant click", "can't click", "fuzzy"],
      a: "Those are characters that aren't released yet! They're previews of bots still in the works, so they're blurred and not clickable until they're ready.",
      link: { href: "characters.html", label: "Characters" }
    },
    {
      q: "Are your bots SFW or NSFW?",
      k: ["sfw or nsfw", "are your bots nsfw", "your bots nsfw", "sfw", "marked nsfw", "horny", "clean bot", "worksafe", "is it nsfw"],
      a: "All of my bots are unmarked (standard), but they're fully capable of both SFW and NSFW &mdash; NSFW just isn't their primary focus. The roleplay is unlimited either way.",
      link: { href: "guide-bot-making.html#b-nsfw", label: "NSFW or Standard Bot?" }
    }
  ];

  /* ── Tiny retrieval engine ─────────────────────────────────────── */
  var STOP = {a:1,an:1,the:1,is:1,are:1,do:1,does:1,did:1,my:1,me:1,to:1,of:1,for:1,in:1,on:1,and:1,or:1,how:1,what:1,whats:1,should:1,could:1,can:1,you:1,it:1,its:1,this:1,that:1,with:1,about:1,if:1,be:1,when:1,where:1,why:1,who:1,your:1,there:1,any:1,some:1,get:1,use:1,using:1,make:1,making:1,want:1,need:1,have:1,has:1,bot:1,bots:1,help:1};
  function norm(s){ return (s||"").toLowerCase().replace(/[^a-z0-9+\s]/g," ").replace(/\s+/g," ").trim(); }
  function stem(w){ return w.length > 4 ? w.replace(/s$/, "") : w; }
  function tokens(s){ return norm(s).split(" ").filter(function(w){ return w.length >= 3 && !STOP[w]; }); }

  // Returns all entries scored against the query, best first.
  function searchAll(query) {
    var qWords = tokens(query);
    if (!qWords.length) return [];
    var scored = KB.map(function (e) {
      var words = {};
      norm(e.q + " " + e.k.join(" ")).split(" ").forEach(function (w) { if (w) { words[w] = 1; words[stem(w)] = 1; } });
      var phrases = e.k.map(norm);
      var score = 0;
      qWords.forEach(function (w) {
        var s = stem(w);
        if (words[w] || words[s]) score += 2;            // exact whole-word match
        // Best phrase bonus for this word, counted ONCE (so an entry with many
        // similar "sunny ___" keywords can't out-score the actual topic).
        var pb = 0;
        phrases.forEach(function (p) {
          if (p === w) pb = Math.max(pb, 3);             // a keyword phrase IS the word
          else if ((" " + p + " ").indexOf(" " + w + " ") !== -1) pb = Math.max(pb, 1.5); // word sits inside a phrase
        });
        score += pb;
      });
      return { e: e, score: score / Math.sqrt(qWords.length) };
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    return scored;
  }

  /* ── Casual chit-chat & cheeky comebacks (checked around the KB) ── */
  function pick(a) { return Array.isArray(a) ? a[Math.floor(Math.random() * a.length)] : a; }
  function phraseHit(nq, p) { return (" " + nq + " ").indexOf(" " + p + " ") !== -1; }

  // If someone's being rude (to Quill, to Sunny, or just generally), tease them.
  var MEAN = ["stupid", "dumb", "idiot", "you suck", "this sucks", "sucks", "hate you", "i hate you",
    "hate sunny", "hate quill", "ugly", "trash", "useless", "shut up", "shutup", "loser", "lame",
    "cringe", "worst", "bad bot", "terrible bot", "fuck you", "fuck off", "screw you", "kys",
    "retard", "moron", "annoying", "worthless", "pathetic", "stupid bot", "dumb bot", "you're dumb",
    "youre dumb", "you are dumb", "shut it", "garbage", "dogshit"];
  var MEAN_REPLIES = [
    "Uh-oh, sounds like someone needs to log-off, hmm? 🪶",
    "Getting heated at a little quill on a fan site? Maybe it’s snack-and-nap o’clock. 😌",
    "Aw, taking it out on the bots today? Deep breaths, go touch some grass. 🌱",
    "Big words for someone arguing with a glorified bookmark. Log off, champ. 😘"
  ];

  var CASUAL = [
    { k: ["hello", "hi there", "hey", "heya", "hiya", "yo", "sup", "whats up", "what's up", "good morning", "good evening", "howdy", "hey quill"],
      a: ["Hey hey! 🪶 What can I help you dig out of the guides?", "Hiya! Ask me anything about bot-making or the site."] },
    { k: ["how are you", "how r u", "you good", "hows it going", "how's it going", "how you doing", "how are u", "you okay", "how are things"],
      a: ["Living my best life as a glorified bookmark, thanks for asking! What can I help with?", "Can’t complain &mdash; I’m made of keywords and vibes. How can I help?"] },
    { k: ["thank you", "thanks", "ty", "cheers", "appreciate it", "thank u", "thx"],
      a: ["Anytime! Go make something stinky and wonderful. 🌻", "No problem at all &mdash; happy writing!"] },
    { k: ["tell me a joke", "joke", "make me laugh", "say something funny"],
      a: ["Why did the bot get rejected? Too many tokens, not enough rizz. 🥁", "I’d tell you a lorebook joke, but it only triggers if you mention it first."] },
    { k: ["bored", "entertain me", "im bored", "i'm bored", "what do i do"],
      a: ["Go make a bot! Brainstorm someone’s whole tragic backstory, you know how it goes. 😌", "Pick a character you love and ask: who are they, how did they get here, and why are they the way they are? Rabbit hole guaranteed."] },
    { k: ["love you", "good bot", "best bot", "youre cute", "you're cute", "good girl", "you're great", "youre great", "you're the best", "love quill"],
      a: ["Aw, stoppp 🥹 now go write a bot!", "🥹🪶 ok ok, enough sweet talk, let’s make something."] },
    { k: ["bye", "goodbye", "see ya", "cya", "see you", "later", "good night", "gn"],
      a: ["Byee! Come back if a guide question pops up. 🪶", "Take care! Go forth and write stinkies. 🌻"] },
    { k: ["are you ai", "are you real", "are you a bot", "real person", "are you human", "are you chatgpt", "are you sentient"],
      a: ["I’m not a real AI &mdash; just a friendly index of Sunny’s guides with a bit of personality bolted on. No API, no magic, just keywords and vibes!"] }
  ];

  function detectMean(nq) { for (var i = 0; i < MEAN.length; i++) if (phraseHit(nq, MEAN[i])) return pick(MEAN_REPLIES); return null; }
  function detectCasual(nq) { for (var i = 0; i < CASUAL.length; i++) { var e = CASUAL[i]; for (var j = 0; j < e.k.length; j++) if (phraseHit(nq, e.k[j])) return pick(e.a); } return null; }

  /* ── Light NLG: varied openers so answers don't read canned.
     (Blank entries weighted in so not every reply gets one.) ── */
  var OPENERS = ["", "", "", "Good question! ", "Sure thing! ", "Right then &mdash; ", "Oh, easy one &mdash; ", "Ah, "];
  function topicLabel(e) { return e.link ? e.link.label : e.q.replace(/[?.]$/, ""); }
  function linkHtml(e) { return e.link ? '<br><a class="qh-readmore" href="' + e.link.href + '">Read: ' + e.link.label + ' &rarr;</a>' : ''; }
  // CONFIDENT (>=1.8) gives a real answer; NEAR (>=1.1) gives a "did you mean" hedge.
  var CONFIDENT = 1.8, NEAR = 1.1;

  /* ── UI ─────────────────────────────────────────────────────────── */
  var css = ''
    + '#quill-fab{position:fixed;right:34px;bottom:34px;width:58px;height:58px;border-radius:50%;'
    + 'background:var(--gb,rgba(254,249,240,0.92));border:1px solid var(--gbord,rgba(212,168,50,0.4));'
    + 'box-shadow:0 6px 22px rgba(0,0,0,0.20);cursor:pointer;z-index:9000;display:flex;align-items:center;'
    + 'justify-content:center;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);'
    + 'transition:transform .25s,box-shadow .25s;padding:0;}'
    + '#quill-fab:hover{transform:translateY(-3px) scale(1.05);box-shadow:0 10px 30px rgba(0,0,0,0.28);}'
    + '#quill-fab img{width:34px;height:34px;object-fit:contain;}'
    + '#quill-fab .qh-badge{position:absolute;top:-4px;right:-4px;width:16px;height:16px;border-radius:50%;'
    + 'background:var(--gold,#D4A832);border:2px solid var(--gb,#fff);}'
    + '#quill-panel{position:fixed;right:34px;bottom:102px;width:340px;max-width:calc(100vw - 32px);'
    + 'height:480px;max-height:calc(100vh - 130px);background:var(--gb,rgba(254,249,240,0.97));'
    + 'border:1px solid var(--gbord,rgba(212,168,50,0.35));border-radius:18px;box-shadow:0 16px 48px rgba(0,0,0,0.28);'
    + 'z-index:9001;display:none;flex-direction:column;overflow:hidden;backdrop-filter:blur(18px);'
    + '-webkit-backdrop-filter:blur(18px);font-family:Nunito,sans-serif;}'
    + '#quill-panel.open{display:flex;animation:qhpop .22s ease both;}'
    + '@keyframes qhpop{from{opacity:0;transform:translateY(12px) scale(.98);}to{opacity:1;transform:none;}}'
    + '.qh-head{display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid var(--gbord,rgba(212,168,50,0.25));}'
    + '.qh-head img{width:30px;height:30px;object-fit:contain;}'
    + '.qh-head .qh-t{font-weight:700;color:var(--forest,#4E6E3C);font-size:0.98rem;line-height:1.1;}'
    + '.qh-head .qh-s{font-size:0.66rem;color:var(--bark,#7A5C3E);opacity:0.75;}'
    + '.qh-x{margin-left:auto;background:none;border:none;cursor:pointer;font-size:1.2rem;color:var(--text-mid,#5C4433);line-height:1;padding:4px;}'
    + '.qh-body{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;}'
    + '.qh-msg{max-width:88%;padding:10px 13px;border-radius:14px;font-size:0.85rem;line-height:1.55;color:var(--text,#332820);}'
    + '.qh-bot{align-self:flex-start;background:var(--note-bg,rgba(143,175,122,0.16));border:1px solid var(--gbord,rgba(212,168,50,0.18));border-bottom-left-radius:4px;}'
    + '.qh-user{align-self:flex-end;background:var(--nav-hover,rgba(143,175,122,0.28));border-bottom-right-radius:4px;}'
    + '.qh-msg a{color:var(--forest,#4E6E3C);font-weight:600;}'
    + '.qh-readmore{display:inline-block;margin-top:7px;font-size:0.74rem;font-weight:700;color:var(--forest,#4E6E3C);'
    + 'text-decoration:none;border:1px solid var(--gbord,rgba(143,175,122,0.4));background:rgba(143,175,122,0.12);'
    + 'padding:3px 11px;border-radius:14px;}'
    + '.qh-readmore:hover{background:rgba(143,175,122,0.25);}'
    + '.qh-aside{display:block;margin-top:6px;font-size:0.78rem;font-style:italic;color:var(--text-mid,#5C4433);opacity:0.85;}'
    + '.qh-chips{display:flex;flex-wrap:wrap;gap:6px;padding:2px 0 4px;}'
    + '.qh-chip{font-size:0.74rem;color:var(--forest,#4E6E3C);background:rgba(143,175,122,0.14);'
    + 'border:1px solid var(--gbord,rgba(143,175,122,0.4));border-radius:14px;padding:5px 11px;cursor:pointer;'
    + 'transition:background .15s;}'
    + '.qh-chip:hover{background:rgba(143,175,122,0.28);}'
    + '.qh-foot{display:flex;gap:8px;padding:10px 12px;border-top:1px solid var(--gbord,rgba(212,168,50,0.25));}'
    + '.qh-foot input{flex:1;border:1px solid var(--input-border,rgba(212,168,50,0.35));background:var(--input-bg,rgba(254,249,240,0.7));'
    + 'border-radius:18px;padding:8px 14px;font-size:0.85rem;font-family:Nunito,sans-serif;color:var(--text,#332820);outline:none;}'
    + '.qh-foot input:focus{border-color:var(--forest,#4E6E3C);}'
    + '.qh-foot button{border:none;background:var(--forest,#4E6E3C);color:#fff;border-radius:18px;padding:0 16px;'
    + 'cursor:pointer;font-weight:700;font-size:0.85rem;}'
    + '.qh-foot button:hover{opacity:0.9;}'
    + '@media(max-width:768px){#quill-fab{right:14px;bottom:70px;}#quill-panel{right:8px;left:8px;width:auto;bottom:140px;}}'
    /* Dark mode overrides */
    + '[data-theme="dark"] #quill-fab{'
    + 'background:rgba(24,18,10,0.94);border-color:rgba(157,196,122,0.32);}'
    + '[data-theme="dark"] #quill-panel{'
    + 'background:rgba(20,15,8,0.97);border-color:rgba(157,196,122,0.22);}'
    + '[data-theme="dark"] .qh-head{border-bottom-color:rgba(157,196,122,0.18);}'
    + '[data-theme="dark"] .qh-head .qh-t{color:#9DC47A;}'
    + '[data-theme="dark"] .qh-head .qh-s{color:#C8B89A;}'
    + '[data-theme="dark"] .qh-x{color:#C8B89A;}'
    + '[data-theme="dark"] .qh-msg{color:#F0E8D8;}'
    + '[data-theme="dark"] .qh-bot{background:rgba(157,196,122,0.09);border-color:rgba(157,196,122,0.18);}'
    + '[data-theme="dark"] .qh-user{background:rgba(157,196,122,0.18);}'
    + '[data-theme="dark"] .qh-msg a{color:#9DC47A;}'
    + '[data-theme="dark"] .qh-readmore{color:#9DC47A;border-color:rgba(157,196,122,0.35);background:rgba(157,196,122,0.10);}'
    + '[data-theme="dark"] .qh-readmore:hover{background:rgba(157,196,122,0.22);}'
    + '[data-theme="dark"] .qh-aside{color:#C8B89A;}'
    + '[data-theme="dark"] .qh-chip{color:#9DC47A;background:rgba(157,196,122,0.10);border-color:rgba(157,196,122,0.30);}'
    + '[data-theme="dark"] .qh-chip:hover{background:rgba(157,196,122,0.22);}'
    + '[data-theme="dark"] .qh-foot{border-top-color:rgba(157,196,122,0.18);}'
    + '[data-theme="dark"] .qh-foot input{background:rgba(18,14,8,0.80);border-color:rgba(157,196,122,0.28);color:#F0E8D8;}'
    + '[data-theme="dark"] .qh-foot input:focus{border-color:#9DC47A;}'
    + '[data-theme="dark"] .qh-foot button{background:#4E6E3C;}'
    + '[data-theme="dark"] .qh-foot button:hover{background:#5d8247;}';

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  function init() {
    var style = el("style"); style.textContent = css; document.head.appendChild(style);

    var ICON = "icons/quill.png"; // relative to page; all guide pages share root

    var fab = el("button", null, '<img src="' + ICON + '" alt=""><span class="qh-badge"></span>');
    fab.id = "quill-fab";
    fab.setAttribute("aria-label", "Ask Quill about the guides");

    var panel = el("div"); panel.id = "quill-panel";
    panel.innerHTML =
      '<div class="qh-head"><img src="' + ICON + '" alt="">'
      + '<div><div class="qh-t">Ask Quill</div><div class="qh-s">Answers from Sunny’s guides</div></div>'
      + '<button class="qh-x" aria-label="Close">×</button></div>'
      + '<div class="qh-body" id="qh-body"></div>'
      + '<div class="qh-foot"><input id="qh-input" type="text" placeholder="Ask me anything about bot-making…" autocomplete="off">'
      + '<button id="qh-send">Ask</button></div>';

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    var body = panel.querySelector("#qh-body");
    var input = panel.querySelector("#qh-input");

    function addMsg(html, who) {
      var m = el("div", "qh-msg " + (who === "user" ? "qh-user" : "qh-bot"), html);
      body.appendChild(m); body.scrollTop = body.scrollHeight; return m;
    }
    function addChips() {
      var row = el("div", "qh-chips");
      KB.filter(function (e) { return e.chip; }).forEach(function (e) {
        var c = el("button", "qh-chip", e.q);
        c.addEventListener("click", function () { ask(e.q); });
        row.appendChild(c);
      });
      body.appendChild(row); body.scrollTop = body.scrollHeight;
    }
    function ask(query) {
      addMsg(query.replace(/</g, "&lt;"), "user");
      var nq = norm(query);
      var mean = detectMean(nq);
      var ranked = mean ? [] : searchAll(query);
      var top = ranked[0], second = ranked[1];
      var confident = top && top.score >= CONFIDENT;
      var casual = (mean || confident || (top && top.score >= NEAR)) ? null : detectCasual(nq);
      setTimeout(function () {
        if (mean) { addMsg(mean, "bot"); return; }
        if (confident) {
          var html = pick(OPENERS) + top.e.a;
          // If a second, distinct topic also scored strongly, offer it.
          if (second && second.e !== top.e && second.score >= CONFIDENT && second.score >= top.score * 0.7) {
            html += ' <span class="qh-aside">(That also brushes up against <strong>' + topicLabel(second.e) + '</strong> &mdash; ask me if you want that too.)</span>';
          }
          html += linkHtml(top.e);
          addMsg(html, "bot");
        } else if (top && top.score >= NEAR) {
          // Near miss: reflect the closest topic back rather than a flat "no".
          addMsg("I&#8217;m not totally sure I follow &mdash; but if you mean <em>&#8220;" + top.e.q + "&#8221;</em>, here&#8217;s the gist:<br>" + top.e.a + linkHtml(top.e), "bot");
        } else if (casual) {
          addMsg(casual, "bot");
        } else {
          addMsg("Hmm, I’m not sure about that one &mdash; I only know what’s in Sunny’s guides. Try rephrasing, tap a suggestion below, or browse the <a href=\"guides.html\">Guides</a> directly.", "bot");
        }
      }, 220);
    }

    // greeting + chips (chips live inside the scrollable chat)
    addMsg("Hey! I’m <strong>Quill</strong> 🪶 I can answer questions using Sunny’s guides. Ask away, or tap one of these:", "bot");
    addChips();

    function send() { var v = input.value.trim(); if (!v) return; input.value = ""; ask(v); }
    panel.querySelector("#qh-send").addEventListener("click", send);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") send(); });

    function toggle(open) {
      var show = open == null ? !panel.classList.contains("open") : open;
      panel.classList.toggle("open", show);
      if (show) setTimeout(function () { input.focus(); }, 60);
    }
    fab.addEventListener("click", function () { toggle(); });
    panel.querySelector(".qh-x").addEventListener("click", function () { toggle(false); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
