import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './+home';
import { AboutComponent, AboutHomeComponent, AboutItemComponent } from './+about';


const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'about',
    component: AboutComponent,
    children: [
      { path: '', component: AboutHomeComponent }, // url: about/
      { path: 'item/:id', component: AboutItemComponent } // url: about/item
    ]
  }
];

export const routing = RouterModule.forRoot(routes, {
  useHash: true
});
