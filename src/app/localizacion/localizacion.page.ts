import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, Validators, FormGroup, FormBuilder, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StorageService } from '../storage.service';
import { Router } from '@angular/router';
import { SecondsToTimePipe } from '../pipes/seconds-to-time.pipe'; // Ruta correcta al pipe

declare var google:any;

@Component({
  selector: 'app-localizacion',
  templateUrl: './localizacion.page.html',
  styleUrls: ['./localizacion.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, SecondsToTimePipe]
})
export class LocalizacionPage implements OnInit {

viajeTomado: any = null; // Viaje que el usuario ha tomado
tiempoRestante: number = 1800; // Tiempo restante en segundos para cancelar
temporizador: any = null; // Identificador del temporizador

viajes = [
  {
    identificador: 1,
    conductor: 'Aquiles Bailo',
    destino: 'Puente Alto',
    capacidad: 3,
    montoPorPasajero: 1500,
    fecha: '2024/11/09',
    rutaImagen: ''
  },
  {
    identificador: 2,
    conductor: 'Yoel Conductor',
    destino: 'La Florida',
    capacidad: 2,
    costo: 2000,
    montoPorPasajero: 4500,
    fecha: '2024/11/09',
    rutaImagen: ''
  },
];


  constructor(private storageService: StorageService, private router: Router) {}

  async ngOnInit() {
    await this.cargarViajes();
  }

  // Método para cargar los viajes desde el almacenamiento
  async cargarViajes() {
    try {
      this.viajes = await this.storageService.obtenerDatos('viajes') || [];
      
      // Asegurar que todos los viajes tienen un identificador
      this.viajes = this.viajes.map((viaje: any) => {
        if (!viaje.identificador) {
          viaje.identificador = Date.now().toString(); // Generar un identificador único
        }
        return viaje;
      });
  
      console.log('Viajes cargados:', this.viajes);
    } catch (error) {
      console.error('Error al cargar los viajes:', error);
    }
  }

  // Método para tomar un viaje (opcional)
  async tomarViaje(viaje: any) {
    this.viajeTomado = viaje;
    this.tiempoRestante = 30 * 60; // 30 minutos en segundos
    console.log('Viaje tomado:', this.viajeTomado);
  
    // Iniciar temporizador
    this.iniciarTemporizador();
  }

  iniciarTemporizador() {
    if (this.temporizador) {
      clearInterval(this.temporizador); // Limpia cualquier temporizador previo
    }
  
    this.temporizador = setInterval(() => {
      if (this.tiempoRestante > 0) {
        this.tiempoRestante--;
      } else {
        clearInterval(this.temporizador); // Detiene el temporizador cuando llega a 0
        this.viajeTomado = null; // Limpia el viaje tomado
        this.tiempoRestante = 0;
        alert('El tiempo para cancelar el viaje ha expirado.');
      }
    }, 1000); // Actualiza cada segundo
  }



  async cancelarViaje() {
    if (this.viajeTomado) {
      clearInterval(this.temporizador); // Detener el temporizador
      this.viajeTomado = null; // Limpiar el viaje tomado
      this.tiempoRestante = 0; // Reiniciar el tiempo restante
      alert('Has cancelado el viaje.');
    }
  }
}
