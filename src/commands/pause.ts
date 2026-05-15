import { SlashCommandBuilder, GuildMember } from "discord.js";
import { BotCommand } from "../types/command";

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause the current song"),

  async execute(interaction, distube) {
    const member = interaction.member as GuildMember;
    const queue = distube.getQueue(member.guild.id);

    if (!queue) {
      await interaction.reply({ content: "Nothing is playing.", ephemeral: true });
      return;
    }

    if (queue.paused) {
      await interaction.reply({ content: "Already paused. Use /resume.", ephemeral: true });
      return;
    }

    distube.pause(member.guild.id);
    await interaction.reply("⏸ Paused.");
  },
};

export default command;
