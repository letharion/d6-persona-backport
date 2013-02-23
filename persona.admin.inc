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
    '#description' => t("It will only be possible to sign in or register with !link.",
      array('!link' => l("Mozilla Persona", 'http://www.mozilla.org/en-US/persona/',
        array('attributes' => array('target' => '_blank'))))),
  );

  // Button settings.
  $form['button'] = array(
    '#type' => 'fieldset',
    '#title' => t("Sign in button"),
  );
  $form['button']['persona_login_button_style'] = array(
    '#type' => 'select',
    '#title' => t("Style"),
    '#default_value' => variable_get('persona_login_button_style'),
    '#options' => array(
      '' => t("None"),
      'dark' => t("Black"),
      'blue' => t("Blue"),
      'orange' => t("Red"),
    ),
  );
  $form['button']['persona_login_button_text'] = array(
    '#type' => 'textfield',
    '#title' => t("Text"),
    '#default_value' => variable_get('persona_login_button_text'),
  );
  $form['button']['person_button_preview'] = array(
    '#type' => 'item',
    '#title' => t("Preview"),
    '#markup' => persona_link(),
  );
  $form['button']['persona_login_display'] = array(
    '#type' => 'checkbox',
    '#title' => t('Display on login form'),
    '#default_value' => variable_get('persona_login_display'),
  );
  $form['button']['persona_login_block_display'] = array(
    '#type' => 'checkbox',
    '#title' => t('Display on login block'),
    '#default_value' => variable_get('persona_login_block_display'),
  );

  $form = system_settings_form($form);

  // Make sure our submit handler is invoked.
  $form['#submit'][] = 'persona_admin_form_submit';

  return $form;
}

/**
 * Implements hook_FORM_ID_validate().
 */
function persona_admin_form_validate(array $form, array &$form_state) {
  $v = $form_state['values'];
  // Make sure buttons have text.
  if (empty($v['persona_login_button_text'])) {
    form_set_error('persona_login_button_text', t("Please enter some text for your login button"));
  }
  // Need to check and see if the admin has disabled the login button,
  // but enabled the takeover.
  if ($v['persona_takeover_login'] && !($v['persona_login_display'] || $v['persona_login_block_display'])) {
    form_set_error('persona_login_display', t("To use Persona as the only login method, it must be shown on the login form, or block."));
  }
}

/**
 * Implements hook_FORM_ID_submit().
 */
function persona_admin_form_submit(array $form, array &$form_state) {
  // Make sure changes in persona_menu_alter() take effect.
  menu_rebuild();
}
