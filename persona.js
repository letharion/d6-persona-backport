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
    var changeEmail = false;

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
    function getToken(async) {
      if (!settings.persona.token) {
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
     * Reloads the page.
     */
    function reload() {
      // This technique will not resend a POST, will not bypass the cache, and
      // will remove any anchors that would prevent the page from reloading.
      window.location = relativeUrl(settings.persona.currentPath);
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
            url: relativeUrl(changeEmail ? 'user/persona/change-email' : 'user/persona/sign-in'),
            data: JSON.stringify({
              token: settings.persona.token,
              assertion: assertion
            }),
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {
              // Redirect if path provided, otherwise just reload the page.
              if (data) {
                window.location = relativeUrl(data, settings.persona.currentPath);
              }
              else {
                reload();
              }
            },
            error: function (jqXHR, textStatus, errorThrown) {
              // Tell Persona that it didn't work out.
              navigator.id.logout();
            }
          });
        }
        else {
          window.setTimeout(reload, 4000);
        }
      },
      onlogout: function () {
        if (requester || tabHasFocus) {
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
                // Redirect the current tab to the homepage.
                window.location = settings.basePath;
              }
            });
          }
          else {
            reload();
          }
        }
        else {
          window.setTimeout(reload, 1000);
        }
      }
    });
    // Attach the buttons.
    $('.persona-button').click(function (event) {
      $(this).blur();
    });
    $('.persona-sign-in, .persona-change-email').click(function (event) {
      changeEmail = $(this).hasClass('persona-change-email');
      requester = true;
      // Request Persona sign in.
      navigator.id.request({
        siteName: settings.persona.siteName,
        siteLogo: settings.persona.siteLogo,
        termsOfService: settings.persona.termsOfService,
        privacyPolicy: settings.persona.privacyPolicy
      });
      // Get the token asynchronously if necessary.
      getToken(true);
    });
    $('.persona-sign-out').click(function (event) {
      event.preventDefault();
      if (settings.persona.email) {
        requester = true;
        navigator.id.logout();
      }
      else {
        window.location = relativeUrl('user/logout');
      }
    });
    // Add compatibility with user switching.
    $('.persona-forget').click(function (event) {
      settings.persona.email = null;
      requester = true;
      navigator.id.logout();
    });
  }
};

})(jQuery);
