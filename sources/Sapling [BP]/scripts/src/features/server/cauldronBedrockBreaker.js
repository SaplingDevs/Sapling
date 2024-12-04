import { system, Vector3 } from "@script-api/server.js"

export default function cauldronBedrockBreaker(event) {
    const { itemStack, block } = event;
	
	const liquid = block.permutation.getState('cauldron_liquid');
	if (itemStack.typeId != 'minecraft:powder_snow_bucket') return;
	else if (block.typeId != 'minecraft:cauldron') return;
	else if (liquid != 'powder_snow') return;
		
	const { x, y, z } = block.location;
	let b = block.dimension.getBlock(new Vector3(x,y+1,z));
    
    system.run(() => b.setType('powder_snow'));
}

cauldronBedrockBreaker.packet = 'before::itemUseOn'