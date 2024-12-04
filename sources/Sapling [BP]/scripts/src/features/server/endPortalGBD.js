import { world, system } from "@script-api/server.js";
import { JsonDB } from "@script-api/sapling.js";

export default { packet: 'none' }

system.interval(() => {
    const enable = (new JsonDB('ServerGamerules')).get('endPortalGBD');
    if (!enable) return;

    world.runCommand('execute at @e[type=falling_block] if block ~~-2~ end_portal run clone ~~~ ~~~ ~~1~ replace normal');
}, 2)