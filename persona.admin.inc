<?php
/**
 * @file
 * Displays and admin form to change Persona settings.
 */

/**
 * Implements hook_form_ID().
 */
function persona_admin_form($form, &$form_state){
  $form = array('#attributes' => array('enctype' => 'multipart/form-data'));

  $form['general_settings'] = array(
    '#type' => 'fieldset',
    '#title' => t('General Settings'),
    '#collapsible' => TRUE,
  );

  $form['general_settings']['persona_takeover_login'] = array(
    '#type' => 'checkbox',
    '#title' => 'Set Persona as the only login method',
    '#default_value' => variable_get('persona_takeover_login'),
    '#description' => t('Users will still be able to register using the reg form.'),
  );

  $form['general_settings']['persona_allow_registration'] = array(
    '#type' => 'checkbox',
    '#title' => 'Allow users to register using Persona',
    '#default_value' => variable_get('persona_allow_registration'),
    '#description' => t('<b>WARNING:</b> If you allow users to register via Persona, they will bypass the standard reg form.<br />
                         If you don\'t allow users to register via Persona, they will be taken to the standard reg form.'),
  );


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
    '#description' => t('<b>NOTE:</b> Will only show if "Allow users to register using Persona" is checked.'),
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

  $form['register_settings']['register_customize']['persona_register_error_message'] = array(
    '#type' => 'textfield',
    '#title' => t('Login error message'),
    '#default_value' => variable_get('persona_register_error_message'),
    '#description' => t('This error will be shown on the registration form when a user tries to login but does not have an account.'),
  );

  return system_settings_form($form);
}

/**
 * Implements hook_FORM_ID_validate().
 */
function persona_admin_form_validate($form, &$form_state){
  $v = $form_state['values'];
  // Make sure buttons have text.
  if(empty($v['persona_login_button_text'])){
    form_set_error('persona_login_button_text', t("Please enter some text for your login button"));
  }
  if(empty($v['persona_register_button_text'])){
    form_set_error('persona_register_button_text', t("Please enter some text for your register button"));
  }
  // Need to check and see if the admin has disabled the login button, but enabled the takeover.
  if($v['persona_takeover_login'] && !($v['persona_login_display'] || $v['persona_login_block_display'])){
    form_set_error('persona_login_display', t("To use Persona as the only login method, it must be shown on the login form, or block."));
  }
}
