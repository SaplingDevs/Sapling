import { CheckSaplingAdmin, JsonDB, module } from "@script-api/sapling.js"
import { Command } from "@script-api/core.js"
import HSA from "../engines/hss/data";
import { FakeplayerCmd } from "./fakeplayer";
import configData from "./config";

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

function HelpCommand(sender) {
    const isAdmin = CheckSaplingAdmin(sender);

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

    const HelpCommands = HelpBuilder([
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
    ], sender);
    
    HelpCommands.forEach((l) => sender.sendMessage(l));
    console.warn(JSON.stringify(HelpCommands));
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
    constructor(name, content = [], usage = "") {
        this.name = name;
        this.usage = usage;
        this.content = content;
        this.description = `sapling.help.command.${name}`;
    }
}

class SectionBuilder {
    constructor(object) {
        const Sections = Object.keys(object)
            .map((section) => [ ("  §3" + section + ":"),  
                ...Object.keys(object[section])
                .map((f) => new RawText([
                    { text: ("    §7- " + ("[" + (object[section][f] ? "§2+" : "§4-") + "§7]") + " " + f + "§u > §j") },
                    { translate: ("sapling.help.feature." + f) }
                ]))
            ]).flat();
        
        return Sections;
    }
}