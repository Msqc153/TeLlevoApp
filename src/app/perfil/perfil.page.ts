import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StorageService } from '../storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PerfilPage implements OnInit {
  usuarioActual: any;

  constructor(private storageService: StorageService, private router: Router) { }

  async ngOnInit() {
    try {
      this.usuarioActual = await this.storageService.getUsuarioActual();
      console.log('Usuario obtenido en PerfilPage:', this.usuarioActual);
    } catch (error) {
      console.error('Error al obtener el usuario actual:', error);
    }
  }

}
