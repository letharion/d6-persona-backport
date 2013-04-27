<?php
/**
 * @file
 * Admin form to change Persona settings.
 */

/**
 * Generates admin form.
 */
function persona_admin_form(array $form, array &$form_state) {
  $form = array();
  // General settings.
  $form['general'] = array(
    '#type' => 'fieldset',
    '#title' => t("General"),
  );
  $form['general']['persona_takeover'] = array(
    '#type' => 'checkbox',
    '#title' => t("Set Persona as the only sign in method"),
    '#default_value' => variable_get('persona_takeover'),
    '#description' => t("It will only be possible to register or sign in with !link.<br />Email and password fields will not be present on account edit pages.",
      array('!link' => l("Mozilla Persona", 'http://www.mozilla.org/en-US/persona/',
        array('attributes' => array('target' => '_blank'))))),
  );
  $form['general']['persona_email_usernames'] = array(
    '#type' => 'checkbox',
    '#title' => t("Use email addresses as usernames"),
    '#default_value' => variable_get('persona_email_usernames'),
    '#description' => t("When Persona is used to register a new account or change an existing account's email, the username will be set to the email address used.<br />If this option is not enabled, the username part of the email address will be used when registering.<br />When using this option with Persona as the only sign in method, it is useful to disable permission \"change own username\"."),
  );
  $form['general']['persona_new_account_edit'] = array(
    '#type' => 'checkbox',
    '#title' => t("Redirect to account edit page when user signs in for the first time"),
    '#default_value' => variable_get('persona_new_account_edit'),
    '#description' => t("When the form is submitted the user will be redirected back to the page where they signed in."),
  );
  $form['general']['persona_improve_frontend'] = array(
    '#type' => 'checkbox',
    '#title' => t("Improve frontend performance when not signed in"),
    '#default_value' => variable_get('persona_improve_frontend'),
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
    '#default_value' => variable_get('persona_button_style'),
    '#options' => array(
      'none' => t("None"),
      'persona' => t("Persona"),
    ),
  );
  $form['buttons']['persona_style_preview'] = array(
    '#type' => 'item',
    '#title' => t("Preview"),
    '#markup' => theme('persona_button', array('type' => 'sign-in')),
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
