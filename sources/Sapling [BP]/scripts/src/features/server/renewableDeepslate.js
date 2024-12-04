import { PistonDirections, PistonAssets } from '@script-api/vanilla-data.js'
import { system, Vector3 } from "@script-api/server.js";

export default async function renewableDeepslate({ piston }) {
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
	
	await system.sleep(50)
	
	const Basalt = Blocks
		.map(loc => PistonBlock.dimension.getBlock(loc))
		
	for (const block of Basalt) {
		const { typeId, location } = block;
		const IsDeepslatePerm = typeId === 'minecraft:basalt' && location.y < 0;
		
		if (IsDeepslatePerm) block.setType('minecraft:deepslate');
	}
}

renewableDeepslate.packet = 'pistonActivate'