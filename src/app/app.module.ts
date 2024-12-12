import '@cds/core/icon/register.js';

import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityIcons, ellipsisVerticalIcon, homeIcon, userIcon } from '@cds/core/icon';
import { ClarityModule, ClrIconModule } from '@clr/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GlobalErrorHandler } from './core/error-handler/global-error-handler';
import { EmployeeEffects } from './core/store/employee.effects';
import { employeeReducer } from './core/store/employee.reducer';

// import { employeeReducer } from './store/employee.reducer';
ClarityIcons.addIcons(homeIcon, userIcon, ellipsisVerticalIcon);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClrIconModule,
    ClarityModule,
    FormsModule,
    BrowserAnimationsModule,
    // StoreModule.forRoot({ employeeState: employeeReducer })
    StoreModule.forRoot({ employees: employeeReducer }), // Register the employee reducer
    EffectsModule.forRoot([EmployeeEffects]), // Register the effects

    // StoreModule.forRoot({}, {}),
    // StoreDevtoolsModule.instrument({ maxAge: 25 }),
  ],
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler }, // Register the custom error handler
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
