import { ChatSendBeforeEvent } from "@minecraft/server";
import { Packet } from "../~/server";
import { CommandBuilder } from "../classes/Command";

Packet.on("before::chatSend", (Event: ChatSendBeforeEvent) => {
  if (!Event.message.startsWith("#") && !Event.message.startsWith("./")) return;

  Event.cancel = true;


  const cmd = Event.message
    .replace("#", "")
    .replace("./", "");

    CommandBuilder.execute(cmd);
});