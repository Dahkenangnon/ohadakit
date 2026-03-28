import { OhadaClass } from './types';

/**
 * Class 3 - Comptes de stocks
 * Inventory accounts
 */
export const class3: OhadaClass = {
  code: "3",
  name: "Comptes de stocks",
  nameEn: "Inventory",
  accounts: [
    {
      code: "31",
      name: "Marchandises",
      level: 2,
      subAccounts: [
        {
          code: "311",
          name: "Marchandises A",
          level: 3,
          parentCode: "31",
          subAccounts: [
            { code: "3111", name: "Marchandises A1", level: 4, parentCode: "311" },
            { code: "3112", name: "Marchandises A2", level: 4, parentCode: "311" }
          ]
        },
        {
          code: "312",
          name: "Marchandises B",
          level: 3,
          parentCode: "31",
          subAccounts: [
            { code: "3121", name: "Marchandises B1", level: 4, parentCode: "312" },
            { code: "3122", name: "Marchandises B2", level: 4, parentCode: "312" }
          ]
        },
        {
          code: "318",
          name: "Marchandises hors activités ordinaires (H.A.O.)",
          level: 3,
          parentCode: "31"
        }
      ]
    },
    {
      code: "32",
      name: "Matières premières et fournitures liées",
      level: 2,
      subAccounts: [
        { code: "321", name: "Matières A", level: 3, parentCode: "32" },
        { code: "322", name: "Matières B", level: 3, parentCode: "32" },
        { code: "323", name: "Fournitures (A, B)", level: 3, parentCode: "32" }
      ]
    },
    {
      code: "33",
      name: "Autres approvisionnements",
      level: 2,
      subAccounts: [
        { code: "331", name: "Matières consommables", level: 3, parentCode: "33" },
        { code: "332", name: "Fournitures d'atelier et d'usine", level: 3, parentCode: "33" },
        { code: "333", name: "Fournitures de magasin", level: 3, parentCode: "33" },
        { code: "334", name: "Fournitures de bureau", level: 3, parentCode: "33" },
        {
          code: "335",
          name: "Emballages",
          level: 3,
          parentCode: "33",
          subAccounts: [
            { code: "3351", name: "Emballages perdus", level: 4, parentCode: "335" },
            { code: "3352", name: "Emballages récupérables non identifiables", level: 4, parentCode: "335" },
            { code: "3353", name: "Emballages à usage mixte", level: 4, parentCode: "335" },
            { code: "3358", name: "Autres emballages", level: 4, parentCode: "335" }
          ]
        },
        { code: "338", name: "Autres matières", level: 3, parentCode: "33" }
      ]
    },
    {
      code: "34",
      name: "Produits en cours",
      level: 2,
      subAccounts: [
        {
          code: "341",
          name: "Produits en cours",
          level: 3,
          parentCode: "34",
          subAccounts: [
            { code: "3411", name: "Produits en cours P1", level: 4, parentCode: "341" },
            { code: "3412", name: "Produits en cours P2", level: 4, parentCode: "341" }
          ]
        },
        {
          code: "342",
          name: "Travaux en cours",
          level: 3,
          parentCode: "34",
          subAccounts: [
            { code: "3421", name: "Travaux en cours T1", level: 4, parentCode: "342" },
            { code: "3422", name: "Travaux en cours T2", level: 4, parentCode: "342" }
          ]
        },
        {
          code: "343",
          name: "Produits intermédiaires en cours",
          level: 3,
          parentCode: "34",
          subAccounts: [
            { code: "3431", name: "Produits intermédiaires A", level: 4, parentCode: "343" },
            { code: "3432", name: "Produits intermédiaires B", level: 4, parentCode: "343" }
          ]
        },
        {
          code: "344",
          name: "Produits résiduels en cours",
          level: 3,
          parentCode: "34",
          subAccounts: [
            { code: "3441", name: "Produits résiduels A", level: 4, parentCode: "344" },
            { code: "3442", name: "Produits résiduels B", level: 4, parentCode: "344" }
          ]
        }
      ]
    },
    {
      code: "35",
      name: "Services en cours",
      level: 2,
      subAccounts: [
        {
          code: "351",
          name: "Études en cours",
          level: 3,
          parentCode: "35",
          subAccounts: [
            { code: "3511", name: "Études en cours E1", level: 4, parentCode: "351" },
            { code: "3512", name: "Études en cours E2", level: 4, parentCode: "351" }
          ]
        },
        {
          code: "352",
          name: "Prestations de services en cours",
          level: 3,
          parentCode: "35",
          subAccounts: [
            { code: "3521", name: "Prestations de services S1", level: 4, parentCode: "352" },
            { code: "3522", name: "Prestations de services S2", level: 4, parentCode: "352" }
          ]
        }
      ]
    },
    {
      code: "36",
      name: "Produits finis",
      level: 2,
      subAccounts: [
        { code: "361", name: "Produits finis A", level: 3, parentCode: "36" },
        { code: "362", name: "Produits finis B", level: 3, parentCode: "36" }
      ]
    },
    {
      code: "37",
      name: "Produits intermédiaires et résiduels",
      level: 2,
      subAccounts: [
        {
          code: "371",
          name: "Produits intermédiaires",
          level: 3,
          parentCode: "37",
          subAccounts: [
            { code: "3711", name: "Produits intermédiaires A", level: 4, parentCode: "371" },
            { code: "3712", name: "Produits intermédiaires B", level: 4, parentCode: "371" }
          ]
        },
        {
          code: "372",
          name: "Produits résiduels",
          level: 3,
          parentCode: "37",
          subAccounts: [
            { code: "3721", name: "Déchets", level: 4, parentCode: "372" },
            { code: "3722", name: "Rebuts", level: 4, parentCode: "372" },
            { code: "3723", name: "Matières de Récupération", level: 4, parentCode: "372" }
          ]
        }
      ]
    },
    {
      code: "38",
      name: "Stocks en cours de route, en consignation ou en dépôt",
      level: 2,
      subAccounts: [
        { code: "381", name: "Marchandises en cours de route", level: 3, parentCode: "38" },
        { code: "382", name: "Matières premières et fournitures liées en cours de route", level: 3, parentCode: "38" },
        { code: "383", name: "Autres approvisionnements en cours de route", level: 3, parentCode: "38" },
        { code: "386", name: "Produits finis en cours de route", level: 3, parentCode: "38" },
        {
          code: "387",
          name: "Stock en consignation ou en dépôt",
          level: 3,
          parentCode: "38",
          subAccounts: [
            { code: "3871", name: "Stock en consignation", level: 4, parentCode: "387" },
            { code: "3872", name: "Stock en dépôt", level: 4, parentCode: "387" }
          ]
        },
        { code: "388", name: "Stock provenant d'immobilisations mises hors service ou au rebut", level: 3, parentCode: "38" }
      ]
    },
    {
      code: "39",
      name: "Dépréciations des stocks",
      level: 2,
      subAccounts: [
        { code: "391", name: "Dépréciations des stocks de marchandises", level: 3, parentCode: "39" },
        { code: "392", name: "Dépréciations des stocks de matières premières et fournitures liées", level: 3, parentCode: "39" },
        { code: "393", name: "Dépréciations des stocks d'autres approvisionnements", level: 3, parentCode: "39" },
        { code: "394", name: "Dépréciations des produits en cours", level: 3, parentCode: "39" },
        { code: "395", name: "Dépréciations des services en cours", level: 3, parentCode: "39" },
        { code: "396", name: "Dépréciations des stocks de produits finis", level: 3, parentCode: "39" },
        { code: "397", name: "Dépréciations des stocks de produits intermédiaires et résiduels", level: 3, parentCode: "39" },
        { code: "398", name: "Dépréciations des stocks en cours de route, en consignation ou en dépôt", level: 3, parentCode: "39" }
      ]
    }
  ]
};
