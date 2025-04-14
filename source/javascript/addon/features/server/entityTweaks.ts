import { Dimension, EntitySpawnAfterEvent, world } from "@minecraft/server";
import { ServerFeatures } from "config/gamerules";


export function phantomDisable({ entity }: EntitySpawnAfterEvent) {
  if (!ServerFeatures.DataBase.get("phantomdisable")) return;

  if (entity.typeId !== 'minecraft:phantom') return;
  entity.remove();
}


// 5 Ticks
let tradeTick = false;
export function infiniteTrades() {
  if (!ServerFeatures.DataBase.get("infinitetrades")) return;

  const villagers = world.getDimension("overworld").getEntities({
    type: 'villager_v2',
    name: 'infinite'
  });

  for (const v of villagers) {
    v.triggerEvent(tradeTick ? 'minecraft:schedule_bed_villager' : 'minecraft:resupply_trades');
  }

  tradeTick = !tradeTick;
}



// 2 Ticks
export function entityCramming() {
  const ov = world.getDimension("overworld");
  const Enabled = !ServerFeatures.DataBase.get("entitycramming");
  if (Enabled) return ov.runCommand('scoreboard objectives remove SaplingDG');

  ov.runCommand('scoreboard objectives add SaplingDG dummy')

  ov.runCommand('scoreboard players reset * SaplingDG');
  ov.runCommand('execute at @e[type=!item,type=!xp_orb,type=!minecart] unless block ~~~ vine run scoreboard players add @e[r=1,type=!item,type=!xp_orb,type=!minecart] SaplingDG 1');
  ov.runCommand('damage @e[scores={SaplingDG=20..100000000}] 6 contact');
}


export function pigmanFarmWarts() {
  if (!ServerFeatures.DataBase.get("pigmanfarmwarts")) return;
  const ov = world.getDimension("overworld");
  ov.runCommand('execute at @e[type=zombie_pigman] if block ~~1~ nether_wart ["age" = 3] run setblock ~~1~ nether_wart destroy');
}



// 10 Ticks
export function ravagerDestroyCherryLeaves() {
  if (!ServerFeatures.DataBase.get("ravagerdestroycherryleaves")) return;

  const ov = world.getDimension("overworld");
  const ravagers = ov.getEntities({ type: 'minecraft:ravager' });

  for (let _r of ravagers) {
    const { location, dimension } = _r;
    let x = location.x - 1;
    let y = location.y;
    let z = location.z - 1;
      
    for (let i=0; i<3; i++) {
      for (let j=0; j<3; j++) {
        for (let k=0; k<3; k++) {
          replaceBlock(x+j, y+i, z+k, dimension);
        }
      }
    }
	}
}

function replaceBlock(x: number, y: number, z: number, d: Dimension) {
	let loc = { x, y, z };
	let b = d.getBlock(loc);
	if (b.typeId == 'minecraft:cherry_leaves') b.setType('minecraft:air');
}