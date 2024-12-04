import * as mc from '@minecraft/server';

export default class JsonDB {
	constructor (name) {
		this.name = name;
		// Create or get
		let db = mc.world.getDynamicProperty(this.name);
		if (!db) mc.world.setDynamicProperty(this.name, '{}');
	
		let s = Object.keys(db || {}).length;
		this.size = s;
	}
	
	get (key) {
		let db = mc.world.getDynamicProperty(this.name);
		let json = JSON.parse(db);
		
		return json[key];
	}
	
	set (key, value) {
		let db = mc.world.getDynamicProperty(this.name);
		let json = JSON.parse(db);
		
		if (!json[key]) this.size++;
		json[key] = value;
		
		let str = JSON.stringify(json);
		mc.world.setDynamicProperty(this.name, str);
	}
	
	has (key) {
		let db = mc.world.getDynamicProperty(this.name);
		let json = JSON.parse(db);
		
		if (json[key]) return true;
		else return false;
	}
	
	remove (key) {
		let db = mc.world.getDynamicProperty(this.name);
		let json = JSON.parse(db);
		
		if (json[key]) this.size--;
		delete json[key];
		
		let str = JSON.stringify(json);
		mc.world.setDynamicProperty(this.name, str);
	}
	
	async forEach (callback, forAwait = false) {
		let db = mc.world.getDynamicProperty(this.name);
		let json = JSON.parse(db);
		
		let data = Object.keys(json);
		if (forAwait) {
			for await (let key of data) callback(key, json[key]);
		} else {
			for (let key of data) callback(key, json[key]);
		}
	}
	
	parse () {
		let db = mc.world.getDynamicProperty(this.name);
		let json = JSON.parse(db);
		return json;
	}
	
	values () {
		let db = mc.world.getDynamicProperty(this.name);
		let json = JSON.parse(db);
		
		return Object.values(json);
	}
	
	keys () {
		let db = mc.world.getDynamicProperty(this.name);
		let json = JSON.parse(db);
		
		return Object.keys(json);
	}

	clear() {
		mc.world.setDynamicProperty(this.name, '{}');
	}
}

export class Tracker {
	constructor(gamerule, callback, timeout = 10) {
		this.gamerule = gamerule;
		this.callback = callback;
		this.db = new JsonDB(this.gamerule).parse()
		this.event = mc.system.runInterval(() => {
			const dbp = new JsonDB(this.gamerule).parse();
			for (const k in this.db) {
				if (this.db[k] == dbp[k]) continue;
				this.db[k] = dbp[k];
				const ev = { gamerule: k, value: dbp[k] }
				callback(ev);
			}
		}, timeout);
	}
	
	unsubscribe() {
		mc.system.clearRun(this.event);
	}
}