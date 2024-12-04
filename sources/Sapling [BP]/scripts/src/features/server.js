import { Tracker, module, JsonDB } from "@script-api/sapling.js";
import { packet, system } from "@script-api/server.js";

import './server/tntTweaks.js'

const ServerFeatures = module.exports['Server'];
let features = new Map();
let instances = new Map();

(async function() {
    for (const _sf in ServerFeatures) {
        const featureName = ServerFeatures[_sf];  
        await import('./server/' + featureName)
            .then(res => features.set(featureName, (res.default)))
            .catch((e) => { 
                if (!e.toString().startsWith('ReferenceError')) console.error(e);
            });
    }
})();


new Tracker('ServerGamerules', ({ gamerule, value }) => {
    if (!features.has(gamerule)) return;

    const featureData = features.get(gamerule);

    if (featureData.packet == 'none') return;
    
    if (value) {
		const track = packet.on(featureData.packet, featureData);
		instances.set(gamerule, track);
	} else {
		const ev = instances.get(gamerule);
		packet.off(ev);
		instances.delete(gamerule);
	}
}, 4);

system.timeout(() => {
	const DB = new JsonDB('ServerGamerules');
	
    for (const [ featureName, featureValue ] of features) {
        const value = DB.get(featureName);
        if (!value || featureValue.packet == 'none') continue;

        const track = packet.on(featureValue.packet, featureValue)
        instances.set(featureName, track);
    }
}, 20);