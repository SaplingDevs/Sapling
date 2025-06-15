import { Player, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import Fakeplayer from "classes/Fakeplayer";
import { InformationForm } from "./GenericForms";
import { Interpreter } from "classes/Interpreter";
import { Vector3 } from "~/server";

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
    else if (res.selection < 20) FakeplayerControls(player, res.selection + page * 20);
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
      const fakeplayer = new Fakeplayer(PlayerName, player.location, player.dimension);
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
        
        const fakeplayer = new Fakeplayer(playerName, loc, dim);
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

function FakeplayerControls(player: Player, selection: number){}