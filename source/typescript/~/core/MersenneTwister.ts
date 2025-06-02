export default class MersenneTwister {
	private _mt: number[] = new Array(624);
	private _index: number = 624;

	constructor(seed?: number | number[]) {
		if (seed === undefined) seed = Date.now();
		this.setSeed(seed);
	}

	private static _mulUint32(a: number, b: number): number {
		const a1 = a >>> 16, a2 = a & 0xffff;
		const b1 = b >>> 16, b2 = b & 0xffff;
		return (((a1 * b2 + a2 * b1) << 16) + a2 * b2) >>> 0;
	}

	private static _toNumber(x: unknown): number {
		return typeof x === "number" && !isNaN(x) ? Math.ceil(x) : 0;
	}

	public setSeed(seed: number | number[]): void {
		const mt = this._mt;
		if (typeof seed === "number") {
			mt[0] = seed >>> 0;
			for (let i = 1; i < mt.length; i++) {
				const x = mt[i - 1] ^ (mt[i - 1] >>> 30);
				mt[i] = MersenneTwister._mulUint32(1812433253, x) + i;
			}
			this._index = mt.length;
		} else if (Array.isArray(seed)) {
			let i = 1, j = 0;
			this.setSeed(19650218);
			for (let k = Math.max(mt.length, seed.length); k > 0; k--) {
				const x = mt[i - 1] ^ (mt[i - 1] >>> 30);
				mt[i] = (mt[i] ^ MersenneTwister._mulUint32(x, 1664525)) + (seed[j] >>> 0) + j;
				i = (i + 1) % mt.length;
				if (i === 0) mt[0] = mt[mt.length - 1];
				j = (j + 1) % seed.length;
			}
			for (let k = mt.length - 1; k > 0; k--) {
				const x = mt[i - 1] ^ (mt[i - 1] >>> 30);
				mt[i] = (mt[i] ^ MersenneTwister._mulUint32(x, 1566083941)) - i;
				i = (i + 1) % mt.length;
				if (i === 0) mt[0] = mt[mt.length - 1];
			}
			mt[0] = 0x80000000;
		} else {
			throw new TypeError("MersenneTwister: illegal seed.");
		}
	}

	private _nextInt(): number {
		const mt = this._mt;
		let value: number;

		if (this._index >= mt.length) {
			const N = mt.length;
			const M = 397;

			for (let k = 0; k < N - M; k++) {
				value = (mt[k] & 0x80000000) | (mt[k + 1] & 0x7fffffff);
				mt[k] = mt[k + M] ^ (value >>> 1) ^ ((value & 1) ? 0x9908b0df : 0);
			}
			for (let k = N - M; k < N - 1; k++) {
				value = (mt[k] & 0x80000000) | (mt[k + 1] & 0x7fffffff);
				mt[k] = mt[k + M - N] ^ (value >>> 1) ^ ((value & 1) ? 0x9908b0df : 0);
			}
			value = (mt[N - 1] & 0x80000000) | (mt[0] & 0x7fffffff);
			mt[N - 1] = mt[M - 1] ^ (value >>> 1) ^ ((value & 1) ? 0x9908b0df : 0);

			this._index = 0;
		}

		value = mt[this._index++];
		value ^= value >>> 11;
		value ^= (value << 7) & 0x9d2c5680;
		value ^= (value << 15) & 0xefc60000;
		value ^= value >>> 18;

		return value >>> 0;
	}

	public nextInt(): number;
	public nextInt(max: number): number;
	public nextInt(min: number, max: number): number;
	public nextInt(...args: number[]): number {
		let min = 0, sup = 0x100000000;

		if (args.length === 1) {
			sup = MersenneTwister._toNumber(args[0]);
		} else if (args.length >= 2) {
			min = MersenneTwister._toNumber(args[0]);
			sup = MersenneTwister._toNumber(args[1]) - min;
		}

		if (!(0 < sup && sup < 0x100000000))
			return this._nextInt() + min;

		if ((sup & (~sup + 1)) === sup)
			return ((sup - 1) & this._nextInt()) + min;

		let value: number;
		do {
			value = this._nextInt();
		} while (sup > 0x100000000 - (value - (value %= sup)));

		return value + min;
	}

	public next(): number {
		const a = this._nextInt() >>> 5;
		const b = this._nextInt() >>> 6;
		return (a * 0x4000000 + b) / 0x20000000000000;
	}
}