import { world, system } from "@script-api/server.js";

class HSA {
	constructor (op) {
		this.hssId = op.hssId;
		this.location = op.location;
		this.dimension = op.dimension;
	}
	
	spawn() {
		const hss = HSA.hssList[this.hssId];
		const { x, y, z } = this.location;
		let randomNumber = Math.random();
		
		let validArea = this.dimension.getPlayers({
			location: this.location,
			maxDistance: 128
		}).length;
		
		let invalidArea = this.dimension.getPlayers({
			location: this.location,
			maxDistance: 16
		}).length;
		
		let blocks = [
			getBlock(x, y-1, z, this.dimension),
			getBlock(x, y+0, z, this.dimension),
			getBlock(x, y+1, z, this.dimension)
		];
		
		let lev = this.dimension.spawnEntity('sa:light_level', this.location)

		system.timeout(() => {
			let light_level = 7;
			try {
				light_level = lev.getProperty('sa:light');
				lev.remove();
			} catch {}

			if (!world.gameRules.doMobSpawning) return;
			else if (invalidArea > 0 || validArea <= 0 || randomNumber > hss.probability) return;
			else if (hss.light < light_level) return;
			else if (!hss.conditions(blocks)) return;
			
			let r = Math.floor(Math.random() * hss.mobs.length);
			let e = hss.mobs[r];
			
			let ev = hss.event;
			let res = this.dimension.spawnEntity(e, this.location);
			
			if (ev) ev(res);
		}, 2) 
	}
	
	static hssList = {
		SwampHut: {
			mobs: ['minecraft:witch'],
			probability: 0.30,
			light: 7,
			conditions: function(blocks) {
				let [a,b] = blocks;
				return a.isSolid && !b.isSolid;
			}
		},
		
		NetherFortress: {
			mobs: [
				'minecraft:wither_skeleton',
				'minecraft:blaze',
				'minecraft:zombie_pigman'
			],
			probability: 0.45,
			light: 7,
			conditions: function(blocks) {
				let [a,b,c] = blocks;
				return a.isSolid && !b.isSolid;
			}
		},
		
		PillagerOutpost: {
			mobs: [
				'minecraft:pillager'
			],
			probability: 0.40,
			conditions: function(blocks) {
				let [a,b,c] = blocks;
				return !a.isAir && !b.isSolid;
			},
			event: function(e) {
				let r = Math.random();
				if (r < 0.30) e.runCommand('event entity @s minecraft:promote_to_illager_captain')
			}
		},
		
		OceanMonument: {
			mobs: [
				'minecraft:guardian'
			],
			probability: 0.30,
			conditions: function(blocks) {
				let [a,b,c] = blocks;
				return b.isLiquid;
			}
		}
	}
}

function getBlock(x,y,z,d) {
	return d.getBlock({ x, y, z });
}

export default HSA;