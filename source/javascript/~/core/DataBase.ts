import { Dimension, ScriptEventSource, system, world } from "@minecraft/server";

declare global {
  interface GlobalThis {
    BStorage: Record<string, object>
  }
}

globalThis.BStorage = {};

// Database IPC
system.afterEvents.scriptEventReceive.subscribe((Event) => {
  if (!Event.id.startsWith(DataBase.EventID) || Event.sourceType !== ScriptEventSource.Server) return;

  const DatabaseID = Event.message;
  const action = Event.id.replace(DataBase.EventID, "");
  
  if (action === "/load") {
    const DBSaved = world.getDynamicProperty(DatabaseID) as string;

    if (DBSaved) globalThis.BStorage[DatabaseID] = JSON.parse(DBSaved);
    else world.setDynamicProperty(DatabaseID, JSON.stringify(globalThis.BStorage[DatabaseID]));

    system.sendScriptEvent(DataBase.EventID + "/loaded", DatabaseID);
  }

  else if (action === "/update") {
    const DBSaved = JSON.stringify(globalThis.BStorage[DatabaseID])
    world.setDynamicProperty(DatabaseID, DBSaved); 

    console.log(DatabaseID, "Updated:", DBSaved)
  }
});

type DataBaseValue = string|number|boolean|object


// Database builder
export class DataBase {
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
  set(key: string, value: DataBaseValue){
    this.__database_fallback(() => {
      if (!globalThis.BStorage[this.DatabaseID][key]) this.size++;
      globalThis.BStorage[this.DatabaseID][key] = value;

      console.log(key, value, globalThis.BStorage[this.DatabaseID][key])
      this.__send_event("/update");
    });

    return this;
  }

  get(key: string, fallback: DataBaseValue = false) {
    return globalThis.BStorage[this.DatabaseID][key] || fallback;
  }

  has(key: string) {
    return key in globalThis.BStorage[this.DatabaseID];
  }

  remove(key: string) {
    this.__database_fallback(() => {
      delete globalThis.BStorage[this.DatabaseID][key];
      this.__send_event("/update");
    });

    return this;
  }

  // Internal core
  private __send_event(EventID: string) {
    system.run(() => system.sendScriptEvent(`${DataBase.EventID}${EventID}`, this.DatabaseID));
  }

  private __load_database() {
    this.__create_register();

    system.run(() => system.sendScriptEvent(`${DataBase.EventID}/load`, this.DatabaseID));
  }

  private __create_register() {
    const register = system.afterEvents.scriptEventReceive.subscribe((Event) => {
      if (!Event.id.startsWith(DataBase.EventID) || Event.sourceType !== ScriptEventSource.Server) return;

      const DatabaseID = Event.message;
      const action = Event.id.replace(DataBase.EventID, "");

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