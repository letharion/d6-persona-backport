(function ($) {
  Drupal.behaviors.persona = {
    attach: function (context, settings) {
      $('.persona-login').click(function (e) {
        // Remove focus from the button so it doesn't look weird.
        $('.persona-login').blur();
        e.preventDefault();
        e.stopPropagation();
        navigator.id.request({
          siteName: settings.persona.site_name,
          siteLogo: settings.persona.site_logo
        });
      });
      $('.persona-logout, a[href$="user/logout"], a[href$="index.php?q=user/logout"]').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        navigator.id.logout();
      });
      navigator.id.watch({
        loggedInUser: settings.persona.email,
        onlogin: function (assertion) {
          // Attempt to sign in to the site and then reload the page.
          $.ajax({
            type: 'POST',
            url: settings.basePath + 'persona/verify',
            data: {
              assertion: assertion,
              token: settings.persona.token
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
          if (settings.persona.email) {
            // Sign out asynchronously to avoid an access denied page, as the
            // browser may have already been signed out in a different tab.
            // Redirect to front page.
            $.ajax({
              type: 'GET',
              url: settings.basePath + 'user/logout',
              complete: function (jqXHR, textStatus) {
                window.location = settings.basePath;
              }
            });
          }
        }
      });
    }
  }
}(jQuery));
