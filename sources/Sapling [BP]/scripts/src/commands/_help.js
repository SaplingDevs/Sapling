import { CheckSaplingAdmin, JsonDB, module, Utils } from "@script-api/sapling.js";
import { world } from "@script-api/server.js";
import { Command } from "@script-api/core.js";
import configData from "./config.js"
import { FakeplayerCmd } from "./fakeplayer.js";

new Command()
    .setName('help')
    .setCallback(Help)
    .build();
        
const DandelionLogo = [
    "    §e[][]",
    "  §e[]§g[]§p[]§e[]",
    "§e[]§p[]§e[]§n[]§g[]§e[]",
    "  §e[]§n[]§g[]§e[]",
    "    §2[][]          §l§3Sapling §uGuide§r",
    "§2[]§q[]§a[]§q[]",
    "  §2[]§a[]§q[][]§2[]",
    "    §a[]§2[][]",
    "    §q[]§2[]",
].join('\n');
    

function Help(sender) {
    const isAdmin = CheckSaplingAdmin(sender);

    const SERVER_DB = new JsonDB('ServerGamerules');
    const ENGINE_DB = new JsonDB('EngineGamerules');
    const filteredTags = sender.getTags()
        .filter((t) => t.startsWith('cr:'))
        .map((t) => t.replace('cr:', ''));

    const renderText = filteredTags.length > 0 ? `\n    §6Disabled: §7${filteredTags.join(', ')}` : ''

    const SERVER = Object.values(module.exports['Server'])
        .map(_ => `${_} ${SERVER_DB.get(_) ? '§2true§r' : '§4false§r'}`);

    const ENGINE = Object.values(module.exports['Engine'])
        .map(_ => `${_} ${ENGINE_DB.get(_) ? '§2true§r' : '§4false§r'}`);

    const CLIENT = Object.values(module.exports['Client'])
        .map(_ => `${_} ${sender.hasTag('client:' + _) ? '§2true§r' : '§4false§r'}`);

    const CONFIG = Object.keys(configData)
        .map(_ => {
            let txt = `${_}`;
            const data = configData[_];
            if (data.type == 'number') txt += ` <${data.type}: [ §b${data.expected.min} - ${data.expected.max}§7 ]>`
            else if (data.type == 'string') txt += ` <${data.type}: [ §b${data.expected.join(', ')}§7 ]>`
            else txt += ` <${data.type}>`

            return (!isAdmin && !data.isClient) ? null : txt;
        }).filter(_ => _ !== null);

    const HssTypes = Object.values(module.exports['HssTypes']);
    const dimension = Object.keys(world.dimension).filter(_ => !_.startsWith('minecraft'));
    const hssData = {
        dimension: `\n        §3Dimension: §b ${dimension.join(', ')}`,
        hssTypes: `\n        §3HssTypes: §b ${HssTypes.join(', ')}`,
    }
    const HSS = !isAdmin ? [ 'list <hssType or --all>' ] : [
        `create <x> <y> <z> <dimension> <hssType>` + hssData.dimension + hssData.hssTypes,
        'remove <hssId>',
        'list <hssType or --all>'
    ]

    const CMDS = {
        HELP: './help',
        SAPLING: [ 
            `./sapling ${!isAdmin ? '<client>' : '<section>'} <feature> <boolean>`,
            !isAdmin 
                // Not admin
                ? '\n  §2Client:§r' + ParseList(CLIENT)
                // Admin
                : '\n  §2Server:§r' + ParseList(SERVER)
                + '\n  §2Client:§r' + ParseList(CLIENT)
                + '\n  §2Engine:§r' + ParseList(ENGINE)
        ],
        CONFIG: [
            `./config <subcommand> <value>`,
            List(CONFIG)
        ],
        PROF: './prof',
        CALC: './calc <expression>',
        MATERIALS: './materials <x1> <y1> <z1> <x2> <y2> <z2>',
        HSS: ENGINE_DB.get('simulatedHss') ? [
            `./hss <subcommand> <args>`,
            List(HSS)
        ] : null,
        SLIMECHUNKS: './slimechunks',
        FAKEPLAYER: './fakeplayer --help\n' + undefined,
        GM: isAdmin ? './gm <d/s/c/g>' : null,
        FC: ENGINE_DB.get('freeCamera') ? './freecamera': null,
        RENDER: sender.hasTag('client:disableRendering') ? `./render <entityId>${renderText}`: null,
        // Shortcurts
        SHORTCURTS: '§3§lCommand Shortcurts:§r' + List([
            'sc: sapling -> client',
            isAdmin ? 'ss: sapling -> server' : null,
            isAdmin ? 'se: sapling -> engine' : null,
            ENGINE_DB.get('freeCamera') ? 'fc: freecamera' : null,
        ])
    }

    let helpText = `${DandelionLogo}§r\n`;
    for (const cmd in CMDS) {
        const data = CMDS[cmd];
        if (!data) continue;

        helpText += `\n§7${!Array.isArray(data) ? data : data[0] + data[1]}\n`;
    }

    Utils.privateMessage(sender, helpText + '\n');
}

function ParseList(list) {
    let txt = '', i = 0;
    list.forEach(prop => {
        txt += `\n${(i&1) ? '      §7-' : '    §7-'} ${prop}`
        i++;
    });

    return txt;
}

function List(list) {
    let txt = '';
    list.forEach(prop => {
        if (!prop) return;
        txt += `\n    §7- ${prop}`
    });

    return txt;
}