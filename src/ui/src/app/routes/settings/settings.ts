import { Component, inject } from '@angular/core';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-settings',
  imports: [],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings {
  private readonly ws: WeatherService = inject(WeatherService);

  test() {
    this.ws.getForecast().subscribe(r => {
      console.log(r);
    })
  }
}
