import {
  ApplicationRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrgChart } from 'd3-org-chart';
import { Employee } from 'src/app/shared/models/employee.model';
import { DesignationDataService } from 'src/app/shared/services/designation-data.service';

import { CommonTemplatesActionsComponent } from '../common-templates-actions/common-templates-actions.component';

@Component({
  selector: 'app-graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphViewComponent implements OnInit {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  @ViewChild(CommonTemplatesActionsComponent)
  commonTemplatesActionsComponent!: CommonTemplatesActionsComponent;
  nodename!: string;
  showNotificationForEmployeeUnavailability: boolean = false;
  isProgrammaticNavigation: boolean = false;

  @Input() set employees(value: Employee[]) {
    this.employeeList = value.map((employee) => ({ ...employee })); // Clone data for immutability
    this.updateChart();
  }
  private eventListeners: (() => void)[] = []; // Array to store references to the registered event listeners

  employeeList: Employee[] = [];
  chart: OrgChart<Employee> | undefined;
  compact = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    private appRef: ApplicationRef,
    private elementRef: ElementRef,
    private designationDataService: DesignationDataService,
    private router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    // Fetch and initialize the chart
    this.route.queryParams.subscribe((params) => {
      if (this.isProgrammaticNavigation) {
        this.isProgrammaticNavigation = false; // Reset the flag
        return; // Do not execute further if navigation was programmatic
      }

      const rootNodeId = params['employeeId'] || null;
      if (rootNodeId) {
        this.updateChart(rootNodeId);
      }
    });
  }

  findEmployeeById(employeeId: string) {
    const employee = this.employeeList.find(
      (emp) => emp.employeeId === employeeId
    );
    return employee || null;
  }

  private updateChart(rootNodeId?: string | null): void {
    try {
      if (this.chart) {
        this.chart.data(this.employeeList).compact(false).render().expandAll();
      } else {
        this.createTree();
      }

      if (rootNodeId) {
        const rootNode = this.findEmployeeById(rootNodeId);

        if (rootNode && this.chart) {
          this.chart.clearHighlighting();

          this.chart
            .setCentered(rootNode.employeeId)
            .setHighlighted(rootNode.employeeId)
            .render(); // Pass the node ID instead of the object
        } else {
          this.showNotificationForEmployeeUnavailability = true;
        }
      }
      this.addEventListeners();
    } catch (error) {
      console.error('Error creating/updating the org chart:', error);
      throw new Error('Cycle detected in the organization hierarchy.');
    }
  }

  private createTree(rootNodeId?: string | null): void {
    if (!this.chartContainer || !this.employeeList.length) return;

    if (!this.chart) {
      this.chart = new OrgChart<Employee>()
        .nodeId((dataItem) => (dataItem as Employee).employeeId)
        .parentNodeId((dataItem) => (dataItem as Employee).managerId)
        .container(this.chartContainer.nativeElement)
        .data(this.employeeList)
        .nodeWidth(() => 230)
        .nodeHeight(() => 110)
        .nodeContent((node) => this.createNodeContent(node))
        .onNodeClick((node) => this.handleNodeClick(node))
        .compact(false)
        .render()
        .expandAll();
    }
  }
  cleanupEventListeners() {
    this.eventListeners.forEach((unlisten) => unlisten());
    this.eventListeners = [];
  }

  // Add event listeners for the action buttons
  addEventListeners() {
    // Clean up old listeners
    this.cleanupEventListeners();

    const buttons =
      this.chartContainer.nativeElement.querySelectorAll('.action-btn');

    buttons.forEach((btn: any) => {
      const listener = this.renderer.listen(btn, 'click', (event: any) => {
        event.stopPropagation();
        const action = event.target.getAttribute('data-action');
        const nodeId = event.target.getAttribute('data-id');
        this.handleAction(action, nodeId);
      });
      // Store the reference to the event listener for future cleanup
      this.eventListeners.push(listener);
    });
  }
  // Handle button actions based on the type
  handleAction(action: string, nodeId: string) {
    this.cdr.markForCheck(); // Manually trigger change detection

    const rootNode = this.findEmployeeById(nodeId);
    if (!rootNode) {
      return;
    }
    switch (action) {
      case 'add':
        this.commonTemplatesActionsComponent.openAddReporteeDialog(rootNode);
        break;
      case 'edit':
        this.commonTemplatesActionsComponent.openEditDialog(rootNode);
        break;
      case 'delete':
        this.commonTemplatesActionsComponent.openDeleteDialog(rootNode);
        break;
      case 'changeReportingLine':
        this.commonTemplatesActionsComponent.openChangeReportingLineDialog(
          rootNode
        );
        break;
      default:
        console.warn('Unknown action:', action);
    }
  }
  private createNodeContent(node: any): string {
    const designationMapping: { [key: string]: string } =
      this.designationDataService.getDesignationsMapping();
    const designationCd: string = node.data.designation || '';
    const designationDesc = designationMapping[designationCd];

    return `
      <div style="padding: 10px; background-color: #2a3d5b; border-radius: 8px; color: white; width:${node.width}px; height:${node.height}px">
       <div class="actions-icon">
  <!--    //   <button id="action-btn" onclick="toggleDropdown()">
      //     ⚙️
      //   </button>
      //   <ul class="dropdown-action-menu">
      //     <li><a href="#" class="add">➕ Add Reportee</a></li>
      //     <li><a href="#" class="edit">✏️ Edit Details</a></li>
      //     <li><a href="#" class="delete">❌ Delete Employee</a></li>
      //     <li><a href="#" class="change">↔️ Change Reporting Line</a></li>
      //   </ul>
      // </div>
 -->

        <div style="font-size: 16px; font-weight: bold;">${node.data.name}</div>
        <div>${designationDesc}</div>
        <div>${node.data.email}</div>
        <div>${node.data.phoneNumber}</div>

          <div class="action-buttons" style="">
        
            <button  role="tooltip" aria-haspopup="true" class="btn btn-primary btn-sm action-btn tooltip" data-id="${node.data.employeeId}" data-action="add" >Add <span class="tooltip-content">Add Reportee</span> </button>
            <button  role="tooltip" aria-haspopup="true" class="btn btn-primary btn-sm action-btn tooltip" data-id="${node.data.employeeId}" data-action="edit" >Edit <span class="tooltip-content">Edit Details</span>  </button>
            <button  role="tooltip" aria-haspopup="true" class="btn btn-primary btn-sm action-btn tooltip" data-id="${node.data.employeeId}" data-action="delete" >Delete <span class="tooltip-content">Delete Employee</span> </button>
            <button  role="tooltip" aria-haspopup="true" class="btn btn-primary btn-sm action-btn tooltip" data-id="${node.data.employeeId}" data-action="changeReportingLine" >Change <span class="tooltip-content">Change Reporting Line</span> </button>

          </div>
          
      </div>
    `;
  }

  private handleNodeClick(node: any): void {
    console.log('handleNodeClick method Node clicked:', node);

    // Step 2: Update the rootId and change the route
    const newRootId = node.id; // Assuming nodes have an `id` property
    this.isProgrammaticNavigation = true; // Set the flag before navigating programmatically
    this.router.navigate([], {
      queryParams: { employeeId: newRootId },
      queryParamsHandling: 'merge',
    });
  }
}
