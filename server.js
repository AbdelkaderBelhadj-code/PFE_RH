import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './controllers/authController.js';
import {
  createEmploye,
  updateEmploye,
  deleteEmploye,
  createRapport,
  updateRapport,
  deleteRapport,
  addAbsence,
  updateAbsence,
  deleteAbsence,
  getAllRapports,
  getRapportsByEmploye,
  getAllAbsences,
  getAbsencesByEmploye,
  getAllEmployes,
  getAllDemandesAbsence,
  traiterDemandeAbsence, 
} from './controllers/rhAdminController.js';


import {
  createDemandeAbsence,
  getMesDemandesAbsence,
  getDemandeAbsenceById,
  deleteDemandeAbsence,
  getMesAbsences,
  getMesRapports
} from './controllers/employeController.js';



import { protect, authorize } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);

app.post('/api/rh/employe', protect, authorize('Admin_RH'), createEmploye);
app.put('/api/rh/employe/:id', protect, authorize('Admin_RH'), updateEmploye);
app.delete('/api/rh/employe/:id', protect, authorize('Admin_RH'), deleteEmploye);

app.post('/api/rh/rapport', protect, authorize('Admin_RH', 'manager'), createRapport);
app.put('/api/rh/rapport/:id', protect, authorize('Admin_RH', 'manager'), updateRapport);
app.delete('/api/rh/rapport/:id', protect, authorize('Admin_RH', 'manager'), deleteRapport);

app.post('/api/rh/absence', protect, authorize('Admin_RH', 'manager'), addAbsence);
app.put('/api/rh/absence/:id', protect, authorize('Admin_RH', 'manager'), updateAbsence);
app.delete('/api/rh/absence/:id', protect, authorize('Admin_RH', 'manager'), deleteAbsence);

app.get('/api/rh/rapports', protect, authorize('Admin_RH', 'manager'), getAllRapports);
app.get('/api/rh/rapports/:employeId', protect, authorize('Admin_RH', 'manager'), getRapportsByEmploye);

app.get('/api/rh/absences', protect, authorize('Admin_RH', 'manager'), getAllAbsences);
app.get('/api/rh/absences/:employeId', protect, authorize('Admin_RH', 'manager'), getAbsencesByEmploye);

app.get('/api/rh/employes', protect, authorize('Admin_RH', 'manager'), getAllEmployes);

app.get('/api/rh/demandes-absence', protect, authorize('Admin_RH', 'manager'), getAllDemandesAbsence);
app.put('/api/rh/demande-absence/:id', protect, authorize('Admin_RH', 'manager'), traiterDemandeAbsence);



app.post('/api/employe/demande-absence', protect, authorize('employé'), createDemandeAbsence);
app.get('/api/employe/mes-demandes', protect, authorize('employé'), getMesDemandesAbsence);
app.get('/api/employe/mes-demandes/:id', protect, authorize('employé'), getDemandeAbsenceById);
app.delete('/api/employe/demande-absence/:id', protect, authorize('employé'), deleteDemandeAbsence);


app.get('/api/employe/mes-absences', protect, authorize('employé'), getMesAbsences);
app.get('/api/employe/mes-rapports', protect, authorize('employé'), getMesRapports);


app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
