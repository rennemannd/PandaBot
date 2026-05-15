import { SlashCommandBuilder, GuildMember } from "discord.js";
import { BotCommand } from "../types/command";

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip the current song"),

  async execute(interaction, distube) {
    const member = interaction.member as GuildMember;
    const queue = distube.getQueue(member.guild.id);

    if (!queue) {
      await interaction.reply({ content: "Nothing is playing.", ephemeral: true });
      return;
    }

    if (queue.songs.length <= 1) {
      await distube.stop(member.guild.id);
      await interaction.reply("⏭ Skipped — queue is now empty.");
    } else {
      await distube.skip(member.guild.id);
      await interaction.reply("⏭ Skipped!");
    }
  },
};

export default command;
