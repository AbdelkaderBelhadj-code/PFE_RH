import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeService } from 'src/app/services/EmployeService.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-manage-mes-demandes',
  templateUrl: './manage-mes-demandes.component.html',
  styleUrls: ['./manage-mes-demandes.component.css']
})
export class ManageMesDemandesComponent implements OnInit {
  demandes: any[] = [];
  demandeForm: FormGroup;

  constructor(private fb: FormBuilder, private employeService: EmployeService) {
    this.demandeForm = this.fb.group({
      type: ['', Validators.required],
      jours: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadDemandes();
  }

  loadDemandes() {
    this.employeService.getMesDemandes().subscribe({
      next: (res) => this.demandes = res.demandes,
      error: () => Swal.fire('Erreur', 'Impossible de charger les demandes', 'error')
    });
  }

  onSubmit() {
    if (this.demandeForm.invalid) return;
    this.employeService.createDemandeAbsence(this.demandeForm.value).subscribe({
      next: () => {
        this.loadDemandes();
        this.demandeForm.reset();
        Swal.fire('Succès', 'Demande envoyée', 'success');
      },
      error: () => Swal.fire('Erreur', 'Impossible de créer la demande', 'error')
    });
  }

  delete(id: string) {
    Swal.fire({
      title: 'Supprimer ?',
      text: 'Cette demande sera supprimée si elle est encore en attente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.employeService.deleteDemande(id).subscribe({
          next: () => {
            this.loadDemandes();
            Swal.fire('Supprimée', 'Demande supprimée', 'success');
          },
          error: () => Swal.fire('Erreur', 'Suppression impossible', 'error')
        });
      }
    });
  }
}
