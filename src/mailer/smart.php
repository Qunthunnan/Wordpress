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
    $mail->Username   = 'bredtv6@gmail.com';                  //SMTP username
    $mail->Password   = 'icrzibusutqzncly';                          //SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;          //Enable implicit TLS encryption
    $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

    //Recipients
    $mail->setFrom('bredtv6@gmail.com', 'Wordpress');
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
    $mail->Body    = '<table width="512" align="center" style="padding: 30px; border-radius: 30px; font-family: Roboto, Helvetica, Arial, Verdana; height: 100%; background: #3e1f1a no-repeat;
    background: linear-gradient(61deg, rgba(80,82,81,1) 0%, rgba(62,31,26,1) 100%) no-repeat;">
    <tbody>
        <tr>
            <td>
                <img src="https://i.imgur.com/pXxvv6z.png" alt="logo">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <h1 style="color: #f9bf3b; font-size: 30px; font-weight: 700; text-transform: uppercase;">Дякую, що записались!</h1>
                            <table>
                            <tbody>
                            <tr>
                            <td>
                                <h2 style="color: white; font-size: 20px; font-weight: 700; text-transform: uppercase;">'. $name .', посилання на вебінар ' . $lessonDate . ' в мене немає, як і самого вебінару😊</h2>
                            </td>
                            <tr>
                                <table>
                                    <tbody>
                                            <tr>
                                                <td>
                                                    <h3 style="color: white; font-size: 18px; font-weight: 500;">Але, є де що <b style="font-weight: 700; color: #f9bf3b; font-size: 23px;">цікавіше…</b></h3>
                                                        <table>
                                                            <tbody>
                                                                <tr>
                                                                    <td width = "80%">
                                                                        <p style="color: white; font-size: 18px; font-weight: 300; line-height: 27px; margin-bottom: 27px;">Є ще кілька демо-проєктів, які демонструють мої навички. Подивіться на них у моєму <a target="_blank" style="background-color: #f9bf3b; color: white; font-weight: 700; border-radius: 30px; padding: 2px 7px 6px 7px; text-decoration: none; " href="https://www.google.com/" data-saferedirecturl="https://www.google.com/url?q=https://www.google.com/">портфоліо</a></p>
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
        @font-face {
            font-family: "Roboto";
            src: url("../fonts/RobotoThin.eot");
            src: url("../fonts/RobotoThin.eot")format("embedded-opentype"),
            url("../fonts/RobotoThin.woff") format("woff"),
            url("../fonts/RobotoThin.ttf") format("truetype");
            font-weight: 100;
        }
        @font-face {
            font-family: "Roboto";
            src: url("../fonts/RobotoLight.eot");
            src: url("../fonts/RobotoLight.eot")format("embedded-opentype"),
            url("../fonts/RobotoLight.woff") format("woff"),
            url("../fonts/RobotoLight.ttf") format("truetype");
            font-weight: 300;
        }
        @font-face {
            font-family: "Roboto";
            src: url("../fonts/RobotoRegular.eot");
            src: url("../fonts/RobotoRegular.eot")format("embedded-opentype"),
            url("../fonts/RobotoRegular.woff") format("woff"),
            url("../fonts/RobotoRegular.ttf") format("truetype");
            font-weight: 400;
        }
        @font-face {
            font-family: "Roboto";
            src: url("../fonts/RobotoMedium.eot");
            src: url("../fonts/RobotoMedium.eot")format("embedded-opentype"),
            url("../fonts/RobotoMedium.woff") format("woff"),
            url("../fonts/RobotoMedium.ttf") format("truetype");
            font-weight: 500;
        }
        @font-face {
            font-family: "Roboto";
            src: url("../fonts/RobotoBold.eot");
            src: url("../fonts/RobotoBold.eot")format("embedded-opentype"),
            url("../fonts/RobotoBold.woff") format("woff"),
            url("../fonts/RobotoBold.ttf") format("truetype");
            font-weight: 700;
        }
        @font-face {
            font-family: "Roboto";
            src: url("../fonts/RobotoBlack.eot");
            src: url("../fonts/RobotoBlack.eot")format("embedded-opentype"),
            url("../fonts/RobotoBlack.woff") format("woff"),
            url("../fonts/RobotoBlack.ttf") format("truetype");
            font-weight: 900;
        }
    
        @font-face {
            font-family: "Roboto Condensed";
            src: url("../fonts/RobotoCondensedRegular.eot");
            src: url("../fonts/RobotoCondensedRegular.eot")format("embedded-opentype"),
            url("../fonts/RobotoCondensedRegular.woff") format("woff"),
            url("../fonts/RobotoCondensedRegular.ttf") format("truetype");
            font-weight: 400;
        }
        </style>';

    // $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

    $mail->send();
    echo 'Message has been sent';

    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
} else {
    echo "Invalid JSON data";
}