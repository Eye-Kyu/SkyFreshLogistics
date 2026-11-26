// Stand-in photographs from Wikimedia Commons, picked by the Hallmark photo
// library. Each sits in a `data-slot` the owner's own photography replaces:
// swap `file`, `w` and `h` (or point `src` at a file in /public) and the
// layout holds. Every photo shown is credited in the footer.

export interface Photo {
  id: string;
  /** Commons original, e.g. https://upload.wikimedia.org/wikipedia/commons/c/c4/Name.jpg */
  file: string;
  w: number;
  h: number;
  /** What the owner's own picture in this slot should show. */
  slotAlt: string;
  alt: string;
  position?: string;
  credit: { author: string; license: string; page: string };
}

function commonsSrc(file: string, width: number): string {
  const m = file.match(/^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/(\w)\/(\w\w)\/(.+)$/);
  if (!m) return file;
  const [, a, ab, name] = m;
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${a}/${ab}/${name}/${width}px-${name}`;
}

export function photoSrcSet(p: Photo): { src: string; srcSet: string } {
  const widths = [960, 1280, 1920].filter((w) => w < p.w);
  return {
    src: commonsSrc(p.file, 1280),
    srcSet: widths.map((w) => `${commonsSrc(p.file, w)} ${w}w`).join(", "),
  };
}

export const photos = {
  produce: {
    id: "Dülmen, Kirchspiel, Erdbeerfeld -- 2015 -- 6522.jpg",
    file: "https://upload.wikimedia.org/wikipedia/commons/c/c4/D%C3%BClmen%2C_Kirchspiel%2C_Erdbeerfeld_--_2015_--_6522.jpg",
    w: 3300,
    h: 4698,
    slotAlt: "Bravair produce graded and crated for export at a partner farm",
    alt: "Wooden crates of freshly picked strawberries stacked in a field",
    position: "50% 55%",
    credit: {
      author: "Dietmar Rabich",
      license: "CC BY-SA 4.0",
      page: "https://commons.wikimedia.org/wiki/File:D%C3%BClmen,_Kirchspiel,_Erdbeerfeld_--_2015_--_6522.jpg",
    },
  },
  flowers: {
    id: "Rosa canina focus stacked-20220522-RM-123334.jpg",
    file: "https://upload.wikimedia.org/wikipedia/commons/5/58/Rosa_canina_focus_stacked-20220522-RM-123334.jpg",
    w: 5182,
    h: 3886,
    slotAlt: "Export roses from a Naivasha grower, graded and sleeved",
    alt: "A single pink rose with gold stamens against dark green leaves",
    position: "50% 45%",
    credit: {
      author: "Ermell",
      license: "CC BY-SA 4.0",
      page: "https://commons.wikimedia.org/wiki/File:Rosa_canina_focus_stacked-20220522-RM-123334.jpg",
    },
  },
  farmland: {
    id: "Cameron Bharat Tea Plantation, Cameron Highlands, Malaysia, 20250829 1535 4120.jpg",
    file: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Cameron_Bharat_Tea_Plantation%2C_Cameron_Highlands%2C_Malaysia%2C_20250829_1535_4120.jpg",
    w: 5439,
    h: 3631,
    slotAlt: "A partner growing region in Kenya, wide view of the farms",
    alt: "Terraced green hills of a highland plantation under cloud",
    position: "50% 50%",
    credit: {
      author: "Jakub Hałun",
      license: "CC BY 4.0",
      page: "https://commons.wikimedia.org/wiki/File:Cameron_Bharat_Tea_Plantation,_Cameron_Highlands,_Malaysia,_20250829_1535_4120.jpg",
    },
  },
} satisfies Record<string, Photo>;

export const photoCredits = Object.values(photos).map((p) => p.credit);
