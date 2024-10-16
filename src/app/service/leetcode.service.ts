import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Logger} from './logger/logger.service';

@Injectable({
  providedIn: 'root'
})
export class LeetcodeService {

  private graphqlUrl = '/api/graphql/';

  constructor(private http: HttpClient) {
  }

  fetchProblem(difficulty: string, tags: string[], session: string, csrftoken: string): Observable<any> {
    const query = `query RandomProblem($categorySlug: String!, $filters: QuestionListFilterInput) {
      randomQuestion(categorySlug: $categorySlug, filters: $filters) {
        acRate
        difficulty
        frontendQuestionId: questionFrontendId
        status
        title
        titleSlug
        topicTags {
          name
        }
        hasSolution
        codeSnippets {
          lang
          code
        }
      }
    }`;

    // Create filters based on selected difficulty and tags
    const filters: any = {
      difficulty: difficulty || null,
      tags: tags.length > 0 ? tags : null
    };

    const variables = {
      categorySlug: "",
      filters: filters
    };

    Logger.log('Fetching problem with filters:', filters);

    return this.http.post(this.graphqlUrl, {
      query,
      variables
    }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cookie': `LEETCODE_SESSION=${session}; csrftoken=${csrftoken}`,
        'x-csrftoken': csrftoken
      })
    });
  }


  fetchDailyProblem(session: string, csrftoken: string): Observable<any> {
    const query = `query questionOfToday {
        activeDailyCodingChallengeQuestion {
            date
            userStatus
            link
            question {
                acRate
                difficulty
                frontendQuestionId: questionFrontendId
                title
                titleSlug
                topicTags {
                    name
                    id
                    slug
                }
                codeSnippets {
                    lang
                    code
                }
            }
        }
    }`;

    return this.http.post(this.graphqlUrl, {
      query
    }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cookie': `LEETCODE_SESSION=${session}; csrftoken=${csrftoken}`,
        'x-csrftoken': csrftoken
      })
    });
  }

  fetchProblemDescription(titleSlug: string, session: string, csrftoken: string): Observable<any> {
    const query = `query getQuestionDetail($titleSlug: String!) {
                    question(titleSlug: $titleSlug) {
                        content
                        hints
                        similarQuestionList {
                              difficulty
                              titleSlug
                              title
                              translatedTitle
                              isPaidOnly
                        }
                    }
                }`;

    const variables = {
      titleSlug: titleSlug
    };

    return this.http.post(this.graphqlUrl, {
      query,
      variables
    }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cookie': `LEETCODE_SESSION=${session}; csrftoken=${csrftoken}`,
        'x-csrftoken': csrftoken
      })
    });
  }

  fetchSimilarQuestions(titleSlug: string, session: string, csrftoken: string): Observable<any> {
    const query = `query SimilarQuestions($titleSlug: String!) {
                      question(titleSlug: $titleSlug) {
                          similarQuestionList {
                              difficulty
                              titleSlug
                              title
                              translatedTitle
                              isPaidOnly
                          }
                      }
                  }`;

    const variables = {
      titleSlug: titleSlug
    };

    return this.http.post(this.graphqlUrl, {
      query,
      variables
    }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cookie': `LEETCODE_SESSION=${session}; csrftoken=${csrftoken}`,
        'x-csrftoken': csrftoken
      })
    });
  }
}
