import { system } from "@minecraft/server";
import type { PlayerBreakBlockBeforeEvent } from "@minecraft/server";

// Smart Hoe
const CropsData = {
	'minecraft:wheat_seeds': [ 'minecraft:wheat', 7 ],
	'minecraft:potato': [ 'minecraft:potatoes', 7 ],
	'minecraft:carrot': [ 'minecraft:carrots', 7 ],
	'minecraft:beetroot_seeds': [ 'minecraft:beetroot', 7 ],
}

export default function smartHoe(Event: PlayerBreakBlockBeforeEvent) {
  const { block, player } = Event;
  if (!player.hasTag('client:smartHoe')) return;

	const BlockPerm = Event.block.permutation;
	const IsHoe = Event.itemStack ? Event.itemStack.typeId.includes('_hoe') : undefined;
	if (!IsHoe) return;

	const Growth = BlockPerm.getState('growth') || 0;
	const ItemStack = BlockPerm.getItemStack();
	const Crop = CropsData[ItemStack.typeId];
	
	if (!IsHoe || !Crop) return;
	else if (Crop[1] !== Growth) return Event.cancel = true;
	
	system.run(() => block.setType(Crop[0]));
}
