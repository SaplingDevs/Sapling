import { getTextureChannel } from "@script-api/sapling.js";
import { world, system } from "@script-api/server.js";

system.interval(() => {
    const parsedPlayers = world.getPlayers({
        tags: [ 'client:disableRendering' ]
    });

    for (const player of parsedPlayers) disableRendering(player);
}, 4);

function disableRendering(player) {
    const filteredTags = player.getTags().filter((t) => t.startsWith('cr:'));
    if (filteredTags.length == 0) return;

    const textureChannel = getTextureChannel(player);
    const conditions = filteredTags.map((t) => `type=${t.replace('cr:', '')}`);
    
    conditions.forEach((c) => {
        player.runCommand(`playanimation @e[${c}] animation.sapling.render.${textureChannel}`);
    });
}