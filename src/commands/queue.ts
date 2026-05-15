import { SlashCommandBuilder, GuildMember } from "discord.js";
import { BotCommand } from "../types/command";

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Show the current song queue"),

  async execute(interaction, distube) {
    const member = interaction.member as GuildMember;
    const queue = distube.getQueue(member.guild.id);

    if (!queue || queue.songs.length === 0) {
      await interaction.reply({ content: "The queue is empty.", ephemeral: true });
      return;
    }

    const current = queue.songs[0];
    const upcoming = queue.songs
      .slice(1, 11)
      .map((s, i) => `\`${i + 1}.\` **${s.name}** — \`${s.formattedDuration}\``)
      .join("\n");

    const lines = [
      `🎵 **Now playing:** ${current.name} — \`${current.formattedDuration}\``,
    ];

    if (upcoming) {
      lines.push("", "**Up next:**", upcoming);
    }

    if (queue.songs.length > 11) {
      lines.push(`\n…and ${queue.songs.length - 11} more`);
    }

    await interaction.reply(lines.join("\n"));
  },
};

export default command;
