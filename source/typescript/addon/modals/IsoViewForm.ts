import { Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { Vec3 } from "types";

export function IsoViewForm(player: Player, Pos1: Vec3, Pos2: Vec3) {
  const IsoForm = new ModalFormData();
    IsoForm.title("!sa:isoview");
    // Pos1
    IsoForm.textField("x1", "", { defaultValue: String(Pos1.x.toFixed(0)) });
    IsoForm.textField("y1", "", { defaultValue: String(Pos1.y.toFixed(0)) });
    IsoForm.textField("z1", "", { defaultValue: String(Pos1.z.toFixed(0)) });
    // Pos2
    IsoForm.textField("x2", "", { defaultValue: String(Pos2.x.toFixed(0)) });
    IsoForm.textField("y2", "", { defaultValue: String(Pos2.y.toFixed(0)) });
    IsoForm.textField("z2", "", { defaultValue: String(Pos2.z.toFixed(0)) });

  // @ts-ignore
  IsoForm.show(player);
} 