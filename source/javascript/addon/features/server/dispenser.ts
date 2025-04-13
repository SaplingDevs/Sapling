import { Block, EntitySpawnAfterEvent, ItemStack } from "@minecraft/server";
import { Utils } from "classes/Utils";
import { ServerFeatures } from "config/gamerules";
import { BlockStepLocation } from "types";

export function dispenserBadOmen(event: EntitySpawnAfterEvent) {
  if (!isFeatureEnabled("dispensablebadomen")) return;
  else if (event.entity.typeId !== "minecraft:item") return;

  try {
    const item = event.entity.getComponent("item").itemStack;

    if (item.typeId !== "minecraft:ominous_bottle") return;
    if (item.amount > 1) return;

    const block = event.entity.dimension.getBlock(event.entity.location);

    const dispensers = getNearbyDispensers(block);
    if (dispensers.length === 0) return;

    event.entity.runCommand("effect @a[r=8] bad_omen 6000");
    event.entity.runCommand("summon splash_potion ~~~");
    event.entity.kill();
  } catch {}
}

export function dispensableBlocks(event: EntitySpawnAfterEvent) {
  if (!isFeatureEnabled("dispensableblocks")) return;
  else if (event.entity.typeId !== "minecraft:item") return;

  try {
    const item = event.entity.getComponent("item").itemStack;
    const itemRegex = getBlockRegex(item);

    if (!Blocks.includes(itemRegex) || item.amount > 1) return;

    const block = event.entity.dimension.getBlock(event.entity.location);
    if (!block.isAir) return;
    if (itemRegex in NotAirBlocks && !NotAirBlocks[itemRegex](block)) return;

    const dispensers = getNearbyDispensers(block);
    if (dispensers.length === 0) return;

    const blockId = item.typeId;
    block.setType(CustomBlockTypes[blockId] ?? blockId);
    event.entity.kill();
  } catch {}
}

// Utils
function isFeatureEnabled(name: string) {
  return ServerFeatures.DataBase.get(name);
}

function getNearbyDispensers(block: Block) {
  return ["up", "down", "north", "south", "east", "west"]
    .map(dir => Utils.blockStep(block, dir as BlockStepLocation))
    .filter(b => b.typeId === "minecraft:dispenser");
}

function getBlockRegex(item: ItemStack) {
  const blockId = item.typeId;
  const regex = BlockTypeKeys.find(type => blockId.includes(type));
  return regex ? `regex:*${regex}` : "";
}

// Configs
const BlockTypeKeys = [
  "concrete_powder", "sand", "anvil", "sapling", "ice",
  "rail", "propagule", "carrot", "potato", "seeds", "gravel", "dragon",
];

const Blocks = BlockTypeKeys.map(k => `regex:*${k}`);

const NotAirBlocks: Record<string, (block: Block) => boolean> = {
  "regex:*rail": block => !Utils.blockStep(block, "down" as BlockStepLocation).isAir,
  "regex:*sapling": block => Utils.blockStep(block, "down" as BlockStepLocation).hasTag("dirt"),
  "regex:*propagule": block => Utils.blockStep(block, "down" as BlockStepLocation).hasTag("dirt"),
  "regex:*seeds": block => Utils.blockStep(block, "down" as BlockStepLocation).typeId.includes("farmland"),
  "regex:*carrot": block => Utils.blockStep(block, "down" as BlockStepLocation).typeId.includes("farmland"),
  "regex:*potato": block => Utils.blockStep(block, "down" as BlockStepLocation).typeId.includes("farmland"),
};

const CustomBlockTypes: Record<string, string> = {
  "minecraft:wheat_seeds": "minecraft:wheat",
  "minecraft:potato": "minecraft:potatoes",
  "minecraft:carrot": "minecraft:carrots",
  "minecraft:beetroot_seeds": "minecraft:beetroot",
  "minecraft:torchflower_seeds": "minecraft:torchflower_crop",
  "minecraft:melon_seeds": "minecraft:melon_stem",
  "minecraft:pumpkin_seeds": "minecraft:pumpkin_stem",
};
