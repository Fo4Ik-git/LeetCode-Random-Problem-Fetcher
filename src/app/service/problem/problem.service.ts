import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProblemService {
  private problemSubject = new BehaviorSubject<any>(null); // Initial value is null
  problem$ = this.problemSubject.asObservable(); // Observable for subscribers

  setProblem(problem: any, filter?: any) {
    this.problemSubject.next(problem); // Emit new problem data
  }
}
