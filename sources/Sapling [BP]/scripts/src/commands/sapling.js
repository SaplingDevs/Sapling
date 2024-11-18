import { CheckSaplingAdmin, JsonDB, module } from "@script-api/sapling.js";
import { system } from "@script-api/server.js";
import { Command } from "@script-api/core.js";
import LANG from "../config/langs.js";

new Command()
    .setName('sapling')
    .setCallback()
    .addSubcommand('client', (cmd) => {
        cmd.addArgument('string', 'feature_name');
        cmd.addArgument('boolean', 'feature_value');
        cmd.setCallback(ClientSubcommand)
    })
    .addSubcommand('server', (cmd) => {
        cmd.addArgument('string', 'feature_name');
        cmd.addArgument('boolean', 'feature_value');
        cmd.setCallback(ServerSubcommand)
    })
    .addSubcommand('engine', (cmd) => {
        cmd.addArgument('string', 'feature_name');
        cmd.addArgument('boolean', 'feature_value');
        cmd.setCallback(EngineSubcommand)
    })
    .build();

new Command()
    .setName('sc')
    .addArgument('string', 'feature_name')
    .addArgument('boolean', 'feature_value')
    .setCallback(ClientSubcommand)
    .build();

new Command()
    .setName('ss')
    .setValidation((sender) => CheckSaplingAdmin(sender))
    .addArgument('string', 'feature_name')
    .addArgument('boolean', 'feature_value')
    .setCallback(ServerSubcommand)
    .build();

new Command()
    .setName('se')
    .setValidation((sender) => CheckSaplingAdmin(sender))
    .addArgument('string', 'feature_name')
    .addArgument('boolean', 'feature_value')
    .setCallback(EngineSubcommand)
    .build();

// Subcommands
function ClientSubcommand(sender, { feature_name, feature_value }) {
    const FeatureName = feature_name.toLowerCase();
    const ModuleFeatures = module.exports['Client'];
    const Feature = ModuleFeatures[FeatureName];

    if (!Feature) return LANG('invalidFeature');

    system.run(() => {
        sender[feature_value ? 'addTag' : 'removeTag']('client:' + Feature);
    });

    LANG(feature_value ? 'enabled' : 'disabled', Feature, sender);
}

function ServerSubcommand(sender, { feature_name, feature_value }) {
    const FeatureName = feature_name.toLowerCase();
    const ModuleFeatures = module.exports['Server'];
    const Feature = ModuleFeatures[FeatureName];
    const isAdmin = CheckSaplingAdmin(sender);

    if (!isAdmin) return LANG('notAdmin');
    else if (!Feature) return LANG('invalidFeature');

    const DB = new JsonDB('ServerGamerules');
    DB.set(Feature, feature_value);
    
    LANG(feature_value ? 'enabled' : 'disabled', Feature);
}

function EngineSubcommand(sender, { feature_name, feature_value }) {
    const FeatureName = feature_name.toLowerCase();
    const ModuleFeatures = module.exports['Engine'];
    const Feature = ModuleFeatures[FeatureName];
    const isAdmin = CheckSaplingAdmin(sender);

    if (!isAdmin) return LANG('notAdmin');
    else if (!Feature) return LANG('invalidFeature');

    const DB = new JsonDB('EngineGamerules');
    DB.set(Feature, feature_value);
    
    LANG(feature_value ? 'enabled' : 'disabled', Feature);
}