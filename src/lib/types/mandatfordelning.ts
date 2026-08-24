export type Root = {
  valtillfalle: string;
  valklass: string;
  rakningstillfalle: string;
  valtyp: string;
  valdatum: string;
  tidigareValdatum: string;
  test: boolean;
  senasteUppdateringstid: string;
  antalUppdateringar: number;
  valomrade: Valomrade;
}

export type Valomrade = {
  namn: string;
  kod: string;
  rapporteringsTid: string | null;
  totaltAntalMandat: number;
  totaltAntalFastaMandat: number;
  totaltAntalUtjamningsMandat: number;
  antalValdistriktRaknade: number;
  antalValdistriktSomSkaRaknas: number;
  totaltAntalRoster: number;
  antalRostberattigade: number;
  valdeltagande: number;
  antalRostberattigadeIRaknadeValdistrikt: number;
  valomradessparrProcent: number;
  valkretssparrProcent: number;
  meddelandetext: string;
  valomradeskodForegaendeVal: Array<string>;
  totaltAntalMandatForegaendeVal: number;
  totaltAntalFastaMandatForegaendeVal: number;
  totaltAntalUtjamningsMandatForegaendeVal: number;
  totaltAntalRosterForegaendeVal: number;
  antalRostberattigadeForegaendeVal: number;
  valdeltagandeForegaendeVal: number;
  forandringTotaltAntalRoster: number;
  forandringValdeltagande: number;
  forandringAntalRostberattigade: number;
  statusJamforelse: string;
  rostfordelning: RostFordelning;
  mandatfordelning: MandatFordelning | null;
  valkretsLista: Array<Valkrets>;
}

export type RostFordelning = {
  rosterPaverkaMandat: RosterPaverkaMandat;
  rosterEjPaverkaMandat: RosterEjPaverkaMandat;
}

export type RosterPaverkaMandat = {
  antalRoster: number;
  antalRosterForegaendeVal: number;
  forandringAntalRoster: number;
  partiRoster: Array<PartiRost>;
  rosterOvrigaPartier: RosterOvrigaPartier;
}

export type PartiRost = {
  partibeteckning: string;
  partiforkortning: string;
  partikod: string;
  fargkod: string;
  ordningsnummer: number;
  antalRoster: number;
  andelRoster: number;
  deltaMandatfordelning: string;
  antalRosterForegaendeVal: number | null;
  andelRosterForegaendeVal: number | null;
  forandringAntalRoster: number | null;
  forandringAndelRoster: number | null;
}

export type RosterOvrigaPartier = {
  antalRoster: number;
  andelRoster: number;
  antalRosterForegaendeVal: number | null;
  andelRosterForegaendeVal: number | null;
  forandringAntalRoster: number | null;
  forandringAndelRoster: number | null;
}

export type RosterEjPaverkaMandat = {
  antalRoster: number;
  andelRosterAvTotaltAntalRoster: number;
  antalRosterForegaendeVal: number | null;
  andelRosterAvTotaltAntalRosterForegaendeVal: number | null;
  forandringAntalRoster: number | null;
  forandringAndelRosterAvTotaltAntalRoster: number | null;
  rosterEjAnmaltDeltagande: RosterEjAnmaltDeltagande;
  blankaRoster: BlankaRoster;
  ovrigaOgiltiga: OvrigaOgiltiga;
}

export type RosterEjAnmaltDeltagande = {
  antalRoster: number;
  andelRosterAvTotaltAntalRoster: number;
  antalRosterForegaendeVal: number | null;
  andelRosterAvTotaltAntalRosterForegaendeVal: number | null;
  forandringAntalRoster: number | null;
  forandringAndelRosterAvTotaltAntalRoster: number | null;
}

export type BlankaRoster = {
  antalRoster: number;
  andelRosterAvTotaltAntalRoster: number;
  antalRosterForegaendeVal: number | null;
  andelRosterAvTotaltAntalRosterForegaendeVal: number | null;
  forandringAntalRoster: number | null;
  forandringAndelRosterAvTotaltAntalRoster: number | null;
}

export type OvrigaOgiltiga = {
  antalRoster: number;
  andelRosterAvTotaltAntalRoster: number;
  antalRosterForegaendeVal: number | null;
  andelRosterAvTotaltAntalRosterForegaendeVal: number | null;
  forandringAntalRoster: number | null;
  forandringAndelRosterAvTotaltAntalRoster: number | null;
}

export type MandatFordelning = {
  partiLista: Array<Parti>;
}

export type Parti = {
  partibeteckning: string;
  partikod: string;
  partiforkortning: string;
  antalMandat: number;
  antalFastaMandat: number;
  antalUtjamningsmandat: number;
  antalMandatForegaendeVal: number;
  antalFastaMandatForegaendeVal: number;
  antalUtjamningsMandatForegaendeVal: number;
  forandringAntalMandat: number;
}

export type Valkrets = {
  namnValkrets: string;
  kod: string;
  rapporteringsTid: string | null;
  totaltAntalFastaMandat: number;
  antalRostberattigade: number;
  totaltAntalRoster: number;
  valdeltagande: number;
  antalRostberattigadeIRaknadeValdistrikt: number;
  antalValdistriktRaknade: number;
  antalValdistriktSomSkaRaknas: number;
  valkretskodForegaendeVal: Array<string>;
  totaltAntalRosterForegaendeVal: number;
  totaltAntalFastaMandatForegaendeVal: number | null;
  antalRostberattigadeForegaendeVal: number;
  valdeltagandeForegaendeVal: number;
  forandringTotaltAntalRoster: number | null;
  forandringValdeltagande: number | null;
  forandringAntalRostberattigade: number;
  statusJamforelse: string;
  rostfordelning: RostFordelning | null;
  mandatfordelning: MandatFordelning | null;
}
