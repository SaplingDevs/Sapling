import { ItemStack } from "@script-api/server.js";
import { Utils } from "@script-api/sapling.js";

export default function tntDispenserRefill(event) {
    if (event.entity.typeId != 'minecraft:tnt') return;
	
	const { dimension, location } = event.entity;
	const _b = dimension.getBlock(location);
	const blocks = [ 'up', 'down', 'north', 'south', 'east', 'west']
		.map(side => Utils.blockStep(_b, side, side === 'up' ? 2 : 1))
		.filter(b => b.typeId == 'minecraft:dispenser');
		
	blocks.forEach((b) => {
		const inv = b.getComponent('inventory').container;
		const item = new ItemStack('minecraft:tnt', 1);
		inv.addItem(item);
	});
}

tntDispenserRefill.packet = 'entitySpawn'