import { CheckSaplingAdmin, JsonDB, module } from "@script-api/sapling.js"
import { Command } from "@script-api/core.js"
import HSA from "../engines/hss/data";
import { FakeplayerCmd } from "./fakeplayer";
import { saplingExtensions } from "information.js";

// Command
new Command()
    .setName("help")
    .setCallback(HelpCommand)
    .build();
    
// Data
const HssTypes = Object.keys(HSA.hssList);
const dimension = [ "overworld", "nether", "the_end" ];
const hssData = {
    dimension: `\n      §3Dimension: §b ${dimension.join(', ')}`,
    hssTypes: `\n      §3HssTypes: §b ${HssTypes.join(', ')}`,
}

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
].join('\n') + "\n\n";


function HelpCommand(sender) {
    const isAdmin = CheckSaplingAdmin(sender);
    const ExtensionCommands = [];
    const gamerules = { 
        ...Object.fromEntries(Object.values(module.exports["Client"]).map((g) => [ g, sender.hasTag("client:" + g)])),
        ...(new JsonDB("ServerGamerules").parse()),
        ...(new JsonDB("EngineGamerules").parse())
    }

    saplingExtensions.forEach((extension) => {
        const { config, commands } = extension;
        const cmds = Object.keys(commands).map((c) => commands[c]);

        cmds.forEach((cmd) => {
            const validation = cmd.extensionValidation;
            
            if (validation?.checkAdmin && !isAdmin) return;
            if (validation?.requiredGamerules.length > 0) {
                let checked = 0;
                validation.requiredGamerules.forEach((g) => checked += gamerules[g] ? 1 : 0);
                if (validation.requiredGamerules.length !== checked) return;
            }

            const ExtensionCommand = new HelpCommandBuilder(cmd.name, [], cmd.description, config);
            ExtensionCommands.push(ExtensionCommand);
        });
    });

    const SaplingModules = Object.fromEntries([ 
        [ 0, "Server", "ServerGamerules", isAdmin ],
        [ 1, "Client", "client:" ],
        [ 0, "Engine", "EngineGamerules", isAdmin ],
    ].map(([t, mod, db, shows = true]) => shows ? [ mod, Object.fromEntries(t 
        ? [ ...(Object.values(module.exports[mod]).map(f => [ f, sender.hasTag(db + f) ] )) ] 
        : [ ...(Object.values(module.exports[mod]).map(f => [ f, (new JsonDB(db).get(f)) ] )) ]
    )]: null).filter((o) => o));

    // Commands
    const isHSSEnabled = isAdmin ? SaplingModules["Engine"]["simulatedHss"] : false;
    const isFreecameraEnabled = isAdmin ? SaplingModules["Engine"]["freeCamera"] : false;
    const isRenderEnabled = SaplingModules["Client"]["disableRendering"];

    // Sub commands list
    const hssSubCommands = (!isAdmin ? [ 'list <hssType or --all>' ] : [
        `create <x> <y> <z> <dimension> <hssType>` + hssData.dimension + hssData.hssTypes,
        'remove <hssId>',
        'list <hssType or --all>'
    ]).map((l) => "  §h- " + l);

    const configSubcommands = [
        'textureChannel <number> (1-50)',
        'chunkAppearance <default/java>'
    ].map((l) => "  §h- " + l);

    const ShortCurtsElements = [
        [ "#sc", "#sapling client" ],
        isAdmin ? [ "#ss", "#sapling server" ] : null,
        isAdmin ? [ "#se", "#sapling engine" ] : null,
        isFreecameraEnabled ? [ "#fc", "#freecamera" ] : null,
    ].filter((e) => e).map(([ s, o ]) => `  §7- ${s} -> ${o}`);

    const ShortCurts = [ "§3Sapling Shortcurts: ", ...ShortCurtsElements ].join("\n");

    const HelpCommands = [ DandelionLogo, ...HelpBuilder([
        new HelpCommandBuilder("help"),
        new HelpCommandBuilder("sapling", new SectionBuilder(SaplingModules), "<section> <feature> <boolean>"),
        new HelpCommandBuilder("prof"),
        new HelpCommandBuilder("calc", [], "<expression>"),
        new HelpCommandBuilder("materials", [], "<x1> <y1> <z1> <x2> <y2> <z2>"),
        new HelpCommandBuilder("slimechunks"),
        new HelpCommandBuilder("config", configSubcommands, "<subcommand> <value>"),
        isHSSEnabled ? new HelpCommandBuilder("hss", hssSubCommands, "<subcommand> <args>") : null,
        isAdmin ? new HelpCommandBuilder("gm", [], "<d/s/c/g>") : null,
        isRenderEnabled ? new HelpCommandBuilder("render") : null,
        isFreecameraEnabled ? new HelpCommandBuilder("freecamera") : null,
        new HelpCommandBuilder("fakeplayer", FakeplayerCmd(undefined, true).split('\n').slice(1), "<username> <action> <args?>"),
        ...ExtensionCommands
    ], sender), ShortCurts];
    
    HelpCommands.forEach((l) => sender.sendMessage(l));
}

