// src/app/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3025'; // This is your API base URL
  private apiKey = 'your-16-digit-api-key';  // Replace with your actual API key

  constructor(private http: HttpClient) { }

  // Method to get countries data
  getCountries(): Observable<any> {
    const headers = new HttpHeaders().set('x-api-key', this.apiKey);  // Set the API key in the header
    return this.http.get<any>(`${this.baseUrl}/countries`, { headers });
  }

  // Method to get country summary data
  getCountrySummary(countryCode: string): Observable<any> {
    const headers = new HttpHeaders().set('x-api-key', this.apiKey);  // Set the API key in the header
    return this.http.get<any>(`${this.baseUrl}/countries/${countryCode}`, { headers });
  }

  // Update rate for a specific country
  updateCountryRate(countryCode: string, rate_wb: number): Observable<any> {
    const url = `${this.baseUrl}/countries/${countryCode}`;
    const headers = new HttpHeaders().set('x-api-key', this.apiKey);  // Set the API key in the header
    console.log('Updating country with URL:', url);  // Log the constructed URL
    return this.http.put(url, { rate_wb }, { headers });  // Send the API key along with the PUT request
  }
}
