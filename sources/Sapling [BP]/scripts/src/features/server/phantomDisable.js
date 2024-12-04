export default function phantomDisable({ entity }) {
    if (entity.typeId !== 'minecraft:phantom') return;
    entity.remove();
}

phantomDisable.packet = 'entitySpawn'