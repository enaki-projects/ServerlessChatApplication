import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';

const validTypes = [
  "application/json",
  "application/xml",
  "application/pdf",
  "application/msword",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.rar",
  "application/zip",
  "application/x-tar",
  "application/gzip",
]

const archiveTypes = [
  "application/vnd.rar",
  "application/zip",
  "application/x-tar",
  "application/gzip"
]

const FILE_TYPE = "assets/images/icons/file.png"
const AUDIO_TYPE = "assets/images/icons/audio.png"
const VIDEO_TYPE = "assets/images/icons/video.png"
const ZIP_TYPE = "assets/images/icons/zip.png"
const PDF_TYPE = "assets/images/icons/pdf.png"
const JSON_TYPE = "assets/images/icons/json.png"
const XML_TYPE = "assets/images/icons/xml.png"
const DOC_TYPE = "assets/images/icons/doc.png"

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor() { }

  isImage(file: File): Promise<{ isImage: boolean; extension: string }> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const image = new Image();
        image.onload = () => {
          const extension = file.name.split('.').pop()?.toLowerCase();
          resolve({ isImage: true, extension: extension || '' });
        };
        image.onerror = () => {
          resolve({ isImage: false, extension: '' });
        };
        image.src = event.target.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  isMIMETypeSupported(type: string): boolean {
    if (type.startsWith("text") || type.startsWith("image") || type.startsWith("audio") || type.startsWith("video")) {
      return true;
    }

    for (let idx in validTypes) {
      if (type === validTypes[idx]) {
       return true;
      }
    }

    return false;
  }

  getFileTypeSrc(type: string): string {
    console.log(type);

    if (type.startsWith("video")) {
      return VIDEO_TYPE;
    }
    if (type.startsWith("audio")) {
      return AUDIO_TYPE;
    }

    for (let idx in archiveTypes) {
      if (archiveTypes[idx] === type) {
        return ZIP_TYPE;
      }
    }

    switch (type) {
      case "application/pdf":
        return PDF_TYPE;
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return DOC_TYPE;
      case "application/json":
        return JSON_TYPE;
      case "application/xml":
        return XML_TYPE;
    }

    return FILE_TYPE;
  }
}
