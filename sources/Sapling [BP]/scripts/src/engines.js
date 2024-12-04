import { module } from "@script-api/sapling.js";

const Engines = module.exports['Engine'];

(async function() {
    for (const _ef in Engines) {
        const engineName = Engines[_ef];  
        await import('./engines/' + engineName)
            .catch((e) => console.error(e));
    }
})();