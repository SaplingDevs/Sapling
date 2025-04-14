import { EntityDieAfterEvent } from "@minecraft/server";
import { oldPillagerMethod } from "addon/features/server/entityTweaks";
import { Packet } from "~/server";

Packet.on("entitySpawn", function(Event: EntityDieAfterEvent){
  oldPillagerMethod(Event);
});