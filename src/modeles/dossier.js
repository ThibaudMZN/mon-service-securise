const InformationsHomologation = require('./informationsHomologation');
const { ErreurDateHomologationInvalide, ErreurDureeValiditeInvalide } = require('../erreurs');
const Referentiel = require('../referentiel');
const { ajouteMoisADate, dateEnFrancais, dateInvalide } = require('../utilitaires/date');

class Dossier extends InformationsHomologation {
  constructor(donneesDossier = {}, referentiel = Referentiel.creeReferentielVide()) {
    donneesDossier.finalise = !!donneesDossier.finalise;

    super({ proprietesAtomiquesFacultatives: ['id', 'dateHomologation', 'dureeValidite', 'finalise'] });
    Dossier.valide(donneesDossier, referentiel);
    this.renseigneProprietes(donneesDossier);

    this.referentiel = referentiel;
  }

  descriptionDateHomologation() {
    if (!this.dateHomologation) {
      return '';
    }

    return dateEnFrancais(this.dateHomologation);
  }

  descriptionDureeValidite() {
    if (!this.dureeValidite) {
      return '';
    }

    return this.referentiel.descriptionEcheanceRenouvellement(this.dureeValidite);
  }

  descriptionProchaineDateHomologation() {
    if (!this.dateHomologation || !this.dureeValidite) {
      return '';
    }

    const date = new Date(this.dateHomologation);
    const nbMois = this.referentiel.nbMoisDecalage(this.dureeValidite);

    return dateEnFrancais(ajouteMoisADate(nbMois, date));
  }

  estComplet() {
    return !!this.dateHomologation && !!this.dureeValidite;
  }

  static valide({ dateHomologation, dureeValidite }, referentiel) {
    const identifiantsDureesHomologation = referentiel.identifiantsEcheancesRenouvellement();
    if (dureeValidite && !identifiantsDureesHomologation.includes(dureeValidite)) {
      throw new ErreurDureeValiditeInvalide(
        `La durée de validité "${dureeValidite}" est invalide`
      );
    }

    if (dateHomologation && dateInvalide(dateHomologation)) {
      throw new ErreurDateHomologationInvalide(
        `La date "${dateHomologation}" est invalide`
      );
    }
  }
}

module.exports = Dossier;
