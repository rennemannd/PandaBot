import { SlashCommandBuilder, GuildMember } from "discord.js";
import { RepeatMode } from "distube";
import { BotCommand } from "../types/command";

const MODE_LABELS: Record<number, string> = {
  [RepeatMode.DISABLED]: "off",
  [RepeatMode.SONG]: "current song 🔂",
  [RepeatMode.QUEUE]: "entire queue 🔁",
};

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Cycle loop mode: off → song → queue → off")
    .addStringOption((o) =>
      o
        .setName("mode")
        .setDescription("Loop mode")
        .setRequired(false)
        .addChoices(
          { name: "Off", value: "off" },
          { name: "Song", value: "song" },
          { name: "Queue", value: "queue" },
        ),
    ),

  async execute(interaction, distube) {
    const member = interaction.member as GuildMember;
    const queue = distube.getQueue(member.guild.id);

    if (!queue) {
      await interaction.reply({ content: "Nothing is playing.", ephemeral: true });
      return;
    }

    const choice = interaction.options.getString("mode");
    let mode: RepeatMode;

    if (choice === "off") mode = RepeatMode.DISABLED;
    else if (choice === "song") mode = RepeatMode.SONG;
    else if (choice === "queue") mode = RepeatMode.QUEUE;
    else {
      // Cycle: off → song → queue → off
      mode = (queue.repeatMode + 1) % 3;
    }

    distube.setRepeatMode(member.guild.id, mode);
    await interaction.reply(`🔄 Loop mode: **${MODE_LABELS[mode]}**`);
  },
};

export default command;
