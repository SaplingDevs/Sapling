import { EntityHitEntityAfterEvent } from "@minecraft/server";
import { sweepingEdge } from "addon/features/server/damageTweaks";
import { Packet } from "~/server";

Packet.on("entityHitEntity", (Event: EntityHitEntityAfterEvent) => {
  sweepingEdge(Event);
});