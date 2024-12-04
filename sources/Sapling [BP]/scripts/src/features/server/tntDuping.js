import { Utils } from "@script-api/sapling.js";

export default function tntDuping(event) {
    if (event.entity.typeId !== 'minecraft:tnt') return;
	
	const { dimension, location } = event.entity;
	const block = dimension.getBlock(location);
	const sides = ['north', 'south', 'east', 'west', 'up', 'down']
		.map((side) => Utils.blockStep(block, side).typeId);
	
	if (!sides.includes('minecraft:noteblock')) return;
	
	block.setType('minecraft:tnt');
	event.entity.runCommand('tp ~~-1~');
}

tntDuping.packet = 'entitySpawn'