import { Command } from "@script-api/core.js";
import { RawText, system } from "@script-api/server.js";
import { Utils } from "@script-api/sapling.js";
import Fakeplayer from "lib/Fakeplayer"

const FakeplayersDB = new Map();

new Command()
    .setName('fakeplayer')
    .rawCommand((ev) => {
        system.run(() => FakeplayerCmd(ev))
    });

const HelpGuide = {
	spawn: '',
	kill: '',
	respawn: '',
	jump: '§e(*)§u',
	attack: '§e(*)§u',
	shift: '§e(*)§u',
	hotbar: '<slot: 0-8>',
	interact: '§e(*)§u <mode? block>',
	useItem: '§e(*)§u <mode? block>',
	dropSlot: '<slot? 0-8>',
	teleport: '',
	look: '[the block you look at]',
	breakBlock: '§e(*)§u [the looking block]',
	build: '§e(*)§u [the looking block]',
	repeat: 'any action marked with §e*',
	stop: '',
	minecart: '',
	trident: '[requires a trident in any hotbar slot]',
	dismount: ''
}

export function FakeplayerCmd(ev = { message: '' }, helpMode = false) {
	let [_, username, action, ...params] = ev.message.split(' ');
	const { sender } = ev;
	/*//////////////////
	*	Help Options
	*///////////////////
	if (helpMode || !username || username == '--help') {
		let txt = '§lFakeplayer Guide:§r\n'
	
		for (let h in HelpGuide) {
			txt += `  §7- [command] §3<username> §2${h} §u${HelpGuide[h]}§r\n`
		}
		
		return helpMode ? txt.trim() : Utils.privateMessage(sender, txt.trim());
	}
	
	
	/*//////////////////
	*	Script Engine
	*///////////////////
	/* Comming soon) */
	
	
	/*//////////////////
	*	Fakeplayer
	*///////////////////
	action = action ? action.toLowerCase() : 'invalid';
	
	const SingleActions = ['attack', 'jump', 'shift', 'minecraft', 'trident', 'stop', 'breakblock', 'build', 'dismount']
	const SenderActions = ['respawn', 'teleport', 'look'];
	const ParamsActions = ['hotbar', 'dropslot', 'useitem', 'interact'];
	
	const ItsSingleAction = SingleActions.includes(action);
	const ItsSenderAction = SenderActions.includes(action);
	const ItsParamsAction = ParamsActions.includes(action);
	
	// Connect 
	if (action === 'spawn') {
		// Check if it's already connected
		if (FakeplayersDB.has(username)) {
			return sender.sendMessage(new RawText([
				{ translate: "sapling.fakeplayer.connected", with: [username] }
			]))
		}
		// Connect 
		const fp = new Fakeplayer(username, sender);
		FakeplayersDB.set(username, fp);
	} 
	
	// Disconnect
	else if (action === 'kill') CheckPlayer(username, (fp) => {
		fp.stop();
		fp.kill();
		fp.disconnect();
		FakeplayersDB.delete(username);
	}, sender); 
	
	// Repeat
	else if (action === 'repeat') CheckPlayer(username, (fp) => {
		const [ ActionToRepeat = 'invalid', Mode = 'default' ] = params;
		fp[action](ActionToRepeat.toLowerCase(), [ Mode ]);
	}, sender);
	
	// Params Actions
	else if (ItsParamsAction) CheckPlayer(username, (fp) => {
		let param = params[0] || 'default';
		
		if (action == 'hotbar' || action == 'dropslot') {
			param = parseInt(param) || 0;
		}
		
		fp[action](param);
	}, sender); 
	
	// Single Actions
	else if (ItsSingleAction) CheckPlayer(username, (fp) => {
		fp[action]();
	}, sender);
	
	// Sender Actions
	else if (ItsSenderAction) CheckPlayer(username, (fp) => {
		fp[action](ev.sender);
	}, sender); 
	
	// Default Output
	else sender.sendMessage(new RawText([
		{ translate: "sapling.fakeplayer.invalid.action", with: [ action ] }
	]))
}

// Players DB
function CheckPlayer(username, callback, sender) {
	if (FakeplayersDB.has(username)) {
		const player = FakeplayersDB.get(username);
		return callback(player);	
	}

	sender.sendMessage(new RawText([
		{ translate: "sapling.fakeplayer.invalid" }
	]))
}