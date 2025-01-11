import { JsonDB } from "@script-api/sapling.js";
import { Command } from "@script-api/core.js";
import { world, system, RawText } from "@script-api/server.js";

new Command()
    .setName('freecamera')
    .setValidation(() => (new JsonDB('EngineGamerules')).get('freeCamera'))
    .setCallback(FCCallback)
    .build();

new Command()
    .setName('fc')
    .setValidation(() => (new JsonDB('EngineGamerules')).get('freeCamera'))
    .setCallback(FCCallback)
    .build();

const Cameras = new JsonDB('SaplingCameras');

function FCCallback(sender) {
    if (world.isHardcore) return;

    system.run(() => {
        const enabled = sender.hasTag('fc:toggle');

        if (enabled) sender.removeTag('fc:toggle')
        else sender.addTag('fc:toggle');
    
        sender.sendMessage(new RawText([
            { text: '§7[§l§2Sapling§r§7] '},
            { translate: `sapling.base.${enabled ? 'disabled' : 'enabled'}`, with: [ "freeCamera" ] }
        ]))

        enabled ? DisabledToggle(sender) : EnabledToggle(sender);
    });
}

function EnabledToggle(sender) {
    const loc = sender.location;
    const dim = sender.dimension.id;
    const gamemode = sender.getGameMode();

    Cameras.set(sender.id, { loc, dim, gamemode });
    sender.setGameMode('spectator');
}

function DisabledToggle(sender = world.getEntity() ) {
    const data = Cameras.get(sender.id);

    sender.setGameMode(data.gamemode);
    sender.teleport(data.loc, { dimension: world.dimension[data.dim] });
}