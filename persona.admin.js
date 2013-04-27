/**
 * @file
 * Javascript for the Persona admin page.
 */

(function ($) {

Drupal.behaviors.personaAdmin = {
  attach: function (context, settings) {
    var $button = $('.persona');
    $('#edit-persona-button-style').change(function (event) {
      $button.removeClass('persona-styled');
      if ($(this).val() == 'persona') {
        $button.addClass('persona-styled');
      }
    });
  }
}

})(jQuery);
