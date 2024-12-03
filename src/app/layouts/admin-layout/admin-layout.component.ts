import { Component } from '@angular/core';
import { HeaderAdminComponent } from '../../components/admin/header-admin/header-admin.component';
import { SidebarComponent } from '../../components/admin/sidebar/sidebar.component';
import { FooterAdminComponent } from "../../components/admin/footer-admin/footer-admin.component";
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [SidebarComponent, FooterAdminComponent, HeaderAdminComponent, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

}
