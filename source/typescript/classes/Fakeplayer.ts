import { EasingType, EntityComponentTypes, EquipmentSlot, system, world, type Dimension, type Vector3 } from "@minecraft/server";
import { SimulatedPlayer, Test } from "@minecraft/server-gametest";
import { DataBaseBuilder } from "~/core";
import Inventory from "./Inventory";
import Vec3 from "~/server/Vector3";

export default class Fakeplayer {
  // GameTest isntance
  static test: Test;

  // Fakeplayer DataBases
  static PlayersDB: Map<string, { Fakeplayer: Fakeplayer, Owner: string }> = new Map();
  private static FakePlayersData = new DataBaseBuilder("Sapling::FakePlayersData");
  private static WorldFakePlayers = new DataBaseBuilder("Sapling::WorldFakePlayers");
  private static PlayerInventoriesDB: Map<string, DataBaseBuilder> = new Map();

  // Public Fakeplayer properties
  public id: string;
  public name: string;
  public location: Vector3;
  public dimension: Dimension;
  private instance: SimulatedPlayer;
  private DB_Name: string; 
  private loaded: boolean = false;
  private repeatActions: Set<string> = new Set();
  
  constructor(name: string, location: Vector3, dimension: Dimension, worldSave: boolean = false) {
    this.name = name;
    this.location = location;
    this.dimension = dimension;

    this.instance = Fakeplayer.test.spawnSimulatedPlayer(location, name);
    this.id = this.instance.id;
    this.instance.nameTag = "§l§4[§cFakePlayer§4]§r§§ " + this.instance.name;
    // @ts-ignore
    this.instance.teleport(location, { dimension: dimension });
    this.instance.addTag("FakePlayer::instance");
    
    this.DB_Name = "FakePlayerDB::" + this.instance.name;
    Fakeplayer.PlayerInventoriesDB.set(this.DB_Name, new DataBaseBuilder(this.DB_Name));

    const loadRuntime = system.runInterval(() => {
      const db = Fakeplayer.PlayerInventoriesDB.get(this.DB_Name);
      if (!db || !db.loaded) return;

      system.clearRun(loadRuntime);
      this.loaded = true;
      this.__loadFromDB();
    }, 20);

    system.runTimeout(() => {
      if (!worldSave || Fakeplayer.WorldFakePlayers.has(name)) return;
      Fakeplayer.WorldFakePlayers.set(name, this.location);
    }, 20);
  }

  // Data getters
  getContainer = () => this.instance.getComponent(EntityComponentTypes.Inventory);
  getEquipment = () => this.instance.getComponent(EntityComponentTypes.Equippable);


  // Single actions
  attack = () => this.instance.attack();
  jump = () => this.instance.jump();
  interact = () => this.instance.interact();
  dropSelectedItem = () => this.instance.dropSelectedItem();
  useItemInSlot = (slot: number = this.instance.selectedSlotIndex) => this.instance.useItemInSlot(slot);
  shift = () => this.instance.isSneaking = !this.instance.isSneaking;
  updateLocation = () => this.location = this.instance.location;

  // Param actions
  // @ts-ignore
  teleport = (location: Vector3, dimension: Dimension) => this.instance.teleport(location, { dimension });
  
  // Composed actions
  disconnect = () => {
    Fakeplayer.__saveInDB(this.instance, this.loaded);
    this.instance.disconnect();
    Fakeplayer.test.removeSimulatedPlayer(this.instance);
    Fakeplayer.PlayersDB.delete(this.name)
  }
  
  getRepeatActions = () => this.repeatActions;

  // Private methods
  static saveFakeplayersData() {
    this.PlayersDB.forEach((player) => this.__saveInDB(player.Fakeplayer.instance, player.Fakeplayer.loaded));
  }

  static updateWorldFakeplayersData() {
    this.WorldFakePlayers.forEach((name: string) => {
      if (this.PlayersDB.has(name)) {
        const player = this.PlayersDB.get(name);
        const dimension = player.Fakeplayer.dimension.id;
        const location = player.Fakeplayer.location;

        this.WorldFakePlayers.set(name, { location, dimension });
      }
    });
  }

  static updateFakeplayersData() {
    this.PlayersDB.forEach(({ Fakeplayer }) => Fakeplayer.updateLocation());
  }

  static connectWorldFakeplayers() {
    const dimensions = { 
      "minecraft:overworld": world.getDimension("overworld"),
      "minecraft:nether": world.getDimension("nether"),
      "minecraft:the_end": world.getDimension("the_end")
    }

    this.WorldFakePlayers.forEach((name: string, data: { location: Vector3, dimension: string }, ) => {
      const { location, dimension } = data;
      const dim = dimensions[dimension];
      
      const player = new Fakeplayer(name, location, dim, true);
      this.PlayersDB.set(name, { Fakeplayer: player, Owner: ":world:" });
    });
  }

  static runRepeatActions() {
    this.PlayersDB.forEach((player) => {
      const actions = player.Fakeplayer.getRepeatActions();
      actions.forEach((action) => player.Fakeplayer[action]());
    })
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

let loaded = false;
system.runInterval(() => {
  if (Fakeplayer.test && !loaded) {
    Fakeplayer.connectWorldFakeplayers();
  }

  if (Fakeplayer.test) {
    loaded = true;
    Fakeplayer.saveFakeplayersData();
    Fakeplayer.runRepeatActions();
    Fakeplayer.updateWorldFakeplayersData();
    Fakeplayer.updateFakeplayersData();
  }
}, 20);

let rotationAngle = 0;
const rotationSpeed = 0.1; // Ajusta este valor para una rotación más rápida o lenta

system.runInterval(() => {
  const allPlayers = world.getAllPlayers();

  for (const player of allPlayers) {
    const playerTags = player.getTags();
    const spectateTag = playerTags.find(tag => tag.startsWith("spectate::"));

    if (spectateTag) {
      const fpName = spectateTag.split("::")[1];

      if (Fakeplayer.PlayersDB.has(fpName)) {
        const fakeplayerData = Fakeplayer.PlayersDB.get(fpName);
        const fakeplayerEntity = world.getEntity(fakeplayerData.Fakeplayer.id);
        const loc = fakeplayerData.Fakeplayer.location;

        if (fakeplayerEntity) {
          const offsetX = 5 * Math.cos(rotationAngle);
          const offsetZ = 5 * Math.sin(rotationAngle);

          player.camera.setCamera("minecraft:free", {
            easeOptions: {
              easeTime: 1,
              easeType: EasingType.Linear
            },
            facingEntity: fakeplayerEntity,
            location: new Vec3(loc.x + offsetX, loc.y + 5, loc.z + offsetZ)
          });
        } else {
          player.removeTag(spectateTag);
          player.camera.clear();
        }
      } else {
        player.removeTag(spectateTag);
        player.camera.clear();
      }
    } else {
      player.camera.clear();
    }
  }

  rotationAngle += rotationSpeed;
}, 10);