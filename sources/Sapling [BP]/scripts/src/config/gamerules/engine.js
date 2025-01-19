import { module } from "@script-api/sapling.js";
import { CreateDB } from "@script-api/core.js";

// Engine Gamerules
const Engine = CreateDB({
	booleans: [
        'simulatedHss',
        'javaMobCap',
        'gamerulesFix',
        'freeCamera',
    ]
}, 'EngineGamerules');

module({ Engine });