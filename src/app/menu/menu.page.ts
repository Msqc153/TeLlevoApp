import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'
import { addIcons } from 'ionicons';
import { homeOutline, personCircleOutline, pinOutline, searchOutline,location, logOutOutline, addCircleOutline, carOutline, logIn } from 'ionicons/icons';
import { Router,RouterModule } from '@angular/router';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MenuPage implements OnInit {

  constructor() {

    addIcons({'log-in':logIn ,'log-out-outline':logOutOutline,'home-outline':homeOutline, 'person-circle-outline':personCircleOutline,'search-outline':searchOutline,'pin-outline':pinOutline,location,'add-circle-outline':addCircleOutline,'car-outline':carOutline,
       

    })

   }

  ngOnInit() {
  }

}
