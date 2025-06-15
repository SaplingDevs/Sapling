import {
  Enchantment,
  EnchantmentTypes,
  EntityComponentTypes,
  EquipmentSlot,
  ItemComponentTypes,
  ItemStack,
  Player,
  system,
} from "@minecraft/server";
import { SimulatedPlayer } from "@minecraft/server-gametest";

type ParsedItem = ReturnType<typeof Inventory.itemToJson> | null;

interface ParsedInventory {
  PlayerArmor: Record<string, ParsedItem>;
  InventorySlots: Record<string, ParsedItem>;
  OffHand: ParsedItem;
}

export default class Inventory {
  static EnchantTypes: [string, number][] | null = null;

  static ensureEnchantTypes() {
    if (!this.EnchantTypes) {
      this.EnchantTypes = EnchantmentTypes.getAll().map(et => [et.id, et.maxLevel]);
    }
  }

  static getInventoryFromPlayer(player: Player | SimulatedPlayer) {
    const equippable = player.getComponent(EntityComponentTypes.Equippable);
    const container = player.getComponent(EntityComponentTypes.Inventory)!.container;

    const armorSlots = [
      EquipmentSlot.Head,
      EquipmentSlot.Chest,
      EquipmentSlot.Legs,
      EquipmentSlot.Feet,
    ];

    const PlayerArmor = new Map<string, ItemStack>();
    const InventorySlots = new Map<number, ItemStack>();

    for (let index = 0; index < container.size; index++) {
      const item = container.getItem(index);
      if (item) InventorySlots.set(index, item as ItemStack);
    }

    for (const slot of armorSlots) {
      // @ts-ignore
      const item = equippable?.getEquipment(slot);
      PlayerArmor.set(String(slot), item as ItemStack ?? null);
    }

    return {
      PlayerArmor,
      InventorySlots,
      // @ts-ignore
      OffHand: equippable?.getEquipment(EquipmentSlot.Offhand) ?? null,
    };
  }

  static itemToJson(item: ItemStack) {
    const durability = item.getComponent(ItemComponentTypes.Durability);
    const enchantable = item.getComponent(ItemComponentTypes.Enchantable);
    const dyeable = item.getComponent(ItemComponentTypes.Dyeable);

    return {
      typeId: item.typeId,
      amount: item.amount,
      nameTag: item.nameTag,
      lore: item.getLore(),
      keepOnDeath: item.keepOnDeath,
      lock: item.lockMode,
      itemData: {
        damage: durability?.damage ?? null,
        enchants:
          enchantable?.getEnchantments().map(e => ({
            id: e.type.id,
            level: e.level,
          })) ?? [],
        color: dyeable?.color ?? null,
      },
    };
  }

  static jsonToItem(data: ParsedItem): ItemStack {
    this.ensureEnchantTypes();

    const item = new ItemStack(data.typeId, data.amount);

    item.setLore(data.lore);
    item.nameTag = data.nameTag;
    item.keepOnDeath = data.keepOnDeath;
    item.lockMode = data.lock;

    const enchantable = item.getComponent(ItemComponentTypes.Enchantable);

    const ItemEnchants = data.itemData.enchants.map((e) => ({
      type: EnchantmentTypes.get(e.id),
      level: e.level,
    }));

    enchantable?.addEnchantments(ItemEnchants);

    return item;
  }



  static parsePlayerInventory(player: Player | SimulatedPlayer): ParsedInventory {
    const inv = Inventory.getInventoryFromPlayer(player);

    const PlayerArmor = Object.fromEntries(
      Array.from(inv.PlayerArmor.entries()).map(([key, item]) => [
        key,
        item ? Inventory.itemToJson(item) : null,
      ])
    );

    const InventorySlots = Object.fromEntries(
      Array.from(inv.InventorySlots.entries()).map(([key, item]) => [
        key,
        Inventory.itemToJson(item),
      ])
    );

    const OffHand = inv.OffHand ? Inventory.itemToJson(inv.OffHand as ItemStack) : null;

    return { PlayerArmor, InventorySlots, OffHand };
  }
}
