(function ($) {
  Drupal.behaviors.persona = {
    attach: function (context, settings) {
      settings.persona.url = settings.basePath + 'user/persona/sign-in';
      function request() {
        navigator.id.request({
          siteName: settings.persona.site_name,
          siteLogo: settings.persona.site_logo,
          termsOfService: settings.persona.terms_link,
          privacyPolicy: settings.persona.privacy_link
        });
      }
      $('.persona-sign-in').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        request();
      });
      $('.persona-change-email').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        settings.persona.url = settings.basePath + 'user/persona/change-email';
        request();
      });
      $('.persona-logout').click(function (e) {
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
            url: settings.persona.url,
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
          // Only sign out from the website if it is already signed in. This
          // prevents unnecessary sign out requests when verification fails.
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
