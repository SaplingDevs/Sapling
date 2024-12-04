import { packet } from "@script-api/server.js";

packet.on('itemUseOn', (event) => {
    const enable = event.source.hasTag('client:minecartStacking');
    if (!enable || !event.itemStack.typeId.includes('minecart')) return;

    const player = event.source;
    const gamemode = player.getGameMode();
    const inventory = player.getComponent('inventory').container;

    const parsedLoc = {
        x: event.block.location.x + 0.5,
        y: event.block.location.y,
        z: event.block.location.z + 0.5
    }
    
    player.dimension.spawnEntity(event.itemStack.typeId, parsedLoc);

    if (gamemode !== 'creative') {
        inventory.setItem(player.selectedSlotIndex)
    }
});