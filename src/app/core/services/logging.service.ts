import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  logError(error: any): void {
    // Example: Send the error details to a remote logging server
    console.log('Logging error to server:', error);
    // Implement HTTP request logic here
  }
}
