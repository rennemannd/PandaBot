import { SlashCommandBuilder, GuildMember } from "discord.js";
import { json } from "@distube/yt-dlp";
import { BotCommand } from "../types/command";

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song from YouTube (link or search)")
    .addStringOption((o) =>
      o
        .setName("query")
        .setDescription("YouTube URL or search terms (e.g. 'tavern music')")
        .setRequired(true),
    ),

  async execute(interaction, distube) {
    const member = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      await interaction.reply({
        content: "You need to be in a voice channel first!",
        ephemeral: true,
      });
      return;
    }

    let query = interaction.options.getString("query", true);
    await interaction.reply(`🔍 Searching for **${query}**…`);

    // yt-dlp handles search natively; resolve text queries to a URL
    // so DisTube routes through YtDlpPlugin instead of broken ytdl-core
    if (!isURL(query)) {
      const result = await json(`ytsearch:${query}`, {
        dumpSingleJson: true,
        noWarnings: true,
        skipDownload: true,
        simulate: true,
      });
      const url = result.entries?.[0]?.webpage_url ?? result.webpage_url;
      if (!url) throw new Error(`No results found for "${query}"`);
      query = url;
    }

    await distube.play(voiceChannel, query, {
      textChannel: interaction.channel ?? undefined,
      member,
    });
  },
};

function isURL(input: string): boolean {
  try {
    const url = new URL(input);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default command;
