This module enables users to sign in with Mozilla Persona. For full information
see http://drupal.org/project/persona.

Persona depends on Session API (http://drupal.org/project/session_api). It uses
it to generate a security token to prevent cross-site request forgery (XSRF).

There is a bug in Session API which prevents users from signing in with Persona
the very first time they visit a page on the site. To fix this problem Session
API needs to be patched. See http://drupal.org/node/1925962 for more
information.
