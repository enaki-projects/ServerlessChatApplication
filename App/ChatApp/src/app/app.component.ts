import {Component} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ChatApp';

  constructor(public translate: TranslateService,
              private spinner: NgxSpinnerService) {
    translate.addLangs(['en', 'ro', 'ru']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|ro|ru/) ? browserLang : 'en');
  }

  prepareRoute(outlet: RouterOutlet): any {
    return outlet && outlet.activatedRouteData;
  }
}
