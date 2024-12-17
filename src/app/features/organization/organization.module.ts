import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule, ClrAlertModule, ClrIconModule } from '@clr/angular';
import { SharedModule } from 'src/app/shared/shared.module';

import { CommonTemplatesActionsComponent } from './components/common-templates-actions/common-templates-actions.component';
import { GraphViewComponent } from './components/graph-view/graph-view.component';
import { GridViewComponent } from './components/grid-view/grid-view.component';
import { OrganizationRoutingModule } from './organization-routing.module';
import { OrganizationComponent } from './organization.component';

// import { ClrNotificationsModule } from '@clr/angular'; // Import for clr-toast functionality

@NgModule({
  declarations: [
    OrganizationComponent,
    GraphViewComponent,
    GridViewComponent,
    CommonTemplatesActionsComponent,
  ],
  imports: [
    CommonModule,
    ClrIconModule,
    ClarityModule,
    ClrAlertModule,
    FormsModule,
    SharedModule,
    OrganizationRoutingModule,
  ],
})
export class OrganizationModule {}
