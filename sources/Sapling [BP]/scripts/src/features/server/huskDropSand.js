import { ItemStack } from "@script-api/server.js"

const loot = {
	item: 'minecraft:sand',
	amount: () => Math.floor(Math.random()*4) || 1
};

export default function huskDropSand(event) {
	if (event.deadEntity.typeId !== 'minecraft:husk') return;

	if (Math.floor(Math.random()*2) == 0) return;
	// Drop
	let item = new ItemStack(loot.item, loot.amount());
	event.deadEntity.dimension.spawnItem(item, event.deadEntity.location);
}

huskDropSand.packet = 'entityDie';