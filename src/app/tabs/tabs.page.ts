import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from  '@ionic/angular';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class TabsPage implements OnInit {
  tipoUsuario: string | null = null;

  constructor(private storageService: StorageService) { }

  async ngOnInit() {
    const currentUser = await this.storageService.getUsuarioActual();
    if (currentUser) {
      this.tipoUsuario = currentUser.tipoUsuario; // Debe ser 'conductor' o 'pasajero'
    }
  }

}
