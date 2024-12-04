import { module } from "@script-api/sapling.js";
import { CreateDB } from "@script-api/core.js";

// Client Gamerules
const Client = CreateDB({
	booleans: [
		'toolChanger',
		'flippinCactus',
		'itemMagnet',
		'smartHoe',
		'debugScreen',
		'collisionBoxes',
		'xpBarMending',
		'chunkBorders',
		'minecartStacking',
		'redstoneIndicator',
		'disableRendering'
	]
}, null, false);

module({ Client });