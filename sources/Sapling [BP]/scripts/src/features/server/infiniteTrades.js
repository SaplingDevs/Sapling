import { world, system } from "@script-api/server.js";
import { JsonDB } from "@script-api/sapling.js";

export default { packet: 'none' }

let tick = false;
system.interval(() => {
    if (!(new JsonDB('ServerGamerules')).get('infiniteTrades')) return;

    const villagers = world.dimension.overworld.getEntities({
        type: 'villager_v2',
        name: 'infinite'
    });

    for (const v of villagers) {
        v.triggerEvent(tick ? 'minecraft:schedule_bed_villager' : 'minecraft:resupply_trades');
    }

    tick = !tick;

}, 5);