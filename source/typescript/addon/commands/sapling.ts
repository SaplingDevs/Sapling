import { world } from "@minecraft/server";
import { Utils } from "classes/Utils";
import { ServerFeatures } from "config/gamerules";
import { CommandOrigin, CommandParamType, CommandResult, CommandStatus, PermissionLevel } from "types";
import { CommandBuilder, EnumBuilder } from "~/server/Command";

new CommandBuilder()
  .setName("sapling:sapling")
  .setDescription("sapling.help.command.sapling")
  .requireCheats(false)
  .setPermissionLevel(PermissionLevel.GameDirectors)
  .addMandatoryParameter({ name: "sapling:server_features", type: CommandParamType.Enum })
  .addMandatoryParameter({ name: "value", type: CommandParamType.Boolean })
  .setCallback(SaplingCallback)
  .build();

const ServerEnum = ServerFeatures.getNormalizedRules();
new EnumBuilder("sapling:server_features", Object.values(ServerEnum));

function SaplingCallback(origin: CommandOrigin, feature: string, value: boolean): CommandResult {
  const RawFeature = feature.toLowerCase();
  console.log(feature, value)

  ServerFeatures.DataBase.set(RawFeature, value);

  world.sendMessage(Utils.RawTextBuilder([
    { text: '§7[§l§2Sapling§r§7] '},
    { translate: `sapling.base.${value ? 'enabled' : 'disabled'}`, with: [ feature ] }
  ]));

  return { status: CommandStatus.Success };
}