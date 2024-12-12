import { ErrorHandler, Injectable } from '@angular/core';

import { LoggingService } from '../services/logging.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private loggingService: LoggingService) {}

  handleError(error: any): void {
    console.error('Global Error:', error);

    // Send the error details to the logging service
    this.loggingService.logError(error);

    // Display user-friendly message
    alert('An unexpected error occurred. Please try again later.');
  }
}
