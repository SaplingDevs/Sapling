import { packet, RawText, system, world } from "@script-api/server.js"
import { Command, CreateDB, Protocol } from "@script-api/core.js";
import { saplingExtensions, saplingDebugScreen } from "information.js";
import { CheckSaplingAdmin, JsonDB, module, Tracker } from "@script-api/sapling.js";

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
    const { gamerules, commands, extensionName, extensionNamespace } = extension;
   
    // Gamerules management
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
    
    // Commands management
    const commandsKeys = Object.keys(commands);
    commandsKeys.forEach((command) => {
        const commandProtocol = extensionNamespace + ":command." + command;
        let commandData = commands[command];
        const ExtensionCommand = new Command(commandData)

        ExtensionCommand.setCallback((sender, args = {}) => {
            const dataTransfer = JSON.stringify({ senderName: sender.name, args });
            system.run(() => world.dimension.overworld.runCommand(`scriptevent ${commandProtocol} ${dataTransfer}`));
        });

        ExtensionCommand.build(true);
    });


    // Save extension in cache
    world.sendMessage(new RawText([
        { text: '§7[§l§uExtension§r§7] '},
        { translate: "sapling.base.enabled", with: [ `${extensionName}` ] }
    ]));

    saplingExtensions.set(extension.extensionId, extension);

    // Send Gamerules values
    gameruleUpdater();
});

new Protocol("sapling:debugscreen_push", (event) => {
    if (event.sourceType !== "Server") return;
    const debugScreen = JSON.parse(event.message);

    saplingDebugScreen.set(debugScreen.id, debugScreen.content);
})


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

// Gamerules updater
new Tracker("ServerGamerules", () => gameruleUpdater(), 4);
new Tracker("EngineGamerules", () => gameruleUpdater(), 4);

function gameruleUpdater() {
    const server = new JsonDB("ServerGamerules");
    const engine = new JsonDB("EngineGamerules");
    const DB = { server, engine };

    saplingExtensions.forEach(({ extensionNamespace, gamerules }) => {
        const gamerulesData = Object.keys(gamerules)
            .filter((g) => gamerules[g] !== "client")
            .map((g) => ([ g, DB[gamerules[g]].get(g) ]));

        const jsonData = JSON.stringify(Object.fromEntries(gamerulesData), null, 2);

        world.runCommand(`scriptevent ${extensionNamespace}:gamerules ${jsonData}`);
    });
}