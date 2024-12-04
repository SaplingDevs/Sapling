import { world, system } from "@script-api/server.js";

// Tool Changer
const materialTools = [ 'wood', 'stone', 'iron', 'gold', 'diamond', 'netherite' ];
const BlockFilters = {
    shovel: [ 
        'tag:sand', 'tag:gravel', 'tag:dirt', 'tag:grass',
        'regex:*concrete_powder',
        'minecraft:soul_soil', 'mineacraft:soul_sand', 'minecraft:clay'
    ],
    pickaxe: [
        'tag:stone', 'tag:metal',
        ...[...materialTools].map(_ => 'tag:' + _ + '_pick_diggable'),

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

// 'regex:*', 'minecraft:', 'tag:',
const validTools = [ 'sword', 'pickaxe', 'shovel', '_axe', 'hoe', 'shears' ];
function toolChanger(player) {
    const blockHit = player.getBlockFromViewDirection({ maxDistance: 10 });
    if (!blockHit) return;

    const inventory = player.getComponent('inventory').container;
    const block = blockHit.block;

    const blockId = block.typeId;
    const blockTags = getBlockTags(block);
    const blockRegex = getBlockRegex(block);

    const data = [ blockId, ...blockTags, blockRegex ];

    // Get Tool
    const isShovel = BlockFilters.shovel.some(_ => data.includes(_));
    const isPickaxe = BlockFilters.pickaxe.some(_ => data.includes(_));
    const isAxe = BlockFilters._axe.some(_ => data.includes(_));
    const isSword = BlockFilters.sword.some(_ => data.includes(_));
    const isHoe = BlockFilters.hoe.some(_ => data.includes(_));
    const isShears = BlockFilters.shears.some(_ => data.includes(_));

    const tool = 
        isShovel ? 'shovel' :
        isPickaxe ? 'pickaxe' :
        isSword ? 'sword' :
        isAxe ? '_axe' : 
        isHoe ? 'hoe' : 
        isShears ? 'shears' : 'hand';

    
    if (tool !== 'hand') {
        for (let i=1; i<inventory.size; i++) {
            let slot = inventory.getItem(i);
            if (!slot) continue;

            const isTool = validTools.some(_ => slot.typeId.includes(_));
            if (!isTool) continue;

            const isValidTool = slot.typeId.includes(tool);
            if (!isValidTool) continue;

            return inventory.swapItems(0, i, inventory);
        }
    }
}


function getBlockTags(block) {
    const tags = block.getTags().map(_ => 'tag:' + _);
    return tags;
}

function getBlockRegex(block) {
    const blockId = block.typeId;
    const blockTypes = [ 
        'concrete_powder', 'terracotta', 'ore',  'cobblestone', 
        'deepslate', 'wool', 'purpur', 'brick', 'sandstone',
        'stone', 'prismarine', 'quartz', 'fence', 'iron', 'copper',
        '_door', 'leave', 'tuff', 'slab', 'nylium', 'wart', 'amethyst',
        'basalt', 'ice', 'book', 'chest', 'anvil', 'bamboo', 'hyphae',
        'stem', 'sensor', 'piston', 'repeater', 'comparator', 'plank'
    ];

    const regex = blockTypes.find(type => blockId.includes(type));
    return regex ? `regex:*${regex}` : '';
}




// Manage Players
system.interval(() => {
    const toolChangerPlayers = world.getPlayers({ 
        tags: [ 'client:toolChanger' ]
    });

    toolChangerPlayers.forEach(p => toolChanger(p));
}, 4);