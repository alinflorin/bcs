import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-oauth-callback',
  imports: [MatProgressSpinnerModule, TranslateModule],
  templateUrl: './oauth-callback.html',
  styleUrl: './oauth-callback.scss',
})
export class OauthCallback {}
