import { system, world } from "@script-api/server.js"
import { JsonDB } from "@script-api/sapling.js";

system.interval(() => {
    if (world.isHardcore) return;

    if (!(new JsonDB('EngineGamerules').get('freeCamera'))) {
        world.runCommand('tag @a remove fc:toggle');
        
        const players = world.getPlayers();
        const Cameras = new JsonDB('SaplingCameras');

        for (const player of players) {
            if (!Cameras.has(player.id)) continue;

            const data = Cameras.get(player.id);

            player.setGameMode(data.gamemode);
            player.teleport(data.loc, { dimension: world.dimension[data.dim] });
        }

        Cameras.clear();
        return;
    }

    const parsedPlayers = world.getPlayers({
        tags: [ 'fc:toggle' ]
    });

    const Cameras = new JsonDB('SaplingCameras');
    const Portals = [ 'minecraft:portal', 'minecraft:end_portal' ];

    for (const player of parsedPlayers) {
        try {
            const data = Cameras.get(player.id);
            const block = player.dimension.getBlock(player.location);
    
            const isPortal = Portals.includes(block.typeId);
    
            if (isPortal) player.setGameMode(data.gamemode);
            else player.setGameMode('spectator');
        } catch {}
    }
}, 10);