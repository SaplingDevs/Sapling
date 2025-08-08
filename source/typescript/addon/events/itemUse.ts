import { ItemUseAfterEvent } from "@minecraft/server";
import { handRefill } from "addon/features/client/containerTweaks";
import { Packet } from "~/server";

Packet.on("itemUse", (Event: ItemUseAfterEvent) => {
  // Client features
  handRefill(Event);
}); 