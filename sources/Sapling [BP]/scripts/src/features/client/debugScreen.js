import { world, system, packet, server } from "@script-api/server.js";
import { MemoryTier } from "@script-api/vanilla-data.js";
import { Chunk, Utils } from "@script-api/sapling.js";

const PlayersData = new Map();
packet.on('dataDrivenEntityTrigger', ({ entity, eventId }) => {
    if (!entity || entity.typeId !== 'minecraft:player' || !eventId.startsWith('sa:')) return;
    const playerName = entity.name;

    if (!PlayersData.has(playerName)) PlayersData.set(playerName, {});
    const newData = PlayersData.get(playerName);
    const [ , key, value ] = eventId.split(':');
    newData[key] = value;

    PlayersData.set(playerName, newData);
});


system.interval(() => {
    const players = world.getPlayers();
    debugScreen(players)
});

function debugScreen(players) {
    for (const player of players) {
        if (!player) continue;
        
        const isDebug = player.hasTag('client:debugScreen');
        const playerData = getDataFromPlayer(player);
        const debugScreenText = generateScreen(playerData);

        setTitle(player, `!tp00.${isDebug ? debugScreenText : ''}`);
    }
}

function generateScreen(data) {
    server.tps = Math.round(server.tps);
	const tps = (server.tps >= 20 ? `§a20` : `§c${server.tps}`) + '§r';
    const light = data.light > 7 ? `§e${data.light}` : `§c${data.light}`

    const tp00 = [
        'Sapling Build: §u2.0',
        `Platform: ${data.platform}`,
        `Memory: ${data.memory} (${data.memoryEquivalent})`,
        '',
        `TPS: ${tps}  -  E: ${data.viewEntities} / ${data.dimensionEntities}`,
        `Dimension: ${data.dimension}`,
        '',
        `XYZ:  §6${data.x}  §r/  §6${data.y}  §r/  §6${data.z}`,
        `Chunk: [ ${data.cx}, ${data.cz} ]${data.cs ? '  §aisSlime' : ''}`,
        `Facing: ${data.facingDirection}`,
        `Client Light: ${light}`,
        `Biome: §qminecraft:${data.biome}`
    ].join('§r\n');
    
    return tp00;
}

function getDataFromPlayer(player) {
    const { location, dimension, name } = player;
    const dynamicData = PlayersData.has(name) ? PlayersData.get(name) : { client_biome: 'plains', client_light: 15, isVillage: false, isUnderground: false };
    const chunk = new Chunk(location.x, location.z);
    const systemInfo = player.clientSystemInfo;

    const viewEntities = player.getEntitiesFromViewDirection({ ignoreBlockCollision: true }).length;
    const dimensionEntities = dimension.getEntities().length;
    const facingDirection = Utils.getDirection(player.getRotation().y);
    const memoryData = [ '???', 'max 1.5GBs', 'max 2GBs', 'max 4GBs', 'max 8GBs', 'above 8GBs' ];

    return {
        // Location
        x: Math.floor(location.x),
        y: Math.floor(location.y),
        z: Math.floor(location.z),
        // Chunk data
        cx: chunk.worldX,
        cz: chunk.worldZ,
        cs: chunk.isSlime(),
        // World
        dimension: dimension.id,
        biome: dynamicData.client_biome,
        light: dynamicData.client_light,
        isVillage: dynamicData.isVillage,
        isUnderground: dynamicData.isUnderground,
        viewEntities,
        dimensionEntities,
        facingDirection,
        // System
        platform: systemInfo.platformType,
        memory: Object.keys(MemoryTier)[systemInfo.memoryTier],
        memoryEquivalent: memoryData[systemInfo.memoryTier],
        maxRenderDistance: systemInfo.maxRenderDistance,
        player
    }
}

function setTitle(player, text) {
    player.runCommand(`titleraw @s title { "rawtext": [{ "text": "${text}" }] }`);
}

function setSubtitle(player, text) {
    player.runCommand(`titleraw @s subtitle { "rawtext": [{ "text": "${text}" }] }`);
}