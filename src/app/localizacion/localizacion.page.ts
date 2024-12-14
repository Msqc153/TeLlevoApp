import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, Validators, FormGroup, FormBuilder, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StorageService } from '../storage.service';
import { Router } from '@angular/router';
import { SecondsToTimePipe } from '../pipes/seconds-to-time.pipe'; // Ruta correcta al pipe

declare var google:any;

interface Viaje {
  identificador: number;
  conductor: string;
  destino: string;
  capacidad: number;
  capacidadDisponible: number;
  montoPorPasajero: number;
  fecha: string;
  
  rutaImagen: string;
  costo?: number; // Este campo es opcional
}

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
rutas: any[] = []; // Todas las rutas disponibles
rutasFiltradas: any[] = []; // Rutas después de aplicar los filtros
filtroForm: FormGroup;
viajesFiltrados: any[] = [];

viajes = [
  {
    identificador: 1,
    conductor: 'Aquiles Bailo',
    destino: 'Puente Alto',
    capacidad: 3,
    montoPorPasajero: 1500,
    capacidadDisponible:0,
    fecha: '2024/11/09',
    lugarReunion: 'Sede',
    rutaImagen: ''
  },
  {
    identificador: 2,
    conductor: 'Yoel Conductor',
    destino: 'La Florida',
    capacidad: 2,
    costo: 2000,
    montoPorPasajero: 4500,
    capacidadDisponible:0,
    fecha: '2024/11/09',
    lugarReunion: 'Sede',
    rutaImagen: ''
  },
];


  constructor(private storageService: StorageService, private router: Router, private fb: FormBuilder) {
    this.filtroForm = this.fb.group({
      fecha: [''],
      ubicacion: [''],
      cupos: ['']
    });

  }

  async ngOnInit() {
    await this.cargarViajes();
    await this.cargarRutas();
    this.viajesFiltrados  = [...this.viajes];
  }

  // Método para cargar los viajes desde el almacenamiento
  async cargarViajes() {
    try {
      this.viajes = await this.storageService.obtenerDatos('viajes') || [];
  
      // Inicializar capacidadDisponible si no existe
      this.viajes = this.viajes.map((viaje: any) => {
        if (viaje.capacidadDisponible === undefined) {
          viaje.capacidadDisponible = viaje.capacidad || 0;
        }
        return viaje;
      });
  
      console.log('Viajes cargados:', this.viajes);
    } catch (error) {
      console.error('Error al cargar los viajes:', error);
    }
  }

  // Método para tomar un viaje (opcional)
  async tomarViaje(viajeId: number): Promise<void> {
    try {
      const viaje = this.viajes.find((v: any) => v.identificador === viajeId);

      if (!viaje) {
        alert('El viaje no existe.');
        return;
      }

      if (viaje && viaje.capacidadDisponible <= 0) {
        alert('No hay cupos disponibles para este viaje.');
        return;
      }

      viaje.capacidadDisponible -= 1;
      await this.storageService.actualizar('viajes', viaje);

      this.viajeTomado = viaje;
      this.tiempoRestante = 1800; // Reiniciar el temporizador a 30 minutos
      this.iniciarTemporizador();

      alert(`¡Viaje reservado! Lugar de reunión: ${viaje.lugarReunion}`);
    } catch (error) {
      console.error('Error al tomar el viaje:', error);
      alert('Hubo un error al intentar tomar el viaje.');
    }
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

  async cargarRutas() {
    this.rutas = await this.storageService.obtenerDatos('viajes') || [];
    this.rutasFiltradas = [...this.rutas]; // Inicialmente, todas las rutas están visibles
  }

  filtrarViajes() {
    const { fecha, ubicacion, cupos } = this.filtroForm.value;

  this.viajesFiltrados = this.viajes.filter((viaje: any) => {
    // Validación de fecha
    const cumpleFecha = fecha ? this.compararFechas(viaje.fecha, fecha) : true;

    // Validación de ubicación
    const cumpleUbicacion = ubicacion
      ? viaje.destino.toLowerCase().includes(ubicacion.toLowerCase())
      : true;

    // Validación de cupos
    const cumpleCupos = cupos ? viaje.capacidadDisponible >= +cupos : true;

    // Retorna true solo si todas las condiciones se cumplen
    return cumpleFecha && cumpleUbicacion && cumpleCupos;
  });

  // Log para depuración
  console.log('Viajes después de aplicar los filtros:', this.viajesFiltrados);

  if (this.viajesFiltrados.length === 0) {
    alert('No se encontraron viajes que cumplan con los filtros seleccionados.');
  }}
  
  private compararFechas(fechaViaje: string, fechaFiltro: string): boolean {
    // Asegúrate de que ambas fechas estén en el mismo formato (YYYY/MM/DD)
    const fechaViajeNormalizada = new Date(fechaViaje).toISOString().split('T')[0];
    const fechaFiltroNormalizada = new Date(fechaFiltro).toISOString().split('T')[0];
    return fechaViajeNormalizada === fechaFiltroNormalizada;
  }

  resetearFiltros() {
    this.filtroForm.reset(); // Limpia los campos del formulario
    this.viajesFiltrados = [...this.viajes]; // Muestra todos los viajes nuevamente
    console.log('Filtros reseteados. Viajes:', this.viajesFiltrados);
  }


  async cancelarViaje(viajeId: number): Promise<void> {
    if (this.viajeTomado) {
      try {
        clearInterval(this.temporizador);

        // Restaurar la capacidad del viaje
        const viaje = this.viajes.find(
          (v: any) => v.identificador === this.viajeTomado.identificador
        );
        if (viaje) {
          viaje.capacidadDisponible += 1;
          await this.storageService.actualizar('viajes', viaje);
        }

        this.viajeTomado = null;
        this.tiempoRestante = 0;

        alert('Has cancelado tu reserva exitosamente.');
      } catch (error) {
        console.error('Error al cancelar el viaje:', error);
        alert('Hubo un error al intentar cancelar el viaje.');
      }
    }
  }
}
