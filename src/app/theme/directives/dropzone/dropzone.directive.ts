import {Directive, ElementRef, EventEmitter, Input} from '@angular/core';
import {Constants} from '../../../constants/app.constant';
import {AuthenticationService} from '../../../services/authentication.service';

@Directive({
  selector: '[dropzone]',
  outputs: ['dropZoneOutput']
})

export class DropzoneUpload {
  $el: any;
  @Input() dropzone;

 dropZoneOutput = new EventEmitter();

  public files: any;
  public outputFiles: any;

  constructor(el: ElementRef,
              public authenticationService: AuthenticationService) {
    this.$el = jQuery(el.nativeElement);
    this.outputFiles = [];
  }

  ngOnInit(): void {
    this.files = [];
    let outputFiles = [];
    const myEventEmitter = this.dropZoneOutput;

    if (this.dropzone) {
      console.log(this.dropzone);

      this.dropzone.forEach(f => {
        this.files.push(f);
        // this.outputFiles.push(f);
      })

      this.outputFiles = this.dropzone.map(x => Object.assign({}, x));

    }


    const myDropzone = new Dropzone(this.$el[0], {
      addRemoveLinks: true
    });

    Dropzone.autoDiscover = false;
    // Dropzone.options.myAwesomeDropzone = false;

    // The recommended way from within the init configuration:
    Dropzone.options.myAwesomeDropzone = {
      url: Constants.API_ENDPOINT + 'v1/file',
      headers: {'Authorization': 'Bearer' + this.authenticationService.token},
      init: function () {
        this.on('addedfile', function (file) {
          alert('Added file.');
        });

        this.on('sending', function (file) {
          alert('sending file.');
        });

      },
      paramName: 'file', // The name that will be used to transfer the file
      maxFilesize: 2, // MB
      accept: function (file, done) {
        if (file.name == 'justinbieber.jpg') {
          done('Naha, you don\'t.');
        }
        else {
          done();
        }
      },
      error: function (file, errorMessage) {
        console.log(errorMessage)
      },
      queuecomplete: function (resp) {
        console.log(resp);
      },
      success: function (file, resp) {
        console.log(resp);
      }
    };

    myDropzone.on('sending', function (file, xhr, formData) {
      // Will send the filesize along with the file as POST data.
      console.log('sending');
    });

    myDropzone.on('addedfile', function (file) {
      /* Maybe display some more file information on your page */
      console.log(file);
    });

    myDropzone.on('complete', function (file) {
      console.log(file);
    });

    myDropzone.on('success', function (file, resp1, resp2) {
      console.log(file);
      console.log(resp1);
      console.log(resp2);
      console.log(this.files);
      this.files.push(resp1);
      outputFiles.push(resp1);
      console.log(this.files);
      console.log(outputFiles);
      myEventEmitter.emit(outputFiles);
      // this.outputFiles.push(resp1);
      // console.log(this.outputFiles);
    });

    myDropzone.on('removedfile', function (file, resp1, resp2) {
      console.log(file);
      console.log(this.files);
      console.log(outputFiles);
      outputFiles = outputFiles.filter(item => item.originalFilename !== file.name);
      console.log(outputFiles);
      myEventEmitter.emit(outputFiles);

    });

    // https://github.com/enyo/dropzone/wiki/FAQ#how-to-show-files-already-stored-on-server
    // https://stackoverflow.com/questions/17582713/programatically-add-existing-file-to-dropzone
    // Create the mock file:
    // var file = this.dropzone;

    this.files.forEach(file => {
      // Call the default addedfile event handler
      myDropzone.emit('addedfile', file);

      // And optionally show the thumbnail of the file:
      // dropzone.emit("thumbnail", this.files, "/image/url");
      // Or if the file on your server is not yet in the right
      // size, you can let Dropzone download and resize it
      // callback and crossOrigin are optional.
      myDropzone.createThumbnailFromUrl(file);

      // Make sure that there is no progress bar, etc...
      myDropzone.emit('complete', file);
      myDropzone.emit('success', file, file, file);

    })

    console.log(this.outputFiles);
  }
}
