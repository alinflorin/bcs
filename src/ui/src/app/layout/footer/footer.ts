import { Component, signal } from '@angular/core';
import { version } from '../../../version';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
  version = signal(version);
}
