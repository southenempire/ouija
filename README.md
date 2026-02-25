# 🪦 Ouija - The Solana Graveyard

*A Tapestry Hackathon Submission*

**Ouija** is a social graveyard for the Solana ecosystem. We all hear about the 100x gem hunters and the influencer calls that print money, but nobody talks about the bags they hold to zero. The rugs. The rekt trades. The lost seed phrases.

Ouija is the final resting place for your dead positions. It's a place to anonymously (or publicly) confess your greatest losses, read the confessions of fellow degens, and "Press F" to pay your respects.

### 🌐 Live Demo: [ouija-omega.vercel.app](https://ouija-omega.vercel.app)

---

## 💀 Features

- **Tombstone Confessions:** Post a permanent, immutable record of your worst crypto losses to the Graveyard feed.
- **Pay Respects (F):** Found a story that hits too close to home? Press F to pay respects and bump their Tombstone's "Like" count.
- **Viral 'Share to X' Intent:** Did someone just admit to losing 500 SOL on a sandwich sandwich token? Click the *Share* button to instantly generate a viral Twitter template linking back directly to their tragedy.
- **Global Leaderboard:** Discover the "Top Sinners"—those with the highest accumulated F's from the community.
- **The Social Graph:** Powered entirely by **Tapestry**, Ouija natively supports a fully integrated Web3 social graph. Click any username on the Feed to view their profile, see their lifetime stats, and hit **Follow**.
- **Hover to Tip:** Hover over any abbreviated wallet address on a tombstone to reveal the "Tip this Chad" interaction. A single click copies their address for a quick sympathy tip.

---

## 🕸️ Powered by Tapestry Protocol

Ouija demonstrates how Tapestry can be utilized to completely bypass the "Cold Start" problem in Web3 social.

Instead of building a massive, centralized custom database to handle Users, Authentication, Comments, Likes, and Follows, Ouija relies solely on Tapestry's protocol namespaces.

- **Profiles:** User profiles are created and retrieved using `socialfi.profiles`.
- **Confessions (Posts):** When a user confesses, it's submitted as a native Tapestry `comment` via `socialfi.comments`.
- **F's (Likes):** Every time a user presses 'F', we interact directly with Tapestry's `likesCreate` endpoint targeting that specific comment `nodeId`.
- **Following:** The entire Follow/Unfollow mechanism in the User Profile dashboard dynamically manipulates the Tapestry graph.

---

## 🛠️ Tech Stack & Architecture

Ouija's frontend is built to evoke the feeling of a haunted, cursed 8-bit retro arcade game:

- **Framework:** Next.js (App Router) deployed on Vercel Edge.
- **Web3 Auth:** Privy & Jupiter infrastructure for seamless, frictionless wallet connection.
- **Social Backend:** Tapestry Protocol SDK (`socialfi.js`).
- **Styling:** TailwindCSS with dynamic Framer Motion animations (fog effects, pulsing ghosts, and CRT scanlines).
- **Sound Design:** Embedded HTML5 Audio contexts that play spooky, 8-bit chiptune coin drops when interacting with the graveyard.

---

## 🛡️ Security & Auditing

The Ouija codebase has been audited for standard web vulnerabilities prior to submission:
- **Environment Variables:** All `TAPESTRY_API_KEY` executions are strict Server-Side Operations (inside Next.js `app/api/` routes). No private keys or secret variables are exposed to the `NEXT_PUBLIC` client bundle.
- **No XSS Injection Vectors:** Uses standard React rendering protocols. We actively avoided `dangerouslySetInnerHTML`.
- **Wallet Connection Safety:** Handled cleanly through Privy and validated against Tapestry profiles context.

---

## 🚀 Local Development

First, grab your API Keys from Privy and Tapestry.
Rename `.env.local.example` to `.env.local` and substitute the values.

```bash
# Clone the repository
git clone https://github.com/southenempire/ouija.git
cd ouija

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to visit the Graveyard.
