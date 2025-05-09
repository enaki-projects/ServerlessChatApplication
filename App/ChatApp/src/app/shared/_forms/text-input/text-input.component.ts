import {Component, Input, Self} from '@angular/core';
import {ControlValueAccessor, NgControl} from '@angular/forms';
import {faUser} from '@fortawesome/fontawesome-free';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})
export class TextInputComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() type = 'text';
  @Input() iconName = faUser;

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  startWithVowelRegEx(str: string): boolean {
    if (str !== undefined && str.length >= 1) {
      return /[aeiou]/.test(str[0].toLowerCase());
    }
    return false;
  }
}
