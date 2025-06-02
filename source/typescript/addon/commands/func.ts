import { system, world } from "@minecraft/server";
import { Utils } from "classes/Utils";
import { ClientFeatures } from "config/gamerules";
import { CommandOrigin, CommandParamType, CommandResult, CommandStatus, PermissionLevel } from "types";
import { CommandBuilder, EnumBuilder } from "~/server/Command";

new CommandBuilder()
  .setName("sapling:func")
  .setDescription("sapling.help.command.func")
  .requireCheats(false)
  .setPermissionLevel(PermissionLevel.Any)
  .addMandatoryParameter({ name: "sapling:client_features", type: CommandParamType.Enum })
  .addMandatoryParameter({ name: "value", type: CommandParamType.Boolean })
  .setCallback(SaplingCallback)
  .build();

const ClientEnum = ClientFeatures.getNormalizedRules();
new EnumBuilder("sapling:client_features", Object.values(ClientEnum));

function SaplingCallback(origin: CommandOrigin, feature: string, value: boolean): CommandResult {
  if (origin.sourceType !== "Entity") return;
  
  const source = world.getAllPlayers().filter(p => p.id === origin.sourceEntity.id)[0];
  if (!source) return;

  system.run(() => source[value ? "addTag" : "removeTag"](`client:${feature}`));

  source.sendMessage(Utils.RawTextBuilder([
    { text: '§7[§l§2Sapling§r§7] '},
    { translate: `sapling.base.${value ? 'enabled' : 'disabled'}`, with: [ feature ] }
  ]));

  return { status: CommandStatus.Success };
}