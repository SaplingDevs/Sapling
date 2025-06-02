import { PlayerBreakBlockBeforeEvent } from "@minecraft/server";
import { Packet } from "~/server";

import { itemMagnetBreakEvent } from "addon/features/client/itemMagnet";
import { silkTouchGetSpawners, silkTouchGetBuddingAmethyst } from "addon/features/server/silkTouch";
import smartHoe from "addon/features/client/smartHoe";

Packet.on("before::playerBreakBlock", (Event: PlayerBreakBlockBeforeEvent) => {
  // Server
  silkTouchGetSpawners(Event);
  silkTouchGetBuddingAmethyst(Event);
  
  // Client
  itemMagnetBreakEvent(Event);
  smartHoe(Event);
});