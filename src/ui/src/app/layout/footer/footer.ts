import { Component, Input, signal } from '@angular/core';
import { version } from '../../../version';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-footer',
  imports: [MatToolbarModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
  version = signal(version);
  currentYear = signal(new Date().getFullYear());

  @Input() apiVersion!: string;
}
