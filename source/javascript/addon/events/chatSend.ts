import { ChatSendBeforeEvent } from "@minecraft/server";
import { Packet } from "~/server";
import { CommandBuilder } from "classes/Command";
import { Utils } from "classes/Utils";

Packet.on("before::chatSend", (Event: ChatSendBeforeEvent) => {
  if (!Event.message.startsWith("#") && !Event.message.startsWith("./")) return;

  Event.cancel = true;

  const Input = Event.message.replace("#", "").replace("./", "");
  const CommandID = Input.split(" ")[0];
  const Sender = Event.sender;

  if (!CommandBuilder.__commands.has(CommandID)) {
    const CommandErrorMessage = Utils.RawTextBuilder([
      { text: "§c" },
      { translate: "sapling.command.error", with: [ CommandID ] }
    ]);
    
    return Sender.sendMessage(CommandErrorMessage);
  } 

  const PlayerID = "@" + Sender.name.replaceAll(" ", "%20");

  CommandBuilder.__commands.get(CommandID)?.execute(`${Input} "${PlayerID}"`);
});