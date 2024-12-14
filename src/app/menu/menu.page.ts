import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'
import { addIcons } from 'ionicons';
import { homeOutline, personCircleOutline, pinOutline, searchOutline,location, logOutOutline, addCircleOutline, carOutline, logIn } from 'ionicons/icons';
import { Router,RouterModule } from '@angular/router';
import { StorageService } from '../storage.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MenuPage implements OnInit {
  isLoggedIn : boolean =  false; // Estado de inicio de sesión
  currentUser: any = null;
  tipoUsuario: string | null = null;

  constructor(private storageService: StorageService, private router: Router) {

    addIcons({'log-in':logIn ,'log-out-outline':logOutOutline,'home-outline':homeOutline, 'person-circle-outline':personCircleOutline,'search-outline':searchOutline,'pin-outline':pinOutline,location,'add-circle-outline':addCircleOutline,'car-outline':carOutline,
       

    })

   }

  async ngOnInit() {
    this.currentUser = await this.storageService.getUsuarioActual();
    this.isLoggedIn = !!this.currentUser; // Convierte a booleano

    // Escucha cambios en el estado del usuario
    this.storageService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });
  }
  async logout() {
    try {
      await this.storageService.eliminarUsuarioActual(); // Llama al método del servicio
      this.isLoggedIn = false; // Actualiza el estado
      this.router.navigate(['/menu/login']); // Redirige al usuario al login
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Ocurrió un error al cerrar la sesión.');
    }
  }

}
