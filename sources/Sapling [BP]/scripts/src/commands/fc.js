import { JsonDB } from "@script-api/sapling.js";
import { Command } from "@script-api/core.js";
import { world, system } from "@script-api/server.js";
import LANG from "../config/langs";

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
    
        LANG(enabled ? 'disabled' : 'enabled', 'freeCamera', sender);

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