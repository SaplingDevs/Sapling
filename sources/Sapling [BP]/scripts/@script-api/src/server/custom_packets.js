import ChunkLoading from './packets/ChunkLoading.js'
import ScriptEventReceive from './packets/ScriptEventReceive.js'
import Packet from './packet.js'

Packet.register('chunkLoading', ChunkLoading);
Packet.register('scriptEventReceive', ScriptEventReceive);