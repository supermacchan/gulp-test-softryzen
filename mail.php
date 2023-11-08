<?php

// Файлы phpmailer
require 'phpmailer/PHPMailer.php';
require 'phpmailer/Exception.php';

// Переменные, которые отправляет пользователь
$title = $_POST['emailTitle'];
$recipient = $_POST['emailRecipient'];
$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$message = $_POST['message'];
$file_tmp  = $_FILES['file']['tmp_name'];
$file_name = $_FILES['file']['name'];

// Логирование запроса в mail.log
logRequest($_POST);

// Формирование самого письма
$body = "Name: $name \nPhone: $phone \nEmail: $email \nMessage: $message";

// Настройки PHPMailer
$mail = new PHPMailer\PHPMailer\PHPMailer();
$mail->CharSet = 'UTF-8';

try {
  $mail->From = $email;
  $mail->FromName = $name;

  // Получатель письма
  $mail->addAddress($recipient);

  // Прикрипление файла к письму
  $mail->AddAttachment($file_tmp, $file_name);

  // Отправка сообщения
  $mail->isHTML(false);
  $mail->Subject = $title;
  $mail->Body = $body;

  // Проверяем отравленность сообщения
  if ($mail->send()) {
    $result = 'success';
  } else {
    $result = 'error';
  }
} catch (Exception $e) {
  $result = 'error';
  $status = "The message was not sent. The reason for the error: {$mail->ErrorInfo}";
}

$mail->ClearAddresses();
$mail->clearAttachments();

// Отображение результата
echo json_encode(['result' => $result, 'resultfile' => $rfile, 'status' => $status]);

function logRequest($request)
{
  $file = fopen('mail.log', 'a+');
  $date = date(DATE_RFC822);

  $string = [
    'date' => $date,
    'input' => $request,
  ];
  fwrite($file, json_encode($string, JSON_UNESCAPED_UNICODE) . ',');
  fclose($file);
}
