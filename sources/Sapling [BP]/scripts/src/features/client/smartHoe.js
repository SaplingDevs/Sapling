import { packet, system } from "@script-api/server.js"

// Smart Hoe
const CropsData = {
	'minecraft:wheat_seeds': [ 'minecraft:wheat', 7 ],
	'minecraft:potato': [ 'minecraft:potatoes', 7 ],
	'minecraft:carrot': [ 'minecraft:carrots', 7 ],
	'minecraft:beetroot_seeds': [ 'minecraft:beetroot', 7 ],
}

packet.on('before::playerBreakBlock', (ev) => {
	const { block, player } = ev;
    if (!player.hasTag('client:smartHoe')) return;

	const BlockPerm = ev.block.permutation;
	const IsHoe = ev.itemStack ? ev.itemStack.typeId.includes('_hoe') : undefined;
	if (!IsHoe) return;

	const Growth = BlockPerm.getState('growth') || 0;
	const ItemStack = BlockPerm.getItemStack();
	const Crop = CropsData[ItemStack.typeId];
	
	if (!IsHoe || !Crop) return;
	else if (Crop[1] !== Growth) return ev.cancel = true;
	
	system.run(() => block.setType(Crop[0]));
});