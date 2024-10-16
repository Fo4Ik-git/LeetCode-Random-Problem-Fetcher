import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Logger {

  static log(message?: any, ...optionalParams: any[]) {
    if (environment.enableConsoleLogging) {
      console.log(message, ...optionalParams);
    }
  }

  static warn(message?: any, ...optionalParams: any[]) {
    if (environment.enableConsoleLogging) {
      console.warn(message, ...optionalParams);
    }
  }

  static error(message?: any, ...optionalParams: any[]) {
    if (environment.enableConsoleLogging) {
      console.error(message, ...optionalParams);
    }
  }
}
