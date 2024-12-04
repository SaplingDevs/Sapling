import { CheckSaplingAdmin, JsonDB, module, Utils } from "@script-api/sapling.js";
import { Command } from "@script-api/core.js";
import LANG from "../config/langs";

// Main command
new Command()
    .setName('hss')
    .setValidation(() => (new JsonDB('EngineGamerules')).get('simulatedHss'))
    .addSubcommand('create', (cmd) => {
        cmd.addArgument('number', 'x')
        cmd.addArgument('number', 'y')
        cmd.addArgument('number', 'z')
        cmd.addArgument('string', 'dimension')
        cmd.addArgument('string', 'hssType')
        cmd.setCallback(CreateSubCommand)
    })
    .addSubcommand('remove', (cmd) => {
        cmd.addArgument('string', 'hssId')
        cmd.setCallback(RemoveSubCommand)
    })
    .addSubcommand('list', (cmd) => {
        cmd.addArgument('string', 'hssType')
        cmd.setCallback(ListSubCommand)
    })
    .build();


// HSS Data
const HssTypes = { netherfortress: 'NetherFortress', swamphut: 'SwampHut', pillageroutpost: 'PillagerOutpost', oceanmonument: 'OceanMonument' }
const DimTypes = { nether: 'minecraft:nether', the_end: 'minecraft:the_end', overworld: 'minecraft:overworld' }

module({ HssTypes })


// HSS Subcommands
function CreateSubCommand(sender, { x, y, z, dimension, hssType }) {
    if (!CheckSaplingAdmin(sender)) return LANG('notAdmin', '', sender);

    const HSS = { SwampHut: 'SwampHut', NetherFortress: 'NetherFortress', PillagerOutpost: 'PillagerOutpost', OceanMonument: 'OceanMonument' }
    for (let _ in HSS) {
		HSS[_] = new JsonDB(_);
	}

    const ht = HssTypes[hssType.toLowerCase()];
    const dm = DimTypes[dimension.toLowerCase()];
    
    // Closures
    if ([x,y,z,dm,ht].includes(null)) return Lang('invalidValue', '', sender);

    
    // Option
    const data = [x,y,z,dm].join('/');
    const key = genKey();

    const currentHssKeys = [ 
        ...HSS['SwampHut'].values(), 
        ...HSS['NetherFortress'].values(),
        ...HSS['PillagerOutpost'].values(),
        ...HSS['OceanMonument'].values()
    ];
    
    if (currentHssKeys.includes(data)) Utils.privateMessage(sender, '§eAlready created');
    
    HSS[ht].set(key, data);
    Utils.privateMessage(sender, `§7${ht} hss §a[${key}]§7 created at §h${data.split('/').join(' ')}`);
}

function RemoveSubCommand(sender, { hssId }) {
    if (!CheckSaplingAdmin(sender)) return LANG('notAdmin', '', sender);

    const HSS = { SwampHut: 'SwampHut', NetherFortress: 'NetherFortress', PillagerOutpost: 'PillagerOutpost', OceanMonument: 'OceanMonument' }
    for (let _ in HSS) {
		HSS[_] = new JsonDB(_);
	}

    // Closures
    const isSwampHut = HSS['SwampHut'].has(hssId);
    const isNetherFortress = HSS['NetherFortress'].has(hssId);
    const isPillagerOutpost = HSS['PillagerOutpost'].has(hssId);
    const isOceanMonument = HSS['OceanMonument'].has(hssId);

    const isFound = Object.keys(HSS).some(key => HSS[key].has(hssId));

    if (!isFound) return Utils.privateMessage(sender, `§7hss §e${hssId} §7not found`);
    
    if (isSwampHut) HSS['SwampHut'].remove(hssId);
    else if (isNetherFortress) HSS['NetherFortress'].remove(hssId);
    else if (isPillagerOutpost) HSS['PillagerOutpost'].remove(hssId);
    else if (isOceanMonument) HSS['OceanMonument'].remove(hssId);

    Utils.privateMessage(sender, `§7hss §e${hssId} §7removed successfully`);
}

function ListSubCommand(sender, { hssType }) {
    const HSS = { SwampHut: 'SwampHut', NetherFortress: 'NetherFortress', PillagerOutpost: 'PillagerOutpost', OceanMonument: 'OceanMonument' }
    for (let _ in HSS) {
		HSS[_] = new JsonDB(_);
	}
    
    let txt = '', htl = HssTypes[hssType.toLowerCase()];
			
    if (hssType.toLowerCase() == '--all') {
        for (let x in HSS) {
            for (let h of HSS[x].keys()) {
                txt += `§¶§7  - §e[${h}] §7${HSS[x].get(h).split('/').join(' ')} §s(${x})\n`;
            }
        }

        if (!txt) return LANG('notData', '', sender);
        Utils.privateMessage(sender, '§qFake hss list:\n' + txt.trim());
    } else if (htl) {
        for (let h of HSS[htl].keys()) {
            txt += `§¶§7  - §e[${h}] §7${HSS[htl].get(h).split('/').join(' ')}\n`;
        }
        
        if (!txt) return LANG('notData', '', sender);
        Utils.privateMessage(sender, `§qFake hss list §l§u[${htl}]:§r\n` + txt.trim());
    } 
}


// Function
function genKey() {
	const chars = '123456789abcdefg';
	const r = Array(8)
		.fill('')
		.map(_ => chars[Math.floor(Math.random() * chars.length)])
		.join('');
		
	return r;
}