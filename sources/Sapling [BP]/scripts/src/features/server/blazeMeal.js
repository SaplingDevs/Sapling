import { Utils } from "@script-api/sapling.js";

export default function blazeMeal(event) {
    try {
        if (event.entity.typeId !== 'minecraft:item') return;
        const item = event.entity.getComponent('item').itemStack;
        
        if (item.typeId !== 'minecraft:blaze_powder') return;
        else if (item.amount > 1) return;
        
        
        const _b = event.entity.dimension.getBlock(event.entity.location);
        if (_b.typeId !== 'minecraft:nether_wart') return;
        
        
        const blocks = [ 'up', 'north', 'south', 'east', 'west']
            .map(side => Utils.blockStep(_b, side))
            .filter(b => b.typeId == 'minecraft:dispenser');
        
        if (blocks.length <= 0) return;
        
        // Place new wart 
        const { x, y, z } = _b.location
        
        event.entity.runCommand(`execute positioned ${x} ${y} ${z} if block ~~~ nether_wart["age": 2] run setblock ~~~ nether_wart["age": 3]`)
        event.entity.runCommand(`execute positioned ${x} ${y} ${z} if block ~~~ nether_wart["age": 1] run setblock ~~~ nether_wart["age": 2]`)
        event.entity.runCommand(`execute positioned ${x} ${y} ${z} if block ~~~ nether_wart["age": 0] run setblock ~~~ nether_wart["age": 1]`)
        event.entity.runCommand(`particle minecraft:crop_growth_emitter ${x} ${y} ${z}`)
        
        event.entity.kill();
    } catch {}
}

blazeMeal.packet = 'entitySpawn';