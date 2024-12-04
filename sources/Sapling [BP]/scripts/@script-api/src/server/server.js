import { system, world } from "@minecraft/server";

const server = {
	tps: 20,
	lastTick: Date.now(),
	timeArray: []
}

system.runInterval(() => {
    // Tps
	if (server.timeArray.length == 20) server.timeArray.shift();
	server.timeArray.push(Math.round(1000 / (Date.now() - server.lastTick) * 100) / 100);
	server.tps = server.timeArray.reduce((a,b) => a + b) / server.timeArray.length;
	server.lastTick = Date.now();
});

export { server }