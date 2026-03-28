import { OhadaClass } from './types';

/**
 * Class 8 - Comptes des autres charges et des autres produits
 * Non-operating items (HAO - Hors Activités Ordinaires)
 */
export const class8: OhadaClass = {
  code: "8",
  name: "Comptes des autres charges et des autres produits",
  nameEn: "Non-operating items (HAO)",
  accounts: [
    {
      code: "81",
      name: "Valeurs comptables des cessions d'immobilisations",
      level: 2,
      subAccounts: [
        { code: "811", name: "Immobilisations incorporelles", level: 3, parentCode: "81" },
        { code: "812", name: "Immobilisations corporelles", level: 3, parentCode: "81" },
        { code: "816", name: "Immobilisations financières", level: 3, parentCode: "81" }
      ]
    },
    {
      code: "82",
      name: "Produits des cessions d'immobilisations",
      level: 2,
      subAccounts: [
        { code: "821", name: "Immobilisations incorporelles", level: 3, parentCode: "82" },
        { code: "822", name: "Immobilisations corporelles", level: 3, parentCode: "82" },
        { code: "826", name: "Immobilisations financières", level: 3, parentCode: "82" }
      ]
    },
    {
      code: "83",
      name: "Charges hors activités ordinaires",
      level: 2,
      subAccounts: [
        { code: "831", name: "Charges H.A.O. constatées", level: 3, parentCode: "83" },
        { code: "833", name: "Charges liées aux opérations de restructuration", level: 3, parentCode: "83" },
        { code: "834", name: "Pertes sur créances H.A.O.", level: 3, parentCode: "83" },
        { code: "835", name: "Dons et libéralités accordés", level: 3, parentCode: "83" },
        { code: "836", name: "Abandons de créances consentis", level: 3, parentCode: "83" },
        { code: "837", name: "Charges liées aux opérations de liquidation", level: 3, parentCode: "83" },
        { code: "839", name: "Charges pour dépréciations et provisions pour risques à court terme H.A.O.", level: 3, parentCode: "83" }
      ]
    },
    {
      code: "84",
      name: "Produits hors activités ordinaires",
      level: 2,
      subAccounts: [
        { code: "841", name: "Produits H.A.O. constatés", level: 3, parentCode: "84" },
        { code: "843", name: "Produits liés aux opérations de restructuration", level: 3, parentCode: "84" },
        { code: "845", name: "Dons et libéralités obtenus", level: 3, parentCode: "84" },
        { code: "846", name: "Abandons de créances obtenus", level: 3, parentCode: "84" },
        { code: "847", name: "Produits liés aux opérations de liquidation", level: 3, parentCode: "84" },
        { code: "848", name: "Transferts de charges H.A.O.", level: 3, parentCode: "84" },
        { code: "849", name: "Reprises de charges pour dépréciations et provisions pour risques à court terme H.A.O.", level: 3, parentCode: "84" }
      ]
    },
    {
      code: "85",
      name: "Dotations hors activités ordinaires",
      level: 2,
      subAccounts: [
        { code: "851", name: "Dotations aux provisions réglementées", level: 3, parentCode: "85" },
        { code: "852", name: "Dotations aux amortissements HAO", level: 3, parentCode: "85" },
        { code: "853", name: "Dotations aux dépréciations H.A.O.", level: 3, parentCode: "85" },
        { code: "854", name: "Dotations aux provisions pour risques et charges HAO", level: 3, parentCode: "85" },
        { code: "858", name: "Autres dotations HAO", level: 3, parentCode: "85" }
      ]
    },
    {
      code: "86",
      name: "Reprises hors activités ordinaires",
      level: 2,
      subAccounts: [
        { code: "861", name: "Reprises de provisions réglementées", level: 3, parentCode: "86" },
        { code: "862", name: "Reprises d'amortissements", level: 3, parentCode: "86" },
        { code: "863", name: "Reprises de dépréciations H.A.O.", level: 3, parentCode: "86" },
        { code: "864", name: "Reprises de provisions pour risques et charges H.A.O.", level: 3, parentCode: "86" },
        { code: "868", name: "Autres reprises H.A.O.", level: 3, parentCode: "86" }
      ]
    },
    {
      code: "87",
      name: "participation des travailleurs",
      level: 2,
      subAccounts: [
        { code: "871", name: "Participation légale aux bénéfices", level: 3, parentCode: "87" },
        { code: "872", name: "Participation contractuelle aux bénéfices", level: 3, parentCode: "87" },
        { code: "878", name: "Autres participations", level: 3, parentCode: "87" }
      ]
    },
    {
      code: "88",
      name: "Subventions d'équilibre",
      level: 2,
      subAccounts: [
        { code: "881", name: "État", level: 3, parentCode: "88" },
        { code: "884", name: "Collectivités publiques", level: 3, parentCode: "88" },
        { code: "886", name: "Groupe", level: 3, parentCode: "88" },
        { code: "888", name: "Autres", level: 3, parentCode: "88" }
      ]
    },
    {
      code: "89",
      name: "Impôts sur le résultat",
      level: 2,
      subAccounts: [
        {
          code: "891",
          name: "Impôts sur les bénéfices de l'exercice",
          level: 3,
          parentCode: "89",
          subAccounts: [
            { code: "8911", name: "Activités exercées dans l'État", level: 4, parentCode: "891" },
            { code: "8912", name: "Activités exercées dans les autres États de la Région", level: 4, parentCode: "891" },
            { code: "8913", name: "Activités exercées hors Région", level: 4, parentCode: "891" }
          ]
        },
        { code: "892", name: "Rappels d'impôts sur résultats antérieurs", level: 3, parentCode: "89" },
        { code: "895", name: "Impôt minimum forfaitaire IMF", level: 3, parentCode: "89" },
        {
          code: "899",
          name: "Dégrèvements et annulations d'impôts sur résultats antérieurs",
          level: 3,
          parentCode: "89",
          subAccounts: [
            { code: "8991", name: "Dégrèvements", level: 4, parentCode: "899" },
            { code: "8994", name: "Annulations pour pertes rétroactives", level: 4, parentCode: "899" }
          ]
        }
      ]
    }
  ]
};
