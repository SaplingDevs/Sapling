import { EntitySpawnAfterEvent } from "@minecraft/server";
import { Packet } from "~/server";

import tntDuping from "addon/features/server/tntDuping";

Packet.on("entitySpawn", function(Event: EntitySpawnAfterEvent){
  tntDuping(Event)
});