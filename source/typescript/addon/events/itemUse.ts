import { ItemUseAfterEvent, ItemUseBeforeEvent } from "@minecraft/server";
import { handRefill } from "addon/features/client/containerTweaks";
import { toolBreakPrevention_UsingItem } from "addon/features/client/toolBreakPrevention";
import { Packet } from "~/server";

Packet.on("itemUse", (Event: ItemUseAfterEvent) => {
  // Client features
  handRefill(Event);
}); 

Packet.on("before::itemUse", (Event: ItemUseBeforeEvent) => {
  // Client features
  toolBreakPrevention_UsingItem(Event);
}); 