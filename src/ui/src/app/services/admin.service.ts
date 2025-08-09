import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { VectorCollectionDto } from '../dto/vector-collection.dto';
import { CreateVectorCollectionDto } from '../dto/create-vector-collection.dto';
import { SettingsDto } from '../dto/settings.dto';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly http = inject(HttpClient);

  getVectorCollections() {
    return this.http.get<VectorCollectionDto[]>(
      `/api/admin/vector-collections`
    );
  }

  createVectorCollection(dto: CreateVectorCollectionDto, files: File[]) {
    const fd = new FormData();

    // Add DTO as JSON string
    fd.append('createVectorCollectionDtoString', JSON.stringify(dto));

    // Add files
    for (const file of files) {
      fd.append('pdfFiles', file, file.name);
    }

    return this.http.post<VectorCollectionDto>(
      `/api/admin/vector-collections`,
      fd
    );
  }

  deleteVectorCollection(name: string) {
    return this.http.delete<VectorCollectionDto>(`/api/admin/vector-collections/${name}`);
  }

  getSettings() {
    return this.http.get<SettingsDto>(`/api/admin/settings`);
  }

  saveSettings(dto: SettingsDto) {
    return this.http.put<SettingsDto>(`/api/admin/settings`, dto);
  }
}
