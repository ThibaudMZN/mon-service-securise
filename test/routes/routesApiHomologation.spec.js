const axios = require('axios');
const expect = require('expect.js');

const testeurMSS = require('./testeurMSS');

const uneDescriptionValide = require('../constructeurs/constructeurDescriptionService');
const { ErreurModele, ErreurDonneesObligatoiresManquantes, ErreurNomServiceDejaExistant } = require('../../src/erreurs');
const AutorisationContributeur = require('../../src/modeles/autorisations/autorisationContributeur');
const AutorisationCreateur = require('../../src/modeles/autorisations/autorisationCreateur');

describe('Le serveur MSS des routes /api/homologation/*', () => {
  const testeur = testeurMSS();

  beforeEach(testeur.initialise);

  afterEach(testeur.arrete);

  describe('quand requête POST sur `/api/homologation`', () => {
    beforeEach(() => {
      testeur.depotDonnees().nouvelleHomologation = () => Promise.resolve();
    });

    it("vérifie que l'utilisateur est authentifié", (done) => {
      testeur.middleware().verifieRequeteExigeAcceptationCGU(
        { method: 'post', url: 'http://localhost:1234/api/homologation' }, done
      );
    });

    it('aseptise les paramètres', (done) => {
      testeur.middleware().verifieAseptisationParametres(
        ['nomService'],
        { method: 'post', url: 'http://localhost:1234/api/homologation' },
        done
      );
    });

    it("aseptise la liste des points d'accès ainsi que son contenu", (done) => {
      axios.post('http://localhost:1234/api/homologation', {})
        .then(() => {
          testeur.middleware().verifieAseptisationListe('pointsAcces', ['description']);
          done();
        })
        .catch(done);
    });

    it('aseptise la liste des fonctionnalités spécifiques ainsi que son contenu', (done) => {
      axios.post('http://localhost:1234/api/homologation', {})
        .then(() => {
          testeur.middleware().verifieAseptisationListe('fonctionnalitesSpecifiques', ['description']);
          done();
        })
        .catch(done);
    });

    it('aseptise la liste des données sensibles spécifiques ainsi que son contenu', (done) => {
      axios.post('http://localhost:1234/api/homologation', {})
        .then(() => {
          testeur.middleware().verifieAseptisationListe('donneesSensiblesSpecifiques', ['description']);
          done();
        })
        .catch(done);
    });

    it('retourne une erreur HTTP 422 si les données de description de service sont invalides', (done) => {
      testeur.verifieRequeteGenereErreurHTTP(422, 'Le statut de déploiement "statutInvalide" est invalide', {
        method: 'post',
        url: 'http://localhost:1234/api/homologation',
        data: { statutDeploiement: 'statutInvalide' },
      }, done);
    });

    it('retourne une erreur HTTP 422 si données insuffisantes pour création homologation', (done) => {
      testeur.depotDonnees().nouvelleHomologation = () => Promise.reject(new ErreurDonneesObligatoiresManquantes('oups'));

      testeur.verifieRequeteGenereErreurHTTP(422, 'oups', {
        method: 'post',
        url: 'http://localhost:1234/api/homologation',
        data: {},
      }, done);
    });

    it('retourne une erreur HTTP 422 si le nom du service existe déjà', (done) => {
      testeur.depotDonnees().nouvelleHomologation = () => Promise.reject(new ErreurNomServiceDejaExistant('oups'));

      testeur.verifieRequeteGenereErreurHTTP(422, 'oups', {
        method: 'post',
        url: 'http://localhost:1234/api/homologation',
        data: { nomService: 'Un nom déjà existant' },
      }, done);
    });

    it("demande au dépôt de données d'enregistrer les nouvelles homologations", (done) => {
      testeur.middleware().reinitialise('123');
      const donneesDescriptionService = uneDescriptionValide(testeur.referentiel())
        .construis()
        .toJSON();

      testeur.depotDonnees().nouvelleHomologation = (idUtilisateur, donneesHomologation) => {
        expect(idUtilisateur).to.equal('123');
        expect(donneesHomologation).to.eql(donneesDescriptionService);
        return Promise.resolve('456');
      };

      axios.post('http://localhost:1234/api/homologation', donneesDescriptionService)
        .then((reponse) => {
          expect(reponse.status).to.equal(200);
          expect(reponse.data).to.eql({ idHomologation: '456' });
          done();
        })
        .catch((e) => done(e.response?.data || e));
    });
  });
  describe('quand requête PUT sur `/api/homologation/:id`', () => {
    beforeEach(() => {
      testeur.depotDonnees().ajouteDescriptionServiceAHomologation = () => Promise.resolve();
    });

    it("recherche l'homologation correspondante", (done) => {
      testeur.middleware().verifieRechercheHomologation(
        { method: 'put', url: 'http://localhost:1234/api/homologation/456' }, done
      );
    });

    it('aseptise les paramètres', (done) => {
      testeur.middleware().verifieAseptisationParametres(
        ['nomService'],
        { method: 'put', url: 'http://localhost:1234/api/homologation/456' },
        done
      );
    });

    it("aseptise la liste des points d'accès ainsi que son contenu", (done) => {
      axios.put('http://localhost:1234/api/homologation/456', {})
        .then(() => {
          testeur.middleware().verifieAseptisationListe('pointsAcces', ['description']);
          done();
        })
        .catch(done);
    });

    it('aseptise la liste des fonctionnalités spécifiques ainsi que son contenu', (done) => {
      axios.put('http://localhost:1234/api/homologation/456', {})
        .then(() => {
          testeur.middleware().verifieAseptisationListe('fonctionnalitesSpecifiques', ['description']);
          done();
        })
        .catch(done);
    });

    it('aseptise la liste des données sensibles spécifiques ainsi que son contenu', (done) => {
      axios.put('http://localhost:1234/api/homologation/456', {})
        .then(() => {
          testeur.middleware().verifieAseptisationListe('donneesSensiblesSpecifiques', ['description']);
          done();
        })
        .catch(done);
    });

    it("demande au dépôt de données de mettre à jour l'homologation", (done) => {
      testeur.middleware().reinitialise('123');

      testeur.depotDonnees().ajouteDescriptionServiceAHomologation = (
        (idUtilisateur, idHomologation, infosGenerales) => {
          expect(idUtilisateur).to.equal('123');
          expect(idHomologation).to.equal('456');
          expect(infosGenerales.nomService).to.equal('Nouveau Nom');
          return Promise.resolve();
        }
      );

      axios.put('http://localhost:1234/api/homologation/456', { nomService: 'Nouveau Nom' })
        .then((reponse) => {
          expect(reponse.status).to.equal(200);
          expect(reponse.data).to.eql({ idHomologation: '456' });
          done();
        })
        .catch(done);
    });

    it('retourne une erreur HTTP 422 si le validateur du modèle échoue', (done) => {
      testeur.verifieRequeteGenereErreurHTTP(422, 'Le statut de déploiement "statutInvalide" est invalide', {
        method: 'put',
        url: 'http://localhost:1234/api/homologation/456',
        data: { statutDeploiement: 'statutInvalide' },
      }, done);
    });

    it('retourne une erreur HTTP 422 si la validation des propriétés obligatoires échoue', (done) => {
      testeur.depotDonnees().ajouteDescriptionServiceAHomologation = () => Promise.reject(
        new ErreurNomServiceDejaExistant('oups')
      );

      testeur.verifieRequeteGenereErreurHTTP(422, 'oups', {
        method: 'put',
        url: 'http://localhost:1234/api/homologation/456',
        data: { nomService: 'service déjà existant' },
      }, done);
    });
  });

  describe('quand requête POST sur `/api/homologation/:id/mesures', () => {
    beforeEach(() => {
      testeur.depotDonnees().ajouteMesuresAHomologation = () => Promise.resolve();
      testeur.referentiel().recharge({
        categoriesMesures: { uneCategorie: 'Une catégorie' },
        mesures: { identifiantMesure: {} },
        statutsMesures: { fait: 'Fait' },
      });
    });

    it("recherche l'homologation correspondante", (done) => {
      testeur.middleware().verifieRechercheHomologation({
        method: 'post',
        url: 'http://localhost:1234/api/homologation/456/mesures',
      }, done);
    });

    it('aseptise tous les paramètres de la requête', (done) => {
      testeur.middleware().verifieAseptisationParametres(
        [
          'mesuresGenerales.*.statut',
          'mesuresGenerales.*.modalites',
          'mesuresSpecifiques.*.description',
          'mesuresSpecifiques.*.categorie',
          'mesuresSpecifiques.*.statut',
          'mesuresSpecifiques.*.modalites',
        ],
        { method: 'post', url: 'http://localhost:1234/api/homologation/456/mesures' },
        done
      );
    });

    it("demande au dépôt d'associer les mesures à l'homologation", (done) => {
      let mesuresAjoutees = false;

      testeur.depotDonnees().ajouteMesuresAHomologation = (
        idHomologation,
        [generale],
        specifiques,
      ) => {
        expect(idHomologation).to.equal('456');
        expect(generale.id).to.equal('identifiantMesure');
        expect(generale.statut).to.equal('fait');
        expect(generale.modalites).to.equal("Des modalités d'application");

        expect(specifiques.nombre()).to.equal(1);
        expect(specifiques.item(0).description).to.equal('Une mesure spécifique');

        mesuresAjoutees = true;
        return Promise.resolve();
      };

      axios.post('http://localhost:1234/api/homologation/456/mesures', {
        mesuresGenerales: {
          identifiantMesure: { statut: 'fait', modalites: "Des modalités d'application" },
        },
        mesuresSpecifiques: [{ description: 'Une mesure spécifique', categorie: 'uneCategorie', statut: 'fait' }],
      })
        .then((reponse) => {
          expect(mesuresAjoutees).to.be(true);
          expect(reponse.status).to.equal(200);
          expect(reponse.data).to.eql({ idHomologation: '456' });
          done();
        })
        .catch(done);
    });

    it('filtre les mesures spécifiques vides', (done) => {
      let mesuresRemplacees = false;
      testeur.depotDonnees().ajouteMesuresAHomologation = (_id, _generales, specifiques) => {
        expect(specifiques.nombre()).to.equal(1);
        mesuresRemplacees = true;
        return Promise.resolve();
      };

      const mesuresSpecifiques = [];
      mesuresSpecifiques[2] = { description: 'Une mesure spécifique', categorie: 'uneCategorie', statut: 'fait' };

      axios.post('http://localhost:1234/api/homologation/456/mesures', { mesuresSpecifiques })
        .then(() => expect(mesuresRemplacees).to.be(true))
        .then(() => done())
        .catch(done);
    });

    it("filtre les mesures spécifiques qui n'ont pas les propriétés requises", (done) => {
      let mesuresRemplacees = false;
      testeur.depotDonnees().ajouteMesuresAHomologation = (_id, _generales, specifiques) => {
        expect(specifiques.nombre()).to.equal(1);
        mesuresRemplacees = true;
        return Promise.resolve();
      };

      const mesuresSpecifiques = [
        { description: 'Mesure bien renseignée', categorie: 'uneCategorie', statut: 'fait' },
        { categorie: 'uneCategorie', statut: 'fait' },
        { description: 'Mesure sans catégorie', statut: 'fait' },
        { description: 'Mesure sans statut', categorie: 'uneCategorie' },
        { modalites: 'Modalités' },
      ];

      axios.post('http://localhost:1234/api/homologation/456/mesures', { mesuresSpecifiques })
        .then(() => expect(mesuresRemplacees).to.be(true))
        .then(() => done())
        .catch(done);
    });

    it('retourne une erreur HTTP 422 si les données sont invalides', (done) => {
      testeur.verifieRequeteGenereErreurHTTP(422, 'Données invalides', {
        method: 'post',
        url: 'http://localhost:1234/api/homologation/456/mesures',
        data: { mesuresGenerales: { identifiantInvalide: { statut: 'statutInvalide' } } },
      }, done);
    });
  });

  describe('quand requête POST sur `/api/homologation/:id/rolesResponsabilites`', () => {
    beforeEach(() => {
      testeur.depotDonnees().ajouteRolesResponsabilitesAHomologation = () => Promise.resolve();
      testeur.depotDonnees().ajouteEntitesExternesAHomologation = () => Promise.resolve();
    });

    it("recherche l'homologation correspondante", (done) => {
      testeur.middleware().verifieRechercheHomologation({
        method: 'post',
        url: 'http://localhost:1234/api/homologation/456/rolesResponsabilites',
      }, done);
    });

    it("demande au dépôt d'associer les rôles et responsabilités à l'homologation", (done) => {
      let rolesResponsabilitesAjoutees = false;

      testeur.depotDonnees().ajouteRolesResponsabilitesAHomologation = (idHomologation, role) => {
        expect(idHomologation).to.equal('456');
        expect(role.autoriteHomologation).to.equal('Jean Dupont');
        rolesResponsabilitesAjoutees = true;
        return Promise.resolve();
      };

      axios.post('http://localhost:1234/api/homologation/456/rolesResponsabilites', {
        autoriteHomologation: 'Jean Dupont',
      })
        .then((reponse) => {
          expect(rolesResponsabilitesAjoutees).to.be(true);
          expect(reponse.status).to.equal(200);
          expect(reponse.data).to.eql({ idHomologation: '456' });
          done();
        })
        .catch(done);
    });

    it("aseptise la liste des acteurs de l'homologation ainsi que son contenu", (done) => {
      axios.post('http://localhost:1234/api/homologation/456/rolesResponsabilites', {})
        .then(() => {
          testeur.middleware().verifieAseptisationListe('acteursHomologation', ['role', 'nom', 'fonction']);
          done();
        })
        .catch(done);
    });

    it('aseptise la liste des parties prenantes ainsi que son contenu', (done) => {
      axios.post('http://localhost:1234/api/homologation/456/rolesResponsabilites', {})
        .then(() => {
          testeur.middleware().verifieAseptisationListe('partiesPrenantes', ['nom', 'natureAcces', 'pointContact']);
          done();
        })
        .catch(done);
    });
  });

  describe('quand requête POST sur `/api/homologation/:id/risques`', () => {
    beforeEach(() => {
      testeur.depotDonnees().remplaceRisquesSpecifiquesPourHomologation = () => Promise.resolve();
    });

    it("recherche l'homologation correspondante", (done) => {
      testeur.middleware().verifieRechercheHomologation({
        method: 'post',
        url: 'http://localhost:1234/api/homologation/456/risques',
      }, done);
    });

    it('aseptise les paramètres de la requête', (done) => {
      testeur.middleware().verifieAseptisationParametres(
        [
          '*',
          'risquesSpecifiques.*.description',
          'risquesSpecifiques.*.niveauGravite',
          'risquesSpecifiques.*.commentaire',
        ],
        { method: 'post', url: 'http://localhost:1234/api/homologation/456/risques' },
        done
      );
    });

    it("demande au dépôt d'associer les risques généraux à l'homologation", (done) => {
      testeur.referentiel().recharge({
        risques: { unRisque: {} },
        niveauxGravite: { unNiveau: {} },
      });
      let risqueAjoute = false;

      testeur.depotDonnees().ajouteRisqueGeneralAHomologation = (idHomologation, risque) => {
        try {
          expect(idHomologation).to.equal('456');
          expect(risque.id).to.equal('unRisque');
          expect(risque.commentaire).to.equal('Un commentaire');
          expect(risque.niveauGravite).to.equal('unNiveau');
          risqueAjoute = true;
          return Promise.resolve();
        } catch (e) {
          return done(e);
        }
      };

      axios.post('http://localhost:1234/api/homologation/456/risques', {
        'commentaire-unRisque': 'Un commentaire',
        'niveauGravite-unRisque': 'unNiveau',
      })
        .then((reponse) => {
          expect(risqueAjoute).to.be(true);
          expect(reponse.status).to.equal(200);
          expect(reponse.data).to.eql({ idHomologation: '456' });
          done();
        })
        .catch(done);
    });

    it("demande au dépôt d'associer les risques spécifiques à l'homologation", (done) => {
      let risquesRemplaces = false;
      testeur.depotDonnees().remplaceRisquesSpecifiquesPourHomologation = (
        idHomologation, risques
      ) => {
        expect(idHomologation).to.equal('456');
        expect(risques.nombre()).to.equal(1);
        expect(risques.item(0).description).to.equal('Un risque spécifique');
        expect(risques.item(0).commentaire).to.equal('Un commentaire');
        risquesRemplaces = true;
        return Promise.resolve();
      };

      axios.post('http://localhost:1234/api/homologation/456/risques', {
        risquesSpecifiques: [{ description: 'Un risque spécifique', commentaire: 'Un commentaire' }],
      })
        .then(() => expect(risquesRemplaces).to.be(true))
        .then(() => done())
        .catch(done);
    });

    it('filtre les risques spécifiques vides', (done) => {
      testeur.referentiel().recharge({ niveauxGravite: { unNiveau: {} } });

      let risquesRemplaces = false;
      testeur.depotDonnees().remplaceRisquesSpecifiquesPourHomologation = (_, risques) => {
        expect(risques.nombre()).to.equal(2);
        risquesRemplaces = true;
        return Promise.resolve();
      };

      const risquesSpecifiques = [];
      risquesSpecifiques[2] = { description: 'Un risque spécifique' };
      risquesSpecifiques[5] = { niveauGravite: 'unNiveau' };

      axios.post('http://localhost:1234/api/homologation/456/risques', { risquesSpecifiques })
        .then(() => expect(risquesRemplaces).to.be(true))
        .then(() => done())
        .catch(done);
    });

    it('retourne une erreur HTTP 422 si les données sont invalides', (done) => {
      testeur.verifieRequeteGenereErreurHTTP(422, 'Données invalides', {
        method: 'post',
        url: 'http://localhost:1234/api/homologation/456/risques',
        data: { 'commentaire-unRisqueInvalide': 'Un commentaire' },
      }, done);
    });
  });

  describe('quand requête POST sur `/api/homologation/:id/avisExpertCyber`', () => {
    beforeEach(() => (
      testeur.depotDonnees().ajouteAvisExpertCyberAHomologation = () => Promise.resolve()
    ));

    it("recherche l'homologation correspondante", (done) => {
      testeur.middleware().verifieRechercheHomologation({
        method: 'post',
        url: 'http://localhost:1234/api/homologation/456/avisExpertCyber',
      }, done);
    });

    it("demande au dépôt d'associer l'avis d'expert à l'homologation", (done) => {
      let avisAjoute = false;

      testeur.depotDonnees().ajouteAvisExpertCyberAHomologation = (idHomologation, avis) => {
        expect(idHomologation).to.equal('456');
        expect(avis.commentaire).to.equal('Un commentaire');
        avisAjoute = true;
        return Promise.resolve();
      };

      axios.post('http://localhost:1234/api/homologation/456/avisExpertCyber', {
        commentaire: 'Un commentaire',
      })
        .then((reponse) => {
          expect(avisAjoute).to.be(true);
          expect(reponse.status).to.equal(200);
          expect(reponse.data).to.eql({ idHomologation: '456' });
          done();
        })
        .catch(done);
    });

    it('retourne une erreur HTTP 422 si les données sont invalides', (done) => {
      testeur.verifieRequeteGenereErreurHTTP(422, 'Données invalides', {
        method: 'post',
        url: 'http://localhost:1234/api/homologation/456/avisExpertCyber',
        data: { avis: 'avisInvalide' },
      }, done);
    });
  });

  describe('quand requête PUT sur `/api/homologation/:id/dossier`', () => {
    beforeEach(() => {
      testeur.depotDonnees().metsAJourDossierCourant = () => Promise.resolve();
      testeur.referentiel().recharge({ echeancesRenouvellement: { unAn: {} } });
    });

    it('aseptise les paramètres', (done) => {
      testeur.middleware().verifieAseptisationParametres(
        ['dateHomologation', 'dureeValidite'],
        { method: 'put', url: 'http://localhost:1234/api/homologation/456/dossier' },
        done
      );
    });

    it("recherche l'homologation correspondante", (done) => {
      testeur.middleware().verifieRechercheHomologation({
        method: 'put',
        url: 'http://localhost:1234/api/homologation/456/dossier',
      }, done);
    });

    it('demande au dépôt de persister les données du dossier', (done) => {
      let dossierSauve = false;
      testeur.depotDonnees().metsAJourDossierCourant = (idHomologation, dossier) => {
        try {
          expect(idHomologation).to.equal('456');
          expect(dossier.dateHomologation).to.equal('2022-12-01');
          expect(dossier.dureeValidite).to.equal('unAn');
          dossierSauve = true;

          return Promise.resolve();
        } catch (e) {
          return Promise.reject(e);
        }
      };

      axios.put('http://localhost:1234/api/homologation/456/dossier', {
        dateHomologation: '2022-12-01',
        dureeValidite: 'unAn',
      })
        .then((reponse) => {
          expect(dossierSauve).to.be(true);
          expect(reponse.data).to.eql({ idHomologation: '456' });
          done();
        })
        .catch((e) => done(e.response?.data || e));
    });

    it("retourne une erreur HTTP 422 s'il manque la date d'homologation", (done) => {
      testeur.verifieRequeteGenereErreurHTTP(422, "Date d'homologation manquante", {
        method: 'put',
        url: 'http://localhost:1234/api/homologation/456/dossier',
        data: { dureeValidite: 'unAn' },
      }, done);
    });

    it("retourne une erreur HTTP 422 s'il manque la durée de validité", (done) => {
      testeur.verifieRequeteGenereErreurHTTP(422, 'Durée de validité manquante', {
        method: 'put',
        url: 'http://localhost:1234/api/homologation/456/dossier',
        data: { dateHomologation: '2022-12-01' },
      }, done);
    });

    it('finalise le dossier si le paramètre est présent dans la requête', (done) => {
      let dossierFinalise = false;
      testeur.depotDonnees().metsAJourDossierCourant = (idHomologation) => {
        try {
          expect(idHomologation).to.equal('456');
          dossierFinalise = true;

          return Promise.resolve();
        } catch (e) {
          return Promise.reject(e);
        }
      };

      axios.put('http://localhost:1234/api/homologation/456/dossier', { finalise: true })
        .then((reponse) => {
          expect(dossierFinalise).to.be(true);
          expect(reponse.data).to.eql({ idHomologation: '456' });
          done();
        })
        .catch((e) => done(e.response?.data || e));
    });
  });

  describe('quand requête DELETE sur `/api/homologation/:id/autorisationContributeur`', () => {
    beforeEach(() => {
      testeur.depotDonnees().autorisationPour = () => Promise.resolve(new AutorisationCreateur());
      testeur.depotDonnees().supprimeContributeur = () => Promise.resolve();
    });

    it('vérifie que les CGU sont acceptées', (done) => {
      testeur.middleware().verifieRequeteExigeAcceptationCGU({
        method: 'delete',
        url: 'http://localhost:1234/api/homologation/123/autorisationContributeur',
      }, done);
    });

    it("demande au dépôt de vérifier l'autorisation d'accès à l'homologation pour l'utilisateur courant", (done) => {
      let autorisationVerifiee = false;

      testeur.middleware().reinitialise('999');
      testeur.depotDonnees().autorisationPour = (idUtilisateur, idHomologation) => {
        try {
          expect(idUtilisateur).to.equal('999');
          expect(idHomologation).to.equal('123');
          autorisationVerifiee = true;

          return Promise.resolve(new AutorisationCreateur());
        } catch (e) {
          return Promise.reject(e);
        }
      };

      axios.delete('http://localhost:1234/api/homologation/123/autorisationContributeur')
        .then(() => expect(autorisationVerifiee).to.be(true))
        .then(() => done())
        .catch((e) => done(e.response?.data || e));
    });

    it("retourne une erreur HTTP 403 si l'utilisateur courant n'a pas accès à l'homologation", (done) => {
      const autorisationNonTrouvee = undefined;
      testeur.depotDonnees().autorisationPour = () => Promise.resolve(autorisationNonTrouvee);

      testeur.verifieRequeteGenereErreurHTTP(403, "Droits insuffisants pour supprimer un collaborateur de l'homologation \"123\"", {
        method: 'delete',
        url: 'http://localhost:1234/api/homologation/123/autorisationContributeur',
      }, done);
    });

    it("retourne une erreur HTTP 403 si l'utilisateur courant est simple contributeur de l'homologation", (done) => {
      testeur.depotDonnees().autorisationPour = () => Promise.resolve(
        new AutorisationContributeur()
      );

      testeur.verifieRequeteGenereErreurHTTP(403, "Droits insuffisants pour supprimer un collaborateur de l'homologation \"123\"", {
        method: 'delete',
        url: 'http://localhost:1234/api/homologation/123/autorisationContributeur',
      }, done);
    });

    it("demande au dépôt de supprimer l'accès à l'homologation pour le contributeur", (done) => {
      let contributeurSupprime = false;

      testeur.depotDonnees().supprimeContributeur = (idContributeur, idHomologation) => {
        try {
          expect(idContributeur).to.equal('000');
          expect(idHomologation).to.equal('123');
          contributeurSupprime = true;

          return Promise.resolve();
        } catch (e) {
          return Promise.reject(e);
        }
      };

      axios({
        method: 'delete',
        url: 'http://localhost:1234/api/homologation/123/autorisationContributeur',
        data: { idContributeur: '000' },
      })
        .then((reponse) => {
          expect(contributeurSupprime).to.be(true);
          expect(reponse.status).to.equal(200);
          expect(reponse.data).to.equal("Contributeur \"000\" supprimé pour l'homologation \"123\"");
          done();
        })
        .catch((e) => done(e.response?.data || e));
    });

    it('retourne une erreur HTTP 422 si le dépôt a levé une `ErreurModele`', (done) => {
      testeur.depotDonnees().supprimeContributeur = () => Promise.reject(new ErreurModele('Données invalides'));

      testeur.verifieRequeteGenereErreurHTTP(422, 'Données invalides', {
        method: 'delete',
        url: 'http://localhost:1234/api/homologation/123/autorisationContributeur',
      }, done);
    });
  });
});
