(function ($) {

Drupal.behaviors.personaAdmin = {
  attach: function (context, settings) {
    var button_sign_in = $('.persona-sign-in');
    var button_change_email = $('.persona-change-email');
    $('#edit-persona-button-style').change(function (e) {
      button_sign_in.removeClass("dark orange persona-button");
      button_change_email.removeClass("dark orange persona-button");
      var button = "";
      if ($(this).val()) {
        button = "persona-button ";
      }
      button_sign_in.addClass(button + $(this).val());
      button_change_email.addClass(button + $(this).val());
    });
    $('#edit-persona-button-text-sign-in').keyup(function (e) {
      button_sign_in.children('span').text($(this).val());
    });
    $('#edit-persona-button-text-change-email').keyup(function (e) {
      button_change_email.children('span').text($(this).val());
    });
  }
}

})(jQuery);
