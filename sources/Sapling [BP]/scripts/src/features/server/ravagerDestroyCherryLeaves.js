import { world, system } from "@script-api/server.js";
import { JsonDB } from "@script-api/sapling.js";

export default { packet: 'none' }

system.interval(() => {
    const enable = (new JsonDB('ServerGamerules')).get('ravagerDestroyCherryLeaves');
    if (!enable) return;

    const ravagers = world.dimension.overworld.getEntities({ type: 'minecraft:ravager' });

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
}, 10)

function replaceBlock(x, y, z, d) {
	let loc = { x, y, z };
	let b = d.getBlock(loc);
	if (b.typeId == 'minecraft:cherry_leaves') {
		b.setType('minecraft:air');
	}
}