import { PlayerInteractWithBlockBeforeEvent } from "@minecraft/server";
import { Packet } from "~/server";

import flippinCactus from "addon/features/client/flippinCactus";
import { signBedrockBreaker, cauldronBedrockBreaker } from "addon/features/server/bedrockBreaker";
import minecartStacking from "addon/features/client/minecartStacking";

Packet.on("before::playerInteractWithBlock", (Event: PlayerInteractWithBlockBeforeEvent) => {
  // Server features
  signBedrockBreaker(Event);
  cauldronBedrockBreaker(Event);

  // Client features
  flippinCactus(Event);
  minecartStacking(Event);
}); 