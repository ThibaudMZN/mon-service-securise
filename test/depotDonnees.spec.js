const expect = require('expect.js');
const bcrypt = require('bcrypt');

const DepotDonnees = require('../src/depotDonnees');
const Homologation = require('../src/modeles/homologation');
const Utilisateur = require('../src/modeles/utilisateur');

describe('Le dépôt de données', () => {
  describe('quand il est vide', () => {
    it('ne retourne aucune homologation', () => {
      const depot = DepotDonnees.creeDepotVide();
      expect(depot.homologations('456')).to.eql([]);
    });

    it("n'authentifie pas l'utilisateur", (done) => {
      const depot = DepotDonnees.creeDepotVide();
      depot.utilisateurAuthentifie('jean.dupont@mail.fr', 'mdp_12345')
        .then((utilisateur) => {
          expect(utilisateur).to.be(undefined);
          done();
        })
        .catch((error) => done(error));
    });
  });

  it("connaît toutes les homologations d'un utilisateur donné", () => {
    const depot = DepotDonnees.creeDepot({
      homologations: [
        { id: '123', idUtilisateur: '456', nomService: 'Super Service' },
        { id: '789', idUtilisateur: '999', nomService: 'Un autre service' },
      ],
    });

    const homologations = depot.homologations('456');
    expect(homologations.length).to.equal(1);
    expect(homologations[0]).to.be.a(Homologation);
    expect(homologations[0].id).to.equal('123');
  });

  it("retourne l'utilisateur authentifié", (done) => {
    const adaptateurJWT = {};

    bcrypt.hash('mdp_12345', 10)
      .then(async (hash) => {
        const depot = DepotDonnees.creeDepot({
          utilisateurs: [{
            id: '123', prenom: 'Jean', nom: 'Dupont', email: 'jean.dupont@mail.fr', motDePasse: hash,
          }],
        }, adaptateurJWT);

        return depot.utilisateurAuthentifie('jean.dupont@mail.fr', 'mdp_12345');
      })
      .then((utilisateur) => {
        expect(utilisateur).to.be.an(Utilisateur);
        expect(utilisateur.id).to.equal('123');
        expect(utilisateur.adaptateurJWT).to.equal(adaptateurJWT);

        done();
      })
      .catch((error) => done(error));
  });
});
