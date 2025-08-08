import { EntityDamageCause, EntityHitEntityAfterEvent, Player } from "@minecraft/server";
import { Utils } from "classes/Utils";
import { ServerFeatures } from "config/gamerules";

export function stoneCutterDamage() {
  if (!ServerFeatures.DataBase.get("stonecutterdamage")) return;
  
  try {
    const damageEntities = Utils.getAllEntities({ excludeTypes: [ 'item', 'armor_stand', 'minecart', 'xp_orb' ] })
      .filter((e) => e.dimension.getBlock(e.location).typeId === "minecraft:stonecutter_block");

    for (let entity of damageEntities) {
      entity.applyDamage(4)
    }
  } catch {}
}

const SwordsDamage = {
  'minecraft:wooden_sword': 6.4,
  'minecraft:golden_sword': 6.4,
  'minecraft:stone_sword': 8,
  'minecraft:iron_sword': 9.6,
  'minecraft:diamond_sword': 11.2,
  'minecraft:netherite_sword': 12.8,
}

const clicks = new Map();
export function sweepingEdge({ damagingEntity, hitEntity }: EntityHitEntityAfterEvent) {
  if (!ServerFeatures.DataBase.get("sweepingedge")) return;
  
  try {
      if (damagingEntity.typeId !== 'minecraft:player') return;
      
      // Track Clicks
      const clickInfo = { timestamp: Date.now() };
      const playerClicks = clicks.get(damagingEntity) || [];
      playerClicks.push(clickInfo);
      clicks.set(damagingEntity, playerClicks);

      // Sweeping Edge
      if (getPlayerCPS(damagingEntity as Player) > 1) return;

      const loc = hitEntity.location;
      const dim = hitEntity.dimension;

      const entities = dim.getEntities({
          location: loc,
          maxDistance: 2,
          excludeTypes: [ 'minecraft:armor_stand' ],
          excludeFamilies: [ 'minecart' ],
      });

      const player = damagingEntity as Player;
      const inv = damagingEntity.getComponent('inventory').container;
      const item = inv.getItem(player.selectedSlotIndex);

      if (!item?.typeId || !SwordsDamage[item.typeId]) return;

      const damage = SwordsDamage[item.typeId] * (Math.random() < 0.5 ? 0.5 : 0.75)

      for (const e of entities) {
          if (e.id === damagingEntity.id || e.id === hitEntity.id) continue;

          e.applyDamage(damage, { cause: EntityDamageCause.entityAttack, damagingEntity });
      }
  } catch {}
}

// Config 
function getPlayerCPS(player: Player) {
  const currentTime = Date.now();
  const playerClicks = clicks.get(player) || [];
  const recentClicks = playerClicks.filter(({ timestamp }) => currentTime - 1000 < timestamp);
  clicks.set(player, recentClicks);
  return recentClicks.length;
}