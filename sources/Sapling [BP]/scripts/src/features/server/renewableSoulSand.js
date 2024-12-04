export default function renewableSoulSand(event) {
	const MOBS = [
		'minecraft:zombie',
		'minecraft:skeleton',
		'minecraft:stray',
		'minecraft:enderman'
	];
	
	if (!['fireTick','fire'].includes(event.damageSource.cause)) return;
	else if (!MOBS.includes(event.deadEntity.typeId)) return;
	
	event.deadEntity.runCommandAsync('execute if block ~~-1~ sand run setblock ~~-1~ soul_sand [] replace');
}

renewableSoulSand.packet = 'entityDie'