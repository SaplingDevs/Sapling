import { GameRulePack } from "classes/GameRule";

const ServerFeatures = new GameRulePack([
  // TNT features
  "tntDuping",
  "tntNotExplodes",
  "tntNoDrops",
  "tntDropIce",
  "tntDispenserRefill",
  // Instamine features
  "instamineObsidian",
  "instamineDeepslate",
  "instamineEndstone",
  // Bedrock breaking features
  "anvilBedrockBreaker",
  "signBedrockBreaker",
  "cauldronBedrockBreaker",
  // Cauldron conversion features
  "cauldronConcrete",
  "cauldronMud",
  // Dispenser features
  "dispensableBlocks",
  "dispensableBadOmen",
  "blazeMeal",
  // Silk touch features
  "silkTouchGetBuddingAmethyst",
  "silkTouchGetSpawners",
  // Entities features
  "phantomDisable",
  "oldPillagerMethod",
  "infiniteTrades",
  "entityCramming",
  "pigmanFarmWarts",
  "ravagerDestroyCherryLeaves",
  // Loot tables features
  "huskDropSand",
  "ghastDropQuartz",
  "guardianDropSponges",
  "silverfishDropGravel",
  // Block features
  "endPortalGBD",
  "renewableSoulSand",
  "railDuping",
  "pistonSpongeDrying",
  "renewableDeepslate",
  // Damage features
  "stoneCutterDamage",
  "sweepingEdge"
]);

ServerFeatures.loadToDatabase("Sapling::ServerFeatures");


const ClientFeatures = new GameRulePack([
  "flippinCactus",
  "itemMagnet",
  "minecartStacking",
  "toolChanger",
  "smartHoe",
  "xpBarMending"
  // "chunkBorders",
  // "redstoneIndicator",
  // "collisionBoxes"
]);


export { ServerFeatures, ClientFeatures }