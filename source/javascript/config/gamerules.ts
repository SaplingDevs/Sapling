import { GameRulePack } from "classes/GameRule";

const ServerFeatures = new GameRulePack([
  // TNT Features
  "tntDuping",
  "tntNotExplodes",
  "tntNoDrops",
  "tntDropIce",
  "tntDispenserRefill",
  // Instamine Features
  "instamineObsidian",
  "instamineDeepslate",
  "instamineEndstone",
  // Bedrock Breaking Features
  "anvilBedrockBreaker",
  "signBedrockBreaker",
  "cauldronBedrockBreaker",
  // Cauldron Conversion Features
  "cauldronConcrete",
  "cauldronMud",
  // Dispenser Features
  "dispensableBlocks",
  "dispensableBadOmen",
  "blazeMeal",
  // Silk Touch Features
  "silkTouchGetBuddingAmethyst",
  "silkTouchGetSpawners",
  // Entity Features
  "phantomDisable",
  "infiniteTrades",
  "entityCramming",
  "pigmanFarmWarts",
  "ravagerDestroyCherryLeaves",
]);

ServerFeatures.loadToDatabase("Sapling::ServerFeatures");


export { ServerFeatures }