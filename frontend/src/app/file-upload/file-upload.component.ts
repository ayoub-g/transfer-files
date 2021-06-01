import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUploadService } from '../file-upload.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})

export class FileUploadComponent {

  uploadForm!: FormGroup;
  imagePreview = '';
  progress = 0;

  uploadDisabled = true;

  attachFilesDescription = '';
  message = "";

  constructor(private fileUploadService: FileUploadService) {

    this.uploadForm = new FormGroup({
      file: new FormControl(null, [Validators.required])
    });
  }

  attachIconClicked() {
    this.progress = 0;
  }
  // On file Select
  onChange(event: any) {
    //console.log(event);

    if (event.target.files && event.target.files.length > 0) {
      this.fileUploadService.updateFormData(event.target.files)
      this.uploadDisabled = !(this.fileUploadService.length > 0);

      if (this.fileUploadService.length > 1) {

        this.attachFilesDescription = String(this.fileUploadService.length) + " Files attached"
      } else if (this.fileUploadService.length == 1) { this.attachFilesDescription = "1 File attached" }
      this.message = this.attachFilesDescription
    }
  }

  async onUpload() {
    this.progress = 0;

    this.fileUploadService.upload().subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
          this.message = String(this.progress).concat(' %');

        } else if (event instanceof HttpResponse) {
        }

      }, error: (err: any) => { console.log(err); },
      complete: () => {
        this.message = "upload complete"
        this.uploadDisabled = true;
      }
    });
  }
}
