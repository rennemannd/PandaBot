import "dotenv/config";
import { REST, Routes } from "discord.js";
import { loadCommands } from "./utils/load-commands";

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error("Missing DISCORD_TOKEN, CLIENT_ID, or GUILD_ID in .env");
  process.exit(1);
}

const commands = loadCommands();
const payload = commands.map((c) => c.data.toJSON());

const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

(async () => {
  try {
    console.log(`Registering ${payload.length} slash command(s)…`);

    // Guild-scoped commands update instantly (good for dev).
    // Switch to Routes.applicationCommands(CLIENT_ID) for global deploy.
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: payload,
    });

    console.log("✅ Commands registered successfully.");
  } catch (err) {
    console.error(err);
  }
})();
