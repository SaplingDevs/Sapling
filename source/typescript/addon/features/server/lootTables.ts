import { EntityDieAfterEvent, ItemStack } from "@minecraft/server";
import { ServerFeatures } from "config/gamerules";
import { LootType } from "types";

const LootBuilder = (item: string, amount: () => number): LootType => ({ item, amount });

export function silverfishDropGravel(Event: EntityDieAfterEvent) {
  if (!ServerFeatures.DataBase.get("silverfishdropgravel")) return;
  else if (Event.deadEntity.typeId !== 'minecraft:silverfish') return;
  else if (Math.floor(Math.random()*2) == 0) return;
	// Drop
  const loot = LootBuilder("minecraft:gravel", () => 1);

	let item = new ItemStack(loot.item, loot.amount());
	Event.deadEntity.dimension.spawnItem(item, Event.deadEntity.location);
}

export function guardianDropSponges(Event: EntityDieAfterEvent) {
  if (!ServerFeatures.DataBase.get("guardiandropsponges")) return;
  else if (Event.deadEntity.typeId !== 'minecraft:guardian') return;
  else if (Math.floor(Math.random()*2) == 0) return;
	// Drop
  const loot = LootBuilder("minecraft:wet_sponge", () => 1);

	let item = new ItemStack(loot.item, loot.amount());
	Event.deadEntity.dimension.spawnItem(item, Event.deadEntity.location);
}

export function ghastDropQuartz(Event: EntityDieAfterEvent) {
  if (!ServerFeatures.DataBase.get("ghastdropquartz")) return;
  else if (Event.deadEntity.typeId !== 'minecraft:ghast') return;
  else if (Math.floor(Math.random()*2) == 0) return;
	// Drop
  const loot = LootBuilder("minecraft:quartz", () => Math.floor(Math.random()*6) || 1);

	let item = new ItemStack(loot.item, loot.amount());
	Event.deadEntity.dimension.spawnItem(item, Event.deadEntity.location);
}

export function huskDropSand(Event: EntityDieAfterEvent) {
  if (!ServerFeatures.DataBase.get("huskdropsand")) return;
  else if (Event.deadEntity.typeId !== 'minecraft:husk') return;
  else if (Math.floor(Math.random()*2) == 0) return;
	// Drop
  const loot = LootBuilder("minecraft:sand", () => Math.floor(Math.random()*4) || 1);

	let item = new ItemStack(loot.item, loot.amount());
	Event.deadEntity.dimension.spawnItem(item, Event.deadEntity.location);
}