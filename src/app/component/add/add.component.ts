import { Component, OnInit } from '@angular/core';
import { EmailValidator, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Person } from 'src/app/model/person';
import { DataService } from 'src/app/service/data.service';
import { HttpService } from 'src/app/service/http.service';
import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  public person: Person = new Person;
  public personFormGroup: FormGroup;
  public addButton: string = "Add";
  public duplicateEmail: Boolean = false;
  public errorMessage: String = "Email Id Already Exist";
  public states: Array<any> = [];
  public cities: Array<any> = [];
  stateDetails: Array<any> = [];

  // public editOperationOn: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    public router: Router,
    public httpClient: HttpClient,
    private dataService: DataService,
    private activatedRouter: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {

    /**
    * Added validations to the data.
    */
    this.personFormGroup = this.formBuilder.group({
      fullName: new FormControl('', [Validators.required, Validators.pattern("^[A-Z]{1}[a-zA-Z\\s]{2,}$")]),
      address: new FormControl('', Validators.required),
      city: new FormControl(''),
      state: new FormControl(''),
      emailId: new FormControl('', [Validators.required, Validators.email]),
      zip: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{6}$")]),
      phoneNumber: new FormControl('', Validators.required)
    })
  }

  /**
  * This method set person object value of a particular person id in the personFormBuilder.
  * It is called when we perform update().
  */
  ngOnInit(): void {
    this.getState();
    if (this.activatedRouter.snapshot.params['id'] != undefined) {
      this.dataService.currentPerson.subscribe((person: { fullName?: any; address?: any; city?: any; state?: any; emailId?: any; zip?: any; phoneNumber?: any; }) => {
        if (Object.keys(person).length !== 0) {
          this.personFormGroup.get('fullName')?.setValue(person.fullName);
          this.personFormGroup.patchValue({ 'address': person.address });
          this.personFormGroup.patchValue({ 'state': person.state });
          if (person.state) {
            this.cityList(person.state);
            this.personFormGroup.patchValue({ 'city': person.city });
          }
          this.personFormGroup.patchValue({ 'emailId': person.emailId });
          this.personFormGroup.patchValue({ 'zip': person.zip });
          this.personFormGroup.patchValue({ 'phoneNumber': person.phoneNumber });
          this.onChangeState(person.state);
        }


      });

    }
  }
  getState(): void {
    this.httpService.getStateDetails().subscribe(data => {
      this.stateDetails = data.data;
      for (let i = 0; i < this.stateDetails.length; i++) {
        this.states.push(this.stateDetails[i]?.stateName);
      }
    });
  }
  onChangeState(state: String) {
    this.httpService.getCity(state).subscribe(
      data => {
        this.cities = data.data;
        for (let i = 0; i < this.cities.length; i++) {
          if (this.cities[i]?.stateName === state) {
            this.cities = this.cities[i]?.city;
          }
        }
        console.log(this.cities);
      });
  }

  getCity(state: any) {
    this.personFormGroup.get('city')?.setValue("");
    this.cityList(state);
  }

  cityList(state: any) {
    for (let i = 0; i < this.stateDetails.length; i++) {
      if (this.stateDetails[i]?.stateName === state) {
        this.cities = this.stateDetails[i]?.city;
      }
    }
  }

  /**
     * onSubmit method is common for Add a person or update a person.
     * snackbar is added to display user successfully added or user already exist or user update successfull
     * If person is already present it will update the recork or else add a new person to the addressbook.
     */

  onSubmit(): void {

    if (this.activatedRouter.snapshot.params['id'] != undefined) {
      this.httpService.updatePersonData(this.activatedRouter.snapshot.params['id'],
        this.personFormGroup.value).subscribe((Response: any) => {
          this.router.navigateByUrl("/home");
          this.snackBar.open(Response.message, "", { duration: 3000, verticalPosition: 'top' });

        });
    } else {
      this.person = this.personFormGroup.value
      this.httpService.addPersonData(this.person).subscribe((response: any) => {
        console.log(response.message);
        this.router.navigateByUrl("/home");
        this.snackBar.open(response.message, "", { duration: 3000, verticalPosition: 'top' });
      }, error => {
        this.snackBar.open('User alrady exist!', "", { duration: 3000, verticalPosition: 'top' })
      });
    }
  }
  public checkError = (controlName: string, errorName: string) => {
    return this.personFormGroup.controls[controlName].hasError(errorName);
  } 
}