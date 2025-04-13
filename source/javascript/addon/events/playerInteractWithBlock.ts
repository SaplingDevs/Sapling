import { PlayerInteractWithBlockBeforeEvent } from "@minecraft/server";
import signBedrockBreaker, { cauldronBedrockBreaker } from "addon/features/server/bedrockBreaker";
import { Packet } from "~/server";

Packet.on("before::playerInteractWithBlock", (Event: PlayerInteractWithBlockBeforeEvent) => {
  signBedrockBreaker(Event);
  cauldronBedrockBreaker(Event);
}); 