import { EntityType, EntityTypes, system, world } from "@minecraft/server";
import { Utils } from "classes/Utils";
import { CommandOrigin, CommandParamType, CommandResult, CommandStatus, PermissionLevel } from "types";
import { CommandBuilder } from "~/server/Command";

new CommandBuilder()
  .setName("sapling:render")
  .setDescription("sapling.help.command.render")
  .requireCheats(false)
  .setPermissionLevel(PermissionLevel.Any)
  .addMandatoryParameter({ name: "entity", type: CommandParamType.String })
  .addMandatoryParameter({ name: "value", type: CommandParamType.Boolean })
  .setCallback(RenderCallback)
  .build();

let EntitiesValid: string[] = [];
system.run(() => EntitiesValid = EntityTypes.getAll().map((et) => et.id));

function RenderCallback(origin: CommandOrigin, entity: string, value: boolean): CommandResult {
  if (origin.sourceType !== "Entity") return;
  
  const source = world.getAllPlayers().filter(p => p.id === origin.sourceEntity.id)[0];
  if (!source) return;

  system.run(() => {
    const EntityParts = entity.split(":");
    const EntityParsed = EntityParts.length === 1 ? `minecraft:${EntityParts[0]}` : entity;
    
    if (!EntitiesValid.includes(EntityParsed)) {
      source.sendMessage(Utils.RawTextBuilder([
        { text: '§c'},
        { translate: "sapling.error.value", with: [ EntityParsed ] }
      ]));
      return { status: CommandStatus.Failure };
    }
    
    source[!value ? "addTag" : "removeTag"](`disableRender/${EntityParsed}`);

    source.sendMessage(Utils.RawTextBuilder([
      { text: '§7[§l§eRender§r§7] '},
      { translate: `sapling.base.${value ? 'enabled' : 'disabled'}`, with: [ EntityParsed ] }
    ]));

    return { status: CommandStatus.Success };
  });
}