import { MinecraftBlockTypes } from "@script-api/vanilla-data.js";
import { JsonDB, Utils } from "@script-api/sapling.js";
import { system } from "@script-api/server.js";

export default { packet: 'none' }

system.interval(() => {
    try {
        const enable = (new JsonDB('ServerGamerules')).get('stoneCutterDamage');
        if (!enable) return;
        
        const damageEntities = Utils.getAllEntities({
            excludeTypes: [ 'item', 'armor_stand', 'minecart', 'xp_orb' ]
        }).filter(({ dimension, location }) => dimension.getBlock(location).typeId == MinecraftBlockTypes.StonecutterBlock);
    
        for (let entity of damageEntities) {
            entity.applyDamage(4)
        }
    } catch {}
}, 2)