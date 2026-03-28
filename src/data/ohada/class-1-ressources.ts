import { OhadaClass } from './types';

/**
 * Class 1 - Comptes de ressources durables
 * Permanent resources accounts (Equity, Reserves, Debt)
 */
export const class1: OhadaClass = {
  code: "1",
  name: "Comptes de ressources durables",
  nameEn: "Permanent resources",
  accounts: [
    {
      code: "10",
      name: "Capital",
      level: 2,
      subAccounts: [
        {
          code: "101",
          name: "Capital social",
          level: 3,
          parentCode: "10",
          subAccounts: [
            { code: "1011", name: "Capital souscrit, non appelé", level: 4, parentCode: "101" },
            { code: "1012", name: "Capital souscrit, appelé, non versé", level: 4, parentCode: "101" },
            { code: "1013", name: "Capital souscrit, appelé, versé, non amorti", level: 4, parentCode: "101" },
            { code: "1014", name: "Capital souscrit, appelé, versé, amorti", level: 4, parentCode: "101" },
            { code: "1018", name: "Capital souscrit soumis à des conditions particulières", level: 4, parentCode: "101" }
          ]
        },
        {
          code: "102",
          name: "Capital par dotation",
          level: 3,
          parentCode: "10",
          subAccounts: [
            { code: "1021", name: "Dotation initiale", level: 4, parentCode: "102" },
            { code: "1022", name: "Dotations complémentaires", level: 4, parentCode: "102" },
            { code: "1028", name: "Autres dotations", level: 4, parentCode: "102" }
          ]
        },
        {
          code: "103",
          name: "Capital personnel",
          level: 3,
          parentCode: "10"
        },
        {
          code: "104",
          name: "Compte de l'exploitant",
          level: 3,
          parentCode: "10",
          subAccounts: [
            { code: "1041", name: "Apports temporaires", level: 4, parentCode: "104" },
            { code: "1042", name: "Opérations courantes", level: 4, parentCode: "104" },
            { code: "1043", name: "Rémunérations, impôts et autres charges personnelles", level: 4, parentCode: "104" },
            { code: "1047", name: "Prélèvements d'autoconsommation", level: 4, parentCode: "104" },
            { code: "1048", name: "Autres prélèvements", level: 4, parentCode: "104" }
          ]
        },
        {
          code: "105",
          name: "Primes liées au capital social",
          level: 3,
          parentCode: "10",
          subAccounts: [
            { code: "1051", name: "Primes d'émission", level: 4, parentCode: "105" },
            { code: "1052", name: "Primes d'apport", level: 4, parentCode: "105" },
            { code: "1053", name: "Primes de fusion", level: 4, parentCode: "105" },
            { code: "1054", name: "Primes de conversion", level: 4, parentCode: "105" },
            { code: "1058", name: "Autres primes", level: 4, parentCode: "105" }
          ]
        },
        {
          code: "106",
          name: "Écarts de réévaluation",
          level: 3,
          parentCode: "10",
          subAccounts: [
            { code: "1061", name: "Écarts de réévaluation légale", level: 4, parentCode: "106" },
            { code: "1062", name: "Écarts de réévaluation libre", level: 4, parentCode: "106" }
          ]
        },
        {
          code: "109",
          name: "Apporteurs, capital souscrit, non appelé",
          level: 3,
          parentCode: "10"
        }
      ]
    },
    {
      code: "11",
      name: "Réserves",
      level: 2,
      subAccounts: [
        { code: "111", name: "Réserve légale", level: 3, parentCode: "11" },
        { code: "112", name: "Réserves statutaires ou contractuelles", level: 3, parentCode: "11" },
        {
          code: "113",
          name: "Réserves réglementées",
          level: 3,
          parentCode: "11",
          subAccounts: [
            { code: "1131", name: "Réserves de plus-values nettes à long terme", level: 4, parentCode: "113" },
            { code: "1132", name: "Réserves d'attribution gratuite d'actions au personnel salarié et aux dirigeants", level: 4, parentCode: "113" },
            { code: "1133", name: "Réserves consécutives à l'octroi de subventions d'investissement", level: 4, parentCode: "113" },
            { code: "1134", name: "Réserves de valeurs mobilières donnant accès au capital", level: 4, parentCode: "113" },
            { code: "1138", name: "Autres réserves réglementées", level: 4, parentCode: "113" }
          ]
        },
        {
          code: "118",
          name: "Autres réserves",
          level: 3,
          parentCode: "11",
          subAccounts: [
            { code: "1181", name: "Réserves facultatives", level: 4, parentCode: "118" },
            { code: "1188", name: "Réserves diverses", level: 4, parentCode: "118" }
          ]
        }
      ]
    },
    {
      code: "12",
      name: "Report à nouveau",
      level: 2,
      subAccounts: [
        { code: "121", name: "Report à nouveau créditeur", level: 3, parentCode: "12" },
        {
          code: "129",
          name: "Report à nouveau débiteur",
          level: 3,
          parentCode: "12",
          subAccounts: [
            { code: "1291", name: "Perte nette à reporter", level: 4, parentCode: "129" },
            { code: "1292", name: "Perte - Amortissements réputés différés", level: 4, parentCode: "129" }
          ]
        }
      ]
    },
    {
      code: "13",
      name: "Résultat net de l'exercice",
      level: 2,
      subAccounts: [
        {
          code: "130",
          name: "Résultat en instance d'affectation",
          level: 3,
          parentCode: "13",
          subAccounts: [
            { code: "1301", name: "Résultat en instance d'affectation : bénéfice", level: 4, parentCode: "130" },
            { code: "1309", name: "Résultat en instance d'affectation : perte", level: 4, parentCode: "130" }
          ]
        },
        { code: "131", name: "Résultat net : bénéfice", level: 3, parentCode: "13" },
        { code: "132", name: "Marge commerciale (M.C.)", level: 3, parentCode: "13" },
        { code: "133", name: "Valeur ajoutée (VA)", level: 3, parentCode: "13" },
        { code: "134", name: "Excédent brut d'exploitation (EBE)", level: 3, parentCode: "13" },
        { code: "135", name: "Résultat d'exploitation (RE)", level: 3, parentCode: "13" },
        { code: "136", name: "Résultat financier (RF)", level: 3, parentCode: "13" },
        { code: "137", name: "Résultat des activités ordinaires (RAO)", level: 3, parentCode: "13" },
        {
          code: "138",
          name: "Résultat hors activités ordinaires (RHAO)",
          level: 3,
          parentCode: "13",
          subAccounts: [
            { code: "1381", name: "Résultat de fusion", level: 4, parentCode: "138" },
            { code: "1382", name: "Résultat d'apport partiel d'actif", level: 4, parentCode: "138" },
            { code: "1383", name: "Résultat de scission", level: 4, parentCode: "138" },
            { code: "1384", name: "Résultat de liquidation", level: 4, parentCode: "138" }
          ]
        },
        { code: "139", name: "Résultat net : perte", level: 3, parentCode: "13" }
      ]
    },
    {
      code: "14",
      name: "Subventions d'investissement",
      level: 2,
      subAccounts: [
        {
          code: "141",
          name: "Subventions d'équipement",
          level: 3,
          parentCode: "14",
          subAccounts: [
            { code: "1411", name: "État", level: 4, parentCode: "141" },
            { code: "1412", name: "Régions", level: 4, parentCode: "141" },
            { code: "1413", name: "Départements", level: 4, parentCode: "141" },
            { code: "1414", name: "Communes et collectivités publiques décentralisées", level: 4, parentCode: "141" },
            { code: "1415", name: "Entreprises publiques ou mixtes", level: 4, parentCode: "141" },
            { code: "1416", name: "Entreprises et organismes privés", level: 4, parentCode: "141" },
            { code: "1417", name: "Organismes internationaux", level: 4, parentCode: "141" },
            { code: "1418", name: "Autres", level: 4, parentCode: "141" }
          ]
        },
        { code: "148", name: "Autres subventions d'investissement", level: 3, parentCode: "14" }
      ]
    },
    {
      code: "15",
      name: "Provisions réglementées et fonds assimilés",
      level: 2,
      subAccounts: [
        { code: "151", name: "Amortissements dérogatoires", level: 3, parentCode: "15" },
        { code: "152", name: "Plus-values de cession à réinvestir", level: 3, parentCode: "15" },
        {
          code: "153",
          name: "Fonds réglementés",
          level: 3,
          parentCode: "15",
          subAccounts: [
            { code: "1531", name: "Fonds National", level: 4, parentCode: "153" },
            { code: "1532", name: "Prélèvement pour le Budget", level: 4, parentCode: "153" }
          ]
        },
        { code: "154", name: "Provision spéciale de réévaluation", level: 3, parentCode: "15" },
        {
          code: "155",
          name: "Provisions réglementées relatives aux immobilisations",
          level: 3,
          parentCode: "15",
          subAccounts: [
            { code: "1551", name: "Reconstitution des gisements miniers et pétroliers", level: 4, parentCode: "155" }
          ]
        },
        {
          code: "156",
          name: "Provisions réglementées relatives aux stocks",
          level: 3,
          parentCode: "15",
          subAccounts: [
            { code: "1561", name: "Hausse de prix", level: 4, parentCode: "156" },
            { code: "1562", name: "Fluctuation des cours", level: 4, parentCode: "156" }
          ]
        },
        { code: "157", name: "Provisions pour investissement", level: 3, parentCode: "15" },
        { code: "158", name: "Autres provisions et fonds réglementés", level: 3, parentCode: "15" }
      ]
    },
    {
      code: "16",
      name: "Emprunts et dettes assimilées",
      level: 2,
      subAccounts: [
        {
          code: "161",
          name: "Emprunts obligataires",
          level: 3,
          parentCode: "16",
          subAccounts: [
            { code: "1611", name: "Emprunts obligataires ordinaires", level: 4, parentCode: "161" },
            { code: "1612", name: "Emprunts obligataires convertibles", level: 4, parentCode: "161" },
            { code: "1613", name: "Emprunts obligataires remboursables en actions", level: 4, parentCode: "161" },
            { code: "1618", name: "Autres emprunts obligataires", level: 4, parentCode: "161" }
          ]
        },
        { code: "162", name: "Emprunts et dettes auprès des établissements de crédit", level: 3, parentCode: "16" },
        { code: "163", name: "Avances reçues de l'État", level: 3, parentCode: "16" },
        { code: "164", name: "Avances reçues et comptes courants bloqués", level: 3, parentCode: "16" },
        {
          code: "165",
          name: "Dépôts et cautionnements reçus",
          level: 3,
          parentCode: "16",
          subAccounts: [
            { code: "1651", name: "Dépôts", level: 4, parentCode: "165" },
            { code: "1652", name: "Cautionnements", level: 4, parentCode: "165" }
          ]
        },
        {
          code: "166",
          name: "Intérêts courus",
          level: 3,
          parentCode: "16",
          subAccounts: [
            { code: "1661", name: "sur emprunts obligataires", level: 4, parentCode: "166" },
            { code: "1662", name: "sur emprunts et dettes auprès des établissements de crédit", level: 4, parentCode: "166" },
            { code: "1663", name: "sur avances reçues de l'État", level: 4, parentCode: "166" },
            { code: "1664", name: "sur avances reçues et comptes courants bloqués", level: 4, parentCode: "166" },
            { code: "1665", name: "sur dépôts et cautionnements reçus", level: 4, parentCode: "166" },
            { code: "1667", name: "sur avances assorties de conditions particulières", level: 4, parentCode: "166" },
            { code: "1668", name: "sur autres emprunts et dettes", level: 4, parentCode: "166" }
          ]
        },
        {
          code: "167",
          name: "Avances assorties de conditions particulières",
          level: 3,
          parentCode: "16",
          subAccounts: [
            { code: "1671", name: "Avances bloquées pour augmentation du capital", level: 4, parentCode: "167" },
            { code: "1672", name: "Avances conditionnées par l'État", level: 4, parentCode: "167" },
            { code: "1673", name: "Avances conditionnées par les autres organismes africains", level: 4, parentCode: "167" },
            { code: "1674", name: "Avances conditionnées par les organismes internationaux", level: 4, parentCode: "167" }
          ]
        },
        {
          code: "168",
          name: "Autres emprunts et dettes",
          level: 3,
          parentCode: "16",
          subAccounts: [
            { code: "1681", name: "Rentes viagères capitalisées", level: 4, parentCode: "168" },
            { code: "1682", name: "Billets de fonds", level: 4, parentCode: "168" },
            { code: "1683", name: "Dettes consécutives à des titres empruntés", level: 4, parentCode: "168" },
            { code: "1684", name: "Emprunts participatifs", level: 4, parentCode: "168" },
            { code: "1685", name: "Participation des travailleurs aux bénéfices", level: 4, parentCode: "168" },
            { code: "1686", name: "Emprunts et dettes contractés auprès des autres tiers", level: 4, parentCode: "168" }
          ]
        }
      ]
    },
    {
      code: "17",
      name: "Dettes de location acquisition",
      level: 2,
      subAccounts: [
        { code: "172", name: "Dettes de location acquisition/crédit-bail immobilier", level: 3, parentCode: "17" },
        { code: "173", name: "Dettes de location acquisition/crédit-bail mobilier", level: 3, parentCode: "17" },
        { code: "174", name: "Dettes de location acquisition/location vente", level: 3, parentCode: "17" },
        {
          code: "176",
          name: "Intérêts courus",
          level: 3,
          parentCode: "17",
          subAccounts: [
            { code: "1762", name: "sur dettes de location acquisition/ crédit-bail immobilier", level: 4, parentCode: "176" },
            { code: "1763", name: "sur dettes de location acquisition/ crédit-bail mobilier", level: 4, parentCode: "176" },
            { code: "1764", name: "sur dettes de location acquisition/ location vente", level: 4, parentCode: "176" },
            { code: "1768", name: "sur autres dettes de location acquisition", level: 4, parentCode: "176" }
          ]
        },
        { code: "178", name: "Dettes d'autres contrats de location acquisition", level: 3, parentCode: "17" }
      ]
    },
    {
      code: "18",
      name: "Dettes liées à des participations et comptes de liaison des établissements et sociétés en participation",
      level: 2,
      subAccounts: [
        {
          code: "181",
          name: "Dettes liées à des participations",
          level: 3,
          parentCode: "18",
          subAccounts: [
            { code: "1811", name: "Dettes liées à des participations (groupe)", level: 4, parentCode: "181" },
            { code: "1812", name: "Dettes liées à des participations (hors groupe)", level: 4, parentCode: "181" }
          ]
        },
        { code: "182", name: "Dettes liées à des sociétés en participation", level: 3, parentCode: "18" },
        { code: "183", name: "Intérêts courus sur dettes liées à des participations", level: 3, parentCode: "18" },
        { code: "184", name: "Comptes permanents bloqués des établissements et succursales", level: 3, parentCode: "18" },
        { code: "185", name: "Comptes permanents non bloqués des établissements et succursales", level: 3, parentCode: "18" },
        { code: "186", name: "Comptes de liaison charges", level: 3, parentCode: "18" },
        { code: "187", name: "Comptes de liaison produits", level: 3, parentCode: "18" },
        { code: "188", name: "Comptes de liaison des sociétés en participation", level: 3, parentCode: "18" }
      ]
    },
    {
      code: "19",
      name: "Provisions financières pour risques et charges",
      level: 2,
      subAccounts: [
        { code: "191", name: "Provisions pour litiges", level: 3, parentCode: "19" },
        { code: "192", name: "Provisions pour garanties données aux clients", level: 3, parentCode: "19" },
        { code: "193", name: "Provisions pour pertes sur marchés à achèvement futur", level: 3, parentCode: "19" },
        { code: "194", name: "Provisions pour pertes de change", level: 3, parentCode: "19" },
        { code: "195", name: "Provisions pour impôts", level: 3, parentCode: "19" },
        {
          code: "196",
          name: "Provisions pour pensions et obligations similaires",
          level: 3,
          parentCode: "19",
          subAccounts: [
            { code: "1961", name: "Provisions pour pensions et obligations similaires – engagement de retraite", level: 4, parentCode: "196" },
            { code: "1962", name: "Actif du régime de retraite", level: 4, parentCode: "196" }
          ]
        },
        { code: "197", name: "Provisions pour restructuration", level: 3, parentCode: "19" },
        {
          code: "198",
          name: "Autres provisions pour risques et charges",
          level: 3,
          parentCode: "19",
          subAccounts: [
            { code: "1981", name: "Provisions pour amendes et pénalités", level: 4, parentCode: "198" },
            { code: "1983", name: "Provisions de propre assureur", level: 4, parentCode: "198" },
            { code: "1984", name: "Provisions pour démantèlement et remise en état", level: 4, parentCode: "198" },
            { code: "1985", name: "Provisions de droits à déduction (Chèques cadeau, cartes de fidélité…)", level: 4, parentCode: "198" },
            { code: "1988", name: "Autres provisions pour risques et charges", level: 4, parentCode: "198" }
          ]
        }
      ]
    }
  ]
};
