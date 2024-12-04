import { world, system } from '@minecraft/server';

export default class ChunkLoading {
	static #chunksLoaded = {};

	// Subscribe
	static subscribe(callback, config = { interval: 10 }) {
		// Run Interval
		const runtime = system.runInterval(() => {
			const players = world.getAllPlayers();
			let localChunks = {};

			for (const player of players) {
				const { x, y, z } = player.location;
				const { id } = player.dimension;
				const rx = Math.floor(x / 16) * 16 + 192;
				const rz = Math.floor(z / 16) * 16 + 192;

				// Track Chunks
				for (let lx = -rx; lx <= rx; lx += 16) {
					for (let lz = -rz; lz <= rz; lz += 16) {
						const cx = Math.floor((x + lx) / 16);
						const cz = Math.floor((z + lz) / 16);
						const key = `${id}/${cx}/${cz}`;
						try {
							const v = { x: cx * 16, y: 120, z: cz * 16 };
		
							player.dimension.getBlock(v);
							localChunks[key] = 1;
							
							if (!this.#chunksLoaded[key]) {
								this.#chunksLoaded[key] = 1;
								if (callback) callback({ cx, cz, id });
							}
						} catch (e) {
							delete this.#chunksLoaded[key];
						}
					}
				}
			}
			this.#chunksLoaded = localChunks;
		}, config.interval);
		
		return runtime;
	}
	
	static unsubscribe(runtime) {
		system.clearRun(runtime);
		this.#chunksLoaded = {};
	}
}