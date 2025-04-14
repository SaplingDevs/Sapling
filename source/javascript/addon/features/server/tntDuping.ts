import { EntitySpawnAfterEvent, ItemStack } from "@minecraft/server";
import { ServerFeatures } from "config/gamerules"
import { Utils } from "classes/Utils";
import { BlockStepLocation } from "types";

export function tntDuping(Event: EntitySpawnAfterEvent) {
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

export function tntDispenserRefill(Event: EntitySpawnAfterEvent) {
  if (Event.entity.typeId != 'minecraft:tnt') return;

const { dimension, location } = Event.entity;
const _b = dimension.getBlock(location);
const blocks = [ 'up', 'down', 'north', 'south', 'east', 'west']
  .map(side => Utils.blockStep(_b, side as BlockStepLocation, side === 'up' ? 2 : 1))
  .filter(b => b.typeId == 'minecraft:dispenser');
  
blocks.forEach((b) => {
  const inv = b.getComponent('inventory').container;
  const item = new ItemStack('minecraft:tnt', 1);
  inv.addItem(item);
});
}