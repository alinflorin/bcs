import { Component, Input, signal, WritableSignal } from '@angular/core';
import { version } from '../../../version';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
  version = signal(version);

  @Input() apiVersion!: string;
}
