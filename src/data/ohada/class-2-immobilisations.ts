import { OhadaClass } from './types';

/**
 * Class 2 - Comptes d'actif immobilisé
 * Fixed assets accounts
 */
export const class2: OhadaClass = {
  code: "2",
  name: "Comptes d'actif immobilisé",
  nameEn: "Fixed assets",
  accounts: [
    {
      code: "21",
      name: "Immobilisations incorporelles",
      level: 2,
      subAccounts: [
        { code: "211", name: "Frais de développement", level: 3, parentCode: "21" },
        {
          code: "212",
          name: "Brevets, licences, concessions et droits similaires",
          level: 3,
          parentCode: "21",
          subAccounts: [
            { code: "2121", name: "Brevets", level: 4, parentCode: "212" },
            { code: "2122", name: "Licences", level: 4, parentCode: "212" },
            { code: "2123", name: "Concessions de service public", level: 4, parentCode: "212" },
            { code: "2128", name: "Autres concessions et droits similaires", level: 4, parentCode: "212" }
          ]
        },
        {
          code: "213",
          name: "Logiciels et sites internet",
          level: 3,
          parentCode: "21",
          subAccounts: [
            { code: "2131", name: "Logiciels", level: 4, parentCode: "213" },
            { code: "2132", name: "Sites internet", level: 4, parentCode: "213" }
          ]
        },
        { code: "214", name: "Marques", level: 3, parentCode: "21" },
        { code: "215", name: "Fonds commercial", level: 3, parentCode: "21" },
        { code: "216", name: "Droit au bail", level: 3, parentCode: "21" },
        { code: "217", name: "Investissements de création", level: 3, parentCode: "21" },
        {
          code: "218",
          name: "Autres droits et valeurs incorporels",
          level: 3,
          parentCode: "21",
          subAccounts: [
            { code: "2181", name: "Frais de prospection et d'évaluation de ressources minérales", level: 4, parentCode: "218" },
            { code: "2182", name: "Coûts d'obtention du contrat", level: 4, parentCode: "218" },
            { code: "2183", name: "Fichiers clients, notices, titres de journaux et magazines", level: 4, parentCode: "218" },
            { code: "2184", name: "Coûts des franchises", level: 4, parentCode: "218" },
            { code: "2188", name: "Divers droits et valeurs incorporelles", level: 4, parentCode: "218" }
          ]
        },
        {
          code: "219",
          name: "Immobilisations incorporelles en cours",
          level: 3,
          parentCode: "21",
          subAccounts: [
            { code: "2191", name: "Frais de développement", level: 4, parentCode: "219" },
            { code: "2193", name: "Logiciels", level: 4, parentCode: "219" },
            { code: "2198", name: "Autres droits et valeurs incorporels", level: 4, parentCode: "219" }
          ]
        }
      ]
    },
    {
      code: "22",
      name: "Terrains",
      level: 2,
      subAccounts: [
        {
          code: "221",
          name: "Terrains agricoles et forestiers",
          level: 3,
          parentCode: "22",
          subAccounts: [
            { code: "2211", name: "Terrains d'exploitation agricole", level: 4, parentCode: "221" },
            { code: "2212", name: "Terrains d'exploitation forestière", level: 4, parentCode: "221" },
            { code: "2218", name: "Autres terrains", level: 4, parentCode: "221" }
          ]
        },
        {
          code: "222",
          name: "Terrains nus",
          level: 3,
          parentCode: "22",
          subAccounts: [
            { code: "2221", name: "Terrains à bâtir", level: 4, parentCode: "222" },
            { code: "2228", name: "Autres terrains nus", level: 4, parentCode: "222" }
          ]
        },
        {
          code: "223",
          name: "Terrains bâtis",
          level: 3,
          parentCode: "22",
          subAccounts: [
            { code: "2231", name: "pour bâtiments industriels et agricoles", level: 4, parentCode: "223" },
            { code: "2232", name: "pour bâtiments administratifs et commerciaux", level: 4, parentCode: "223" },
            { code: "2234", name: "pour bâtiments affectés aux autres opérations professionnelles", level: 4, parentCode: "223" },
            { code: "2235", name: "pour bâtiments affectés aux autres opérations non professionnelles", level: 4, parentCode: "223" },
            { code: "2238", name: "Autres terrains bâtis", level: 4, parentCode: "223" }
          ]
        },
        {
          code: "224",
          name: "Travaux de mise en valeur des terrains",
          level: 3,
          parentCode: "22",
          subAccounts: [
            { code: "2241", name: "Plantations d'arbres et d'arbustes", level: 4, parentCode: "224" },
            { code: "2245", name: "Améliorations du fonds", level: 4, parentCode: "224" },
            { code: "2248", name: "Autres travaux", level: 4, parentCode: "224" }
          ]
        },
        {
          code: "225",
          name: "Terrains carrières tréfonds",
          level: 3,
          parentCode: "22",
          subAccounts: [
            { code: "2251", name: "Carrières", level: 4, parentCode: "225" }
          ]
        },
        {
          code: "226",
          name: "Terrains aménagés",
          level: 3,
          parentCode: "22",
          subAccounts: [
            { code: "2261", name: "Parkings", level: 4, parentCode: "226" }
          ]
        },
        { code: "227", name: "Terrains mis en concession", level: 3, parentCode: "22" },
        {
          code: "228",
          name: "Autres terrains",
          level: 3,
          parentCode: "22",
          subAccounts: [
            { code: "2281", name: "Terrains des immeubles de placement", level: 4, parentCode: "228" },
            { code: "2285", name: "Terrains des logements affectés au personnel", level: 4, parentCode: "228" },
            { code: "2286", name: "Terrain location-acquisition", level: 4, parentCode: "228" },
            { code: "2288", name: "Autres", level: 4, parentCode: "228" }
          ]
        },
        {
          code: "229",
          name: "Aménagements de terrains en cours",
          level: 3,
          parentCode: "22",
          subAccounts: [
            { code: "2291", name: "Terrains agricoles et forestiers", level: 4, parentCode: "229" },
            { code: "2292", name: "Terrains nus", level: 4, parentCode: "229" },
            { code: "2295", name: "Terrains de carrières – tréfonds", level: 4, parentCode: "229" },
            { code: "2298", name: "Autres terrains", level: 4, parentCode: "229" }
          ]
        }
      ]
    },
    {
      code: "23",
      name: "Bâtiments, installations techniques et agencements",
      level: 2,
      subAccounts: [
        {
          code: "231",
          name: "Bâtiments industriels, agricoles, administratifs et commerciaux sur sol propre",
          level: 3,
          parentCode: "23",
          subAccounts: [
            { code: "2311", name: "Bâtiments industriels", level: 4, parentCode: "231" },
            { code: "2312", name: "Bâtiments agricoles", level: 4, parentCode: "231" },
            { code: "2313", name: "Bâtiments administratifs et commerciaux", level: 4, parentCode: "231" },
            { code: "2314", name: "Bâtiments affectés au logement du personnel", level: 4, parentCode: "231" },
            { code: "2315", name: "Immeubles de placement", level: 4, parentCode: "231" },
            { code: "2316", name: "Bâtiments de location acquisition", level: 4, parentCode: "231" }
          ]
        },
        {
          code: "232",
          name: "Bâtiments industriels, agricoles, administratifs et commerciaux sur sol d'autrui",
          level: 3,
          parentCode: "23",
          subAccounts: [
            { code: "2321", name: "Bâtiments industriels", level: 4, parentCode: "232" },
            { code: "2322", name: "Bâtiments agricoles", level: 4, parentCode: "232" },
            { code: "2323", name: "Bâtiments administratifs et commerciaux", level: 4, parentCode: "232" },
            { code: "2324", name: "Bâtiments affectés au logement du personnel", level: 4, parentCode: "232" },
            { code: "2325", name: "Immeubles de placement", level: 4, parentCode: "232" },
            { code: "2326", name: "Bâtiment de location-acquisition", level: 4, parentCode: "232" }
          ]
        },
        {
          code: "233",
          name: "Ouvrages d'infrastructure",
          level: 3,
          parentCode: "23",
          subAccounts: [
            { code: "2331", name: "Voies de terre", level: 4, parentCode: "233" },
            { code: "2332", name: "Voies de fer", level: 4, parentCode: "233" },
            { code: "2333", name: "Voies d'eau", level: 4, parentCode: "233" },
            { code: "2334", name: "Barrages, Digues", level: 4, parentCode: "233" },
            { code: "2335", name: "Pistes d'aérodrome", level: 4, parentCode: "233" },
            { code: "2338", name: "Autres", level: 4, parentCode: "233" }
          ]
        },
        {
          code: "234",
          name: "Installations techniques",
          level: 3,
          parentCode: "23",
          subAccounts: [
            { code: "2341", name: "Installations complexes spécialisées sur sol propre", level: 4, parentCode: "234" },
            { code: "2342", name: "Installations complexes spécialisées sur sol d'autrui", level: 4, parentCode: "234" },
            { code: "2343", name: "Installations à caractère spécifique sur sol propre", level: 4, parentCode: "234" },
            { code: "2344", name: "Installations à caractère spécifique sur sol d'autrui", level: 4, parentCode: "234" },
            { code: "2345", name: "Aménagements et agencements des bâtiments", level: 4, parentCode: "234" }
          ]
        },
        {
          code: "235",
          name: "Aménagements de bureaux",
          level: 3,
          parentCode: "23",
          subAccounts: [
            { code: "2351", name: "Installations générales", level: 4, parentCode: "235" },
            { code: "2358", name: "Autres", level: 4, parentCode: "235" }
          ]
        },
        { code: "237", name: "Bâtiments industriels, agricoles et commerciaux mis en concession", level: 3, parentCode: "23" },
        { code: "238", name: "Autres installations et agencements", level: 3, parentCode: "23" },
        {
          code: "239",
          name: "Bâtiments et installations en cours",
          level: 3,
          parentCode: "23",
          subAccounts: [
            { code: "2391", name: "Bâtiments en cours", level: 4, parentCode: "239" },
            { code: "2392", name: "Installations en cours", level: 4, parentCode: "239" },
            { code: "2393", name: "Ouvrages d'infrastructure en cours", level: 4, parentCode: "239" },
            { code: "2394", name: "Aménagements de bureaux en cours", level: 4, parentCode: "239" },
            { code: "2395", name: "Aménagements et agencements", level: 4, parentCode: "239" },
            { code: "2398", name: "Autres installations en cours", level: 4, parentCode: "239" }
          ]
        }
      ]
    },
    {
      code: "24",
      name: "Matériel, Mobilier et Actifs biologiques",
      level: 2,
      subAccounts: [
        {
          code: "241",
          name: "Matériel et outillage industriel et commercial",
          level: 3,
          parentCode: "24",
          subAccounts: [
            { code: "2411", name: "Matériel industriel", level: 4, parentCode: "241" },
            { code: "2412", name: "Outillage industriel", level: 4, parentCode: "241" },
            { code: "2413", name: "Matériel commercial", level: 4, parentCode: "241" },
            { code: "2414", name: "Outillage commercial", level: 4, parentCode: "241" },
            { code: "2416", name: "Matériel et outillage de location acquisition", level: 4, parentCode: "241" }
          ]
        },
        {
          code: "242",
          name: "Matériel et outillage agricole",
          level: 3,
          parentCode: "24",
          subAccounts: [
            { code: "2421", name: "Matériel agricole", level: 4, parentCode: "242" },
            { code: "2422", name: "Outillage agricole", level: 4, parentCode: "242" },
            { code: "2426", name: "Matériel et outillage agricole de location – acquisition", level: 4, parentCode: "242" }
          ]
        },
        { code: "243", name: "Matériel d'emballage récupérable et identifiable", level: 3, parentCode: "24" },
        {
          code: "244",
          name: "Matériel et mobilier",
          level: 3,
          parentCode: "24",
          subAccounts: [
            { code: "2441", name: "Matériel de bureau", level: 4, parentCode: "244" },
            { code: "2442", name: "Matériel informatique", level: 4, parentCode: "244" },
            { code: "2443", name: "Matériel bureautique", level: 4, parentCode: "244" },
            { code: "2444", name: "Mobilier de bureau", level: 4, parentCode: "244" },
            { code: "2446", name: "Matériel et mobilier de location- acquisition", level: 4, parentCode: "244" },
            { code: "2447", name: "Matériel et mobilier des logements affectés au personnel", level: 4, parentCode: "244" }
          ]
        },
        {
          code: "245",
          name: "Matériel de transport",
          level: 3,
          parentCode: "24",
          subAccounts: [
            { code: "2451", name: "Matériel automobile", level: 4, parentCode: "245" },
            { code: "2452", name: "Matériel ferroviaire", level: 4, parentCode: "245" },
            { code: "2453", name: "Matériel fluvial, lagunaire", level: 4, parentCode: "245" },
            { code: "2454", name: "Matériel naval", level: 4, parentCode: "245" },
            { code: "2455", name: "Matériel aérien", level: 4, parentCode: "245" },
            { code: "2456", name: "Matériel de transport de location-acquisition", level: 4, parentCode: "245" },
            { code: "2457", name: "Matériel hippomobile", level: 4, parentCode: "245" },
            { code: "2458", name: "Autres (vélo, mobylette, moto)", level: 4, parentCode: "245" }
          ]
        },
        {
          code: "246",
          name: "Actifs biologiques",
          level: 3,
          parentCode: "24",
          subAccounts: [
            { code: "2461", name: "Cheptel, animaux de trait", level: 4, parentCode: "246" },
            { code: "2462", name: "Cheptel, animaux reproducteurs", level: 4, parentCode: "246" },
            { code: "2463", name: "Animaux de garde", level: 4, parentCode: "246" },
            { code: "2465", name: "Plantations agricoles", level: 4, parentCode: "246" },
            { code: "2468", name: "Autres", level: 4, parentCode: "246" }
          ]
        },
        {
          code: "247",
          name: "Agencements, aménagements du matériel et actifs biologiques",
          level: 3,
          parentCode: "24",
          subAccounts: [
            { code: "2471", name: "Agencements et aménagements du matériel", level: 4, parentCode: "247" },
            { code: "2472", name: "Agencements et aménagements des actifs biologiques", level: 4, parentCode: "247" },
            { code: "2478", name: "Autres agencements et aménagements", level: 4, parentCode: "247" }
          ]
        },
        {
          code: "248",
          name: "Autres matériels et mobiliers",
          level: 3,
          parentCode: "24",
          subAccounts: [
            { code: "2481", name: "Collections et œuvres d'art", level: 4, parentCode: "248" },
            { code: "2488", name: "Autres matériels et mobiliers", level: 4, parentCode: "248" }
          ]
        },
        {
          code: "249",
          name: "Matériel et actifs biologiques en cours",
          level: 3,
          parentCode: "24",
          subAccounts: [
            { code: "2491", name: "Matériel et outillage industriel et commercial", level: 4, parentCode: "249" },
            { code: "2492", name: "Matériel et outillage agricole", level: 4, parentCode: "249" },
            { code: "2493", name: "Matériel d'emballage récupérable et identifiable", level: 4, parentCode: "249" },
            { code: "2494", name: "Matériel et mobilier de bureau", level: 4, parentCode: "249" },
            { code: "2495", name: "Matériel de transport", level: 4, parentCode: "249" },
            { code: "2496", name: "Actifs biologiques", level: 4, parentCode: "249" },
            { code: "2497", name: "Agencements et aménagements du matériel et des actifs biologiques", level: 4, parentCode: "249" },
            { code: "2498", name: "Autres matériels", level: 4, parentCode: "249" }
          ]
        }
      ]
    },
    {
      code: "25",
      name: "Avances et acomptes versés sur immobilisations",
      level: 2,
      subAccounts: [
        { code: "251", name: "Avances et acomptes versés sur immobilisations incorporelles", level: 3, parentCode: "25" },
        { code: "252", name: "Avances et acomptes versés sur immobilisations corporelles", level: 3, parentCode: "25" }
      ]
    },
    {
      code: "26",
      name: "Titres de participation",
      level: 2,
      subAccounts: [
        { code: "261", name: "Titres de participation dans des sociétés sous contrôle exclusif", level: 3, parentCode: "26" },
        { code: "262", name: "Titres de participation dans des sociétés sous contrôle conjoint", level: 3, parentCode: "26" },
        { code: "263", name: "Titres de participation dans des sociétés conférant une influence notable", level: 3, parentCode: "26" },
        { code: "265", name: "Participations dans des organismes professionnels", level: 3, parentCode: "26" },
        { code: "266", name: "Parts dans des groupements d'intérêt économique (G.I.E.)", level: 3, parentCode: "26" },
        { code: "268", name: "Autres titres de participation", level: 3, parentCode: "26" }
      ]
    },
    {
      code: "27",
      name: "Autres immobilisations financières",
      level: 2,
      subAccounts: [
        {
          code: "271",
          name: "Prêts et créances",
          level: 3,
          parentCode: "27",
          subAccounts: [
            { code: "2711", name: "Prêts participatifs", level: 4, parentCode: "271" },
            { code: "2712", name: "Prêts aux associés", level: 4, parentCode: "271" },
            { code: "2713", name: "Billets de fonds", level: 4, parentCode: "271" },
            { code: "2714", name: "Créances de location financement", level: 4, parentCode: "271" },
            { code: "2715", name: "Titres prêtés", level: 4, parentCode: "271" },
            { code: "2718", name: "Autres prêts", level: 4, parentCode: "271" }
          ]
        },
        {
          code: "272",
          name: "Prêts au personnel",
          level: 3,
          parentCode: "27",
          subAccounts: [
            { code: "2721", name: "Prêts immobiliers", level: 4, parentCode: "272" },
            { code: "2722", name: "Prêts mobiliers et d'installation", level: 4, parentCode: "272" },
            { code: "2728", name: "Autres prêts (frais d'études)", level: 4, parentCode: "272" }
          ]
        },
        {
          code: "273",
          name: "Créances sur l'État",
          level: 3,
          parentCode: "27",
          subAccounts: [
            { code: "2731", name: "Retenues de garantie", level: 4, parentCode: "273" },
            { code: "2733", name: "Fonds réglementé", level: 4, parentCode: "273" },
            { code: "2734", name: "Créances sur le concédant", level: 4, parentCode: "273" },
            { code: "2738", name: "Autres", level: 4, parentCode: "273" }
          ]
        },
        {
          code: "274",
          name: "Titres immobilisés",
          level: 3,
          parentCode: "27",
          subAccounts: [
            { code: "2741", name: "Titres immobilisés de l'activité de portefeuille (T.I.A.P.)", level: 4, parentCode: "274" },
            { code: "2742", name: "Titres participatifs", level: 4, parentCode: "274" },
            { code: "2743", name: "Certificats d'investissement", level: 4, parentCode: "274" },
            { code: "2744", name: "Parts de fonds commun de placement (F.C.P.)", level: 4, parentCode: "274" },
            { code: "2745", name: "Obligations", level: 4, parentCode: "274" },
            { code: "2746", name: "Actions ou parts propres", level: 4, parentCode: "274" },
            { code: "2748", name: "Autres titres immobilisés", level: 4, parentCode: "274" }
          ]
        },
        {
          code: "275",
          name: "Dépôts et cautionnements versés",
          level: 3,
          parentCode: "27",
          subAccounts: [
            { code: "2751", name: "Dépôts pour loyers d'avance", level: 4, parentCode: "275" },
            { code: "2752", name: "Dépôts pour l'électricité", level: 4, parentCode: "275" },
            { code: "2753", name: "Dépôts pour l'eau", level: 4, parentCode: "275" },
            { code: "2754", name: "Dépôts pour le gaz", level: 4, parentCode: "275" },
            { code: "2755", name: "Dépôts pour le téléphone, le télex, la télécopie", level: 4, parentCode: "275" },
            { code: "2756", name: "Cautionnements sur marchés publics", level: 4, parentCode: "275" },
            { code: "2757", name: "Cautionnements sur autres opérations", level: 4, parentCode: "275" },
            { code: "2758", name: "Autres dépôts et cautionnements", level: 4, parentCode: "275" }
          ]
        },
        {
          code: "276",
          name: "Intérêts courus",
          level: 3,
          parentCode: "27",
          subAccounts: [
            { code: "2761", name: "Prêts et créances non commerciales", level: 4, parentCode: "276" },
            { code: "2762", name: "Prêts au personnel", level: 4, parentCode: "276" },
            { code: "2763", name: "Créances sur l'État", level: 4, parentCode: "276" },
            { code: "2764", name: "Titres immobilisés", level: 4, parentCode: "276" },
            { code: "2765", name: "Dépôts et cautionnements versés", level: 4, parentCode: "276" },
            { code: "2766", name: "Créances de location financement", level: 4, parentCode: "276" },
            { code: "2767", name: "Créances rattachées à des participations", level: 4, parentCode: "276" },
            { code: "2768", name: "Immobilisations financières diverses", level: 4, parentCode: "276" }
          ]
        },
        {
          code: "277",
          name: "Créances rattachées à des participations et avances à des G.I.E.",
          level: 3,
          parentCode: "27",
          subAccounts: [
            { code: "2771", name: "Créances rattachées à des participations (groupe)", level: 4, parentCode: "277" },
            { code: "2772", name: "Créances rattachées à des participations (hors groupe)", level: 4, parentCode: "277" },
            { code: "2773", name: "Créances rattachées à des sociétés en participation", level: 4, parentCode: "277" },
            { code: "2774", name: "Avances à des groupements d'intérêt économique (G.I.E.)", level: 4, parentCode: "277" }
          ]
        },
        {
          code: "278",
          name: "Immobilisations financières diverses",
          level: 3,
          parentCode: "27",
          subAccounts: [
            { code: "2781", name: "Créances diverses groupe", level: 4, parentCode: "278" },
            { code: "2782", name: "Créances diverses hors groupe", level: 4, parentCode: "278" },
            { code: "2784", name: "Banques dépôt à terme", level: 4, parentCode: "278" },
            { code: "2785", name: "Or et métaux précieux", level: 4, parentCode: "278" },
            { code: "2788", name: "Autres immobilisations financières", level: 4, parentCode: "278" }
          ]
        }
      ]
    },
    {
      code: "28",
      name: "Amortissements",
      level: 2,
      subAccounts: [
        {
          code: "281",
          name: "Amortissements des immobilisations incorporelles",
          level: 3,
          parentCode: "28",
          subAccounts: [
            { code: "2811", name: "Amortissements des frais de développement", level: 4, parentCode: "281" },
            { code: "2812", name: "Amortissements des brevets, licences, concessions et droits similaires", level: 4, parentCode: "281" },
            { code: "2813", name: "Amortissements des logiciels et sites internet", level: 4, parentCode: "281" },
            { code: "2814", name: "Amortissements des marques", level: 4, parentCode: "281" },
            { code: "2815", name: "Amortissements du fonds commercial", level: 4, parentCode: "281" },
            { code: "2816", name: "Amortissements du droit au bail", level: 4, parentCode: "281" },
            { code: "2817", name: "Amortissements des investissements de création", level: 4, parentCode: "281" },
            { code: "2818", name: "Amortissements des autres droits et valeurs incorporels", level: 4, parentCode: "281" }
          ]
        },
        {
          code: "282",
          name: "Amortissements des terrains",
          level: 3,
          parentCode: "28",
          subAccounts: [
            { code: "2824", name: "Amortissements des travaux de mise en valeur des terrains", level: 4, parentCode: "282" }
          ]
        },
        {
          code: "283",
          name: "Amortissements des bâtiments, installations techniques et agencements",
          level: 3,
          parentCode: "28",
          subAccounts: [
            { code: "2831", name: "Amortissements des bâtiments industriels, agricoles, administratifs et commerciaux sur sol propre", level: 4, parentCode: "283" },
            { code: "2832", name: "Amortissements des bâtiments industriels, agricoles, administratifs et commerciaux sur sol d'autrui", level: 4, parentCode: "283" },
            { code: "2833", name: "Amortissements des ouvrages d'infrastructure", level: 4, parentCode: "283" },
            { code: "2834", name: "Amortissements des aménagements, agencements et installations techniques", level: 4, parentCode: "283" },
            { code: "2835", name: "Amortissements des aménagements de bureaux", level: 4, parentCode: "283" },
            { code: "2837", name: "Amortissements de bâtiments industriels, agricoles et commerciaux mis en concession", level: 4, parentCode: "283" },
            { code: "2838", name: "Amortissements des autres installations et agencements", level: 4, parentCode: "283" }
          ]
        },
        {
          code: "284",
          name: "Amortissements du matériel",
          level: 3,
          parentCode: "28",
          subAccounts: [
            { code: "2841", name: "Amortissements du matériel et outillage industriel et commercial", level: 4, parentCode: "284" },
            { code: "2842", name: "Amortissements du matériel et outillage agricole", level: 4, parentCode: "284" },
            { code: "2843", name: "Amortissements du matériel d'emballage récupérable et identifiable", level: 4, parentCode: "284" },
            { code: "2844", name: "Amortissements du matériel et mobilier", level: 4, parentCode: "284" },
            { code: "2845", name: "Amortissements du matériel de transport", level: 4, parentCode: "284" },
            { code: "2846", name: "Amortissements des actifs biologiques", level: 4, parentCode: "284" },
            { code: "2847", name: "Amortissements des agencements et aménagements du matériel et des actifs biologiques", level: 4, parentCode: "284" },
            { code: "2848", name: "Amortissements des autres matériels", level: 4, parentCode: "284" }
          ]
        }
      ]
    },
    {
      code: "29",
      name: "Dépréciations",
      level: 2,
      subAccounts: [
        {
          code: "291",
          name: "Dépréciations des immobilisations incorporelles",
          level: 3,
          parentCode: "29",
          subAccounts: [
            { code: "2911", name: "Dépréciations des frais de développement", level: 4, parentCode: "291" },
            { code: "2912", name: "Dépréciations des brevets, licences, marques concessions et droits similaires", level: 4, parentCode: "291" },
            { code: "2913", name: "Dépréciations des logiciels et sites internet", level: 4, parentCode: "291" },
            { code: "2914", name: "Dépréciations des marques", level: 4, parentCode: "291" },
            { code: "2915", name: "Dépréciations du fonds commercial", level: 4, parentCode: "291" },
            { code: "2916", name: "Dépréciations du droit au bail", level: 4, parentCode: "291" },
            { code: "2917", name: "Dépréciations des investissements de création", level: 4, parentCode: "291" },
            { code: "2918", name: "Dépréciations des autres droits et valeurs incorporels", level: 4, parentCode: "291" },
            { code: "2919", name: "Dépréciations des immobilisations incorporelles en cours", level: 4, parentCode: "291" }
          ]
        },
        {
          code: "292",
          name: "Dépréciations des terrains",
          level: 3,
          parentCode: "29",
          subAccounts: [
            { code: "2921", name: "Dépréciations des terrains agricoles et forestiers", level: 4, parentCode: "292" },
            { code: "2922", name: "Dépréciations des terrains nus", level: 4, parentCode: "292" },
            { code: "2923", name: "Dépréciations des terrains bâtis", level: 4, parentCode: "292" },
            { code: "2924", name: "Dépréciations des travaux de mise en valeur des terrains", level: 4, parentCode: "292" },
            { code: "2925", name: "Dépréciations des terrains de gisement", level: 4, parentCode: "292" },
            { code: "2926", name: "Dépréciations des terrains aménagés", level: 4, parentCode: "292" },
            { code: "2927", name: "Dépréciations des terrains mis en concession", level: 4, parentCode: "292" },
            { code: "2928", name: "Dépréciations des autres terrains", level: 4, parentCode: "292" },
            { code: "2929", name: "Dépréciations des aménagements de terrains en cours", level: 4, parentCode: "292" }
          ]
        },
        {
          code: "293",
          name: "Dépréciations des bâtiments, installations techniques et agencements",
          level: 3,
          parentCode: "29",
          subAccounts: [
            { code: "2931", name: "Dépréciations des bâtiments industriels, agricoles, administratifs et commerciaux sur sol propre", level: 4, parentCode: "293" },
            { code: "2932", name: "Dépréciations des bâtiments industriels, agricoles, administratifs et commerciaux sur sol d'autrui", level: 4, parentCode: "293" },
            { code: "2933", name: "Dépréciations des ouvrages d'infrastructures", level: 4, parentCode: "293" },
            { code: "2934", name: "Dépréciations des aménagements, agencements et installations techniques", level: 4, parentCode: "293" },
            { code: "2935", name: "Dépréciations des aménagements de bureaux", level: 4, parentCode: "293" },
            { code: "2937", name: "Dépréciations des bâtiments industriels, agricoles et commerciaux mis en concession", level: 4, parentCode: "293" },
            { code: "2938", name: "Dépréciations des autres installations et agencements", level: 4, parentCode: "293" },
            { code: "2939", name: "Dépréciations des bâtiments et installations en cours", level: 4, parentCode: "293" }
          ]
        },
        {
          code: "294",
          name: "Dépréciations du matériel, du mobilier et de l'actif biologique",
          level: 3,
          parentCode: "29",
          subAccounts: [
            { code: "2941", name: "Dépréciations du matériel et outillage industriel et commercial", level: 4, parentCode: "294" },
            { code: "2942", name: "Dépréciations du matériel et outillage agricole", level: 4, parentCode: "294" },
            { code: "2943", name: "Dépréciations du matériel d'emballage récupérable et identifiable", level: 4, parentCode: "294" },
            { code: "2944", name: "Dépréciations du matériel et mobilier", level: 4, parentCode: "294" },
            { code: "2945", name: "Dépréciations du matériel de transport", level: 4, parentCode: "294" },
            { code: "2946", name: "Dépréciations des actifs biologiques", level: 4, parentCode: "294" },
            { code: "2947", name: "Dépréciations des agencements et aménagements du matériel et des actifs biologiques", level: 4, parentCode: "294" },
            { code: "2948", name: "Dépréciations des autres matériels", level: 4, parentCode: "294" },
            { code: "2949", name: "Dépréciations du matériel en cours", level: 4, parentCode: "294" }
          ]
        },
        {
          code: "295",
          name: "Dépréciations des avances et acomptes versés sur immobilisations",
          level: 3,
          parentCode: "29",
          subAccounts: [
            { code: "2951", name: "Dépréciations des avances et acomptes versés sur immobilisations incorporelles", level: 4, parentCode: "295" },
            { code: "2952", name: "Dépréciations des avances et acomptes versés sur immobilisations corporelles", level: 4, parentCode: "295" }
          ]
        },
        {
          code: "296",
          name: "Dépréciations des titres de participation",
          level: 3,
          parentCode: "29",
          subAccounts: [
            { code: "2961", name: "Dépréciations des titres de participation dans des sociétés sous contrôle exclusif", level: 4, parentCode: "296" },
            { code: "2962", name: "Dépréciations des titres de participation dans les sociétés sous contrôle conjoint", level: 4, parentCode: "296" },
            { code: "2963", name: "Dépréciations des titres de participation dans les sociétés conférant une influence notable", level: 4, parentCode: "296" },
            { code: "2965", name: "Dépréciations des participations dans des organismes professionnels", level: 4, parentCode: "296" },
            { code: "2966", name: "Dépréciations des parts dans des G.I.E.", level: 4, parentCode: "296" },
            { code: "2968", name: "Dépréciations des autres titres de participation", level: 4, parentCode: "296" }
          ]
        },
        {
          code: "297",
          name: "Dépréciations des autres immobilisations financières",
          level: 3,
          parentCode: "29",
          subAccounts: [
            { code: "2971", name: "Dépréciations des prêts et créances", level: 4, parentCode: "297" },
            { code: "2972", name: "Dépréciations des prêts au personnel", level: 4, parentCode: "297" },
            { code: "2973", name: "Dépréciations des créances sur l'État", level: 4, parentCode: "297" },
            { code: "2974", name: "Dépréciations des titres immobilisés", level: 4, parentCode: "297" },
            { code: "2975", name: "Dépréciations des dépôts et cautionnements versés", level: 4, parentCode: "297" },
            { code: "2977", name: "Dépréciations des créances rattachées à des participations et avances à des G.I.E.", level: 4, parentCode: "297" },
            { code: "2978", name: "Dépréciations des créances financières diverses", level: 4, parentCode: "297" }
          ]
        }
      ]
    }
  ]
};
