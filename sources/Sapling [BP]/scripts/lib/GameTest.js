import * as gt from "@minecraft/server-gametest";
import { system, world } from "@script-api/server.js";
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
	const c = -999999999;
	
	if (LoadInstance.loaded) return;

	over.runCommand('gametest clearall')
	over.runCommand(`execute positioned ${c} 256 ${c} run gametest run fakeplayer:instance`);
	
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