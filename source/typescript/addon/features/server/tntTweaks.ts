import { system, ItemStack, ExplosionBeforeEvent } from "@minecraft/server";
import { ServerFeatures } from "config/gamerules"

const TNT_BLOCKS = new Map();

export default function tntTweaks(Event: ExplosionBeforeEvent){
  // Gamerules
	const tntNotExplodes = ServerFeatures.DataBase.get('tntnoexplodes');
	const tntNoDrops = ServerFeatures.DataBase.get('tntnodrops',);
	const tntDropIce = ServerFeatures.DataBase.get('tntdropice');

	// Blocks
	let blocks = Event.getImpactedBlocks()
		.map(_ => Event.dimension.getBlock(_));
		
	// Features 
	if (tntNotExplodes) Event.cancel = true;
	else if (tntNoDrops) {
		for (let b of blocks) {
			system.run(() => {
				b.setType('minecraft:air');
			});
		}
		Event.setImpactedBlocks([]);
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
		
		Event.setImpactedBlocks(tnt);
	}
}

system.runInterval(() => {
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