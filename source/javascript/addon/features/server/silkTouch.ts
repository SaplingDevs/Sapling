import { Block, ItemStack, PlayerBreakBlockBeforeEvent, system } from "@minecraft/server";
import { ServerFeatures } from "config/gamerules";

// Silk Touch Get Budding Amethyst
export function silkTouchGetBuddingAmethyst(Event: PlayerBreakBlockBeforeEvent) {
  if (!ServerFeatures.DataBase.get("silktouchgetbuddingamethyst")) return;

	const { itemStack, block } = Event;
	if (!itemStack || !itemStack.typeId.endsWith('_pickaxe')) return;
	
	const enchants = itemStack.getComponent('minecraft:enchantable');
	if (!enchants.hasEnchantment('silk_touch')) return;
	
	if (block.typeId == "minecraft:budding_amethyst") SpawnItem(block, "minecraft:budding_amethyst");
}

// Silk Touch Get Spawners
export function silkTouchGetSpawners(Event: PlayerBreakBlockBeforeEvent) {
  if (!ServerFeatures.DataBase.get("silktouchgetspawners")) return;

	const { itemStack, block } = Event;
	if (!itemStack || !itemStack.typeId.endsWith('_pickaxe')) return;
	
	const enchants = itemStack.getComponent('minecraft:enchantable');
	if (!enchants.hasEnchantment('silk_touch')) return;
	
	if (block.typeId == 'minecraft:mob_spawner') {
		Event.cancel = true;
		system.run(() => {
			block.dimension.spawnItem(block.getItemStack(1, true), block.location);
			block.setType('minecraft:air')
		});
	};
}



function SpawnItem(block: Block, ItemID: string) {
  system.run(() => block.dimension.spawnItem(new ItemStack(ItemID, 1), block.location));
}