/**
 * normalizeFiliere — Normalise les noms de filières vers les 5 filières officielles
 * de l'ENSA + Classe Préparatoire.
 *
 * Filières ingénieur (3 ans) :
 *   - GEER : Génie Électrique et Énergies Renouvelables
 *   - IAA  : Industries Agroalimentaires
 *   - IAC  : Intelligence Artificielle et Cybersécurité
 *   - TDI  : Transformation Digitale Industrielle
 *
 * Cycle préparatoire :
 *   - CP   : Classe Préparatoire
 *
 * @param {string} raw - Le nom brut de la filière depuis la base de données
 * @returns {string} L'abréviation normalisée (GEER, IAA, IAC, TDI, CP) ou 'Non spécifié'
 */
export function normalizeFiliere(raw) {
  if (!raw || raw.trim() === '') return 'Non spécifié';

  const f = raw
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/[ÉÈÊË]/g, 'E')
    .replace(/[ÀÂÄ]/g, 'A')
    .replace(/[ÔÖ]/g, 'O')
    .replace(/[ÎÏ]/g, 'I')
    .replace(/[ÙÛÜ]/g, 'U')
    .replace(/Ç/g, 'C');

  // ── GEER : Génie Électrique et Énergies Renouvelables ──────
  if (
    f.includes('ELECTRIQUE') && f.includes('RENOUVELABLE') ||
    f.includes('ENERGIE') && f.includes('RENOUVELABLE') ||
    f === 'GEER' || f === 'EREE' || f === 'GE' ||
    f === 'GENIE ELECTRIQUE' ||
    f.includes('GEER') || f.includes('EREE')
  ) return 'GEER';

  // ── IAA : Industries Agroalimentaires ──────────────────────
  if (
    f.includes('AGROALIMENTAIRE') || f.includes('AGRO') ||
    f === 'IAA' ||
    f.includes('IAA')
  ) return 'IAA';

  // ── IAC : Intelligence Artificielle et Cybersécurité ───────
  if (
    f.includes('INTELLIGENCE ARTIFICIELLE') ||
    f.includes('CYBERSECURITE') ||
    f.includes('INTELIGENCE ARTIFICIELLE') ||
    f === 'IAC' || f === 'IACS' || f === 'IAEC' ||
    f === 'IA' || f === 'API' || f === 'SCAI' || f === 'APCI' ||
    f.includes('IAC') || f.includes('IACS')
  ) return 'IAC';

  // ── TDI : Transformation Digitale Industrielle ─────────────
  if (
    f.includes('TRANSFORMATION DIGITALE') ||
    f.includes('DIGITALE INDUSTRIELLE') ||
    f === 'TDI' || f === 'PCI' ||
    f.includes('TDI')
  ) return 'TDI';

  // ── CP : Classe Préparatoire ───────────────────────────────
  if (
    f.includes('PREPARATOIRE') ||
    f.includes('PREPA') ||
    f === 'CP' || f === 'CP1' || f === 'CP2' || f === 'CP 1' || f === 'CP 2' ||
    f === 'MPSI' || f === 'MP' || f === 'PC' || f === 'SP' ||
    f === '1APACI' || f === '2APACI' ||
    f.includes('CYCLE PREPARATOIRE') ||
    f.includes('ANNEE PREPARATOIRE') ||
    f.match(/^CP\d?$/) ||
    f.match(/^\d?A?PACI$/)
  ) return 'CP';

  // Filière non reconnue → Non spécifié
  return 'Non spécifié';
}

/**
 * Liste des filières officielles de l'ENSA.
 */
export const FILIERES_OFFICIELLES = [
  { code: 'GEER', label: 'Génie Électrique et Énergies Renouvelables' },
  { code: 'IAA',  label: 'Industries Agroalimentaires' },
  { code: 'IAC',  label: 'Intelligence Artificielle et Cybersécurité' },
  { code: 'TDI',  label: 'Transformation Digitale Industrielle' },
  { code: 'CP',   label: 'Classe Préparatoire' },
];
