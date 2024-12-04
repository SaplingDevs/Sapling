import * as mc from '@minecraft/server'

// Main Class
export default class FP {
	static test;
	#fakeplayer;
	#intervals;
	#ValidRepeatActions = ['attack', 'jump', 'shift', 'breakblock', 'interact', 'useitem', 'build']
	
	// "Connect" method
	constructor(username, sender) {
		// Create Fakeplayer
		const player = FP.test.spawnSimulatedPlayer({ x: 0, y: 1, z: 0 }, username);
		player.teleport(sender.location, {
			dimension: sender.dimension,
			facingLocation: sender.getViewDirection()
		});
		
		// Set Class Values
		this.#fakeplayer = player;
		this.#intervals = {};
	}
	
	
	/*///////////////////////////
	*	Wrapped Methods:
	*////////////////////////////
	disconnect() {
		this.#fakeplayer.disconnect();
	}
	
	kill() {
		this.#fakeplayer.kill();
	}
	
	respawn(sender) {
		this.#fakeplayer.respawn();
		this.teleport(sender);
	}
	
	attack() {
		this.#fakeplayer.attack();
	}
	
	jump() {
		this.#fakeplayer.jump();
	}
	
	shift() {
		this.#fakeplayer.isSneaking = !this.#fakeplayer.isSneaking;
	}
	
	hotbar(slot = 0) {
		if (slot < 0 || slot > 8) return;
		this.#fakeplayer.selectedSlotIndex = slot;
	}
	
	interact(mode = 'default') {
		if (mode === 'block') {
			this.#getBlockFromViewDirection((b) => {
				const loc = FP.test.relativeBlockLocation(b.location);
				this.#fakeplayer.interactWithBlock(loc);
			});
		} else {
			this.#fakeplayer.interact();
		}
	}
	
	useitem(mode = 'default') {
		const slot = this.#fakeplayer.selectedSlotIndex;
		if (mode === 'block') {
			this.#getBlockFromViewDirection((b) => {
				const loc = FP.test.relativeBlockLocation(b.location);
				this.#fakeplayer.useItemInSlotOnBlock(slot, loc);
			});
		} else {
			this.#fakeplayer.useItemInSlot(slot);
		}
	}
	
	dropslot(slot = this.#fakeplayer.selectedSlotIndex) {
		if (slot < 0 || slot > 8) return;
		this.selectedSlotIndex(slot);
		this.#fakeplayer.dropSelectedItem();
	}
	
	teleport(sender) {
		this.#fakeplayer.teleport(sender.location, {
			dimension: sender.dimension,
			facingLocation: sender.getViewDirection()
		});
	}
	
	look(sender) {
		const b = sender.getBlockFromViewDirection();
		if (!b) return;
		const loc = FP.test.relativeBlockLocation(b.block.location);
		this.#fakeplayer.lookAtBlock(loc);
	}
	
	breakblock() {
		this.#getBlockFromViewDirection((b) => {
			const loc = FP.test.relativeBlockLocation(b.location);
			this.#fakeplayer.breakBlock(loc);
		});
	}
	
	build() {
		const slot = this.#fakeplayer.selectedSlotIndex;
		this.#getBlockFromViewDirection((b) => {
			const loc = FP.test.relativeBlockLocation(b.location);
			this.#fakeplayer.startBuild(slot);
		});
	}
	
	
	/*///////////////////////////
	*	Custom Methods
	*////////////////////////////
	repeat(action, params) {
		if (!this.#ValidRepeatActions.includes(action)) return mc.world.sendMessage('§7Invalid action to repeat');
		else if (this.#intervals[action]) return;
		this.#intervals[action] = mc.system.runInterval(() => {
			this[action](...params);
		}, 4);
	}
	
	stop() {
		for (let x in this.#intervals) {
			const act = this.#intervals[x];
		
			mc.system.clearRun(act);
			delete this.#intervals[x];
		}
		
		this.#fakeplayer.stopBreakingBlock();
		this.#fakeplayer.stopBuild();
		this.#fakeplayer.stopInteracting();
		this.#fakeplayer.stopUsingItem();
	}
	
	minecart() {
		if (this.#intervals['trackMinecart']) return;
		
		let trckInt = mc.system.runInterval(() => {
			const { dimension, location } = this.#fakeplayer;
			
			const cart = dimension.getEntities({
				type: 'minecart',
				location: location,
				maxDistance: 3
			})[0];
			
			if (!cart) return;
			
			this.#fakeplayer.interactWithEntity(cart);
		}, 30);
		
		this.#intervals['trackMinecart'] = trckInt;
	}
	
	async trident() {
		const { container } = this.#fakeplayer.getComponent('inventory');
		let [ hasTrident, slot ] = [ false, 0 ];
		
		for (let i=0; i<9; i++) {
			if (hasTrident) continue;
			const item = container.getItem(i) || { typeId: 'minecraft:air' };
			
			if (item.typeId == 'minecraft:trident') {
				slot = i;
				hasTrident = true;
			}
		}
		
		if (!hasTrident) return mc.world.sendMessage(`§3the fakeplayer "${this.#fakeplayer.name}" does not have a trident in the hotbar`)
		
		this.#fakeplayer.useItemInSlot(slot);
		await this.#wait(15);
		this.#fakeplayer.stopUsingItem();
	}
	
	dismount() {
		this.#fakeplayer.teleport(this.#fakeplayer.location);
	}
	
	/*///////////////////////////
	*	Privated Methods
	*////////////////////////////
	#getBlockFromViewDirection(callback) {
		const b = this.#fakeplayer.getBlockFromViewDirection();
		if (!b) return;
		callback(b.block);
	}
	
	#wait(gt = 20) {
		return new Promise(res => mc.system.runTimeout(res, Number(gt)));
	}
}
