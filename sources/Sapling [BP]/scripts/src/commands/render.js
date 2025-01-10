import { CollisionBoxes } from "@script-api/vanilla-data.js";
import { Command } from "@script-api/core.js";
import { system } from "@script-api/server.js";

new Command()
    .setName('render')
    .setValidation((sender) => sender.hasTag('client:disableRendering'))
    .addArgument('string', '_type')
    .setCallback(RenderCallback)
    .build();

const invalidValues = [ 
    'item', 'boat', 'chest_boat', '_minecart', 
    'tnt_minecart', 'chest_minecart', 'hopper_minecart', 
    'command_block_minecart', 'tnt',
]

function RenderCallback(sender, { _type }) {
    system.run(() => {
        const type = _type.replace('minecraft:', '');
        const mctype = `minecraft:${type}`;

        if (invalidValues.includes(type) || !(mctype in CollisionBoxes)) return sender.sendMessage(new RawText([
            { translate: "sapling.error.value", with: [ type ] }
        ]))

        const tag = `cr:${type}`;
        const msg = `render:${type}`;
        const enabled = sender.hasTag(tag);

        if (enabled) sender.removeTag(tag)
        else sender.addTag(tag);
    
        sender.sendMessage(new RawText([
            { translate: `sapling.base.${enabled ? 'disabled' : 'enabled'}`, with: [ msg ] }
        ]))
    });
}