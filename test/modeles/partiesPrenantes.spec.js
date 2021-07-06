const expect = require('expect.js');

const PartiesPrenantes = require('../../src/modeles/partiesPrenantes');

describe("L'ensemble des parties prenantes", () => {
  it('connaît ses constituants', () => {
    const partiesPrenantes = new PartiesPrenantes({
      autoriteHomologation: 'Jean Dupont',
      fonctionAutoriteHomologation: 'Maire',
      piloteProjet: 'Sylvie Martin',
      expertCybersecurite: 'Anna Dubreuil',
    });

    expect(partiesPrenantes.autoriteHomologation).to.equal('Jean Dupont');
    expect(partiesPrenantes.fonctionAutoriteHomologation).to.equal('Maire');
    expect(partiesPrenantes.piloteProjet).to.equal('Sylvie Martin');
    expect(partiesPrenantes.expertCybersecurite).to.equal('Anna Dubreuil');
  });

  describe("sur interrogation sur l'équipe de préparation du dossier", () => {
    it("retourne les noms du pilote du projet de l'expert cybersécurité", () => {
      const partiesPrenantes = new PartiesPrenantes({
        piloteProjet: 'Sylvie Martin',
        expertCybersecurite: 'Anna Dubreuil',
      });

      expect(partiesPrenantes.descriptionEquipePreparation()).to.equal(
        'Sylvie Martin (responsable du projet), Anna Dubreuil (expert cybersécurité)'
      );
    });

    it("ne parle pas du responsable du projet si l'information est inexistante", () => {
      const partiesPrenantes = new PartiesPrenantes({ expertCybersecurite: 'Anna Dubreuil' });

      expect(partiesPrenantes.descriptionEquipePreparation()).to.equal(
        'Anna Dubreuil (expert cybersécurité)'
      );
    });

    it("ne parle pas de l'expert cyber si l'information est inexistante", () => {
      const partiesPrenantes = new PartiesPrenantes({ piloteProjet: 'Sylvie Martin' });

      expect(partiesPrenantes.descriptionEquipePreparation()).to.equal(
        'Sylvie Martin (responsable du projet)'
      );
    });

    it('retourne une valeur par défaut', () => {
      const partiesPrenantes = new PartiesPrenantes();
      expect(partiesPrenantes.descriptionEquipePreparation()).to.equal('Information non renseignée');
    });
  });

  describe("sur une interrogation sur l'autorité d'homologation", () => {
    it("présente les informations relatives à l'autorité d'homologation", () => {
      const partiesPrenantes = new PartiesPrenantes({
        autoriteHomologation: 'Jean Dupont',
        fonctionAutoriteHomologation: 'Maire',
      });

      expect(partiesPrenantes.descriptionAutoriteHomologation()).to.equal('Jean Dupont (Maire)');
    });

    it("ne mentionne pas la fonction de l'autorité d'homologation si info inexistante", () => {
      const partiesPrenantes = new PartiesPrenantes({
        autoriteHomologation: 'Jean Dupont',
      });

      expect(partiesPrenantes.descriptionAutoriteHomologation()).to.equal(
        'Jean Dupont (fonction non renseignée)'
      );
    });

    it("ne mentionne pas l'autorité d'homologation si info inexistante", () => {
      const partiesPrenantes = new PartiesPrenantes({ fonctionAutoriteHomologation: 'Maire' });
      expect(partiesPrenantes.descriptionAutoriteHomologation()).to.equal(
        'Information non renseignée'
      );
    });
  });

  it('sait se présenter au format JSON', () => {
    const partiesPrenantes = new PartiesPrenantes({
      autoriteHomologation: 'Jean Dupont',
      fonctionAutoriteHomologation: 'Maire',
      piloteProjet: 'Sylvie Martin',
      expertCybersecurite: 'Anna Dubreuil',
    });

    expect(partiesPrenantes.toJSON()).to.eql({
      autoriteHomologation: 'Jean Dupont',
      fonctionAutoriteHomologation: 'Maire',
      piloteProjet: 'Sylvie Martin',
      expertCybersecurite: 'Anna Dubreuil',
    });
  });

  it('presente un JSON partiel si certaines parties prenantes ne sont pas définies', () => {
    const partiesPrenantes = new PartiesPrenantes();
    expect(partiesPrenantes.toJSON()).to.eql({});
  });
});
