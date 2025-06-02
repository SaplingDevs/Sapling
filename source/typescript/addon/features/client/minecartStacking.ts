import { GameMode, system } from "@minecraft/server";
import type { PlayerInteractWithBlockBeforeEvent, VanillaEntityIdentifier } from "@minecraft/server";

export default function minecartStacking(Event: PlayerInteractWithBlockBeforeEvent) {
  const enable = Event.player.hasTag('client:minecartStacking');
  if (!enable || !Event.itemStack?.typeId.includes('minecart')) return;
  else if (!Event.block.typeId.includes("rail")) return;

  const player = Event.player;
  const inventory = player.getComponent('inventory').container;

  const parsedLoc = {
      x: Event.block.location.x + 0.5,
      y: Event.block.location.y,
      z: Event.block.location.z + 0.5
  }
  
  system.run(() => {
    player.dimension.spawnEntity(Event.itemStack.typeId as VanillaEntityIdentifier, parsedLoc);
    if (player.getGameMode() !== GameMode.Creative) inventory.setItem(player.selectedSlotIndex);
  });
}