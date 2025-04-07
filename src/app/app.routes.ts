import { Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';

export const routes: Routes = [
    {
        path: '',
        component: UserListComponent,
    },
    {
        path: 'details/:id',
        loadComponent: () => import('./components/user-detail/user-detail.component').then(m => m.UserDetailComponent),
    },
    {
        path: 'form',
        loadComponent: () => import('./components/user-form/user-form.component').then(m => m.UserFormComponent),
    },
    {
        path: 'form/:id',
        loadComponent: () => import('./components/user-form/user-form.component').then(m => m.UserFormComponent),
    },
];

