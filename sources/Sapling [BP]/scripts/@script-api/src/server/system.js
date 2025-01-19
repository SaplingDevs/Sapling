import { system } from '@minecraft/server'

export default class System {
	static interval(callback, ticks = 1) {
		return system.runInterval(callback, ticks)
	}
	
	static timeout(callback, ticks = 1) {
		return system.runTimeout(callback, ticks)
	}
	
	static run(callback) {
		return system.run(callback)
	}
	
	static clear(runId) {
		system.clearRun(runId);
	}
	
	static sleep(ms) {
		return new Promise(res => this.timeout(res, ms/50));
	}

	static runJob(generator) {
		return system.runJob(generator);
	}

	static clearJob(generator) {
		system.clearJob(generator)
	}

	static currentTick = system.currentTick;

	static afterEvents = system.afterEvents;
	
	static beforeEvents = system.beforeEvents;
}