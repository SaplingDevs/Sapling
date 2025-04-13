import { world } from "@minecraft/server";
import { ServerFeatures } from "config/gamerules";

export function instamineObsidian() {
  const Enabled = ServerFeatures.DataBase.get("instamineobsidian");
  if (!Enabled) return;

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
  const Enabled = ServerFeatures.DataBase.get("instaminedeepslate");
  if (!Enabled) return;

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
  const Enabled = ServerFeatures.DataBase.get("instamineendstone");
  if (!Enabled) return;

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