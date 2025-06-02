import { world } from "@minecraft/server";
import { ServerFeatures } from "config/gamerules";

export function instamineObsidian() {
  if (!ServerFeatures.DataBase.get("instamineobsidian")) return;

	const pickaxes = ['minecraft:diamond_pickaxe', 'minecraft:netherite_pickaxe'];
    const Players = world.getPlayers();

	Players.forEach(player => {
		const Block = player.getBlockFromViewDirection({ maxDistance: 16 });
		if (!Block) return;
		
		const Item = player.getComponent('inventory')
			.container.getItem(player.selectedSlotIndex);
		if (!Item) return;
		
		if (!pickaxes.includes(Item.typeId) || !Block.block.typeId.includes('obsidian')) return;
		
		player.addEffect('haste', 1, { amplifier: 128 });
	});
}

export function instamineDeepslate() {
  if (!ServerFeatures.DataBase.get("instaminedeepslate")) return;

	const pickaxes = ['minecraft:diamond_pickaxe', 'minecraft:netherite_pickaxe'];
    const Players = world.getPlayers();

	Players.forEach(player => {
		const Block = player.getBlockFromViewDirection({ maxDistance: 16 });
		if (!Block) return;
		
		const Item = player.getComponent('inventory')
			.container.getItem(player.selectedSlotIndex);
		if (!Item) return;
		
		if (!pickaxes.includes(Item.typeId) || !Block.block.typeId.includes('deepslate')) return;
		
		player.addEffect('haste', 1, { amplifier: 128 });
	});
}

export function instamineEndstone() {
  if (!ServerFeatures.DataBase.get("instamineendstone")) return;

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
}