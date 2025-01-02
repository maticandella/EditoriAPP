import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AuthorsComponent } from './pages/authors/authors.component';
import { AuthorDetailsComponent } from './pages/author-details/author-details.component';
import { BooksComponent } from './pages/books/books.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthorsListComponent } from './components/admin/authors/authors-list/authors-list.component';
import { AuthorsAddComponent } from './components/admin/authors/authors-add/authors-add.component';
import { AuthorsEditComponent } from './components/admin/authors/authors-edit/authors-edit.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { BooksAddComponent } from './components/admin/books/books-add/books-add.component';
import { AuthorsSocialMediaComponent } from './components/admin/authors/authors-social-media/authors-social-media.component';


export const routes: Routes = [
    {
        path: 'admin', // Área administrativa
        canActivate: [AuthGuard],
        component: AdminLayoutComponent,
        children: [
            { path: 'authors', component: AuthorsListComponent },
            { path: 'authors/add', component: AuthorsAddComponent },
            { path: 'authors/edit/:id', component: AuthorsEditComponent },
            { path: 'authors/socialmedia/:id', component: AuthorsSocialMediaComponent },
            { path: 'books/add', component: BooksAddComponent },
        ],
    },
    {
        path: '', // Área pública
        component: PublicLayoutComponent,
        children: [
            { path: 'login', component: LoginComponent },
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