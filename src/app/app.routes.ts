import { Routes } from '@angular/router';
import { AuthorsComponent } from './pages/authors/authors.component';
import { AuthorDetailsComponent } from './pages/author-details/author-details.component';
import { BooksComponent } from './pages/books/books.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthorsListComponent } from './components/admin/authors/authors-list/authors-list.component';
import { AuthorsAddComponent } from './components/admin/authors/authors-add/authors-add.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

export const routes: Routes = [
    {
        path: 'admin', // Área administrativa
        component: AdminLayoutComponent,
        children: [
            { path: 'authors', component: AuthorsListComponent },
            { path: 'authors/add', component: AuthorsAddComponent },
        ],
    },
    {
        path: '', // Área pública
        component: PublicLayoutComponent,
        children: [
            // { path: 'login', component: LoginComponent },
            // { path: 'register', component: RegisterComponent },
            { path: 'home', component: HomeComponent },
            { path: 'authors', component: AuthorsComponent },
            { path: 'author/:id', component: AuthorDetailsComponent },
            { path: 'books', component: BooksComponent },
            // { path: 'book/:id', component: AuthorDetailsComponent },
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: '**', redirectTo: 'home' },
        ]
      }
];