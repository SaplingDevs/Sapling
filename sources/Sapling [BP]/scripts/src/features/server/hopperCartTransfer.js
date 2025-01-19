import { world, system } from "@script-api/server.js";
import { JsonDB } from "@script-api/sapling.js";

export default { packet: "none" };

system.interval(() => {
    const db = new JsonDB("ServerGamerules");

    if (!db.get("hopperCartTransfer")) return;

    const minecarts = getAllEntities();

    minecarts.forEach((cart) => {
        try {
            MinecartIteration(cart);
        } catch (e) { console.error(e) }
    });
});

function MinecartIteration(cart) {
    const cartInv = cart.getComponent("inventory");
    let blockBelow = cart.dimension.getBlockBelow(cart.location);
    
    if (blockBelow.typeId.includes("rail")) {
        if (blockBelow.typeId === "minecraft:activator_rail" && blockBelow.getRedstonePower() > 0) return;
        
        const loc = cart.location;
        loc.y -= 1;
        blockBelow = cart.dimension.getBlockBelow(loc);
    }

    const blockInv = blockBelow.getComponent("inventory");

    if (!blockInv) return;

    const cartContainer = cartInv.container;
    const blockContainer = blockInv.container;

    for (let i = 0; i < cartContainer.size; i++) {
        const item = cartContainer.getItem(i);
        if (!item || (item?.typeId.includes("shulker_box") && blockBelow.typeId.includes("shulker_box"))) continue;

        const singleItem = item.clone();
        singleItem.amount = 1;

        if (canAdd(blockContainer, singleItem)) {
            blockContainer.addItem(singleItem);

            if (item.amount > 1) {
                item.amount -= 1;
                cartContainer.setItem(i, item);
            } else {
                cartContainer.setItem(i, null);
            }

            break;
        }
    }
}

function canAdd(inventory, itemStack) {
    if (inventory.emptySlotsCount > 0) return true;

    for (let i = 0; i < inventory.size; i++) {
        const slot = inventory.getSlot(i);
        if (slot.hasItem() && slot.isStackableWith(itemStack) && isWithinStackSize(slot, itemStack)) {
            return true;
        }
    }

    return false;
}

function isWithinStackSize(slot, itemStack) {
    return slot.amount + itemStack.amount <= slot.maxAmount;
}

function getAllEntities() {
    const entities = ["overworld", "nether", "the_end"]
        .map((d) => world.getDimension(d).getEntities({ type: "hopper_minecart" }))
        .flat();

    return entities;
}