// CHANGELOG

// 04.11.16 Katie Garcia
// Modified LeanModal to have autoplay option
// Modified LeanModal to pause video on close

(function($) {
    var _stack = 0,
    _lastID = 0,
    _generateID = function() {
      _lastID++;
      return 'materialize-lean-overlay-' + _lastID;
    };

  $.fn.extend({
    openModal: function(options) {

      $('body').css('overflow', 'hidden');

      var defaults = {
        opacity: 0.5,
        in_duration: 350,
        out_duration: 250,
        ready: undefined,
        complete: undefined,
        dismissible: true,
        playOnOpen: undefined,
        starting_top: '4%'
      },
      overlayID = _generateID(),
      $modal = $(this),
      $overlay = $('<div class="lean-overlay"></div>'),
      lStack = (++_stack);

      // Store a reference of the overlay
      $overlay.attr('id', overlayID).css('z-index', 1000 + lStack * 2);
      $modal.data('overlay-id', overlayID).css('z-index', 1000 + lStack * 2 + 1);

      $("body").append($overlay);

      // Override defaults
      options = $.extend(defaults, options);

      if (options.dismissible) {
        $overlay.click(function() {
          $modal.closeModal(options);
        });
        // Return on ESC
        $(document).on('keyup.leanModal' + overlayID, function(e) {
          if (e.keyCode === 27) {   // ESC key
            $modal.closeModal(options);
          }
        });
      }

      //Trigger events
      $modal.trigger( "modalOpened" );

      //Add close button functionality
      $modal.find(".modal-close").on('click.close', function(e) {
        $modal.closeModal(options);
      });

      //Set display
      $overlay.css({ display : "block", opacity : 0 });

      $modal.css({
        display : "block",
        opacity: 0
      });

      $overlay.velocity({opacity: options.opacity}, {duration: options.in_duration, queue: false, ease: "easeOutCubic"});
      $modal.data('associated-overlay', $overlay[0]);

      //Play video, if desired
      if(options.playOnOpen){
        var wistiaId = $modal.find('.wistia_embed').first().attr('id');

        if(wistiaId){ //if wistia embeded video
          var video = Wistia.api(wistiaId);
          video.play();
        } else { // try iframe video
          var iFrame = $modal.find('iframe[src*="youtube.com"]').first();         
  ​
          if (iFrame.length > 0){
            var currSrc = $(iFrame).attr( 'src');
            if (currSrc.indexOf("autoplay=0") > -1) {
              currSrc = currSrc.replace("autoplay=0", "autoplay=1");
              $(iFrame).attr('src', currSrc);
            } else if (currSrc.indexOf("?") > -1) {
              currSrc = currSrc + "&autoplay=1";
              $(iFrame).attr('src', currSrc);
            } else {
              currSrc = currSrc + "?autoplay=1";
              $(iFrame).attr('src', currSrc);
            }
          }
        }
      }//playOnOpen


      // Define Bottom Sheet animation
      if ($modal.hasClass('bottom-sheet')) {
        $modal.velocity({bottom: "0", opacity: 1}, {
          duration: options.in_duration,
          queue: false,
          ease: "easeOutCubic",
          // Handle modal ready callback
          complete: function() {
            if (typeof(options.ready) === "function") {
              options.ready();
            }
          }
        });
      }
      else {
        $.Velocity.hook($modal, "scaleX", 0.7);
        $modal.css({ top: options.starting_top });
        $modal.velocity({top: "10%", opacity: 1, scaleX: '1'}, {
          duration: options.in_duration,
          queue: false,
          ease: "easeOutCubic",
          // Handle modal ready callback
          complete: function() {
            if (typeof(options.ready) === "function") {
              options.ready();
            }
          }
        });
      }
    }
  });

  $.fn.extend({
    closeModal: function(options) {
      var defaults = {
        out_duration: 250,
        complete: undefined
      },
      $modal = $(this),
      overlayID = $modal.data('overlay-id'),
      $overlay = $('#' + overlayID);

      options = $.extend(defaults, options);

      //Trigger events
      $modal.trigger( "modalClosed" );

      // Disable scrolling
      $('body').css('overflow', '');

      //Listen for close event
      $modal.find('.modal-close').off('click.close');
      $(document).off('keyup.leanModal' + overlayID);

      $overlay.velocity( { opacity: 0}, {duration: options.out_duration, queue: false, ease: "easeOutQuart"});

      //if video modal, pause video on close
      var wistiaId = $(this).find('.wistia_embed').first().attr('id');

      if(wistiaId && Wistia){ //if wistia embeded video
        var video = Wistia.api(wistiaId);
        video.pause();
      }else{ // try iframe video
        var iFrame = $(this).find('iframe[src*="youtube.com"]').first();

        if(iFrame){
          var currSrc = $(iFrame).attr( 'src');
          if (currSrc && currSrc.indexOf("autoplay=1") > -1) {
            $(iFrame).attr('src', currSrc.replace("autoplay=1", "autoplay=0"));
          }
        }
      }

      // Define Bottom Sheet animation
      if ($modal.hasClass('bottom-sheet')) {
        $modal.velocity({bottom: "-100%", opacity: 0}, {
          duration: options.out_duration,
          queue: false,
          ease: "easeOutCubic",
          // Handle modal ready callback
          complete: function() {
            $overlay.css({display:"none"});

            // Call complete callback
            if (typeof(options.complete) === "function") {
              options.complete();
            }
            $overlay.remove();
            _stack--;
          }
        });
      }
      else {
        $modal.velocity(
          { top: options.starting_top, opacity: 0, scaleX: 0.7}, {
          duration: options.out_duration,
          complete:
            function() {

              $(this).css('display', 'none');
              // Call complete callback
              if (typeof(options.complete) === "function") {
                options.complete();
              }
              $overlay.remove();
              _stack--;
            }
          }
        );
      }
    }
  });

  $.fn.extend({
    leanModal: function(option) {
      return this.each(function() {

        var defaults = {
          starting_top: '4%'
        },
        // Override defaults
        options = $.extend(defaults, option);

        // Close Handlers
        $(this).click(function(e) {
          options.starting_top = ($(this).offset().top - $(window).scrollTop()) /1.15;
          var modal_id = $(this).attr("href") || '#' + $(this).data('target');
          $(modal_id).openModal(options);
          e.preventDefault();
        }); // done set on click
      }); // done return
    }
  });
})(jQuery);