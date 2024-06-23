import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  private countryUrl = 'http://localhost:8080/api/countries';
  private stateUrl = 'http://localhost:8080/api/states';

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.countryUrl).pipe(
      map((response) => response._embedded.countries)
    )
  }

  getStates(theCountryCode: string): Observable<State[]> {
    const searchStateUrl = `${this.stateUrl}/search/findByCountryCode?code=${theCountryCode}`
    return this.httpClient.get<GetResponseStates>(searchStateUrl)
      .pipe(
        map((response) => response._embedded.states)
      )
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }
    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }

    return of(data);
  }
}
interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number,
  };
}
interface GetResponseStates {
  _embedded: {
    states: State[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number,
  };
}
