import { world, system } from "@script-api/server.js";
import { JsonDB } from "@script-api/sapling.js";

export default { packet: 'none' }

system.interval(() => {
    const enable = (new JsonDB('ServerGamerules')).get('instamineEndstone');
    if (!enable) return;

	const pickaxes = ['minecraft:diamond_pickaxe', 'minecraft:netherite_pickaxe'];
    const Players = world.getPlayers();
	Players.forEach(player => {
		const Block = player.getBlockFromViewDirection({ maxDistance: 16 });
		if (!Block) return;
		
		const Item = player.getComponent('inventory')
			.container.getItem(player.selectedSlotIndex);
		if (!Item) return;
		
		if (!pickaxes.includes(Item.typeId) || !Block.block.typeId.includes('end_stone')) return;
		
		player.addEffect('haste', 1, { amplifier: 128 });
	});
}, 2)