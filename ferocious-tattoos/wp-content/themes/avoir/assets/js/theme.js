
  
/*!
 ______ _____   _______ _______ _______ _______ ______ _______ 
|   __ \     |_|    ___|_     _|   |   |       |   __ \   _   |
|    __/       |    ___| |   | |       |   -   |      <       |
|___|  |_______|_______| |___| |___|___|_______|___|__|___|___|

P L E T H O R A T H E M E S . C O M               (c) 2013-2017
                        
Theme Name: Avoir
File Version: 1.1 [EmbedLite]
This file contains the necessary Javascript for the theme to function properly.

*/

//========================== PLETHORA HELPER FUNCTIONS ==============================================

(function( window, doc, $ ){

  "use strict";

  /*** POLYFILLS ***/

  // SHIM POLYFILL FOR: requestAnimationFrame
  window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
                                 window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||
                                 window.msRequestAnimationFrame || function (cb){window.setTimeout(cb,1000/60);};

  var _p = _p || {};

  /*** OBJECT EXTEND: By @toddmotto ***/

  _p.extend = function( target, source ) {
      var merged = Object.create(target);
      Object.keys(source).map(function (prop) {  prop in merged && (merged[prop] = source[prop]);  });
      return merged;
  };

  /*** MULTI SLICE ***/

  _p.slice = function(){
    return [].slice.call.apply( [].slice, arguments );
  }

  /*** BOOLEAN OPERATOR CHECK ***/

  _p.checkBool = function(val){
      return ({1:1,true:1,on:1,yes:1}[(((typeof val !=="number")?val:(val>0))+"").toLowerCase()])?true:false;
  };

  /*** DEBUGGING CONSOLE ***/

  _p.debugLog = function(){
    themeConfig && themeConfig.debug && console.log.apply( console, arguments );
  }

  /*** DETECT INTERNET EXPLORER ***/

  _p.isIE = function() {
    var myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
  }

  /*** SVG CREATION UTILITY FUNCTION ***/

  _p.SVGMold  = function( type, options ){
  var molding = doc.createElementNS('http://www.w3.org/2000/svg', type );
  for (var key in options) options.hasOwnProperty(key) && molding.setAttribute( key, options[key]);
    return molding;
  }

  /*** PUBSUB ***/

  _p.PubSub = {};

  (function(q) {
      var topics = {}, subUid = -1;
      q.subscribe = function(topic, func) {
          if (!topics[topic]) {
              topics[topic] = [];
          }
          var token = (++subUid).toString();
          topics[topic].push({
              token: token,
              func: func
          });
          return token;
      };

      q.publish = function(topic, args) {
          if (!topics[topic]) {
              return false;
          }
          setTimeout(function() {
              var subscribers = topics[topic],
                  len = subscribers ? subscribers.length : 0;

              while (len--) {
                  subscribers[len].func(topic, args);
              }
          }, 0);
          return true;

      };

      q.unsubscribe = function(token) {
          for (var m in topics) {
              if (topics[m]) {
                  for (var i = 0, j = topics[m].length; i < j; i++) {
                      if (topics[m][i].token === token) {
                          topics[m].splice(i, 1);
                          return token;
                      }
                  }
              }
          }
          return false;
      };
  }(_p.PubSub));

  /*** SCROLL ON CLICK ***/

   $(window).bind( 'hashchange', function(e) {
    parseInt(window.location.hash.replace( "#", "" )); 
   });

  $.extend( $.easing, { easeOutQuart: function (x, t, b, c, d) { return -c * ((t=t/d-1)*t*t*t - 1) + b; }, });

  _p.scrollOnClick = function(e){

    var HeaderHeight = $('.header').outerHeight();

    _p.debugLog("Scrolled...");
    e.preventDefault();                   // PREVENT DEFAULT ANCHOR CLICK BEHAVIOR
    var hash        = this.hash;          // STORE HASH
    var hashElement = $(this.hash);       // CACHE $.SELECTOR
     if ( hashElement.length > 0 ){
       $('html, body').animate({ scrollTop: Math.round(hashElement.offset().top) - HeaderHeight }, themeConfig["GENERAL"]["onePagerScrollSpeed"],'easeOutQuart', 
        function(){  
          /*** ADD HASH TO URL WHEN FINISHED [v1.3] | Thank you @LeaVerou! ***/
          if ( history.pushState ) history.pushState( null, null, hash ); // Old Method: window.location.hash = hash 
        });
     }

  }

  /*** THROTTLE ***/

  _p.throttle = function(fn, wait) {
    var time = Date.now();
    return function() { if ((time + wait - Date.now()) < 0) { fn(); time = Date.now(); }
    }
  }

  return window._p = _p;

}( window, document, jQuery ));

