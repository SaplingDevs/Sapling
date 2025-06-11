import { system, world } from "@minecraft/server";
import { FakeplayerManager } from "addon/modals/FakeplayerForm";
import { CommandOrigin, CommandResult, CommandStatus, PermissionLevel } from "types";
import { CommandBuilder } from "~/server/Command";

new CommandBuilder()
  .setName("sapling:fakeplayer")
  .setDescription("sapling.help.command.fakeplayer")
  .requireCheats(false)
  .setPermissionLevel(PermissionLevel.GameDirectors)
  .setCallback(FakeplayerCallback)
  .build();

function FakeplayerCallback(origin: CommandOrigin): CommandResult {
  if (origin.sourceType !== "Entity") return;
  
  const source = world.getAllPlayers().filter(p => p.id === origin.sourceEntity.id)[0];
  if (!source) return;

  // @ts-ignore
  system.run(() => FakeplayerManager(source));

  return { status: CommandStatus.Success };
}