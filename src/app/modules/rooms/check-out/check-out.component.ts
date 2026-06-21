import { CompletedService, PointsService } from './../../receptionist/models/payment';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomsService } from '../../Services/rooms/rooms.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PaymentService } from '../../receptionist/services/payment/payment.service';
import { NormalPayment, Payments } from '../../receptionist/models/payment';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ConfirmPaymentDialogComponent,
  ConfirmPaymentDialogData,
  PaymentSummaryLine,
} from './confirm-payment-dialog/confirm-payment-dialog.component';
import {
  FinalCheckoutSummaryDialogComponent,
  FinalCheckoutSummaryData,
  ServicePaymentSummary,
} from './final-checkout-summary-dialog/final-checkout-summary-dialog.component';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css'],
})
export class CheckOutComponent implements OnInit {
  id: number;
  patientName: string = '';
  patientPhone: string = '';
  completedServices: CompletedService[] = [];
  selectedCardIndex: number = 0;
  selectedMethod: number = 0;
  paymentsMethods: Payments = {
    normal: [],
    points: [],
    pointsService: [],
    packages: [],
  };
  showReceipt: boolean = false;
  normalPayment: NormalPayment = {
    serviceName: '',
    pulses: 0,
    cash: null,
    visa: null,
    vodafoneCash: null,
    debit: null,
    credit: null,
    instaPay: null,
    totalCost: null,
  };
  TotalPoints: number = 0;
  usedPoints: number = 0;
  showPointsButton: boolean = false;
  showRemainCash: boolean = false;
  generatedAt: Date = new Date();
  displayedColumns: string[] = [
    'serviceName',
    'pulses',
    'price',
    'totalCost',
    'payments',
  ];

