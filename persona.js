(function ($) {
  Drupal.behaviors.persona = {
    attach: function () {
      $('.persona-login').click(function (e) {
        // Remove focus from the button so it doesn't look weird.
        $('.persona-login').blur();
        e.preventDefault();
        e.stopPropagation();
        navigator.id.request({
          siteName: Drupal.settings.persona.site_name,
          siteLogo: Drupal.settings.persona.site_logo
        });
      });
      $('.persona-logout, a[href$="user/logout"], a[href$="index.php?q=user/logout"]').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        navigator.id.logout();
      });
      navigator.id.watch({
        loggedInUser: Drupal.settings.persona.email,
        onlogin: function (assertion) {
          // Attempt to sign in to the site and then reload the page.
          $.ajax({
            type: 'POST',
            url: Drupal.settings.basePath + 'persona/verify',
            data: {
              assertion: assertion,
              token: Drupal.settings.persona.token
            },
            dataType: 'json',
            error: function (jqXHR, textStatus, errorThrown) {
              // If signing in failed tell Persona about it, unless the browser
              // was already signed in.
              if (jqXHR.status != 409) {
                navigator.id.logout();
              }
            },
            complete: function (jqXHR, textStatus) {
              window.location.reload();
            }
          });
        },
        onlogout: function () {
          // If the browser is signed in to the site, sign it out.
          if (Drupal.settings.persona.email) {
            // Sign out asynchronously to avoid an access denied page, as the
            // browser may have already been signed out in a different tab.
            // Redirect to front page.
            $.ajax({
              type: 'GET',
              url: Drupal.settings.basePath + 'user/logout',
              complete: function (jqXHR, textStatus) {
                window.location = Drupal.settings.basePath;
              }
            });
          }
        }
      });
    }
  }
}(jQuery));
