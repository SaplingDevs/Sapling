import { system } from "@minecraft/server";
import { DataBaseBuilder } from "../~/core";

export class GameRulePack {
  private rules: Record<string, string>;
  DataBase: DataBaseBuilder|null;

  constructor(gamerules: string[]) {
    this.rules = {};
    this.DataBase = null;

    for (const rule of gamerules) {
      this.rules[rule.toLowerCase()] = rule;
    }
  }

  loadToDatabase(DatabaseID: string) {
    const DataBase = new DataBaseBuilder(DatabaseID);
    this.DataBase = DataBase;

    system.runTimeout(() => {
      for (const rule in this.rules) {
        if (!DataBase.has(rule)) DataBase.set(rule, false);    
      }
    }, 3)
  }

  getNormalizedRules() {
    return this.rules;
  }
}
