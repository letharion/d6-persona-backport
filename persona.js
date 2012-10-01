(function($) {

  Drupal.persona = {}

  Drupal.behaviors.persona = {
    attach:function() {
      $('.persona-login').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        navigator.id.request({
          siteName:Drupal.settings.persona.site.name,
          siteLogo:Drupal.settings.persona.site.logo
        });
      });
      $('.persona-logout, a[href$="user/logout"], a[href$="index.php?q=user/logout"]').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        navigator.id.logout();
        window.location = "/user/logout";
      });
      Drupal.persona.watch();
      Drupal.persona.adminFormEnhance();
    }
  }

  /**
   * Enhances the admin form with live style updates.
   */
  Drupal.persona.adminFormEnhance = function() {
    if($('#persona-admin-form').length < 1) {
      // Not on the admin form.
      return false;
    }
    var login_button = $('#edit-login-customize .persona-login');
    var reg_button = $('#edit-register-customize .persona-login');
    $('#edit-persona-login-button-style').change(function(e) {
      login_button.removeClass("dark orange persona-button");
      if($(this).val()) {
        var button = "persona-button ";
      }
      login_button.addClass(button + $(this).val());
    });
    $('#edit-persona-login-button-text').keyup(function(e) {
      login_button.children('span').text($(this).val());
    });
    $('#edit-persona-register-button-style').change(function(e) {
      reg_button.removeClass("dark orange persona-button");
      if($(this).val()) {
        var button = "persona-button ";
      }
      reg_button.addClass(button + $(this).val());
    });
    $('#edit-persona-register-button-text').keyup(function(e) {
      reg_button.children('span').text($(this).val());
    });
  }

  Drupal.persona.watch = function() {
    navigator.id.watch({
      loggedInUser:Drupal.settings.persona.user.mail,
      onlogin:function(assertion) {
        $.ajax({
          type:'POST',
          url:'index.php?q=persona/verify',
          data:{
            assertion:assertion,
            token:Drupal.settings.persona.token
          },
          dataType:"json",
          success:function(res, status, xhr) {
            Drupal.persona.handleLogin(res);
          }
        });
      },
      onlogout:function() {
        $.ajax({
          type:'POST',
          url:'index.php?q=persona/logout'
        });
      }
    });
  }

  Drupal.persona.handleLogin = function(res) {
    if(res.status === "okay") {
      // User should now be logged in, just refresh the page.
      window.location.reload();
    }else if(res.status === "error") {
      navigator.id.logout();
      if(res.response === "needs to register") {
        window.location = Drupal.settings.basePath + "user/register";
      }
      if(res.response === "access denied") {
        window.location.reload();
      }
    }
  }


}(jQuery));
