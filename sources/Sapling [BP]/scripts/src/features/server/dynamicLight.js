import { world, system } from "@script-api/server.js";
import { JsonDB } from "@script-api/sapling.js"

export default { packet: 'none' }

const LIGHT_BLOCKS = {
	'minecraft:torch': 14,
	'minecraft:soul_torch': 10,
	'minecraft:redstone_torch': 7,
	'minecraft:glowstone': 15,
	'minecraft:lantern': 15,
	'minecraft:soul_lantern': 10,
	'minecraft:campfire': 15,
	'minecraft:soul_campfire': 10,
	'minecraft:lit_pumpkin': 15,
	'minecraft:sea_lantern': 15,
	'minecraft:sea_pickle': 6
};

let TICK = 0;
system.interval(() => {
	const enable = (new JsonDB('ServerGamerules')).get('dynamicLight');
    if (!enable) return;

	const players = world.getPlayers();
	players.forEach(player => {
		const { container } = player.getComponent('inventory');
		const item = container.getItem(player.selectedSlotIndex);
		const light = item ? LIGHT_BLOCKS[item.typeId] : 0;

        const { x, y, z } = player.getVelocity();
	
		if (light > 0 && enable && !player.isFlying && !(player.isFalling && player.isJumping)) {
			player.runCommand(`fill ~~~ ~~1~ light_block["block_light_level": ${light}] replace air`);
		}
		
		if (TICK >= 20) {
			player.runCommand('fill ~-12 ~-12 ~12 ~12 ~12 ~-12 air replace light_block');
			TICK = 0;
		}
	});
	TICK++;
});