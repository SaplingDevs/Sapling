import { ItemStack } from "@script-api/server.js"

const loot = {
	item: 'minecraft:gravel',
	amount: () => 1
};

export default function silverfishDropGravel(event) {
	if (event.deadEntity.typeId !== 'minecraft:silverfish') return;

	if (Math.floor(Math.random()*2) == 0) return;
	// Drop
	let item = new ItemStack(loot.item, loot.amount());
	event.deadEntity.dimension.spawnItem(item, event.deadEntity.location);
}

silverfishDropGravel.packet = 'entityDie';