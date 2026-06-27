import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { RoomsService } from '../../Services/rooms/rooms.service';
 
@Component({
  selector: 'app-add-new-room',
  templateUrl: './add-new-room.component.html',
  styleUrls: ['./add-new-room.component.css']
})
export class AddNewRoomComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  form: FormGroup;
  clinics: string[] = [];
  parentRooms: any[] = [];
  isLoadingParentRooms = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddNewRoomComponent>,
    private roomsService: RoomsService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      roomName: ['', Validators.required],
      isLaser: ['', Validators.required],
      clinicName: ['', Validators.required],
      parentRoomId: ['']
    });
  }

  ngOnInit(): void {
    this.loadClinics();
    this.form.get('clinicName')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(clinic => {
        this.form.patchValue({ parentRoomId: '' });
        if (clinic) this.loadParentRooms();
        else { this.parentRooms = []; this.cdr.detectChanges(); }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadClinics(): void {
    this.roomsService.allClinics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => { this.clinics = data; this.cdr.detectChanges(); },
        error: (err) => console.error('Error loading clinics:', err)
      });
  }

  private loadParentRooms(): void {
    this.isLoadingParentRooms = true;
    this.cdr.detectChanges();

    this.roomsService.getAllRoomsV2()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rooms) => { this.parentRooms = rooms; this.isLoadingParentRooms = false; this.cdr.detectChanges(); },
        error: () => { this.parentRooms = []; this.isLoadingParentRooms = false; this.cdr.detectChanges(); }
      });
  }

  submit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(k => this.form.get(k)?.markAsTouched());
      return;
    }

    const payload = { ...this.form.value };
    payload.parentRoomId = parseInt(payload.parentRoomId) || null;
    payload.isLaser = payload.isLaser === 'true';

    this.roomsService.addRoom(payload).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.refreshAndClose();
      },
      error: (err) => alert(err.error?.message || 'Error adding room')
    });
  }

  private refreshAndClose(): void {
    this.roomsService.getAllRoomsV2().subscribe({
      next: (rooms) => { this.roomsService.updateRooms(rooms); this.dialogRef.close('room-added'); },
      error: () => this.dialogRef.close('room-added')
    });
  }

  closeDialog(): void { this.dialogRef.close(); }
}