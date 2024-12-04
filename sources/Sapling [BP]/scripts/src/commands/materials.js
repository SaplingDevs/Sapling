import { Command } from "@script-api/core.js";
import { Utils } from "@script-api/sapling.js";
import { system } from "@script-api/server.js";

new Command()
    .setName('materials')
    .addArgument('number', 'x1')
    .addArgument('number', 'y1')
    .addArgument('number', 'z1')
    .addArgument('number', 'x2')
    .addArgument('number', 'y2')
    .addArgument('number', 'z2')
    .setCallback(MaterialsCommand)
    .build();

function MaterialsCommand(sender, args) {
    const data = {};

    const registerBlockData = (block) => {
        if (block.isAir) return

        if (!data[block.typeId]) data[block.typeId] = 1;
        else data[block.typeId]++;
    };

    const onFinish = () => {
        const parsedData = Object.keys(data).map(k => k + ': §a' + data[k] + '§r');
        Utils.privateMessage(sender, '§l§2Material List:§r' + List(parsedData));
    }

    system.runJob(getArea(sender.dimension, args, registerBlockData, onFinish));
}

// Block area generator
function* getArea(dimension, { x1, x2, y1, y2, z1, z2 }, onBlock, onFinish) {
    const [minX, maxX] = [Math.min(x1, x2), Math.max(x1, x2)];
    const [minY, maxY] = [Math.min(y1, y2), Math.max(y1, y2)];
    const [minZ, maxZ] = [Math.min(z1, z2), Math.max(z1, z2)];

    const sizeX = maxX - minX + 1;
    const sizeY = maxY - minY + 1;
    const sizeZ = maxZ - minZ + 1;
    const totalBlocks = sizeX * sizeY * sizeZ;

    for (let i = 0; i < totalBlocks; i++) {
        const x = minX + (i % sizeX);
        const y = minY + Math.floor(i / sizeX) % sizeY;
        const z = minZ + Math.floor(i / (sizeX * sizeY));

        const block = dimension.getBlock({ x, y, z });
        if (block) onBlock(block);

        yield;
    }

    onFinish();
}

// Parse list
function List(list) {
    let txt = '', i = 0;
    list.forEach(prop => {
        txt += `\n${(i&1) ? '      §7-' : '    §7-'} ${prop}`
        i++;
    });

    return txt;
}