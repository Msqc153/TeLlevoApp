import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, Validators, FormGroup, FormBuilder, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StorageService } from '../storage.service';
import { Router } from '@angular/router';

declare var google:any;

@Component({
  selector: 'app-programa-viaje',
  templateUrl: './programaviaje.page.html',
  styleUrls: ['./programaviaje.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ProgramaviajePage implements OnInit {
//variables de trabajo del mapa
mapa:any;
marker:any;
puntoreferencia={lat:-33.59840697243229 , lng:-70.57878707498998}
search:any;
//variables para calcular 2 puntos
directionsService:any;
directionsRenderer:any;

capacidad: number | null = null;
costo: number | null = null;
destino: string | null = null;

viajeForm: FormGroup;

constructor(private storageService: StorageService, private router: Router, private fb: FormBuilder) {
  this.viajeForm = this.fb.group({
    capacidad: [null, [Validators.required, Validators.min(1), Validators.max(8)]],
    costo: [null, [Validators.required, Validators.min(0)]],
    fecha: [null,[Validators.required]],
    autocomplete: [null, [Validators.required]],
    lugarReunion: ['', Validators.required],
  });
}

ngOnInit() {
  
}

ionViewDidEnter() {
  setTimeout(() => {
  const mapElement = document.getElementById('map');
if (mapElement) {
  mapElement.innerHTML = ''; // Limpia el contenedor del mapa antes de redibujarlo
}
  this.dibujarMapa(); // Inicializa el mapa después de que la vista está completamente cargada
  this.buscaDireccion(this.mapa, this.marker); // Configura el autocompletado
},300);
}

dibujarMapa(){
  var mapElement=document.getElementById('map')

  if(mapElement){
    this.mapa= new google.maps.Map(
      mapElement,
      {center:this.puntoreferencia,
        zoom:15
      })
    this.marker = new google.maps.Marker(
      {
        position: this.puntoreferencia,
        map:this.mapa
      })  
  
  //se inician las variables para calcular ruta
  this.directionsService= new google.maps.DirectionsService();
  this.directionsRenderer= new google.maps.DirectionsRenderer();
  this.directionsRenderer.setMap(this.mapa);

  //variables para la caja de calculo
  var trayecto =document.getElementById('trayecto') as HTMLIonInputElement | null;
  this.directionsRenderer.setPanel(trayecto);
    }else {
      // Si ya hay un mapa, centra nuevamente en la posición inicial
      this.mapa.setCenter(this.puntoreferencia);
      this.mapa.setZoom(15);
    }


}//fin dibujamapa

buscaDireccion(mapaLocal:any, marcadorLocal:any){
  const input = document.getElementById('autocomplete') as HTMLInputElement;

  if (input) {
    const autocomplete = new google.maps.places.Autocomplete(input);
    this.search = autocomplete;

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place || !place.geometry || !place.geometry.location) {
        alert('El lugar seleccionado no es válido.');
        return;
      }

      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      mapaLocal.setCenter(location);
      marcadorLocal.setPosition(location);

      // Actualizar el campo del formulario con el destino seleccionado
      this.viajeForm.patchValue({ autocomplete: place.formatted_address });

      console.log('Lugar seleccionado:', location);
    });
  } else {
    console.error('Elemento con id "autocomplete" no encontrado.');
  }
}
calculaRuta(){
  if (!this.search || !this.search.getPlace) {
    alert('Por favor, selecciona un destino válido.');
    return;
  }

  const place = this.search.getPlace();
  if (!place || !place.geometry || !place.geometry.location) {
    alert('El destino seleccionado no es válido. Por favor, elige una opción del autocompletado.');
    return;
  }

  const destino = this.search.getPlace().geometry.location;

  const request = {
    origin: this.puntoreferencia,
    destination: destino,
    travelMode: google.maps.TravelMode.DRIVING,
  };

  this.directionsService.route(request, (result: any, status: any) => {
    if (status === google.maps.DirectionsStatus.OK) {
      this.directionsRenderer.setDirections(result);

      // Obtener distancia y calcular costo
      
      const leg = result.routes[0].legs[0];
      const distanciaEnKm = leg.distance.value / 1000; // Distancia en kilómetros
      const costoBase = 500; // Ejemplo: tarifa base por kilómetro
      

      const capacidad = this.viajeForm.get('capacidad')?.value;

      // Validar que la capacidad sea un número válido
      if (!capacidad || capacidad <= 0) {
        alert('Por favor, ingresa una capacidad válida antes de calcular la ruta.');
        return;
      }

      const costoPorPasajero = Math.round((distanciaEnKm * costoBase)/ capacidad);
      // Actualizar el formulario con la distancia y el costo
      this.viajeForm.patchValue({
        destino: leg.end_address,
        costo: costoPorPasajero,
      });

      console.log(`Distancia: ${distanciaEnKm} km, Costo: ${costoPorPasajero} CLP`);
    } else {
      alert('No se pudo calcular la ruta. Intenta de nuevo.');
    }
  });
}//fin calcularuta

