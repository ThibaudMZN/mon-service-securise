const expect = require('expect.js');

const Referentiel = require('../../src/referentiel');
const Homologation = require('../../src/modeles/homologation');

describe('Une homologation', () => {
  it('sait se convertir en JSON', () => {
    const homologation = new Homologation({
      id: '123', idUtilisateur: '456', nomService: 'Super Service',
    });

    expect(homologation.toJSON()).to.eql({
      id: '123', nomService: 'Super Service',
    });
  });

  it('sait décrire la nature du service', () => {
    const referentiel = Referentiel.creeReferentiel({
      naturesService: {
        uneNature: { description: 'Une nature' },
        uneAutre: { description: 'Une autre' },
      },
    });
    const homologation = new Homologation({
      id: '123', idUtilisateur: '456', nomService: 'nom', natureService: ['uneNature', 'uneAutre'],
    }, referentiel);

    expect(homologation.descriptionNatureService()).to.equal('Une nature, Une autre');
  });

  it("se comporte correctement si la nature du service n'est pas présente", () => {
    const homologation = new Homologation({ id: '123', idUtilisateur: '456', nomService: 'nom' });
    expect(homologation.descriptionNatureService()).to.equal('Nature du service non renseignée');
  });

  it('connaît ses caractéristiques complémentaires', () => {
    const referentiel = Referentiel.creeReferentiel({
      localisationsDonnees: { france: { description: 'Quelque part en France' } },
    });
    const homologation = new Homologation({
      id: '123',
      caracteristiquesComplementaires: {
        presentation: 'Une présentation',
        structureDeveloppement: 'Une structure',
        hebergeur: 'Un hébergeur',
        localisationDonnees: 'france',
      },
    }, referentiel);

    expect(homologation.presentation()).to.equal('Une présentation');
    expect(homologation.structureDeveloppement()).to.equal('Une structure');
    expect(homologation.hebergeur()).to.equal('Un hébergeur');
    expect(homologation.localisationDonnees()).to.equal('Quelque part en France');
  });

  it('connait ses parties prenantes', () => {
    const homologation = new Homologation({
      id: '123',
      partiesPrenantes: {
        autoriteHomologation: 'Jean Dupont',
        fonctionAutoriteHomologation: 'Maire',
        piloteProjet: 'Sylvie Martin',
        expertCybersecurite: 'Anna Dubreuil',
      },
    });

    expect(homologation.autoriteHomologation()).to.equal('Jean Dupont');
    expect(homologation.fonctionAutoriteHomologation()).to.equal('Maire');
    expect(homologation.piloteProjet()).to.equal('Sylvie Martin');
    expect(homologation.expertCybersecurite()).to.equal('Anna Dubreuil');
  });

  it("sait décrire l'équipe de préparation du dossier", () => {
    const homologation = new Homologation({
      id: '123',
      partiesPrenantes: { piloteProjet: 'Sylvie Martin' },
    });

    expect(homologation.descriptionEquipePreparation()).to.equal(
      'Sylvie Martin (responsable du projet)'
    );
  });

  it("sait décrire l'autorité d'homologation", () => {
    const homologation = new Homologation({
      id: '123',
      partiesPrenantes: {
        autoriteHomologation: 'Jean Dupont', fonctionAutoriteHomologation: 'Maire',
      },
    });

    expect(homologation.descriptionAutoriteHomologation()).to.equal('Jean Dupont (Maire)');
  });
});