//END---------------------------------------------------------------------- PLETHORA HELPER FUNCTIONS

//========================== HEADER VARIATIONS ======================================================

(function($){

  "use strict";

    // Declaring some vars
    var header_height = $('.header').height();
    var window_height = $(window).height();
    var usable_height = window_height - header_height;
    var scroll_offset_trigger = themeConfig["GENERAL"].scroll_offset_trigger;

    // 1. Sticky Header always on Top. You have to add class "sticky_header" to the .header element
    
    if( $('.header.sticky_header:not(".transparent")').length ) { 

      var $body = $('body');
      $body.css( 'margin-top', header_height );
      $(window).on( 'load resize', function(){
        var header_height = $('.header').height();
        $body.css( 'margin-top', header_height );
      });

    }

    // 2. Sticky Header Bottom. You have to add class "bottom_sticky_header" to the .header element

    // 3. Appearing from Top Sticky Header. You have to add class "appearing_sticky_header" to the .header element

    if( $('.header.appearing_sticky_header').length ) {
      
      var $sticky_nav = $('.header.appearing_sticky_header');

      $(window).scroll(function () {
        if ($(this).scrollTop() > scroll_offset_trigger) {
            $sticky_nav.addClass("stuck");
        } else {
            $sticky_nav.removeClass("stuck");
        }
      }); 
    
      var window_top = $(window).scrollTop();

      if (window_top > scroll_offset_trigger) {
          $sticky_nav.addClass("stuck");
      } else {
          $sticky_nav.removeClass("stuck");
      } 

    }    
    
    // 4. Starting on Bottom and sticking on top. You have to add class "bottom_to_top_sticky_header" to the header.header element

    if( $('.header.bottom_to_top_sticky_header').length ) {
    
      var traveling_nav = $('.header.bottom_to_top_sticky_header');
      
      $(window).scroll(function () {
          if ($(this).scrollTop() > usable_height) {
              traveling_nav.addClass("stuck");
          } else {
              traveling_nav.removeClass("stuck");
          }
      }); 
      
      var window_top = $(window).scrollTop();
      if (window_top > usable_height) {
          traveling_nav.addClass("stuck");
      } else {
          traveling_nav.removeClass("stuck");
      }

    }

    // Alternative Sticky Header

    if( $('body.sticky_header_alt').length ) {

      var alternative_sticky_header = $('body.sticky_header_alt .header');

      //================================================================================

      if( $('.header:not(.bottom_to_top_sticky_header)').length ) {

        $(window).scroll(function () {
          if ($(this).scrollTop() > scroll_offset_trigger) {
              alternative_sticky_header.addClass("alt_header_triggered");
          } else {
              alternative_sticky_header.removeClass("alt_header_triggered");
          }
        });       
        var window_top = $(window).scrollTop();
        if (window_top > scroll_offset_trigger) {
            alternative_sticky_header.addClass("alt_header_triggered");
        } else {
            alternative_sticky_header.removeClass("alt_header_triggered");
        }

      }

      //================================================================================

      if( $('.header.bottom_to_top_sticky_header').length ) {
    
        var traveling_nav = $('.header.bottom_to_top_sticky_header');
        
        $(window).scroll(function () {
            if ($(this).scrollTop() > usable_height) {
                traveling_nav.addClass("stuck alt_header_triggered");
            } else {
                traveling_nav.removeClass("stuck alt_header_triggered");
            }
        }); 
        
        var window_top = $(window).scrollTop();
        if (window_top > usable_height) {
            traveling_nav.addClass("stuck alt_header_triggered");
        } else {
            traveling_nav.removeClass("stuck alt_header_triggered");
        }

      }

      //================================================================================

    }


}(jQuery));

//END----------------------------------------------------------------------------- HEADER VARIATIONS    

//========================== PRIMARY MENU CONSTRUCTOR ===============================================

