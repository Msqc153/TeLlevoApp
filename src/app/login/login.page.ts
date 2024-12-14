import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule,Validators,FormBuilder,FormGroup, } from '@angular/forms';
import { IonicModule } from  '@ionic/angular' ;
import { NavigationExtras, Route, Router, RouterModule } from '@angular/router';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
})
export class LoginPage  {

  loginForm! : FormGroup;

  constructor(private fb:FormBuilder, private router:Router , private storageService: StorageService) { 


    this.loginForm=this.fb.group({

      username:['',[
          Validators.required,Validators.minLength(3),Validators.maxLength(9),Validators.pattern('^[a-zA-Z0-9]*$'),
        ]
      ]
      ,
      password:['',[
          Validators.required,Validators.minLength(4),Validators.maxLength(4),Validators.pattern('^[0-9]*$'), 
        ]
      ]
      ,
      rememberMe: [false] 

    })

  }

  async onLogin() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
  
      // Obtén todos los usuarios desde el almacenamiento
      const usuarios = await this.storageService.obtenerDatos('usuarios') || [];
      console.log('Lista de usuarios obtenida:', usuarios);
  
      // Busca al usuario en la lista
      const usuario = usuarios.find(
        (u: any) => u.username === username && u.password === password
      );
  
      if (usuario) {
        alert(`¡Bienvenido ${usuario.username}!`);
  
        // Limpia cualquier usuario previo y establece el nuevo usuario actual
        await this.storageService.setUsuarioActual(usuario);
  
        // Verifica el usuario actual después de configurarlo
        const usuarioActual = await this.storageService.getUsuarioActual();
        console.log('Usuario actual después de iniciar sesión:', usuarioActual);
  
        // Redirige al perfil
        this.router.navigate(['/menu/perfil']);
      } else {
        alert('Usuario o contraseña incorrectos.');
      }
    } else {
      alert('Completa todos los campos correctamente.');
    }
  }

  restablecerPass() {
    this.router.navigate(['restablecer']);
  }

}
