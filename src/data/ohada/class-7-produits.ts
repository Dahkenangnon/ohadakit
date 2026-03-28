import { OhadaClass } from './types';

/**
 * Class 7 - Comptes de produits des activités ordinaires
 * Operating income accounts
 */
export const class7: OhadaClass = {
  code: "7",
  name: "Comptes de produits des activités ordinaires",
  nameEn: "Operating income",
  accounts: [
    {
      code: "70",
      name: "Ventes",
      level: 2,
      subAccounts: [
        {
          code: "701",
          name: "Ventes de marchandises",
          level: 3,
          parentCode: "70",
          subAccounts: [
            { code: "7011", name: "Dans la Région", level: 4, parentCode: "701" },
            { code: "7012", name: "Hors Région", level: 4, parentCode: "701" },
            { code: "7013", name: "Aux entités du groupe dans la Région", level: 4, parentCode: "701" },
            { code: "7014", name: "Aux entités du groupe hors Région", level: 4, parentCode: "701" },
            { code: "7015", name: "Sur internet", level: 4, parentCode: "701" }
          ]
        },
        {
          code: "702",
          name: "Ventes de produits finis",
          level: 3,
          parentCode: "70",
          subAccounts: [
            { code: "7021", name: "Dans la Région", level: 4, parentCode: "702" },
            { code: "7022", name: "Hors Région", level: 4, parentCode: "702" },
            { code: "7023", name: "Aux entités du groupe dans la Région", level: 4, parentCode: "702" },
            { code: "7024", name: "Aux entités du groupe hors Région", level: 4, parentCode: "702" },
            { code: "7025", name: "Sur internet", level: 4, parentCode: "702" }
          ]
        },
        {
          code: "703",
          name: "Ventes de produits intermédiaires",
          level: 3,
          parentCode: "70",
          subAccounts: [
            { code: "7031", name: "Dans la Région", level: 4, parentCode: "703" },
            { code: "7032", name: "Hors Région", level: 4, parentCode: "703" },
            { code: "7033", name: "Aux entités du groupe dans la Région", level: 4, parentCode: "703" },
            { code: "7034", name: "Aux entités du groupe hors Région", level: 4, parentCode: "703" },
            { code: "7035", name: "Sur internet", level: 4, parentCode: "703" }
          ]
        },
        {
          code: "704",
          name: "Ventes de produits résiduels",
          level: 3,
          parentCode: "70",
          subAccounts: [
            { code: "7041", name: "Dans la Région", level: 4, parentCode: "704" },
            { code: "7042", name: "Hors Région", level: 4, parentCode: "704" },
            { code: "7043", name: "Aux entités du groupe dans la Région", level: 4, parentCode: "704" },
            { code: "7044", name: "Aux entités du groupe hors Région", level: 4, parentCode: "704" },
            { code: "7045", name: "Sur internet", level: 4, parentCode: "704" }
          ]
        },
        {
          code: "705",
          name: "Travaux facturés",
          level: 3,
          parentCode: "70",
          subAccounts: [
            { code: "7051", name: "Dans la Région", level: 4, parentCode: "705" },
            { code: "7052", name: "Hors Région", level: 4, parentCode: "705" },
            { code: "7053", name: "Aux entités du groupe dans la Région", level: 4, parentCode: "705" },
            { code: "7054", name: "Aux entités du groupe hors Région", level: 4, parentCode: "705" },
            { code: "7055", name: "Sur internet", level: 4, parentCode: "705" }
          ]
        },
        {
          code: "706",
          name: "Services vendus",
          level: 3,
          parentCode: "70",
          subAccounts: [
            { code: "7061", name: "Dans la Région", level: 4, parentCode: "706" },
            { code: "7062", name: "Hors Région", level: 4, parentCode: "706" },
            { code: "7063", name: "Aux entités du groupe dans la Région", level: 4, parentCode: "706" },
            { code: "7064", name: "Aux entités du groupe hors Région", level: 4, parentCode: "706" },
            { code: "7065", name: "Sur internet", level: 4, parentCode: "706" }
          ]
        },
        {
          code: "707",
          name: "Produits accessoires",
          level: 3,
          parentCode: "70",
          subAccounts: [
            { code: "7071", name: "Ports, emballages perdus et autres frais facturés", level: 4, parentCode: "707" },
            { code: "7072", name: "Commissions et courtages", level: 4, parentCode: "707" },
            { code: "7073", name: "Locations", level: 4, parentCode: "707" },
            { code: "7074", name: "Bonis sur reprises et cessions d'emballages", level: 4, parentCode: "707" },
            { code: "7075", name: "Mise à disposition de personnel", level: 4, parentCode: "707" },
            { code: "7076", name: "Redevances pour brevets, logiciels, marques et droits similaires", level: 4, parentCode: "707" },
            { code: "7077", name: "Services exploités dans l'intérêt du personnel", level: 4, parentCode: "707" },
            { code: "7078", name: "Autres produits accessoires", level: 4, parentCode: "707" }
          ]
        }
      ]
    },
    {
      code: "71",
      name: "Subventions d'exploitation",
      level: 2,
      subAccounts: [
        { code: "711", name: "Sur produits à l'exportation", level: 3, parentCode: "71" },
        { code: "712", name: "Sur produits à l'importation", level: 3, parentCode: "71" },
        { code: "713", name: "Sur produits de péréquation", level: 3, parentCode: "71" },
        {
          code: "718",
          name: "Autres subventions d'exploitation",
          level: 3,
          parentCode: "71",
          subAccounts: [
            { code: "7181", name: "Versées par l'État et les collectivités publiques", level: 4, parentCode: "718" },
            { code: "7182", name: "Versées par les organismes internationaux", level: 4, parentCode: "718" },
            { code: "7183", name: "Versées par des tiers", level: 4, parentCode: "718" }
          ]
        }
      ]
    },
    {
      code: "72",
      name: "Production immobilisée",
      level: 2,
      subAccounts: [
        { code: "721", name: "Immobilisations incorporelles", level: 3, parentCode: "72" },
        { code: "722", name: "Immobilisations corporelles", level: 3, parentCode: "72" },
        { code: "724", name: "Production auto-consommée", level: 3, parentCode: "72" },
        { code: "726", name: "Immobilisations financières", level: 3, parentCode: "72" }
      ]
    },
    {
      code: "73",
      name: "Variations des stocks de biens et de services produits",
      level: 2,
      subAccounts: [
        {
          code: "734",
          name: "Variations des stocks de produits en cours",
          level: 3,
          parentCode: "73",
          subAccounts: [
            { code: "7341", name: "Produits en cours", level: 4, parentCode: "734" },
            { code: "7342", name: "Travaux en cours", level: 4, parentCode: "734" }
          ]
        },
        {
          code: "735",
          name: "Variations des en-cours de services",
          level: 3,
          parentCode: "73",
          subAccounts: [
            { code: "7351", name: "Études en cours", level: 4, parentCode: "735" },
            { code: "7352", name: "Prestations de services en cours", level: 4, parentCode: "735" }
          ]
        },
        { code: "736", name: "Variations des stocks de produits finis", level: 3, parentCode: "73" },
        {
          code: "737",
          name: "Variations des stocks de produits intermédiaires et résiduels",
          level: 3,
          parentCode: "73",
          subAccounts: [
            { code: "7371", name: "Produits intermédiaires", level: 4, parentCode: "737" },
            { code: "7372", name: "Produits résiduels", level: 4, parentCode: "737" }
          ]
        }
      ]
    },
    {
      code: "75",
      name: "Autres produits",
      level: 2,
      subAccounts: [
        {
          code: "752",
          name: "Quote-part de résultat sur opérations faites en commun",
          level: 3,
          parentCode: "75",
          subAccounts: [
            { code: "7521", name: "Quote-part transférée de pertes (comptabilité du gérant)", level: 4, parentCode: "752" },
            { code: "7525", name: "Bénéfices attribués par transfert (comptabilité des associés non gérants)", level: 4, parentCode: "752" }
          ]
        },

        { code: "754", name: "Produits des cessions courantes d'immobilisations", level: 3, parentCode: "75" },
        {
          code: "758",
          name: "Produits divers",
          level: 3,
          parentCode: "75",
          subAccounts: [
            { code: "7581", name: "Indemnités de fonction et autres rémunérations", level: 4, parentCode: "758" },
            { code: "7582", name: "Indemnités d'assurances reçues", level: 4, parentCode: "758" },
            { code: "7588", name: "Autres produits divers", level: 4, parentCode: "758" }
          ]
        },
        {
          code: "759",
          name: "Reprises de charges provisionnées d'exploitation",
          level: 3,
          parentCode: "75",
          subAccounts: [
            { code: "7591", name: "Sur risques à court terme", level: 4, parentCode: "759" },
            { code: "7593", name: "Sur stocks", level: 4, parentCode: "759" },
            { code: "7594", name: "Sur créances", level: 4, parentCode: "759" },
            { code: "7598", name: "Sur autres charges provisionnées", level: 4, parentCode: "759" }
          ]
        }
      ]
    },
    {
      code: "77",
      name: "Revenus financiers et produits assimilés",
      level: 2,
      subAccounts: [
        {
          code: "771",
          name: "Intérêts de prêts et créances diverses",
          level: 3,
          parentCode: "77",
          subAccounts: [
            { code: "7712", name: "Intérêts de prêts", level: 4, parentCode: "771" },
            { code: "7713", name: "Intérêts sur créances diverses", level: 4, parentCode: "771" }
          ]
        },
        {
          code: "772",
          name: "Revenus de participations et autres créances immobilisées",
          level: 3,
          parentCode: "77",
          subAccounts: [
            { code: "7721", name: "Revenus des titres de participation", level: 4, parentCode: "772" },
            { code: "7722", name: "Revenus des autres titres immobilisés", level: 4, parentCode: "772" }
          ]
        },
        { code: "773", name: "Escomptes obtenus", level: 3, parentCode: "77" },
        {
          code: "774",
          name: "Revenus de placement",
          level: 3,
          parentCode: "77",
          subAccounts: [
            { code: "7745", name: "Revenus des obligations", level: 4, parentCode: "774" },
            { code: "7746", name: "Revenus des titres de placement", level: 4, parentCode: "774" }
          ]
        },
        { code: "775", name: "Intérêts dans loyers de location acquisition", level: 3, parentCode: "77" },
        { code: "776", name: "Gains de change", level: 3, parentCode: "77" },
        { code: "777", name: "Gains sur cessions de titres de placement", level: 3, parentCode: "77" },
        {
          code: "778",
          name: "Gains sur risques financiers",
          level: 3,
          parentCode: "77",
          subAccounts: [
            { code: "7781", name: "Sur rentes viagères", level: 4, parentCode: "778" },
            { code: "7782", name: "Sur opérations financières", level: 4, parentCode: "778" },
            { code: "7784", name: "Sur instruments de trésorerie", level: 4, parentCode: "778" }
          ]
        },
        {
          code: "779",
          name: "Reprises de charges provisionnées financières",
          level: 3,
          parentCode: "77",
          subAccounts: [
            { code: "7791", name: "Sur risques financiers", level: 4, parentCode: "779" },
            { code: "7795", name: "Sur titres de placement", level: 4, parentCode: "779" },
            { code: "7798", name: "Autres charges provisionnées financières", level: 4, parentCode: "779" }
          ]
        }
      ]
    },
    {
      code: "78",
      name: "Transferts de charges",
      level: 2,
      subAccounts: [
        { code: "781", name: "Transferts de charges d'exploitation", level: 3, parentCode: "78" },
        { code: "787", name: "Transferts de charges financières", level: 3, parentCode: "78" }
      ]
    },
    {
      code: "79",
      name: "Reprises de provisions",
      level: 2,
      subAccounts: [
        {
          code: "791",
          name: "Reprises de provisions d'exploitation",
          level: 3,
          parentCode: "79",
          subAccounts: [
            { code: "7911", name: "Pour risques et charges", level: 4, parentCode: "791" },

            { code: "7913", name: "Pour dépréciation des immobilisations incorporelles", level: 4, parentCode: "791" },
            { code: "7914", name: "Pour dépréciation des immobilisations corporelles", level: 4, parentCode: "791" }
          ]
        },
        {
          code: "797",
          name: "Reprises de provisions financières",
          level: 3,
          parentCode: "79",
          subAccounts: [
            { code: "7971", name: "Pour risques et charges", level: 4, parentCode: "797" },
            { code: "7972", name: "Pour dépréciation des immobilisations financières", level: 4, parentCode: "797" }
          ]
        },
        { code: "798", name: "Reprises d'amortissements", level: 3, parentCode: "79" },
        { code: "799", name: "Reprises de subventions d'investissement", level: 3, parentCode: "79" }
      ]
    }
  ]
};
