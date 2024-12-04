import { ItemStack } from "@script-api/server.js"

const loot = {
	item: 'minecraft:sponge',
	amount: () => 1
};

export default function guardianDropSponges(event) {
	if (event.deadEntity.typeId !== 'minecraft:guardian') return;

	if (Math.floor(Math.random()*2) == 0) return;
	// Drop
	let item = new ItemStack(loot.item, loot.amount());
	event.deadEntity.dimension.spawnItem(item, event.deadEntity.location)
}

guardianDropSponges.packet = 'entityDie';