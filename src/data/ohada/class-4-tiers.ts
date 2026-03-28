import { OhadaClass } from './types';

/**
 * Class 4 - Comptes de tiers
 * Third parties accounts (Suppliers, Customers, Personnel, State, etc.)
 */
export const class4: OhadaClass = {
  code: "4",
  name: "Comptes de tiers",
  nameEn: "Third parties",
  accounts: [
    {
      code: "40",
      name: "Fournisseurs et comptes rattachés",
      level: 2,
      subAccounts: [
        {
          code: "401",
          name: "Fournisseurs, dettes en compte",
          level: 3,
          parentCode: "40",
          subAccounts: [
            { code: "4011", name: "Fournisseurs", level: 4, parentCode: "401" },
            { code: "4012", name: "Fournisseurs-Groupe", level: 4, parentCode: "401" },
            { code: "4013", name: "Fournisseurs sous-traitants", level: 4, parentCode: "401" },
            { code: "4017", name: "Fournisseurs, retenues de garantie", level: 4, parentCode: "401" }
          ]
        },
        {
          code: "402",
          name: "Fournisseurs, effets à payer",
          level: 3,
          parentCode: "40",
          subAccounts: [
            { code: "4021", name: "Fournisseurs, Effets à payer", level: 4, parentCode: "402" },
            { code: "4022", name: "Fournisseurs-Groupe, Effets à payer", level: 4, parentCode: "402" },
            { code: "4023", name: "Fournisseurs sous-traitants, Effets à payer", level: 4, parentCode: "402" }
          ]
        },
        {
          code: "408",
          name: "Fournisseurs, factures non parvenues",
          level: 3,
          parentCode: "40",
          subAccounts: [
            { code: "4081", name: "Fournisseurs", level: 4, parentCode: "408" },
            { code: "4082", name: "Fournisseurs-Groupe", level: 4, parentCode: "408" },
            { code: "4083", name: "Fournisseurs sous-traitants", level: 4, parentCode: "408" },
            { code: "4086", name: "Fournisseurs, intérêts courus", level: 4, parentCode: "408" }
          ]
        },
        {
          code: "409",
          name: "Fournisseurs débiteurs",
          level: 3,
          parentCode: "40",
          subAccounts: [
            { code: "4091", name: "Fournisseurs avances et acomptes versés", level: 4, parentCode: "409" },
            { code: "4092", name: "Fournisseurs-Groupe, avances et acomptes versés", level: 4, parentCode: "409" },
            { code: "4093", name: "Fournisseurs sous-traitants, avances et acomptes versés", level: 4, parentCode: "409" },
            { code: "4094", name: "Fournisseurs, créances pour emballages et matériels à rendre", level: 4, parentCode: "409" },
            { code: "4098", name: "Rabais, Remises, Ristournes et autres avoirs à obtenir", level: 4, parentCode: "409" }
          ]
        }
      ]
    },
    {
      code: "41",
      name: "Clients et comptes rattachés",
      level: 2,
      subAccounts: [
        {
          code: "411",
          name: "Clients",
          level: 3,
          parentCode: "41",
          subAccounts: [
            { code: "4111", name: "Clients", level: 4, parentCode: "411" },
            { code: "4112", name: "Clients-Groupe", level: 4, parentCode: "411" },
            { code: "4114", name: "Clients, Etat et collectivités publiques", level: 4, parentCode: "411" },
            { code: "4115", name: "Clients, organismes internationaux", level: 4, parentCode: "411" },
            { code: "4116", name: "Clients ventes avec réserves de propriété", level: 4, parentCode: "411" },
            { code: "4117", name: "Clients, retenues de garantie", level: 4, parentCode: "411" },
            { code: "4118", name: "Clients, dégrèvements de Taxes sur la Valeur Ajoutée (T.V.A.)", level: 4, parentCode: "411" }
          ]
        },
        {
          code: "412",
          name: "Clients, effets à recevoir en portefeuille",
          level: 3,
          parentCode: "41",
          subAccounts: [
            { code: "4121", name: "Clients, Effets à recevoir", level: 4, parentCode: "412" },
            { code: "4122", name: "Clients-Groupe, Effets à recevoir", level: 4, parentCode: "412" },
            { code: "4124", name: "Etat et collectivités publiques, Effets à recevoir", level: 4, parentCode: "412" },
            { code: "4125", name: "Organismes internationaux, Effets à recevoir", level: 4, parentCode: "412" },
            { code: "4126", name: "clients ventes avec réserves de propriété, effets à recevoir", level: 4, parentCode: "412" }
          ]
        },
        {
          code: "414",
          name: "Créances sur cessions courantes d'immobilisations",
          level: 3,
          parentCode: "41",
          subAccounts: [
            { code: "4141", name: "Créances en compte", level: 4, parentCode: "414" },
            { code: "4142", name: "Effets à recevoir", level: 4, parentCode: "414" }
          ]
        },
        { code: "415", name: "Clients, effets escomptés non échus", level: 3, parentCode: "41" },
        {
          code: "416",
          name: "Créances clients litigieuses ou douteuses",
          level: 3,
          parentCode: "41",
          subAccounts: [
            { code: "4161", name: "Créances litigieuses", level: 4, parentCode: "416" },
            { code: "4162", name: "Créances douteuses", level: 4, parentCode: "416" }
          ]
        },
        {
          code: "418",
          name: "Clients, produits à recevoir",
          level: 3,
          parentCode: "41",
          subAccounts: [
            { code: "4181", name: "Clients, factures à établir", level: 4, parentCode: "418" },
            { code: "4186", name: "Clients, intérêts courus", level: 4, parentCode: "418" }
          ]
        },
        {
          code: "419",
          name: "Clients créditeurs",
          level: 3,
          parentCode: "41",
          subAccounts: [
            { code: "4191", name: "Clients, avances et acomptes reçus", level: 4, parentCode: "419" },
            { code: "4192", name: "Clients-Groupe, avances et acomptes reçus", level: 4, parentCode: "419" },
            { code: "4194", name: "Clients, dettes pour emballages et matériels consignés", level: 4, parentCode: "419" },
            { code: "4198", name: "Rabais, Remises, Ristournes et autres avoirs à accorder", level: 4, parentCode: "419" }
          ]
        }
      ]
    },
    {
      code: "42",
      name: "Personnel",
      level: 2,
      subAccounts: [
        {
          code: "421",
          name: "Personnel, avances et acomptes",
          level: 3,
          parentCode: "42",
          subAccounts: [
            { code: "4211", name: "Personnel, avances", level: 4, parentCode: "421" },
            { code: "4212", name: "Personnel, acomptes", level: 4, parentCode: "421" },
            { code: "4213", name: "Frais avancés et fournitures au personnel", level: 4, parentCode: "421" }
          ]
        },
        { code: "422", name: "Personnel, rémunérations dues", level: 3, parentCode: "42" },
        {
          code: "423",
          name: "Personnel, oppositions, saisies-arrêts",
          level: 3,
          parentCode: "42",
          subAccounts: [
            { code: "4231", name: "Personnel, oppositions", level: 4, parentCode: "423" },
            { code: "4232", name: "Personnel, saisies-arrêts", level: 4, parentCode: "423" },
            { code: "4233", name: "Personnel, avis à tiers détenteur", level: 4, parentCode: "423" }
          ]
        },
        {
          code: "424",
          name: "Personnel, œuvres sociales internes",
          level: 3,
          parentCode: "42",
          subAccounts: [
            { code: "4241", name: "Assistance médicale", level: 4, parentCode: "424" },
            { code: "4242", name: "Allocations familiales", level: 4, parentCode: "424" },
            { code: "4245", name: "Organismes sociaux rattachés à l'entité", level: 4, parentCode: "424" },
            { code: "4248", name: "Autres œuvres sociales internes", level: 4, parentCode: "424" }
          ]
        },
        {
          code: "425",
          name: "Représentants du personnel",
          level: 3,
          parentCode: "42",
          subAccounts: [
            { code: "4251", name: "Délégués du personnel", level: 4, parentCode: "425" },
            { code: "4252", name: "Syndicats et Comités d'entreprise, d'établissement", level: 4, parentCode: "425" },
            { code: "4258", name: "Autres représentants du personnel", level: 4, parentCode: "425" }
          ]
        },
        {
          code: "426",
          name: "Personnel, participation aux bénéfices et au capital",
          level: 3,
          parentCode: "42",
          subAccounts: [
            { code: "4261", name: "Participation aux bénéfices", level: 4, parentCode: "426" },
            { code: "4264", name: "Participation au capital", level: 4, parentCode: "426" }
          ]
        },
        { code: "427", name: "Personnel - dépôts", level: 3, parentCode: "42" },
        {
          code: "428",
          name: "Personnel, charges à payer et produits à recevoir",
          level: 3,
          parentCode: "42",
          subAccounts: [
            { code: "4281", name: "Dettes provisionnées pour congés à payer", level: 4, parentCode: "428" },
            { code: "4286", name: "Autres charges à payer", level: 4, parentCode: "428" },
            { code: "4287", name: "Produits à recevoir", level: 4, parentCode: "428" }
          ]
        }
      ]
    },
    {
      code: "43",
      name: "Organismes sociaux",
      level: 2,
      subAccounts: [
        {
          code: "431",
          name: "Sécurité sociale",
          level: 3,
          parentCode: "43",
          subAccounts: [
            { code: "4311", name: "Prestations familiales", level: 4, parentCode: "431" },
            { code: "4312", name: "Accidents du travail", level: 4, parentCode: "431" },
            { code: "4313", name: "Caisse de retraite obligatoire", level: 4, parentCode: "431" },
            { code: "4314", name: "Caisse de retraite facultative", level: 4, parentCode: "431" },
            { code: "4318", name: "Autres cotisations sociales", level: 4, parentCode: "431" }
          ]
        },
        { code: "432", name: "Caisses de retraite complémentaire", level: 3, parentCode: "43" },
        {
          code: "433",
          name: "Autres organismes sociaux",
          level: 3,
          parentCode: "43",
          subAccounts: [
            { code: "4331", name: "Mutuelle", level: 4, parentCode: "433" },
            { code: "4332", name: "Assurances retraite", level: 4, parentCode: "433" },
            { code: "4333", name: "Assurances et organismes de santé", level: 4, parentCode: "433" }
          ]
        },
        {
          code: "438",
          name: "Organismes sociaux, charges à payer et produits à recevoir",
          level: 3,
          parentCode: "43",
          subAccounts: [
            { code: "4381", name: "Charges sociales sur gratifications à payer", level: 4, parentCode: "438" },
            { code: "4382", name: "Charges sociales sur congés à payer", level: 4, parentCode: "438" },
            { code: "4386", name: "Autres charges à payer", level: 4, parentCode: "438" },
            { code: "4387", name: "Produits à recevoir", level: 4, parentCode: "438" }
          ]
        }
      ]
    },
    {
      code: "44",
      name: "État et collectivités publiques",
      level: 2,
      subAccounts: [
        { code: "441", name: "Etat, impôt sur les bénéfices", level: 3, parentCode: "44" },
        {
          code: "442",
          name: "Etat, autres impôts et taxes",
          level: 3,
          parentCode: "44",
          subAccounts: [
            { code: "4421", name: "Impôts et taxes d'Etat", level: 4, parentCode: "442" },
            { code: "4422", name: "Impôts et taxes pour les collectivités publiques", level: 4, parentCode: "442" },
            { code: "4423", name: "Impôts et taxes recouvrables sur des obligataires", level: 4, parentCode: "442" },
            { code: "4424", name: "Impôts et taxes recouvrables sur des associés", level: 4, parentCode: "442" },
            { code: "4426", name: "Droits de douane", level: 4, parentCode: "442" },
            { code: "4428", name: "Autres impôts et taxes", level: 4, parentCode: "442" }
          ]
        },
        {
          code: "443",
          name: "Etat, TVA facturée",
          level: 3,
          parentCode: "44",
          subAccounts: [
            { code: "4431", name: "TVA facturée sur ventes", level: 4, parentCode: "443" },
            { code: "4432", name: "TVA facturée sur prestations de services", level: 4, parentCode: "443" },
            { code: "4433", name: "TVA facturée sur travaux", level: 4, parentCode: "443" },
            { code: "4434", name: "TVA facturée sur production livrée à soi-même", level: 4, parentCode: "443" },
            { code: "4435", name: "TVA sur factures à établir", level: 4, parentCode: "443" }
          ]
        },
        {
          code: "444",
          name: "Etat, TVA due ou crédit de TVA",
          level: 3,
          parentCode: "44",
          subAccounts: [
            { code: "4441", name: "Etat, TVA due", level: 4, parentCode: "444" },
            { code: "4449", name: "Etat, crédit de TVA à reporter", level: 4, parentCode: "444" }
          ]
        },
        {
          code: "445",
          name: "Etat, TVA récupérable",
          level: 3,
          parentCode: "44",
          subAccounts: [
            { code: "4451", name: "TVA récupérable sur immobilisations", level: 4, parentCode: "445" },
            { code: "4452", name: "TVA récupérable sur achats", level: 4, parentCode: "445" },
            { code: "4453", name: "TVA récupérable sur transport", level: 4, parentCode: "445" },
            { code: "4454", name: "TVA récupérable sur services extérieurs et autres charges", level: 4, parentCode: "445" },
            { code: "4455", name: "TVA récupérable sur factures non parvenues", level: 4, parentCode: "445" },
            { code: "4456", name: "TVA transférée par d'autres entreprises", level: 4, parentCode: "445" }
          ]
        },
        { code: "446", name: "Etat, autres taxes sur le chiffre d'affaires", level: 3, parentCode: "44" },
        {
          code: "447",
          name: "Etat, impôts retenus à la source",
          level: 3,
          parentCode: "44",
          subAccounts: [
            { code: "4471", name: "Impôt Général sur le revenu", level: 4, parentCode: "447" },
            { code: "4472", name: "Impôts sur salaires", level: 4, parentCode: "447" },
            { code: "4473", name: "Contribution nationale", level: 4, parentCode: "447" },
            { code: "4474", name: "Contribution nationale de solidarité", level: 4, parentCode: "447" },
            { code: "4478", name: "Autres impôts et contributions", level: 4, parentCode: "447" }
          ]
        },
        {
          code: "448",
          name: "Etat, charges à payer et produits à recevoir",
          level: 3,
          parentCode: "44",
          subAccounts: [
            { code: "4486", name: "Charges à payer", level: 4, parentCode: "448" },
            { code: "4487", name: "Produits à recevoir", level: 4, parentCode: "448" }
          ]
        },
        {
          code: "449",
          name: "Etat, créances et dettes diverses",
          level: 3,
          parentCode: "44",
          subAccounts: [
            { code: "4491", name: "Etat, obligations cautionnées", level: 4, parentCode: "449" },
            { code: "4492", name: "Etat, avances et acomptes versés sur impôts", level: 4, parentCode: "449" },
            { code: "4493", name: "Etat, fonds de dotation à recevoir", level: 4, parentCode: "449" },
            { code: "4494", name: "Etat, subventions d'équipement à recevoir", level: 4, parentCode: "449" },
            { code: "4495", name: "Etat, subventions d'exploitation à recevoir", level: 4, parentCode: "449" },
            { code: "4496", name: "Etat, subventions d'équilibre à recevoir", level: 4, parentCode: "449" },
            { code: "4497", name: "Etat avances sur subventions", level: 4, parentCode: "449" },
            { code: "4499", name: "Etat, fonds réglementé provisionné", level: 4, parentCode: "449" }
          ]
        }
      ]
    },
    {
      code: "45",
      name: "Organismes internationaux",
      level: 2,
      subAccounts: [
        { code: "451", name: "Opérations avec les organismes africains", level: 3, parentCode: "45" },
        { code: "452", name: "Opérations avec les autres organismes internationaux", level: 3, parentCode: "45" },
        {
          code: "458",
          name: "Organismes internationaux, fonds de dotation et subventions à recevoir",
          level: 3,
          parentCode: "45",
          subAccounts: [
            { code: "4581", name: "Organismes internationaux, fonds de dotation à recevoir", level: 4, parentCode: "458" },
            { code: "4582", name: "Organismes internationaux, subventions à recevoir", level: 4, parentCode: "458" }
          ]
        }
      ]
    },
    {
      code: "46",
      name: "Apporteurs, Associés et Groupe",
      level: 2,
      subAccounts: [
        {
          code: "461",
          name: "Apporteurs, opérations sur le capital",
          level: 3,
          parentCode: "46",
          subAccounts: [
            { code: "4611", name: "Apporteurs, apports en nature", level: 4, parentCode: "461" },
            { code: "4612", name: "Apporteurs, apports en numéraire", level: 4, parentCode: "461" },
            { code: "4613", name: "Apporteurs, capital souscrit appelé non versé", level: 4, parentCode: "461" },
            { code: "4614", name: "Apporteurs, capital appelé non versé", level: 4, parentCode: "461" },
            { code: "4615", name: "Apporteurs, versements reçus sur augmentation de capital", level: 4, parentCode: "461" },
            { code: "4616", name: "Apporteurs, versements anticipés", level: 4, parentCode: "461" },
            { code: "4617", name: "Apporteurs défaillants", level: 4, parentCode: "461" },
            { code: "4618", name: "Apporteurs, autres apports", level: 4, parentCode: "461" },
            { code: "4619", name: "Apporteurs, capital à rembourser", level: 4, parentCode: "461" }
          ]
        },
        {
          code: "462",
          name: "Associés, comptes courants",
          level: 3,
          parentCode: "46",
          subAccounts: [
            { code: "4621", name: "Principal", level: 4, parentCode: "462" },
            { code: "4626", name: "Intérêts courus", level: 4, parentCode: "462" }
          ]
        },
        { code: "463", name: "Associés, opérations faites en commun", level: 3, parentCode: "46" },
        { code: "465", name: "Associés, dividendes à payer", level: 3, parentCode: "46" },
        { code: "466", name: "Groupe, comptes courants", level: 3, parentCode: "46" },
        { code: "467", name: "Apporteurs, restant dû sur capital appelé", level: 3, parentCode: "46" }
      ]
    },
    {
      code: "47",
      name: "Débiteurs et créditeurs divers",
      level: 2,
      subAccounts: [
        {
          code: "471",
          name: "Débiteurs et créditeurs divers",
          level: 3,
          parentCode: "47",
          subAccounts: [
            { code: "4711", name: "Débiteurs divers", level: 4, parentCode: "471" },
            { code: "4712", name: "Créditeurs divers", level: 4, parentCode: "471" },
            { code: "4713", name: "Obligataires", level: 4, parentCode: "471" },
            { code: "4714", name: "Créances sur cessions de titres de placement", level: 4, parentCode: "471" },
            { code: "4715", name: "Rémunérations d'administrateurs", level: 4, parentCode: "471" },
            { code: "4716", name: "Compte du factor", level: 4, parentCode: "471" },
            { code: "4717", name: "Débiteurs divers- retenues de garantie", level: 4, parentCode: "471" },
            { code: "4718", name: "Apport, compte de restructuration", level: 4, parentCode: "471" },
            { code: "4719", name: "Bons de souscription d'actions et d'obligations", level: 4, parentCode: "471" }
          ]
        },
        { code: "472", name: "Versements restant à effectuer sur titres de placement non libérés", level: 3, parentCode: "47" },
        {
          code: "473",
          name: "Intermédiaires – Opérations faites pour le compte de tiers",
          level: 3,
          parentCode: "47",
          subAccounts: [
            { code: "4731", name: "Mandants", level: 4, parentCode: "473" },
            { code: "4732", name: "Mandataires", level: 4, parentCode: "473" },
            { code: "4733", name: "Commettants", level: 4, parentCode: "473" },
            { code: "4734", name: "Commissionnaires", level: 4, parentCode: "473" }
          ]
        },
        {
          code: "474",
          name: "Répartition périodique des charges et des produits",
          level: 3,
          parentCode: "47",
          subAccounts: [
            { code: "4746", name: "Charges", level: 4, parentCode: "474" },
            { code: "4747", name: "Produits", level: 4, parentCode: "474" }
          ]
        },
        {
          code: "475",
          name: "Compte transitoire, ajustement spécial lié à la révision SYSCOHADA",
          level: 3,
          parentCode: "47",
          subAccounts: [
            { code: "4751", name: "Compte actif", level: 4, parentCode: "475" },
            { code: "4752", name: "Compte passif", level: 4, parentCode: "475" }
          ]
        },
        { code: "476", name: "Charges constatées d'avance", level: 3, parentCode: "47" },
        { code: "477", name: "Produits constatés d'avance", level: 3, parentCode: "47" },
        {
          code: "478",
          name: "Écarts de conversion - actif",
          level: 3,
          parentCode: "47",
          subAccounts: [
            { code: "4781", name: "Diminution des créances", level: 4, parentCode: "478" },
            { code: "4782", name: "Augmentation des dettes", level: 4, parentCode: "478" },
            { code: "4788", name: "Différences compensées par couverture de change", level: 4, parentCode: "478" }
          ]
        },
        {
          code: "479",
          name: "Écarts de conversion - passif",
          level: 3,
          parentCode: "47",
          subAccounts: [
            { code: "4791", name: "Augmentation des créances", level: 4, parentCode: "479" },
            { code: "4792", name: "Diminution des dettes", level: 4, parentCode: "479" },
            { code: "4798", name: "Différences compensées par couverture de change", level: 4, parentCode: "479" }
          ]
        }
      ]
    },
    {
      code: "48",
      name: "Créances et dettes hors activités ordinaires (HAO)",
      level: 2,
      subAccounts: [
        {
          code: "481",
          name: "Fournisseurs d'investissements",
          level: 3,
          parentCode: "48",
          subAccounts: [
            { code: "4811", name: "Immobilisations incorporelles", level: 4, parentCode: "481" },
            { code: "4812", name: "Immobilisations corporelles", level: 4, parentCode: "481" },
            { code: "4817", name: "Retenues de garantie", level: 4, parentCode: "481" },
            { code: "4818", name: "Factures non parvenues", level: 4, parentCode: "481" }
          ]
        },
        { code: "482", name: "Fournisseurs d'investissements, effets à payer", level: 3, parentCode: "48" },
        { code: "483", name: "Dettes sur acquisition de titres de placement", level: 3, parentCode: "48" },
        { code: "484", name: "Autres dettes hors activités ordinaires (HAO)", level: 3, parentCode: "48" },
        {
          code: "485",
          name: "Créances sur cessions d'immobilisations",
          level: 3,
          parentCode: "48",
          subAccounts: [
            { code: "4851", name: "En compte", level: 4, parentCode: "485" },
            { code: "4852", name: "Effets à recevoir", level: 4, parentCode: "485" },
            { code: "4857", name: "Retenues de garantie", level: 4, parentCode: "485" },
            { code: "4858", name: "Factures à établir", level: 4, parentCode: "485" }
          ]
        },
        { code: "486", name: "Créances sur cessions de titres de placement", level: 3, parentCode: "48" },
        { code: "488", name: "Autres créances hors activités ordinaires (HAO)", level: 3, parentCode: "48" }
      ]
    },
    {
      code: "49",
      name: "Dépréciations et risques provisionnés (tiers)",
      level: 2,
      subAccounts: [
        { code: "490", name: "Dépréciations des comptes fournisseurs", level: 3, parentCode: "49" },
        {
          code: "491",
          name: "Dépréciations des comptes clients",
          level: 3,
          parentCode: "49",
          subAccounts: [
            { code: "4911", name: "Créances litigieuses", level: 4, parentCode: "491" },
            { code: "4912", name: "Créances douteuses", level: 4, parentCode: "491" }
          ]
        },
        { code: "492", name: "Dépréciations des comptes personnel", level: 3, parentCode: "49" },
        { code: "493", name: "Dépréciations des comptes organismes sociaux", level: 3, parentCode: "49" },
        { code: "494", name: "Dépréciations des comptes Etat et collectivités publiques", level: 3, parentCode: "49" },
        { code: "495", name: "Dépréciations des comptes organismes internationaux", level: 3, parentCode: "49" },
        {
          code: "496",
          name: "Dépréciations des comptes apporteurs associés et groupe",
          level: 3,
          parentCode: "49",
          subAccounts: [
            { code: "4962", name: "Associés, comptes courants", level: 4, parentCode: "496" },
            { code: "4963", name: "Associés, opérations faites en commun", level: 4, parentCode: "496" },
            { code: "4966", name: "Groupe, comptes courants", level: 4, parentCode: "496" }
          ]
        },
        { code: "497", name: "Dépréciations des comptes débiteurs divers", level: 3, parentCode: "49" },
        {
          code: "498",
          name: "Dépréciations des comptes de créances HAO",
          level: 3,
          parentCode: "49",
          subAccounts: [
            { code: "4981", name: "Créances sur cessions d'immobilisations", level: 4, parentCode: "498" },
            { code: "4982", name: "Créances sur cessions de titres de placement", level: 4, parentCode: "498" },
            { code: "4983", name: "Autres créances HAO", level: 4, parentCode: "498" }
          ]
        },
        {
          code: "499",
          name: "Provisions pour risques à court terme",
          level: 3,
          parentCode: "49",
          subAccounts: [
            { code: "4991", name: "Sur opérations d'exploitation", level: 4, parentCode: "499" },
            { code: "4997", name: "Sur opérations financières", level: 4, parentCode: "499" },
            { code: "4998", name: "Sur opérations HAO", level: 4, parentCode: "499" }
          ]
        }
      ]
    }
  ]
};
