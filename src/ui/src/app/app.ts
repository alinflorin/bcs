import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { ApiService } from './services/api.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserClaims } from './models/user-claims';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, TranslateModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly oidcSecurityService = inject(OidcSecurityService);
  private readonly apiService = inject(ApiService);
  private readonly translate = inject(TranslateService);
  apiVersion = signal('?');

  user = signal<UserClaims | null>(null);

  ngOnInit(): void {
    // Auth
    this.oidcSecurityService.checkAuth().subscribe(r => {
      this.user.set(r.userData);
    });

    // Get API version
    this.apiService.getApiVersion().subscribe(r => {
      this.apiVersion.set(r.version);
    });

    // Translate
    this.translate.addLangs(['ro', 'en']);
    this.translate.setDefaultLang('en');
    this.translate.use(localStorage.getItem('lang') || this.translate.getBrowserLang() || 'en');
  }

  changeLanguage(newLang: string): void {
    this.translate.use(newLang).subscribe(() => {
      localStorage.setItem('lang', newLang);
    });
  }

  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService.logoff().subscribe();
  }
}
