import { Chunk, getConfigValue, getTextureChannel, Particle } from "@script-api/sapling.js";
import { world, system, Vector3 } from "@script-api/server.js"

const Textures = {
    'default': 'chunk',
    'java': 'java_chunk'
}

system.interval(() => {
    const parsedPlayers = world.getPlayers({
        tags: [ 'client:chunkBorders' ]
    });

    for (let player of parsedPlayers) {
        const channel = getTextureChannel(player);
        const texture = getConfigValue(player, 'chunkAppearance', 'default');

        const particleTexture = Textures[texture];

        const particleX = `sa:${particleTexture}_x:${channel}`
        const particleZ = `sa:${particleTexture}_z:${channel}`

        const { minX, maxX, minZ, maxZ } = new Chunk(player.location.x, player.location.z);

        Particle.create(player, particleX, new Vector3(minX-0.1, 0, minZ+7.98));
		Particle.create(player, particleX, new Vector3(maxX+0.98, 0, maxZ-6.98));
		Particle.create(player, particleZ, new Vector3(minX+7.98, 0, minZ-0.001));
		Particle.create(player, particleZ, new Vector3(minX+7.98, 0, minZ+15.98));
    }
}, 18);