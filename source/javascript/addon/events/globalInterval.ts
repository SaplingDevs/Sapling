import { system } from "@minecraft/server";
import { cauldronConversion } from "addon/features/server/cauldron";
import * as instamine from "addon/features/server/instamine";
import * as entity from "addon/features/server/entityTweaks";

let tick = 0;

system.runInterval(() => {
  cauldronConversion();


  // 2 Ticks
  if (tick % 2 === 0) {
    instamine.instamineObsidian();
    instamine.instamineDeepslate();
    instamine.instamineEndstone();
    
    entity.entityCramming();
    entity.pigmanFarmWarts();
  }

  // 5 Ticks
  if (tick % 5 === 0) {
    entity.infiniteTrades();
  }

  // 10 Ticks
  if (tick % 10 === 0) {
    entity.ravagerDestroyCherryLeaves();
  }


  // Tick increment & reset
  tick++;
  if (tick > 100) tick = 0;
}, 1);
