import * as gt from "@minecraft/server-gametest";
import { system, Vector3, world, BlockVolume } from "@script-api/server.js";
import FakePlayer from "lib/Fakeplayer";

gt.register('fakeplayer', 'instance', (test) => {
	console.warn('§uFakeplayer: §rinstance loaded')
	FakePlayer.test = test;
})
	.maxTicks(0x7FFFFFFF)
	.structureName('piston:up');
	
// Load gametest instance
function LoadInstance() {
	const over = world.dimension['overworld'];
	const c = 1000000;
	
	if (LoadInstance.loaded) return;

	try {
		over.fillBlocks(new BlockVolume(new Vector3(c+1, -64, c+1), new Vector3(c-2, 319, c+3)), "air");
	} catch {}

	system.timeout(() => over.runCommand(`execute positioned ${c} 256 ${c} run gametest run fakeplayer:instance`), 1);
	
	LoadInstance.loaded = true;
}

system.timeout(() => {
    const currentGR = {
        doMobSpawning: world.gameRules.doMobSpawning,
        doDayLightCycle: world.gameRules.doDayLightCycle,
        randomTickSpeed: world.gameRules.randomTickSpeed
    }

	LoadInstance();
	
	world.gameRules.doMobSpawning = currentGR.doMobSpawning;
	world.gameRules.doDayLightCycle = currentGR.doDayLightCycle;
	world.gameRules.randomTickSpeed = currentGR.randomTickSpeed;
}, 20);