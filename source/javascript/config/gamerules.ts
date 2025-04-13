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
  "",
  "",
]);

ServerFeatures.loadToDatabase("Sapling::ServerFeatures");


export { ServerFeatures }