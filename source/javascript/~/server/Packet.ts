import { world } from '@minecraft/server';

export default class Packet {
  private static _packets = new Map<string, any>();

  // Public static method to register packets directly
  public static registerVanillaEvents() {
    const { afterEvents, beforeEvents } = world;

    // Register the vanilla afterEvents into the _packets Map
    for (const p in afterEvents) {
      this._packets.set(p, afterEvents[p]);
    }

    // Register the vanilla beforeEvents into the _packets Map
    for (const p in beforeEvents) {
      this._packets.set('before::' + p, beforeEvents[p]);
    }
  }

  static on(packet: string, callback: Function) {
    const event = this._packets.get(packet);
    if (!event) {
      throw new Error(`Packet "${packet}" does not exist.`);
    }
    const runtime = event.subscribe(callback);
    return { packetID: packet, runtime };
  }

  static off(packet: { packetID: string, runtime: any }) {
    const { packetID, runtime } = packet;
    const event = this._packets.get(packetID);
    if (!event) {
      throw new Error(`Packet "${packetID}" does not exist.`);
    }
    event.unsubscribe(runtime);
  }

  static register(packetID: string, PacketClass: any, config = { customTag: true }) {
    const { customTag } = config;
    const packetTag = customTag ? `custom::${packetID}` : packetID;
    const event = this._packets.get(packetTag);
    if (event) {
      throw new Error(`Packet "${packetID}" already exists.`);
    }
    this._packets.set(packetTag, PacketClass);
  }
}

// Call registerVanillaEvents to register Minecraft's vanilla event packets
Packet.registerVanillaEvents();