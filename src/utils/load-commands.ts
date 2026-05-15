import { Collection } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { BotCommand } from "../types/command";

/**
 * Scans the commands/ directory and returns a Collection keyed by command name.
 * To add a new command, just drop a new .ts file in commands/ — no wiring needed.
 */
export function loadCommands(): Collection<string, BotCommand> {
  const commands = new Collection<string, BotCommand>();
  const commandsPath = join(__dirname, "..", "commands");
  const files = readdirSync(commandsPath).filter(
    (f) => f.endsWith(".ts") || f.endsWith(".js"),
  );

  for (const file of files) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(join(commandsPath, file));
    const command: BotCommand = mod.default ?? mod;

    if (!command.data || !command.execute) {
      console.warn(`⚠  Skipping ${file} — missing "data" or "execute" export.`);
      continue;
    }
    commands.set(command.data.name, command);
    console.log(`  ✔ Loaded command: /${command.data.name}`);
  }

  return commands;
}
