export interface Party {
    name: string;
    shortName: string;
    id: string;
    color: string;
    order: number;
};

const VANSTERPARTIET: Party = {
    name: "Vänsterpartiet",
    shortName: "V",
    id: "0005",
    color: "#DA291C",
    order: 0,
};

const SOCIALDEMOKRATERNA: Party = {
    name: "Socialdemokraterna",
    shortName: "S",
    id: "0002",
    color: "#E8112D",
    order: 1,
};

const MIJOPARTIET: Party = {
    name: "Miljöpartiet",
    shortName: "MP",
    id: "0055",
    color: "#83CF39",
    order: 2,
};

const CENTERPARTY: Party = {
    name: "Centerpartiet",
    shortName: "C",
    id: "0004",
    color: "#009933",
    order: 3,
};

const LIBERALERNA: Party = {
    name: "Liberalerna",
    shortName: "L",
    id: "0003",
    color: "#006AB3",
    order: 4,
};

const MODERATERNA: Party = {
    name: "Moderaterna",
    shortName: "M",
    id: "0001",
    color: "#52BDEC",
    order: 5,
};

const KRISTDEOMKRATERNA: Party = {
    name: "Kristdemokraterna",
    shortName: "KD",
    id: "0068",
    color: "#000077",
    order: 6,
};

const SVERIGEDEMOKRATERNA: Party = {
    name: "Sverigedemokraterna",
    shortName: "SD",
    id: "0110",
    color: "#DDDD00",
    order: 7,
};

export const PARTY_DATA = {
    partier: new Map<string, Party>([
        ["0001", MODERATERNA],
        ["0002", SOCIALDEMOKRATERNA],
        ["0003", LIBERALERNA],
        ["0004", CENTERPARTY],
        ["0005", VANSTERPARTIET],
        ["0055", MIJOPARTIET],
        ["0068", KRISTDEOMKRATERNA],
        ["0110", SVERIGEDEMOKRATERNA],
    ]),
    DEFAULT_MANDAT_GROUPS: {
        left: ["0005", "0002", "0055", "0004"],
        right: ["0003", "0001", "0068", "0110"]
    }
};
