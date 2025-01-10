import { CheckSaplingAdmin } from "@script-api/sapling.js";
import { Command } from "@script-api/core.js";
import { RawText, system } from "@script-api/server.js";

new Command()
    .setName('gm')
    .addArgument('string|number', 'gamemode')
    .setCallback(GmCallback)
    .build();


const ValidGameModes = {
    d: 'default',
    0: 'default',
    s: 'survival',
    1: 'survival',
    c: 'creative',
    2: 'creative',
    g: 'spectator',
    3: 'spectator',
}

function GmCallback(sender, { gamemode }) {
    if (!CheckSaplingAdmin(sender)) return sender.sendMessage(new RawText([ { text: "§c" }, { translate: "sapling.error.admin" }]));
    else if (!ValidGameModes[gamemode]) return sender.sendMessage(new RawText([ { text: "§c" }, { translate: "sapling.error.value", with: [ gamemode ] }]))
    
    system.run(() => sender.setGameMode(ValidGameModes[gamemode]));
}