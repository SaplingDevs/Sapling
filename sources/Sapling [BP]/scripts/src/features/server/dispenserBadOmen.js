import { Utils } from "@script-api/sapling.js";

export default function dispenserBadOmen(event) {
	if (event.entity.typeId !== 'minecraft:item') return;
	else if (!event.entity.hasComponent('item')) return;

	const item = event.entity.getComponent('item').itemStack;
	
	if (item.typeId !== 'minecraft:ominous_bottle') return;
	else if (item.amount > 1) return;
	
	
	const _b = event.entity.dimension.getBlock(event.entity.location);
	
	const blocks = [ 'up', 'down', 'north', 'south', 'east', 'west']
		.map(side => Utils.blockStep(_b, side))
		.filter(b => b.typeId == 'minecraft:dispenser');
	
	if (blocks.length <= 0) return;
	
	event.entity.runCommand('effect @a[r=8] raid_omen 6000');
	event.entity.runCommand('summon splash_potion ~~~');
	
	event.entity.kill();
}

dispenserBadOmen.packet = 'entitySpawn';