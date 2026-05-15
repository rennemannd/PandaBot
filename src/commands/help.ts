import { SlashCommandBuilder } from "discord.js";
import { BotCommand } from "../types/command";
import { loadCommands } from "../utils/load-commands";

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("List all available commands"),

  async execute(interaction) {
    const commands = loadCommands();

    const lines = commands.map(
      (cmd) => `**/${cmd.data.name}** — ${cmd.data.description}`,
    );

    await interaction.reply({
      content: `Here's what I can do:\n\n${lines.join("\n")}`,
      ephemeral: true,
    });
  },
};

export default command;
