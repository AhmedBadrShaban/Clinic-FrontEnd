import { Component, Inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { RoomsService, Room } from '../../Services/rooms/rooms.service';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'app-add-new-room',
    templateUrl: './add-new-room.component.html',
    styleUrls: ['./add-new-room.component.css'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgIf, NgFor]
})
export class AddNewRoomComponent implements OnInit, OnDestroy {
  newRoomFm: FormGroup;
  clinics: string[] = [];
  parentRooms: Room[] = [];
  isLoadingParentRooms = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddNewRoomComponent>,
    private roomService: RoomsService,
    private cdr: ChangeDetectorRef
  ) {
    this.newRoomFm = fb.group({
      roomName: ['', [Validators.required]],
      isLaser: ['', [Validators.required]],
      clinicName: ['', [Validators.required]],
      parentRoomId: ['']
    });
  }

  ngOnInit(): void {
    this.loadClinics();
    this.setupClinicChangeListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadClinics(): void {
    this.roomService.allClinics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.clinics = data;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading clinics:', error);
        }
      });
  }

  private setupClinicChangeListener(): void {
    this.newRoomFm.get('clinicName')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(clinicName => {
        console.log('🏥 Clinic changed to:', clinicName);

        if (clinicName) {
          this.loadParentRooms(clinicName);
          // Reset parent room selection when clinic changes
          this.newRoomFm.patchValue({ parentRoomId: '' });
        } else {
          this.parentRooms = [];
          this.cdr.detectChanges();
        }
      });
  }

  private loadParentRooms(clinicName?: string): void {
    this.isLoadingParentRooms = true;
    this.cdr.detectChanges();

    this.roomService.getAllRoomsV2()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rooms) => {
          console.log('✅ Parent rooms loaded:', rooms);
          this.parentRooms = rooms;
          this.isLoadingParentRooms = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('❌ Error loading parent rooms:', error);
          this.parentRooms = [];
          this.isLoadingParentRooms = false;
          this.cdr.detectChanges();
        }
      });
  }

  submit() {
    if (this.newRoomFm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    let userModel = this.newRoomFm.value;

    // Convert parentRoomId to number and isLaser to boolean
    userModel.parentRoomId = parseInt(userModel.parentRoomId);
    userModel.isLaser = userModel.isLaser === 'true';

    console.log('Submitting room data:', userModel);

    this.roomService.addRoom(userModel).subscribe({
      next: (response: any) => {
        console.log('Room added successfully:', response);
        alert(response.message);

        // Update rooms with the current clinic context and close
        this.updateRoomsAndClose();
      },
      error: (err) => {
        console.error('Error adding room:', err);
        alert(err.error?.message || 'Error adding room');
      }
    });
  }
  // Simplified methods for AddNewRoomComponent (admin only)
  private updateRoomsAndClose(): void {

    this.roomService.getAllRoomsV2().subscribe({
      next: (data) => {
         this.roomService.updateRooms(data);
        this.closeDialogWithSuccess();
      },
      error: (error) => {
        console.error('Error refreshing rooms:', error);
        this.closeDialogWithSuccess();
      }
    });
  }


  private closeDialogWithSuccess(): void {
    this.dialogRef.close('room-added');
  }

  private markFormGroupTouched(): void {
    Object.keys(this.newRoomFm.controls).forEach(key => {
      this.newRoomFm.get(key)?.markAsTouched();
    });
  }

  updateRooms() {
    this.roomService.getAllRoomsV2().subscribe((data) => {
      this.roomService.updateRooms(data);
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
