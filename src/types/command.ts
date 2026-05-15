import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import { DisTube } from "distube";

/** Every command file must default-export an object matching this shape. */
export interface BotCommand {
  data:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder;
  execute: (
    interaction: ChatInputCommandInteraction,
    distube: DisTube,
  ) => Promise<void>;
}
