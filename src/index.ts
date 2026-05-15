import "dotenv/config";
import ffmpegPath from "ffmpeg-static";
import { Client, GatewayIntentBits } from "discord.js";
import { DisTube } from "distube";
import { YtDlpPlugin } from "@distube/yt-dlp";
import { loadCommands } from "./utils/load-commands";

// ── Client setup ──────────────────────────────────────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// ── DisTube setup ─────────────────────────────────────────────
const distube = new DisTube(client, {
  emitNewSongOnly: true,
  plugins: [new YtDlpPlugin()],
  ffmpeg: { path: ffmpegPath! },
});

// ── Load commands ─────────────────────────────────────────────
console.log("Loading commands…");
const commands = loadCommands();

// ── Idle auto-disconnect ──────────────────────────────────────
const IDLE_TIMEOUT_MS = 15 * 60 * 1000;
const idleTimers = new Map<string, NodeJS.Timeout>();

function scheduleIdleDisconnect(guildId: string) {
  clearIdleDisconnect(guildId);
  const timer = setTimeout(() => {
    idleTimers.delete(guildId);
    const voice = distube.voices.get(guildId);
    if (!voice) return;
    const queue = distube.getQueue(guildId);
    if (queue && queue.playing) return; // safety check
    voice.leave();
  }, IDLE_TIMEOUT_MS);
  idleTimers.set(guildId, timer);
}

function clearIdleDisconnect(guildId: string) {
  const timer = idleTimers.get(guildId);
  if (timer) {
    clearTimeout(timer);
    idleTimers.delete(guildId);
  }
}

// ── Event: ready ──────────────────────────────────────────────
client.once("ready", (c) => {
  console.log(`\n🤖 Logged in as ${c.user.tag}`);
  console.log(`   Serving ${c.guilds.cache.size} guild(s)\n`);
});

// ── Event: slash command received ─────────────────────────────
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, distube);
    // Reset idle timer on any command; reschedule only if nothing is playing
    if (interaction.guildId) {
      clearIdleDisconnect(interaction.guildId);
      const queue = distube.getQueue(interaction.guildId);
      if (distube.voices.get(interaction.guildId) && !queue?.playing) {
        scheduleIdleDisconnect(interaction.guildId);
      }
    }
  } catch (err) {
    console.error(`Error in /${interaction.commandName}:`, err);
    const msg = "Something went wrong running that command.";
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: msg, ephemeral: true });
    } else {
      await interaction.reply({ content: msg, ephemeral: true });
    }
  }
});

// ── DisTube events ────────────────────────────────────────────
// @discordjs/voice's AudioPlayer stops after 5 missed frames (100ms with no data).
// Network jitter or ffmpeg startup latency can easily exceed that. Raise the limit.
distube.on("initQueue", (queue) => {
  queue.voice.audioPlayer.behaviors.maxMissedFrames = 250;
});

distube.on("playSong", (queue, song) => {
  clearIdleDisconnect(queue.id);
  const duration = song.isLive ? "LIVE" : song.formattedDuration;
  queue.textChannel?.send(`🎵 Now playing: **${song.name}** — \`${duration}\``);
});

distube.on("addSong", (queue, song) => {
  const duration = song.isLive ? "LIVE" : song.formattedDuration;
  queue.textChannel?.send(`✅ Added to queue: **${song.name}** — \`${duration}\``);
});

distube.on("finish", (queue) => {
  queue.textChannel?.send("🏁 Queue finished — no more songs to play.");
  scheduleIdleDisconnect(queue.id);
});

distube.on("disconnect", (queue) => {
  clearIdleDisconnect(queue.id);
});

distube.on("error", (error, queue, song) => {
  console.error(`DisTube error${song ? ` (${song.name})` : ""}:`, error);
});


// ── Login ─────────────────────────────────────────────────────
client.login(process.env.DISCORD_TOKEN);