  @ViewChild('checkoutReceiptSection', { static: false })
  checkoutReceiptSection?: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private checkOutService: RoomsService,
    private payment: PaymentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.patientName = params['patientName'];
      this.patientPhone = params['patientPhone'];
    });
    this.route.params.subscribe((params) => {
      this.id = +params['id'];
      this.checkOutService.checkOutReservation(this.id).subscribe({
        next: (data) => {
          this.completedServices = data.map((service: CompletedService) => ({
            ...service,
            Paid: false,
          }));
          this.availablePaymentsMethods();
        },
        error: (err) => {
          alert(err.error.text);
          this.navigateToRooms();
        },
      });
    });
  }

  availablePaymentsMethods() {
    this.payment.AvaillableMethods(this.id).subscribe((data) => {
      if (data.normal) {
        this.paymentsMethods.normal = data.normal;
      }
      this.paymentsMethods.packages = data.packages;
      this.paymentsMethods.points = data.points;
      if (this.paymentsMethods.points.length > 0) {
        this.TotalPoints = this.paymentsMethods.points[0];
      }
    });
  }

  // ─── helpers ────────────────────────────────────────────────────────────────

  /** Format a number with EGP currency label */
  private fmt(v: number | null): string {
    if (!v) return '—';
    return `${v.toLocaleString()} EGP`;
  }

  /** Build the normal-payment breakdown lines for dialog / toast */
  private buildNormalLines(p: NormalPayment): PaymentSummaryLine[] {
    const lines: PaymentSummaryLine[] = [];
    if (p.cash) lines.push({ label: 'Cash', value: this.fmt(p.cash) });
    if (p.visa) lines.push({ label: 'Visa', value: this.fmt(p.visa) });
    if (p.vodafoneCash) lines.push({ label: 'VodafoneCash', value: this.fmt(p.vodafoneCash) });
    if (p.credit) lines.push({ label: 'Credit', value: this.fmt(p.credit) });
    if (p.debit) lines.push({ label: 'Debit', value: this.fmt(p.debit) });
    if (p.instaPay) lines.push({ label: 'InstaPay', value: this.fmt(p.instaPay) });
    if (p.totalCost) lines.push({ label: 'Total', value: this.fmt(p.totalCost) });
    return lines;
  }

  /** Build a human-readable toast message from normal payment breakdown */
  private buildNormalToastText(serviceName: string, p: NormalPayment): string {
    const parts: string[] = [];
    if (p.cash) parts.push(`Cash ${this.fmt(p.cash)}`);
    if (p.visa) parts.push(`Visa ${this.fmt(p.visa)}`);
    if (p.vodafoneCash) parts.push(`VCash ${this.fmt(p.vodafoneCash)}`);
    if (p.credit) parts.push(`Credit ${this.fmt(p.credit)}`);
    if (p.debit) parts.push(`Debit ${this.fmt(p.debit)}`);
    if (p.instaPay) parts.push(`InstaPay ${this.fmt(p.instaPay)}`);
    return `✅ "${serviceName}" paid: ${parts.join(' + ')}`;
  }

  /** Show points-summary appended toast */
  private showPointsSummaryToast(
    mainMessage: string,
    pointsBefore: number,
    pointsUsed: number,
    pointsAfter: number
  ) {
    const pointsNote = `  |  ⭐ Points: ${pointsBefore} → −${pointsUsed} → ${pointsAfter} remaining`;
    this.snackBar.open(mainMessage + pointsNote, 'OK', {
      duration: 5000,
      panelClass: ['snack-points'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  /** Show a plain toast */
  private showToast(message: string, panelClass = 'snack-success') {
    this.snackBar.open(message, 'OK', {
      duration: 4000,
      panelClass: [panelClass],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  /** Open the confirmation dialog; returns a Promise<boolean> */
  private openConfirm(data: ConfirmPaymentDialogData): Promise<boolean> {
    return this.dialog
      .open(ConfirmPaymentDialogComponent, {
        data,
        width: '440px',
        disableClose: true,
      })
      .afterClosed()
      .toPromise()
      .then((result) => !!result);
  }

  // ─── payment actions ────────────────────────────────────────────────────────

  CompletePayment() {
    const done = this.areAllServicesPaid();
    if (!done) {
      alert('There Are Services Not Paid Yet');
      return;
    }

    // ── build per-service summary ──────────────────────────────────────────
    const services: ServicePaymentSummary[] = this.completedServices.map(s => {
      const normalEntry = this.paymentsMethods.normal.find(n => n.serviceName === s.serviceName);
      const pointsEntry = this.paymentsMethods.pointsService.find(ps => ps.serviceName === s.serviceName);
      const packageEntry = this.paymentsMethods.packages.find(
        pk => pk.reservedServiceInPackage?.serviceName === s.serviceName
      );

      // Determine payment type
      let paymentType: ServicePaymentSummary['paymentType'] = 'normal';
      if (packageEntry && !normalEntry && !pointsEntry) {
        paymentType = 'package';
      } else if (pointsEntry && !normalEntry) {
        paymentType = 'points';
      } else if (pointsEntry && normalEntry) {
        paymentType = 'mixed';
      } else {
        paymentType = 'normal';
      }

      return {
        serviceName: s.serviceName,
        pulses: s.pulses,
        price: s.price,
        totalCost: s.totalCost,
        paymentType,
        cash: normalEntry?.cash ?? undefined,
        visa: normalEntry?.visa ?? undefined,
        vodafoneCash: normalEntry?.vodafoneCash ?? undefined,
        credit: normalEntry?.credit ?? undefined,
        debit: normalEntry?.debit ?? undefined,
        instaPay: normalEntry?.instaPay ?? undefined,
        cashTotal: normalEntry?.totalCost ?? undefined,
        pointsUsed: pointsEntry?.numberOfPulses ?? undefined,
        packageSessionsLeft: packageEntry?.reservedServiceInPackage?.sessions ?? undefined,
      };
    });

    const grandTotal = this.getTotalPaid() ;
    const pointsBefore = this.TotalPoints;                      // original total loaded at start
    const pointsAfter = this.paymentsMethods.points[0] ?? 0;  // current remaining

    // ── open final summary dialog ──────────────────────────────────────────
    this.dialog
      .open(FinalCheckoutSummaryDialogComponent, {
        data: <FinalCheckoutSummaryData>{
          patientName: this.patientName,
          patientPhone: this.patientPhone,
          services,
          grandTotal,
          pointsBefore,
          pointsAfter,
        },
        width: '580px',
        disableClose: true,
      })
      .afterClosed()
      .subscribe((confirmed: boolean) => {
        if (!confirmed) return;

        if (this.paymentsMethods.points.length === 0) {
          this.paymentsMethods.points.push(0);
        }
        this.payment.completePayment(this.id, this.paymentsMethods).subscribe({
          next: (res: any) => {
            alert(res.message);
            this.navigateToRooms();
          },
          error: (err) => {
            alert(err.error.message);
          },
        });
      });
  }

  async submitNormalPayment(s: CompletedService) {
    const overAllCost = s.totalCost;
    this.normalPayment.serviceName = s.serviceName;

    let paid =
      (this.normalPayment.cash || 0) +
      (this.normalPayment.vodafoneCash || 0) +
      (this.normalPayment.visa || 0) +
      (this.normalPayment.credit || 0) +
      (this.normalPayment.instaPay || 0) +
      (this.normalPayment.debit || 0);

    this.normalPayment.totalCost = paid;
    if (s.price) {
      this.normalPayment.pulses = paid / s.price;
    }

    if (!this.showRemainCash) {
      this.usedPoints = 0;
    }

    if (overAllCost > paid + this.usedPoints * s.price) {
      if (
        this.paymentsMethods.points[0] >
        overAllCost - paid + this.usedPoints * s.price
      ) {
        this.showPointsButton = true;
        return;
      } else {
        alert('Total Payments is Less Than Total Cost');
        return;
      }
    } else if (overAllCost < paid + this.usedPoints * s.price) {
      alert('Total Payments Value is More Than the Total Cost !!');
      return;
    }

    // ── confirmation dialog ──
    const lines = this.buildNormalLines(this.normalPayment);
    const confirmed = await this.openConfirm({
      serviceName: s.serviceName,
      method: 'normal',
      lines,
    });
    if (!confirmed) return;

    // ── commit ──
    const snapshot = { ...this.normalPayment };
    this.paymentsMethods.normal.push(snapshot);
    this.updatePaidStatus(s.serviceName, true);
    this.reset();
    this.selectedCardIndex += 1;

    this.showToast(this.buildNormalToastText(s.serviceName, snapshot));
  }

  async payUsingRemainPoints(s: CompletedService) {
    const paid =
      (this.normalPayment.cash || 0) +
      (this.normalPayment.vodafoneCash || 0) +
      (this.normalPayment.visa || 0) +
      (this.normalPayment.credit || 0) +
      (this.normalPayment.instaPay || 0) +
      (this.normalPayment.debit || 0);

    if (!this.showRemainCash) {
      this.usedPoints = 0;
    }

    const pointsToUse = (s.totalCost - paid) / s.price - this.usedPoints;
    const pointsBefore = this.paymentsMethods.points[0];
    const pointsAfter = pointsBefore - pointsToUse;

    const lines: PaymentSummaryLine[] = [
      ...this.buildNormalLines(this.normalPayment),
      { label: 'Points used', value: `${pointsToUse} pts` },
    ];

    const confirmed = await this.openConfirm({
      serviceName: s.serviceName,
      method: 'remainPoints',
      lines,
      pointsBefore,
      pointsUsed: pointsToUse,
      pointsAfter,
    });
    if (!confirmed) return;

    // ── commit ──
    const pointService: PointsService = {
      serviceName: s.serviceName,
      numberOfPulses: pointsToUse,
    };
    this.paymentsMethods.points[0] -= pointService.numberOfPulses;
    this.paymentsMethods.normal.push({ ...this.normalPayment });
    this.paymentsMethods.pointsService.push(pointService);
    this.updatePaidStatus(s.serviceName, true);
    this.reset();
    this.selectedCardIndex += 1;

    const cashText = this.buildNormalToastText(s.serviceName, this.normalPayment)
      .replace(`✅ "${s.serviceName}" paid: `, '');
    this.showPointsSummaryToast(
      `✅ "${s.serviceName}" paid: ${cashText} + ${pointsToUse} pts`,
      pointsBefore,
      pointsToUse,
      pointsAfter
    );
  }

  async PayUsingPoints(s: CompletedService) {
    if (
      this.usedPoints < 0 ||
      this.usedPoints > this.paymentsMethods.points[0]
    ) {
      alert('Not allowed Value');
      return;
    } else if (this.usedPoints > s.pulses) {
      alert('Used Points is More Than Required Service Points !');
      return;
    }

    const pointsBefore = this.paymentsMethods.points[0];
    const pointsAfter = pointsBefore - this.usedPoints;

    // Cash still needed if user is paying fewer points than required pulses
    const remainingPulses = s.pulses - this.usedPoints;
    const remainingCashNeeded = remainingPulses > 0 ? remainingPulses * s.price : 0;

    const lines: PaymentSummaryLine[] = [
      { label: 'Points used', value: `${this.usedPoints} pts` },
      { label: 'Required pulses', value: `${s.pulses} pts` },
    ];

    const confirmed = await this.openConfirm({
      serviceName: s.serviceName,
      method: 'points',
      lines,
      pointsBefore,
      pointsUsed: this.usedPoints,
      pointsAfter,
      remainingCashNeeded: remainingCashNeeded > 0 ? remainingCashNeeded : undefined,
    });
    if (!confirmed) return;

    // ── commit ──
    const pointService: PointsService = {
      serviceName: s.serviceName,
      numberOfPulses: this.usedPoints,
    };
    const usedSnapshot = this.usedPoints;
    this.paymentsMethods.points[0] -= this.usedPoints;
    this.paymentsMethods.pointsService.push(pointService);

    if (s.pulses !== this.usedPoints) {
      this.showRemainCash = true;
      this.showPointsSummaryToast(
        `⭐ "${s.serviceName}" partially paid using ${usedSnapshot} pts — complete with cash`,
        pointsBefore,
        usedSnapshot,
        pointsAfter
      );
      return;
    }

    this.updatePaidStatus(s.serviceName, true);
    this.reset();
    this.selectedCardIndex += 1;

    this.showPointsSummaryToast(
      `⭐ "${s.serviceName}" fully paid using ${usedSnapshot} pts`,
      pointsBefore,
      usedSnapshot,
      pointsAfter
    );
  }

  async payFromPackages(index: number, s: CompletedService) {
    // Find remaining sessions before decrement for the dialog
    let remainingBefore = 0;
    for (const pack of this.paymentsMethods.packages) {
      if (pack.reservedServiceInPackage?.serviceName === s.serviceName) {
        remainingBefore = pack.reservedServiceInPackage.sessions;
        break;
      }
    }

    const lines: PaymentSummaryLine[] = [
      { label: 'Service', value: s.serviceName },
      { label: 'Sessions remaining', value: `${remainingBefore}` },
      { label: 'After this payment', value: `${remainingBefore - 1}` },
    ];

    const confirmed = await this.openConfirm({
      serviceName: s.serviceName,
      method: 'package',
      lines,
    });
    if (!confirmed) return;

    // ── commit ──
    this.selectedCardIndex = index;
    this.selectedMethod = 3;
    for (const pack of this.paymentsMethods.packages) {
      if (pack.reservedServiceInPackage?.serviceName === s.serviceName) {
        pack.reservedServiceInPackage.sessions -= 1;
        break;
      }
    }
    this.updatePaidStatus(s.serviceName, true);
    this.reset();
    this.selectedCardIndex += 1;

    this.showToast(
      `📦 "${s.serviceName}" paid from Package — ${remainingBefore - 1} session(s) remaining`,
      'snack-package'
    );
  }

  // ─── unchanged helpers ───────────────────────────────────────────────────────

  updatePaidStatus(serviceName: string, paid: boolean): void {
    const serviceIndex = this.completedServices.findIndex(
      (service) => service.serviceName === serviceName
    );
    if (serviceIndex !== -1) {
      this.completedServices[serviceIndex].Paid = paid;
    } else {
      console.warn(`Service with serviceName ${serviceName} not found.`);
    }
  }

  reset() {
    this.normalPayment = {
      serviceName: '',
      pulses: 0,
      cash: null,
      vodafoneCash: null,
      visa: null,
      credit: null,
      instaPay: null,
      debit: null,
      totalCost: null,
    };
    this.showPointsButton = false;
    this.showRemainCash = false;
    this.TotalPoints = this.paymentsMethods.points[0];
    this.usedPoints = 0;
  }

  clear() {
    this.showPointsButton = false;
  }

  areAllServicesPaid(): boolean {
    return this.completedServices.every((service) => service.Paid === true);
  }

  doesServiceExist(serviceNameToSearch: string): number {
    for (const pack of this.paymentsMethods.packages) {
      if (pack.reservedServiceInPackage?.serviceName === serviceNameToSearch) {
        return pack.reservedServiceInPackage.sessions;
      }
    }
    return 0;
  }

  /** Points already committed to paymentsMethods.pointsService for a given service */
  private getCommittedPoints(serviceName: string): number {
    return this.paymentsMethods.pointsService
      .filter(ps => ps.serviceName === serviceName)
      .reduce((sum, ps) => sum + ps.numberOfPulses, 0);
  }

  /** EGP cash still owed after committed points — used in "Remain Cash" button label */
  getRemainingCash(s: CompletedService): number {
    const committedPulses = this.getCommittedPoints(s.serviceName);
    const remainingPulses = s.pulses - committedPulses;
    return remainingPulses > 0 ? remainingPulses * s.price : 0;
  }

  /** Pulses still unpaid after cash entered so far AND committed points — used in "Remain Points" button label */
  getRemainingPoints(s: CompletedService): number {
    if (!s.price) return 0;
    const paid =
      (this.normalPayment.cash || 0) +
      (this.normalPayment.vodafoneCash || 0) +
      (this.normalPayment.visa || 0) +
      (this.normalPayment.credit || 0) +
      (this.normalPayment.instaPay || 0) +
      (this.normalPayment.debit || 0);
    const committedPulses = this.getCommittedPoints(s.serviceName);
    const paidPulses = paid / s.price;
    return Math.max(0, s.pulses - paidPulses - committedPulses);
  }

  showNormal(index: number) {
    this.selectedCardIndex = index;
    this.selectedMethod = 1;
  }

  showPoints(index: number) {
    this.selectedCardIndex = index;
    this.selectedMethod = 2;
  }

  generateCheckoutPDF(): void {
    const receiptElement = this.checkoutReceiptSection?.nativeElement;
    if (!receiptElement) {
      alert('No receipt data to export');
      this.navigateToRooms();
      return;
    }

    html2canvas(receiptElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#fff',
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const logoImg = new Image();
        logoImg.onload = () => {
          pdf.addImage(logoImg, 'PNG', 10, 10, 30, 30);
          let y = 40;
          if (imgHeight > pdfHeight - y - 10) {
            let remainingHeight = imgHeight;
            let position = y;
            while (remainingHeight > 0) {
              pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
              remainingHeight -= pdfHeight - y;
              if (remainingHeight > 0) {
                pdf.addPage();
                position = 10;
              }
            }
          } else {
            pdf.addImage(imgData, 'PNG', 10, y, imgWidth, imgHeight);
          }
          const dateStr = new Date().toISOString().split('T')[0];
          pdf.save(
            `checkout-${this.id}-${this.patientName}-${dateStr}.pdf`
          );
          this.navigateToRooms();
        };
        logoImg.src = 'assets/logo.png';
      })
      .catch(() => {
        alert('Error generating PDF');
        this.navigateToRooms();
      });
  }

  getTotalPaid(): number {
    let total = 0;
    this.paymentsMethods.normal.forEach((p) => {
      total +=
        (p.cash || 0) +
        (p.visa || 0) +
        (p.vodafoneCash || 0) +
        (p.credit || 0) +
        // (p.debit || 0) +
        (p.instaPay || 0);
    });
    return total;
  }

  navigateToRooms() {
    const roomsIndex = this.router.url.indexOf('rooms');
    const commonParentPath = this.router.url.substring(0, roomsIndex);
    this.router.navigate([commonParentPath, 'rooms']);
  }
}