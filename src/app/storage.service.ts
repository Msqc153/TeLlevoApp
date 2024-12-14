import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  datos:any[]=[];
  dato:any={};

  private storage: Storage | null = null;
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  

  constructor(private storageInstance: Storage) {
    this.init().then(() => {
      console.log('Almacenamiento inicializado correctamente');
    });
   }

 // Inicializa el almacenamiento
 private async init() {
    // Configurar libreria
    const storage = await this.storageInstance.create();
    console.log('almacenamiento creado')

    if(!this.storage){
      this.storage =await this.storageInstance.create();
    }
  }

  // Método que asegura que el almacenamiento está inicializado
  private async ensureStorage(): Promise<Storage> {
    if (!this.storage) {
      await this.init(); // Inicializa si no está listo
    }
    return this.storage as Storage; // Garantiza que `this.storage` no sea null
  }
  

// Agregar un elemento a una colección específica
async agregar(key: string, jsonAgregar: any): Promise<boolean> {
  try {
    console.log(`Intentando agregar al storage con clave "${key}" y datos:`, jsonAgregar);

    // Asegurar que el almacenamiento esté inicializado
    const storage = await this.ensureStorage();
    console.log('Storage inicializado correctamente.');

    // Obtener datos existentes
    const currentData = (await storage.get(key)) || [];
    console.log('Datos actuales en el storage:', currentData);

    // Verificar si ya existe el dato
    const existe = currentData.find((item: any) => item.identificador === jsonAgregar.identificador);
    if (existe) {
      console.log('El dato ya existe en el storage.');
      return false; // No agregar porque ya existe
    }

    // Agregar el nuevo dato
    currentData.push(jsonAgregar);
    await storage.set(key, currentData);
    console.log('Dato agregado con éxito:', currentData);

    return true; // Indicar éxito
  } catch (error) {
    console.error('Error en el método agregar:', error);
    return false; // Indicar fallo
  }
}

// Obtener un dato específico de una colección
  async obtenerDato(key: string, identificador: string) {
    try {
      const storage = await this.ensureStorage();
      const datos = (await storage.get(key)) || [];
      const dato = datos.find((item: any) => item.identificador === identificador);
      console.log(`Dato obtenido con identificador "${identificador}":`, dato);
      return dato;
    } catch (error) {
      console.error('Error al obtener el dato:', error);
      return null;
    }}


// Obtener todos los datos de una colección
  async obtenerDatos(key: string) {
    try {
      const storage = await this.ensureStorage();
      const datos = (await storage.get(key)) || [];
      console.log(`Datos obtenidos de la clave "${key}":`, datos);
      return datos;
    } catch (error) {
      console.error(`Error al obtener datos de "${key}":`, error);
      return [];
    }

  }

// Eliminar un dato específico de una colección
async eliminar(key: string, identificador: string): Promise<void> {
  try {
    const storage = await this.ensureStorage();
    const datos = await(storage.get(key)) || '[]';
    const nuevosDatos = datos.filter((item: any) => item.identificador !== identificador);

    // Actualiza el almacenamiento con los datos restantes
     await storage.set(key,nuevosDatos);
    console.log(`Viaje con identificador ${identificador} eliminado correctamente.`);
  } catch (error) {
    console.error('Error al eliminar el dato:', error);
    throw error;
  }
}

// Actualizar un dato específico de una colección
  async actualizar(key: string, jsonModificado: any){
    try {
      const storage = await this.ensureStorage();
      const datos = (await storage.get(key)) || [];
      const indice = datos.findIndex((item: any) => item.identificador === jsonModificado.identificador);

      if (indice !== -1) {
        datos[indice] = jsonModificado;
        await storage.set(key, datos);
        console.log(`Elemento con identificador "${jsonModificado.identificador}" actualizado correctamente.`);
      } else {
        console.error('Elemento no encontrado para actualizar.');
      }
    } catch (error) {
      console.error('Error al actualizar el dato:', error);
    }
    }
  

    // Establecer el usuario actual
async setUsuarioActual(usuario: any): Promise<void> {
  try {
    const storage = await this.ensureStorage();
    await storage.set('currentUser', usuario);
    this.currentUserSubject.next(usuario); // Actualiza el estado global
    console.log('Usuario actual establecido:', usuario);
  } catch (error) {
    console.error('Error al establecer el usuario actual:', error);
  }
}
// Obtener el usuario actual

async getUsuarioActual(): Promise<any> {
  try {
    const storage = await this.ensureStorage();
    const usuario = await storage.get('currentUser');
    this.currentUserSubject.next(usuario); // Sincroniza con el estado global
    console.log('Usuario actual obtenido:', usuario);
    return usuario;
  } catch (error) {
    console.error('Error al obtener el usuario actual:', error);
    return null;
  }
  }

  async eliminarUsuarioActual(): Promise<void> {
    try {
      const storage = await this.ensureStorage(); // Asegura que el almacenamiento esté inicializado
      await storage.remove('currentUser'); // Elimina el usuario actual
      console.log('Sesión cerrada correctamente.');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
