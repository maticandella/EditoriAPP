import { Component } from '@angular/core';
import { HeaderAdminComponent } from "../header-admin/header-admin.component";
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterAdminComponent } from "../footer-admin/footer-admin.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet, FooterAdminComponent, HeaderAdminComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
