const expect = require('expect.js');

const { ErreurDossiersInvalides } = require('../../src/erreurs');
const Dossier = require('../../src/modeles/dossier');
const Dossiers = require('../../src/modeles/dossiers');

const ils = it;

describe('Les dossiers liés à un service', () => {
  ils("exigent qu'il n'y ait qu'un seul dossier maximum non finalisé", (done) => {
    try {
      new Dossiers({ dossiers: [{ id: '1', finalise: true }, { id: '2' }, { id: '3' }] });
      done('La création des dossiers aurait dû lever une exception');
    } catch (e) {
      expect(e).to.be.an(ErreurDossiersInvalides);
      expect(e.message).to.equal("Les dossiers ne peuvent pas avoir plus d'un dossier non finalisé");
      done();
    }
  });

  ils('retournent comme dossier courant le dossier non finalisé', () => {
    const dossiers = new Dossiers({ dossiers: [{ id: '1', finalise: true }, { id: '2' }] });

    const dossierCourant = dossiers.dossierCourant();
    expect(dossierCourant).to.be.a(Dossier);
    expect(dossierCourant.id).to.equal('2');
  });

  ils('retournent comme dossiers finalisés ceux qui ne sont pas le dossier courant', () => {
    const dossiers = new Dossiers({ dossiers: [{ id: '1', finalise: true }, { id: '2' }] });

    const dossiersFinalises = dossiers.finalises();
    expect(dossiersFinalises.length).to.equal(1);
    expect(dossiersFinalises[0].id).to.equal('1');
  });
});
