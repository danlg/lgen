POPOVER_BODY_PADDING = -5;

IonTooltip = {
  show: function (templateName, data, button, haveSpotLightOnButton) {
    this.template = Template[templateName];
    this.view = Blaze.renderWithData(this.template, data, $('.ionic-body').get(0));

    var $backdrop = $(this.view.firstNode());
    var $popover = $backdrop.find('.popover');
    var $button = $(button);
    var $arrow = $backdrop.find('.popover-arrow');

    var bodyWidth = $('body').width();
    var bodyHeight = $(window).innerHeight();
    var buttonPosition = $button.offset();
    var buttonWidth = $button.outerWidth();
    var buttonHeight = $button.outerHeight();
    var buttonMidPoint = {x:buttonPosition.left+(buttonWidth/2),y:buttonPosition.top+(buttonHeight/2)};      
    var popoverWidth = $popover.outerWidth();
    var popoverHeight = $popover.outerHeight();
    var popoverCSS = {
      marginLeft: '0',
      opacity: 1,
      left: buttonPosition.left + buttonWidth / 2 - popoverWidth / 2
    };

    if (popoverCSS.left < POPOVER_BODY_PADDING) {
      popoverCSS.left = POPOVER_BODY_PADDING;
    } else if(popoverCSS.left + popoverWidth + POPOVER_BODY_PADDING > bodyWidth) {
      popoverCSS.left = bodyWidth - popoverWidth - POPOVER_BODY_PADDING;
    }

    if (buttonPosition.top + buttonHeight + popoverHeight > bodyHeight) {
      popoverCSS.top = buttonPosition.top - popoverHeight;
      $popover.addClass('popover-bottom');
    } else {
      popoverCSS.top = buttonPosition.top + buttonHeight;
      $popover.removeClass('popover-bottom');
    }

    $backdrop.addClass('active');
    if(haveSpotLightOnButton){
        var circleDiameter = buttonWidth
        if(buttonHeight<buttonWidth){
            circleDiameter = buttonHeight;
        } 
        var backgroundColorCss = "radial-gradient(1px at "+buttonMidPoint.x+"px "+buttonMidPoint.y+"px , rgba(0, 0, 0, 0.1) 0%, rgba(68, 68, 68, 0.03) "+circleDiameter*0.7+"px, rgba(0, 0, 0, 0.3) "+circleDiameter+"px)";
        
        $backdrop.css({"background":backgroundColorCss});
    }
    $arrow.css({
      left: buttonPosition.left + buttonWidth / 2 - $arrow.outerWidth() / 2 - popoverCSS.left + 'px'
    });
    $popover.css(popoverCSS);
  },

  hide: function () {
    if (typeof this.view !== 'undefined') {
      var $backdrop = $(this.view.firstNode());
      $backdrop.removeClass('active');
  
      var $popover = $backdrop.find('.popover');
      $popover.css({opacity: 0});
  
      Blaze.remove(this.view);
    }
  }
};

Template.ionTooltip.rendered = function () {
  $(window).on('keyup.ionTooltip', function(event) {
    if (event.which == 27) {
      IonTooltip.hide();
      event.preventDefault();
    }
  });
};

Template.ionTooltip.destroyed = function () {
  $(window).off('keyup.ionTooltip');
};

Template.ionTooltip.events({
  // Handle clicking the backdrop
  'click': function (event, template) {
    if ($(event.target).hasClass('popover-backdrop') || $(event.target).hasClass('popover')) {
      IonTooltip.hide();
      event.preventDefault();
    }
  }
});
