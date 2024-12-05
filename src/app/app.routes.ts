import { Routes } from '@angular/router';

export const routes: Routes = [
  
  {
    path: '',
    redirectTo: 'menu/login',
    pathMatch: 'full',
  },
  
  {
    path: 'menu',
    loadComponent: () => import('./menu/menu.page').then( m => m.MenuPage),
    children:[
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'login',
        loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
      },
      {
        path: 'tabs',
        loadComponent: () => import('./tabs/tabs.page').then( m => m.TabsPage),
        children:[
          {
            path: 'localizacion',
            loadComponent: () => import('./localizacion/localizacion.page').then( m => m.LocalizacionPage)
          },
          {
            path: 'programaviaje',
            loadComponent: () => import('./programaviaje/programaviaje.page').then( m => m.ProgramaviajePage)
          },
        ]
      },
      {
        path: 'registro',
        loadComponent: () => import('./registro/registro.page').then( m => m.RegistroPage)
      },
      {
        path: 'perfil',
        loadComponent: () => import('./perfil/perfil.page').then( m => m.PerfilPage)
      },
      {
        path: 'restablecer',
        loadComponent: () => import('./restablecer/restablecer.page').then( m => m.RestablecerPage)
      },
      
    ]
  },
  {
    path: 'programaviaje',
    loadComponent: () => import('./programaviaje/programaviaje.page').then( m => m.ProgramaviajePage)
  },
 
  
];
