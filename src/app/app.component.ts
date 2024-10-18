import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ProblemComponent} from './problem/problem.component';
import {CodeSubmissionComponent} from './code-submission/code-submission.component';
import {TokenService} from './service/token/token.service';
import {FormsModule} from '@angular/forms';
import {SplitAreaComponent, SplitComponent} from 'angular-split';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {ProblemService} from './service/problem/problem.service';
import {Logger} from './service/logger/logger.service';
import {ToastrService} from 'ngx-toastr';
import {FilterComponent} from './filter/filter.component';
import {ProblemFetcherService} from './service/problemFetcher/problem-fetcher.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProblemComponent, CodeSubmissionComponent, FormsModule, SplitComponent, SplitAreaComponent, NgIf, NgForOf, NgClass, FilterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  title = `LCW`;
  showSplit = false;
  showTokenModal = false;
  showFilterModal = false;
  selectedDifficulty: string = '';
  selectedTags: string[] = [];

  problem: any;

  initialCode!: string;
  selectedLanguage!: string;
  languages: string[] = [];
  codeSnippets: any = {};
  showCodeSubmission: boolean = true;
  codeEditorTheme: string = 'dracula';


  @ViewChild(ProblemComponent) problemComponent!: ProblemComponent;
  @ViewChild('codeSubmissionComponent') codeSubmissionComponent!: CodeSubmissionComponent;


  constructor(protected tokenService: TokenService,
              private problemFetchService: ProblemFetcherService,
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

  copyToClipboard() {
    this.codeSubmissionComponent.copyToClipboard();

    const url = `https://leetcode.com/problems/${this.problem.titleSlug}`;
    window.open(url, '_blank');
  }

  checkToken() {
    return this.problemFetchService.checkToken();
  }

  alertToken() {
    this.toastr.error('Please enter your session and csrftoken', 'Error');
    this.openTokenModal();
  }

  openTokenModal() {
    this.showTokenModal = true;
  }

  closeTokenModal() {
    this.showTokenModal = false;
  }

  saveTokens() {
    Logger.log('Tokens saved:', this.tokenService.session, this.tokenService.csrftoken);
    this.closeTokenModal();
  }

  openFilterModal() {
    this.showFilterModal = true;
  }

  closeFilterModal() {
    this.showFilterModal = false;
  }

  onLanguageChange(lang: string) {
    this.selectedLanguage = lang;
    this.initialCode = this.codeSnippets[lang] || '';
    this.showCodeSubmission = false;
    setTimeout(() => {
      this.showCodeSubmission = true;
    }, 15);
  }

  getCodeSnippet(codeSnippets: any) {
    this.problemFetchService.getCodeSnippet(codeSnippets, (languages, snippets) => {
      this.languages = languages;
      this.codeSnippets = snippets;
      this.selectedLanguage = this.languages[0];
      this.initialCode = this.codeSnippets[this.selectedLanguage];
      this.onLanguageChange(this.selectedLanguage);
    });
  }


  fetchRandomTask() {
    this.problemFetchService.fetchRandomTask(this.selectedTags, this.selectedDifficulty, (problem) => {
      this.problem = problem;
      this.fetchProblemDescription(this.problem.titleSlug);
      this.getCodeSnippet(this.problem.codeSnippets);
      this.showSplit = true;
    });
  }


  fetchDailyTask() {
    this.problemFetchService.fetchDailyTask((problem) => {
      this.problem = problem;
      this.fetchProblemDescription(this.problem.titleSlug);
      this.getCodeSnippet(this.problem.codeSnippets);
      this.showSplit = true;
    });
  }


  fetchProblemDescription(titleSlug: string) {
    this.problemFetchService.fetchProblemDescription(titleSlug, (question) => {
      this.problem.description = question.content;
      this.problem.hints = question.hints;
      this.problem.similarQuestions = question.similarQuestionList;
      this.problemService.setProblem(this.problem);
      Logger.log('response.data.question:', question);
      Logger.log('Problem:', this.problem);
    });
  }

  onApplyFilters(event: { difficulty: string, tags: string[] }) {
    this.selectedDifficulty = event.difficulty;
    this.selectedTags = event.tags;
    this.fetchRandomTask();
  }
}
