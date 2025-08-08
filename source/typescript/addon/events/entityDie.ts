import { EntityDieAfterEvent } from "@minecraft/server";
import { Packet } from "~/server";

import * as lootTables from "addon/features/server/lootTables";
import { renewableSoulSand } from "addon/features/server/blockTweaks";

Packet.on("entityDie", function(Event: EntityDieAfterEvent){
  renewableSoulSand(Event);

  lootTables.huskDropSand(Event);
  lootTables.guardianDropSponges(Event);
  lootTables.ghastDropQuartz(Event);
  lootTables.silverfishDropGravel(Event);
});