import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {AuthenticationService} from '../../../services/authentication.service';
import * as R from 'ramda';
import {Constants} from "../../../constants/app.constant";
import {DropzoneComponent} from "ngx-dropzone-wrapper";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PayerSubmit} from "../../../models/payer.submit.model";
import {PayerService} from "../../../services/payer.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {ValidationPattern} from "../../../theme/shared/validation-error/validation.pattern";

@Component({
  selector: 'mrp-payer-add',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  providers: []
})
export class PayerAddComponent implements OnInit {
  public isCollapsed = true;
  public myForm: FormGroup;
  public countries: any;

  public config: any;
  public files: any = [];
  public filesFromServer: any;
  @ViewChild('dropzoneFile') dropzoneFile: DropzoneComponent;

  constructor(public authenticationService: AuthenticationService,
              private _fb: FormBuilder,
              public router: Router,
              public toastrService: ToastrService,
              public payerService: PayerService) {

    // this.loadFile();

    this.initForm();

    this.isCollapsed = true;
    this.config = {
      headers: {'Authorization': 'Bearer ' + this.authenticationService.token},
      addRemoveLinks: true,
      clickable: true
    };

  }

  ngOnInit(): void {
    this.getCountries();
  }

  initForm() {
    this.myForm = this._fb.group({
      name: ['', [Validators.required]],
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
      address: ['', [Validators.required, ValidationPattern.hasPunctuation(',', 'commaError'), ValidationPattern.customRegexpValidator, Validators.maxLength(35)]],
    });
  }

  getCountries() {
    this.payerService.getCountries().subscribe(resp => {
      this.countries = resp;
      console.log(resp);
    });
  }

  fetchFile(): any {
    this.filesFromServer = [
      {
        id: 1,
        name: 'file1',
        originalFilename: 'file1-ori',
        size: 12345,
        fullPath: '/v1/attachment/download?filename=2017_09_22_22_16_31_.pdf'
      },
      {
        id: 2,
        name: 'file2',
        originalFilename: 'file2-ori',
        size: 111111,
        fullPath: '/v1/attachment/download?filename=2017_09_22_22_16_31_.pdf'
      }
    ];

    this.emitFiles();
  }

  loadFile(): any {
    setTimeout(() => this.fetchFile(), 5000)
  }

  emitFiles() {
    this.filesFromServer.forEach(file => {
      // Call the default addedfile event handler
      this.dropzoneFile.directiveRef.dropzone.emit('addedfile', file);

      // And optionally show the thumbnail of the file:
      // dropzone.emit("thumbnail", this.files, "/image/url");
      // Or if the file on your server is not yet in the right
      // size, you can let Dropzone download and resize it
      // callback and crossOrigin are optional.
      this.dropzoneFile.directiveRef.dropzone.createThumbnailFromUrl(file);

      // Make sure that there is no progress bar, etc...
      this.dropzoneFile.directiveRef.dropzone.emit('complete', file);
      this.dropzoneFile.directiveRef.dropzone.emit('success', file, file, file);
    })
  }

  onUploadError(event) {
    console.log(event);
  }

  onUploadSuccess(file) {
    console.log(file);
    console.log('======= add file=======');

    // let a1 = document.createElement('a');
    // a1.setAttribute('href', Constants.API_ENDPOINT + file[1].fullPath);
    // a1.className = 'dz-remove';
    // a1.href = 'javascript:undefined;';
    // a1.setAttribute('data-dz-remove','');
    // a1.innerHTML = '<br><i class="fa fa-trash" aria-hidden="true"></i>remove';
    // file[0].previewTemplate.appendChild(a1);

    let a = document.createElement('a');
    a.setAttribute('href', Constants.API_ENDPOINT + file[1].fullPath);
    a.innerHTML = '<br><i class="fa fa-cloud-download" aria-hidden="true"></i>download';
    a.className = 'dz-download';
    file[0].previewTemplate.appendChild(a);

    if (file[1].fullPath.includes('.pdf')) {
      file[0].previewElement.querySelector('img').src = 'assets/img/vendor/pdf.png';
    }
    file[0].id = file[1].id;
    this.files.push(file[1]);
  }

  removedfile(file) {
    console.log(file);
    this.files = this.files.filter(item => item.id !== file.id);
    console.log(this.files);
  }

  onSubmit({value, valid}: { value: PayerSubmit, valid: boolean }) {
    // value.attachments = this.files.map(function (f) {
    //   return f.id;
    // });
    value.attachments = [];
    console.log(value);
    this.files.forEach(f => {
      value.attachments.push({id: f.id});
    });

    this.payerService.addPayer(value).subscribe(resp => {
      console.log(resp);
      this.router.navigate(['/pages/payees/list']);
    }, err => {
      console.log(err);
      this.toastrService.error(err.error);
    })
  }
}
