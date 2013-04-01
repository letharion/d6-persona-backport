(function ($) {

Drupal.behaviors.persona = {
  attach: function (context, settings) {
    // Sign out should only redirect to home in the tab where it was actioned.
    var goHomeOnSignOut = false;

    /**
     * Generates a relative URL for the given Drupal path. Optionally adds
     * destination path that Drupal will redirect to if a form is submitted.
     *
     * @param string path
     * @param string destination
     *
     * @return string
     *   Relative URL.
     */
    function relativeUrl(path, destination) {
      var url = settings.basePath;
      url += settings.persona.cleanUrls ? '' : '?q=';
      url += path;
      if (destination != null) {
        url += settings.persona.cleanUrls ? '?' : '&';
        url += 'destination=' + Drupal.encodePath(destination);
      }
      return url;
    }

    // Register callbacks to be invoked when a user signs in or out.
    navigator.id.watch({
      loggedInUser: settings.persona.email,
      onlogin: function (assertion) {
        // Attempt to sign in to the site and then reload the page.
        $.ajax({
          type: 'POST',
          contentType: 'application/json',
          url: relativeUrl('user/persona/sign-in'),
          data: JSON.stringify({
            assertion: assertion,
            token: settings.persona.token
          }),
          dataType: 'json',
          error: function (jqXHR, textStatus, errorThrown) {
            // Tell Persona that it didn't work out.
            navigator.id.logout();
          },
          success: function (path, textStatus, jqXHR) {
            // Redirect if path provided, otherwise just reload the page.
            if (path) {
              window.location = relativeUrl(path, settings.persona.currentPath);
            }
            else {
              window.location.reload();
            }
          }
        });
      },
      onlogout: function () {
        // Only sign out from the website if it is already signed in. This
        // prevents unnecessary sign out requests when verification fails.
        if (settings.persona.email) {
          $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: relativeUrl('user/persona/sign-out'),
            dataType: 'json',
            complete: function (jqXHR, textStatus) {
              if (goHomeOnSignOut) {
                window.location = settings.basePath;
              }
              else {
                window.location.reload();
              }
            }
          });
        }
        else {
          window.location.reload();
        }
      }
    });
    // Switch off Persona when leaving the page to prevent it from issuing a
    // rouge onlogout if it hadn't finished initialising.
    // @see https://github.com/mozilla/browserid/issues/2560
    $(window).bind('beforeunload', function (event) {
      navigator.id.watch({
        loggedInUser: settings.persona.email,
        onlogin: function (assertion) {},
        onlogout: function () {}
      });
    });
    // Attach the buttons.
    $('.persona-sign-in').click(function (event) {
      // Request Persona sign in.
      navigator.id.request({
        siteName: settings.persona.siteName,
        siteLogo: settings.persona.siteLogo,
        termsOfService: settings.persona.termsOfService,
        privacyPolicy: settings.persona.privacyPolicy
      });
    });
    // Only attach to sign out buttons if we are signed in with Persona.
    if (settings.persona.email) {
      $('.persona-sign-out').click(function (event) {
        // Make this tab redirect to home.
        goHomeOnSignOut = true;
        navigator.id.logout();
        // Prevent the browser from following a link.
        return false;
      });
    }
  }
};

})(jQuery);
