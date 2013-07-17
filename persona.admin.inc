<?php
/**
 * @file
 * Admin form to change Persona settings.
 */

/**
 * Generates preview button for admin form.
 */
function persona_admin_form_button_preview($style = NULL) {
  return array(
    '#theme' => 'persona_button',
    '#type' => 'preview',
    '#style' => $style,
    '#attributes' => array('id' => 'button-preview'),
  );
}

/**
 * AJAX callback to generate preview button for admin form.
 */
function persona_admin_form_button_preview_callback(array $form, array $form_state) {
  return persona_admin_form_button_preview($form_state['values']['persona_button_style']);
}

/**
 * Generates admin form.
 */
function persona_admin_form(array $form) {
  $form = array();
  // General settings.
  $form['general'] = array(
    '#type' => 'fieldset',
    '#title' => t("General"),
  );
  $form['general']['persona_takeover'] = array(
    '#type' => 'checkbox',
    '#title' => t("Set Persona as the only sign in method"),
    '#default_value' => variable_get('persona_takeover', NULL),
    '#description' => t("It will only be possible to register or sign in with !link.<br />Email and password fields will not be present on account edit pages.",
      array('!link' => l("Mozilla Persona", 'http://www.mozilla.org/en-US/persona/',
        array('attributes' => array('target' => '_blank'))))),
  );
  $form['general']['persona_email_usernames'] = array(
    '#type' => 'checkbox',
    '#title' => t("Use email addresses as usernames"),
    '#default_value' => variable_get('persona_email_usernames', NULL),
    '#description' => t("When Persona is used to register a new account or change an existing account's email, the username will be set to the email address used.<br />If this option is not enabled, the username part of the email address will be used when registering.<br />When using this option with Persona as the only sign in method, it is useful to disable permission \"change own username\"."),
  );
  $form['general']['persona_new_account_edit'] = array(
    '#type' => 'checkbox',
    '#title' => t("Redirect to account edit page when user signs in for the first time"),
    '#default_value' => variable_get('persona_new_account_edit', NULL),
    '#description' => t("When the form is submitted the user will be redirected back to the page where they signed in."),
  );
  $form['general']['persona_improve_frontend'] = array(
    '#type' => 'checkbox',
    '#title' => t("Improve frontend performance when not signed in"),
    '#default_value' => variable_get('persona_improve_frontend', NULL),
    '#description' => t("For anonymous users, the login.persona.org JavaScript shiv will not be added to pages where there is no sign in button.<br />This means that for browsers that don't support navigator.id natively, automatic sign in cannot occur on these pages."),
  );
  // Button settings.
  $form['buttons'] = array(
    '#type' => 'fieldset',
    '#title' => t("Buttons"),
  );
  $form['buttons']['persona_button_style'] = array(
    '#type' => 'select',
    '#title' => t("Style"),
    '#default_value' => variable_get('persona_button_style', NULL),
    '#options' => array(
      'button' => t("Button"),
      'persona' => t("Persona"),
      'form' => t("Form"),
    ),
    '#ajax' => array(
      'callback' => 'persona_admin_form_button_preview_callback',
      'wrapper' => 'button-preview',
      'effect' => 'fade',
      'progress' => array('type' => 'none'),
    ),
  );
  $form['buttons']['persona_style_preview'] = array(
    '#type' => 'item',
    '#title' => t("Preview"),
    'button' => persona_admin_form_button_preview(),
  );
  // Legal Document settings.
  $form['sign_in_dialog'] = array(
    '#type' => 'fieldset',
    '#title' => t("Sign in dialog"),
  );
  $form['sign_in_dialog']['persona_logo'] = array(
    '#type' => 'textfield',
    '#title' => t("Site Logo"),
    '#default_value' => variable_get('persona_logo', NULL),
    '#description' => t("Must be an absolute path, for example <em>/sites/default/files/logo.svg</em> .<br />Defaults to the theme's logo setting.<br />Only appears when the site is delivered over HTTPS."),
  );
  $form['sign_in_dialog']['persona_terms_link'] = array(
    '#type' => 'textfield',
    '#title' => t("Terms Of Service"),
    '#default_value' => variable_get('persona_terms_link', NULL),
    '#description' => t("Web page link in the form of a local path or an absolute URL.<br />Only appears when Privacy Policy is also provided."),
  );
  $form['sign_in_dialog']['persona_privacy_link'] = array(
    '#type' => 'textfield',
    '#title' => t("Privacy Policy"),
    '#default_value' => variable_get('persona_privacy_link', NULL),
    '#description' => t("Web page link in the form of a local path or an absolute URL.<br />Only appears when Terms Of Service is also provided."),
  );
  $form['#attached']['css'][] = drupal_get_path('module', 'persona') . '/css/persona.theme.css';
  // Turn it into a settings form. The page cache will be cleared automatically.
  $form = system_settings_form($form);
  // Make sure our submit handler is invoked.
  $form['#submit'][] = 'persona_admin_form_submit';
  return $form;
}

/**
 * Extra submit handler for admin form.
 */
function persona_admin_form_submit(array $form, array &$form_state) {
  // Make sure changes in persona_menu_alter() take effect.
  menu_rebuild();
}
