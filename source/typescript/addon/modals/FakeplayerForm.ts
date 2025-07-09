import { EquipmentSlot, GameMode, Player, system, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import Fakeplayer from "classes/Fakeplayer";
import { InformationForm } from "./GenericForms";
import { Interpreter } from "classes/Interpreter";
import { Vector3 } from "~/server";
import { FakeplayerManagerResponse } from "types";
import { typeIdToID } from "~/vanilla-data";
import Vec3 from "~/server/Vector3";

const DimTypes = { "minecraft:overworld": 0, "minecraft:nether": 1, "minecraft:the_end": 2 };

// Form Declarations
export function FakeplayerManager(player: Player, page: number = 0) {
  const PlayerEntries = Array.from(Fakeplayer.PlayersDB.entries());
  const totalPages = Math.ceil(PlayerEntries.length / 20);

  const PageEntries = PlayerEntries.slice(page * 20, (page + 1) * 20);

  const PlayerTabs = Array.from({ length: 20 }).map((_, i) => {
    const entry = PageEntries[i];
    if (!entry) return "fp:ignore";

    const [ key, data ] = entry;
    const TabType = data.Owner === ":world:" ? "world" : data.Owner === player.name ? "owner" : "local";
    const Dim = DimTypes[data.Fakeplayer.dimension.id];

    return `fp:player:${TabType}:${Dim}0:${key}`;
  });

  const HomeUI = new ActionFormData().title("!fp:home");
  const HomeUIButtons = [
    ...PlayerTabs,
    // Create & Import
    "fp:ignore", "fp:ignore",
    // Prev & Next
    page > 0 ? "fp:ignore" : "fp:locked",
    page < totalPages - 1 ? "fp:ignore" : "fp:locked",
  ];

  HomeUI.body("" + PageEntries.length);
  HomeUIButtons.forEach((p) => HomeUI.button(p));

  // @ts-ignore
  HomeUI.show(player).then((res) => {
    if (res.canceled) return;
    else if (res.selection < 20) FakeplayerControls(player, PageEntries[res.selection][1]);
    else if (res.selection === 20) ConnectForm(player);
    else if (res.selection === 21) ImportForm(player);
    else if (res.selection === 22) FakeplayerManager(player, page - 1);
    else if (res.selection === 23) FakeplayerManager(player, page + 1);
  });
}

function ConnectForm(player: Player) {
  const ConnectUI = new ModalFormData().title("!fp:connect")
    ConnectUI.textField("Player name", "");
    ConnectUI.toggle("Preserve in world?");
    ConnectUI.submitButton("Join player");
  
  // @ts-ignore
  ConnectUI.show(player).then((res) => {
    if (res.canceled) return;

    const [ RawPlayerName, PlayerPreserve ] = res.formValues as [ string, boolean ];
    const PlayerName = RawPlayerName.trim();

    if (PlayerName && !Fakeplayer.PlayersDB.has(PlayerName)) {
      const fakeplayer = new Fakeplayer(PlayerName, player.location, player.dimension, PlayerPreserve);
      Fakeplayer.PlayersDB.set(PlayerName, { Fakeplayer: fakeplayer, Owner: PlayerPreserve ? ":world:" : player.name });
      
      FakeplayerManager(player);
      return;
    }

    InformationForm(player, {
      body: "An error occurs trying creating the fakeplayer!",
      onReturn: () => ConnectForm(player)
    });
  });
}


function ImportForm(player: Player) {
  const ImportUI = new ModalFormData().title("!fp:import")
    ImportUI.textField("Players list", "username, location, dimension, --flags;\n...");
    ImportUI.submitButton("Import players");
  
  const Dimensions = { 
    overworld: world.getDimension("overworld"),
    nether: world.getDimension("nether"),
    the_end: world.getDimension("the_end"),
  };

  // @ts-ignore
  ImportUI.show(player).then((res) => {
    if (res.canceled) return;

    const InputList = (res.formValues[0] as string).trim();
    if (InputList) {
      const List = Interpreter.playersList(InputList);
      List.forEach((rawPlayer) => {
        if (Fakeplayer.PlayersDB.has(rawPlayer.username)) return;
        
        const playerName = rawPlayer.username;
        const dim = Dimensions[rawPlayer.dimension];
        const loc = new Vector3(rawPlayer.location[0], rawPlayer.location[1], rawPlayer.location[2]);
        const worldPreserve = rawPlayer.flags.includes("--world");
        
        const fakeplayer = new Fakeplayer(playerName, loc, dim, worldPreserve);
        Fakeplayer.PlayersDB.set(playerName, { Fakeplayer: fakeplayer, Owner: worldPreserve ? ":world:" : player.name });
      });
            
      if (List.length > 0) {
        FakeplayerManager(player);
        return;
      }
    }
  
    InformationForm(player, {
      body: "An error occurs trying import the fakeplayerd!",
      onReturn: () => ImportForm(player)
    });
  });
}

function SpectateForm(player: Player) {
  const SpectateUI = new ActionFormData().title("?fp:spectate");
    SpectateUI.button("Exit");

  const onClose = () => player
    .getTags()
    .filter((t) => t.startsWith("spectate::"))
    .forEach((t) => player.removeTag(t));
  
    // @ts-ignore
  SpectateUI.show(player).then(onClose).catch(onClose);
}

export function FakeplayerControls(player: Player, { Fakeplayer, Owner }: FakeplayerManagerResponse) {
  const ControlsUI = new ActionFormData().title("!fp:manager");
  const InventorySlotsButtons: [number | string, number | string][] = Array.from({ length: 36 }).map(() => [0, "NaN"]);
  const EquipmentSlotsButtons: [number | string, number | string][] = Array.from({ length: 5 }).map(() => [0, "NaN"]);
 

  // Logic
  const inv = Fakeplayer.getContainer().container;
  const equippable = Fakeplayer.getEquipment();
  const ra = Fakeplayer.getRepeatActions();

  for (let index = 0; index < inv.size; index++) {
    const item = inv.getItem(index);
    const typeId = item?.typeId ?? "NaN";
    const amount = item?.amount ?? 0;
    const aux = typeIdToID.get(typeId);

    const displayAmount = (amount > 0 && amount !== 1) ? amount : "";
    const displayAux = typeof aux === "number" ? (aux * 65536) : "NaN";

    InventorySlotsButtons[index] = [displayAmount, displayAux];
  }
  
  const EquipmentSlots = [ EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet, EquipmentSlot.Offhand ];
  for (let index = 0; index < EquipmentSlots.length; index++) {
    const slot = EquipmentSlots[index];
    // @ts-ignore
    const item = equippable.getEquipment(slot);
    const typeId = item?.typeId ?? "NaN";
    const amount = item?.amount ?? 0;
    const aux = typeIdToID.get(typeId);

    const displayAmount = (amount > 0) ? amount : "";
    const displayAux = typeof aux === "number" ? (aux * 65536) : "NaN";

    EquipmentSlotsButtons[index] = [displayAmount, displayAux];
  }

  const [ locX, locY, locZ ] = [ Fakeplayer.location.x.toFixed(), Fakeplayer.location.y.toFixed(), Fakeplayer.location.z.toFixed() ]

  // Set Elements
  /* Index: 0 -> 41 */
  // Index: 0 -> 40
  InventorySlotsButtons.forEach(([ amount, aux ]) => ControlsUI.button(String(amount), String(aux)));
  EquipmentSlotsButtons.forEach(([ amount, aux ]) => ControlsUI.button(String(amount), String(aux)));
  ControlsUI.button("") // Index 41 -> Drop All
  /* Index 42 -> 49 */
  ControlsUI.button(`${locX}, ${locY}, ${locZ}`) // Index 42 -> Location 
  ControlsUI.button(`${locX}, ${locY}, ${locZ}`) // Index 43 -> Leave
  ControlsUI.button(player.dimension.id === Fakeplayer.dimension.id ? "spectate" : "fp:locked") // Index 44 -> Spectate

  ControlsUI.button("Attack"); ControlsUI.button(ra.has("attack") ? "R" : "S"); // Index 45 - 46 -> Attack, Repeat
  ControlsUI.button("Jump"); ControlsUI.button(ra.has("jump") ? "R" : "S"); // Index 47 - 48 -> Jump, Repeat
  ControlsUI.button("Interact"); ControlsUI.button(ra.has("interact") ? "R" : "S"); // Index 49 - 50 -> Interact, Repeat
  ControlsUI.button("Use"); ControlsUI.button(ra.has("useItemInSlot") ? "R" : "S"); // Index 51 - 52 -> Use, Repeat
  ControlsUI.button("Shift") // Index 53 -> Shift
  

  // @ts-ignore
  ControlsUI.show(player).then(({ canceled, cancelationReason, selection}) => {
    console.log(canceled ? cancelationReason : selection)
    if (canceled) return;

    const inventory = Fakeplayer.getContainer();
    const equippable = Fakeplayer.getEquipment();

    const armorSlots = [
      EquipmentSlot.Head,
      EquipmentSlot.Chest,
      EquipmentSlot.Legs,
      EquipmentSlot.Feet,
      EquipmentSlot.Offhand
    ];

    if (selection >= 0 && selection <= 35) {
      inventory.container.moveItem(selection, 0, inventory.container);
      Fakeplayer.dropSelectedItem();
    }
    else if (selection >= 36 && selection <= 40) {
      const slot = armorSlots[selection - 36];  
      // @ts-ignore
      const eqquipableItem = equippable.getEquipment(slot);
      const item = inventory.container.getItem(0);

      inventory.container.setItem(0, eqquipableItem);
      Fakeplayer.dropSelectedItem();
      // @ts-ignore+
      equippable.setEquipment(slot);
      inventory.container.setItem(0, item);
    }
    else if (selection == 41) {
      for (let i=0; i<36; i++) {
        inventory.container.moveItem(i, 0, inventory.container);
        Fakeplayer.dropSelectedItem();
      }

      for (let i=0; i<armorSlots.length; i++) {
        const slot = armorSlots[i];
        // @ts-ignore
        const item = equippable.getEquipment(slot);
        if (!item) continue;
        
        inventory.container.setItem(0, item);
        // @ts-ignore
        equippable.setEquipment(slot);
        Fakeplayer.dropSelectedItem();
      }
    }
    else if (selection == 42) {
      Fakeplayer.teleport(player.location, player.dimension);
      Fakeplayer.location = player.location;
    }
    else if (selection == 43) {
      Fakeplayer.disconnect();
      FakeplayerManager(player);
      return;
    }
    else if (selection == 44) {
      const loc = player.location;
      const gm = player.getGameMode();
      const fpl = Fakeplayer.location;
      player.setGameMode(GameMode.Spectator);
      player.teleport(new Vec3(fpl.x + 5, fpl.y + 5, fpl.z + 5));

      player.addTag("spectate::" + Fakeplayer.name);
      system.runTimeout(() => {
        player.teleport(loc);
        player.setGameMode(gm);
      }, 20)
      
      SpectateForm(player);
      return;
    }
    else {
      const selected = selection - 45
      const actions = generateFakeplayerActions(Fakeplayer);

      actions[selected]();
    }

    FakeplayerControls(player, { Fakeplayer, Owner });
  });
}

// Feture builders
function generateFakeplayerActions(Fakeplayer: Fakeplayer): (() => void)[] {
  const ra = Fakeplayer.getRepeatActions();
  const gr = (r: string) => (() => ra.has(r) ? ra.delete(r) : ra.add(r))

  const features = [
    Fakeplayer.attack, gr("attack"),
    Fakeplayer.jump, gr("jump"),
    Fakeplayer.interact, gr("interact"),
    Fakeplayer.useItemInSlot, gr("useItemInSlot"),
    Fakeplayer.shift,
  ];
  
  return features;
}