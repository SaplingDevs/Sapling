import { world } from '@minecraft/server'

export default class Packet {
	static _packets = {}
	
	static on(packet, callback) {
		const event = this._packets[packet];
		if (!event) {
			throw new Error(`Packet "${packet}" does not exist.`);
		}
		const runtime = event.subscribe(callback);
		return { packetID: packet, runtime };
	}
	
	static off(packet) {
		const { packetID, runtime } = packet;
		const event = this._packets[packetID];
		if (!event) {
			throw new Error(`Packet "${packetID}" does not exist.`);
		}
		event.unsubscribe(runtime);
	}
	
	static register(packetID, PacketClass, config = { customTag: true }) {
		const { customTag } = config;
		const packetTag = customTag ? `custom::${packetID}` : packetID
		const event = this._packets[packetTag];
		if (event) {
			throw new Error(`Packet "${packetID}" already exists.`);
		}
		this._packets[packetTag] = PacketClass;
	}
}

export class CustomPacket {
	static subscribe(callback) {
		console.warn('Custom Packet!')
		callback();
	}
	
	static unsubscribe(packet) {
		console.warn('Unsubscribe!')
	}
}


const { afterEvents, beforeEvents } = world;
for (let p in afterEvents) Packet._packets[p] = afterEvents[p];
for (let p in beforeEvents) Packet._packets['before::' + p] = beforeEvents[p];