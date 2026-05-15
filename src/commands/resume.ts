import { SlashCommandBuilder, GuildMember } from "discord.js";
import { BotCommand } from "../types/command";

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resume the paused song"),

  async execute(interaction, distube) {
    const member = interaction.member as GuildMember;
    const queue = distube.getQueue(member.guild.id);

    if (!queue) {
      await interaction.reply({ content: "Nothing is playing.", ephemeral: true });
      return;
    }

    if (!queue.paused) {
      await interaction.reply({ content: "Not paused.", ephemeral: true });
      return;
    }

    distube.resume(member.guild.id);
    await interaction.reply("▶️ Resumed.");
  },
};

export default command;
