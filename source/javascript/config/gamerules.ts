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
]);

ServerFeatures.loadToDatabase("Sapling::ServerFeatures");


export { ServerFeatures }