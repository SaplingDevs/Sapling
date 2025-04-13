import { Player, world } from "@minecraft/server";
import {
  CommandDispatcher,
  literal,
  argument,
  type CommandContext,
  type ArgumentType,
  StringArgumentType,
} from "../~/brigadier";

export class CommandBuilder {
  static __commands: Map<string, CommandBuilder> = new Map();

  name!: string;
  description: string;
  
  private args: { name: string, type: ArgumentType<any> }[] = [];
  private callback!: (ctx: CommandContext<any>|null) => void;
  private dispatcher = new CommandDispatcher();

  // Build methods
  setName(name: string) {
    this.name = name;
    return this;
  }

  setDescription(name: string) {
    this.description = name;
    return this;
  }

  setArg(name: string, type: ArgumentType<any>) {
    this.args.push({ name, type });
    return this;
  }

  setCallback(callback: (ctx: CommandContext<any>, sender: Player) => void) {
    this.callback = (ctx: CommandContext<any>) => {
      const PlayerID = ctx.get("@player_id").replace("@", "").replaceAll("%20", " ");
      const Sender = world.getPlayers({ name: PlayerID })[0];

      callback(ctx, Sender);
    };

    return this;
  }

  private build() {
    if (!this.name || !this.callback) throw new Error("Missing name or callback");

    let chain = argument(this.args.at(-1)!.name, this.args.at(-1)!.type)
      .executes(this.callback);
  
    for (let i = this.args.length - 2; i >= 0; i--) {
      const arg = this.args[i];
      chain = argument(arg.name, arg.type).then(chain);
    }
  
    return literal(this.name).then(chain)
  }
  

  register() {
    this.setArg("@player_id", new StringArgumentType("quotable_phrase"));

    CommandBuilder.__commands.set(this.name, this)
    this.dispatcher.register(this.build());
  }


  // Public method
  execute(input: string) {
    this.dispatcher.execute(input, null)
  }
}

export { 
  BoolArgumentType, 
  NumberArgumentType,
  FloatArgumentType,
  ArgumentType,
  LongArgumentType,
  ParsedArgument,
  StringArgumentType,
  StringRange,
  StringReader,
  IntegerArgumentType,
  RequiredArgumentBuilder,
  LiteralArgumentBuilder,
  CommandContext
} from "./../~/brigadier"