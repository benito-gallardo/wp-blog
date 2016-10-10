/**
 * @file
 * Main Script file for www
 */
//Set Legacy GA for IT reporting purposes
var _gaq = _gaq || [];_gaq.push(["_setAccount", "UA-1399167-1"]);_gaq.push(["_setAllowLinker", true]);_gaq.push(["_setAllowHash", false]);_gaq.push(["_setAllowAnchor", true]);_gaq.push(["_addIgnoredRef", "volusion."]);_gaq.push(["_setDomainName", "volusion.com"]);_gaq.push(["_trackPageview"]);(function() {var ga = document.createElement("script");ga.type = "text/javascript";ga.async = true;ga.src = ("https:" == document.location.protocol ? "https://" : "http://") + "stats.g.doubleclick.net/dc.js";var s = document.getElementsByTagName("script")[0];s.parentNode.insertBefore(ga, s);})();

// //Temporary home for cookieDomain code
// //Needs to be seperated from GA code!!!
// //sets the URI globaly on every page
var curDomain;
var curSubdomain;
var curTopDomain;
var curMiddleDomain;
var cookieDomain;
var currentURI;

function setURI() {
  var queryhash;
  var querysearch = "";
  var tempSubdomain;
  //set GLOBAL curDomain (full domain)
  curDomain = window.location.host;

  //set GLOBAL curSubdomain from the curDomain
  tempSubdomain = curDomain.split('.');
  curSubdomain = tempSubdomain[0];
  curSubdomain.replace(/[a-z]+/gi, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});

  //set Top Domain (match the current TDs available)
  curTopDomain = curDomain.match(/(?:\.dev|\.com|\.net|\.org|\.biz|\.ws|\.in|\.me|\.co\.uk|\.co|\.org\.uk|\.ltd\.uk|\.plc\.uk|\.me\.uk|\.edu|\.mil|\.br\.com|\.cn\.com|\.eu\.com|\.hu\.com|\.no\.com|\.qc\.com|\.sa\.com|\.se\.com|\.se\.net|\.us\.com|\.uy\.com|\.ac|\.co\.ac|\.gv\.ac|\.or\.ac|\.ac\.ac|\.af|\.am|\.as|\.at|\.ac\.at|\.co\.at|\.gv\.at|\.or\.at|\.asn\.au|\.com\.au|\.edu\.au|\.org\.au|\.net\.au|\.id\.au|\.be|\.ac\.be|\.adm\.br|\.adv\.br|\.am\.br|\.arq\.br|\.art\.br|\.bio\.br|\.cng\.br|\.cnt\.br|\.com\.br|\.ecn\.br|\.eng\.br|\.esp\.br|\.etc\.br|\.eti\.br|\.fm\.br|\.fot\.br|\.fst\.br|\.g12\.br|\.gov\.br|\.ind\.br|\.inf\.br|\.jor\.br|\.lel\.br|\.med\.br|\.mil\.br|\.net\.br|\.nom\.br|\.ntr\.br|\.odo\.br|\.org\.br|\.ppg\.br|\.pro\.br|\.psc\.br|\.psi\.br|\.rec\.br|\.slg\.br|\.tmp\.br|\.tur\.br|\.tv\.br|\.vet\.br|\.zlg\.br|\.br|\.ab\.ca|\.bc\.ca|\.mb\.ca|\.nb\.ca|\.nf\.ca|\.ns\.ca|\.nt\.ca|\.on\.ca|\.pe\.ca|\.qc\.ca|\.sk\.ca|\.yk\.ca|\.ca|\.cc|\.ac\.cn|\.com\.cn|\.edu\.cn|\.gov\.cn|\.org\.cn|\.bj\.cn|\.sh\.cn|\.tj\.cn|\.cq\.cn|\.he\.cn|\.nm\.cn|\.ln\.cn|\.jl\.cn|\.hl\.cn|\.js\.cn|\.zj\.cn|\.ah\.cn|\.gd\.cn|\.gx\.cn|\.hi\.cn|\.sc\.cn|\.gz\.cn|\.yn\.cn|\.xz\.cn|\.sn\.cn|\.gs\.cn|\.qh\.cn|\.nx\.cn|\.xj\.cn|\.tw\.cn|\.hk\.cn|\.mo\.cn|\.cn|\.cx|\.cz|\.de|\.dk|\.fo|\.com\.ec|\.tm\.fr|\.com\.fr|\.asso\.fr|\.presse\.fr|\.fr|\.gf|\.gs|\.co\.il|\.net\.il|\.ac\.il|\.k12\.il|\.gov\.il|\.muni\.il|\.ac\.in|\.co\.in|\.org\.in|\.ernet\.in|\.gov\.in|\.net\.in|\.res\.in|\.is|\.it|\.ac\.jp|\.co\.jp|\.go\.jp|\.or\.jp|\.ne\.jp|\.ac\.kr|\.co\.kr|\.go\.kr|\.ne\.kr|\.nm\.kr|\.or\.kr|\.li|\.lt|\.lu|\.asso\.mc|\.tm\.mc|\.com\.mm|\.org\.mm|\.net\.mm|\.edu\.mm|\.gov\.mm|\.ms|\.nl|\.no|\.nu|\.pl|\.ro|\.org\.ro|\.store\.ro|\.tm\.ro|\.firm\.ro|\.www\.ro|\.arts\.ro|\.rec\.ro|\.info\.ro|\.nom\.ro|\.nt\.ro|\.se|\.si|\.com\.sg|\.org\.sg|\.net\.sg|\.gov\.sg|\.sk|\.st|\.tf|\.ac\.th|\.co\.th|\.go\.th|\.mi\.th|\.net\.th|\.or\.th|\.tm|\.to|\.com\.tr|\.edu\.tr|\.gov\.tr|\.k12\.tr|\.net\.tr|\.org\.tr|\.com\.tw|\.org\.tw|\.net\.tw|\.ac\.uk|\.uk\.com|\.uk\.net|\.gb\.com|\.gb\.net|\.vg|\.sh|\.kz|\.ch|\.info|\.ua|\.gov|\.name|\.pro|\.ie|\.hk|\.com\.hk|\.org\.hk|\.net\.hk|\.edu\.hk|\.us|\.tk|\.cd|\.by|\.ad|\.lv|\.eu\.lv|\.bz|\.es|\.jp|\.cl|\.ag|\.mobi|\.eu|\.co\.nz|\.org\.nz|\.net\.nz|\.maori\.nz|\.iwi\.nz|\.io|\.la|\.md|\.sc|\.sg|\.vc|\.tw|\.travel|\.my|\.se|\.tv|\.pt|\.com\.pt|\.edu\.pt|\.asia|\.fi|\.com\.ve|\.net\.ve|\.fi|\.org\.ve|\.web\.ve|\.info\.ve|\.co\.ve|\.tel|\.im|\.gr|\.ru|\.net\.ru|\.org\.ru|\.hr|\.com\.hr)$/);
  if(curTopDomain != null) {
    curTopDomain = curTopDomain[0];
  }
  else {
    curTopDomain = ".localhost";
  }
  

  //set Domain (always the word the preceeds the top level domain)
  curMiddleDomain = curDomain.replace(curTopDomain, '').split('.');
  curMiddleDomain = curMiddleDomain[curMiddleDomain.length-1];

  //cookieDomain domain+top domain
  cookieDomain = curMiddleDomain+curTopDomain

  //set GLOBAL currentURI with hash maintained and query removed
  currentURI = window.location.pathname;
  currentURI = currentURI.replace(/%252d/g,'-').replace(/%2d/g,'-');
  //get hash
  queryhash = window.location.hash;
  //fix improperly formated hash strings - strip out the query (proper formating ?query#hash)
  queryhash = (queryhash.match(/\?/) != null) ? queryhash.split('?',1) : queryhash;

  //get the query string for store.
  querysearch = window.location.search;
  //sets the debug mode to true
  GAdebug = (querysearch.indexOf('gadebug') != -1) ? true : false;
  querysearch = (querysearch.indexOf('gadebug') != -1) ? "" : querysearch;
  //removes google querystrings
  querysearch = (querysearch.match('utm') == null) ? querysearch : querysearch = "";
  //removes long queries
  querysearch = (querysearch.match('&') == null) ? querysearch : querysearch.split('&',1);

  //if the URI is empty then the URI is set to the current domain so that homepage events on subdomains dont all look the same
  currentURI  =  (currentURI == '/' || currentURI == '' || currentURI == '/default.asp') ? curDomain + '/' : currentURI;
    //check to see if the current uri is not a file and if it isnt - make sure it is ended with a /
    //currentURI  = (currentURI.match(/\/$/) == null && currentURI.match(/(\.[a-z]{3,5})$/ == null)) ? currentURI + '/' : currentURI;
  //remove file name/type if there is one so default.asp and / are not counted as 2 separate pages
  currentURI  = currentURI.replace(/\/(index|default)+(\.[a-z]{3,5})$/,'/') ;
  //append hash
  currentURI = currentURI + querysearch + queryhash;
};
setURI(); 

