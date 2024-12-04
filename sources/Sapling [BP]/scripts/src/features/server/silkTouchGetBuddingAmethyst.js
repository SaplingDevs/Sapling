import { system, ItemStack } from "@script-api/server.js"

export default function silkTouchGetBuddingAmethyst(event) {
	const { itemStack, block } = event;
	if (!itemStack || !itemStack.typeId.endsWith('_pickaxe')) return;
	
	const enchants = itemStack.getComponent('minecraft:enchantable');
	if (enchants.hasEnchantment('silk_touch') == 0) return;
	
	if (block.typeId == 'minecraft:budding_amethyst') {
		system.run(() => {
			block.dimension.spawnItem(new ItemStack('minecraft:budding_amethyst', 1), block.location);
		});
	};
}

silkTouchGetBuddingAmethyst.packet = 'before::playerBreakBlock';