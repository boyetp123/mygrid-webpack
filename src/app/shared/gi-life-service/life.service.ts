import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class LifeService {
  private lifeData: string[];
  private userData: string[];

  constructor (
    private http: Http) {
      // Some Stuff
    }

  getUserData(): any {
    return this.userData;
  }

  getData(): any {
    return this.lifeData;
  }

  postData(data: any): Observable<any> {
    this.userData = data;

    const headers = new Headers();
    const body = new URLSearchParams(data);

    let url = '/needsservices/service/needs/life';
    // let url = 'https://isso-dev.prudential.com/needsservices/service/needs/life';

    headers.append('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    body.set('input', JSON.stringify(data));

    return this.http.post(url, body, {
        headers: headers
      })
      .map((response: any) => {
          this.lifeData = response.json();
          return response.json();
        });
  }

  currentLifeNeed(): any {
    console.log(this.lifeData['lifeNeedsInfo']);
  }

}
