import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  TemplateRef,
  ElementRef,
  Pipe,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import * as moment from "moment";
import { CommonService } from "src/app/service/common.service";

import {
  AUTH_USERNAME,
  AUTH_PASSWORD,
  REQUEST_HEADER,
  API,
} from "src/environments/api";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Renderer2 } from "@angular/core";

@Component({
  selector: "app-view-competition",
  templateUrl: "./view-competition.component.html",
  styleUrls: ["./view-competition.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class ViewCompetitionComponent implements OnInit {
  @Pipe({ name: "safe_html" })
  @ViewChild("alertModal")
  private alertModalRef: any;
  // @ViewChild("noInternetModal") private noInternetModalRef: TemplateRef<any>;
  // @ViewChild("modalBody") private modalBodyRef: ElementRef<HTMLElement>;
  @ViewChild("errorModal") private errorModalRef: any;
  @ViewChild("warningModal") private warningModalRef: any;
  @ViewChild("existModal") private existModalRef: any;
  @ViewChildren("Button") buttons: QueryList<ElementRef>;
  @ViewChild("div") output: ElementRef;

  competionDetail: any = {};
  Que_Ans: any = [];
  quantity: any = [];
  diffr: number = 0;
  days: any = [];
  hours: any = [];
  minutes: any = [];
  seconds: any = [];
  form: FormGroup;
  payLoad: any = {};
  freeAmount: any = "0";
  perPage: number = 0;
  newPerPage: number = 0;
  buttonID: string = "button_";

  html: SafeHtml;

  status: any = "";
  errorMsg: any = "";

  loading: boolean = false;
  innerLoading: boolean = false;
  selectedIndex: number = 0;

  proId: number = 0; //1337;
  start: number = 0;
  end: number = 0;
  maxEntry: number = 0; //645;
  existBRaffleNumber: any = {};
  existRaffleNumber: any = {};
  existTRaffleNumber: any = {};
  existORaffleNumber: any = {};

  val: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private actRoute: ActivatedRoute,
    public common: CommonService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    public sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.getCompetitionDetail();
    this.form = this.fb.group({
      question_answer: this.fb.array([
        this.fb.group({
          answer: [null],
        }),
      ]),
      quantity: new FormControl(0),
    });
    //this.numberPicker(this.actRoute.snapshot.params.pro_id, 0, 0, 100);
    //this.getCompetitionDetail()
  }

  counter(i: number): any {
    return new Array(i);
  }

  counter1(i: number): any {
    return new Array(i);
  }

  test() {
    alert();
  }

  button() {
    if (this.val && this.loading === false) {
      this.renderer.setProperty(this.output.nativeElement, "innerHTML", "");

      let button = [];
      let buttonText = [];
      for (let index = this.start; index <= this.end; index++) {
        if (index in this.existRaffleNumber === true) {
          button[index] = this.renderer.createElement("li");
          buttonText[index] = this.renderer.createText(index.toString());

          this.renderer.appendChild(this.output.nativeElement, button[index]);
          this.renderer.appendChild(button[index], buttonText[index]);
          this.renderer.addClass(button[index], "lty-ticket");
          this.renderer.addClass(button[index], "lty-booked-ticket");
        } else if (
          index in this.existBRaffleNumber === true &&
          this.existTRaffleNumber === true
        ) {
          button[index] = this.renderer.createElement("li");
          buttonText[index] = this.renderer.createText(index.toString());

          this.renderer.appendChild(this.output.nativeElement, button[index]);
          this.renderer.appendChild(button[index], buttonText[index]);
          this.renderer.addClass(button[index], "lty-ticket");
          this.renderer.addClass(button[index], "lty-processing-ticket");
        } else if (index in this.existBRaffleNumber === true) {
          button[index] = this.renderer.createElement("li");
          buttonText[index] = this.renderer.createText(index.toString());

          this.renderer.appendChild(this.output.nativeElement, button[index]);
          this.renderer.appendChild(button[index], buttonText[index]);
          this.renderer.addClass(button[index], "lty-ticket");
          this.renderer.addClass(button[index], "lty-reserved-ticket");
          this.renderer.listen(button[index], "click", () => {
            alert(this.proId + "-" + index);
          });
        } else {
          button[index] = this.renderer.createElement("li");
          buttonText[index] = this.renderer.createText(index.toString());

          this.renderer.appendChild(this.output.nativeElement, button[index]);
          this.renderer.appendChild(button[index], buttonText[index]);
          this.renderer.addClass(button[index], "lty-ticket");
          this.renderer.addClass(button[index], "lty-available-ticket");
          this.renderer.listen(button[index], "click", () => {
            alert(this.proId + "-" + index);
          });
        }
      }
      button = [];
      buttonText = [];
      this.val = false;
    }
  }

  // this.renderer.listen(button[i], "click", () => {
  //   alert("hi");
  // });

  checkCondition(i: any, type: string) {
    if (i in this.existRaffleNumber === true) {
    } else if (
      i in this.existBRaffleNumber === true &&
      this.existTRaffleNumber === true
    ) {
    } else if (i in this.existBRaffleNumber === true) {
    } else {
    }
  }

  safeHtml(content: any): any {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  generateID(val1: any): any {
    let val: number;

    val = val1;

    //console.log("wwww", val, this.buttonID + val);

    return this.buttonID + val;
  }

  numberPicker(pro_id: any, selectedIndex: number, start: any, end: any): any {
    try {
      this.val = true;
      let headers = new HttpHeaders(REQUEST_HEADER);
      let options = {
        headers: headers,
      };
      const post: any = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "NumberPicker",
        unique_id: this.common.getUniqueId(),
        pro_id,
        start: selectedIndex === 0 ? start + 1 : selectedIndex * start + 1,
        end,
      };

      let formBody: any = this.common.convertUrlEncoded(post);

      this.selectedIndex = selectedIndex;

      this.innerLoading = true;

      this.http.post<any>(API, formBody, options).subscribe((res) => {
        const {
          pro_id,
          start,
          end,
          max_entry,
          exist_braffle_number,
          exist_raffle_number,
          exist_raffle_number_temp,
          exist_oraffle_number,
        } = res;

        this.proId = pro_id;
        this.start = start;
        this.end = end;
        this.maxEntry = max_entry;
        this.existBRaffleNumber = exist_braffle_number;
        this.existRaffleNumber = exist_raffle_number;
        this.existTRaffleNumber = exist_raffle_number_temp;
        this.existORaffleNumber = exist_oraffle_number;

        // (this.start =
        //   selectedIndex === 0 ? start + 1 : selectedIndex * start + 1),
        //   (this.existBRaffleNumber = []);

        // this.existRaffleNumber = {
        //   "2": 2,
        //   "3": 3,
        //   "4": 4,
        //   "5": 5,
        //   "6": 6,
        //   "7": 7,
        //   "8": 8,
        // };

        // this.existTRaffleNumber = {
        //   "210": 210,
        // };

        // this.existORaffleNumber = {
        //   "210": 210,
        // };

        this.loading = false;

        setTimeout(() => {
          this.button();
          this.innerLoading = false;
        }, 1000);
      });
    } catch (error) {
      this.errorMsg = error;
      setTimeout(() => {
        this.modalService.open(this.errorModalRef, {
          windowClass: "dark-modal",
        });
      }, 1000);
    }
  }

  chooseNumber(one: any, two: any): any {
    alert(one + "-" + two);
  }

  getCompetitionDetail(): void {
    try {
      this.loading = true;
      let headers = new HttpHeaders(REQUEST_HEADER);
      let options = {
        headers: headers,
      };

      const post: any = {
        auth_username: AUTH_USERNAME,
        auth_password: AUTH_PASSWORD,
        action: "CompetitionsDetails",
        comp_id: this.actRoute.snapshot.params.pro_id,
      };

      let formBody: any = this.common.convertUrlEncoded(post);

      this.http.post<any>(API, formBody, options).subscribe((res) => {
        const { result, questionandanswer } = res;
        this.competionDetail = result;
        this.Que_Ans = questionandanswer;

        for (let index = 0; index <= result.total_qty_ticket; index++) {
          this.quantity[index] = index;
        }

        this.x(this.competionDetail.end_date);

        this.perPage = result.max_entry / result.no_tickets;
        //this.perPage = this.maxEntry / 100;
        this.newPerPage = Math.ceil(this.perPage);

        this.loading = false;
      });
    } catch (error) {
      this.errorMsg = error;
      this.loading = false;
      setTimeout(() => {
        this.modalService.open(this.errorModalRef, {
          windowClass: "dark-modal",
        });
      }, 1000);
    }
  }

  openAddToCart(modalId: string) {
    if (this.diffr > 0) {
      this.modalService.open(modalId, { windowClass: "dark-modal" });
      this.form = this.fb.group({
        question_answer: this.fb.array([
          this.fb.group({
            answer: [null],
          }),
        ]),
        quantity: new FormControl(0),
      });
    } else {
      this.modalService.open(this.alertModalRef, { windowClass: "dark-modal" });
    }
    this.freeAmount = "0";
  }

  onChangeSelect(): void {
    if (this.common.getMemberId() === 0) {
      this.modalService.open(this.warningModalRef, {
        windowClass: "dark-modal",
      });
      setTimeout(() => {
        this.modalService.dismissAll();
        this.router.navigate(["/login"]);
      }, 3000);
      this.freeAmount = "0";
    } else {
      this.freeAmount = "1";
    }
  }

  onSubmit(pro_id: any, price: any) {
    try {
      this.payLoad = this.form.getRawValue();

      if (
        this.payLoad.question_answer[0].answer === null ||
        this.payLoad.question_answer[0].answer === "" ||
        this.payLoad.question_answer[0].answer === undefined
      ) {
        alert("Answer all question");
      } else if (
        this.payLoad.quantity === 0 ||
        this.payLoad.quantity === "" ||
        this.payLoad.quantity === undefined
      ) {
        alert("Select quantity");
      } else {
        this.loading = true;
        let question_answer = {};
        let split: any = "";
        for (
          let index = 0;
          index < this.payLoad.question_answer.length;
          index++
        ) {
          split = this.payLoad.question_answer[index].answer.split("_");
          question_answer[index] = { [split[1]]: split[0] };
        }

        let headers = new HttpHeaders(REQUEST_HEADER);
        let options = { headers: headers };

        const post = {
          auth_username: AUTH_USERNAME,
          auth_password: AUTH_PASSWORD,
          action: "AddToCart",
          member_id: this.common.getMemberId(),
          unique_id: this.common.getUniqueId(),
          product_id: pro_id,
          product_price: this.freeAmount === "1" ? "0.00" : price,
          qty: this.payLoad.quantity,
          question_answer: JSON.stringify(question_answer),
        };

        let formBody: any = this.common.convertUrlEncoded(post);

        this.http.post<any>(API, formBody, options).subscribe((res) => {
          const { status }: any = res;

          if (status === "exist" || status === "alreadyentered") {
            this.modalService.open(this.existModalRef, {
              windowClass: "dark-modal",
            });

            setTimeout(() => {
              this.modalService.dismissAll();
            }, 3000);
          } else {
            this.modalService.dismissAll();
          }

          this.common.cartRefresh();
          this.freeAmount = "0";
          this.loading = false;
        });
      }
    } catch (error) {
      this.errorMsg = error;
      this.loading = false;
      setTimeout(() => {
        this.modalService.open(this.errorModalRef, {
          windowClass: "dark-modal",
        });
      }, 1000);
    }
  }

  x(date: any): void {
    setInterval(() => {
      const now = moment();
      const expirydate = moment(date);
      const diffr: any = moment.duration(expirydate.diff(now));
      this.diffr = diffr;
      if (diffr > 0) {
        const days: any = parseInt(diffr.asDays());
        const hours: any = parseInt(diffr.asHours()) - days * 24;
        const minutes: any = parseInt(diffr.minutes());
        const seconds: any = parseInt(diffr.seconds());

        this.days = days < 10 ? "0" + days : days;
        this.hours = hours < 10 ? "0" + hours : hours;
        this.minutes = minutes < 10 ? "0" + minutes : minutes;
        this.seconds = seconds < 10 ? "0" + seconds : seconds;
      } else {
        this.days = "00";
        this.hours = "00";
        this.minutes = "00";
        this.seconds = "00";
      }
    });
  }
}
