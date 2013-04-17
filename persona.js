/**
 * @file
 * JavaScript for communicating with navigator.id
 *
 * @see https://developer.mozilla.org/en-US/docs/DOM/navigator.id
 */

(function ($) {

Drupal.behaviors.persona = {
  attach: function (context, settings) {
    // If navigator.id is not available then do nothing.
    if (!navigator.id) {
      return;
    }

    var requester = false;
    var tabHasFocus = false;
    var signInPath = 'user/persona/sign-in';

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

    /**
     * Gets the XSRF token if it isn't defined.
     */
    function getToken(async = true) {
      if (!settings.persona.token) {
        // Get the XSRF token asynchronously.
        $.ajax({
          type: 'GET',
          async: async,
          contentType: 'application/json',
          url: relativeUrl('user/persona/get-token'),
          dataType: 'json',
          success: function (data, textStatus, jqXHR) {
            settings.persona.token = data;
          }
        });
      }
    }

    /**
     * Requests a signed identity assertion from the browser.
     */
    function request() {
      requester = true;
      // Request Persona sign in.
      navigator.id.request({
        siteName: settings.persona.siteName,
        siteLogo: settings.persona.siteLogo,
        termsOfService: settings.persona.termsOfService,
        privacyPolicy: settings.persona.privacyPolicy
      });
      // Get the token asynchronously if necessary.
      getToken();
    }

    // Determine when the current tab has the focus.
    $(window).focus(function () {
      tabHasFocus = true;
    });
    $(window).blur(function () {
      tabHasFocus = false;
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
    // Register callbacks to be invoked when a user signs in or out.
    navigator.id.watch({
      loggedInUser: settings.persona.email,
      onlogin: function (assertion) {
        if (requester || tabHasFocus) {
          // Get the token synchronously if necessary.
          getToken(false);
          // Attempt to sign in to the site and then reload the page.
          $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: relativeUrl(signInPath),
            data: JSON.stringify({
              token: settings.persona.token,
              assertion: assertion
            }),
            dataType: 'json',
            error: function (jqXHR, textStatus, errorThrown) {
              // Tell Persona that it didn't work out.
              navigator.id.logout();
            },
            success: function (data, textStatus, jqXHR) {
              // Redirect if path provided, otherwise just reload the page.
              if (data) {
                window.location = relativeUrl(data, settings.persona.currentPath);
              }
              else {
                window.location.reload();
              }
            }
          });
        }
        else {
          window.setTimeout(function () {
            window.location.reload()
          }, 4000);
        }
      },
      onlogout: function () {
        // Only sign out from the website if it is already signed in. This
        // prevents unnecessary sign out requests when verification fails.
        if (settings.persona.email) {
          $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: relativeUrl('user/persona/sign-out'),
            data: JSON.stringify({
              token: settings.persona.token
            }),
            dataType: 'json',
            complete: function (jqXHR, textStatus) {
              if (tabHasFocus) {
                // Redirect the current tab to the homepage.
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
    // Attach the buttons.
    $('.persona-sign-in').click(function (event) {
      request();
    });
    $('.persona-change-email').click(function (event) {
      // Override sign in callback path to change email.
      signInPath = 'user/persona/change-email';
      request();
    });
    // Only attach to sign out buttons if we are signed in with Persona.
    if (settings.persona.email) {
      $('.persona-sign-out').click(function (event) {
        navigator.id.logout();
        // Prevent the browser from following a link.
        return false;
      });
    }
  }
};

})(jQuery);
