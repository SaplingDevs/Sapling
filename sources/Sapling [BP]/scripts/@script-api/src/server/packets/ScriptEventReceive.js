import { system } from '@minecraft/server'

export default class ScriptEventReceive {
	// Subscribe
	static subscribe(callback, filters = []) {
		return system.afterEvents.scriptEventReceive.subscribe(callback, filters)
	}
	
	// Unsubscribe
	static unsubscribe(runtime) {
		system.afterEvents.scriptEventReceive.unsubscribe(runtime)
	}
}