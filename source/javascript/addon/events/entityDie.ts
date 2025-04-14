import { EntityDieAfterEvent } from "@minecraft/server";
import { Packet } from "~/server";

import * as lootTables from "addon/features/server/lootTables";
import { oldPillagerMethod } from "addon/features/server/entityTweaks";

Packet.on("entityDie", function(Event: EntityDieAfterEvent){
  oldPillagerMethod(Event);
  
  lootTables.huskDropSand(Event);
  lootTables.guardianDropSponges(Event);
  lootTables.ghastDropQuartz(Event);
  lootTables.silverfishDropGravel(Event);
});