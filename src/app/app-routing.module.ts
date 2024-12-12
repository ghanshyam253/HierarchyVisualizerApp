import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/org-chart', pathMatch: 'full' },
  {
    path: 'org-chart',
    loadChildren: () =>
      import('./features/organization/organization.module').then(
        (m) => m.OrganizationModule
      ),
  },
];

// const routes: Routes = [
//   { path: '', redirectTo: '/org-chart', pathMatch: 'full' },
//   { path: 'org-chart', component: GridViewComponent },
//   { path: 'org-chart/graph', component: GraphViewComponent }
// ];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
