import { world, system, EntityTypes } from "@minecraft/server";
import type { Entity, Player } from "@minecraft/server";

let EntitiesIDs: string[] = [], RenderTags: string[] = [];

system.run(() => {
  const allTypes = EntityTypes.getAll();
  EntitiesIDs = allTypes.map(et => et.id);
  RenderTags = allTypes.map(et => `disableRender/${et.id}`);
});

system.runInterval(() => {
  const players = world.getPlayers().filter((p) => p.isValid);
  let disabledEntities: Record<string, Entity> = {};
  
  for (const player of players) {
    Object.assign(disabledEntities, getEntitiesFromPlayer(player));
  }

  system.runJob(setRender(disabledEntities, players));
}, 14);

function getEntitiesFromPlayer(player: Player): Record<string, Entity> {
  const disabledEntitiesIds = player.getTags()
    .filter((t) => RenderTags.includes(t))
    .map((t) => t.replace("disableRender/", ""));

  const disabledEntities = [ ...EntitiesIDs ]
    .filter((id) => !disabledEntitiesIds.includes(id));
  
  const playerEntities = player.dimension.getEntities({ 
    maxDistance: 120, 
    location: player.location,
    excludeTypes: disabledEntities
  }).map((i) => [ i.id, i ]);

  return Object.fromEntries(playerEntities);
}

function* setRender(entities: Record<string, Entity>, players: Player[]) {
  const animationPlayers: Map<string, string[]> = new Map();

  for (const k in entities) {
    const entity = entities[k];
    const id = entity.typeId;

    if (!animationPlayers.has(id)) {
      const entityPlayers = players.filter((p) => p.hasTag(`disableRender/${id}`)).map((p) => p.name);
      animationPlayers.set(id, entityPlayers);
    }

    const entityPlayers = animationPlayers.get(id);
    entity.playAnimation("animation.sapling.render", { players: (entityPlayers as unknown as Player[]) });

    yield;
  }
}