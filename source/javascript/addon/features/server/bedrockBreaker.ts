import { EntitySpawnAfterEvent, system, ItemStack, Block, Container, PlayerInteractWithBlockBeforeEvent } from "@minecraft/server";
import { Utils } from "classes/Utils";
import { ServerFeatures } from "config/gamerules";
import { Vector3 } from "~/server";


export async function anvilBedrockBreaker(Event: EntitySpawnAfterEvent){
  const Enabled = ServerFeatures.DataBase.get("anvilbedrockbreaker");
  if (!Enabled) return;

  if (Event.entity.typeId != 'minecraft:falling_block') return;
	
	const { location, dimension } = Event.entity
	const loc = {
		x: Math.floor(location.x),
		y: Math.floor(location.y),
		z: Math.floor(location.z)
	}
		
	await system.waitTicks(7);
		
	const b = dimension.getBlock(loc);
	if (b.typeId != 'minecraft:anvil') return;
		
  system.run(() => {
    if (Utils.getBlockFromBase(b,[1,-1,0]).typeId.includes('arm_collision')) Utils.getBlockFromBase(b,[1,-2,0]).setType('minecraft:air')
    if (Utils.getBlockFromBase(b,[-1,-1,0]).typeId.includes('arm_collision')) Utils.getBlockFromBase(b,[-1,-2,0]).setType('minecraft:air')
    if (Utils.getBlockFromBase(b,[0,-1,1]).typeId.includes('arm_collision')) Utils.getBlockFromBase(b,[0,-2,1]).setType('minecraft:air')
    if (Utils.getBlockFromBase(b,[0,-1,-1]).typeId.includes('arm_collision')) Utils.getBlockFromBase(b,[0,-2,-1]).setType('minecraft:air')
  });
}


export default function signBedrockBreaker(Event: PlayerInteractWithBlockBeforeEvent) {
	if(!Event.isFirstEvent) return;
	
	const { itemStack, player, block, blockFace } = Event;
	
  if (!itemStack) return;

	const id = itemStack.typeId;
	const isSign = id.includes('sign') && !id.includes('hand');
	const validBlock = block.typeId.includes('sign');
	if (!isSign || !validBlock) return;
		
	const face = DIRECTIONS[blockFace];
	const _b = block[face](1);
	if (!player.isSneaking) return;
		
	const inv = player.getComponent('inventory').container;
	Event.cancel = true;

	system.run(() => {
		_b.setType('minecraft:air');
		placeSign(itemStack.typeId, _b, blockFace);
		removeSign(inv, player.selectedSlotIndex);
	});
}


export function cauldronBedrockBreaker(Event: PlayerInteractWithBlockBeforeEvent){
  const Enabled = ServerFeatures.DataBase.get("anvilbedrockbreaker");
  if (!Enabled) return;

  const { itemStack, block } = Event;
  if (!itemStack) return;
	
	const liquid = block.permutation.getState('cauldron_liquid');
	if (itemStack.typeId != 'minecraft:powder_snow_bucket') return;
	else if (block.typeId != 'minecraft:cauldron') return;
	else if (liquid != 'powder_snow') return;
		
	const { x, y, z } = block.location;
	let b = block.dimension.getBlock(new Vector3(x,y+1,z));
    
  system.run(() => b.setType('powder_snow'));
}

// Extra
const DIRECTIONS =  { Up: 'above', Down: 'below', North: 'north', South: 'south', East: 'east', West: 'west' };
const PLACE_DIRECTIONS = { North: 2, South: 3, East: 5, West: 4 }

function placeSign(id: string, block: Block, face: string) {
	const { x, y, z } = block.location;
	const place = PLACE_DIRECTIONS[face];
	const signType = id.includes('oak') 
		? 'wall_sign'
		: id.replace('_', '_wall_');
	
	const cmd = `setblock ${x} ${y} ${z} ${signType} ["facing_direction" = ${place}]`;
	try { block.dimension.runCommand(cmd); } catch {}
}

function removeSign(inv: Container, slot: number) {
  const item = inv.getItem(slot)
	const amount = item?.amount - 1;

	inv.setItem(slot, amount > 0 ? new ItemStack(item.typeId, amount ? amount : 1) : null);
}