// loading en-us by default
var jsonTranslate = require('./en-us.json')
var jsonTranslateDef = require('./en-us.json')
var culture = 'en-us';

window.loadLangAuto = function(cb) {
  culture = getCultureAuto();
  console.log('Loading translation: '+culture)
  loadJsonTranslate(culture, function() {
    cb()
  });
}

function translate(code){
  //find traduction
  var value = code;
  var found = false;
  for(var key in jsonTranslate){
    if(key === code){
      value = jsonTranslate[key];
      found = true;
      break;
    }
  }

  if(!found){
    console.log('have not found traduction in ' + culture + ' :'+code);
    for(var key in jsonTranslateDef){
      if(key === code){
        value = jsonTranslateDef[key];
        found = true;
        break;
      }
    }
    if(!found){
      console.log('have not found traduction:'+code);
      return '[['+code+']]';
    }
  }
  
  //on remplace %1, %2, ..., %n par les arguments passés dans la fn
  var args = arguments
  for (var i = 1; i < args.length; i++) {
    var find = '%'+i
    var regex = new RegExp(find, "g");
    value = value.replace(regex, args[i])
  }

  return value;
}

function getCultureAuto(){
  //default culture
  var culture = 'en-us';

  var listCult;
  if(navigator.languages){
    listCult=navigator.languages;
  }
  else if(navigator.language){
    listCult[0] = navigator.language;
  }
  else if(navigator.userLanguage){
    listCult[0] = navigator.userLanguage;
  }

  for(var j = 0;j < listCult.length;j++){
    var cult = listCult[j].toLowerCase();
    //essaye de trouver du plus spécifique au moins spécifique
    if(cult === "fr-fr"){
      culture = "fr-fr";
      break;
    }
    else if(cult === "en-us"){
      culture = "en-us";
      break;
    }
    else if(cult.startsWith("fr")){
      culture = "fr-fr";
      break;
    }
    else if(cult.startsWith("en")){
      culture = "en-us";
      break;
    }
  }
  return culture;
}

function loadJsonTranslate(culture, cb){
  for(var key in Meteor.settings.public.translations) {
    if (key == culture) {
      steem.api.getContent(
      Meteor.settings.public.translations[key].author,
      Meteor.settings.public.translations[key].permlink,
      function(e,r) {
        jsonTranslate = JSON.parse(r.body)
        cb()
      })
    }
  }
}

//for js files
window.translate = translate;

//for html files
Template.registerHelper( 'translate', (code) => {
  return translate(code);
});