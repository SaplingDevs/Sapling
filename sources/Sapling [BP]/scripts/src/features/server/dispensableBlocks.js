import { Utils } from "@script-api/sapling.js";

const Blocks = [ 
    'regex:*concrete_powder', 'regex:*sand', 'regex:*anvil', 
    'regex:*sapling', 'regex:*ice', 'regex:*propagule',
    'regex:*rail', 'regex:*carrot', 'regex:*potato', 
    'regex:*seeds'
];

const NotAirBlocks = {
    'regex:*rail': (block) => !Utils.blockStep(block, 'down').isAir,
    'regex:*sapling': (block) => Utils.blockStep(block, 'down').hasTag('dirt'),
    'regex:*propagule': (block) => Utils.blockStep(block, 'down').hasTag('dirt'),
    'regex:*seeds': (block) => Utils.blockStep(block, 'down').typeId.includes('farmland'),
    'regex:*carrot': (block) => Utils.blockStep(block, 'down').typeId.includes('farmland'),
    'regex:*potato': (block) => Utils.blockStep(block, 'down').typeId.includes('farmland'),
}

const CustomBlockTypes = {
    'minecraft:wheat_seeds': 'minecraft:wheat',
	'minecraft:potato': 'minecraft:potatoes',
	'minecraft:carrot':'minecraft:carrots',
	'minecraft:beetroot_seeds': 'minecraft:beetroot',
    'minecraft:torchflower_seeds': 'minecraft:torchflower_crop',
    'minecraft:melon_seeds': 'minecraft:melon_stem',
    'minecraft:pumpkin_seeds': 'minecraft:pumpkin_stem',
}

export default function dispensableBlocks(event) {
	if (event.entity.typeId !== 'minecraft:item') return;
	else if (!event.entity.hasComponent('item')) return;

	const item = event.entity.getComponent('item').itemStack;
    const itemRegex = getBlockRegex(item);
	
	if (!Blocks.includes(itemRegex) || item.amount > 1) return;
	
	
    // Check dispenser
	const _b = event.entity.dimension.getBlock(event.entity.location);
    
    if (!_b.isAir) return;
    else if (itemRegex in NotAirBlocks && !NotAirBlocks[itemRegex](_b)) return;

	const blocks = [ 'up', 'down', 'north', 'south', 'east', 'west']
		.map(side => Utils.blockStep(_b, side))
		.filter(b => b.typeId == 'minecraft:dispenser');
	
	if (blocks.length <= 0) return;

    if (item.typeId in CustomBlockTypes) _b.setType(CustomBlockTypes[item.typeId]);
    else _b.setType(item.typeId);
	event.entity.kill();
}

function getBlockRegex(item, toggle = false) {
    const blockId = item.typeId;
    const blockTypes = [ 
        'concrete_powder', 'sand', 'anvil',
        'sapling', 'ice', 'rail', 'propagule',
        'carrot', 'potato', 'seeds'
    ];

    const regex = blockTypes.find(type => blockId.includes(type));
    return regex ? `regex:*${regex}` : '';
}

dispensableBlocks.packet = 'entitySpawn';