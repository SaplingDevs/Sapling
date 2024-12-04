import { packet, system, ItemStack } from '@script-api/server.js'
import { JsonDB } from '@script-api/sapling.js'

const TNT_BLOCKS = new Map();

packet.on('before::explosion', (ev) => {
	const DB = new JsonDB('ServerGamerules');
	
	// Gamerules
	const tntNotExplodes = DB.get('tntNotExplodes');
	const tntNoDrops = DB.get('tntNoDrops');
	const tntDropIce = DB.get('tntDropIce');

	// Blocks
	let blocks = ev.getImpactedBlocks()
		.map(_ => ev.dimension.getBlock(_));
		
	// Features 
	if (tntNotExplodes) ev.cancel = true;
	else if (tntNoDrops) {
		for (let b of blocks) {
			system.run(() => {
				b.setType('minecraft:air');
			});
		}
		ev.setImpactedBlocks([]);
		blocks = [];
	}
	
	if (tntDropIce && !tntNotExplodes) {
		let tnt = [];
		
		for (let block of blocks) {
			const isIce = block.typeId.includes('ice');
			
			if (isIce) {
				let key = createKey(block);
				if (TNT_BLOCKS.has(key)) continue;
				else TNT_BLOCKS.set(key, block);
			} else tnt.push(block);
		};
		
		ev.setImpactedBlocks(tnt);
	} 
});

system.interval(() => {
	if (TNT_BLOCKS.size == 0) return;
	TNT_BLOCKS.forEach(function(b, key) {
		const block = TNT_BLOCKS.get(key);
		
		const { typeId, location, dimension } = block;
		const { x, y, z } = location;
		const dim = dimension.id.replace('minecraft:', '');
		
		try {
			if (typeId == 'minecraft:tnt') {
				dimension.runCommand(`execute in ${dim} run summon tnt ${x} ${y} ${z}`);
			} else {
				let item = new ItemStack(typeId, 1);
				dimension.spawnItem(item, block);
			}
		} catch {}
		
		TNT_BLOCKS.delete(key);
		block.setType('minecraft:air');
	});
});

function createKey(block) {
	const { location, dimension } = block;
	const { x, y, z } = location;
	let dim = dimension.id.replace('minecraft:','');
	// key
	return `${dim}:${x}/${y}/${z}`;
}