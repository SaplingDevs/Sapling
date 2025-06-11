import {
  Entity,
  EntitySpawnAfterEvent,
  FluidType,
  ItemStack,
  world,
} from "@minecraft/server";
import { ServerFeatures } from "config/gamerules";

const CONVERSION_DURATION = 140;
const conversions: Record<string, number> = {};
const dims = ["overworld", "nether", "the_end"];

type ConversionConfig = {
  enabled: () => boolean;
  tag: string;
  check: (item: ItemStack) => boolean;
  finalize: (entity: Entity) => void;
};

const conversionTypes: ConversionConfig[] = [
  {
    enabled: () => ServerFeatures.DataBase.get("cauldronconcrete") as boolean,
    tag: "cc:concrete_powder",
    check: item => item?.typeId.includes("concrete_powder"),
    finalize: finalizeConversionConcrete,
  },
  {
    enabled: () => ServerFeatures.DataBase.get("cauldronmud") as boolean,
    tag: "cc:dirt_to_mud",
    check: item => item?.typeId === "minecraft:dirt",
    finalize: finalizeConversionMud,
  },
];

export function cauldronConcrete(event: EntitySpawnAfterEvent) {
  try {
    const item = event.entity?.getComponent("item")?.itemStack;
    if (!item) return;

    const config = conversionTypes[0];
    if (config.enabled() && config.check(item)) {
      event.entity.addTag(config.tag);
    }
  } catch {}
}

export function cauldronMud(event: EntitySpawnAfterEvent) {
  try {
    const item = event.entity?.getComponent("item")?.itemStack;
    if (!item) return;

    const config = conversionTypes[1];
    if (config.enabled() && config.check(item)) {
      event.entity.addTag(config.tag);
    }
  } catch {}
}

export function cauldronConversion() {
  for (const config of conversionTypes) {
    if (!config.enabled()) continue;

    for (const id of dims) {
      const items = world.getDimension(id).getEntities({
        type: "minecraft:item",
        tags: [config.tag],
      });

      for (const item of items) {
        if (!checkWaterCauldron(item) || !processConversion(item)) continue;
        config.finalize(item);
      }
    }
  }
}

// utils
function checkWaterCauldron(entity: Entity) {
  const block = entity.dimension.getBlock(entity.location)?.getComponent("fluid_container");
  return block?.getFluidType() === FluidType.Water && block.fillLevel === 6;
}

function processConversion(entity: Entity) {
  const id = entity.id;
  conversions[id] = (conversions[id] || 0) + 1;
  return conversions[id] >= CONVERSION_DURATION;
}

function finalizeConversionConcrete(entity: Entity) {
  const { typeId, amount } = entity.getComponent("item").itemStack;
  const { location, dimension } = entity;
  const velocity = entity.getVelocity();

  entity.remove();
  const newEntity = dimension.spawnItem(new ItemStack(typeId.replace("_powder", ""), amount), location);
  newEntity.clearVelocity();
  newEntity.applyImpulse(velocity);
  dimension.spawnParticle("minecraft:cauldron_explosion_emitter", location);
  dimension.playSound("brush.generic", location);
  delete conversions[entity.id];
}

function finalizeConversionMud(entity: Entity) {
  const { amount } = entity.getComponent("item").itemStack;
  const { location, dimension } = entity;
  const velocity = entity.getVelocity();

  entity.remove();
  const newEntity = dimension.spawnItem(new ItemStack("minecraft:mud", amount), location);
  newEntity.clearVelocity();
  newEntity.applyImpulse(velocity);
  dimension.spawnParticle("minecraft:cauldron_explosion_emitter", location);
  dimension.playSound("brush.generic", location);
  delete conversions[entity.id];
}
