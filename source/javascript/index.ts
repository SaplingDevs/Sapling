import { system, world } from "@minecraft/server";
import { DataBase } from "./~/core";

// Crear la instancia
const db = new DataBase("test");

db.remove("a");

system.runInterval(() => {
  const raw = world.getDynamicProperty("test") as string;
  const player = world.getAllPlayers()[0];

  player?.onScreenDisplay.setActionBar(raw)
}, 10);