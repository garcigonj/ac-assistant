export type SeedSource = { title: string; model: string; url: string };
export const SEED_SOURCES: SeedSource[] = [
  { title: "Common Air Conditioner Problems (DOE)", model: "GENERIC", url: "https://www.energy.gov/sites/prod/files/2014/06/f16/HomeCooling101.pdf" },
  { title: "Air Conditioner Diagnostics & Maintenance (DOE)", model: "GENERIC", url: "https://www1.eere.energy.gov/buildings/publications/pdfs/building_america/measure_guide_air_cond_diagnostics.pdf" },
  { title: "HVAC Checklist - Long Form (EPA)", model: "GENERIC", url: "https://www.epa.gov/sites/default/files/2014-08/documents/hvaclong.pdf" },
  { title: "HVAC Functional Inspection & Testing (NIST)", model: "GENERIC", url: "https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nistir4758.pdf" },
  { title: "Daikin – Malfunction Code Chart (SkyAir)", model: "DAIKIN_SKYAIR", url: "https://daikincomfort.com/docs/default-source/skyair-system---heat-pump/malfunction-code-chart-001.pdf" },
  { title: "Mitsubishi Electric – City Multi Error Codes", model: "MITSUBISHI_CITY_MULTI", url: "https://www.mitsubishielectric.com.sg/getmedia/1e62eab7-7520-4a01-8f94-a9f0bebd0f7d/CityMultiErrorCode.pdf" },
  { title: "LG – Fault Codes (Split Systems)", model: "LG_SPLIT", url: "https://www.arma.org.au/wp-content/uploads/2017/02/LG-FAULT-CODES-1.pdf" },
  { title: "Fujitsu – Service Instruction (Outdoor): Error Code List", model: "FUJITSU_OUTDOOR", url: "https://portal.fujitsugeneral.com/files/catalog/files/AOU48RLXFZ1%28SI%29sm.pdf" }
];
