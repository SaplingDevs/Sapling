import { world, system } from "@minecraft/server";
import type { Player, Block } from "@minecraft/server"

// Tool Changer
const materialTools = [ 'wood', 'stone', 'iron', 'gold', 'diamond', 'netherite' ];

const BlockFilters: Record<string, string[]> = {
  shovel: [ 
    'tag:sand', 'tag:gravel', 'tag:dirt', 'tag:grass',
    'regex:*concrete_powder',
    'minecraft:soul_soil', 'mineacraft:soul_sand', 'minecraft:clay'
  ],
  pickaxe: [
    'tag:stone', 'tag:metal',
    ...materialTools.map(mat => `tag:${mat}_pick_diggable`),
    'regex:*terracotta', 'regex:*ore', 'regex:*cobblestone', 
    'regex:*deepslate', 'regex:*brick', 'regex:*purpur',
    'regex:*stone', 'regex:*sandstone', 'regex:*prismarine',
    'regex:*quartz', 'regex:*iron', 'regex:*copper', 'regex:*tuff', 
    'regex:*nylium', 'regex:*amethyst', 'regex:*basalt', 'regex:*ice',
    'regex:*anvil', 'regex:piston', 'regex:*sensor', 
    'minecraft:ancient_debris', 'minecraft:calcite', 'minecraft:magma',
    'minecraft:ender_chest', 'minecraft:sculk_shrieker', 'minecraft:sculk_catalyst', 
  ],
  _axe: [
    'tag:wood', 'tag:*trapdoors', 'tag:pumpkin',
    'regex:*fence', 'regex:*_door', 'regex:*slab',
    'regex:*book', 'regex:*chest', 'regex:*bamboo',
    'regex:*stripped', 'regex:*hyphae', 'regex:*stem',
    'regex:*plank'
  ],
  sword: [
    'minecraft:bamboo', 'minecraft:slime', 
    'minecraft:honey', 'minecraft:tnt', 
  ],
  hoe: [
    'tag:minecraft:crop',
    'regex:*wart',
    'minecraft:hay_block', 'minecraft:sculk', 
  ],
  shears: [
    'regex:*wool', 'regex:*leave',
    'minecraft:vine', 'minecraft:seagrass', 'minecraft:web',
    'minecraft:sculk_vein', 
  ]
};

const validTools = [ 'sword', 'pickaxe', 'shovel', '_axe', 'hoe', 'shears' ];

function toolChangerFunction(player: Player) {
  const blockHit = player.getBlockFromViewDirection({ maxDistance: 10 });
  if (!blockHit) return;

  const inventory = player.getComponent("inventory")?.container;
  if (!inventory) return;

  const block = blockHit.block;
  const blockId = block.typeId;
  const blockTags = getBlockTags(block);
  const blockRegex = getBlockRegex(block);
  const data = [blockId, ...blockTags, blockRegex];

  // Determine tool type
  const isShovel = BlockFilters.shovel.some(id => data.includes(id));
  const isPickaxe = BlockFilters.pickaxe.some(id => data.includes(id));
  const isAxe = BlockFilters._axe.some(id => data.includes(id));
  const isSword = BlockFilters.sword.some(id => data.includes(id));
  const isHoe = BlockFilters.hoe.some(id => data.includes(id));
  const isShears = BlockFilters.shears.some(id => data.includes(id));

  const tool = (
    isShovel ? 'shovel' :
    isPickaxe ? 'pickaxe' :
    isSword ? 'sword' :
    isAxe ? '_axe' :
    isHoe ? 'hoe' :
    isShears ? 'shears' : 'hand'
  );

  if (tool !== 'hand') {
    for (let i = 1; i < inventory.size; i++) {
      const slot = inventory.getItem(i);
      if (!slot) continue;

      const isTool = validTools.some(t => slot.typeId.includes(t));
      if (!isTool) continue;

      const isCorrectTool = slot.typeId.includes(tool);
      if (!isCorrectTool) continue;

      inventory.swapItems(0, i, inventory);
      return;
    }
  }
}

function getBlockTags(block: Block): string[] {
  return block.getTags().map(tag => `tag:${tag}`);
}

function getBlockRegex(block: Block): string {
  const blockId = block.typeId;
  const patterns = [ 
    'concrete_powder', 'terracotta', 'ore',  'cobblestone', 
    'deepslate', 'wool', 'purpur', 'brick', 'sandstone',
    'stone', 'prismarine', 'quartz', 'fence', 'iron', 'copper',
    '_door', 'leave', 'tuff', 'slab', 'nylium', 'wart', 'amethyst',
    'basalt', 'ice', 'book', 'chest', 'anvil', 'bamboo', 'hyphae',
    'stem', 'sensor', 'piston', 'repeater', 'comparator', 'plank'
  ];
  const match = patterns.find(type => blockId.includes(type));
  return match ? `regex:*${match}` : '';
}

// Tick interval
export default function toolChanger() {
  const ParsedPlayers = world.getPlayers({ tags: [ 'client:toolChanger' ] });
  ParsedPlayers.forEach(player => toolChangerFunction(player));
}