(function($){

  "use strict";

    // If there are dropdowns on the primary nav, go on
    if ($('.header nav.primary_nav ul > li > ul').length) {

        // Add the appropriate classes to the primary nav
        $('.header nav.primary_nav ul > li > ul').addClass('menu-dropdown-content');        
        var lihaschildren = $('.lihaschildren');
        lihaschildren.addClass('lihaschildren menu-dropdown');
        var atoggledropdown = $('.lihaschildren > a, .sublihaschildren > a');
        atoggledropdown.addClass('menu-dropdown-toggle');
        
        // Click Menu Functionality (.click_menu class on .header)
        $('.click_menu a.menu-dropdown-toggle').on("click" , function(e) {
            $(this).parent('li').siblings('li').children('ul.open').removeClass('open');
            $(this).parent('li').siblings('li').children('ul').children('li').children('ul.open').removeClass('open');
            $(this).siblings('ul').children('li').children('ul.open').removeClass('open');
            $(this).siblings().toggleClass('open');
            e.stopPropagation();
        });

        // When we have a Click Menu and an item has both children and a link, then onClick don't serve the link, show the children. Basic UX Stuff.
        $('.click_menu a.menu-dropdown-toggle').attr( 'onclick' , 'return false');

        // Close Dropdown when clicking elsewhere
        $(document.body).on('click', function(){
            $('.menu-dropdown-content').removeClass('open');
        });

    };

    // Centered in Menu Inline Logo Feature (.logo_centered_in_menu on .header)
    if ( $('.header.logo_centered_in_menu').length ) {

      // Count the number of top level menu elements
      var count_of_lis = $('.primary_nav > ul.top_level_ul').children('li').length;

      if (count_of_lis % 2 === 0 ) {
        // If count is even, target the middle li
        var center_of_lis = count_of_lis / 2;
        var li = $('.primary_nav > ul > li:nth-child(' + center_of_lis + ')')
      } else {
        // else if count is odd, add a fake li to make them even and target the middle li
        $('.primary_nav > ul').prepend('<li class="fake"></li>');
        var center_of_lis = count_of_lis / 2 + 0.5;
        var li = $('.primary_nav > ul > li:nth-child(' + center_of_lis + ')')
      }

      var logo_div = $(".logo");
      var maxWidth = 0;
      var elemWidth = 0;
      
      // Make all 1st-level elements of the menu, equal width
      $('.primary_nav > ul > li').each(function() {
          elemWidth = parseInt($(this).css('width'));
          if (parseInt($(this).css('width')) > maxWidth) {
              maxWidth = elemWidth;
          }
      });
      $('.primary_nav > ul > li').each(function() {
          $(this).css('width', maxWidth + "px");
      });

      // Insert the logo in the middle of the menu
      logo_div.insertAfter(li).wrap('<li class="logo_in_nav"></li>');


    };


}(jQuery));

//END----------------------------------------------------------------------- PRIMARY MENU CONSTRUCTOR

//========================== MOBILE MENU ============================================================

(function($){

  "use strict";

  $('#navicon').on('click', function () {
    $(".mobile-navigation").toggleClass("visible");
    $(".mobile-navigation ul li").toggleClass("list-animation");
    $("body").toggleClass("modal-open");
  });

    (function () {
    var active;
    active = true;
    $('#navicon').on('click', function () {
      if (active === true) {
        $('#navicon').removeClass('inactive').addClass('active');
        active = false;
      } else {
        $('#navicon').removeClass('active').addClass('inactive');
        active = true;
      }
    });
  }.call(this));

}(jQuery));

//END------------------------------------------------------------------------------------ MOBILE MENU    

//========================== FADE OUT HEADER OnSCROLL EFFECT ========================================

(function($){

  "use strict";

  if ( $('.fade_on_scroll').length ) {

    $(window).on('scroll', function() {
      var element = $('.fade_on_scroll');
      var ft = $(this).scrollTop();
      element.css({ 'opacity' : (1 - ft/400) });
    });

  }  

}(jQuery));

//END------------------------------------------------------------- FADE OUT HEADER OnSCROLL EFFECT

//========================== LOADER ==============================================================

(function($) {

  "use strict";

  $(window).load(function(){
    setTimeout(function(){
      $('.loading').addClass("hidden");
      $('.loader-logo').addClass("slideOutUp");
      $('.loader').addClass("slideOutUp");
      $('body').addClass("body-animated");
    }, 10);
  });
  
}(jQuery));

//END-------------------------------------------------------------------------------------- LOADER

//========================= SCROLL ON CLICK OF A HASH-LINK init ==================================

(function($){

  $(".header, .head_panel, .main")
      .find('a[href^="#"], button[href^="#"]')
      .not('[data-vc-tabs], [data-vc-accordion]')  // EXCLUDE VC TABS
      // EXCLUDE WOO TABS
      .filter(function(idx,el){ return $(el).parents(".product").length < 1; })
      .add("a.scrollify")
      .on('click', _p.scrollOnClick );

})(jQuery);

//END--------------------------------------------------------- SCROLL ON CLICK OF A HASH-LINK init

//========================= PARALLAX for Head Panel ==============================================

