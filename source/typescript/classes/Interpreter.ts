type Dimension = "overworld" | "nether" | "the_end";

interface ParsedEntry {
  username: string;
  location: [number, number, number];
  dimension: Dimension;
  flags: string[];
}

export class Interpreter {
  static playersList(input: string): ParsedEntry[] {
    const lines = input.split(";").map(l => l.trim()).filter(Boolean);
    const validDimensions: Set<Dimension> = new Set(["overworld", "nether", "the_end"]);

    const results: ParsedEntry[] = [];

    for (const line of lines) {
      const parts = line.split(",").map(p => p.trim());

      if (parts.length < 3 || parts.length > 4) {
        console.warn(`Línea inválida: debe tener 3 o 4 partes separadas por coma: "${line}"`);
        continue;
      }

      const [username, locationStr, dimensionStr, flagsStr] = parts;

      // Location validation
      const locParts = locationStr.trim().split(" ");
      if (locParts.length !== 3 || !locParts.every(n => /^-?\d+$/.test(n))) {
        console.warn(`Location inválida (debe ser 3 números separados por espacio): "${locationStr}"`);
        continue;
      }
      const location: [number, number, number] = [Number(locParts[0]), Number(locParts[1]), Number(locParts[2])];

      // Dimension validation
      if (!validDimensions.has(dimensionStr as Dimension)) {
        console.warn(`Dimensión inválida: "${dimensionStr}"`);
        continue;
      }
      const dimension = dimensionStr as Dimension;

      // Flags validation
      let flags: string[] = [];
      if (flagsStr) {
        flags = flagsStr.split(" ").filter(f => f.startsWith("--"));
        if (flags.length === 0) {
          console.warn(`Flags inválidas o no empiezan con '--': "${flagsStr}"`);
          continue;
        }
      }

      results.push({ username, location, dimension, flags });
    }

    return results;
  }
}
