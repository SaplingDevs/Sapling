import { getTextureChannel, Particle } from "@script-api/sapling.js";
import { world, system, Vector3 } from "@script-api/server.js";

system.interval(() => {
    const parsedPlayers = world.getPlayers({
        tags: [ 'client:redstoneIndicator' ]
    });

    let REDSTONE_KEYS = {};

    for (const player of parsedPlayers) {
        const resData = redstoneIndicator(player);
        Object.assign(REDSTONE_KEYS, resData);
    }

    for (let redstoneKey of Object.keys(REDSTONE_KEYS)) {
        const [ dim, ss, channel, _x, _y, _z ] = redstoneKey.split('/');
        const [ x, y, z ] = [ Number(_x), Number(_y), Number(_z) ]

        Particle.dimension(dim, `sa:ss_${ss}:${channel}`, new Vector3(x, y + 0.04, z));
    }
});

function redstoneIndicator(player = world.getPlayers()[0]) {
    const textureChannel = getTextureChannel(player);
    const dim = player.dimension.id.replace('minecraft:', '');
    const rayCast = player.getBlockFromViewDirection({ maxDistance: 10 });
    let resData = {}

    if (!rayCast) return resData;

    const block = rayCast.block;
    
    const BLOCKS = getCoords(block.location, 2)
        .map(loc => getBlock(loc, block))
        .filter(_ => _.typeId == 'minecraft:redstone_wire');
        
    BLOCKS.forEach((dust) => {
        const ss = dust.permutation.getState('redstone_signal');
        const key = rkey(dust.location, textureChannel, ss, dim);
        resData[key] = 1;
    });

    return resData;
}


function rkey (loc, channel, ss, dim) {
	return `${dim}/${ss}/${channel}/${loc.x}/${loc.y}/${loc.z}`;
}

function getBlock (loc, block) {
	return block.dimension.getBlock(loc);
}

function getCoords(center, range) {
	return Array.from({ length: (range * 2 + 1) ** 3 }, (_, i) => {
		const x = i % (range * 2 + 1) - range;
		const y = Math.floor(i / (range * 2 + 1)) % (range * 2 + 1) - range;
		const z = Math.floor(i / (range * 2 + 1) ** 2) - range;
		return {
			x: center.x + x,
			y: center.y + y,
			z: center.z + z,
		};
	});
}