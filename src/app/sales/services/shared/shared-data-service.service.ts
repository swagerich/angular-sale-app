import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataServiceService {

  public photoNameSource$ = new BehaviorSubject<string>('');

  public setPhotoName(photoName: string): void {
    this.photoNameSource$.next(photoName);
  }

  public getPhotoName(): Observable<string> {
    return this.photoNameSource$.asObservable();
  }

  constructor() { }
}
