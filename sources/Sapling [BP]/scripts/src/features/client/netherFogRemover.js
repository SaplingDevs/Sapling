import { world, system } from "@script-api/server.js"

system.interval(() => {
    const Players = world.getPlayers();
    for (const player of Players) {
        if (player.hasTag('client:netherFogRemover') && player.dimension.id == 'minecraft:nether') {
            player.runCommand('fog @s push "sa:nether_remover" "nether_remover"');
        }
        else player.runCommand('fog @s remove "nether_remover"');
    }
}, 10);