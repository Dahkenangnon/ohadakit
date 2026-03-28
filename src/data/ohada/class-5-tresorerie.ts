import { OhadaClass } from './types';

/**
 * Class 5 - Comptes de trésorerie
 * Treasury and cash accounts
 */
export const class5: OhadaClass = {
  code: "5",
  name: "Comptes de trésorerie",
  nameEn: "Treasury",
  accounts: [
    {
      code: "50",
      name: "Titres de placement",
      level: 2,
      subAccounts: [
        {
          code: "501",
          name: "Titres du trésor et bons de caisse à court terme",
          level: 3,
          parentCode: "50",
          subAccounts: [
            { code: "5011", name: "Titres du Trésor à court terme", level: 4, parentCode: "501" },
            { code: "5012", name: "Titres d'organismes financiers", level: 4, parentCode: "501" },
            { code: "5013", name: "Bons de caisse à court terme", level: 4, parentCode: "501" },
            { code: "5016", name: "Frais d'acquisition des titres du trésor et bons de caisse", level: 4, parentCode: "501" }
          ]
        },
        {
          code: "502",
          name: "Actions",
          level: 3,
          parentCode: "50",
          subAccounts: [
            { code: "5021", name: "Actions ou parts propres", level: 4, parentCode: "502" },
            { code: "5022", name: "Actions cotées", level: 4, parentCode: "502" },
            { code: "5023", name: "Actions non cotées", level: 4, parentCode: "502" },
            { code: "5024", name: "Actions démembrées (certificats d'investissement, droits de vote)", level: 4, parentCode: "502" },
            { code: "5025", name: "Autres actions", level: 4, parentCode: "502" },
            { code: "5026", name: "Frais d'acquisition des actions", level: 4, parentCode: "502" }
          ]
        },
        {
          code: "503",
          name: "Obligations",
          level: 3,
          parentCode: "50",
          subAccounts: [
            { code: "5031", name: "Obligations émises par la société et rachetées par elle", level: 4, parentCode: "503" },
            { code: "5032", name: "Obligations cotées", level: 4, parentCode: "503" },
            { code: "5033", name: "Obligations non cotées", level: 4, parentCode: "503" },
            { code: "5035", name: "Autres obligations", level: 4, parentCode: "503" },
            { code: "5036", name: "Frais d'acquisition des obligations", level: 4, parentCode: "503" }
          ]
        },
        {
          code: "504",
          name: "Bons de souscription",
          level: 3,
          parentCode: "50",
          subAccounts: [
            { code: "5042", name: "Bons de souscription d'actions", level: 4, parentCode: "504" },
            { code: "5043", name: "Bons de souscription d'obligations", level: 4, parentCode: "504" }
          ]
        },
        { code: "505", name: "Titres négociables hors région", level: 3, parentCode: "50" },
        {
          code: "506",
          name: "Intérêts courus",
          level: 3,
          parentCode: "50",
          subAccounts: [
            { code: "5061", name: "Titres du Trésor et bons de caisse à court terme", level: 4, parentCode: "506" },
            { code: "5062", name: "Actions", level: 4, parentCode: "506" },
            { code: "5063", name: "Obligations", level: 4, parentCode: "506" }
          ]
        },
        { code: "508", name: "Autres valeurs assimilées", level: 3, parentCode: "50" }
      ]
    },
    {
      code: "51",
      name: "Valeurs à encaisser",
      level: 2,
      subAccounts: [
        { code: "511", name: "Effets à encaisser", level: 3, parentCode: "51" },
        { code: "512", name: "Effets à l'encaissement", level: 3, parentCode: "51" },
        { code: "513", name: "Chèques à encaisser", level: 3, parentCode: "51" },
        { code: "514", name: "Chèques à l'encaissement", level: 3, parentCode: "51" },
        { code: "515", name: "Cartes de crédit à encaisser", level: 3, parentCode: "51" },
        {
          code: "518",
          name: "Autres valeurs à l'encaissement",
          level: 3,
          parentCode: "51",
          subAccounts: [
            { code: "5181", name: "Warrants", level: 4, parentCode: "518" },
            { code: "5182", name: "Billets de fonds", level: 4, parentCode: "518" },
            { code: "5185", name: "Chèques de voyage", level: 4, parentCode: "518" },
            { code: "5186", name: "Coupons échus", level: 4, parentCode: "518" },
            { code: "5187", name: "Intérêts échus des obligations", level: 4, parentCode: "518" }
          ]
        }
      ]
    },
    {
      code: "52",
      name: "Banques",
      level: 2,
      subAccounts: [
        {
          code: "521",
          name: "Banques locales",
          level: 3,
          parentCode: "52",
          subAccounts: [
            { code: "5211", name: "Banque X", level: 4, parentCode: "521" },
            { code: "5212", name: "Banque Y", level: 4, parentCode: "521" }
          ]
        },
        { code: "522", name: "Banques autres États région", level: 3, parentCode: "52" },
        { code: "523", name: "Banques autres États zone monétaire", level: 3, parentCode: "52" },
        { code: "524", name: "Banques hors zone monétaire", level: 3, parentCode: "52" },
        { code: "525", name: "Banques, dépôts à terme", level: 3, parentCode: "52" },
        {
          code: "526",
          name: "Banques, intérêts courus",
          level: 3,
          parentCode: "52",
          subAccounts: [
            { code: "5261", name: "Banques, intérêts courus, charges à payer", level: 4, parentCode: "526" },
            { code: "5267", name: "Banques, intérêts courus, produits à recevoir", level: 4, parentCode: "526" }
          ]
        }
      ]
    },
    {
      code: "53",
      name: "Établissements financiers et assimilés",
      level: 2,
      subAccounts: [
        { code: "531", name: "Chèques postaux", level: 3, parentCode: "53" },
        { code: "532", name: "Trésor", level: 3, parentCode: "53" },
        { code: "533", name: "Sociétés de gestion et d'intermédiation (SGI)", level: 3, parentCode: "53" },
        {
          code: "536",
          name: "Etablissements financiers, intérêts courus",
          level: 3,
          parentCode: "53",
          subAccounts: [
            { code: "5361", name: "Etablissements financiers, intérêts courus, charges à payer", level: 4, parentCode: "536" },
            { code: "5367", name: "Etablissements financiers, intérêts courus produits à recevoir", level: 4, parentCode: "536" }
          ]
        },
        { code: "538", name: "autres organismes financiers", level: 3, parentCode: "53" }
      ]
    },
    {
      code: "54",
      name: "Instruments de trésorerie",
      level: 2,
      subAccounts: [
        { code: "541", name: "Options de taux d'intérêt", level: 3, parentCode: "54" },
        { code: "542", name: "Options de taux de change", level: 3, parentCode: "54" },
        { code: "543", name: "Options de taux boursiers", level: 3, parentCode: "54" },
        { code: "544", name: "Instruments de marchés à terme", level: 3, parentCode: "54" },
        { code: "545", name: "Avoirs d'or et autres métaux précieux", level: 3, parentCode: "54" }
      ]
    },
    {
      code: "55",
      name: "Instruments de monnaie électronique",
      level: 2,
      subAccounts: [
        { code: "551", name: "Monnaie électronique - Carte carburant", level: 3, parentCode: "55" },
        { code: "552", name: "Monnaie électronique - Téléphone portable", level: 3, parentCode: "55" },
        { code: "553", name: "Monnaie électronique - Carte péage", level: 3, parentCode: "55" },
        { code: "554", name: "Porte-monnaie électronique", level: 3, parentCode: "55" },
        { code: "558", name: "Autres instruments de monnaie électronique", level: 3, parentCode: "55" }
      ]
    },
    {
      code: "56",
      name: "Banques, crédits de trésorerie et d'escompte",
      level: 2,
      subAccounts: [
        { code: "561", name: "Crédits de trésorerie", level: 3, parentCode: "56" },
        { code: "564", name: "Escompte de crédits de campagne", level: 3, parentCode: "56" },
        { code: "565", name: "Escompte de crédits ordinaires", level: 3, parentCode: "56" },
        { code: "566", name: "Banques, crédits de trésorerie, intérêts courus", level: 3, parentCode: "56" }
      ]
    },
    {
      code: "57",
      name: "Caisse",
      level: 2,
      subAccounts: [
        {
          code: "571",
          name: "Caisse siège social",
          level: 3,
          parentCode: "57",
          subAccounts: [
            { code: "5711", name: "en unités monétaires légales", level: 4, parentCode: "571" },
            { code: "5712", name: "en devises", level: 4, parentCode: "571" }
          ]
        },
        {
          code: "572",
          name: "Caisse succursale A",
          level: 3,
          parentCode: "57",
          subAccounts: [
            { code: "5721", name: "en unités monétaires légales", level: 4, parentCode: "572" },
            { code: "5722", name: "en devises", level: 4, parentCode: "572" }
          ]
        },
        {
          code: "573",
          name: "Caisse succursale B",
          level: 3,
          parentCode: "57",
          subAccounts: [
            { code: "5731", name: "en unités monétaires légales", level: 4, parentCode: "573" },
            { code: "5732", name: "en devises", level: 4, parentCode: "573" }
          ]
        }
      ]
    },
    {
      code: "58",
      name: "Régies d'avances, accréditifs et virements internes",
      level: 2,
      subAccounts: [
        { code: "581", name: "Régies d'avance", level: 3, parentCode: "58" },
        { code: "582", name: "Accréditifs", level: 3, parentCode: "58" },
        { code: "585", name: "Virements de fonds", level: 3, parentCode: "58" },
        { code: "588", name: "Autres virements internes", level: 3, parentCode: "58" }
      ]
    },
    {
      code: "59",
      name: "Dépréciations et risques provisionnés",
      level: 2,
      subAccounts: [
        { code: "590", name: "Dépréciations des titres de placement", level: 3, parentCode: "59" },
        { code: "591", name: "Dépréciations des titres et valeurs à encaisser", level: 3, parentCode: "59" },
        { code: "592", name: "Dépréciations des comptes banques", level: 3, parentCode: "59" },
        { code: "593", name: "Dépréciations des comptes établissements financiers et assimilés", level: 3, parentCode: "59" },
        { code: "594", name: "Dépréciations des comptes d'instruments de trésorerie", level: 3, parentCode: "59" },
        { code: "599", name: "Risques provisionnés à caractère financier", level: 3, parentCode: "59" }
      ]
    }
  ]
};
