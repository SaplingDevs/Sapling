import { world, system, ItemStack } from "@script-api/server.js";
import { FluidType } from "@script-api/vanilla-data.js"
import { JsonDB } from "@script-api/sapling.js";

const CONVERSION_DURATION = 140; 
const conversions = {};

export default function cauldronConcrete({ entity }) {
    const item = entity?.getComponent('item')?.itemStack;
    if (item?.typeId.includes('concrete_powder')) entity.addTag('cc:concrete_powder');
}

cauldronConcrete.packet = 'entitySpawn';

const dims = Object.keys(world.dimension).filter((d) => !d.startsWith('minecraft:'));
system.interval(() => {
    if (!(new JsonDB('ServerGamerules').get('cauldronConcrete'))) return;

    for(const id of dims) {
        const items = world.getDimension(id).getEntities({
            type: 'minecraft:item',
            tags: [ 'cc:concrete_powder' ]
        });

        items.forEach(item => {
            if (!checkWaterCauldron(item) || !processConversion(item)) return;
            finalizeConversion(item);
        });
    }
});

// Functions
function checkWaterCauldron(entity) {
    const block = entity.dimension.getBlock(entity.location)?.getComponent('fluidContainer');
    return block?.getFluidType() === FluidType.Water && block.fillLevel === 6;
}

function processConversion(entity) {
    const id = entity.id;
    conversions[id] = (conversions[id] || 0) + 1;
    return conversions[id] >= CONVERSION_DURATION;
}

function finalizeConversion(entity) {
    const { typeId, amount } = entity.getComponent('item').itemStack;
    const { location, dimension } = entity;
    const velocity = entity.getVelocity();

    entity.remove();
    const newEntity = dimension.spawnItem(new ItemStack(typeId.replace('_powder', ''), amount), location);
    newEntity.clearVelocity();
    newEntity.applyImpulse(velocity);
    dimension.spawnParticle('minecraft:cauldron_explosion_emitter', location);
    dimension.playSound('brush.generic', location);
    delete conversions[entity.id];
}