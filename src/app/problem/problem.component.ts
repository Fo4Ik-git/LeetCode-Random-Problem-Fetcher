import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import {ProblemService} from '../service/problem/problem.service';

@Component({
  selector: 'app-problem',
  standalone: true,
  imports: [
    NgStyle,
    NgIf,
    NgForOf
  ],
  templateUrl: './problem.component.html',
  styleUrl: './problem.component.scss'
})
export class ProblemComponent implements OnInit {
  problem: any;
  difficultyStyles: { [key: string]: any } = {
    Easy: {color: 'green'},
    Medium: {color: 'orange'},
    Hard: {color: 'red'}
  };
  protected readonly JSON = JSON;

  constructor(private problemService: ProblemService
  ) {
  }

  ngOnInit(): void {
    this.problemService.problem$.subscribe(problem => {
      this.problem = problem; // Update the local problem variable when new data arrives
    });
  }

  openProblem(titleSlug: string) {
    window.open(`https://leetcode.com/problems/${titleSlug}/`, '_blank');
  }

  openSolution(titleSlug: string) {
    window.open(`https://leetcode.com/problems/${titleSlug}/solution/`, '_blank');
  }
}
