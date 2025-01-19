import { module } from "@script-api/sapling.js";
import { CreateDB } from "@script-api/core.js";

// Server Gamerules
const Server = CreateDB({
	booleans: [
		// Sapling Gamerules
		'tntDuping',
		'tntDropIce',
		'tntNotExplodes',
		'tntNoDrops',
		'tntDispenserRefill',
		'guardianDropSponges',
		'ghastDropQuartz',
		'huskDropSand',
		'silverfishDropGravel',
		'pigmanFarmWarts',
		'ravagerDestroyCherryLeaves',
		'entityCramming',
		'endPortalGBD',
		'cauldronBedrockBreaker',
		'anvilBedrockBreaker',
		'signBedrockBreaker',
		'renewableSoulSand',
		'instamineObsidian',
		'instamineDeepslate',
		'instamineEndstone',
		'silkTouchGetSpawners',
		'silkTouchGetBuddingAmethyst',
		'dynamicLight',
		'railDuping',
		'dispenserBadOmen',
		'oldPillagerMethod',
		'blazeMeal',
		'renewableDeepslate',
		'stoneCutterDamage',
		'simulatedHssViewer',
		'dispensableBlocks',
		'sweepingEdge',
		'cauldronConcrete',
		'cauldronMud',
		'phantomDisable',
		'infiniteTrades',
		'pistonSpongeDrying',
		'hopperCartTransfer'
	]
}, 'ServerGamerules');

module({ Server });