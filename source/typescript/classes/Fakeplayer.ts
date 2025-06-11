import type { Dimension, Vector3 } from "@minecraft/server";

export default class Fakeplayer {
  public name: string;
  public location: Vector3;
  public dimension: Dimension;
  
  constructor(name: string, location: Vector3, dimension: Dimension) {
    this.name = name;
    this.location = location;
    this.dimension = dimension;
  }
}