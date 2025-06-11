import { system, VanillaEntityIdentifier, world } from "@minecraft/server";
import { Utils } from "classes/Utils";
import { CommandResult, CommandStatus, PermissionLevel } from "types";
import Chunk from "~/core/Chunk";
import { Vector3 } from "~/server";
import { CommandBuilder } from "~/server/Command";

new CommandBuilder()
  .setName("sapling:prof")
  .setDescription("sapling.help.command.prof")
  .requireCheats(false)
  .setPermissionLevel(PermissionLevel.Any)
  .setCallback(ProfCallback)
  .build();

function ProfCallback(): CommandResult {
  world.sendMessage(Utils.RawTextBuilder([ { translate: "sapling.base.prof" } ]))

  const overworld = world.getDimension("overworld");
	
	const DATA = {
		tps: 20,
		lastTick: Date.now(),
		timeArray: [],
		entities: 0,
		chunks: 0
	}

  const runTime = system.runInterval(() => {
		if (DATA.timeArray.length == 20) { 
			DATA.timeArray.shift();
		}
		
		DATA.timeArray.push(Math.round(1000 / (Date.now() - DATA.lastTick) * 100) / 100);
		DATA.tps = DATA.timeArray.reduce((a,b) => a + b) / DATA.timeArray.length;
		DATA.lastTick = Date.now();
	});


  system.runTimeout(() => {
		system.clearRun(runTime);

		DATA.chunks = getChunks();
		
		DATA.tps = Math.floor(DATA.tps);
		for (let x of overworld.getEntities()) {
			if (x.typeId.startsWith('sa:')) continue;
			DATA.entities++;
		}
		
		const DataText = ''
			+ `TPS: §r§${DATA.tps < 20 ? ('c' + parseInt(DATA.tps.toString())) : 'a20'}§r `
			+ `Entities: §s${DATA.entities}§r\n`
			+ `Chunks: §r§i${DATA.chunks}§r`
		
		world.sendMessage(DataText);
	}, 100);

  return { status: CommandStatus.Success };
}


function getChunks() {
	const PLAYERS = world.getPlayers();
	const Keys = [];
	let Chunks = 0;
	
	PLAYERS.forEach((player) => {
		const { x, y, z } = player.location;
		const { id } = player.dimension;
		const rx = x + 192;
		const rz = z + 192;
		
		for (let lx = rx; lx > -rx; lx -= 16) {
			for (let lz = rz; lz > -rz; lz -= 16) {
				const c = new Chunk(lx, lz);
				const key = `${id}/${c.worldX}/${c.worldZ}`
				
				if (Keys.includes(key)) continue;
				try {
					const cl = new Vector3(c.center.x, y, c.center.z);
					const ce = player.dimension.spawnEntity('sa:chunk' as VanillaEntityIdentifier, cl);
					
					Chunks++;
					ce.remove();
					Keys.push(key);
				} catch {}
			}
		}
	});
	
	return Chunks;
}