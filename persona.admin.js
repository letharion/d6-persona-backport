(function ($) {
  Drupal.behaviors.personaAdmin = {
    attach: function () {
      var login_button = $('#edit-button .persona-login');
      $('#edit-persona-login-button-style').change(function (e) {
        login_button.removeClass("dark orange persona-button");
        var button = "";
        if ($(this).val()) {
          button = "persona-button ";
        }
        login_button.addClass(button + $(this).val());
      });
      $('#edit-persona-login-button-text').keyup(function (e) {
        login_button.children('span').text($(this).val());
      });
    }
  }
}(jQuery));
