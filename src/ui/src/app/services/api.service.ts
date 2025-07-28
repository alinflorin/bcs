import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HealthcheckResponseDto } from '../dto/healthcheck-response.dto';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);

  getApiVersion() {
    return this.http.get<HealthcheckResponseDto>(`/api/health`);
  }
}
