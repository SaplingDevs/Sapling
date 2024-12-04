import { module } from "@script-api/sapling.js";
import { CreateDB } from "@script-api/core.js";

// Server Gamerules
const Engine = CreateDB({
	booleans: [
        'simulatedHss',
        'javaMobCap',
        'gamerulesFix',
        'freeCamera'
    ]
}, 'EngineGamerules');

module({ Engine });