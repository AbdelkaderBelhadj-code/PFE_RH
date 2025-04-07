import Absence from "../models/Absence.js";
import DemandeAbsence from "../models/DemandeAbsence.js";
import Rapport from "../models/Rapport.js";

export const createDemandeAbsence = async (req, res) => {
    try {
      const { type, jours } = req.body;
  
      if (!type || !jours) {
        return res.status(400).json({ success: false, message: 'Type et nombre de jours requis.' });
      }
  
      const demande = await DemandeAbsence.create({
        employe: req.user.id, // l'utilisateur connecté
        type,
        jours,
        statut: 'en attente'
      });
  
      res.status(201).json({ success: true, demande });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  
  export const getMesDemandesAbsence = async (req, res) => {
    try {
      const demandes = await DemandeAbsence.find({ employe: req.user.id }).sort({ createdAt: -1 });
      res.status(200).json({ success: true, demandes });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  
  export const deleteDemandeAbsence = async (req, res) => {
    try {
      const { id } = req.params;
      const demande = await DemandeAbsence.findOne({ _id: id, employe: req.user.id });
  
      if (!demande) {
        return res.status(404).json({ success: false, message: 'Demande non trouvée.' });
      }
  
      if (demande.statut !== 'en attente') {
        return res.status(400).json({ success: false, message: 'Impossible de supprimer une demande traitée.' });
      }
  
      await demande.deleteOne();
      res.status(200).json({ success: true, message: 'Demande supprimée.' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  export const getDemandeAbsenceById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const demande = await DemandeAbsence.findOne({
        _id: id,
        employe: req.user.id
      });
  
      if (!demande) {
        return res.status(404).json({
          success: false,
          message: "Demande non trouvée ou non autorisée."
        });
      }
  
      res.status(200).json({ success: true, demande });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  export const getMesAbsences = async (req, res) => {
    try {
      const absences = await Absence.find({ employe: req.user.id }).sort({ createdAt: -1 });
      res.status(200).json({ success: true, absences });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  
  export const getMesRapports = async (req, res) => {
    try {
      const rapports = await Rapport.find({ employe: req.user.id }).sort({ createdAt: -1 });
      res.status(200).json({ success: true, rapports });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  
  