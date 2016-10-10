
/*
 ___________________________
|                           |
|       08-26-2015          |
|  Author: John Stamatakos  |  
|   New GA Tracking Code    |
|___________________________|
*/


function setGAdata() {
  var title;
  var GAdebug = false;
  //Check URL for 'gadebug'
  var url = window.location.href;
  if(window.location.href.indexOf('gadebug') != -1){
    GAdebug = true;
  }
  //Make div for GAdebug text
  if(GAdebug == true){
    $( '<div class="gaDebugWindow" style="position: fixed; top: 0; left: 0; padding: .5em; color: #000; background: #BBB; font-size: 14px; z-index:1000;"></div>' ).appendTo( 'body' );
  }
  /*** Anchor Tags ***/
  $('a').each(function() {
    /*If GA tracking attribute not present, create 
    it based on textContent, img alt tag, title, name, id, or href */ 
    if(!$(this).attr("data-aData")){
      var text = $(this).context.textContent.toLowerCase();
      text = text.trim().replace(/[^a-zA-Z0-9_\s]/g,'').replace(/\s\s+/g, ' ');
      if ($(this).html().indexOf('<img')!=-1){
        title = 'link_'+$(this).find('img').attr('alt')+ ' img';
      }
      else if(text != undefined && text.length > 1 && text.length < 50 && text != 'buy now' && text != 'request a consultation' && text != 'apply now' && text != 'sign up' && text != 'more info' && text != 'read more' && text != 'learn more'){
        title = 'link_'+text;
      }
      else if($(this).attr("title")){
        title = 'link_'+$(this).attr("title");
      }
      else if($(this).attr("name")){
        title = 'link_'+$(this).attr("name");
      }
      else if($(this).attr("id")){
        title = 'link_'+$(this).attr("id");
      }
      else if($(this).attr("href")){
        title = 'link_'+$(this).attr("href");
      }
      else{
        title = "link_NoTrackingData";
      }
      //Prepend navigation or footer to title of elements in those areas
      if($(this).closest(".menu-mlid-828").length>0){
        title = "gallery_"+title;
      }
      else if ($(this).closest(".menu-mlid-1253").length>0){
        title = "services_"+title;
      }
      else if ($(this).closest(".menu-mlid-852").length>0){
        title = "resources_"+title;
      }
      else if ($(this).closest(".menu-mlid-791").length>0){
        title = "company_"+title;
      }
      else {}
      if ($(this).closest("header").length>0){
        title = "navigation_"+title;
      }
      if ($(this).closest("#footer").length>0){
        title = "footer_"+title;
      }
      //Regex GA string
      title = title.replace(/\s/g , "-");
      //Set aData attribute
      $(this).attr('data-aData',title);
    }
    if(GAdebug == true){
      $(this).hover(
        function(){
          $('.gaDebugWindow').text($(this).attr('data-aData'));
        }, function(){
          $('.gaDebugWindow').text("");
        }
      );
    }
  });
  /*** Buttons ***/
  $('button').each(function() {
    /*If GA tracking attribute not present, create 
    it based on textContent, img alt tag, title, name, or id */ 
    if(!$(this).attr("data-aData")){
      var text = $(this).context.textContent;
      text = text.trim().replace(/[^a-zA-Z0-9_\s]/g,'').replace(/\s\s+/g, ' ');
      if(text != undefined && text.length > 1 && text.length < 50){
        title = 'button_'+text;
      }
      else if ($(this).html().indexOf('<img')!=-1){
        title = 'button_'+$(this).find('img').attr('alt')+ ' img';
      }
      else if($(this).attr("title")){
        title = 'button_'+$(this).attr("title");
      }
      else if($(this).attr("name")){
        title = 'button_'+$(this).attr("name");
      }
      else if($(this).attr("id")){
        title = 'button_'+$(this).attr("id");
      }
      else{
        title = "button_NoTrackingData";
      }
      //Regex GA string
      title = title.replace(/\s/g , "-");
      //Set aData attribute
      $(this).attr('data-aData',title);
    }
    if(GAdebug == true){
      $(this).hover(
        function(){
          $('.gaDebugWindow').text($(this).attr('data-aData'));
        }, function(){
          $('.gaDebugWindow').text("");
        }
      );
    }
  });
  /*** Selects ***/
  $('select').each(function() {
    /*If GA tracking attribute not present, create 
    it based on name, id, or option:selected value */
    if(!$(this).attr("data-aData")){
      if($(this).attr("name")){
        title = 'selectInput_'+$(this).attr("name");
      }
      else if($(this).attr("id")){
        title = 'selectInput_'+$(this).attr("id");
      }
      else if($("option:selected", this)){
        title = 'selectInput_'+$("option:selected", this)[0].value;
      }
      else{
        title = "selectInput_NoTrackingData";
      }
      //Regex GA string
      title = title.replace(/\s/g , "-");
      //Set aData attribute
      $(this).attr('data-aData',title);
    }
    if(GAdebug == true){
      $(this).hover(
        function(){
          $('.gaDebugWindow').text($(this).attr('data-aData'));
        }, function(){
          $('.gaDebugWindow').text("");
        }
      );
    }
  });
  /*** Inputs ***/
  $('input').each(function() {
    /* If GA tracking attribute not present, create 
    it based on name, title, id, or placeholder */
    if(!$(this).attr("data-aData")){
      var type = $(this).attr("type");
      if(type == undefined || type == ""){
        type = "unknownType";
      }
      if($(this).attr("name")){
        title = type+'Input_'+$(this).attr("name");
      }
      else if($(this).attr("title")){
        title = type+'Input_'+$(this).attr("title");
      }
      else if($(this).attr("id")){
        title = type+'Input_'+$(this).attr("id");
      }
      else if($(this).attr("placeholder")){
        title = type+'Input_'+$(this).attr("placeholder");
      }
      else{
        title = type+"Input_NoTrackingData";
      }
      //Regex GA string
      title = title.replace(/\s/g , "-");
      //Set aData attribute
      $(this).attr('data-aData',title);
    }
    if(GAdebug == true){
      $(this).hover(
        function(){
          $('.gaDebugWindow').text($(this).attr('data-aData'));
        }, function(){
          $('.gaDebugWindow').text("");
        }
      );
    }
  });  
   /*** FAQs ***/
  $('.field-faq-column h3').each(function() {
    /* add GA data tag to FAQ elements */
    var text = $(this).first().contents().text().substr(0,50);
    title = "faq_"+text;
    //Regex GA string
    title = title.replace(/\s/g , "-").replace(/\+/g, "");
    //Set aData attribute
    $(this).find('a').attr('data-aData',title);
    if(GAdebug == true){
      $(this).hover(
        function(){
          $('.gaDebugWindow').text($(this).attr('data-aData'));
        }, function(){
          $('.gaDebugWindow').text("");
        }
      );
    }
  });
  /*** Unordered Lists ***/
  $('li').each(function() {
    //Only mark li elements with fancy select dropdown styles
    if($(this).attr('data-raw-value')){
      /* If GA tracking attribute not present, create 
      it based on name, title, id, or placeholder */
      if(!$(this).attr("data-aData")){
        var text = $(this).context.textContent;
        if(text != undefined && text.length > 1 && text.length < 50){
          title = 'li_'+text;
        }
        else if($(this).attr("data-raw-value")){
          title = 'li_'+$(this).attr("data-raw-value");
        }
        else if($(this).attr("name")){
          title = 'li_'+$(this).attr("name");
        }
        else if($(this).attr("title")){
          title = 'li_'+$(this).attr("title");
        }
        else if($(this).attr("id")){
          title = 'li_'+$(this).attr("id");
        }
        else{
          title = "li_NoTrackingData";
        }
        //Regex GA string
        title = title.replace(/\s/g , "-");
        //Set aData attribute
        $(this).attr('data-aData',title);
      }
    }
    if(GAdebug == true){
      $(this).hover(
        function(){
          $('.gaDebugWindow').text($(this).attr('data-aData'));
        }, function(){
          $('.gaDebugWindow').text("");
        }
      );
    }
  }); 
}

//Call setGAdata function on window load
//Calls again after 3 seconds to ensure that all elements are accounted for
$(window).load(function(){
  setGAdata();
  setTimeout(setGAdata,3000);
});