import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router, private route: ActivatedRoute) { }

  open(url) {
    return this.router.navigateByUrl(url);
  }

  /**returns null ?? */
  async getRouteParameterValue(parameterName: string) {
    const paramMap = await firstValueFrom(this.route.paramMap);
    const value = paramMap.get(parameterName);
    return value;
  }
}
