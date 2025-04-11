import { CommandContext } from "./../brigadier";

export type Command<S> = (c: CommandContext<S>) => number | void;
