import { CheckSaplingAdmin } from "@script-api/sapling.js";
import { Command } from "@script-api/core.js";
import LANG from "../config/langs.js";
import { system } from "@script-api/server.js";

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
    if (!CheckSaplingAdmin(sender)) return LANG('notAdmin', '', sender);
    else if (!ValidGameModes[gamemode]) return LANG('invalidValue', '', sender);
    
    system.run(() => sender.setGameMode(ValidGameModes[gamemode]));
}