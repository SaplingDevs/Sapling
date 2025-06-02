import { system } from "@minecraft/server";
// Types
import type { CommandList } from "types";
import type { CommandPermissionLevel, CustomCommand, CustomCommandOrigin, CustomCommandParameter, CustomCommandResult } from "@minecraft/server";


export class CommandBuilder {
  // Public
  private static CommandMap: CommandList = new Map();
  static getCommands = (): CommandList => this.CommandMap;

  // Builder
  private name: string;
  private description: string;
  private permissionLevel: CommandPermissionLevel;
  private cheatsRequired: boolean = false;
  private mandatoryParameters: CustomCommandParameter[] = [];
  private optionalParameters: CustomCommandParameter[] = [];
  private callback: (origin: CustomCommandOrigin, ...args: any[]) => CustomCommandResult | undefined;

  setName(name: string): this {
    this.name = name;
    return this;
  }

  setDescription(description: string): this {
    this.description = description;
    return this;
  }

  setPermissionLevel(level: CommandPermissionLevel): this {
    this.permissionLevel = level;
    return this;
  }

  requireCheats(required: boolean): this {
    this.cheatsRequired = required;
    return this;
  }

  addMandatoryParameter(param: CustomCommandParameter): this {
    this.mandatoryParameters.push(param);
    return this;
  }

  addOptionalParameter(param: CustomCommandParameter): this {
    this.optionalParameters.push(param);
    return this;
  }

  setCallback(callback: (origin: CustomCommandOrigin, ...args: any[]) => CustomCommandResult): this {
    this.callback = callback;
    return this;
  }

  build(): void {
    const command: CustomCommand = {
      name: this.name,
      description: this.description,
      permissionLevel: this.permissionLevel,
      cheatsRequired: this.cheatsRequired,
      mandatoryParameters: this.mandatoryParameters,
      optionalParameters: this.optionalParameters
    };

    CommandBuilder.CommandMap.set(this.name, { command, callback: this.callback });
  }
}

export class EnumBuilder {
  private static EnumMap: Map<string, string[]> = new Map();
  static getEnums = (): Map<string, string[]> => this.EnumMap;

  constructor(EnumID: string, EnumValues: string[]) {
    EnumBuilder.EnumMap.set(EnumID, EnumValues);
  }
}

system.beforeEvents.startup.subscribe((init) => {
  EnumBuilder.getEnums().forEach((EnumValues, EnumID) => {
    init.customCommandRegistry.registerEnum(EnumID, EnumValues);
  });

  CommandBuilder.getCommands().forEach((cmd) => {
    init.customCommandRegistry.registerCommand(cmd.command, cmd.callback);
  });
});