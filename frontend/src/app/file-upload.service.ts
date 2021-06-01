import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  files: Array<File> = new Array();
  formData = new FormData();
  constructor(private http: HttpClient) {

  }
  async setConfig() {
    const { server } = (await this.http.get<{ server: string }>('/assets/config.json').toPromise());
    environment.server = server;

  }
  upload() {
    return this.http.post(`${environment.server}/upload`, this.formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
  get length() { return this.files.length }
  updateFormData(files: []) {
    this.formData.delete("files")
    this.files = Array.from(files);
    this.files.map(file => {
      this.formData.append("files", file, file.name)
    });
  }
}
