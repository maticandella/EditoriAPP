import { Routes } from '@angular/router';
import { AuthorsComponent } from './pages/authors/authors.component';
import { AuthorDetailsComponent } from './pages/author-details/author-details.component';
import { BooksComponent } from './pages/books/books.component';
import { HomeComponent } from './pages/home/home.component';
import { LayoutComponent } from './components/admin/layout/layout.component';
import { AuthorsListComponent } from './components/admin/authors/authors-list/authors-list.component';

export const routes: Routes = [
    // { path: 'login', component: LoginComponent },
    // { path: 'register', component: RegisterComponent },
    { path: 'home', component: HomeComponent },
    { path: 'authors', component: AuthorsComponent },
    { path: 'author/:id', component: AuthorDetailsComponent },
    { path: 'books', component: BooksComponent },
    // { path: 'book/:id', component: AuthorDetailsComponent },
    { path: 'admin', component: LayoutComponent },
    { path: 'admin/authors', component: AuthorsListComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'home' },

    
];