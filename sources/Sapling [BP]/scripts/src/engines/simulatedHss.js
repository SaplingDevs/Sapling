import { world, system, Vector3 } from '@script-api/server.js';
import { module, JsonDB } from '@script-api/sapling.js';
import HSA from './hss/data';

let randomTick = Math.floor(Math.random() * 320);
let currentTick = 0;

system.interval(() => {
    if (!(new JsonDB('EngineGamerules')).get('simulatedHss')) {
        currentTick = 0;
        return;
    }

	if (currentTick <= randomTick) currentTick++;
	else {
		hssEngine();
		currentTick = 0;
		randomTick = Math.floor(Math.random() * 320);
	}
}, 1);


function hssEngine() {
	let HSS = module.exports['HssTypes'];
	for (let _type in HSS) {
		const type = HSS[_type];
		let db = new JsonDB(type);
		db.forEach((key, data) => {
			try {
				let [x, y, z, d] = data.split('/');
				let hss = new HSA({
					hssId: type,
					location: new Vector3(Number(x), Number(y), Number(z)),
					dimension: world.dimension[d]
				});
					
				hss.spawn();
			} catch {}
		})
	}
}