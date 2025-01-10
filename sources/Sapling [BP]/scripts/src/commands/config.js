import { Command } from "@script-api/core.js";
import { RawText, system } from "@script-api/server.js";

const configBuilder = new Command().setName('config');

const subCommandsData = {
    textureChannel: { func: setTextureChannel, type: 'number', expected: { max: 50, min: 1 }, isClient: true },
    chunkAppearance: { func: setChunkAppearance, type: 'string', expected: [ 'default', 'java' ], isClient: true }
};


// Sub commands
function setTextureChannel(sender, value, feature, { min, max }) {
    if (value < min || value > max) return sender.sendMessage(new RawText([ { text: "§c" }, { translate: "sapling.error.value", with: [ `Expected value in the range [ ${min} - ${max} ]`] } ]))
    
    setNewClientValue(sender, feature, value);
    return sender.sendMessage(new RawText([ { text: "§7" }, { translate: "sapling.base.value", with: [ '§b' + value ] } ]))
}

function setChunkAppearance(sender, value, feature, possibilities) {
    if (!possibilities.includes(value)) return sender.sendMessage(new RawText([ { text: "§c" }, { translate: "sapling.error.value", with: [ `Expected value [ ${possibilities.join(', ')} ]` ] } ]))

    setNewClientValue(sender, feature, value);
    return sender.sendMessage(new RawText([ { text: "§7" }, { translate: "sapling.base.value", with: [ '§b' + value ] } ]))
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