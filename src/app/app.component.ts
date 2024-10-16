import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ProblemComponent} from './problem/problem.component';
import {CodeSubmissionComponent} from './code-submission/code-submission.component';
import {TokenService} from './service/token.service';
import {FormsModule} from '@angular/forms';
import {SplitAreaComponent, SplitComponent} from 'angular-split';
import {NgForOf, NgIf} from '@angular/common';
import {LeetcodeService} from './service/leetcode.service';
import {ProblemService} from './service/problem/problem.service';
import {Logger} from './service/logger/logger.service';
import {tags} from './tags';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProblemComponent, CodeSubmissionComponent, FormsModule, SplitComponent, SplitAreaComponent, NgIf, NgForOf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  title = `LCW`;
  showSplit = false;
  showTokenModal = false;

  showFilterModal = false;
  selectedDifficulty: string = '';
  selectedTags: { [key: string]: boolean } = {};
  availableTags = tags;

  problem: any;


  @ViewChild(ProblemComponent) problemComponent!: ProblemComponent;

  constructor(protected tokenService: TokenService,
              private leetcodeService: LeetcodeService,
              private toastr: ToastrService,
              private problemService: ProblemService) {

  }

  ngAfterViewInit() {
    Logger.log('AppComponent initialized');

    if (this.checkToken()) {
      this.fetchRandomTask();
    } else {
      this.alertToken();
    }
  }

  checkToken() {
    return this.tokenService.session !== undefined && this.tokenService.session !== null &&
      this.tokenService.csrftoken !== undefined && this.tokenService.csrftoken !== null;
  }

  alertToken() {
    this.toastr.error('Please enter your session and csrftoken', 'Error');
    this.openTokenModal();
  }

  openFilterModal() {
    this.showFilterModal = true;
  }

  closeFilterModal() {
    this.showFilterModal = false;
  }

  openTokenModal() {
    this.showTokenModal = true;
  }

  closeTokenModal() {
    this.showTokenModal = false;
  }

  saveTokens() {
    console.log('Tokens saved:', this.tokenService.session, this.tokenService.csrftoken);
    this.closeTokenModal();
  }

  applyFilters() {
    Logger.log('Selected Difficulty:', this.selectedDifficulty);
    Logger.log('Selected Tags:', this.getSelectedTags());

    this.closeFilterModal();
  }

  getSelectedTags(): string[] {
    return Object.keys(this.selectedTags).filter(tag => this.selectedTags[tag]);
  }

  // Fetch random task
  fetchRandomTask() {
    const session = this.tokenService.session;
    const csrftoken = this.tokenService.csrftoken;
    const tags = this.getSelectedTags();
    const difficulty = this.selectedDifficulty;

    if(!this.checkToken()){
      this.alertToken();
      return;
    }

    this.leetcodeService.fetchProblem(difficulty, tags, session, csrftoken).subscribe({
      next: response => {
        this.problem = response.data.randomQuestion;
        this.fetchProblemDescription(this.problem.titleSlug);
        this.showSplit = true;
      },
      error: err => {
        this.toastr.error(err, 'Error');
        console.error('Error fetching problem:', err);
      }
    });
  }

  // Fetch daily task
  fetchDailyTask() {
    const session = this.tokenService.session;
    const csrftoken = this.tokenService.csrftoken;

    if(!this.checkToken()){
      this.alertToken();
      return;
    }

    this.leetcodeService.fetchDailyProblem(session, csrftoken).subscribe({
      next: response => {
        this.problem = response.data.activeDailyCodingChallengeQuestion.question;
        this.fetchProblemDescription(this.problem.titleSlug);
        this.showSplit = true;
      },
      error: err => {
        this.toastr.error(err, 'Error');
        console.error('Error fetching problem:', err);
      }
    });
  }

  // Fetch problem description and hints
  fetchProblemDescription(titleSlug: string) {
    const session = this.tokenService.session;
    const csrftoken = this.tokenService.csrftoken;

    if(!this.checkToken()){
      this.alertToken();
      return;
    }

    this.leetcodeService.fetchProblemDescription(titleSlug, session, csrftoken).subscribe({
      next: response => {
        this.problem.description = response.data.question.content;
        this.problem.hints = response.data.question.hints;
        this.problem.similarQuestions = response.data.question.similarQuestions;
        this.problemService.setProblem(this.problem);
      },
      error: err => {
        this.toastr.error(err, 'Error');
        console.error('Error fetching problem:', err);
      }
    });
  }
}
