import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  checkEmailNotTaken(value: any, id: string) {
      throw new Error('Method not implemented.');
  }
  title = 'address-book';
}