async programarViaje() {
  console.log('Método programarViaje ejecutado');

  if (this.viajeForm.valid) {
    console.log('Formulario válido:', this.viajeForm.value);
    try {
      // Recupera al usuario actual de forma segura
      const usuario = await this.storageService.getUsuarioActual();
      console.log('Usuario actual recuperado en programarViaje:', usuario);

      if (!usuario) {
        alert('Debes estar autenticado para programar un viaje.');
        return;
      }

      // Generar URL de Static Maps
      const destination = (document.getElementById('autocomplete') as HTMLInputElement).value;
      const origin = '-33.59840697243229 ,-70.57878707498998'; // Santiago, Chile
      const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=600x300&markers=color:red|${origin}&markers=color:green|${destination}&path=${origin}|${destination}&key=AIzaSyC9i2S9SKxBwLmGYtnVuYvBwyiC0aCnOFg`;

      // Crea el objeto del viaje
      const viaje = {
        identificador: Date.now(), // ID único
        conductor: usuario.username,
        destino: this.viajeForm.value.autocomplete, // Usa el destino del formulario
        montoPorPasajero: this.viajeForm.value.costo,
        capacidad: this.viajeForm.value.capacidad,
        capacidadDisponible: this.viajeForm.value.capacidad, // Inicializa la capacidad disponible
        fecha: this.viajeForm.value.fecha, // Fecha seleccionada
        lugarReunion: this.viajeForm.value.lugarReunion,
        rutaImagen: staticMapUrl,
      };

      console.log('Intentando guardar el viaje:', viaje);

      // Agrega el viaje al almacenamiento sin tocar el usuario actual
      const success = await this.storageService.agregar('viajes', viaje);
      if (success) {
        alert('¡Viaje programado exitosamente!');
        this.router.navigate(['/menu/home']);
      } else {
        alert('El viaje ya existe o no se pudo guardar.');
      }
    } catch (error) {
      console.error('Error al programar el viaje:', error);
      alert('Ocurrió un error al programar el viaje.');
    }
  } else {
    console.log('Valor del campo lugarReunion:', this.viajeForm.value.lugarReunion);
    console.log('Errores del formulario:', this.viajeForm.errors);
    console.log('Estado de cada campo:', this.viajeForm.controls);
    console.log('Formulario inválido:', this.viajeForm.errors);
    Object.keys(this.viajeForm.controls).forEach((key) => {
      const control = this.viajeForm.get(key);
      console.log(`Estado del campo ${key}:`, control?.valid);
      console.log(`Errores del campo ${key}:`, control?.errors)});
    alert('Completa todos los campos correctamente.');
  }
}

async agregar(key: string, data: any): Promise<boolean> {
  try {
    // Obtener los datos actuales desde localStorage
    const currentData = JSON.parse(localStorage.getItem(key) || '[]');

    // Verificar si un viaje similar ya existe
    const existe = currentData.some((item: any) =>
      item.conductor === data.conductor &&
      item.destino === data.destino &&
      item.fecha === data.fecha
    );

    if (existe) {
      console.log('El viaje ya existe en el storage.');
      return false; // No agregar si ya existe
    }

    // Agregar el nuevo dato al array
    currentData.push(data);

    // Guardar de nuevo en localStorage
    localStorage.setItem(key, JSON.stringify(currentData));

    console.log('Viaje guardado con éxito:', currentData);
    return true; // Operación exitosa
  } catch (error) {
    console.error('Error al guardar en el storage:', error);
    return false; // Operación fallida
  }
}

async obtenerDatos(key: string) {
  try {
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    return data;
  } catch (error) {
    console.error('Error al obtener datos del storage:', error);
    return [];
  }


}

}

