import { Player } from "@minecraft/server";
import { 
  CommandBuilder, 
  CommandContext, 
  BoolArgumentType, 
  StringArgumentType
} from "../classes/Command";

new CommandBuilder()
  .setName("sapling")
  .setDescription("sapling.help.command.sapling")
  .setArg("feature", new StringArgumentType("single_word"))
  .setArg("enabled", new BoolArgumentType())
  .setCallback(SaplingCommandCallback)
  .register();

function SaplingCommandCallback(ctx: CommandContext<any>, sender: Player) {
  const feature = ctx.get("feature").toLowerCase();
  const enabled = ctx.get("enabled");

  sender.sendMessage(`Sapling: ${feature} ${enabled}`);
}