var validateForm, validateField, errorCount;
var security = (window.location.host == 'www.'+cookieDomain ) ? true : false;



//hides error messages and give a show button
// if($('#messages').is('div')){
//   var errorBox = $('#messages[role="alertdialog"]')
//   errorBox.hide();
//   $('#main').prepend('<div class="show-error">show error</div>').click(function(){
//     errorBox.toggle();
//   });
// }



// //adds the vHSBC cookie - legacy name from the project this was based on
// //adds the referrer value - from the referrer field that is hidden on the page
// //adds a landing page value - the partner/affiliate page that they currently landed on
//   if($('.field-referrer').is('div')){
//     //grabs the hidden referrer value
//     var tempRef = $('.field-referrer').text();
//     setcookie('vHSBC','Referrer='+tempRef+'&LandingPage=http://www.'+cookieDomain+currentURI,90,cookieDomain);
//   }

//affiliate tracking cookie that is set on any page that has the ?SID=value on it
//cj values passed to store. on purchase
  // var tempAffiliate = window.location.search.toUpperCase();
  // if(getcookie('cj')==""&&tempAffiliate.indexOf('SID')!=-1){
  //   //splits the SID value into the begining of the [1] array item
  //   tempAffiliate = tempAffiliate.split('SID=');
  //   //splite the array into the SID value and then all other values
  //   tempAffiliate = tempAffiliate[1].split('&');
  //   //changes the [0] value into a var
  //   tempAffiliate = tempAffiliate[0];
  //   //sets cookie
  //   removecookie('SendIRData', cookieDomain);
  //   setcookie('vHSBC','Referrer=cj&LandingPage=http://www.'+cookieDomain+currentURI,90,cookieDomain);
  //   setcookie('cj','Campaign='+tempAffiliate,45,cookieDomain);
  // }

