import AdmZip from "adm-zip";
import type { Root } from "./types/mandatfordelning";

export class DataHandler {
  url: string;
  searchZip: string;
  zipFileName: string;
  data: Root | null = null;
  lastHash: string = "";

  constructor(debug: boolean) {
    if (debug) {
      this.url = "https://resultat.val.se/resultatfiler/genrep2026";
      this.searchZip = "Genrep_2026_preliminar_00_RD.zip";
      this.zipFileName = "Genrep_2026_preliminar_mandatfordelning_00_RD.json";
    } else {
      this.url = "https://resultat.val.se/resultatfiler/val2026";
      this.searchZip = "Val_2026_preliminar_00_RD.zip";
      this.zipFileName = "Val_2026_preliminar_mandatfordelning_00_RD.json";
    }
  }

  async fetchData() {
    const res = await fetch(this.url + "/index.md5");
    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    const indexText = await res.text();
    const lines = indexText.split("\n");
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length < 2) continue;
      const hash = parts[0];
      const filePath = parts[1];
      if(!filePath.endsWith(this.searchZip)) continue;
      if (this.lastHash == hash) continue;

      this.lastHash = hash;

      const zipRes = await fetch(this.url + "/" + filePath);
      if (!zipRes.ok) {
        throw new Error(`Failed to fetch zip file: ${zipRes.status} ${zipRes.statusText}`);
      }
      const arrayBuffer = await zipRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const zip = new AdmZip(buffer);

      const entry = zip.getEntry(this.zipFileName);

      if (!entry) {
        throw new Error(`Zip file does not contain ${this.zipFileName}`);
      }

      const jsonString = entry.getData().toString("utf8");
      this.data = JSON.parse(jsonString) as Root;
    }
  }
}
