import { EntitySpawnAfterEvent } from "@minecraft/server";
import { Packet } from "~/server";

import tntDuping from "addon/features/server/tntDuping";
import { anvilBedrockBreaker } from "addon/features/server/bedrockBreaker";
import { cauldronConcrete, cauldronMud } from "addon/features/server/cauldron";

Packet.on("entitySpawn", function(Event: EntitySpawnAfterEvent){
  tntDuping(Event)
  anvilBedrockBreaker(Event);
  cauldronConcrete(Event);
  cauldronMud(Event);
});