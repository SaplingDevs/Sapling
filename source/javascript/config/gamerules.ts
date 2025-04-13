import { GameRulePack } from "classes/GameRule";

const ServerFeatures = new GameRulePack([
  // TNT Features
  "tntDuping",
  "tntNotExplodes",
  "tntNoDrops",
  "tntDropIce",
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
]);

ServerFeatures.loadToDatabase("Sapling::ServerFeatures");


export { ServerFeatures }