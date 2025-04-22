import { Component, OnInit } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../../core/services/language.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  year: number = new Date().getFullYear();

  lang = null;

  setLanguage(lang) {
    this.translate.use(lang);
    this.setCurrentLang(lang);
  }
  constructor(
    public translate: TranslateService,
    public languageService: LanguageService,
  ) {
    this.setCurrentLang(this.translate.currentLang);
  }

  setCurrentLang(lang) {
    let filtered = this.languageService.listLang.filter(item => item.lang === lang)
    if (filtered.length > 0) {
      this.lang = filtered[0];
    }  else {
      this.lang = this.languageService.listLang[0];
    }
  }

  ngOnInit(): void {
  }

}
