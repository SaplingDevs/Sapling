import { CommandBuilder, CommandContext, BoolArgumentType, StringArgumentType } from "../../classes/Command";
import { ServerFeatures } from "../../config/gamerules";
import { Utils } from "../../classes/Utils";
import { Player } from "@minecraft/server";


new CommandBuilder()
  .setName("sapling")
  .setDescription("sapling.help.command.sapling")
  .setArg("feature", new StringArgumentType("single_word"))
  .setArg("enabled", new BoolArgumentType())
  .setCallback(SaplingCommandCallback)
  .register();
  

function SaplingCommandCallback(ctx: CommandContext<any>, sender: Player) {
  const ModuleFeatures = ServerFeatures.getNormalizedRules();
  const FeatureName = ctx.get("feature").toLowerCase();
  const FeatureValue = ctx.get("enabled");

  const Feature = ModuleFeatures[FeatureName];
  const isAdmin = Utils.CheckSaplingAdmin(sender);

  if (!isAdmin) return sender.sendMessage(Utils.RawTextBuilder([{ text: "§c" }, { translate: "sapling.error.admin" }]));
  else if (!Feature) return sender.sendMessage(Utils.RawTextBuilder([{ text: "§c" }, { translate: "sapling.error.feature", with: [FeatureName] }]))

  ServerFeatures.DataBase.set(FeatureName, FeatureValue);

  sender.sendMessage(Utils.RawTextBuilder([
      { text: '§7[§l§2Sapling§r§7] '},
      { translate: `sapling.base.${FeatureValue ? 'enabled' : 'disabled'}`, with: [ Feature ] }
  ]));
}