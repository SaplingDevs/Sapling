import { system } from "@script-api/server.js"

export default function silkTouchGetSpawners(event) {
	const { itemStack, block } = event;
	if (!itemStack || !itemStack.typeId.endsWith('_pickaxe')) return;
	
	const enchants = itemStack.getComponent('minecraft:enchantable');
	if (enchants.hasEnchantment('silk_touch') == 0) return;
	
	if (block.typeId == 'minecraft:mob_spawner') {
		event.cancel = true;
		system.run(() => {
			block.dimension.spawnItem(block.getItemStack(1, true), block.location);
			block.setType('minecraft:air')
		});
	};
}

silkTouchGetSpawners.packet = 'before::playerBreakBlock';