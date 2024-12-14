import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from  '@ionic/angular' ;
import { FormsModule } from '@angular/forms';
import { StorageService } from '../storage.service';
import { MenuController } from '@ionic/angular'
import { addIcons } from 'ionicons';
import { calendarOutline, carOutline, homeOutline, logOutOutline, mapOutline, peopleOutline, personCircleOutline, pinOutline, searchOutline } from 'ionicons/icons';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
export class HomePage  implements OnInit {

  par_username: string | null = 'Invitado';
  constructor(private storageService: StorageService, private menuCtrl: MenuController, private router: Router) {

    addIcons({
      'log-out-outline':logOutOutline,'home-outline':homeOutline, 'person-circle-outline':personCircleOutline,'search-outline':searchOutline,'pin-outline':pinOutline, 'car-outline':carOutline, 'calendar-outline':calendarOutline,'people-outline':peopleOutline,'map-outline':mapOutline
   })

  }
  async ngOnInit() {
    try {
      // Obtén el usuario actual desde el servicio de almacenamiento
      const usuarioActual = await this.storageService.getUsuarioActual();

      if (usuarioActual && usuarioActual.username) {
        this.par_username = usuarioActual.username; // Asigna el nombre del usuario logueado
      } else {
        this.par_username = 'Invitado'; // Si no hay usuario logueado, usa "Invitado"
      }
    } catch (error) {
      console.error('Error al obtener el usuario actual:', error);
      this.par_username = 'Invitado';
    }
  }
  async ionViewWillEnter() {
    // Verifica nuevamente el usuario al volver a esta página
    const user = await this.storageService.obtenerDato('usuarios', 'currentUser');
  this.par_username = user ? user.username : 'Invitado';
  }

  async logout() {
    // Limpia el usuario actual del almacenamiento
    await this.storageService.eliminar('usuarios', 'currentUser');
  // Redirige al login
  this.router.navigate(['/menu/login']);
  }

  
}

