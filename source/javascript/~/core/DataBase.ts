import { Dimension, ScriptEventSource, system, world } from "@minecraft/server";

declare global {
  interface GlobalThis {
    BStorage: Record<string, object>
  }
}

globalThis.BStorage = {};

// Database IPC
system.afterEvents.scriptEventReceive.subscribe((Event) => {
  if (!Event.id.startsWith(DataBaseBuilder.EventID) || Event.sourceType !== ScriptEventSource.Server) return;

  const DatabaseID = Event.message;
  const action = Event.id.replace(DataBaseBuilder.EventID, "");
  
  if (action === "/load") {
    const DBSaved = world.getDynamicProperty(DatabaseID) as string;

    if (DBSaved) globalThis.BStorage[DatabaseID] = JSON.parse(DBSaved);
    else world.setDynamicProperty(DatabaseID, JSON.stringify(globalThis.BStorage[DatabaseID]));

    system.sendScriptEvent(DataBaseBuilder.EventID + "/loaded", DatabaseID);
  }

  else if (action === "/update") {
    const DBSaved = JSON.stringify(globalThis.BStorage[DatabaseID])
    world.setDynamicProperty(DatabaseID, DBSaved); 

    console.log(DatabaseID, "Updated:", DBSaved)
  }
});

type DataBaseValue = string|number|boolean|object


// Database builder
export class DataBaseBuilder {
  size: number;
  loaded: boolean;
  DatabaseID: string;

  public static EventID = "internal:core_database";

  constructor(DatabaseID: string) {
    this.loaded = false;
    this.size = 0;
    this.DatabaseID = DatabaseID;

    globalThis.BStorage[DatabaseID] = globalThis.BStorage[DatabaseID] || {};

    this.__load_database();
  }


  // Database methods
  set(key: string, value: DataBaseValue): DataBaseBuilder {
    this.__database_fallback(() => {
      if (!globalThis.BStorage[this.DatabaseID][key]) this.size++;
      globalThis.BStorage[this.DatabaseID][key] = value;

      this.__send_event("/update");
    });

    return this;
  }

  get(key: string, fallback: DataBaseValue = false): DataBaseValue {
    return globalThis.BStorage[this.DatabaseID][key] || fallback;
  }

  has(key: string): boolean {
    return key in globalThis.BStorage[this.DatabaseID];
  }

  async forEach (callback, forAwait = false): Promise<void> {
    const db = globalThis.BStorage[this.DatabaseID];

		let data = Object.keys(db);
		if (forAwait) {
			for await (let key of data) callback(key, db[key]);
		} else {
			for (let key of data) callback(key, db[key]);
		}
	}

  values (): DataBaseValue[] {
		return Object.values(globalThis.BStorage[this.DatabaseID]);
	}
	
	keys (): string[] {	
		return Object.keys(globalThis.BStorage[this.DatabaseID]);
	}

  remove(key: string): DataBaseBuilder {
    this.__database_fallback(() => {
      delete globalThis.BStorage[this.DatabaseID][key];
      this.__send_event("/update");
    });

    return this;
  }

  // Internal core
  private __send_event(EventID: string) {
    system.run(() => system.sendScriptEvent(`${DataBaseBuilder.EventID}${EventID}`, this.DatabaseID));
  }

  private __load_database() {
    this.__create_register();

    system.run(() => system.sendScriptEvent(`${DataBaseBuilder.EventID}/load`, this.DatabaseID));
  }

  private __create_register() {
    const register = system.afterEvents.scriptEventReceive.subscribe((Event) => {
      if (!Event.id.startsWith(DataBaseBuilder.EventID) || Event.sourceType !== ScriptEventSource.Server) return;

      const DatabaseID = Event.message;
      const action = Event.id.replace(DataBaseBuilder.EventID, "");

      if (action !== "/loaded" || DatabaseID !== this.DatabaseID) return;

      console.log(DatabaseID, "Loaded!");

      this.loaded = true;
      system.afterEvents.scriptEventReceive.unsubscribe(register);
    });
  }

  private __database_fallback(callback: Function) {
    if (this.loaded) return callback();

    system.runTimeout(() => callback(), 2);
  }
}