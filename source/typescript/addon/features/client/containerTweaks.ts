import { 
  system, 
  BlockComponentTypes, 
  EntityComponentTypes,
  type PlayerInteractWithBlockBeforeEvent,
  ItemUseAfterEvent
} from "@minecraft/server";

// FEATURES
export function containerRefill(Event: PlayerInteractWithBlockBeforeEvent) {
  // Check if the conditions are right
  const enabled = Event.player.hasTag("client:containerRefill") && Event.player.isSneaking
  if (!enabled) return;
  // Logic
  const { player, block, itemStack } = Event;
  const blockInventory = block.getComponent(BlockComponentTypes.Inventory);
  const playerContainer = player.getComponent(EntityComponentTypes.Inventory).container
  
  if (!blockInventory || !itemStack || itemStack.maxAmount == 1) return;

  Event.cancel = true;

  const blockContainer = blockInventory.container;

  system.run(() => {
    for (let i = 0; i < playerContainer.size; i++) {
      const items = playerContainer.getItem(i);
      if (!items || items.typeId !== itemStack.typeId) continue;
      playerContainer.transferItem(i, blockContainer);
    }
  });
}

export function handRefill(Event: ItemUseAfterEvent) {
  const { source, itemStack } = Event;
  // Check if the conditions are right
  const enabled = source.hasTag("client:handRefill")
  if (!enabled) return;
  // Logic
  const playerContainer = source.getComponent(EntityComponentTypes.Inventory).container;
  const slot = playerContainer.findLast(itemStack);

  if (!slot || itemStack.maxAmount == 1 || itemStack.amount > 1) return;
  playerContainer.transferItem(slot, playerContainer);
}