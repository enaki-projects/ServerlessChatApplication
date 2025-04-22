import {Component, OnInit} from '@angular/core';
import {AuthService} from "../core/services/auth.service";
import {APIService} from "../core/services/api.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private apiService: APIService,
  ) {}

  ngOnInit(): void {
    this.apiService.ListUsers().then((res) => {
      console.log("All Users:")
      console.log(res)
    })

    this.authService.getCurrentUserInfo().then((currentUserInfo) => {
      console.log(currentUserInfo)
      this.apiService.GetUser(currentUserInfo.username).then((res) => {
        console.log("Me:")
        console.log(res)
      })
    })

    this.apiService.ListMessages().then((res) => {
      console.log("All User:")
      console.log(res)
    })
  }

}
