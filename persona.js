(function($){
  
  Drupal.persona = {}
  
  Drupal.behaviors.persona = {
    attach:function(){
      $('.persona-login').click(function(e){
        e.preventDefault();
        e.stopPropagation();
        navigator.id.request();
      });
      $('.persona-logout, a[href="/user/logout"]').click(function(e){
        e.preventDefault();
        e.stopPropagation();
        navigator.id.logout();
      });
      Drupal.persona.watch();
    }
  }
  
  Drupal.persona.watch = function(){
    navigator.id.watch({
      loggedInUser: Drupal.settings.persona.user.mail,
      onlogin: function(assertion) {
        $.ajax({
          type: 'POST',
          url: '/persona/verify',
          data: {
            assertion: assertion
          },
          success: function(res, status, xhr) {
            window.location.reload();
            console.log(res);
          },
          error: function(res, status, xhr) {
            console.log(res);
          }
        });
      },
      onlogout: function() {
        window.location = '/user/logout';
      }
    });   
  }
 
 
  
}(jQuery));