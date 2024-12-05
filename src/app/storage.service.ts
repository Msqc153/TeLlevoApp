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
    const storage = await this.ensureStorage(); // Asegura que el storage está inicializado
    this.datos =  await this.storage?.get(key) || [];
    this.dato = this.datos.find(valor => valor.identificador == identificador);
    return this.dato;
  }

// Obtener todos los datos de una colección
  async obtenerDatos(key: string) {
    const storage = await this.ensureStorage(); // Asegura que el storage está inicializado
    if (!this.storage) {
      throw new Error ('Storage no esta inicializado')
     }
     this.datos =await this.storage.get(key) || [];
     return this.datos;
  }

// Eliminar un dato específico de una colección
async eliminar(key: string, identificador: string): Promise<void> {
  try {
    const datos = JSON.parse(localStorage.getItem(key) || '[]');
    const nuevosDatos = datos.filter((item: any) => item.identificador !== identificador);

    // Actualiza el almacenamiento con los datos restantes
    localStorage.setItem(key, JSON.stringify(nuevosDatos));
    console.log(`Viaje con identificador ${identificador} eliminado correctamente.`);
  } catch (error) {
    console.error('Error al eliminar el dato:', error);
    throw error;
  }
}

// Actualizar un dato específico de una colección
  async actualizar(key: string, jsonModificado: any){
    const storage = await this.ensureStorage(); // Asegura que el storage está inicializado
    this.datos =await this.storage?.get(key) || [];
    let indice =this.datos.findIndex(valor => valor.identificador == jsonModificado.identificador)

    this.datos[indice] = jsonModificado;
    await this.storage?.set(key,this.datos)
    }
  

    // Establecer el usuario actual
async setUsuarioActual(usuario: any): Promise<void> {
  const storage = await this.ensureStorage();

  // Limpia y verifica el estado del almacenamiento
  console.log('Antes de establecer el usuario actual:', await storage.get('currentUser'));
  
  // Guarda el nuevo usuario actual
  await storage.set('currentUser', usuario);
  
  // Verifica después de establecer el usuario
  console.log('Usuario actual establecido:', await storage.get('currentUser'));
}
// Obtener el usuario actual
async getUsuarioActual(): Promise<any> {
  const storage = await this.ensureStorage();
  const usuario = await storage.get('currentUser');
  console.log('Usuario actual obtenido:', usuario);
  return usuario;
}
}
