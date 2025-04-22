import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  listLang = [
    { text: 'tooltip.language.en', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'tooltip.language.fr', flag: 'assets/images/flags/french.jpg', lang: 'fr' },
    { text: 'tooltip.language.ro', flag: 'assets/images/flags/romania.png', lang: 'ro' },
    { text: 'tooltip.language.ru', flag: 'assets/images/flags/russia.jpg', lang: 'ru' },
  ];

  IDENTICAL_PASSWORDS = "notifications.validation.invalid.password";
  INVALID_DATA = "notifications.validation.invalid.data"

  INIT_RESET = "notifications.init.reset"
  INIT_REGISTRATION = "notifications.init.registration"

  SUCCESSFUL_REGISTRATION = "notifications.success.registration"
  SUCCESSFUL_RESET = "notifications.success.reset"
  SUCCESSFUL_CONFIRMATION = "notifications.success.confirmation"
  SUCCESSFUL_LOGIN = "notifications.success.login"

  SERVER_AUTHORIZATION = "notifications.server.authorization";
  SERVER_USER_NOT_FOUND = "notifications.server.user_not_found";
  SERVER_ACCOUNT_ALREADY_EXISTS = "notifications.server.account_already_exists";
  SERVER_CODE_MISMATCH = "notifications.server.code_mismatch";
  SERVER_USER_NOT_CONFIRMED = "notifications.server.user_not_confirmed";
  SERVER_INVALID_PARAMETER = "notifications.server.invalid_parameter";

  INFO_CODE_RESENT = "notifications.info.code_resent";

  constructor() { }
}
