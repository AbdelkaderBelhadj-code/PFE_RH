import mongoose from 'mongoose';

const demandeAbsenceSchema = new mongoose.Schema({
  employe: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['congé', 'maladie'], required: true },
  jours: { type: Number, required: true },
  statut: { type: String, enum: ['en attente', 'acceptée', 'refusée'], default: 'en attente' }
}, { timestamps: true });

export default mongoose.model('DemandeAbsence', demandeAbsenceSchema);
