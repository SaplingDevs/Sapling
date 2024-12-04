import { world, system, MolangVariableMap, Vector3 } from "@script-api/server.js";
import { CollisionBoxes } from "@script-api/vanilla-data.js";
import { getTextureChannel } from "@script-api/sapling.js";

let Entities = [];
let Coords = [];

system.interval(() => {
    const parsedPlayers = world.getPlayers({
        tags: [ 'client:collisionBoxes' ]
    });

    for (let player of parsedPlayers) {
        collisionBoxes(player);
    }

    Entities = [];
    Coords = [];
}, 4);


function collisionBoxes(player = world.getPlayers()[0]) {
    const location = player.location;
    const mobs = player.dimension.getEntities({
        location,
        maxDistance: 20,
        excludeTypes: [ 'minecraft:player' ]
    });
    const playerTextureChannel = getTextureChannel(player);

    mobs.forEach((e) => {
        const channelKey = playerTextureChannel +  ':' + e.id;
        const locationKey = playerTextureChannel + ':' + e.typeId.replace('minecraft:', '') + JSON.stringify(e.location);

        if (Entities.includes(channelKey) || Coords.includes(locationKey)) return;

        showCollisionBox(e, playerTextureChannel);

        Coords.push(locationKey);
        Entities.push(channelKey);
    });
}

function showCollisionBox(entity, channel) {
    try {
        const { x, y, z } = entity.location;
        const [ w, h ] = CollisionBoxes[entity.typeId] || [ 1, 1 ];
    
        const color = { r: 1, g: 1, b: 1 };
        const d = entity.dimension;

        const particleId = `sa:collison:${channel}`;
        
        Particle(particleId, new Vector3(x+(w/2), y+(h/2), z), [ d, 1, 0, 0, w, h ], color);
        Particle(particleId, new Vector3(x-(w/2), y+(h/2), z), [ d, -1, 0, 0, w, h ], color);

        Particle(particleId, new Vector3(x, y+(h/2), z+(w/2)), [ d, 0, 0, 1, w, h ], color);
        Particle(particleId, new Vector3(x, y+(h/2), z-(w/2)), [ d, 0, 0, -1, w, h ], color);
    } catch {}
}


function Particle(particle, loc, [ d, x, y, z, w, h ], { r, g, b }) {
	const vm = new MolangVariableMap();
		vm.setFloat('r', r);
		vm.setFloat('g', g);
		vm.setFloat('b', b);
		vm.setFloat('x', x);
		vm.setFloat('y', y);
		vm.setFloat('z', z);
		vm.setFloat('w', w / 2);
		vm.setFloat('h', h / 2);
		
	d.spawnParticle(particle, loc, vm);
}