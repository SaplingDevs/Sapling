import { Dynamic, CheckSaplingAdmin } from "@script-api/sapling.js";
import { Command } from "@script-api/core.js";
import { default as LANG, lang } from "../config/langs";
import { system } from "@script-api/server.js";

const configBuilder = new Command().setName('config');

const subCommandsData = {
    lang: { func: setLang, type: 'string', expected: Object.keys(lang), isClient: false },
    textureChannel: { func: setTextureChannel, type: 'number', expected: { max: 50, min: 1 }, isClient: true },
    chunkAppearance: { func: setChunkAppearance, type: 'string', expected: [ 'default', 'java' ], isClient: true }
};


// Sub commands
function setLang(sender, value, feature, possibilities) {
    if (!CheckSaplingAdmin(sender)) return LANG('notAdmin');
    else if (!possibilities.includes(value.toUpperCase())) return LANG('error', `Expected value [ ${possibilities.join(', ')} ]`);

    Dynamic.setData(feature, value.toUpperCase());
    return LANG('newValue', '§b' + value.toUpperCase());
}

function setTextureChannel(sender, value, feature, { min, max }) {
    if (value < min || value > max) return LANG('error', `Expected value in the range [ ${min} - ${max} ]`);

    setNewClientValue(sender, feature, value);
    return LANG('newValue', '§b' + value, sender);
}

function setChunkAppearance(sender, value, feature, possibilities) {
    if (!possibilities.includes(value)) return LANG('error', `Expected value [ ${possibilities.join(', ')} ]`);

    setNewClientValue(sender, feature, value);
    return LANG('newValue', '§b' + value, sender);
}

// Utils
function setNewClientValue(sender, feature, value) {
    system.run(() => {
        const tags = sender.getTags();
        tags.forEach(tag => {
            if (tag.startsWith(`config:${feature}:`)) {
                sender.removeTag(tag);
            }
        });
    
        sender.addTag(`config:${feature}:${value}`);
    });
}

// Sub command build
function configSubCommand(name, { func, type, expected, isClient }) {
    configBuilder.addSubcommand(name, (cmd) => {
        cmd.addArgument(type, 'value');
        cmd.setCallback((sender, { value }) => {
            return func(sender, value, name, expected, isClient);
        });
    });
}

Object.entries(subCommandsData).forEach(([ name, data ]) => {
    configSubCommand(name, data);
});

configBuilder.build();

export default subCommandsData;