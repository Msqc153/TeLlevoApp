import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, FormBuilder,Validators,ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { IonicModule } from '@ionic/angular';

interface Usuario {
  name: string;
  username: string;
  email: string;
  password: string;
  hasCar: boolean;
  carDetails?: {
    licensePlate: string;
    model: string;
    capacity: number;
  };
  identificador: string;
  tipoUsuario: string;
}

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class RegistroPage {
  registroForm: FormGroup;
  usuarios: any[] = []; // Lista de usuarios para mostrar y manipular
  currentId: string = ''; // Para editar un usuario específico


  constructor(private fb: FormBuilder, private storageService: StorageService, private router: Router) {


    this.registroForm = this.fb.group({
      name:['',[Validators.required, Validators.minLength(3)]],
      username:['',[Validators.required,Validators.minLength(3)]],
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(4)]],
      confirmpassword:['',[Validators.required]],
      hasCar: [false], // Campo para indicar si tiene auto
      carDetails: this.fb.group({
        licensePlate: ['', Validators.required],
        model: ['', Validators.required],
        capacity: ['', [Validators.required, Validators.min(1), Validators.max(8)]]
      })
    },{validator: this.passwordsMatchValidator });
   }

  ngOnInit() {
    this.toggleCarDetails();
  }

  toggleCarDetails() {
    const hasCarControl = this.registroForm.get('hasCar');
    const carDetailsGroup = this.registroForm.get('carDetails');

    hasCarControl?.valueChanges.subscribe((hasCar: boolean) => {
      if (hasCar) {
        carDetailsGroup?.enable();
      } else {
        carDetailsGroup?.reset();
        carDetailsGroup?.disable();
      }
    });

    if (!hasCarControl?.value) {
      carDetailsGroup?.disable();
    }
  }


  passwordsMatchValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmpassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  // Método para mostrar/ocultar los campos del auto
  
  // Listar usuarios
  async listarUsuarios(): Promise<void> {
    this.usuarios = await this.storageService.obtenerDatos('usuarios') || [];
  }

  // Agregar usuario
  async agregarUsuario(): Promise<void> {
    if (this.registroForm.valid) {
      const formValue = this.registroForm.value;

      // Crear el objeto del usuario basado en la interface
      const user: Usuario = {
        name: formValue.name,
        username: formValue.username,
        email: formValue.email,
        password: formValue.password,
        hasCar: formValue.hasCar,
        carDetails: formValue.hasCar ? formValue.carDetails : undefined,
        identificador: Date.now().toString(), // Genera un identificador único
        tipoUsuario: formValue.hasCar ? 'movilizacionPropia' : 'sinMovilizacionPropia', // Determina el tipo de usuario
      };

      // Verificar si ya existe
      const userExists = await this.storageService.obtenerDato('usuarios', user.identificador);
      if (userExists) {
        alert('El usuario ya existe. Usa otro nombre de usuario.');
        return;
      }

      // Guardar al usuario
      await this.storageService.agregar('usuarios', user);
      alert('¡Usuario agregado con éxito!');
      await this.listarUsuarios();
      this.limpiarFormulario();

      this.router.navigate(['/menu/login']);
    } else {
      alert('Por favor, corrige los errores antes de continuar.');
    }
  }

  // Buscar usuario
  async buscarUsuario(id: string): Promise<void> {
    const usuario = await this.storageService.obtenerDato('usuarios', id) as Usuario;
    if (usuario) {
      this.registroForm.patchValue(usuario); // Carga los datos en el formulario
      this.currentId = id;
    } else {
      alert('Usuario no encontrado.');
    }
  }

  // Modificar usuario
  async modificarUsuario(): Promise<void> {
    if (this.currentId) {
      const usuarioModificado: Usuario = {
        ...this.registroForm.value,
        identificador: this.currentId,
      };

      await this.storageService.actualizar('usuarios', usuarioModificado);
      alert('¡Usuario modificado con éxito!');
      await this.listarUsuarios();
      this.limpiarFormulario();
    } else {
      alert('Selecciona un usuario para modificar.');
    }
  }

  // Eliminar usuario
  async eliminarUsuario(id: string): Promise<void> {
    await this.storageService.eliminar('usuarios', id);
    alert('Usuario eliminado con éxito.');
    await this.listarUsuarios();
  }

  // Limpiar formulario
  limpiarFormulario(): void {
    this.registroForm.reset();
    this.currentId = '';
  }
}
