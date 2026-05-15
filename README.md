# PandaBot

A modular Discord bot built with **TypeScript**, **discord.js v14**, and **DisTube** for YouTube music playback.

## Adding New Commands

Drop a new `.ts` file in `src/commands/`. It just needs to export a `BotCommand`:

```ts
import { SlashCommandBuilder } from "discord.js";
import { BotCommand } from "../types/command";

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Pong!"),

  async execute(interaction, distube) {
    await interaction.reply("Pong!");
  },
};

export default command;
```

Then run `npm run register` to push the new slash command to Discord.

## Setup

### 1. Discord Developer Portal

1. Go to https://discord.com/developers/applications → **New Application**
2. Go to **Bot** tab → **Add Bot** → copy the **Token**
3. Enable these under **Privileged Gateway Intents**: (none needed for slash-only, but enable **Message Content** if you ever want prefix commands)
4. Go to **OAuth2 → URL Generator** → select scopes `bot` + `applications.commands` → select permissions `Connect`, `Speak`, `Send Messages` → open the generated URL to invite the bot

### 2. Install & Run

```bash
cp .env.example .env
# Fill in DISCORD_TOKEN, CLIENT_ID, GUILD_ID

npm install
npm run register   # push slash commands to your test server
npm run dev        # start with hot-reload
```

### 3. System Dependencies

You need **ffmpeg** installed on your system:

- **macOS:** `brew install ffmpeg`
- **Ubuntu/Debian:** `sudo apt install ffmpeg`
- **Windows:** download from ffmpeg.org and add to PATH

## Available Commands

| Command     | Description                          |
| ----------- | ------------------------------------ |
| `/play`   | Play a YouTube URL or search query   |
| `/skip`   | Skip the current song                |
| `/stop`   | Stop playback and clear the queue    |
| `/pause`  | Pause the current song               |
| `/resume` | Resume a paused song                 |
| `/queue`  | Show the current queue               |
| `/loop`   | Cycle loop mode (off / song / queue) |

## Deployment

For a single-server bot running a few hours/week, a cheap VPS is fine:

1. Provision a small VPS ($4-6/mo — DigitalOcean, Hetzner, Railway, etc.)
2. Install Node.js 20+ and ffmpeg
3. Clone the repo, `npm install`, `npm run build`
4. Use **PM2** to keep it running:
   ```bash
   npm install -g pm2
   pm2 start dist/index.js --name music-bot
   pm2 save
   pm2 startup
   ```
