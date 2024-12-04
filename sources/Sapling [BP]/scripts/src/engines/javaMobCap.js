import { JsonDB } from "@script-api/sapling.js";
import { packet } from "@script-api/server.js";

const MobTypes = new Set([
    'minecraft:zombie',
    'minecraft:skeleton',
    'minecraft:creeper',
    'minecraft:spider',
    'minecraft:enderman',
    'minecraft:zombie_villager',
    'minecraft:cave_spider',
    'minecraft:zombie_pigman',
    'minecraft:witch',
    'minecraft:slime',
    'minecraft:drowned',
    'minecraft:stray',
    'minecraft:husk',
    'minecraft:blaze',
    'minecraft:guardian',
    'minecraft:magma_cube',
    'minecraft:piglin',
    'minecraft:hoglin',
    'minecraft:ghast'
])

packet.on('entitySpawn', ({ cause, entity }) => {
    if (!(new JsonDB('EngineGamerules').get('javaMobCap'))) return;
    else if (cause !== 'Spawned' || !MobTypes.has(entity.typeId)) return;


    try {
        const currentMobcap = entity.dimension.getEntities({ families: [ 'monster' ], minDistance: 1 });
        
        if(!entity.hasTag('sa:generated') && currentMobcap.length <= 70) {
            entity.dimension.spawnEntity(entity.typeId, entity.location).addTag("sa:generated");
            entity.remove();
        } else entity.removeTag('sa:generated')
    } catch {}
});