/***********************************
  change login from my. to the trial login page
***********************************/
//Date: 07-15-2014
//Author: Yixin Xia
//Function: If user tried free trial (cookie===true) then CTA buttons and other elements on the page will change

// Update 05-2015
// Katie Garcia
// Now you can use the toggleCTA function below to add this functionality on the fly using classes and data attributes.
// Example: Toggle CTA
// HTML: <a href="/free-trial" class="js-toggle-cta" data-new-cta="Compare Plans" data-new-url="/hosting-plans-pricing">Start for Free</a>
// Will direct non-cookied users to Free Trial and cookied users to Pricing page.
// Example: Hide CTA
// <a href="/free-trial" class="js-hide-element">Start for Free</a>
// Will hide element completely for cookied users

    var CookieBasedCTAChange = {
        //returns cookie value
        returnCookie: function (value) {
            return getcookie(value);
        },
        toggleCTAs: function() {
          if (this.returnCookie('DemoLoginToken')) {
            //console.log('token present');
            $('a.js-toggle-cta').each(function() {
              //console.log('switching cta');
              if ($(this).data("new-cta") && $(this).data("new-url")) {
                var text = $(this).data("new-cta");
                var url = $(this).data("new-url");
                $(this).html(text).attr({"href": url});
              }
            });
          }
        },
        hideElements: function(){
          if (this.returnCookie('DemoLoginToken')) {
            //console.log('hiding elements');
            $('.js-hide-element').hide();
          }else{
            $('.js-show-element').show();
          }
        },
        removeCTACompletely: function(){
            $('.' + pageNameModule.pageNames.servicePageName + ' .top_tif').hide();
        },
        //initialize this module
        initializeModule: function () {
            this.toggleCTAs();
            this.hideElements();
        }
    };
    CookieBasedCTAChange.initializeModule();


