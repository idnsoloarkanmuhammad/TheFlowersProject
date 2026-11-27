// Verified botanical family metadata for the 15 existing studies.
// Names and family placement are sourced from Kew Plants of the World Online.
// Renderer definitions remain the source for artwork, common names and displayed Latin names.
(() => {
  'use strict';
  const records = {
    top: { family: 'Liliaceae', source: 'https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:30009317-2' },
    'peony-study': { family: 'Paeoniaceae', source: 'https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:329475-2' },
    'violet-study': { family: 'Violaceae', source: 'https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:30000540-2' },
    cherry: { family: 'Rosaceae', source: 'https://powo.science.kew.org/taxon/30003057-2' },
    dahlia: { family: 'Asteraceae', source: 'https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:325940-2' },
    daisy: { family: 'Asteraceae', source: 'https://powo.science.kew.org/taxon/184409-1' },
    hydrangea: { family: 'Hydrangeaceae', source: 'https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:791637-1' },
    iris: { family: 'Iridaceae', source: 'https://powo.science.kew.org/taxon/438637-1' },
    lavender: { family: 'Lamiaceae', source: 'https://powo.science.kew.org/taxon/20960-1' },
    lotus: { family: 'Nelumbonaceae', source: 'https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:605422-1' },
    magnolia: { family: 'Magnoliaceae', source: 'https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:60468302-2' },
    poppy: { family: 'Papaveraceae', source: 'https://powo.science.kew.org/taxon/306058-2' },
    rose: { family: 'Rosaceae', source: 'https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:30002432-2' },
    sunflower: { family: 'Asteraceae', source: 'https://powo.science.kew.org/taxon/119003-2' },
    tulip: { family: 'Liliaceae', source: 'https://powo.science.kew.org/taxon/24874-1' },
  };
  window.FlowerBotany = Object.freeze(Object.fromEntries(
    Object.entries(records).map(([id, record]) => [id, Object.freeze({ ...record })]),
  ));
})();
