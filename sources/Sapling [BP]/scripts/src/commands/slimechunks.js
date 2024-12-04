import { Command } from "@script-api/core.js";
import { Chunk, Utils } from "@script-api/sapling.js";
import { world } from "@script-api/server.js";


new Command()
    .setName('slimechunks')
    .setCallback(SlimesChunksCommand)
    .build();

// Command callbacks
function SlimesChunksCommand(sender) {
    let slimes = [];

    const pc = new Chunk(sender.location.x, sender.location.z);
    const r = 8;
    const chunkSize = 16;

    for (let x = -r; x <= r; x++) {
        for (let z = -r; z <= r; z++) {
            const fcX = pc.minX + x * chunkSize;
            const fcZ = pc.minZ + z * chunkSize;
            const fc = new Chunk(fcX, fcZ);

            if (fc.isSlime()) slimes.push(fc); 
        }
    }

    const txt = slimes.map((sc) => `Corns: [ §a${sc.minX}§7/§a${sc.minZ}§7, §a${sc.maxX}§7/§a${sc.maxZ} §7] | Center: [ §a${parseInt(sc.center.x )}§7, §a${parseInt(sc.center.z)} §7]`)

    Utils.privateMessage(sender, '§l§2Slime Chunks §7Area:§r\n\n' + txt.join('\n'));
}