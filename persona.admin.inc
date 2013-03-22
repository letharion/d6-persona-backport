<?php
/**
 * @file
 * Displays and admin form to change Persona settings.
 */

/**
 * Implements hook_form_ID().
 */
function persona_admin_form(array $form, array &$form_state) {
  $form = array();
  // General settings.
  $form['general'] = array(
    '#type' => 'fieldset',
    '#title' => t("General"),
  );
  $form['general']['persona_takeover_login'] = array(
    '#type' => 'checkbox',
    '#title' => t("Set Persona as the only sign in method"),
    '#default_value' => variable_get('persona_takeover_login'),
    '#description' => t("It will only be possible to register or sign in with !link.<br />Email and password fields will not be present on account edit pages.",
      array('!link' => l("Mozilla Persona", 'http://www.mozilla.org/en-US/persona/',
        array('attributes' => array('target' => '_blank'))))),
  );
  $form['general']['persona_email_usernames'] = array(
    '#type' => 'checkbox',
    '#title' => t("Use email addresses as usernames"),
    '#default_value' => variable_get('persona_email_usernames'),
    '#description' => t("When Persona is used to register a new account, the username will be set to the email address used.<br />If this option is not enabled, the username part of the email address will be used as the account username when registering with Persona.<br />When using this option with Persona as the only sign in method, it is useful to disable permission \"change own username\"."),
  );
  $form['general']['persona_new_account_edit'] = array(
    '#type' => 'checkbox',
    '#title' => t("Redirect to account edit page when user signs in for the first time"),
    '#default_value' => variable_get('persona_new_account_edit'),
    '#description' => t("When the form is submitted the user will be redirected back to the page where they signed in."),
  );
  // Button settings.
  $form['buttons'] = array(
    '#type' => 'fieldset',
    '#title' => t("Buttons"),
  );
  $form['buttons']['persona_button_style'] = array(
    '#type' => 'select',
    '#title' => t("Style"),
    '#default_value' => variable_get('persona_button_style'),
    '#options' => array(
      '' => t("None"),
      'orange' => t("Orange"),
      'blue' => t("Blue"),
      'dark' => t("Dark"),
    ),
  );
  $form['buttons']['persona_button_text_sign_in'] = array(
    '#type' => 'textfield',
    '#title' => t("Sign In Button Text"),
    '#default_value' => variable_get('persona_button_text_sign_in'),
    '#required' => TRUE,
  );
  $form['buttons']['persona_sign_in_button_preview'] = array(
    '#type' => 'item',
    '#title' => t("Sign In Button Preview"),
    '#markup' => persona_button(),
  );
  $form['buttons']['persona_button_text_change_email'] = array(
    '#type' => 'textfield',
    '#title' => t("Change Email Button Text"),
    '#default_value' => variable_get('persona_button_text_change_email'),
    '#required' => TRUE,
  );
  $form['buttons']['persona_change_email_button_preview'] = array(
    '#type' => 'item',
    '#title' => t("Change Email Button Preview"),
    '#markup' => persona_button(FALSE),
  );
  // Legal Document settings.
  $form['legal_docs'] = array(
    '#type' => 'fieldset',
    '#title' => t("Legal Documents"),
    '#description' => t("If links to <b>both</b> of these documents are provided, they will appear on the Persona sign in dialog."),
  );
  $form['legal_docs']['persona_terms_link'] = array(
    '#type' => 'textfield',
    '#title' => t("Terms Of Service"),
    '#default_value' => variable_get('persona_terms_link'),
    '#description' => "Link in the form of a local path or an absolute URL.",
  );
  $form['legal_docs']['persona_privacy_link'] = array(
    '#type' => 'textfield',
    '#title' => t("Privacy Policy"),
    '#default_value' => variable_get('persona_privacy_link'),
    '#description' => "Link in the form of a local path or an absolute URL.",
  );
  // Add JavaScript.
  $form['#attached']['js'][] = drupal_get_path('module', 'persona') . '/persona.admin.js';
  // Turn it into a settings form.
  $form = system_settings_form($form);
  // Make sure our submit handler is invoked.
  $form['#submit'][] = 'persona_admin_form_submit';
  return $form;
}

/**
 * Implements hook_FORM_ID_submit().
 */
function persona_admin_form_submit(array $form, array &$form_state) {
  // Make sure changes in persona_menu_alter() take effect.
  menu_rebuild();
}
