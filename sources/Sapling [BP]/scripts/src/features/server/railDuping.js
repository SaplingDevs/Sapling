import { PistonDirections, PistonAssets } from '@script-api/vanilla-data.js'
import { system, Vector3 } from "@script-api/server.js";
import { Utils } from '@script-api/sapling.js';

export default async function railDuping({ piston }) {
    const State = piston.state;
	const PistonBlock = piston.block;
	const Facing = PistonDirections[PistonBlock.permutation.getState('facing_direction')];
	const Assets = PistonAssets[`${Facing}:${State}`];
	const Locations = piston.getAttachedBlocksLocations()
	const Blocks = [];
	
	for (const loc of Locations) {
		const BlockLoc = new Vector3(
			loc.x + Assets[0], 
			loc.y + Assets[1],
			loc.z + Assets[2]
		);
		
		Blocks.push(BlockLoc);
	}
	
	await system.sleep(50);
	
	const Rails = Blocks
		.map(loc => PistonBlock.dimension.getBlock(loc))
		.filter(b => b.typeId.includes('rail'));
		
	for (const rail of Rails) {
		const sides = [ 'up', 'down', 'north', 'south', 'east', 'west' ]
			.map(dir => Utils.blockStep(rail, dir).typeId);
			
		if (!sides.includes('minecraft:bell')) continue;
		
		const ItemStack = rail.getItemStack();
		rail.dimension.spawnItem(ItemStack, rail.location);
	}
}

railDuping.packet = 'pistonActivate';