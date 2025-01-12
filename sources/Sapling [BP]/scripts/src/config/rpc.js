import { packet, RawText, system, world } from "@script-api/server.js"
import { CreateDB, Protocol } from "@script-api/core.js";
import { saplingExtensions } from "information.js";
import { module } from "@script-api/sapling.js";

system.afterEvents.scriptEventReceive.subscribe((event) => {
    const protocol = Protocol.getProtocol(event.id);
    if (!protocol) return;
    protocol(event);
});

// Protocols definition
new Protocol("sapling:extension_load", (event) => {
    if (event.sourceType !== "Server") return;
    const extension = JSON.parse(event.message);
    // Extension manipulation
    const { gamerules, commands, extensionName } = extension;
   
    let GamerulesExtras = { engine: [], server: [], client: [] };
    const gamerulesKeys = Object.keys(gamerules);
    gamerulesKeys.forEach((gamerule) => {
        const gameruleValue = gamerules[gamerule];
        GamerulesExtras[gameruleValue].push(gamerule);
    });


    const Client = CreateDB({ booleans: [ ...Object.values(module.exports["Client"]), ...GamerulesExtras["client"] ] }, null, false)
    const Engine = CreateDB({ booleans: [ ...Object.values(module.exports["Engine"]), ...GamerulesExtras["engine"] ] }, "EngineGamerules");
    const Server = CreateDB({ booleans: [ ...Object.values(module.exports["Server"]), ...GamerulesExtras["server"] ] }, "ServerGamerules");

    module({ Client, Engine, Server });

    // Save extension in cache
    world.sendMessage(new RawText([
        { text: '§7[§l§uExtension§r§7] '},
        { translate: "sapling.base.enabled", with: [ `${extensionName}` ] }
    ]));
    saplingExtensions.set(extension.extensionId, extension);
});


// Player join event
packet.on("playerJoin", (event) => {
    const player = world.getEntity(event.playerId);

    const extensions = [];

    saplingExtensions.forEach((ext) => {
        extensions.push(
            { text: '\n§7[§l§uExtension§r§7] '},
            { translate: "sapling.base.enabled", with: [ `${ext.extensionName}` ] }
        )
    });

    player.sendMessage(new RawText([
        { text: '§7[§l§2Sapling§r§7] '},
        { translate: "sapling.base.enabled", with: [ `Sapling Server` ] },
        ...extensions
    ]));
});