import { Block, Player, RawMessage, world } from "@minecraft/server";
import { BlockStepLocation } from "types";

export class Utils {
  static blockStep(block: Block, location: BlockStepLocation, steps: number= 1): Block {
    const _c = {
      north: 'north',
      south: 'south',
      east: 'east',
      west: 'west',
      down: 'below',
      up: 'above'
    } 
      
    if (!_c[location]) throw new Error('Invalid location');

    const pl = _c[location];

    return block[pl](steps);
  }

  static getBlockFromBase(base: Block, coords: number[]): Block {
    let locB = {
        x: base.location.x + coords[0],
        y: base.location.y + coords[1],
        z: base.location.z + coords[2]
    };
    
    return base.dimension.getBlock(locB);
}

  static RawTextBuilder(entries: RawMessage[]): RawMessage {
    return { rawtext: entries }
  }

  static CheckSaplingAdmin(player: Player): Boolean {
    return player.hasTag("SaplingAdmin");
  }

  static getAllEntities(options) {
    const overworld = world.getDimension('overworld').getEntities(options);
    const nether = world.getDimension('nether').getEntities(options);
    const the_end = world.getDimension('the_end').getEntities(options);
  
    return [ ...overworld, ...nether, ...the_end ];
  }
}

// export default class Utils2 {
    

//     static getBlockFromBase(base, coords) {
//         let locB = {
//             x: base.location.x + coords[0],
//             y: base.location.y + coords[1],
//             z: base.location.z + coords[2]
//         };
        
//         return base.dimension.getBlock(locB);
//     }

//     static getDirection(angle) {
//         if(angle < 0) angle = 360 - Math.abs(angle);
//         if((225 < angle) && (angle <= 315)) return 'east (Towards positive X)';
//         else if((45 <= angle) && (angle < 135)) return 'west (Towards negative X)';
//         else if ((135 < angle) && (angle <= 225)) return 'north (Towards negative Z)';
//         else return 'south (Towards positive Z)';
//     }

//     static getAllEntities(options) {
//         const overworld = world.getDimension('overworld').getEntities(options);
//         const nether = world.getDimension('nether').getEntities(options);
//         const the_end = world.getDimension('the_end').getEntities(options);
      
//         return [ ...overworld, ...nether, ...the_end ];
//     }

//     static privateMessage(sender, txt) {
//         system.run(() => sender.runCommand(`tellraw @s { "rawtext": [ { "text": "${txt}" } ] }`));
//     }
// }