import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { ApiService } from './services/api.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserClaims } from './models/user-claims';
import { config } from './config';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, TranslateModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly apiService = inject(ApiService);
  private readonly translate = inject(TranslateService);
  apiVersion = signal('?');

  user = signal<UserClaims | undefined>(undefined);

  theme = signal('auto');

  ngOnInit(): void {
    // Auth
    this.authService.checkAuth().subscribe();

    this.authService.user.subscribe(u => {
      this.user.set(u);
    });

    // Get API version
    this.apiService.getApiVersion().subscribe(r => {
      this.apiVersion.set(r.version);
    });

    // Translate
    this.translate.addLangs(config.languages.map(x => x.code));
    this.translate.use(localStorage.getItem('lang') || this.translate.getBrowserLang() || config.defaultLanguage);

    // Theme
    const theme = localStorage.getItem('theme');
    if (theme) {
      this.theme.set(theme);
      if (theme === 'dark') {
        this.enableDarkMode();
        document.querySelector('html')!.style.colorScheme = 'dark';
      } else {
        this.disableDarkMode();
        document.querySelector('html')!.style.colorScheme = 'light';
      }
    } else {
      document.querySelector('html')!.style.colorScheme = 'light dark';
    }
  }

  changeLanguage(newLang: string): void {
    this.translate.use(newLang).subscribe(() => {
      localStorage.setItem('lang', newLang);
    });
  }

  changeTheme(newTheme: string): void {
    this.theme.set(newTheme);
    if (newTheme === 'auto') {
      localStorage.removeItem('theme');
      this.disableDarkMode();
      document.querySelector('html')!.style.colorScheme = 'light dark';
      return;
    }
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      this.enableDarkMode();
      document.querySelector('html')!.style.colorScheme = 'dark';
    } else {
      this.disableDarkMode();
      document.querySelector('html')!.style.colorScheme = 'light';
    }
  }

  private enableDarkMode() {
    document.querySelector('body')!.className = "dark-mode";
  }
  private disableDarkMode() {
    document.querySelector('body')!.className = "";
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout().subscribe();
  }
}
