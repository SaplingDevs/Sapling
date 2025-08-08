import { ItemComponentTypes, ItemUseBeforeEvent, PlayerInteractWithBlockBeforeEvent, type PlayerBreakBlockBeforeEvent } from "@minecraft/server";

export function toolBreakPrevention_BreakingBlocks(Event: PlayerBreakBlockBeforeEvent) {
  const { player, itemStack } = Event;
  // Conditions 
  const enabled = player.hasTag("client:toolBreakPrevention") && itemStack && itemStack.hasComponent(ItemComponentTypes.Durability);
  if (!enabled) return;
  // Logic
  const { damage, maxDurability } = itemStack.getComponent(ItemComponentTypes.Durability);
  Event.cancel = (damage == maxDurability);
}

export function toolBreakPrevention_UsingItem(Event: ItemUseBeforeEvent) {
  const { source, itemStack } = Event;
  // Conditions 
  const enabled = source.hasTag("client:toolBreakPrevention") && itemStack && itemStack.hasComponent(ItemComponentTypes.Durability);
  if (!enabled) return;
  // Logic
  const { damage, maxDurability } = itemStack.getComponent(ItemComponentTypes.Durability);
  Event.cancel = (damage == maxDurability);
}

export function toolBreakPrevention_InteractBlock(Event: PlayerInteractWithBlockBeforeEvent) {
  const { player, itemStack } = Event;
  // Conditions 
  const enabled = player.hasTag("client:toolBreakPrevention") && itemStack && itemStack.hasComponent(ItemComponentTypes.Durability);
  if (!enabled) return;
  // Logic
  const { damage, maxDurability } = itemStack.getComponent(ItemComponentTypes.Durability);
  Event.cancel = (damage == maxDurability);
}

