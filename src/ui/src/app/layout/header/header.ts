import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { UserClaims } from '../../models/user-claims';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { config } from '../../config';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    TranslateModule,
    RouterModule,
    MatDividerModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  translate = inject(TranslateService);
  @Input() user: UserClaims | undefined;
  allLanguages = config.languages;

  @Output() onLanguageChanged = new EventEmitter<string>();
  @Output() onLoginClicked = new EventEmitter<void>();
  @Output() onLogoutClicked = new EventEmitter<void>();
}
