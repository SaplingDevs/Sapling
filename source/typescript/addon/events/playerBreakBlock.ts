import { PlayerBreakBlockBeforeEvent } from "@minecraft/server";
import { Packet } from "~/server";

import { itemMagnetBreakEvent } from "addon/features/client/itemMagnet";
import { silkTouchGetSpawners, silkTouchGetBuddingAmethyst } from "addon/features/server/silkTouch";
import smartHoe from "addon/features/client/smartHoe";
import { toolBreakPrevention_BreakingBlocks } from "addon/features/client/toolBreakPrevention";

Packet.on("before::playerBreakBlock", (Event: PlayerBreakBlockBeforeEvent) => {
  // Server
  silkTouchGetSpawners(Event);
  silkTouchGetBuddingAmethyst(Event);
  
  // Client
  itemMagnetBreakEvent(Event);
  smartHoe(Event);
  toolBreakPrevention_BreakingBlocks(Event);
});