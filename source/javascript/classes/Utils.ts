import { RawMessage } from "@minecraft/server";

export class Utils {
  static RawTextBuilder(entries: RawMessage[]) {
    return { rawtext: entries }
  }
}