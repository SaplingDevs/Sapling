import { EntitySpawnAfterEvent } from "@minecraft/server";
import { ServerFeatures } from "config/gamerules"
import { Utils } from "classes/Utils";
import { BlockStepLocation } from "types";

export default function tntDuping(Event: EntitySpawnAfterEvent) {
  if (Event.entity.typeId !== 'minecraft:tnt') return;
  else if (ServerFeatures.DataBase.get("tntduping")) return

  const { dimension, location } = Event.entity;
  const block = dimension.getBlock(location);
  const sides = ['north', 'south', 'east', 'west', 'up', 'down']
    .map((side) => Utils.blockStep(block, side as BlockStepLocation).typeId);

  if (!sides.includes('minecraft:noteblock')) return;

  block.setType('minecraft:tnt');
  Event.entity.runCommand('tp ~~-1~');
}