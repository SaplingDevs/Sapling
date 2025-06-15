import { EntityComponentTypes, EquipmentSlot, ItemComponentTypes, ItemStack, system, world, type Dimension, type Vector3 } from "@minecraft/server";
import { SimulatedPlayer, Test } from "@minecraft/server-gametest";
import { DataBaseBuilder } from "~/core";
import Inventory from "./Inventory";

export default class Fakeplayer {
  // GameTest isntance
  static test: Test;

  // Fakeplayer DataBases
  static PlayersDB: Map<string, { Fakeplayer: Fakeplayer, Owner: string }> = new Map();
  private static FakePlayersData = new DataBaseBuilder("Sapling::FakePlayersData");
  private static WorldFakePlayers = new DataBaseBuilder("Sapling::WorldFakePlayers");
  private static PlayerInventoriesDB: Map<string, DataBaseBuilder> = new Map();

  // Public Fakeplayer properties
  public name: string;
  public location: Vector3;
  public dimension: Dimension;
  private instance: SimulatedPlayer;
  private DB_Name: string; 
  private loaded: boolean = false;
  
  constructor(name: string, location: Vector3, dimension: Dimension, worldSave: boolean = false) {
    this.name = name;
    this.location = location;
    this.dimension = dimension;

    this.instance = Fakeplayer.test.spawnSimulatedPlayer(location, name);
    this.instance.nameTag = "§l§4[§cFakePlayer§4]§r " + this.instance.name;
    // @ts-ignore
    this.instance.teleport(location, { dimension: dimension });
    
    this.DB_Name = "FakePlayerDB::" + this.instance.name;
    Fakeplayer.PlayerInventoriesDB.set(this.DB_Name, new DataBaseBuilder(this.DB_Name));

    const loadRuntime = system.runInterval(() => {
      const db = Fakeplayer.PlayerInventoriesDB.get(this.DB_Name);
      if (!db || !db.loaded) return;

      system.clearRun(loadRuntime);
      this.loaded = true;
      this.__loadFromDB();
    }, 20);
  }

  // Single actions
  attack = () => this.instance.attack();
  jump = () => this.instance.jump();
  interact = () => this.instance.interact();
  dropSelectedItem = () => this.instance.dropSelectedItem();
  useItemInSlot = (slot: number = this.instance.selectedSlotIndex) => this.instance.useItemInSlot(slot);

  // Composed actions
  disconnect = () => {
    Fakeplayer.__saveInDB(this.instance, this.loaded);
    this.instance.disconnect();
    Fakeplayer.test.removeSimulatedPlayer(this.instance);
  }

  // Private methods
  static saveFakeplayersData() {
    this.PlayersDB.forEach((player) => this.__saveInDB(player.Fakeplayer.instance, player.Fakeplayer.loaded));
  }

  static __saveInDB(player: SimulatedPlayer, loaded: boolean) {
    const DB = this.PlayerInventoriesDB.get("FakePlayerDB::" + player.name);
    if (!DB || !loaded) return;

    const { PlayerArmor, InventorySlots, OffHand } = Inventory.parsePlayerInventory(player);

    const isSlotsEmpty = Object.keys(InventorySlots).length === 0;
    const isArmorEmpty = Object.values(PlayerArmor).every(i => i === null);
    const isOffHandEmpty = OffHand === null;

    if (isSlotsEmpty && isArmorEmpty && isOffHandEmpty) {
      this.FakePlayersData.remove(player.name);
      DB.deleteDB();
      return;
    }

    if (!this.FakePlayersData.has(player.name)) {
      this.FakePlayersData.set(player.name, 1);
    }
    const data = JSON.stringify({ PlayerArmor, InventorySlots, OffHand })
    DB.set("inventory", data);
  }

  private __loadFromDB() {
    const DB = Fakeplayer.PlayerInventoriesDB.get(this.DB_Name);
    if (!DB || !DB.has("inventory")) return;

    const inventoryRaw = DB.get("inventory");
    if (typeof inventoryRaw !== "string") return;
    const { PlayerArmor, InventorySlots, OffHand } = JSON.parse(inventoryRaw);
    
    
    const isSlotsEmpty = Object.keys(InventorySlots).length === 0;
    const isArmorEmpty = Object.values(PlayerArmor).every(i => i === null);
    const isOffHandEmpty = OffHand === null;

    if (isSlotsEmpty && isArmorEmpty && isOffHandEmpty) return;

    const equippable = this.instance.getComponent(EntityComponentTypes.Equippable);
    const container = this.instance.getComponent(EntityComponentTypes.Inventory)!.container;

    Object.keys(PlayerArmor).forEach((key) => {
      const rawItem = PlayerArmor[key];
      if (!rawItem) return;
      const item = Inventory.jsonToItem(rawItem);
      // @ts-ignore
      equippable.setEquipment(key, item);
    });

    Object.keys(InventorySlots).forEach((key) => {
      const rawItem = InventorySlots[String(key)];
      const item = Inventory.jsonToItem(rawItem);
      // @ts-ignore
      container.setItem(Number(key), item);
    });

    // @ts-ignore
    if (OffHand) equippable.setEquipment(EquipmentSlot.Offhand, Inventory.jsonToItem(OffHand));
  }
}

system.runInterval(() => {
 Fakeplayer.saveFakeplayersData();
}, 20);