# 🪦 Ouija - The Solana Graveyard

**Ouija** is a decentralized SocialFi platform built on the Solana blockchain. While traditional crypto social networks focus on flexing wins and memecoin moonshots, Ouija offers a different sanctuary: a place for the community to share, bond over, and lay to rest their worst trades, rugs, and liquidations.

Ouija provides a permanent, immutable record for your dead positions, allowing users to anonymously or publicly confess their greatest losses and receive support from fellow degens.

### 🌐 Live Application: [ouija-omega.vercel.app](https://ouija-omega.vercel.app)

---

## 💀 Platform Features

- **Tombstone Confessions:** Post an immutable record of your cryptocurrency losses to the global Graveyard feed.
- **Pay Respects (F):** Users can support each other by pressing 'F' to pay respects, directly influencing a confession's native engagement score.
- **Social Integration & Viral Loops:** Seamlessly share confessions directly to X (Twitter) with pre-filled, dynamic templates detailing the specific token and loss amount using social intent URLs.
- **Global Leaderboard:** Discover the "Top Sinners"—a ranked dashboard showcasing the users with the highest accumulated community respects.
- **Web3 Social Graph:** Ouija features a fully integrated Web3 social graph. Click any username or profile to view their lifetime statistics, read their personalized epitaph, and Follow their ongoing journey.
- **Direct Tipping Mechanics:** A native "Hover to Tip" feature on abbreviated wallet addresses enables frictionless peer-to-peer sympathy tips.

---

## 🕸️ Architecture & Infrastructure

Ouija leverages a modern, highly scalable Web3 technology stack to provide a frictionless user experience while abstracting away complex blockchain interactions.

- **Frontend Application:** Next.js (App Router) deployed securely on Vercel Edge infrastructure.
- **Authentication:** Wallet connection and ephemeral embedded wallets provided by **Privy**, ensuring a frictionless onboarding experience across devices.
- **Social Graph Protocol:** The entire backend database and social interaction layer (Profiles, Comments, Likes, Follows) runs natively on the **Tapestry Protocol**. This decentralized unified namespace eliminates the "cold start" problem inherent to new social networks.
- **Styling & UI/UX:** TailwindCSS combined with Framer Motion to create dynamic, highly interactive UI components (floating fog, interactive tooltips, and CRT visual aesthetics).
- **RPC Infrastructure:** Real-time Solana network interactions powered by **Helius**.

---

## 🚀 Getting Started locally

To run Ouija locally, you will need active API keys from Privy and Tapestry.

### 1. Clone the repository
```bash
git clone https://github.com/southenempire/ouija.git
cd ouija
```

### 2. Configure Environment Variables
Copy the example environment file and populate it with your specific API credentials:
```bash
cp .env.local.example .env.local
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to visit the local instance of the application.

---

## 🛡️ Security

The Ouija application utilizes strict Next.js App Router boundary protocols:
- Server-side execution is enforced for sensitive credentials (`TAPESTRY_API_KEY`).
- No private database keys are exposed to the `NEXT_PUBLIC` client bundle context.
- Input rendering is sanitized to prevent XSS injection vectors within the community feed. 

---

## 🤝 Contributing & Support

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/southenempire/ouija/issues) if you would like to contribute.
