import "dotenv/config";
import { REST, Routes } from "discord.js";
import { loadCommands } from "./utils/load-commands";

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID, NODE_ENV } = process.env;
const isProd = NODE_ENV === "production";

if (!DISCORD_TOKEN || !CLIENT_ID) {
  console.error("Missing DISCORD_TOKEN or CLIENT_ID in .env");
  process.exit(1);
}

if (!isProd && !GUILD_ID) {
  console.error("Missing GUILD_ID in .env (required when NODE_ENV !== 'production')");
  process.exit(1);
}

const commands = loadCommands();
const payload = commands.map((c) => c.data.toJSON());

const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

(async () => {
  try {
    const route = isProd
      ? Routes.applicationCommands(CLIENT_ID)
      : Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID!);

    console.log(
      `Registering ${payload.length} slash command(s) ${isProd ? "globally" : `to guild ${GUILD_ID}`}…`,
    );

    await rest.put(route, { body: payload });

    console.log("✅ Commands registered successfully.");
    if (isProd) console.log("Note: global commands can take up to an hour to propagate.");
  } catch (err) {
    console.error(err);
  }
})();
