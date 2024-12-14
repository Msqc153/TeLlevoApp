import { Component,  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule , FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonicModule } from  '@ionic/angular' ;
import { Route, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-restablecer',
  templateUrl: './restablecer.page.html',
  styleUrls: ['./restablecer.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class RestablecerPage {
  restablecerForm! : FormGroup;

  constructor(private fb:FormBuilder, private router:Router) {

    this.restablecerForm = this.fb.group({
      password: ['',[Validators.required,Validators.minLength(4)]],
      confirmPassword:['',[Validators.required]]
    },{validator: this.passwordMatch});

  }

  passwordMatch(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password == confirmPassword ? null : { missmatch : true};
  }


  onLogin() {
    if(this.restablecerForm.valid)
      {
        const password = this.restablecerForm.get('password')?.value;
        console.log('Contraseña restablecida:', password);
        this.router.navigate(['/menu/login']);
        
      }else(
        console.error('Formulario Invalido')
      )
  }

}