/***********************************
  Partner Forms
  hidden value switch - based on the partner interest field switch the hidden field values so that bizdev get the correct info
***********************************/
  $('#edit-submitted-partnership').blur(function(){
    var partnership = parseFloat($(this).val());
    switch (partnership) {
      case 1:
        $('input[name="submitted[affiliate_partner]"]').val(1);
        $('input[name="submitted[referral_partner]"]').val(0);
        $('input[name="submitted[var_partner]"]').val(0);
        $('input[name="submitted[partner_none]"]').val(0);
        break;
      case 2:
        $('input[name="submitted[affiliate_partner]"]').val(0);
        $('input[name="submitted[referral_partner]"]').val(1);
        $('input[name="submitted[var_partner]"]').val(0);
        $('input[name="submitted[partner_none]"]').val(0);
        break;
      case 3:
        $('input[name="submitted[affiliate_partner]"]').val(0);
        $('input[name="submitted[referral_partner]"]').val(0);
        $('input[name="submitted[var_partner]"]').val(1);
        $('input[name="submitted[partner_none]"]').val(0);
        break;
      case 4:
        $('input[name="submitted[affiliate_partner]"]').val(0);
        $('input[name="submitted[referral_partner]"]').val(0);
        $('input[name="submitted[var_partner]"]').val(0);
        $('input[name="submitted[partner_none]"]').val(1);
        break;
      case 5:
        $('input[name="submitted[affiliate_partner]"]').val(0);
        $('input[name="submitted[referral_partner]"]').val(1);
        $('input[name="submitted[var_partner]"]').val(1);
        $('input[name="submitted[partner_none]"]').val(0);
        break;
      default:
        $('input[name="submitted[affiliate_partner]"]').val(0);
        $('input[name="submitted[referral_partner]"]').val(0);
        $('input[name="submitted[var_partner]"]').val(0);
        $('input[name="submitted[partner_none]"]').val(1);
        break;
    };
  });

function getcookie(c_name){if(document.cookie.length>0){c_start=document.cookie.indexOf(c_name+"=");if(c_start!=-1){c_start=c_start+c_name.length+1;c_end=document.cookie.indexOf(";",c_start);if(c_end==-1)c_end=document.cookie.length;var cookie_to_use=unescape(document.cookie.substring(c_start,c_end));return cookie_to_use}};return""};function matchregex(regex){var patt=new RegExp(regex+"=([^|]+)");if(result=patt.exec(__utmp)){return result[1]};return null};

function setcookie(c_name,value,expiredays,domain,isSecure){var exdate=new Date();exdate.setDate(exdate.getDate()+expiredays);(!domain)?window.location.host:domain;var cookie=c_name+"="+value+";path=/;"+((expiredays==null)?"":"expires="+exdate.toGMTString())+((domain=="")?"":";domain="+domain);if(isSecure){cookie+=" secure"};document.cookie=cookie};

function removecookie(name, domain) {
    // If the cookie exists
    if (getcookie(name) !== ""){
        //console.log(name + '=;path=/;domain='+domain+';expires=Thu, 01 Jan 1970 00:00:01 GMT;');
        document.cookie = name + '=;path=/;domain='+domain+';expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
}


