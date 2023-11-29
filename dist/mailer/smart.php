<?php
//Import PHPMailer classes into the global namespace
//These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer/PHPMailer.php';
require 'PHPMailer/PHPMailer/SMTP.php';

$name = $_POST['name'];
$email = $_POST['email'];
$lessonDate = $_POST['lessonDate'];

//Load Composer's autoloader

//Create an instance; passing `true` enables exceptions
$mail = new PHPMailer(true);

$data = file_get_contents("php://input");
$jsonData = json_decode($data, true);

if(isset($jsonData['name'], $jsonData['email'], $jsonData['lessonDate'])) {
    $name = $jsonData['name'];
    $email = $jsonData['email'];
    $lessonDate = $jsonData['lessonDate'];


try {
        
    //Server settings
    $mail->CharSet = 'UTF-8';
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
    $mail->isSMTP();                                            //Send using SMTP
    $mail->Host       = 'smtp.gmail.com';                     //Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
    $mail->Username   = 'qunthunnan@gmail.com';                  //SMTP username
    $mail->Password   = 'pcqv tqbs tdjk tevc';                          //SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;          //Enable implicit TLS encryption
    $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

    //Recipients
    $mail->setFrom('qunthunnan@gmail.com', 'Wordpress');
    $mail->addAddress(''. $email .'');     //Add a recipient
    // $mail->addAddress('ellen@example.com');               //Name is optional
    // $mail->addReplyTo('info@example.com', 'Information');
    // $mail->addCC('cc@example.com');
    // $mail->addBCC('bcc@example.com');

    //Attachments
    //$mail->addAttachment('/var/tmp/file.tar.gz');         //Add attachments
    //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    //Optional name

    //Content
    $mail->isHTML(true);                                  //Set email format to HTML
    $mail->Subject = 'Посилання на вебінар';
    $mail->Body    = '<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <table width="512" align="center" style="padding: 30px; border-radius: 30px; font-family: Roboto, Helvetica, Arial, Verdana; height: 100%; background: #3e1f1a no-repeat;
        background: linear-gradient(61deg, rgba(80,82,81,1) 0%, rgba(62,31,26,1) 100%) no-repeat;">
        <tbody>
            <tr>
                <td>
                    <img src="https://i.imgur.com/pXxvv6z.png" alt="logo">
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <h1 style="margin-top: 20px; color: #f9bf3b; font-size: 30px; font-weight: 700; text-transform: uppercase;">Дякую, що записались!</h1>
                                <table>
                                <tbody>
                                <tr>
                                <td>
                                    <h2 style="margin-top: 20px; color: white; font-size: 20px; font-weight: 700; text-transform: uppercase;">'. $name .', посилання на вебінар ' . $lessonDate . ' в мене немає, як і самого вебінару😊</h2>
                                </td>
                                <tr>
                                    <table>
                                        <tbody>
                                                <tr>
                                                    <td>
                                                        <h3 style="margin-top: 20px; color: white; font-size: 18px; font-weight: 500;">Але, є де що <b style="font-weight: 700; color: #f9bf3b; font-size: 23px;">цікавіше…</b></h3>
                                                            <table>
                                                                <tbody>
                                                                    <tr>
                                                                        <td width = "80%">
                                                                            <p style="margin-top: 20px; margin-bottom: 27px; color: white; font-size: 18px; font-weight: 300; line-height: 27px; margin-bottom: 27px;">Є ще кілька демо-проєктів, які демонструють мої навички. Подивіться на них у моєму <a target="_blank" style="background-color: #f9bf3b; color: white; font-weight: 700; border-radius: 30px; padding: 2px 7px 6px 7px; text-decoration: none; " href="https://kyrylofolio.pro/" data-saferedirecturl="https://www.google.com/url?q=https://kyrylofolio.pro/">портфоліо</a></p>
                                                                            <table>
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td><a target="_blank" style="text-decoration: none; color: white; font-weight: 100; padding: 5px;" href="https://github.com/Qunthunnan" ><img src="https://imgur.com/FxwlBTG.png" alt="github"> Github</a></td>
            
                                                                                        <td><a target="_blank" style="text-decoration: none; color: white; font-weight: 100; padding: 5px;" href="https://t.me/Qunthunnan0"><img src="https://imgur.com/ZKbEcYw.png" alt="telegram"> Telegram</a>
                                                                                        </td>
            
                                                                                        <td>                
                                                                                            <a target="_blank" style="text-decoration: none; color: white; font-weight: 100; padding: 5px;" href="https://www.facebook.com/kirylo.bashkan"><img src="https://imgur.com/viZGOHG.png" alt="facebook"> Facebook</a>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                        <td>
                                                                        
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                    </td>
                                                </tr>
                                        </tbody>
                                        </table>
                                </tr>
    
                                </tr>
                            </tbody>
                            </table>
                            </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
        </table>
            <style>
            *{
                margin: 0px;
                padding: 0px;
            }
            
            @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap");
            </style>
    </body>
    </html>';

    // $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

    $mail->send();
    echo 'Message has been sent';

    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
} else {
    echo "Invalid JSON data";
}