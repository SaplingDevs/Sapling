import * as mc from '@minecraft/server'
import MT from './MersenneTwister'

export default class Chunk {
	private baseX: number;
	private baseZ: number;
	public minX: number;
	public minZ: number;
	public maxX: number;
	public maxZ: number;
	public worldX: number;
	public worldZ: number;
	public center: { x: number; z: number };

	private static slimeData: Record<string, boolean> = {};

	constructor(x: number, z: number) {
		this.baseX = x;
		this.baseZ = z;
		this.minX = Math.floor(x / 16) * 16;
		this.minZ = Math.floor(z / 16) * 16;
		this.maxX = this.minX + 15;
		this.maxZ = this.minZ + 15;
		this.worldX = Math.floor(this.minX / 16);
		this.worldZ = Math.floor(this.minZ / 16);
		this.center = { x: this.minX + 7.5, z: this.minZ + 7.5 };
	}

	isSlime(): boolean {
		const key = `${this.worldX}/${this.worldZ}`;
		if (Chunk.slimeData[key] !== undefined) {
			return Chunk.slimeData[key];
		}

		const chunkX = Math.floor(this.baseX / 16) >>> 0;
		const chunkZ = Math.floor(this.baseZ / 16) >>> 0;

		const seed = ((a: number, b: number): number => {
			let a00 = a & 0xffff;
			let a16 = a >>> 16;
			let b00 = b & 0xffff;
			let b16 = b >>> 16;
			let c00 = a00 * b00;
			let c16 = c00 >>> 16;

			c16 += a16 * b00;
			c16 &= 0xffff;
			c16 += a00 * b16;

			let lo = c00 & 0xffff;
			let hi = c16 & 0xffff;

			return ((hi << 16) | lo) >>> 0;
		})(chunkX, 0x1f1f1f1f) ^ chunkZ;

		const mt = new MT(seed);
		const n = mt.nextInt();
		const isSlime = n % 10 === 0;

		Chunk.slimeData[key] = isSlime;
		return isSlime;
	}
}
