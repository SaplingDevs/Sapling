import { world, system, ItemStack } from "@script-api/server.js";

system.interval(() => {
    const carts = world.dimension.overworld.getEntities({ type: "chest_minecart" });

    carts.forEach((c) => {
        const cartContainer = c.getComponent("inventory").container;
        cartContainer.setItem(0, new ItemStack("portal", 64));
    });
}, 10);