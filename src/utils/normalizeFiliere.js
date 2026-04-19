/**
 * normalizeFiliere — Normalise les noms de filières (corrige typos & variantes).
 * Utilisé par le Dashboard et la liste des étudiants pour uniformiser l'affichage.
 *
 * @param {string} raw - Le nom brut de la filière depuis la base de données
 * @returns {string} L'abréviation normalisée (ex: 'GI', 'TDI', 'GC', etc.)
 */
export function normalizeFiliere(raw) {
  if (!raw || raw.trim() === '') return 'Non spécifié';

  let f = raw
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/É/g, 'E')
    .replace(/È/g, 'E')
    .replace(/Ê/g, 'E')
    .replace(/À/g, 'A')
    .replace(/Ô/g, 'O')
    .replace(/Î/g, 'I');

  // Corrections des variantes connues → abréviation standard
  const mappings = {
    'TRANSFORMATION DIGITALE INDUSTRIELLE': 'TDI',
    'TRANSFORMATION DIGITALE INDUSTRILLE': 'TDI',
    'TRANSFORMATION DIGITALE INDUSTRUELLE': 'TDI',
    'TRANSFPRMATION DIGITALE INDUSTRIELLE': 'TDI',
    'TRANSFRMATION DIGITALE INDUSTRIELLE': 'TDI',
    'GENIE INFORMATIQUE': 'GI',
    'GENIE CIVIL': 'GC',
    'GENIE ELECTRIQUE': 'GE',
    'GENIE MECANIQUE': 'GM',
    'GENIE INDUSTRIEL': 'GIND',
    'GENIE DES PROCEDES': 'GP',
    'GENIE RESEAUX': 'GR',
    'GENIE ENERGETIQUE': 'GENG',
    'GENIE ELECTRIQUE ENERGIE RENOUVELABLES': 'GEER',
    'GENIE ELECTRIQUE ENERGIES RENOUVELABLES': 'GEER',
    'ENERGIES RENOUVELABLES ET EFFICACITE': 'EREE',
    'ENERGIES RENOUVELABLES ET EFFICACITE ENERGETIQUE': 'EREE',
    'INTELIGENCE ARTIFICIELLE ET CYBERSECURITE': 'IAC',
    'INTELLIGENCE ARTIFICIELLE ET CYBERSECURITE': 'IAC',
    'INTELLIGENCE ARTIFICIELLE': 'IA',
    'INDUSTRIE AGROALIMENTAIRE': 'IAA',
    'INGENIEUR EN AGROALIMENTAIRE': 'IAA',
    'AGROALIMENTAIRE': 'AGRO',
    'PHYSIQUE CHIMIE': 'PC',
    'SCIENCE PHYSIQUE': 'SP',
    '1ERE ANNEE PREPARATOIRE AU CYCLE INGENIEUR': 'CP',
  };

  for (const [key, val] of Object.entries(mappings)) {
    if (f === key || f.includes(key)) return val;
  }

  // Abrège automatiquement les noms longs (> 20 chars)
  if (f.length > 20) {
    return f
      .split(' ')
      .map((w) => w[0])
      .join('');
  }

  return f;
}
