import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ProblemComponent} from './problem/problem.component';
import {CodeSubmissionComponent} from './code-submission/code-submission.component';
import {TokenService} from './service/token.service';
import {FormsModule} from '@angular/forms';
import {SplitAreaComponent, SplitComponent} from 'angular-split';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {LeetcodeService} from './service/leetcode.service';
import {ProblemService} from './service/problem/problem.service';
import {Logger} from './service/logger/logger.service';
import {tags} from './tags';
import {ToastrService} from 'ngx-toastr';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProblemComponent, CodeSubmissionComponent, FormsModule, SplitComponent, SplitAreaComponent, NgIf, NgForOf, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  title = `LCW`;
  showSplit = false;
  showTokenModal = false;
  searchQuery: string = '';
  showFilterModal = false;
  selectedDifficulty: string = '';
  selectedTags: string[] = [];
  availableTags = tags;

  problem: any;
  filteredTags = [...this.availableTags];

  initialCode!: string;
  selectedLanguage!: string;
  languages: string[] = [];
  codeSnippets: any = {};
  showCodeSubmission: boolean = true;
  codeEditorTheme: string = 'dracula';


  @ViewChild(ProblemComponent) problemComponent!: ProblemComponent;

  constructor(protected tokenService: TokenService,
              private leetcodeService: LeetcodeService,
              private toastr: ToastrService,
              private http: HttpClient,
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
    Logger.log('Tokens saved:', this.tokenService.session, this.tokenService.csrftoken);
    this.closeTokenModal();
  }

  filterTags() {
    const query = this.searchQuery.toLowerCase();
    this.filteredTags = this.availableTags.filter(tag =>
      tag.label.toLowerCase().includes(query)
    );
  }

  toggleTag(tag: { value: string; label: string; selected: boolean }) {
    tag.selected = !tag.selected;
    const index = this.selectedTags.indexOf(tag.value);
    if (index > -1) {
      this.selectedTags.splice(index, 1);
    } else {
      this.selectedTags.push(tag.value);
    }
  }

  getSelectedTags(): string[] {
    return this.selectedTags;
  }

  applyFilters() {
    console.log('Selected Tags:', this.getSelectedTags());
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

  // Fetch random task
  fetchRandomTask() {
    const session = this.tokenService.session;
    const csrftoken = this.tokenService.csrftoken;
    const tags = this.getSelectedTags();
    const difficulty = this.selectedDifficulty;

    if (!this.checkToken()) {
      this.alertToken();
      return;
    }

    this.leetcodeService.fetchProblem(difficulty, tags, session, csrftoken).subscribe({
      next: response => {

        if (response.data.randomQuestion == null) {
          this.toastr.error('No random problem found', 'Error');
          return;
        }

        this.problem = response.data.randomQuestion;

        const codeSnippets = this.problem.codeSnippets;

        this.languages = codeSnippets.map((snippet: { lang: string }) => snippet.lang);
        this.codeSnippets = {};
        codeSnippets.forEach((snippet: { lang: string; code: string }) => {
          this.codeSnippets[snippet.lang] = snippet.code;
        });

        this.selectedLanguage = this.languages[0];
        this.initialCode = this.codeSnippets[this.selectedLanguage];

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

    if (!this.checkToken()) {
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

    if (!this.checkToken()) {
      this.alertToken();
      return;
    }

    this.leetcodeService.fetchProblemDescription(titleSlug, session, csrftoken).subscribe({
      next: response => {
        this.problem.description = response.data.question.content;
        this.problem.hints = response.data.question.hints;
        this.problem.similarQuestions = response.data.question.similarQuestionList;
        this.problemService.setProblem(this.problem);
        Logger.log('response.data.question:', response.data.question);
        Logger.log('Problem:', this.problem);
      },
      error: err => {
        this.toastr.error(err, 'Error');
        console.error('Error fetching problem:', err);
      }
    });
  }
}
