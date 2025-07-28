import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly oidcSecurityService = inject(OidcSecurityService);
  private readonly apiService = inject(ApiService);
  apiVersion = signal('?');

  ngOnInit(): void {
    this.oidcSecurityService.checkAuth().subscribe();
    this.apiService.getApiVersion().subscribe(r => {
      this.apiVersion.set(r.version);
    });
  }
}
