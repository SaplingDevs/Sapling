import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

export function InformationForm(player: Player, data: { body: string, onReturn: () => void  }) {
  const InfoForm = new ActionFormData();
    InfoForm.title("!generic:info");
    InfoForm.body(data.body);
    InfoForm.button("fp:ignore");

  // @ts-ignore
  InfoForm.show(player).then((res) => {
    if (res.canceled || res.selection !== 0) return;
    data.onReturn();
  });
}