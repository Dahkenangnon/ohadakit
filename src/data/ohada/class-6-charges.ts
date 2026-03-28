import { OhadaClass } from './types';

/**
 * Class 6 - Comptes de charges des activités ordinaires
 * Operating expenses accounts
 */
export const class6: OhadaClass = {
  code: "6",
  name: "Comptes de charges des activités ordinaires",
  nameEn: "Operating expenses",
  accounts: [
    {
      code: "60",
      name: "Achats et variations de stocks",
      level: 2,
      subAccounts: [
        {
          code: "601",
          name: "Achats de marchandises",
          level: 3,
          parentCode: "60",
          subAccounts: [
            { code: "6011", name: "dans la Région", level: 4, parentCode: "601" },
            { code: "6012", name: "hors Région", level: 4, parentCode: "601" },
            { code: "6013", name: "aux entités du groupe dans la Région", level: 4, parentCode: "601" },
            { code: "6014", name: "aux entités du groupe hors Région", level: 4, parentCode: "601" },
            { code: "6015", name: "Frais sur achats", level: 4, parentCode: "601" },
            { code: "6019", name: "Rabais, Remises et Ristournes obtenus (non ventilés)", level: 4, parentCode: "601" }
          ]
        },
        {
          code: "602",
          name: "Achats de matières premières et fournitures liées",
          level: 3,
          parentCode: "60",
          subAccounts: [
            { code: "6021", name: "dans la Région", level: 4, parentCode: "602" },
            { code: "6022", name: "hors Région", level: 4, parentCode: "602" },
            { code: "6023", name: "aux entités du groupe dans la Région", level: 4, parentCode: "602" },
            { code: "6024", name: "aux entités du groupe hors Région", level: 4, parentCode: "602" },
            { code: "6025", name: "Frais sur Achats", level: 4, parentCode: "602" },
            { code: "6029", name: "Rabais, Remises et Ristournes obtenus (non ventilés)", level: 4, parentCode: "602" }
          ]
        },
        {
          code: "603",
          name: "Variations des stocks de biens achetés",
          level: 3,
          parentCode: "60",
          subAccounts: [
            { code: "6031", name: "Variations des stocks de marchandises", level: 4, parentCode: "603" },
            { code: "6032", name: "Variations des stocks de matières premières et fournitures liées", level: 4, parentCode: "603" },
            { code: "6033", name: "Variations des stocks d'autres approvisionnements", level: 4, parentCode: "603" }
          ]
        },
        {
          code: "604",
          name: "Achats stockés de matières et fournitures consommables",
          level: 3,
          parentCode: "60",
          subAccounts: [
            { code: "6041", name: "Matières consommables", level: 4, parentCode: "604" },
            { code: "6042", name: "Matières combustibles", level: 4, parentCode: "604" },
            { code: "6043", name: "Produits d'entretien", level: 4, parentCode: "604" },
            { code: "6044", name: "Fournitures d'atelier et d'usine", level: 4, parentCode: "604" },
            { code: "6045", name: "Frais sur Achats", level: 4, parentCode: "604" },
            { code: "6046", name: "Fournitures de magasin", level: 4, parentCode: "604" },
            { code: "6047", name: "Fournitures de bureau", level: 4, parentCode: "604" },
            { code: "6049", name: "Rabais, Remises et Ristournes obtenus (non ventilés)", level: 4, parentCode: "604" }
          ]
        },
        {
          code: "605",
          name: "Autres achats",
          level: 3,
          parentCode: "60",
          subAccounts: [
            { code: "6051", name: "Fournitures non stockables - Eau", level: 4, parentCode: "605" },
            { code: "6052", name: "Fournitures non stockables - Électricité", level: 4, parentCode: "605" },
            { code: "6053", name: "Fournitures non stockables - Autres énergies", level: 4, parentCode: "605" },
            { code: "6054", name: "Fournitures d'entretien non stockables", level: 4, parentCode: "605" },
            { code: "6055", name: "Fournitures de bureau non stockables", level: 4, parentCode: "605" },
            { code: "6056", name: "Achats de petit matériel et outillage", level: 4, parentCode: "605" },
            { code: "6057", name: "Achats d'études et prestations de services", level: 4, parentCode: "605" },
            { code: "6058", name: "Achats de travaux, matériels et équipements", level: 4, parentCode: "605" },
            { code: "6059", name: "Rabais, Remises et Ristournes obtenus (non ventilés)", level: 4, parentCode: "605" }
          ]
        },
        {
          code: "608",
          name: "Achats d'emballages",
          level: 3,
          parentCode: "60",
          subAccounts: [
            { code: "6081", name: "Emballages perdus", level: 4, parentCode: "608" },
            { code: "6082", name: "Emballages récupérables non identifiables", level: 4, parentCode: "608" },
            { code: "6083", name: "Emballages à usage mixte", level: 4, parentCode: "608" },
            { code: "6085", name: "Frais sur achats", level: 4, parentCode: "608" },
            { code: "6089", name: "Rabais, Remises et Ristournes obtenus (non ventilés)", level: 4, parentCode: "608" }
          ]
        }
      ]
    },
    {
      code: "61",
      name: "Transports",
      level: 2,
      subAccounts: [
        { code: "612", name: "Transports sur ventes", level: 3, parentCode: "61" },
        { code: "613", name: "Transports pour le compte de tiers", level: 3, parentCode: "61" },
        { code: "614", name: "Transports du personnel", level: 3, parentCode: "61" },
        { code: "616", name: "Transports de plis", level: 3, parentCode: "61" },
        {
          code: "618",
          name: "Autres frais de transport",
          level: 3,
          parentCode: "61",
          subAccounts: [
            { code: "6181", name: "Voyages et déplacements", level: 4, parentCode: "618" },
            { code: "6182", name: "Transports entre établissements ou chantiers", level: 4, parentCode: "618" },
            { code: "6183", name: "Transports entre établissements ou chantiers", level: 4, parentCode: "618" }
          ]
        }
      ]
    },
    {
      code: "62",
      name: "Services extérieurs",
      level: 2,
      subAccounts: [
        { code: "621", name: "Sous-traitance générale", level: 3, parentCode: "62" },
        {
          code: "622",
          name: "Locations et charges locatives",
          level: 3,
          parentCode: "62",
          subAccounts: [
            { code: "6221", name: "Locations de terrains", level: 4, parentCode: "622" },
            { code: "6222", name: "Locations de bâtiments", level: 4, parentCode: "622" },
            { code: "6223", name: "Locations de matériels et outillages", level: 4, parentCode: "622" },
            { code: "6224", name: "Malis sur emballages", level: 4, parentCode: "622" },
            { code: "6225", name: "Locations d'emballages", level: 4, parentCode: "622" },
            { code: "6226", name: "Fermages et loyers du foncier", level: 4, parentCode: "622" },
            { code: "6228", name: "Locations et charges locatives diverses", level: 4, parentCode: "622" }
          ]
        },
        {
          code: "623",
          name: "Redevances de location acquisition",
          level: 3,
          parentCode: "62",
          subAccounts: [
            { code: "6232", name: "Crédit-bail immobilier", level: 4, parentCode: "623" },
            { code: "6233", name: "Crédit-bail mobilier", level: 4, parentCode: "623" },
            { code: "6234", name: "location vente", level: 4, parentCode: "623" },
            { code: "6235", name: "Autres contrats de location acquisition", level: 4, parentCode: "623" }
          ]
        },
        {
          code: "624",
          name: "Entretien, réparations et maintenance",
          level: 3,
          parentCode: "62",
          subAccounts: [
            { code: "6241", name: "Entretien et réparations des biens immobiliers", level: 4, parentCode: "624" },
            { code: "6242", name: "Entretien et réparations des biens mobiliers", level: 4, parentCode: "624" },
            { code: "6243", name: "Maintenance", level: 4, parentCode: "624" },
            { code: "6248", name: "Autres entretiens et réparations", level: 4, parentCode: "624" }
          ]
        },
        {
          code: "625",
          name: "Primes d'assurance",
          level: 3,
          parentCode: "62",
          subAccounts: [
            { code: "6251", name: "Assurances multirisques", level: 4, parentCode: "625" },
            { code: "6252", name: "Assurances matériel de transport", level: 4, parentCode: "625" },
            { code: "6253", name: "Assurances risques d'exploitation", level: 4, parentCode: "625" },
            { code: "6254", name: "Assurances responsabilité du producteur", level: 4, parentCode: "625" },
            { code: "6255", name: "Assurances insolvabilité clients", level: 4, parentCode: "625" },
            { code: "6257", name: "Assurances transports sur ventes", level: 4, parentCode: "625" },
            { code: "6258", name: "Autres primes d'assurances", level: 4, parentCode: "625" }
          ]
        },
        {
          code: "626",
          name: "Études, recherches et documentation",
          level: 3,
          parentCode: "62",
          subAccounts: [
            { code: "6261", name: "Études et recherches", level: 4, parentCode: "626" },
            { code: "6265", name: "Documentation générale", level: 4, parentCode: "626" },
            { code: "6266", name: "Documentation technique", level: 4, parentCode: "626" }
          ]
        },
        {
          code: "627",
          name: "Publicité, publications, relations publiques",
          level: 3,
          parentCode: "62",
          subAccounts: [
            { code: "6271", name: "Annonces, insertions", level: 4, parentCode: "627" },
            { code: "6272", name: "Catalogues, imprimés publicitaires", level: 4, parentCode: "627" },
            { code: "6273", name: "Échantillons", level: 4, parentCode: "627" },
            { code: "6274", name: "Foires et expositions", level: 4, parentCode: "627" },
            { code: "6275", name: "Publications", level: 4, parentCode: "627" },
            { code: "6276", name: "Cadeaux à la clientèle", level: 4, parentCode: "627" },
            { code: "6277", name: "Frais de colloques, séminaires, conférences", level: 4, parentCode: "627" },
            { code: "6278", name: "Autres charges de publicité et relations publiques", level: 4, parentCode: "627" }
          ]
        },
        {
          code: "628",
          name: "Frais de télécommunications",
          level: 3,
          parentCode: "62",
          subAccounts: [
            { code: "6281", name: "Frais de téléphone", level: 4, parentCode: "628" },
            { code: "6282", name: "Frais de télex", level: 4, parentCode: "628" },
            { code: "6283", name: "Frais de télécopie", level: 4, parentCode: "628" },
            { code: "6288", name: "Autres frais de télécommunications", level: 4, parentCode: "628" }
          ]
        }
      ]
    },
    {
      code: "63",
      name: "Autres services extérieurs",
      level: 2,
      subAccounts: [
        {
          code: "631",
          name: "Frais bancaires",
          level: 3,
          parentCode: "63",
          subAccounts: [
            { code: "6311", name: "Frais sur titres (vente, garde)", level: 4, parentCode: "631" },
            { code: "6312", name: "Frais sur effets", level: 4, parentCode: "631" },
            { code: "6313", name: "Location de coffres", level: 4, parentCode: "631" },
            { code: "6314", name: "Commissions d' affacturage", level: 4, parentCode: "631" },
            { code: "6315", name: "Commissions sur cartes de crédit", level: 4, parentCode: "631" },
            { code: "6316", name: "Frais d'émission d'emprunts", level: 4, parentCode: "631" },
            { code: "6317", name: "Frais sur instruments monnaie électronique", level: 4, parentCode: "631" },
            { code: "6318", name: "Autres frais bancaires", level: 4, parentCode: "631" }
          ]
        },
        {
          code: "632",
          name: "Rémunérations d'intermédiaires et de conseils",
          level: 3,
          parentCode: "63",
          subAccounts: [
            { code: "6322", name: "Commissions et courtages sur ventes", level: 4, parentCode: "632" },
            { code: "6324", name: "Honoraires des professions règlementées", level: 4, parentCode: "632" },
            { code: "6325", name: "Frais d'actes et de contentieux", level: 4, parentCode: "632" },
            { code: "6327", name: "Rémunérations des autres prestataires de services", level: 4, parentCode: "632" },
            { code: "6328", name: "Divers frais", level: 4, parentCode: "632" }
          ]
        },
        { code: "633", name: "Frais de formation du personnel", level: 3, parentCode: "63" },
        {
          code: "634",
          name: "Redevances pour brevets, licences, marques, logiciels, sites, concessions et droits et valeurs similaires",
          level: 3,
          parentCode: "63",
          subAccounts: [
            { code: "6342", name: "Redevances pour brevets, licences", level: 4, parentCode: "634" },
            { code: "6343", name: "Redevances pour logiciels", level: 4, parentCode: "634" },
            { code: "6344", name: "Redevances pour marques", level: 4, parentCode: "634" },
            { code: "6345", name: "Redevances pour sites", level: 4, parentCode: "634" },
            { code: "6346", name: "Redevances pour concessions, droits et valeurs similaires", level: 4, parentCode: "634" }
          ]
        },
        {
          code: "635",
          name: "Cotisations",
          level: 3,
          parentCode: "63",
          subAccounts: [
            { code: "6351", name: "Cotisations", level: 4, parentCode: "635" },
            { code: "6358", name: "Concours divers", level: 4, parentCode: "635" }
          ]
        },
        {
          code: "637",
          name: "Rémunérations de personnel extérieur à l'entité",
          level: 3,
          parentCode: "63",
          subAccounts: [
            { code: "6371", name: "Personnel intérimaire", level: 4, parentCode: "637" },
            { code: "6372", name: "Personnel détaché ou prêté à l'entité", level: 4, parentCode: "637" }
          ]
        },
        {
          code: "638",
          name: "Autres charges externes",
          level: 3,
          parentCode: "63",
          subAccounts: [
            { code: "6381", name: "Frais de recrutement du personnel", level: 4, parentCode: "638" },
            { code: "6382", name: "Frais de déménagement", level: 4, parentCode: "638" },
            { code: "6383", name: "Réceptions", level: 4, parentCode: "638" },
            { code: "6384", name: "Missions", level: 4, parentCode: "638" }
          ]
        }
      ]
    },
    {
      code: "64",
      name: "Impôts et taxes",
      level: 2,
      subAccounts: [
        {
          code: "641",
          name: "Impôts et taxes directs",
          level: 3,
          parentCode: "64",
          subAccounts: [
            { code: "6411", name: "Impôts fonciers et taxes annexes", level: 4, parentCode: "641" },
            { code: "6412", name: "Patentes, licences et taxes annexes", level: 4, parentCode: "641" },
            { code: "6413", name: "Taxes sur appointements et salaires", level: 4, parentCode: "641" },
            { code: "6414", name: "Taxes d'apprentissage", level: 4, parentCode: "641" },
            { code: "6415", name: "Formation professionnelle continue", level: 4, parentCode: "641" },
            { code: "6418", name: "Autres impôts et taxes directs", level: 4, parentCode: "641" }
          ]
        },
        { code: "645", name: "Impôts et taxes indirects", level: 3, parentCode: "64" },
        {
          code: "646",
          name: "Droits d'enregistrement",
          level: 3,
          parentCode: "64",
          subAccounts: [
            { code: "6461", name: "Droits de mutation", level: 4, parentCode: "646" },
            { code: "6462", name: "Droits de timbre", level: 4, parentCode: "646" },
            { code: "6463", name: "Taxes sur les véhicules de société", level: 4, parentCode: "646" },
            { code: "6464", name: "Vignettes", level: 4, parentCode: "646" },
            { code: "6468", name: "Autres droits", level: 4, parentCode: "646" }
          ]
        },
        {
          code: "647",
          name: "Pénalités et amendes fiscales",
          level: 3,
          parentCode: "64",
          subAccounts: [
            { code: "6471", name: "Pénalités d'assiette, impôts directs", level: 4, parentCode: "647" },
            { code: "6472", name: "Pénalités d'assiette, impôts indirects", level: 4, parentCode: "647" },
            { code: "6473", name: "Pénalités de recouvrement, impôts directs", level: 4, parentCode: "647" },
            { code: "6474", name: "Pénalités de recouvrement, impôts indirects", level: 4, parentCode: "647" },
            { code: "6478", name: "Autres amendes pénales et fiscales", level: 4, parentCode: "647" }
          ]
        },
        { code: "648", name: "Autres impôts et taxes", level: 3, parentCode: "64" }
      ]
    },
    {
      code: "65",
      name: "Autres charges",
      level: 2,
      subAccounts: [
        {
          code: "651",
          name: "Pertes sur créances clients et autres débiteurs",
          level: 3,
          parentCode: "65",
          subAccounts: [
            { code: "6511", name: "Clients", level: 4, parentCode: "651" },
            { code: "6515", name: "Autres débiteurs", level: 4, parentCode: "651" }
          ]
        },
        {
          code: "652",
          name: "Quote-part de résultat sur opérations faites en commun",
          level: 3,
          parentCode: "65",
          subAccounts: [
            { code: "6521", name: "Quote-part transférée de bénéfices (comptabilité du gérant)", level: 4, parentCode: "652" },
            { code: "6525", name: "Pertes imputées par transfert (comptabilité des associés non gérants)", level: 4, parentCode: "652" }
          ]
        },
        { code: "654", name: "Valeurs comptables des cessions courantes d'immobilisations", level: 3, parentCode: "65" },
        {
          code: "658",
          name: "Charges diverses",
          level: 3,
          parentCode: "65",
          subAccounts: [
            { code: "6581", name: "Indemnités de fonction et autres rémunérations d'administrateurs", level: 4, parentCode: "658" },
            { code: "6582", name: "Dons", level: 4, parentCode: "658" },
            { code: "6583", name: "Mécénat", level: 4, parentCode: "658" },
            { code: "6588", name: "Autres charges diverses", level: 4, parentCode: "658" }
          ]
        },
        {
          code: "659",
          name: "Charges pour dépréciations et provisions pour risques à court terme d'exploitation",
          level: 3,
          parentCode: "65",
          subAccounts: [
            { code: "6591", name: "sur risques à court terme", level: 4, parentCode: "659" },
            { code: "6593", name: "sur stocks", level: 4, parentCode: "659" },
            { code: "6594", name: "sur créances", level: 4, parentCode: "659" },
            { code: "6598", name: "Autres charges pour dépréciations et provisions pour risques à court terme", level: 4, parentCode: "659" }
          ]
        }
      ]
    },
    {
      code: "66",
      name: "Charges de personnel",
      level: 2,
      subAccounts: [
        {
          code: "661",
          name: "Rémunérations directes versées au personnel national",
          level: 3,
          parentCode: "66",
          subAccounts: [
            { code: "6611", name: "Appointements, salaires et commissions", level: 4, parentCode: "661" },
            { code: "6612", name: "Primes et gratifications", level: 4, parentCode: "661" },
            { code: "6613", name: "Congés payés", level: 4, parentCode: "661" },
            { code: "6614", name: "Indemnités de préavis, de licenciement et de recherche d'embauche", level: 4, parentCode: "661" },
            { code: "6615", name: "Indemnités de maladie versées aux travailleurs", level: 4, parentCode: "661" },
            { code: "6616", name: "Supplément familial", level: 4, parentCode: "661" },
            { code: "6617", name: "Avantages en nature", level: 4, parentCode: "661" },
            { code: "6618", name: "Autres rémunérations directes", level: 4, parentCode: "661" }
          ]
        },
        {
          code: "662",
          name: "Rémunérations directes versées au personnel non national",
          level: 3,
          parentCode: "66",
          subAccounts: [
            { code: "6621", name: "Appointements, salaires et commissions", level: 4, parentCode: "662" },
            { code: "6622", name: "Primes et gratifications", level: 4, parentCode: "662" },
            { code: "6623", name: "Congés payés", level: 4, parentCode: "662" },
            { code: "6624", name: "Indemnités de préavis, de licenciement et de recherche d'embauche", level: 4, parentCode: "662" },
            { code: "6625", name: "Indemnités de maladie versées aux travailleurs", level: 4, parentCode: "662" },
            { code: "6626", name: "Supplément familial", level: 4, parentCode: "662" },
            { code: "6627", name: "Avantages en nature", level: 4, parentCode: "662" },
            { code: "6628", name: "Autres rémunérations directes", level: 4, parentCode: "662" }
          ]
        },
        {
          code: "663",
          name: "Indemnités forfaitaires versées au personnel",
          level: 3,
          parentCode: "66",
          subAccounts: [
            { code: "6631", name: "Indemnités de logement", level: 4, parentCode: "663" },
            { code: "6632", name: "Indemnités de représentation", level: 4, parentCode: "663" },
            { code: "6633", name: "Indemnités d'expatriation", level: 4, parentCode: "663" },
            { code: "6638", name: "Autres indemnités et avantages divers", level: 4, parentCode: "663" }
          ]
        },
        {
          code: "664",
          name: "Charges sociales",
          level: 3,
          parentCode: "66",
          subAccounts: [
            { code: "6641", name: "Charges sociales sur rémunération du personnel national", level: 4, parentCode: "664" },
            { code: "6642", name: "Charges sociales sur rémunération du personnel non national", level: 4, parentCode: "664" }
          ]
        },
        {
          code: "666",
          name: "Rémunération et charges sociales de l'exploitant individuel",
          level: 3,
          parentCode: "66",
          subAccounts: [
            { code: "6661", name: "Rémunération du travail de l'exploitant", level: 4, parentCode: "666" },
            { code: "6662", name: "Charges sociales", level: 4, parentCode: "666" }
          ]
        },
        {
          code: "667",
          name: "Rémunération transférée de personnel extérieur",
          level: 3,
          parentCode: "66",
          subAccounts: [
            { code: "6671", name: "Personnel intérimaire", level: 4, parentCode: "667" },
            { code: "6672", name: "Personnel détaché ou prêté à l'entité", level: 4, parentCode: "667" }
          ]
        },
        {
          code: "668",
          name: "Autres charges sociales",
          level: 3,
          parentCode: "66",
          subAccounts: [
            { code: "6681", name: "Versements aux syndicats et comités d'entreprise, d'établissement", level: 4, parentCode: "668" },
            { code: "6682", name: "Versements aux comités d'hygiène et de sécurité", level: 4, parentCode: "668" },
            { code: "6683", name: "Versements aux autres œuvres sociales", level: 4, parentCode: "668" },
            { code: "6684", name: "Médecine du travail et pharmacie", level: 4, parentCode: "668" },
            { code: "6685", name: "Assurances et organismes de santé", level: 4, parentCode: "668" },
            { code: "6686", name: "Assurances retraite et fonds de pension", level: 4, parentCode: "668" }
          ]
        }
      ]
    },
    {
      code: "67",
      name: "Frais financiers et charges assimilées",
      level: 2,
      subAccounts: [
        {
          code: "671",
          name: "Intérêts des emprunts",
          level: 3,
          parentCode: "67",
          subAccounts: [
            { code: "6711", name: "Emprunts obligataires", level: 4, parentCode: "671" },
            { code: "6712", name: "Emprunts auprès des établissements de crédit", level: 4, parentCode: "671" },
            { code: "6713", name: "Dettes liées à des participations", level: 4, parentCode: "671" },
            { code: "6714", name: "Primes de remboursement des obligations", level: 4, parentCode: "671" }
          ]
        },
        {
          code: "672",
          name: "Intérêts dans loyers de location acquisition",
          level: 3,
          parentCode: "67",
          subAccounts: [
            { code: "6721", name: "Intérêts dans loyers de location acquisition / crédit-bail immobilier", level: 4, parentCode: "672" },
            { code: "6722", name: "Intérêts dans loyers de location acquisition / crédit-bail mobilier", level: 4, parentCode: "672" },
            { code: "6723", name: "Intérêts dans loyers de location acquisition / location vente", level: 4, parentCode: "672" },
            { code: "6724", name: "Intérêts dans loyers des autres contrats", level: 4, parentCode: "672" }
          ]
        },
        { code: "673", name: "Escomptes accordés", level: 3, parentCode: "67" },
        {
          code: "674",
          name: "Autres intérêts",
          level: 3,
          parentCode: "67",
          subAccounts: [
            { code: "6741", name: "Avances reçues et dépôts créditeurs", level: 4, parentCode: "674" },
            { code: "6742", name: "Comptes courants bloqués", level: 4, parentCode: "674" },
            { code: "6743", name: "Intérêts sur obligations cautionnées", level: 4, parentCode: "674" },
            { code: "6744", name: "Intérêts sur dettes commerciales", level: 4, parentCode: "674" },
            { code: "6745", name: "Intérêts bancaires et sur opérations de trésorerie et d'escompte", level: 4, parentCode: "674" },
            { code: "6748", name: "Intérêts sur dettes diverses", level: 4, parentCode: "674" }
          ]
        },
        { code: "675", name: "Escomptes des effets de commerce", level: 3, parentCode: "67" },
        { code: "676", name: "Pertes de change", level: 3, parentCode: "67" },
        {
          code: "677",
          name: "Pertes sur titres de placement",
          level: 3,
          parentCode: "67",
          subAccounts: [
            { code: "6771", name: "Pertes sur cessions de titres de placement", level: 4, parentCode: "677" },
            { code: "6772", name: "Malis provenant d'attribution gratuite d'actions au personnel salarié et aux dirigeants", level: 4, parentCode: "677" }
          ]
        },
        {
          code: "678",
          name: "Pertes sur risques financiers",
          level: 3,
          parentCode: "67",
          subAccounts: [
            { code: "6781", name: "Sur rentes viagères", level: 4, parentCode: "678" },
            { code: "6782", name: "Sur opérations financières", level: 4, parentCode: "678" },
            { code: "6784", name: "Sur instruments de trésorerie", level: 4, parentCode: "678" }
          ]
        },
        {
          code: "679",
          name: "Charges pour dépréciations et provisions pour risques à court terme financières",
          level: 3,
          parentCode: "67",
          subAccounts: [
            { code: "6791", name: "Sur risques financiers", level: 4, parentCode: "679" },
            { code: "6795", name: "Sur titres de placement", level: 4, parentCode: "679" },
            { code: "6798", name: "Autres charges pour dépréciations et provisions pour risques à court terme financières", level: 4, parentCode: "679" }
          ]
        }
      ]
    },
    {
      code: "68",
      name: "Dotations aux amortissements",
      level: 2,
      subAccounts: [
        {
          code: "681",
          name: "Dotations aux amortissements d'exploitation",
          level: 3,
          parentCode: "68",
          subAccounts: [
            { code: "6812", name: "Dotations aux amortissements des immobilisations incorporelles", level: 4, parentCode: "681" },
            { code: "6813", name: "Dotations aux amortissements des immobilisations corporelles", level: 4, parentCode: "681" }
          ]
        },
        { code: "687", name: "Dotations aux amortissements à caractère financier", level: 3, parentCode: "68" }
      ]
    },
    {
      code: "69",
      name: "Dotations aux provisions",
      level: 2,
      subAccounts: [
        {
          code: "691",
          name: "Dotations aux provisions d'exploitation",
          level: 3,
          parentCode: "69",
          subAccounts: [
            { code: "6911", name: "Pour risques et charges", level: 4, parentCode: "691" },
            { code: "6913", name: "Pour dépréciation des immobilisations incorporelles", level: 4, parentCode: "691" },
            { code: "6914", name: "Pour dépréciation des immobilisations corporelles", level: 4, parentCode: "691" }
          ]
        },
        {
          code: "697",
          name: "Dotations aux provisions financières",
          level: 3,
          parentCode: "69",
          subAccounts: [
            { code: "6971", name: "Pour risques et charges", level: 4, parentCode: "697" },
            { code: "6972", name: "Pour dépréciation des immobilisations financières", level: 4, parentCode: "697" }
          ]
        }
      ]
    }
  ]
};
