import {
  CommandDispatcher,
  literal,
  argument,
  type CommandContext,
  type ArgumentType} from "../~/brigadier";

export class CommandBuilder {
  private name!: string;
  private args: { name: string, type: ArgumentType<any> }[] = [];
  private description: string;
  private callback!: (ctx: CommandContext<any>) => void;

  static __dispatcher = new CommandDispatcher();

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

  setCallback(callback: (ctx: CommandContext<any>) => void) {
    this.callback = callback;
    return this;
  }

  private build() {
    if (!this.name || !this.callback) throw new Error("Missing name or callback");
  
    if (this.args.length === 0) {
      return literal(this.name).executes(this.callback);
    }
  
    let chain = argument(this.args.at(-1)!.name, this.args.at(-1)!.type)
      .executes(this.callback);
  
    for (let i = this.args.length - 2; i >= 0; i--) {
      const arg = this.args[i];
      chain = argument(arg.name, arg.type).then(chain);
    }
  
    return literal(this.name).then(chain);
  }
  

  register() {
    CommandBuilder.__dispatcher.register(this.build());
  }


  // Public method
  static execute(input: string) {
    CommandBuilder.__dispatcher.execute(input, null);
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