import { GameRulePack } from "../classes/GameRule";

const ServerFeatures = new GameRulePack([
  "tntDuping",
  "tntNotExplodes",
  "tntNoDrops",
  "tntDropIce"
]);

ServerFeatures.loadToDatabase("Sapling::ServerFeatures");


export { ServerFeatures }