import { PistonDirections, PistonAssets } from '@script-api/vanilla-data.js'
import { system, Vector3 } from "@script-api/server.js";
import { Utils } from '@script-api/sapling.js';

export default async function pistonSpongeDrying({ piston }) {
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

    const Sponges = Blocks
		.map(loc => PistonBlock.dimension.getBlock(loc))
		.filter(b => b.typeId == 'minecraft:wet_sponge');
		
	for (const sponge of Sponges) {
		sponge.setType('minecraft:sponge');
	}
}

pistonSpongeDrying.packet = 'pistonActivate';