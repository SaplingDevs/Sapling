import { EntitySpawnAfterEvent } from "@minecraft/server";
import { Packet } from "~/server";

import tntDuping from "addon/features/server/tntDuping";
import { anvilBedrockBreaker } from "addon/features/server/bedrockBreaker";

Packet.on("entitySpawn", function(Event: EntitySpawnAfterEvent){
  tntDuping(Event)
  anvilBedrockBreaker(Event);
});