# CLAUDE.md — PandaBot

## Project Overview

A modular Discord bot built with TypeScript, discord.js v14, and DisTube for YouTube music playback. Used in a single Discord server for ~4-5 hours once a week.

## Tech Stack

* **Runtime** : Node.js (user is on v25.9.0 — requires `"type": "commonjs"` in package.json)
* **Language** : TypeScript (strict mode)
* **Discord library** : discord.js v14
* **Music/audio** : DisTube v5 (handles YouTube search, URL playback, queue, filters — no API key needed)
* **Voice** : @discordjs/voice + @discordjs/opus + ffmpeg-static
* **Dev tooling** : tsx (for hot-reload dev server), tsc for production builds

## Architecture — Modular Command System

Commands are auto-discovered from `src/commands/`. Each command is a standalone `.ts` file exporting a `BotCommand` (defined in `src/types/command.ts`). The loader in `src/utils/load-commands.ts` scans the directory at startup. **To add a new command, just create a new file in `src/commands/` — no wiring needed.** Then run `npm run register` to push new slash commands to Discord.

### File structure

```
src/
├── index.ts                 # Client, DisTube init, event routing
├── register-commands.ts     # One-shot script to push slash commands to Discord API
├── types/
│   └── command.ts           # BotCommand interface
├── utils/
│   └── load-commands.ts     # Auto-loader for commands/
└── commands/
    ├── play.ts              # /play <query> — YouTube URL or search
    ├── skip.ts              # /skip
    ├── stop.ts              # /stop — clears queue
    ├── pause.ts             # /pause
    ├── resume.ts            # /resume
    ├── queue.ts             # /queue — shows up to 10 upcoming
    └── loop.ts              # /loop [off|song|queue] — cycles if no arg
```

## Key Design Decisions

* **Slash commands only** (no prefix commands). Guild-scoped registration for instant updates during dev; switch to `Routes.applicationCommands(CLIENT_ID)` for global deploy.
* **DisTube handles all audio complexity** — voice connection, YouTube extraction, queue state, repeat modes. Commands call `distube.play()`, `distube.skip()`, etc.
* **Every command receives both the interaction and the DisTube instance** via `execute(interaction, distube)`.

## Scripts

* `npm run dev` — tsx watch mode with hot-reload
* `npm run build` — tsc compile to dist/
* `npm run start` — run compiled JS
* `npm run register` — push slash commands to Discord (must run after adding/changing command definitions)

## Environment

`.env` file with `DISCORD_TOKEN`, `CLIENT_ID`, `GUILD_ID`. System dependency: ffmpeg.

## User Context

The developer has a strong software background but is newer to the Node.js/Discord ecosystem. They also work on a wearable robotic arm cosplay project involving Arduino, inverse kinematics, and 3D printing — unrelated to this project but relevant to their skill profile.

## Future Plans

The bot is designed to be extended with many more commands/features beyond music. Deployment target is a cheap VPS with PM2.
