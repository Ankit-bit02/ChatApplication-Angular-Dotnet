import { Routes } from '@angular/router';
import { loginGuard } from './guards/login.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: 'register',
        loadComponent: () =>
            import('./register/register.component').then((x) => x.RegisterComponent),
        canActivate: [loginGuard], // activating login guard 
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./login/login.component').then((x) => x.LoginComponent),
        canActivate: [loginGuard],
    },
    {
        path: 'chat',
        loadComponent: () =>
            import('./chat/chat.component').then((x) => x.ChatComponent),
        canActivate: [authGuard],
    },

    // wild card implementation. Redirect the user to the chat page if undefined path is defined by the user
    // It should always be used at the end of the page.
    {
        path: '**',
        redirectTo: 'chat',
        pathMatch: 'full'
    }
];
