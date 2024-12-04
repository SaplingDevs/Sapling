import { Utils } from "@script-api/sapling.js";
import { system } from "@script-api/server.js";

export default async function anvilBedrockBreaker(event) {
	if (event.entity.typeId != 'minecraft:falling_block') return;
	
	const { location, dimension } = event.entity
	const loc = {
		x: Math.floor(location.x),
		y: Math.floor(location.y),
		z: Math.floor(location.z)
	}
		
	await system.sleep(700);
		
	const b = dimension.getBlock(loc);
	if (b.typeId != 'minecraft:anvil') return;
		
	if (Utils.getBlockFromBase(b,[1,-1,0]).typeId.includes('arm_collision')) system.run(() => Utils.getBlockFromBase(b,[1,-2,0]).setType('minecraft:air'))
	if (Utils.getBlockFromBase(b,[-1,-1,0]).typeId.includes('arm_collision')) system.run(() => Utils.getBlockFromBase(b,[-1,-2,0]).setType('minecraft:air'))
	if (Utils.getBlockFromBase(b,[0,-1,1]).typeId.includes('arm_collision')) system.run(() => Utils.getBlockFromBase(b,[0,-2,1]).setType('minecraft:air'))
	if (Utils.getBlockFromBase(b,[0,-1,-1]).typeId.includes('arm_collision')) system.run(() => Utils.getBlockFromBase(b,[0,-2,-1]).setType('minecraft:air'))
}

anvilBedrockBreaker.packet = 'entitySpawn';