import { system, packet, BlockPermutation } from "@script-api/server.js";
import { MinecraftBlockTypes } from "@script-api/vanilla-data.js";

packet.on('before::itemUseOn', (event) => {
    const enable = event.source.hasTag('client:flippinCactus');
    if (!enable || event.itemStack.typeId !== 'minecraft:cactus') return;

    event.cancel = flippinCactus(event) > 0;
});


const FacingDirectionsIds = [ 'down', 'up', 'side', 'side', 'side', 'side' ];
const FacingDirectionsDeg = [ 0, 0, 0, 180, 270, 90 ];
const FacingDirectionsDeg2 = [ 0, 0, 0, 90, 180, 270, 0 ];
const FacingDirectionsDeg3 = [ 0, 90, 180, 270 ];
const RedstoneComponents = [
    MinecraftBlockTypes.Piston,
    MinecraftBlockTypes.StickyPiston,
    MinecraftBlockTypes.Observer
];
const BlocksWithInventory = [
    MinecraftBlockTypes.Hopper,
    MinecraftBlockTypes.Dropper,
    MinecraftBlockTypes.Dispenser
]

function flippinCactus({ block, source }) {
    // Data
    const blockId = block.typeId;
    const blockPerm = block.permutation;
    const blockStates = blockPerm.getAllStates();
    const sourceShift = source.isSneaking;


    // Check block type
    const isRedstonePerm = RedstoneComponents.includes(blockId);
    const isFacingDirectionPerm = ('facing_direction' in blockStates);
    const isRepeater = [ MinecraftBlockTypes.UnpoweredRepeater, MinecraftBlockTypes.PoweredRepeater ].includes(blockId);
    const isComparator = [ MinecraftBlockTypes.UnpoweredComparator, MinecraftBlockTypes.PoweredComparator ].includes(blockId);
    const isSlab = blockId.endsWith('slab') && !blockId.endsWith('double_slab');
    const isStair = blockId.endsWith('stairs');
    const isRail = blockId == MinecraftBlockTypes.Rail;
    const isInventoryBlock = BlocksWithInventory.includes(blockId);
    const isHopper = blockId == MinecraftBlockTypes.Hopper;
    const isCrafter = blockId == MinecraftBlockTypes.Crafter;
    

    // Permutations
    if (isFacingDirectionPerm && !isRedstonePerm && !isInventoryBlock) {
        const { facing_direction } = blockStates;
        const newFacingDirection = (facing_direction + 1) > 5 ? 0 : facing_direction + 1;
        const newPerm = BlockPermutation.resolve(blockId, { facing_direction: newFacingDirection });
        setBlockPermutation(block, newPerm);
    } else if (isSlab) {
        const { top_slot_bit } = blockStates;
        const newPerm = BlockPermutation.resolve(blockId, { top_slot_bit: !top_slot_bit });
        setBlockPermutation(block, newPerm);
    } else if (isStair) {
        const { weirdo_direction, upside_down_bit } = blockStates;
        const newWeirdoDirection = (weirdo_direction + 1) > 3 ? 0 : weirdo_direction + 1;
        const newPerm = BlockPermutation.resolve(blockId, { weirdo_direction: newWeirdoDirection, upside_down_bit });
        setBlockPermutation(block, newPerm);
    } else if (isRail) {
        const { rail_direction } = blockStates; 
        const newRailDirection = (rail_direction + 1) > 1 && 5 > (rail_direction + 1) ? 6 : rail_direction + 1; 
        const newPerm = BlockPermutation.resolve(blockId, { rail_direction: newRailDirection });
        setBlockPermutation(block, newPerm);
    } else if (isInventoryBlock) {
        const { facing_direction } = blockStates;
        const FDN = isHopper 
            ? ((facing_direction + 1) > 5 ? 0 : ((facing_direction + 1) == 1 ? 2 : facing_direction + 1))
            : ((facing_direction + 1) > 5 ? 0 : facing_direction + 1)

        const newFacingDirection = FacingDirectionsIds[FDN];
        const newFacingDirectionDeg = FacingDirectionsDeg[FDN];
        const parsedBlockName = blockId.replace('minecraft:', '');

        const blockInventory = block.getComponent('inventory').container;
        let slots = [];

        for (let i=0; i<blockInventory.size; i++) {
            const slot = blockInventory.getItem(i);
            if (!slot) continue;
            
            slots.push({ slot: i, itemStack: slot });
        }


        setStructurePermutation(block, `structure load "${parsedBlockName}:${newFacingDirection}" ~~~ ${newFacingDirectionDeg}_degrees`);

        system.run(() => {
            const newBlock = block.dimension.getBlock(block.location);
            const newInv = newBlock.getComponent('inventory').container;

            slots.forEach((d) => newInv.setItem(d.slot, d.itemStack));
        });
    } else if (isRedstonePerm) {
        const { facing_direction } = blockStates;
        const FDN = (facing_direction + 1) > 5 ? 0 : facing_direction + 1

        const newFacingDirection = FacingDirectionsIds[FDN];
        const newFacingDirectionDeg = blockId == MinecraftBlockTypes.Observer ? FacingDirectionsDeg[FDN] : FacingDirectionsDeg2[FDN];

        const parsedBlockName = blockId.replace('minecraft:', '');
        
        setStructurePermutation(block, `structure load "${parsedBlockName}:${newFacingDirection}" ~~~ ${newFacingDirectionDeg}_degrees`);
    } else if (isRepeater) {
        const { direction, repeater_delay } = blockStates;
        const FDN = direction + 1 > 3 ? 0 : direction + 1;
        const newFacingDirectionDeg = FacingDirectionsDeg3[FDN];
        setStructurePermutation(block, `structure load "repeater:bit${repeater_delay}" ~~~ ${newFacingDirectionDeg}_degrees`);
    } else if (isComparator) {
        const { direction, output_subtract_bit } = blockStates;
        const FDN = direction + 1 > 3 ? 0 : direction + 1;
        const newFacingDirectionDeg = FacingDirectionsDeg3[FDN];
        setStructurePermutation(block, `structure load "comparator:${output_subtract_bit}" ~~~ ${newFacingDirectionDeg}_degrees`);
    }

    return 1;
}

function setBlockPermutation(block, permutation) {
    system.run(() => block.setPermutation(permutation))
}

function setStructurePermutation(block, command) {
    const { x, y, z } = block.location;
    system.run(() => block.dimension.runCommand(`execute positioned ${x} ${y} ${z} run ${command}`));
}