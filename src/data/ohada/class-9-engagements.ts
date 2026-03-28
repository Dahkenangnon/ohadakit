import { OhadaClass } from './types';

/**
 * Class 9 - Comptes des engagements hors bilan et comptes de la comptabilité analytique de gestion
 * Off-balance sheet commitments and analytical accounting
 */
export const class9: OhadaClass = {
  code: "9",
  name: "Comptes des engagements hors bilan et comptes de la comptabilité analytique de gestion",
  nameEn: "Off-balance sheet & analytical accounting",
  accounts: [
    {
      code: "90",
      name: "Engagements obtenus et engagements accordés",
      level: 2,
      subAccounts: [
        {
          code: "901",
          name: "Engagements de financement obtenus",
          level: 3,
          parentCode: "90",
          subAccounts: [
            { code: "9011", name: "Crédits confirmés obtenus", level: 4, parentCode: "901" },
            { code: "9012", name: "Emprunts restant à encaisser", level: 4, parentCode: "901" },
            { code: "9013", name: "Facilités de financement renouvelables", level: 4, parentCode: "901" },
            { code: "9014", name: "Facilités d'émission", level: 4, parentCode: "901" },
            { code: "9018", name: "Autres engagements de financement obtenus", level: 4, parentCode: "901" }
          ]
        },
        {
          code: "902",
          name: "Engagements de garantie obtenus",
          level: 3,
          parentCode: "90",
          subAccounts: [
            { code: "9021", name: "Avals obtenus", level: 4, parentCode: "902" },
            { code: "9022", name: "Cautions, garanties obtenues", level: 4, parentCode: "902" },
            { code: "9023", name: "Hypothèques obtenues", level: 4, parentCode: "902" },
            { code: "9024", name: "Effets endossés par des tiers", level: 4, parentCode: "902" },
            { code: "9028", name: "Autres garanties obtenues", level: 4, parentCode: "902" }
          ]
        },
        {
          code: "903",
          name: "Engagements réciproques",
          level: 3,
          parentCode: "90",
          subAccounts: [
            { code: "9031", name: "Achats de marchandises à terme", level: 4, parentCode: "903" },
            { code: "9032", name: "Achats à terme de devises", level: 4, parentCode: "903" },
            { code: "9033", name: "Commandes fermes des clients", level: 4, parentCode: "903" },
            { code: "9038", name: "Autres engagements réciproques", level: 4, parentCode: "903" }
          ]
        },
        {
          code: "904",
          name: "Autres engagements obtenus",
          level: 3,
          parentCode: "90",
          subAccounts: [
            { code: "9041", name: "Abandons de créances conditionnels", level: 4, parentCode: "904" },
            { code: "9043", name: "Ventes avec clause de réserve de propriété", level: 4, parentCode: "904" },
            { code: "9048", name: "Divers engagements obtenus", level: 4, parentCode: "904" }
          ]
        },
        {
          code: "905",
          name: "Engagements de financement accordés",
          level: 3,
          parentCode: "90",
          subAccounts: [
            { code: "9051", name: "Crédits accordés non décaissés", level: 4, parentCode: "905" },
            { code: "9058", name: "Autres engagements de financement accordés", level: 4, parentCode: "905" }
          ]
        },
        {
          code: "906",
          name: "Engagements de garantie accordés",
          level: 3,
          parentCode: "90",
          subAccounts: [
            { code: "9061", name: "Avals accordés", level: 4, parentCode: "906" },
            { code: "9062", name: "Cautions, garanties accordées", level: 4, parentCode: "906" },
            { code: "9063", name: "Hypothèques accordées", level: 4, parentCode: "906" },
            { code: "9064", name: "Effets endossés par l'entreprise", level: 4, parentCode: "906" },
            { code: "9068", name: "Autres garanties accordées", level: 4, parentCode: "906" }
          ]
        },
        {
          code: "907",
          name: "Engagements réciproques",
          level: 3,
          parentCode: "90",
          subAccounts: [
            { code: "9071", name: "Ventes de marchandises à terme", level: 4, parentCode: "907" },
            { code: "9072", name: "Ventes à terme de devises", level: 4, parentCode: "907" },
            { code: "9073", name: "Commandes fermes aux fournisseurs", level: 4, parentCode: "907" },
            { code: "9078", name: "Autres engagements réciproques", level: 4, parentCode: "907" }
          ]
        },
        {
          code: "908",
          name: "Autres engagements accordés",
          level: 3,
          parentCode: "90",
          subAccounts: [
            { code: "9081", name: "Annulations conditionnelles de dettes", level: 4, parentCode: "908" },
            { code: "9082", name: "Engagements de retraite", level: 4, parentCode: "908" },
            { code: "9083", name: "Achats avec clause de réserve de propriété", level: 4, parentCode: "908" },
            { code: "9088", name: "Divers engagements accordés", level: 4, parentCode: "908" }
          ]
        }
      ]
    },
    {
      code: "91",
      name: "Contreparties des engagements",
      level: 2,
      subAccounts: [
        { code: "911", name: "Contrepartie engagements de financement obtenus", level: 3, parentCode: "91" },
        { code: "912", name: "Contrepartie engagements de garantie obtenus", level: 3, parentCode: "91" },
        { code: "913", name: "Contrepartie engagements réciproques obtenus", level: 3, parentCode: "91" },
        { code: "914", name: "Contrepartie autres engagements obtenus", level: 3, parentCode: "91" },
        { code: "915", name: "Contrepartie engagements de financement accordés", level: 3, parentCode: "91" },
        { code: "916", name: "Contrepartie engagements de garantie accordés", level: 3, parentCode: "91" },
        { code: "917", name: "Contrepartie engagements réciproques accordés", level: 3, parentCode: "91" },
        { code: "918", name: "Contrepartie autres engagements accordés", level: 3, parentCode: "91" }
      ]
    },
    {
      code: "92",
      name: "Comptes réfléchis",
      level: 2,
      subAccounts: []
    },
    {
      code: "93",
      name: "Comptes de reclassements",
      level: 2,
      subAccounts: []
    },
    {
      code: "94",
      name: "Comptes de coûts",
      level: 2,
      subAccounts: []
    },
    {
      code: "95",
      name: "Comptes de stocks",
      level: 2,
      subAccounts: []
    },
    {
      code: "96",
      name: "Comptes d'écarts sur coûts préétablis",
      level: 2,
      subAccounts: []
    },
    {
      code: "97",
      name: "Comptes de différences de traitement comptable",
      level: 2,
      subAccounts: []
    },
    {
      code: "98",
      name: "Comptes de résultats",
      level: 2,
      subAccounts: []
    },
    {
      code: "99",
      name: "Comptes de liaisons internes",
      level: 2,
      subAccounts: []
    }
  ]
};
