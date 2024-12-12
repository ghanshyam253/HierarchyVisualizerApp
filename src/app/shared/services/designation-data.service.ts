import { Injectable } from '@angular/core';

import { Designation } from '../models/designation.model';

@Injectable({
  providedIn: 'root',
})
export class DesignationDataService {
  private designationsList: Designation[] = [
    { designationCode: 'CEO', designationDesc: 'Chief Executive Officer' },
    { designationCode: 'HEAD_ENG', designationDesc: 'Head of Engineering' },
    { designationCode: 'HEAD_SALES', designationDesc: 'Head of Sales' },
    { designationCode: 'HEAD_MKT', designationDesc: 'Head of Marketing' },
    { designationCode: 'ENG_MGR', designationDesc: 'Engineering Manager' },
    { designationCode: 'UX_DES', designationDesc: 'Product UX Designer' },
    { designationCode: 'DEVOPS_ENG', designationDesc: 'DevOps Engineer' },
    { designationCode: 'SALES_EXEC', designationDesc: 'Sales Executive' },
  ];
  constructor() {}

  /**
   * Fetches the list of designations.
   * @returns An Observable containing the list of designations.
   */
  getDesignationsList(): Designation[] {
    return this.designationsList;
  }
  getDesignationsMapping() {
    return this.designationsList.reduce(
      (acc, designation) => ({
        ...acc,
        [designation.designationCode]: designation.designationDesc,
      }),
      {}
    );

    // return this.designationsList;
  }
}
