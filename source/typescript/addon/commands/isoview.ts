import { system, world } from "@minecraft/server";
import { IsoViewForm } from "addon/modals/IsoViewForm";
import { CommandOrigin, CommandParamType, CommandResult, CommandStatus, PermissionLevel, Vec3 } from "types";
import { Vector3 } from "~/server";
import { CommandBuilder } from "~/server/Command";

new CommandBuilder()
  .setName("sapling:isoview")
  .setDescription("sapling.help.command.isoview")
  .requireCheats(false)
  .addMandatoryParameter({ name: "Pos1", type: CommandParamType.Location })
  .addMandatoryParameter({ name: "Pos2", type: CommandParamType.Location })
  .setPermissionLevel(PermissionLevel.Any)
  .setCallback(IsoViewCallback)
  .build();

function IsoViewCallback(origin: CommandOrigin, Pos1: Vec3, Pos2: Vec3): CommandResult {
  if (origin.sourceType !== "Entity") return { status: CommandStatus.Failure };

  const source = world.getAllPlayers().find(p => p.id === origin.sourceEntity.id);
  if (!source) return { status: CommandStatus.Failure };

  const [ x1, x2 ] = Pos1.x < Pos2.x ? [Pos1.x, Pos2.x] : [Pos2.x, Pos1.x];
  const [ y1, y2 ] = Pos1.y < Pos2.y ? [Pos1.y, Pos2.y] : [Pos2.y, Pos1.y];
  const [ z1, z2 ] = Pos1.z < Pos2.z ? [Pos1.z, Pos2.z] : [Pos2.z, Pos1.z];

  const Loc1 = new Vector3(x1, y1, z1);
  const Loc2 = new Vector3(x2 + 1, y2, z2 + 1);

  // @ts-ignore
  system.run(() => IsoViewForm(source, Loc1, Loc2));

  return { status: CommandStatus.Success };
}
