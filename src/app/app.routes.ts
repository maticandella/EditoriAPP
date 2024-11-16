import { Routes } from '@angular/router';
import { AuthorsComponent } from './pages/authors/authors.component';
import { AuthorDetailsComponent } from './pages/author-details/author-details.component';

export const routes: Routes = [
    // { path: 'login', component: LoginComponent },
    // { path: 'register', component: RegisterComponent },
    // { path: 'home', component: HomeComponent },
    { path: 'authors', component: AuthorsComponent },
    { path: 'author/:id', component: AuthorDetailsComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'home' }
];