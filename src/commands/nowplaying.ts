import { SlashCommandBuilder, GuildMember } from "discord.js";
import { BotCommand } from "../types/command";

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Show the currently playing song"),

  async execute(interaction, distube) {
    const member = interaction.member as GuildMember;
    const queue = distube.getQueue(member.guild.id);

    if (!queue || !queue.songs[0]) {
      await interaction.reply({ content: "Nothing is playing right now.", ephemeral: true });
      return;
    }

    const song = queue.songs[0];
    const bar = createProgressBar(queue.currentTime, song.duration);

    await interaction.reply(
      [
        `🎵 **Now playing:** ${song.name}`,
        `${formatTime(queue.currentTime)} ${bar} ${song.formattedDuration}`,
        song.url ? `🔗 ${song.url}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    );
  },
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function createProgressBar(current: number, total: number): string {
  const length = 20;
  const filled = Math.round((current / total) * length);
  return "▬".repeat(filled) + "🔘" + "▬".repeat(length - filled);
}

export default command;
