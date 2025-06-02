import { GameMode, system } from "@minecraft/server";
import type {
  PlayerBreakBlockBeforeEvent,
  EntitySpawnAfterEvent,
  Container,
  ItemStack,
  ContainerSlot,
} from "@minecraft/server";
import { Vec3 } from "types";

// Almacenamos evento + tick
let BrokenEvents: { event: PlayerBreakBlockBeforeEvent; tick: number }[] = [];

// Limpieza opcional de eventos viejos
system.runInterval(() => {
  const now = system.currentTick;
  BrokenEvents = BrokenEvents.filter(({ tick }) => now - tick <= 10);
}, 20); // cada segundo

export function itemMagnetBreakEvent(event: PlayerBreakBlockBeforeEvent) {
  if (event.player.getGameMode() === GameMode.Creative) return;
  BrokenEvents.push({ event, tick: system.currentTick });
}

export function itemMagnetSpawnEvent(event: EntitySpawnAfterEvent) {
  try {
    if (event.entity.typeId !== "minecraft:item" || event.cause !== "Spawned") return;

    const item = event.entity;
    const now = system.currentTick;

    const recentBroken = BrokenEvents.find(({ event: broken, tick }) =>
      now - tick <= 2 &&
      calcDistance(broken.block.location, item.location) < 7 &&
      broken.player.hasTag("client:itemmagnet")
    );

    if (!recentBroken) return;

    const itemStack = item.getComponent("item").itemStack;
    const inventory = recentBroken.event.player.getComponent("inventory").container;

    if (canAdd(inventory, itemStack)) {
      inventory.addItem(itemStack);
      item.remove();
    }
  } catch (e) {
    console.error(e);
  }
}

function canAdd(inventory: Container, itemStack: ItemStack) {
  if (inventory.emptySlotsCount !== 0) return true;

  for (let i = 0; i < inventory.size; i++) {
    const slot = inventory.getSlot(i);
    if (slot.hasItem() && slot.isStackableWith(itemStack) && isWithinStackSize(slot, itemStack)) {
      return true;
    }
  }

  return false;
}

function isWithinStackSize(slot: ContainerSlot, itemStack: ItemStack) {
  return slot.amount + itemStack.amount <= slot.maxAmount;
}

function calcDistance(posA: Vec3, posB: Vec3) {
  const dx = posA.x - posB.x;
  const dy = posA.y - posB.y;
  const dz = posA.z - posB.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
