import { OhadaClassReference } from './types';

/**
 * OHADA Chart of Accounts - Classes Overview
 * Complete list of all 9 classes with metadata
 */
export const ohadaClasses: OhadaClassReference[] = [
  {
    code: "1",
    name: "Comptes de ressources durables",
    nameEn: "Permanent resources",
    namePt: "Recursos permanentes",
    nameEs: "Recursos permanentes",
    file: "class-1-ressources.ts"
  },
  {
    code: "2",
    name: "Comptes d'actif immobilisé",
    nameEn: "Fixed assets",
    namePt: "Ativos imobilizados",
    nameEs: "Activos inmovilizados",
    file: "class-2-immobilisations.ts"
  },
  {
    code: "3",
    name: "Comptes de stocks",
    nameEn: "Inventory",
    namePt: "Estoques",
    nameEs: "Existencias",
    file: "class-3-stocks.ts"
  },
  {
    code: "4",
    name: "Comptes de tiers",
    nameEn: "Third parties",
    namePt: "Terceiros",
    nameEs: "Terceros",
    file: "class-4-tiers.ts"
  },
  {
    code: "5",
    name: "Comptes de trésorerie",
    nameEn: "Treasury",
    namePt: "Tesouraria",
    nameEs: "Tesoreria",
    file: "class-5-tresorerie.ts"
  },
  {
    code: "6",
    name: "Comptes de charges des activités ordinaires",
    nameEn: "Operating expenses",
    namePt: "Encargos operacionais",
    nameEs: "Gastos operativos",
    file: "class-6-charges.ts"
  },
  {
    code: "7",
    name: "Comptes de produits des activités ordinaires",
    nameEn: "Operating income",
    namePt: "Receitas operacionais",
    nameEs: "Ingresos operativos",
    file: "class-7-produits.ts"
  },
  {
    code: "8",
    name: "Comptes des autres charges et des autres produits",
    nameEn: "Non-operating items (HAO)",
    namePt: "Itens nao operacionais (HAO)",
    nameEs: "Partidas no operativas (HAO)",
    file: "class-8-hao.ts"
  },
  {
    code: "9",
    name: "Comptes des engagements hors bilan et comptes de la comptabilité analytique de gestion",
    nameEn: "Off-balance sheet & analytical accounting",
    namePt: "Compromissos extrapatrimoniais e contabilidade analitica",
    nameEs: "Compromisos fuera de balance y contabilidad analitica",
    file: "class-9-engagements.ts"
  }
];
