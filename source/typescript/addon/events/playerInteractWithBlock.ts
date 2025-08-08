import { PlayerInteractWithBlockBeforeEvent } from "@minecraft/server";
import { Packet } from "~/server";

import flippinCactus from "addon/features/client/flippinCactus";
import { signBedrockBreaker, cauldronBedrockBreaker } from "addon/features/server/bedrockBreaker";
import minecartStacking from "addon/features/client/minecartStacking";
import { containerRefill } from "addon/features/client/containerTweaks";
import { toolBreakPrevention_InteractBlock } from "addon/features/client/toolBreakPrevention";

Packet.on("before::playerInteractWithBlock", (Event: PlayerInteractWithBlockBeforeEvent) => {
  // Server features
  signBedrockBreaker(Event);
  cauldronBedrockBreaker(Event);

  // Client features
  flippinCactus(Event);
  minecartStacking(Event);
  containerRefill(Event);
  toolBreakPrevention_InteractBlock(Event);
}); 