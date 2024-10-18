import { Injectable } from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {LeetcodeService} from '../leetcodeApi/leetcode.service';
import {TokenService} from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class ProblemFetcherService {

  constructor(
    private toastr: ToastrService,
    private leetcodeService: LeetcodeService,
    private tokenService: TokenService,
  ) {}

  checkToken() {
    return this.tokenService.session !== undefined && this.tokenService.session !== null &&
      this.tokenService.csrftoken !== undefined && this.tokenService.csrftoken !== null;
  }

  fetchRandomTask(selectedTags: string[], selectedDifficulty: string, callback: (problem: any) => void) {
    const session = this.tokenService.session;
    const csrftoken = this.tokenService.csrftoken;

    if (!this.checkToken()) {
      this.toastr.error('Please enter your session and csrftoken', 'Error');
      return;
    }

    this.leetcodeService.fetchProblem(selectedDifficulty, selectedTags, session, csrftoken).subscribe({
      next: response => {
        const randomQuestion = response.data?.randomQuestion;
        if (!randomQuestion) {
          this.toastr.error('No random problem found', 'Error');
          return;
        }
        callback(randomQuestion);
      },
      error: err => {
        this.toastr.error(err, 'Error');
      }
    });
  }

  fetchDailyTask(callback: (problem: any) => void) {
    const session = this.tokenService.session;
    const csrftoken = this.tokenService.csrftoken;

    if (!this.checkToken()) {
      this.toastr.error('Please enter your session and csrftoken', 'Error');
      return;
    }

    this.leetcodeService.fetchDailyProblem(session, csrftoken).subscribe({
      next: response => {
        const problem = response.data.activeDailyCodingChallengeQuestion.question;
        callback(problem);
      },
      error: err => {
        this.toastr.error(err, 'Error');
      }
    });
  }

  fetchProblemDescription(titleSlug: string, callback: (description: any) => void) {
    const session = this.tokenService.session;
    const csrftoken = this.tokenService.csrftoken;

    if (!this.checkToken()) {
      this.toastr.error('Please enter your session and csrftoken', 'Error');
      return;
    }

    this.leetcodeService.fetchProblemDescription(titleSlug, session, csrftoken).subscribe({
      next: response => {
        const question = response.data.question;
        callback(question);
      },
      error: err => {
        this.toastr.error(err, 'Error');
      }
    });
  }

  getCodeSnippet(codeSnippets: any, callback: (languages: string[], codeSnippets: any) => void) {
    if (!codeSnippets) {
      this.toastr.error('No code snippets found', 'Error');
      return;
    }

    const languages = codeSnippets.map((snippet: { lang: string }) => snippet.lang);
    const snippets: { [key: string]: string } = {};
    codeSnippets.forEach((snippet: { lang: string; code: string }) => {
      snippets[snippet.lang] = snippet.code;
    });

    callback(languages, snippets);
  }
}
