import { ItemStack } from "@script-api/server.js"

const loot = {
	item: 'minecraft:quartz',
	amount: () => Math.floor(Math.random()*6) || 1
};

export default function ghastDropQuartz(event) {
	if (event.deadEntity.typeId !== 'minecraft:ghast') return;

	if (Math.floor(Math.random()*2) == 0) return;
	// Drop
	let item = new ItemStack(loot.item, loot.amount());
	event.deadEntity.dimension.spawnItem(item, event.deadEntity.location);
}

ghastDropQuartz.packet = 'entityDie';