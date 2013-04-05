/**
 * @file
 * Javascript for the Persona admin page.
 */

(function ($) {

Drupal.behaviors.personaAdmin = {
  attach: function (context, settings) {
    var $button = $('.persona-sign-in');
    $('#edit-persona-button-style').change(function (event) {
      $button.removeClass('dark orange persona-button');
      var buttonClass = $(this).val();
      if (buttonClass) {
        buttonClass += ' persona-button';
      }
      $button.addClass(buttonClass);
    });
  }
}

})(jQuery);
