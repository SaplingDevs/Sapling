import { system, packet, ItemStack } from "@script-api/server.js";


let BrokenEvents = [];
system.interval(() => BrokenEvents = []);

packet.on('playerBreakBlock', (ev) => {
    if (ev.player.getGameMode() === 'creative') return;
	BrokenEvents.push(ev);
});

packet.on('entitySpawn', (ev) => {
	// Closures
	if (ev.entity.typeId !== 'minecraft:item' || ev.cause !== 'Spawned') return;
	
	// Feature
	const item = ev.entity;
	const brokenEvent = BrokenEvents.find(be => calcDistance(be.block.location, item.location) < 7);
	if (!brokenEvent || !brokenEvent.player.hasTag('client:itemMagnet')) return;
	
	const ItemStack = item.getComponent('item').itemStack;
	const Inventory = brokenEvent.player.getComponent('inventory').container;
	
	if (canAdd(Inventory, ItemStack)) {
		Inventory.addItem(ItemStack)
		item.remove();
	}
});

function canAdd(inventory, itemStack) {
	if (inventory.emptySlotsCount !== 0) return true;
	
	for (let i = 0; i < inventory.size; i++) {
		const slot = inventory.getSlot(i);
		if (slot.hasItem() && slot.isStackableWith(itemStack) && isWithinStackSize(slot, itemStack)) return true;
	}
	
	return false;
}

function isWithinStackSize(slot, itemStack) {
	return slot.amount + itemStack.amount <= slot.maxAmount;
}

function magnitude(vector) {
	return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
}

function calcDistance(posA, posB) {
	let direction = {
		x: posA.x - posB.x,
		y: posA.y - posB.y,
		z: posA.z - posB.z
	};
	
	return magnitude(direction);
}