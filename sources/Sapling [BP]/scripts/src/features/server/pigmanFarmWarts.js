import { world, system } from "@script-api/server.js";
import { JsonDB } from "@script-api/sapling.js";

export default { packet: 'none' }

system.interval(() => {
    const enable = (new JsonDB('ServerGamerules')).get('pigmanFarmWarts');
    if (!enable) return;

    world.runCommand('execute at @e[type=zombie_pigman] if block ~~1~ nether_wart ["age": 3] run setblock ~~1~ nether_wart destroy');
}, 2)