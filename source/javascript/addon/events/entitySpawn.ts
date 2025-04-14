import { EntitySpawnAfterEvent } from "@minecraft/server";
import { Packet } from "~/server";

import { tntDuping, tntDispenserRefill } from "addon/features/server/tntDuping";
import { anvilBedrockBreaker } from "addon/features/server/bedrockBreaker";
import { cauldronConcrete, cauldronMud } from "addon/features/server/cauldron";
import { dispensableBlocks, dispenserBadOmen, blazeMeal } from "addon/features/server/dispenser";
import { phantomDisable } from "addon/features/server/entityTweaks";

Packet.on("entitySpawn", function(Event: EntitySpawnAfterEvent){
  tntDuping(Event);
  tntDispenserRefill(Event);
  anvilBedrockBreaker(Event);
  cauldronConcrete(Event);
  cauldronMud(Event);
  dispensableBlocks(Event);
  dispenserBadOmen(Event);
  phantomDisable(Event);
  blazeMeal(Event);
});