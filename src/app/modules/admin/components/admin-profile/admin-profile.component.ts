import { Component, Input } from '@angular/core';
import { Admin } from '../../models/admin';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../services/admin/admin.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-admin-profile',
    templateUrl: './admin-profile.component.html',
    styleUrls: ['./admin-profile.component.css'],
    standalone: true,
    imports: [FormsModule]
})
export class AdminProfileComponent {

  adminId: number;
  adminData: Admin;
  @Input() editable: boolean = false;
  constructor(private router: Router , private route: ActivatedRoute , private adminservice : AdminService) {
    this.route.params.subscribe(data=>
      this.adminData = adminservice.getAdminById(data['id'])
    )
    // console.log('doctor info',this.adminData);
  }
  // constructor(private router: Router, private route: ActivatedRoute, private adminService: AdminService) { }

  // ngOnInit(): void {
  //   this.route.params.subscribe(params => {
  //     this.adminId = params['id'];
  //     this.getAdminData();
  //   });
  // }

  // getAdminData(): void {
  //   this.adminService.getAdmin(this.adminId).subscribe(
  //     (response) => {
  //       this.adminData = response;
  //     },
  //     (error) => {
  //       // Handle error appropriately (e.g., show error message)
  //       console.error(error);
  //     }
  //   );
  // }

}
