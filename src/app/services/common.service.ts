import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  fixObject(obj:any,fields:any){
    //delete all fields that are not defined in fields
    var objx = JSON.parse(JSON.stringify(obj));
    var okeys = Object.keys(obj);
    //var fnames = fields.map(x => {return x.name});
    okeys.forEach((f) => {
      if (fields.indexOf(f) == -1) delete objx[f];
    });

    return objx;
  }

  objectChanged(obj:any,original:any,fields:any){

    var hasChanged = false;
    for (var i=0; i< fields.length; i++){
      if (obj[fields[i]] != original[fields[i]]) {
        //console.log('changed', fields[i], obj[fields[i]], original[fields[i]]);
        hasChanged = true;
        break;
      }
    }
    return hasChanged;
  }

 
  generateToken(){
    var chars = 'abcdefghijklmnopqrstuwxyz01234567';
    var token = '';
    for (var i=0; i < 16; i++){
      token += chars.charAt(Math.round(Math.random()*chars.length));
    }
    return token;
  }

  generateImageName(){
    var chars = '0123456789';
    var token = '';
    for (var i=0; i < 8; i++){
      token += chars.charAt(Math.round(Math.random()*chars.length));
    }
    return token;
  }

  getDate(timestamp:any){
    
  var date = new Date(timestamp);

  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();

  //return (year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds);
  //return (getMonthShort(month) + ' ' + day + ', ' + year + ' ' + hours + ':' + (minutes < 10 ? ('0' + minutes): minutes));
  return (this.getMonthShort(month) + ' ' + day + ', ' + year);// + ', ' + year + ' ' + hours + ':' + (minutes < 10 ? ('0' + minutes): minutes));
}

getCurrentDate(){
  var date_object = new Date();
    
  var date = {
      month: date_object.getMonth(),
      year: date_object.getFullYear()
  }

  return date;
}

getDateTime(timestmp:any){
  var date = new Date(timestmp);

  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();

  //return (year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds);
  //return (getMonthShort(month) + ' ' + day + ', ' + year + ' ' + hours + ':' + (minutes < 10 ? ('0' + minutes): minutes));
  return (this.getMonthShort(month) + ' ' + day + ', ' + hours + ':' + (minutes < 10 ? ('0' + minutes): minutes));
}

getMonthShort(num:number){
  //console.log('num',num);
  if (num == 1) return 'Jan';
  else if (num == 2) return 'Feb';
  else if (num == 3) return 'Mar';
  else if (num == 4) return 'Apr';
  else if (num == 5) return 'May';
  else if (num == 6) return 'Jun';
  else if (num == 7) return 'Jul';
  else if (num == 8) return 'Aug';
  else if (num == 9) return 'Sep';
  else if (num == 10) return 'Oct';
  else if (num == 11) return 'Nov';
  else if (num == 12) return 'Dec';
  else return 'Jan';
}

computeReviews(reviews:any){
  var obj:any = {};
  obj['number_of_reviews'] = reviews.length;
  obj['was_friendly'] = reviews.filter((x:any) => {return x.was_friendly == true}).length;
  obj['good_communication'] = reviews.filter((x:any) => {return x.good_communication == true}).length;
  obj['was_on_time'] = reviews.filter((x:any) => {return x.was_on_time == true}).length;
  obj['prompt_payment'] = reviews.filter((x:any) => {return x.prompt_payment == true}).length;
  obj['item_as_described'] = reviews.filter((x:any) => {return x.item_as_described == true}).length;

  var sum_stars = 0;
  reviews.forEach((x:any) => {
    sum_stars += x.overall_experience;
  });
  obj['rating'] = (sum_stars/reviews.length).toFixed(1);

  return obj;
}

getWhen(timestmp:any){
  //This function calculates difference between current time and elapsedTime and returns humanized string
  var cT = Date.now();
  var dT = cT - timestmp;

  var dTmin = Math.floor(dT/60000); //delta time minutes
  
  //if within a minute, show 'just now'
  if (dTmin < 1) return 'just now';
  else if (dTmin < 60) return dTmin + ' mins ago';
  else {
    var dThr = Math.floor(dT/3600000); //delta time hrs
    if (dThr == 1) return '1 hr ago';
    else if (dThr < 24) return dThr + ' hrs ago';
    else {
      var dTday = Math.floor(dT/86400000); //delta time days
      if (dTday == 1) return '1 day ago';
      else if (dTday < 30) return dTday + ' days ago';
      else {
        var dTmonth = Math.floor(dT/2592000000); //delta time months
        if (dTmonth == 1) return '1 month ago';
        else if (dTmonth < 12) return dTmonth + ' months ago';
        else{
          var dTyear = Math.floor(dT/31104000000); //delta time years
          if (dTyear == 1) return '1 year ago';
          else return dTyear + ' years ago';
        }
      }
    
    }
  }
}

shuffle(array: any[]) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

}
