import { PlayerBreakBlockBeforeEvent } from "@minecraft/server";
import { Packet } from "~/server";

import { itemMagnetBreakEvent } from "addon/features/client/itemMagnet";
import { silkTouchGetSpawners, silkTouchGetBuddingAmethyst } from "addon/features/server/silkTouch";

Packet.on("before::playerBreakBlock", (Event: PlayerBreakBlockBeforeEvent) => {
  silkTouchGetSpawners(Event);
  silkTouchGetBuddingAmethyst(Event);
  itemMagnetBreakEvent(Event);
});