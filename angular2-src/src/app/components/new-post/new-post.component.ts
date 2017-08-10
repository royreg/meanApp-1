import { Component, OnInit,ElementRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import {AuthenticateService} from '../../services/authenticate.service'
import {PublishPostService} from '../../services/publish-post.service'
import {Server} from "../../services/socket.service";

@Component({
  moduleId: module.id,
  selector: 'my-NewPostComponent',
  templateUrl: 'new-post.component.html',
  providers: [Server],
})
export class NewPostComponent implements OnInit {
    public myForm: FormGroup;
    public pics=[];
    public ings=[];
  connection;

    constructor(private _fb: FormBuilder,
                private publisher:PublishPostService,
                private server: Server,
                private el: ElementRef) { }

  sendMessage(key) {
    console.log(key);
    this.server.sendMessage(key);

  }

    ngOnInit() {
      this.connection = this.server.getMessages('profile').subscribe(message => {

      });

        this.myForm = this._fb.group({
            recepie_title: [''],
            description:[''],
            ingridients: this._fb.array([
                this.initIng(),
            ]),
            Steps:this._fb.array([
                this.initStep(),
            ]),
            photos:this._fb.array([
                this.initimage(),
            ])
        });
    }

    initStep(){
        return this._fb.group({
            stepNumber:[''],
            description:['']
        })
    }
    initimage(){
        return this._fb.group({
            img:['']
        })
    }

    initIng() {
        return this._fb.group({
            name: ['', Validators.required],
            amount: [''],
            unit:['']
        });
    }

    addIng() {
        const control = <FormArray>this.myForm.controls['ingridients'];
        control.push(this.initIng());
    }

    removeIng(i: number) {
        const control = <FormArray>this.myForm.controls['ingridients'];
        control.removeAt(i);
    }




    addImg() {
        const control = <FormArray>this.myForm.controls['photos'];
        control.push(this.initimage());
        this.pics.push({img:""});
    }

    removeImg(i: number) {
        const control = <FormArray>this.myForm.controls['photos'];
        control.removeAt(i);
        this.pics.splice(i,1);

    }



    addStep() {
        const control = <FormArray>this.myForm.controls['Steps'];
        control.push(this.initStep());
    }

    removeStep(i: number) {
        const control = <FormArray>this.myForm.controls['Steps'];
        control.removeAt(i);
    }
    setId(i){
        return "photo"+i;
    }
    publish(myForm) {
        let formPost=myForm.value;


        let thisUser=JSON.parse(localStorage.getItem('user'));
        for(var i=0;i<formPost.Steps.length;i++){
            formPost.Steps[i].stepNumber=i+1;
        }
        for(var j=0;j<formPost.ingridients.length;j++){
            this.ings.push({name:formPost.ingridients[j].name,
            amount:formPost.ingridients[j].amount+' '+formPost.ingridients[j].unit})
        }
        console.log("thisUser",thisUser);
        let post={
            time:new Date(),
            first_name:thisUser.first_name,
            last_name:thisUser.last_name,
            user_id:thisUser._id,
            recipe_title:formPost.recepie_title,
            category:"desserts",
            main_img:"",
            user_img:thisUser.img_url,
            description:formPost.description,
            co_author: [],
            ingredients: this.ings,
            instructions: formPost.Steps,
            user_name : thisUser.user_name,

        };
        console.log(post);

         this.publisher.publish(post).subscribe(
      data=>{
        console.log(data,data.msg.post_id);
        this.addPhotos(data.msg.post_id);
      },
      err=>{
        console.log(err);
      });

    }

    onChange(e,i){
        if(e.target.files.length>0)
            console.log(i);
            this.pics[i]=e.target.files[0];

    }

    public addPhotos(postId:String){
        let formData = new FormData();
            for(var i=0;i<this.pics.length;i++){
                formData.append('photos',this.pics[i]);
            }
            this.publisher.addPhotos(formData,postId).subscribe( data=>{
            console.log(data);
              this.sendMessage('post');
            },err=>{alert(err)});
    }






}
