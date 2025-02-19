import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountryLeagueTableComponent } from './country-league-table/country-league-table.component';
import { FormsModule } from '@angular/forms';  // Import FormsModule here


const routes: Routes = [
  { path: '', component: CountryLeagueTableComponent },
  // add more routes here
];

@NgModule({
  imports: [RouterModule.forRoot(routes), FormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