function HelpBuilder(Commands) {
    const lines = [];

    Commands.filter((o) => o).forEach(({ name, usage, content, description }) => {
        const CommandText = new RawText([
            { text: ("§7" + (Command.prefix + name + " " + usage).trim() + "§9 > §j" ) },
            { translate: description },
            { text: "\n" },
            ...content.flatMap((c) => 
                typeof c === "string" 
                    ? [ { text: c }, { text: "\n" } ] 
                    : [ ...c.rawtext, { text: "\n" } ]
            )
        ]);

        lines.push(CommandText, '\n');
    });

    return lines;
}

class RawText { constructor(data) { return { "rawtext": data } }}

class HelpCommandBuilder {
    constructor(name, content = [], usage = "", config = false) {
        this.name = name;
        this.usage = usage;
        this.content = content;

        if (config && !config.automaticTranslations && !config.descriptionKeys[`sapling.help.command.${name}`]) {
            this.description = "";
        } else if (config && !config.automaticTranslations && config.descriptionKeys[`sapling.help.command.${name}`]) {
            this.description = config.descriptionKeys[`sapling.help.command.${name}`];
        } else if (!config || config.automaticTranslations) {
            this.description = `sapling.help.command.${name}`;
        }
    }
}

export class SectionBuilder {
    constructor(object) {
        const Sections = Object.keys(object)
            .map((section) => [ ("  §3" + section + ":"),  
                ...Object.keys(object[section])
                .map((f) => new RawText([
                    { text: ("    §7- " + ("[" + (object[section][f] ? "§2+" : "§4-") + "§7]") + " " + f + "§u > §j") },
                    SectionBuilder.checkExtension(f) 
                        ? { text: SectionBuilder.getDescription(f) }
                        : { translate: ("sapling.help.feature." + f) }
                ]))
            ]).flat();
        
        return Sections;
    }

    static checkExtension(f) {
        let isFromExtension = false;
        saplingExtensions.forEach((extension) => isFromExtension = (f in extension.gamerules));

        return isFromExtension;
    }

    static getDescription(f) {
        const { config } = SectionBuilder.getExtension(f);

        if (config && !config.automaticTranslations && !config.descriptionKeys[`sapling.help.feature.${f}`]) {
            return "";
        } else if (config && !config.automaticTranslations && config.descriptionKeys[`sapling.help.feature.${f}`]) {
            return config.descriptionKeys[`sapling.help.feature.${f}`];
        } else if (!config || config.automaticTranslations) {
            return `sapling.help.feature.${f}`;
        }
    }

    static getExtension(f) {
        let ext = {};
        saplingExtensions.forEach((extension) => ext = (f in extension.gamerules)? extension : null);

        return ext;
    }
}