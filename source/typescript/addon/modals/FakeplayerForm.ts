import { Player } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import Fakeplayer from "classes/Fakeplayer";
import { InformationForm } from "./GenericForms";

const PlayersDB: Map<string, { Fakeplayer: Fakeplayer, Owner: string }> = new Map();
const DimTypes = { "minecraft:overworld": 0, "minecraft:nether": 1, "minecraft:the_end": 2 };

// Form Declarations
export function FakeplayerManager(player: Player) {
  const PlayerEntries = Array.from(PlayersDB.entries());

  const PlayerTabs = PlayerEntries.length > 20
    ? PlayerEntries.slice(0, 20).map(([ key, entry ]) => {
      const TabType = entry.Owner === ":world:" ? "world" : entry.Owner === player.name ? "owner" : "local";
      const Dim = DimTypes[entry.Fakeplayer.dimension.id];

      return `fp:player:${TabType}:${Dim}0:${key}`;
    })
    : Array.from({ length: 20 }).map((_, i) => {
      if (!PlayerEntries[i]) return "fp:ignore";
      const [ key, entry ] = PlayerEntries[i];

      const TabType = entry.Owner === ":world:" ? "world" : entry.Owner === player.name ? "owner" : "local";
      const Dim = DimTypes[entry.Fakeplayer.dimension.id];

      return `fp:player:${TabType}:${Dim}0:${key}`;
    });
  
  const PlayerTabsLen = PlayerEntries.length > 20 ? 20 : PlayerEntries.length;

  const HomeUI = new ActionFormData().title("!fp:home");
  const HomeUIButtons = [ ...PlayerTabs, "fp:ignore", "fp:ignore", ]

  HomeUI.body("" + PlayerTabsLen);
  HomeUIButtons.forEach((p) => HomeUI.button(p));
  // @ts-ignore
  HomeUI.show(player).then((res) => {
    if (res.canceled) return;
    else if (res.selection < 20) FakeplayerControls(player, res.selection);
    else if (res.selection === 20) ConnectForm(player);
    else if (res.selection === 21) ImportForm(player);
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

    if (PlayerName && !PlayersDB.has(PlayerName)) {
      const fakeplayer = new Fakeplayer(PlayerName, player.location, player.dimension);
      PlayersDB.set(PlayerName, { Fakeplayer: fakeplayer, Owner: PlayerPreserve ? ":world:" : player.name });
      
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
    ImportUI.textField("Players data", "Player1; 123 456 789; overworld; --world\n...");
    ImportUI.submitButton("Import players");
  
  // @ts-ignore
  ImportUI.show(player).then((res) => console.log(res.canceled ? res.cancelationReason : res.formValues));
}

function FakeplayerControls(player: Player, selection: number){}