import { ExplosionBeforeEvent } from "@minecraft/server";
import { Packet } from "../../~/server";

import tntTweaks from "../features/server/tntTweaks";

Packet.on("before::explosion", function(Event: ExplosionBeforeEvent) {
  tntTweaks(Event);
});