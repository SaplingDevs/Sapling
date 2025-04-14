import { Dimension, EntityDieAfterEvent, EntitySpawnAfterEvent, world } from "@minecraft/server";
import { Utils } from "classes/Utils";
import { ServerFeatures } from "config/gamerules";
import { BlockStepLocation } from "types";


export function phantomDisable({ entity }: EntitySpawnAfterEvent) {
  if (!ServerFeatures.DataBase.get("phantomdisable")) return;

  if (entity.typeId !== 'minecraft:phantom') return;
  entity.remove();
}



export function blazeMeal(Event: EntitySpawnAfterEvent) {
  if (!ServerFeatures.DataBase.get("blazemeal")) return;

  try {
    if (Event.entity.typeId !== 'minecraft:item') return;
    const item = Event.entity.getComponent('item').itemStack;
    
    if (item.typeId !== 'minecraft:blaze_powder') return;
    else if (item.amount > 1) return;
    
    const _b = Event.entity.dimension.getBlock(Event.entity.location);
    if (_b.typeId !== 'minecraft:nether_wart') return;
        
    const blocks = [ 'up', 'north', 'south', 'east', 'west']
      .map(side => Utils.blockStep(_b, side as BlockStepLocation))
      .filter(b => b.typeId == 'minecraft:dispenser');
    
    if (blocks.length <= 0) return;
    
    // Place new wart 
    const { x, y, z } = _b.location
    
    Event.entity.runCommand(`execute positioned ${x} ${y} ${z} if block ~~~ nether_wart["age" = 2] run setblock ~~~ nether_wart["age" = 3]`)
    Event.entity.runCommand(`execute positioned ${x} ${y} ${z} if block ~~~ nether_wart["age" = 1] run setblock ~~~ nether_wart["age" = 2]`)
    Event.entity.runCommand(`execute positioned ${x} ${y} ${z} if block ~~~ nether_wart["age" = 0] run setblock ~~~ nether_wart["age" = 1]`)
    Event.entity.runCommand(`particle minecraft:crop_growth_emitter ${x} ${y} ${z}`)
    
    Event.entity.kill();
  } catch {}
}



export function oldPillagerMethod(Event: EntityDieAfterEvent) {
  if (!ServerFeatures.DataBase.get("oldpillagermethod")) return;
	if (Event.deadEntity.typeId !== 'minecraft:pillager') return;

	const player = Event.damageSource.damagingEntity;
	const entity = Event.deadEntity;
	
	const items = entity.dimension.getEntities({
		location: entity.location,
		maxDistance: 4,
		type: 'minecraft:item'
	});
	
	for (const itemEntity of items) {
		const item = itemEntity.getComponent('item').itemStack;
		
		if (item.typeId !== 'minecraft:ominous_bottle') continue;
		
		player.runCommand('effect @s bad_omen 6000');
		itemEntity.kill();
	}
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
const ov = world.getDimension("overworld");

export function entityCramming() {
  const Enabled = !ServerFeatures.DataBase.get("entitycramming");
  if (Enabled) return ov.runCommand('scoreboard objectives remove SaplingDG');

  ov.runCommand('scoreboard objectives add SaplingDG dummy')

  ov.runCommand('scoreboard players reset * SaplingDG');
  ov.runCommand('execute at @e[type=!item,type=!xp_orb,type=!minecart] unless block ~~~ vine run scoreboard players add @e[r=1,type=!item,type=!xp_orb,type=!minecart] SaplingDG 1');
  ov.runCommand('damage @e[scores={SaplingDG=20..100000000}] 6 contact');
}


export function pigmanFarmWarts() {
  if (!ServerFeatures.DataBase.get("pigmanfarmwarts")) return;

  ov.runCommand('execute at @e[type=zombie_pigman] if block ~~1~ nether_wart ["age" = 3] run setblock ~~1~ nether_wart destroy');
}



// 10 Ticks
export function ravagerDestroyCherryLeaves() {
  if (!ServerFeatures.DataBase.get("ravagerdestroycherryleaves")) return;
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