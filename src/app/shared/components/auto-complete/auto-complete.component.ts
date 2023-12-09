import {Component, OnInit} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {NgFor, AsyncPipe, CommonModule} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

export interface PhoneNumbersAndUsers {
  number:string;
  name: string;
}

@Component({
  selector: 'app-auto-complete',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    NgFor,
    AsyncPipe,
  ],
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css']
})
export class AutoCompleteComponent implements OnInit {
  myControl = new FormControl<string | PhoneNumbersAndUsers>('');
  options: PhoneNumbersAndUsers[] = [
    {name: 'Mary' , number:'01012163386'},
    {name: 'Shelley', number:'01123039149'},
    {name: 'Igor', number:'012125659484'}];
  filteredOptions: Observable<PhoneNumbersAndUsers[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const numb = typeof value === 'string' ? value : value?.number;
        return numb ? this._filter(numb as string) : this.options.slice();
      }),
    );
  }

  displayFn( user: PhoneNumbersAndUsers ): string {
    return user && user.number ? user.number : '';
  }

  private _filter( name: string ): PhoneNumbersAndUsers[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }

}
