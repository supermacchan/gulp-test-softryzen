<?php

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);
echo checkEmail($input['email']);


function checkEmail($email)
{
  if (isset($email)) {
    $domain = substr(strrchr($email, "@"), 1);

    function mxRecordValidate($email, $domain)
    {
      $arr = dns_get_record($domain, DNS_MX);
      if ($arr[0]['host'] == $domain && !empty($arr[0]['target'])) {
        return $arr[0]['target'];
      }
    }

    if (mxRecordValidate($email, $domain)) {
      $data = dns_get_record($domain, DNS_MX);

      return json_encode([
        'status' => 'ok',
        'response' => $data
      ]);
    } else {
      return json_encode([
        'status' => 'error',
        'response' => 'This MX records does not exists. Invalid Email Address.'
      ]);
    }
  }
}
