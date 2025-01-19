import { world, system } from "@script-api/server.js"

system.interval(() => world.runCommand('effect @a[tag=client:fullBright] night_vision 1 1 true'), 1);