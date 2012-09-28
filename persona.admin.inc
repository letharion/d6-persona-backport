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