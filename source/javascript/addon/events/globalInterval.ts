import { system } from "@minecraft/server";
import { cauldronConversion } from "addon/features/server/cauldron";
import * as instamine from "addon/features/server/instamine";

let tick = 0;

system.runInterval(() => {
  cauldronConversion();


  // 2 tick
  if (tick % 2 === 0) {
    instamine.instamineObsidian();
    instamine.instamineDeepslate();
    instamine.instamineEndstone();
  }

  // Tick increment & reset
  tick++;
  if (tick > 100) tick = 0;
}, 1);
