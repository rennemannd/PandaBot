import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import { join } from "path";
import { BotCommand } from "../types/command";

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("riley")
    .setDescription("Riley."),

  async execute(interaction) {
    const file = new AttachmentBuilder(join(__dirname, "..", "images", "fuck_riley.png"));
    await interaction.reply({ files: [file] });
  },
};

export default command;
