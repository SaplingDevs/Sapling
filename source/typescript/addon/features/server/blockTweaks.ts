import { EntityDieAfterEvent, PistonActivateAfterEvent, system, world } from "@minecraft/server";
import { Utils } from "classes/Utils";
import { ServerFeatures } from "config/gamerules";
import { BlockStepLocation } from "types";
import { PistonAssets, PistonDirections, Vector3 } from "~/server";


export function renewableSoulSand(Event: EntityDieAfterEvent) {
  if (!ServerFeatures.DataBase.get("renewablesoulsand")) return;
  
	const MOBS = [ "minecraft:zombie", "minecraft:skeleton", "minecraft:stray", "minecraft:enderman" ];
	
	if (!['fireTick','fire'].includes(Event.damageSource.cause)) return;
	else if (!MOBS.includes(Event.deadEntity.typeId)) return;
	
	Event.deadEntity.runCommand('execute if block ~~-1~ sand run setblock ~~-1~ soul_sand [] replace');
}

export async function railDuping({ piston }: PistonActivateAfterEvent) {
  if (!ServerFeatures.DataBase.get("railduping")) return;

  const State = piston.state;
  const PistonBlock = piston.block;
  const Facing = PistonDirections[PistonBlock.permutation.getState('facing_direction')];
  const Assets = PistonAssets[`${Facing}:${State}`];
  const Locations = piston.getAttachedBlocksLocations()
  const Blocks = [];

  for (const loc of Locations) {
    const BlockLoc = new Vector3(
      loc.x + Assets[0], 
      loc.y + Assets[1],
      loc.z + Assets[2]
    );
    
    Blocks.push(BlockLoc);
  }

  await system.waitTicks(2);

  const Rails = Blocks
    .map(loc => PistonBlock.dimension.getBlock(loc))
    .filter(b => b.typeId.includes('rail'));
    
  for (const rail of Rails) {
    const sides = [ 'up', 'down', 'north', 'south', 'east', 'west' ]
      .map(dir => Utils.blockStep(rail, dir as BlockStepLocation).typeId);
      
    if (!sides.includes('minecraft:bell')) continue;
    
    const ItemStack = rail.getItemStack();
    rail.dimension.spawnItem(ItemStack, rail.location);
  }
}

export async function pistonSpongeDrying({ piston }: PistonActivateAfterEvent) {
  if (!ServerFeatures.DataBase.get("pistonspongedrying")) return;

  const State = piston.state;
  const PistonBlock = piston.block;
  const Facing = PistonDirections[PistonBlock.permutation.getState('facing_direction')];
  const Assets = PistonAssets[`${Facing}:${State}`];
  const Locations = piston.getAttachedBlocksLocations()
  const Blocks = [];

  for (const loc of Locations) {
    const BlockLoc = new Vector3(
      loc.x + Assets[0], 
      loc.y + Assets[1],
      loc.z + Assets[2]
    );
    
    Blocks.push(BlockLoc);
  }

  await system.waitTicks(2);

  const Sponges = Blocks
    .map(loc => PistonBlock.dimension.getBlock(loc))
    .filter(b => b.typeId == 'minecraft:wet_sponge');
    
  for (const sponge of Sponges) sponge.setType('minecraft:sponge');
}

export async function renewableDeepslate({ piston }: PistonActivateAfterEvent) {
  if (!ServerFeatures.DataBase.get("renewabledeepslate")) return;

  const State = piston.state;
  const PistonBlock = piston.block;
  const Facing = PistonDirections[PistonBlock.permutation.getState('facing_direction')];
  const Assets = PistonAssets[`${Facing}:${State}`];
  const Locations = piston.getAttachedBlocksLocations()
  const Blocks = [];

  for (const loc of Locations) {
    const BlockLoc = new Vector3(
      loc.x + Assets[0], 
      loc.y + Assets[1],
      loc.z + Assets[2]
    );
    
    Blocks.push(BlockLoc);
  }

  await system.waitTicks(2)

  const Basalt = Blocks
    .map(loc => PistonBlock.dimension.getBlock(loc))
    
  for (const block of Basalt) {
    const { typeId, location } = block;
    const IsDeepslatePerm = typeId === 'minecraft:basalt' && location.y < 0;
    
    if (IsDeepslatePerm) block.setType('minecraft:deepslate');
  }
}


// 2 Ticks
export function endPortalGBD() {
  if (!ServerFeatures.DataBase.get("endportalgbd")) return;
  const ov = world.getDimension("overworld");

  ov.runCommand('execute at @e[type=falling_block] if block ~~-2~ end_portal run clone ~~~ ~~~ ~~1~ replace normal');
}