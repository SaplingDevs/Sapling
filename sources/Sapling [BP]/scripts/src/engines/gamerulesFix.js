import { world, system } from "@script-api/server.js";
import { JsonDB } from "@script-api/sapling.js";

system.interval(() => {
    if (!(new JsonDB('EngineGamerules').get('gamerulesFix'))) return;
    
    world.gameRules.randomTickSpeed = 1;
    world.gameRules.doMobSpawning = true;
    world.gameRules.doDayLightCycle = true;
}, 10);