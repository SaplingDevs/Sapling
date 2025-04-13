import { PlayerBreakBlockBeforeEvent } from "@minecraft/server";
import { silkTouchGetSpawners, silkTouchGetBuddingAmethyst } from "addon/features/server/silkTouch";
import { Packet } from "~/server";

Packet.on("before::playerBreakBlock", (Event: PlayerBreakBlockBeforeEvent) => {
  silkTouchGetSpawners(Event);
  silkTouchGetBuddingAmethyst(Event);
});