import { ScriptEventCommandMessageAfterEvent } from "@minecraft/server";

export default class Protocol {
    static protocols = new Map();

    constructor(id, callback = ScriptEventCommandMessageAfterEvent) {
        this.id = id;
        this.callback = callback;

        if (Protocol.protocols.has(id)) {
            throw new Error(`Protocol ${id} already exists`);
        }

        Protocol.protocols.set(id, callback);
    }

    static getProtocol(id) {
        return Protocol.protocols.get(id);
    }
}