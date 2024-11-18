import { world, system } from '@minecraft/server'

export default class World {
	// Dimensions 
	static #overworld = world.getDimension('overworld');
	static #nether = world.getDimension('nether');
	static #the_end = world.getDimension('the_end');
	static #allDims = [ this.#overworld, this.#nether, this.#the_end ];
	static #dimensions = [ 'overworld', 'nether', 'the_end', 'all' ];
	static #dimensionIds = ['overworld', 'nether', 'the_end'];
	
	// Cloned Methods
	static sendMessage = (message) => world.sendMessage(message);
	static setAbsoluteTime = (absoluteTime) => world.setAbsoluteTime(absoluteTime);
	static setTimeOfDay = (timeOfDay) => world.setTimeOfDay(timeOfDay);
	static setWeather = (weatherType, duration) => {
		system.run(this.#overworld.setWeather(weatherType, duration))
	}
	static getDay = () => world.getDay();
	static getTimeOfDay = () => world.getTimeOfDay();
	static getMoonPhase = () => world.getMoonPhase();
	static getAbsoluteTime = () => world.getAbsoluteTime();
	static getDefaultSpawnLocation = () => world.getDefaultSpawnLocation();
	static getWeather = () => system.run(() => this.#overworld.getWeather());
	static runCommand = (command) => this.#overworld.runCommand(command);
	static playMusic = (trackId, musicOptions = undefined) => world.playMusic(trackId, musicOptions);
	static playSound = (soundId, location, soundOptions = undefined) => world.playSound(soundId, location, soundOptions);
	static queueMusic = (trackId, musicOptions = undefined) => world.queueMusic(trackId, musicOptions);
	static stopMusic = () => world.stopMusic();
	static getPlayers = (options = {}) => world.getPlayers(options);
	static getEntity = (id) => world.getEntity(id);
	
	// Cloned Properties 
	static gameRules = world.gameRules;
	static isHardcore = world.isHardcore;
	static dimension = { 
		overworld: this.#overworld,
		nether: this.#overworld,
		the_end: this.#overworld,
		'minecraft:overworld': this.#overworld,
		'minecraft:nether': this.#nether,
		'minecraft:the_end': this.#the_end
	}
}