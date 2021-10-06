import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private baseURL: string = "http://localhost:8080/address-book/";
  
  constructor(private httpClient: HttpClient) { }

  getPersonData(): Observable<any> {
    return this.httpClient.get(this.baseURL + "get");
  }

  /*
  * @method: delete method for deleting a record from adressbook.
  * @param: id.
  *return: Updated adressbook list after delete. 
  */
  deletePersonData(id: number): Observable<any> {
    return this.httpClient.delete(this.baseURL + "delete/" + id)
  }

  /*
    * @method: Create method for creating a new record in addressbook.
    * @param: body.
    *return: person list after adding the record. 
  */
  addPersonData(body: any): Observable<any> {
    return this.httpClient.post(this.baseURL + "create", body);
  }

  /*
  * @method: update method for update existing record to Addressbook.
  * @param: id.
  * @param: body.
  *return: Updated existing Person. 
*/
  updatePersonData(id: number, body: any): Observable<any> {
    return this.httpClient.put(this.baseURL + "update/" + id, body);
  }

  getCity(state: any): Observable<any> {
    return this.httpClient.get(this.baseURL + "getStateDetails");
  }

  getStateDetails(): Observable<any> {
    return this.httpClient.get(this.baseURL + "getStateDetails");
  }

  getDataByID(id: number): Observable<any> {
    return this.httpClient.get(this.baseURL + "get/",{
      headers: new HttpHeaders(),
      params: new HttpParams().append('id', id)});
  }
}
