import { world, system } from "@script-api/server.js";
import { JsonDB } from "@script-api/sapling.js";

export default { packet: 'none' }

system.interval(() => {
    const enable = (new JsonDB('ServerGamerules')).get('entityCramming');
    if (!enable) return world.runCommand('scoreboard objectives remove SaplingDG');

    world.runCommand('scoreboard objectives add SaplingDG dummy')

    world.runCommand('scoreboard players reset * SaplingDG');
	world.runCommand('execute at @e[type=!item,type=!xp_orb,type=!minecart] unless block ~~~ vine run scoreboard players add @e[r=1,type=!item,type=!xp_orb,type=!minecart] SaplingDG 1');
	world.runCommand('damage @e[scores={SaplingDG=24..100000000}] 6 contact');
}, 2)