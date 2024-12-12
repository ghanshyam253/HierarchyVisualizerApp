import {
  ApplicationRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { OrgChart } from 'd3-org-chart';
import { Employee } from 'src/app/shared/models/employee.model';
import { DesignationDataService } from 'src/app/shared/services/designation-data.service';

@Component({
  selector: 'app-graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphViewComponent implements OnInit {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  @Input() set employees(value: Employee[]) {
    this.employeeList = value.map((employee) => ({ ...employee })); // Clone data for immutability
    this.updateChart();
  }

  employeeList: Employee[] = [];
  chart: OrgChart<Employee> | undefined;

  constructor(
    private cdr: ChangeDetectorRef,
    private appRef: ApplicationRef,
    private elementRef: ElementRef,
    private designationDataService: DesignationDataService
  ) {}

  ngOnInit(): void {}

  private updateChart(): void {
    try {
      if (this.chart) {
        this.chart.data(this.employeeList).render();
      } else {
        this.createTree();
      }
    } catch (error) {
      console.error('Error creating/updating the org chart:', error);
      throw new Error('Cycle detected in the organization hierarchy.');
    }
  }

  private createTree(): void {
    if (!this.chartContainer || !this.employeeList.length) return;

    this.chart = new OrgChart<Employee>()
      .nodeId((dataItem) => (dataItem as Employee).employeeId)
      .parentNodeId((dataItem) => (dataItem as Employee).managerId)
      .container(this.chartContainer.nativeElement)
      .data(this.employeeList)
      .nodeWidth(() => 250)
      .nodeHeight(() => 100)
      .nodeContent((node) => this.createNodeContent(node))
      .onNodeClick((node) => this.handleNodeClick(node))
      .render();
  }

  private createNodeContent(node: any): string {
    const designationMapping: { [key: string]: string } =
      this.designationDataService.getDesignationsMapping();
    const designationCd: string = node.data.designation || '';
    const designationDesc = designationMapping[designationCd];

    return `
      <div style="padding: 10px; background-color: #2a3d5b; border-radius: 8px; color: white; width:${node.width}px; height:${node.height}px">
        <div style="font-size: 16px; font-weight: bold;">${node.data.name}</div>
        <div>${designationDesc}</div>
        <div>${node.data.email}</div>
        <div>${node.data.phoneNumber}</div>
      </div>
    `;
  }

  private handleNodeClick(node: any): void {
    console.log('Node clicked:', node);
  }

  // Action Handlers
  handleAction(event: MouseEvent, action: string, nodeId: number): void {
    event.stopPropagation();
    console.log(`Action: ${action} on node ${nodeId}`);

    switch (action) {
      case 'add-reportee':
        this.addReportee(nodeId);
        break;
      case 'edit-details':
        this.editEmployeeDetails(nodeId);
        break;
      case 'delete-employee':
        this.deleteEmployee(nodeId);
        break;
      case 'change-reporting':
        this.changeReportingLine(nodeId);
        break;
      default:
        console.warn('Unknown action:', action);
    }
  }

  private addReportee(nodeId: number): void {
    console.log(`Add reportee to node ${nodeId}`);
  }

  private editEmployeeDetails(nodeId: number): void {
    console.log(`Edit details for employee ${nodeId}`);
  }

  private deleteEmployee(nodeId: number): void {
    console.log(`Delete employee ${nodeId}`);
  }

  private changeReportingLine(nodeId: number): void {
    console.log(`Change reporting line for employee ${nodeId}`);
  }
}
