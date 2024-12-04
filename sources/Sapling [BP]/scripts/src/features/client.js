import { module } from "@script-api/sapling.js";

const ClientFeatures = module.exports['Client'];

(async function() {
    for (const _cf in ClientFeatures) {
        const featureName = ClientFeatures[_cf];  
        await import('./client/' + featureName)
            .catch((e) => { 
                console.error(e);
            });
    }
})();