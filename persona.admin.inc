<?php
/**
 * @file
 *   persona.admin.inc
 */

/**
 * Implements hook_form_ID().
 */
function persona_admin_form($form, &$form_state) {
  $form = array();

  // Login form settings.
  $form['login_settings'] = array(
    '#type' => 'fieldset',
    '#title' => t('Persona Login Form Settings'),
    '#collapsible' => TRUE,
  );
  $form['login_settings']['persona_login_display'] = array(
    '#type' => 'checkbox',
    '#title' => t('Display on login form'),
    '#default_value' => variable_get('persona_login_display'),
  );
  $form['login_settings']['persona_login_block_display'] = array(
    '#type' => 'checkbox',
    '#title' => t('Display on login block'),
    '#default_value' => variable_get('persona_login_block_display'),
  );
  $form['login_settings']['login_customize'] = array(
    '#type' => 'item',
    '#title' => 'Customize the button',
  );
  $form['login_settings']['login_customize']['persona_login_button_style'] = array(
    '#prefix' => '<hr />',
    '#type' => 'select',
    '#title' => t('Select a style'),
    '#default_value' => variable_get('persona_login_button_style'),
    '#options' => array(
      '' => 'default',
      'dark' => 'Black',
      'blue' => 'Blue',
      'orange' => 'Red',
    ),
  );
  $form['login_settings']['login_customize']['persona_login_button_text'] = array(
    '#type' => 'textfield',
    '#title' => t('Button text'),
    '#default_value' => variable_get('persona_login_button_text'),
  );

  $form['login_settings']['login_customize']['person_button_preview'] = array(
    '#markup' => persona_link(),
  );

  // Registration form settings.
  $form['register_settings'] = array(
    '#type' => 'fieldset',
    '#title' => t('Persona Registration Form Settings'),
    '#collapsible' => TRUE,
  );
  $form['register_settings']['persona_register_display'] = array(
    '#type' => 'checkbox',
    '#title' => t('Display on registration form'),
    '#default_value' => variable_get('persona_register_display'),
  );
  $form['register_settings']['register_customize'] = array(
    '#type' => 'item',
    '#title' => 'Customize the button',
  );
  $form['register_settings']['register_customize']['persona_register_button_style'] = array(
    '#prefix' => '<hr />',
    '#type' => 'select',
    '#title' => t('Select a style'),
    '#default_value' => variable_get('persona_register_button_style'),
    '#options' => array(
      '' => 'default',
      'dark' => 'Black',
      'blue' => 'Blue',
      'orange' => 'Red',
    ),
  );
  $form['register_settings']['register_customize']['persona_register_button_text'] = array(
    '#type' => 'textfield',
    '#title' => t('Button text'),
    '#default_value' => variable_get('persona_register_button_text'),
  );
  $form['register_settings']['register_customize']['person_button_preview'] = array(
    '#markup' => persona_link('register'),
  );

  return system_settings_form($form);
}

function persona_admin_form_validate($form, &$form_state) {
  $v = $form_state['values'];
  if (empty($v['persona_login_button_text'])) {
    form_set_error('persona_login_button_text', t("Please enter some text for your login button"));
  }
  if (empty($v['persona_register_button_text'])) {
    form_set_error('persona_register_button_text', t("Please enter some text for your register button"));
  }
}