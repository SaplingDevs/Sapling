import world from './src/server/world.js'
import system from './src/server/system.js'
import Vector3 from './src/server/Vector3.js'
import packet, { CustomPacket } from './src/server/packet.js'
import { server } from './src/server/server.js'
import './src/server/custom_packets.js'

export { world, system, Vector3, packet, CustomPacket, server }
export { ItemStack, BlockPermutation, StructureManager, MolangVariableMap } from '@minecraft/server'

export class RawText { constructor(data) { return { "rawtext": data } }}