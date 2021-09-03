import { Component, OnInit } from '@angular/core';
import { Person } from 'src/app/model/person';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public personDetails: Person[] = [];
  
  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    this.httpService.getPersonData().subscribe(Response => {
      this.personDetails = Response.data;
    });
  }

  /*
  * @method: remove method is use to delete the existing person for addressbook.
  * @param: id.
  * using the id of the person we delete the person from the addressbook.
  */
  remove(id: number) {
    this.httpService.deletePersonData(id).subscribe(data => {
      console.log(data);
      this.ngOnInit();
    });
  }
}