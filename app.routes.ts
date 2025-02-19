import { Routes } from '@angular/router';
import { CountryLeagueTableComponent } from './country-league-table/country-league-table.component'; // import your component

export const routes: Routes = [
  { path: '', component: CountryLeagueTableComponent }, // Set the default route to the CountryLeagueTableComponent
  // You can add other routes as necessary, for example:
  // { path: 'another-page', component: AnotherComponent }
];
