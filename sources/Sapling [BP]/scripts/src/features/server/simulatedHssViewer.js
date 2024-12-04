import { system, Vector3, world, MolangVariableMap } from "@script-api/server.js"
import { JsonDB } from "@script-api/sapling.js";

export default { packet: 'none' }

const HssTypes = {
	SwampHut: [ 0.43, 0.90, 0 ],
	PillagerOutpost: [ 1, 1, 1 ],
	NetherFortress: [ 1, 1, 0 ],
	OceanMonument: [ 0, 0.78, 1 ]
}

system.interval(() => {
	if (!(new JsonDB('ServerGamerules')).get('simulatedHssViewer')) return;
	
	// Feature
	for (const hss in HssTypes) {
		const [ r, g, b ] = HssTypes[hss];
		const color = { r, g, b };
		const DB = new JsonDB(hss);
		
		for (let k of DB.values()) {
			try {
				const [ _x, _y, _z, d ] = k.split('/');
				const [ x, y, z ] = [ parseInt(_x), parseInt(_y), parseInt(_z) ];
				
				Particle(new Vector3(x+0.5, y+0.04, z+0.5), [d, 0, -1, 0, 1, 1], color);
				Particle(new Vector3(x+0.5, y+2.04, z+0.5), [d, 0, -1, 0, 1, 1], color);
				
				Particle(new Vector3(x+1, y+1.04, z+0.5), [d, 1, 0, 0, 1, 2], color);
				Particle(new Vector3(x, y+1.04, z+0.5), [d, -1, 0, 0, 1, 2], color);
			
				Particle(new Vector3(x+0.5, y+1.04, z+1), [d, 0, 0, 1, 1, 2], color);
				Particle(new Vector3(x+0.5, y+1.04, z), [d, 0, 0, -1, 1, 2], color);
			} catch {}
		}
	}
}, 40);


function Particle(loc, [ d, x, y, z, w, h ], { r, g, b }) {
	const vm = new MolangVariableMap();
		vm.setFloat('r', r);
		vm.setFloat('g', g);
		vm.setFloat('b', b);
		vm.setFloat('x', x);
		vm.setFloat('y', y);
		vm.setFloat('z', z);
		vm.setFloat('w', w / 2);
		vm.setFloat('h', h / 2);
		
	world.dimension[d].spawnParticle('sa:hss', loc, vm);
}