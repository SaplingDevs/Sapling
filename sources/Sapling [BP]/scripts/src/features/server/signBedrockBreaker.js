import { system, ItemStack } from "@script-api/server.js"

const DIRECTIONS =  { Up: 'above', Down: 'below', North: 'north', South: 'south', East: 'east', West: 'west' };
const PLACE_DIRECTIONS = { North: 2, South: 3, East: 5, West: 4 }

export default function signBedrockBreaker(event) {
	const { itemStack, source, block, blockFace } = event;
	
	const id = itemStack.typeId;
	const isSign = id.includes('sign') && !id.includes('hand');
	const validBlock = block.typeId.includes('sign');
	if (!isSign || !validBlock) return;
		
	const face = DIRECTIONS[blockFace];
	const _b = block[face](1);
	if (!source.isSneaking) return;
		
	const inv = source.getComponent('inventory').container;
	event.cancel = true;
	system.run(() => {
		_b.setType('minecraft:air');
		placeSign(itemStack.typeId, _b, blockFace);
		removeSign(inv, source.selectedSlotIndex, itemStack);
	});
}

signBedrockBreaker.packet = 'before::itemUseOn';

function placeSign(id, block, face) {
	const { x, y, z } = block.location;
	const place = PLACE_DIRECTIONS[face];
	const signType = id.includes('oak') 
		? 'wall_sign'
		: id.replace('_', '_wall_');
	
	const cmd = `setblock ${x} ${y} ${z} ${signType} ["facing_direction": ${place}]`;
	block.dimension.runCommand(cmd);
}

function removeSign(inv, slot) {
	const item = inv.getItem(slot)
	const amount = item?.amount - 1;

	inv.setItem(slot, amount > 0 ? new ItemStack(item.typeId, amount ? amount : 1) : null);
}