import type { CustomCommand, CustomCommandOrigin, CustomCommandResult } from "@minecraft/server";

export type Vec3 = { 
  x: number;
  y: number;
  z: number;
}

export type BlockStepLocation = "north"|"south"|"east"|"west"|"below"|"above"

export type LootType = {
  item: string;
  amount: () => number;
};

export type CommandResultOrigin = (origin: CustomCommandOrigin, ...args: any[]) => CustomCommandResult | undefined
export type CommandList = Map<string, { command: CustomCommand, callback: CommandResultOrigin }>

export { 
  CommandPermissionLevel as PermissionLevel, 
  CustomCommandOrigin as CommandOrigin, 
  CustomCommandParameter as CommandParameter, 
  CustomCommandParamType as CommandParamType,
  CustomCommandResult as CommandResult,
  CustomCommandStatus as CommandStatus
} from "@minecraft/server";