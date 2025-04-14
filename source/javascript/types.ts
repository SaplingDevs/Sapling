export type BlockStepLocation = "north"|"south"|"east"|"west"|"below"|"above"

export type LootType = {
  item: string;
  amount: () => number;
};