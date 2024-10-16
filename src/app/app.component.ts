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
              private problemService: ProblemService) {

  }

  ngAfterViewInit() {
    Logger.log('AppComponent initialized');

    if (this.tokenService.session !== undefined && this.tokenService.session !== null &&
      this.tokenService.csrftoken !== undefined && this.tokenService.csrftoken !== null) {
      this.fetchRandomTask();
    } else {
      // Handle the case where session or csrftoken is undefined or null
      this.openTokenModal();
    }


  }

  openFilterModal() {
    this.showFilterModal = true;
  }

  closeFilterModal() {
    this.showFilterModal = false;
  }

  openTokenModal() {
    this.showTokenModal = true; // Show the token modal
  }

  closeTokenModal() {
    this.showTokenModal = false; // Hide the token modal
  }

  saveTokens() {
    // Logic to save tokens if needed
    console.log('Tokens saved:', this.tokenService.session, this.tokenService.csrftoken);
    this.closeTokenModal(); // Close modal after saving
  }

  applyFilters() {
    // Handle logic to apply filters here

    Logger.log('Selected Difficulty:', this.selectedDifficulty);
    Logger.log('Selected Tags:', this.getSelectedTags());

    // Close modal after applying filters
    this.closeFilterModal();
  }

  getSelectedTags(): string[] {
    return Object.keys(this.selectedTags).filter(tag => this.selectedTags[tag]);
  }

  fetchRandomTask() {
    const session = this.tokenService.session;
    const csrftoken = this.tokenService.csrftoken;
    const tags = this.getSelectedTags();
    const difficulty = this.selectedDifficulty;

    this.leetcodeService.fetchProblem(difficulty, tags, session, csrftoken).subscribe(response => {
      this.problem = response.data.randomQuestion;
      this.fetchProblemDescription(this.problem.titleSlug);
      this.showSplit = true;
    });
  }

  fetchDailyTask() {
    const session = this.tokenService.session;
    const csrftoken = this.tokenService.csrftoken;

    this.leetcodeService.fetchDailyProblem(session, csrftoken).subscribe(response => {
      this.problem = response.data.activeDailyCodingChallengeQuestion.question;
      this.fetchProblemDescription(this.problem.titleSlug);
      this.showSplit = true;
    });
  }

  fetchProblemDescription(titleSlug: string) {
    const session = this.tokenService.session;
    const csrftoken = this.tokenService.csrftoken;

    this.leetcodeService.fetchProblemDescription(titleSlug, session, csrftoken).subscribe(response => {
      this.problem.description = response.data.question.content;
      this.problem.hints = response.data.question.hints;
      this.problem.similarQuestions = response.data.question.similarQuestions;
      this.problemService.setProblem(this.problem);
    });
  }
}
