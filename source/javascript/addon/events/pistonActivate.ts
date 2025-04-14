import { PistonActivateAfterEvent } from "@minecraft/server";
import { Packet } from "~/server";

import { pistonSpongeDrying, railDuping, renewableDeepslate } from "addon/features/server/blockTweaks";

Packet.on("pistonActivate", (Event: PistonActivateAfterEvent) => {
  railDuping(Event);
  renewableDeepslate(Event);
  pistonSpongeDrying(Event);
});