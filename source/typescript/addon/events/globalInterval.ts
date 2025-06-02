import { system } from "@minecraft/server";

import * as instamine from "addon/features/server/instamine";
import * as entity from "addon/features/server/entityTweaks";
import { endPortalGBD } from "addon/features/server/blockTweaks";
import { cauldronConversion } from "addon/features/server/cauldron";
import { stoneCutterDamage } from "addon/features/server/damageTweaks";
import toolChanger from "addon/features/client/toolChanger";
import xpBarMending from "addon/features/client/xpBarMending";

let tick = 0;

system.runInterval(() => {
  cauldronConversion();
  xpBarMending();

  // 2 Ticks
  if (tick % 2 === 0) {
    instamine.instamineObsidian();
    instamine.instamineDeepslate();
    instamine.instamineEndstone();
    
    entity.entityCramming();
    entity.pigmanFarmWarts();

    endPortalGBD();

    stoneCutterDamage();
  }

  // 4 Ticks
  if (tick % 4 === 0) {
    toolChanger();
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
