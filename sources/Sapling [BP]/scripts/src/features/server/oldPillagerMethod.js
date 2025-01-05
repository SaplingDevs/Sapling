export default function oldPillagerMethod(event) {
	if (event.deadEntity.typeId !== 'minecraft:pillager') return;

	const player = event.damageSource.damagingEntity;
	const entity = event.deadEntity;
	
	const items = entity.dimension.getEntities({
		location: entity.location,
		maxDistance: 4,
		type: 'minecraft:item'
	});
	
	for (const itemEntity of items) {
		const item = itemEntity.getComponent('item').itemStack;
		
		if (item.typeId !== 'minecraft:ominous_bottle') continue;
		
		player.runCommand('effect @s raid_omen 6000');
		itemEntity.kill();
	}
}

oldPillagerMethod.packet = 'entityDie'