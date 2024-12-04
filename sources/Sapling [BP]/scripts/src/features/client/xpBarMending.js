import { world, system, ItemStack } from "@script-api/server.js"

system.interval(() => {
    const parsedPlayers = world.getPlayers({
        tags: [ 'client:xpBarMending' ]
    });

    for (let player of parsedPlayers) {
        xpBarMending(player);
    }
}, 1);

function xpBarMending(player = world.getPlayers()[0]) {
    if (!player.isSneaking) return;
    // Data
    const inventory = player.getComponent('inventory').container;
    const item = inventory.getItem(player.selectedSlotIndex);
    if (!item || !item.hasComponent('durability') || !item.hasComponent('enchantable')) return;

    const durability = item.getComponent('durability');
    const hasMending = item.getComponent('enchantable').hasEnchantment('mending');
    if (!hasMending) return;

    let damage = durability.damage;
    let newDurability = damage - 20 < 0 ? 0 : damage - 20;

    const currentLevel = player.level;
    const playerXp = player.getTotalXp();
    const currentXp = player.xpEarnedAtCurrentLevel;

    if (playerXp < 4 || damage == 0) return;
    
    if (currentXp == 0) {
        player.resetLevel();
        player.addLevels(currentLevel - 1);
        player.addExperience(player.totalXpNeededForNextLevel - 4);
    } else player.addExperience(-4);

    replaceItem(player, item.clone(), newDurability, inventory);
}

function replaceItem(player, item = new ItemStack(), newDurability, inventory) {

    const itemData = {
        nameTag: item.nameTag,
        lore: item.getLore(),
        enchants: item.getComponent('enchantable').getEnchantments()
    }

    player.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 ${item.typeId} 1 ${newDurability}`);

    const newItem = inventory.getItem(player.selectedSlotIndex);
        newItem.nameTag = itemData.nameTag;
        newItem.setLore(itemData.lore);
        newItem.getComponent('enchantable').addEnchantments(itemData.enchants);
    
    inventory.setItem(player.selectedSlotIndex, newItem);

    if (newDurability == 0) player.runCommand('playsound random.levelup @s');
    else if (0.8 < Math.random()) player.runCommand('playsound random.orb @s');
}