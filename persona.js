(function ($) {

Drupal.behaviors.persona = {
  attach: function (context, settings) {

    /**
     * Requests a signed identity assertion from the browser.
     */
    function request() {
      navigator.id.request({
        siteName: settings.persona.siteName,
        siteLogo: settings.persona.siteLogo,
        termsOfService: settings.persona.termsOfService,
        privacyPolicy: settings.persona.privacyPolicy
      });
    }

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

    // Define default sign in callback path.
    var signInPath = 'user/persona/sign-in';
    // Sign out should only redirect to home in the tab where it was actioned.
    var goHomeOnSignOut = false;

    // Attach to buttons.
    $('.persona-sign-in').click(function (e) {
      e.preventDefault();
      e.stopPropagation();
      request();
    });
    $('.persona-change-email').click(function (e) {
      e.preventDefault();
      e.stopPropagation();
      // Override sign in callback path to change email.
      signInPath = 'user/persona/change-email';
      request();
    });
    $('.persona-logout').click(function (e) {
      e.preventDefault();
      e.stopPropagation();
      // Make this tab redirect to home.
      goHomeOnSignOut = true;
      navigator.id.logout();
    });
    // Register callbacks to be invoked when a user signs in or out.
    navigator.id.watch({
      loggedInUser: settings.persona.email,
      onlogin: function (assertion) {
        // Attempt to sign in to the site and then reload the page.
        $.ajax({
          type: 'POST',
          contentType: 'application/json',
          url: relativeUrl(signInPath),
          data: JSON.stringify({
            assertion: assertion,
            token: settings.persona.token
          }),
          dataType: 'json',
          error: function (jqXHR, textStatus, errorThrown) {
            // If signing in failed tell Persona about it, unless the browser
            // was already signed in.
            if (jqXHR.status != 409) {
              navigator.id.logout();
            }
            window.location.reload();
          },
          success: function (path, textStatus, jqXHR) {
            // Redirect if uid provided, otherwise just reload the page.
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
          // Sign out asynchronously to avoid an access denied page, as the
          // browser may have already been signed out in a different tab.
          // Redirect to front page.
          $.ajax({
            type: 'GET',
            url: relativeUrl('user/logout'),
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
      }
    });
  }
};

})(jQuery);
