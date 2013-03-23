(function ($) {

Drupal.behaviors.personaAdmin = {
  attach: function (context, settings) {
    var button_sign_in = $('.persona-sign-in');
    $('#edit-persona-button-style').change(function (e) {
      button_sign_in.removeClass("dark orange persona-button");
      var button = "";
      if ($(this).val()) {
        button = "persona-button ";
      }
      button_sign_in.addClass(button + $(this).val());
    });
  }
}

})(jQuery);