(function($){

  $('.parallax-window').each(function(){

    var bg_image = $(this).css("background-image").replace('url(','').replace(')','').replace(/\"/g, '').replace(/\'/g, '');
    $(this).addClass("transparent").css("background-image","none").attr("data-parallax", "scroll").attr("data-image-src", bg_image).attr("data-position", "center top");

  }); 

}(jQuery));

//END--------------------------------------------------------------------- PARALLAX for Head Panel

//========================= WOW (REVEAL ON SCROLL INIT FOR NO-TOUCH DEVICES) =====================

(function($){

  if ($('.no-touch').length) {
    var wow = new WOW({
      animateClass : 'animated',
      offset       :       100
    });
    wow.init();
  }

})(jQuery);

//END-------------------------------------------- WOW (REVEAL ON SCROLL INIT FOR NO-TOUCH DEVICES)

//=================== SECTION SEPARATORS =========================================================

  (function($){

    var $separator_top    = $(".separator_top");
    var $separator_bottom = $(".separator_bottom");

    if ($separator_top.length) {
      $separator_top.each(function(){
        $(this).prepend( "<div class='separator_top'><div>" );
      }); 
    }
    if ($separator_bottom.length) {
      $separator_bottom.each(function(){
        $(this).append( "<div class='separator_bottom'><div>" );
      }); 
    }

  }(jQuery));

//END------------------------------------------------------------------------------SECTION SEPERATORS 

//========================== PORTFOLIO HOVER ========================================================

(function($){

  "use strict";

  var $gridOverlays = $('.gris_hover_overlay');
  if ( ! $gridOverlays.length ) return; // If there are no Grid Overlay elements on the page, exit

  $gridOverlays.hover(
    function() { showOverlay( $(this) ); },
    function() { hideOverlay( $(this) ); }
  );

  function showOverlay($block){

    TweenMax.to($block.find('.grid_item_overlay'), .25, {opacity: '1', ease: Quart.easeOut});
    TweenMax.to($block.find('h2'), .2, {opacity: '1', y: '-50', ease: Quart.easeOut});
    TweenMax.to($block.find('p'), .2, {opacity: '1', y: '-35', delay: .05, ease: Quart.easeOut});
    
  }

  function hideOverlay(block){

      TweenMax.to(block.find('.grid_item_overlay'), .25, {opacity: '0', delay: .10, ease: Quart.easeOut});
      TweenMax.to(block.find('h2'), .2, {opacity: '0', y: '0', delay: .10, ease: Quart.easeOut});
      TweenMax.to(block.find('p'), .2, {opacity: '0', y: '0', ease: Quart.easeOut});    

  }

  // MOBILE + TOUCH EVENTS ORIENTED CODE
  var $gridOverlayAnchors = $gridOverlays.find('a');
  var clicked = null;

  function resetClicked(){

      hideOverlay( $(clicked) );
      clicked = null;
      window.removeEventListener( 'scroll', throttledResetClicked );

  }

  var throttledResetClicked = _p.throttle( resetClicked, 700 );

  $gridOverlayAnchors.on( "touchstart", function(e) {

      var currentTarget = e.currentTarget;
      if ( clicked === currentTarget ) return true; // Same element clicked twice
      if ( clicked ) resetClicked();                // Different clicked element exists? Reset it.
      e.preventDefault();
      clicked = currentTarget;
      window.addEventListener( 'scroll', throttledResetClicked );
      showOverlay( $(currentTarget) );
      return false;

    }
  );

}(jQuery));

//END-------------------------------------------------------------------------------- PORTFOLIO HOVER

//========================== FORM INPUT=NUMBER STYLING ==============================================

(function($){

  "use strict";

  $('input[type="number"]').not('.cart_item input[type="number"]').before(function() {
      return $('<span />', {
          'class': 'spinner',
          text: '-'
      }).on('click', {input : this}, function(e) {
          e.data.input.value = (+e.data.input.value) - 1;
      });
  }).after(function() {
      return $('<span />', {
          'class': 'spinner',
          text: '+'
      }).on('click', {input : this}, function(e) {
          e.data.input.value = (+e.data.input.value) + 1;
      });
  });

}(jQuery));

//END---------------------------------------------------------------------- FORM INPUT=NUMBER STYLING

//========================== (EMBEDLITE SHORTCODE) LIGHTWEIGHT VIDEO EMBEDDING ======================
(function($){

    var loadPlayer = function(el, videoURL){
      var iframe              = el.querySelector('iframe');
          iframe.style.zIndex = 2;
          iframe.src          = videoURL;
    }

    $('.ple_yt-box').each(function(idx,el){

      var videoURL = el.getAttribute('data-url'); 
      $(el).find('.play').on('click', loadPlayer.bind(this, el, videoURL));

    });

}(jQuery));
//END---------------------------------------------- (EMBEDLITE SHORTCODE) LIGHTWEIGHT VIDEO EMBEDDING
