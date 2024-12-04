import { JsonDB } from "@script-api/sapling.js"

// DB Method
export function CreateDB(Gamerules, DataBaseName, IsDB = true) {
	if (IsDB) {
		const DB = new JsonDB(DataBaseName);
		const { booleans = [], numerics = [], strings = [] } = Gamerules;
		Gamerules = { booleans, numerics, strings }
		
		const Struct = {};
		const DefaultValues = { booleans: false, numerics: 0, strings: '' }
		
		for (const t in Gamerules) {
			const ta = Gamerules[t];
			ta.forEach(k => {
				if (typeof k === 'string') {
					Struct[k.toLowerCase()] = k;
					if (DB.get(k)) return;
					
					DB.set(k, DefaultValues[t]);
				} else if (Array.isArray(k)) {
					const [ name, value ] = k;
					Struct[name.toLowerCase()] = name;
					
					if (!DB.get(name)) return DB.set(name, value);
					if (DB.get(name) != value) return;
						
					DB.set(name, value);
				}
			});
		}
		
		return Struct;
	} else {
		const Struct = {};
		
		for (const k of Gamerules.booleans) {
			Struct[k.toLowerCase()] = k;
		}
		
		return Struct;
	}
}