const SwordsDamage = {
    'minecraft:wooden_sword': 6.4,
    'minecraft:golden_sword': 6.4,
    'minecraft:stone_sword': 8,
    'minecraft:iron_sword': 9.6,
    'minecraft:diamond_sword': 11.2,
    'minecraft:netherite_sword': 12.8,
}

const clicks = new Map();

export default function sweepingEdge({ damagingEntity, hitEntity }) {
    try {
        if (damagingEntity.typeId !== 'minecraft:player') return;
        
        // Track Clicks
        const clickInfo = { timestamp: Date.now() };
        const playerClicks = clicks.get(damagingEntity) || [];
        playerClicks.push(clickInfo);
        clicks.set(damagingEntity, playerClicks);

        // Sweeping Edge
        if (getPlayerCPS(damagingEntity) > 1) return;

        const loc = hitEntity.location;
        const dim = hitEntity.dimension;

        const entities = dim.getEntities({
            location: loc,
            maxDistance: 2,
            excludeTypes: [ 'minecraft:armor_stand' ],
            excludeFamilies: [ 'minecart' ],
        });

        const inv = damagingEntity.getComponent('inventory').container;
        const item = inv.getItem(damagingEntity.selectedSlotIndex);

        if (!item?.typeId || !SwordsDamage[item.typeId]) return;

        const damage = SwordsDamage[item.typeId] * (Math.random() < 0.5 ? 0.5 : 0.75)

        for (const e of entities) {
            if (e.id === damagingEntity.id || e.id === hitEntity.id) continue;

            e.applyDamage(damage, { cause: 'entityAttack', damagingEntity });
        }
    } catch {}
}

sweepingEdge.packet = 'entityHitEntity'

// Config 
function getPlayerCPS(player) {
    const currentTime = Date.now();
    const playerClicks = clicks.get(player) || [];
    const recentClicks = playerClicks.filter(({ timestamp }) => currentTime - 1000 < timestamp);
    clicks.set(player, recentClicks);
    return recentClicks.length;
}