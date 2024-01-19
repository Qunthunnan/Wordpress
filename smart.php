<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer/PHPMailer.php';
require 'PHPMailer/PHPMailer/SMTP.php';

include 'secrets.php';

// Функція для отримання IP-адреси користувача
function getUserIP() {
    $ip = $_SERVER['REMOTE_ADDR'];
    if (array_key_exists('HTTP_X_FORWARDED_FOR', $_SERVER)) {
        $ip = array_pop(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']));
    }
    return $ip;
}

// Збереження даних в файл users.json
function saveUsersData($data) {
    $file = '../users/users.json';
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
}

// Отримання кількості відправлених POST запитів за останню хвилину
function getRequestsCountLastMinute($usersData) {
    $count = 0;
    foreach ($usersData as $value) {
        if (time() - $value['timestamp'] <= 60) {
            $count++;
        }
    }
    return $count;
}

function getRequestsCountLastDay($usersData) {
    $count = 0;
    foreach ($usersData as $value) {
        if (time() - $value['timestamp'] <= 86400) {
            $count++;
        }
    }
    return $count;
}

function getRequestsCountByIp($ip, $usersData) {
    $count = 0;
    foreach ($usersData as $userData) {
        if ($userData['ip'] === $ip) {
            $count++;
        }
    }
    return $count;
}

function sendMail($messageBody, $subject, $email, $secrets) {
    try {
        $mail = new PHPMailer(true);
        $mail->CharSet = 'UTF-8';
        $mail->SMTPDebug = SMTP::DEBUG_SERVER;
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = $secrets->mails[0];
        $mail->Password   = $secrets->passwords[0];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;

        $mail->setFrom($secrets->mails[0], 'Wordpress');
        $mail->addAddress(''. $email .'');

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $messageBody;
        $mail->send();
        echo 'Message has been sent';
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}

$data = file_get_contents("php://input");
$jsonData = json_decode($data, true);
$lang = '';


if (isset($jsonData['name'], $jsonData['email'], $jsonData['lessonDate'], $jsonData['lang'])) {
    $userData = [
        "name" => $jsonData['name'],
        "email" => $jsonData['email'],
        "lessonDate" => $jsonData['lessonDate'],
        "ip" => getUserIP()
    ];
    
    $lang = $jsonData['lang'];

    $file = '../users/users.json';
    $usersData = [];
    if (file_exists($file)) {
        $data = file_get_contents($file);
        $usersData = json_decode($data, true);
    }


    $lessonMailBody = [
        'uk' => '<table width="512" align="center" style="padding: 30px; border-radius: 30px; font-family: Roboto, Helvetica, Arial, Verdana; height: 100%; background: #3e1f1a no-repeat;
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
                                    <h2 style="color: white; font-size: 20px; font-weight: 700; text-transform: uppercase;">'. $userData["name"] .', посилання на вебінар ' . $userData["lessonDate"] . ' в мене немає, як і самого вебінару😊</h2>
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
            </style>'

            ,

            'en' => '<table width="512" align="center" style="padding: 30px; border-radius: 30px; font-family: Roboto, Helvetica, Arial, Verdana; height: 100%; background: #3e1f1a no-repeat ;
            background: linear-gradient(61deg, rgba(80,82,81,1) 0%, rgba(62,31,26,1) 100%) no-repeat;">
            <tbody>
                <tr>
                    <td>
                        <img src="https://i.imgur.com/pXxvv6z.png" alt="logo">
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <h1 style="color: #f9bf3b; font-size: 30px; font-weight: 700; text-transform: uppercase;">Thank you for signing up!</h1>
                                    <table>
                                    <tbody>
                                    <tr>
                                    <td>
                                        <h2 style="color: white; font-size: 20px; font-weight: 700; text-transform: uppercase;">'. $userData["name"] .', link to webinar ' . $userData["lessonDate"] . " I don't have it, just like the webinar itself😊".'</h2>
                                    </td>
                                    <tr>
                                        <table>
                                            <tbody>
                                                    <tr>
                                                        <td>
                                                            <h3 style="color: white; font-size: 18px; font-weight: 500;">But, there is something <b style="font-weight: 700; color: #f9bf3b; font-size: 23px; ">more interesting…</b></h3>
                                                                <table>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td width = "80%">
                                                                                <p style="color: white; font-size: 18px; font-weight: 300; line-height: 27px; margin-bottom: 27px;">There are a few more demo projects that showcase my skills. Check them out in my <a target="_blank" style="background-color: #f9bf3b; color: white; font-weight: 700; border-radius: 30px; padding: 2px 7px 6px 7px; text-decoration: none ; " href="https://www.google.com/" data-saferedirecturl="https://www.google.com/url?q=https://www.google.com/">portfolio</ a></p>
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
                </style>'
    ];


    $subject = [
        'en' => 'Link to the webinar!',
        'uk' => 'Посилання на вебінар!'
    ];

    $blockIpMailBody = [
        'en' => '<h1>Looks like the message has already been sent!</h1>
        <p>'. $userData["name"] .', I probably already received your message.</p>
        <p>If there is an error, you can contact me in a way convenient for you:</p>
        <p><a href="mailto:qunthunnan@gmail.com">qunthunnan@gmail.com</a>, <a href="https://t.me/Qunthunnan0">Telegram</a>, < a href="https://www.facebook.com/kirylo.bashkan">Facebook</a></p>'
        ,
        'uk' => '<h1>Схоже, повідомлення вже було відправлено!</h1>
        <p>'. $userData["name"] .', скоріше за все, я вже отримав ваше повідомлення.</p>
        <p>Якщо, виникла якась помилка, можете зв\'язатись зі мною зручним для вас способом:</p>
        <p><a href="mailto:qunthunnan@gmail.com">qunthunnan@gmail.com</a>, <a href="https://t.me/Qunthunnan0">Telegram</a>, <a href="https://www.facebook.com/kirylo.bashkan">Facebook</a></p>'
    ];

    $requestsLastDay = getRequestsCountLastDay($usersData);
    $warningMailBody = '<h1 style="color: red">!!УВАГА, НА СЕРВЕРІ СКОРІШЕ ЗА ВСЕ ВИЯВЛЕНО СПАМ!!</h1>
    <h2>Кількість відправлених повідомлень за останні 24 години:' . $requestsLastDay . '</h2>
    <h3>Рекомендую відключити поки mailer до з\'ясування обставин.</h3>';
    if($requestsLastDay == 30 || $requestsLastDay == 50 || $requestsLastDay == 70 || $requestsLastDay == 88) {
        echo 'Warning, spam possible!' . $requestsLastDay . ' was sended for last 24 hours';
        sendMail($warningMailBody, 'Warning!', $secrets->mails[0], $secrets);
    }

    if($requestsLastDay >= 90) {
        echo 'Error, spam detected!';
    } else {
        $requestsLastMinute = getRequestsCountLastMinute($usersData);
        if ($requestsLastMinute >= 1) {
            echo 'Error: Bandwidth limit reached, please try again later';
        } else {
            $requestsByIp = getRequestsCountByIp($userData["ip"], $usersData);
            if ($requestsByIp > 5) {
                echo 'Error: To many requests from your IP';
            } else {
                if($requestsByIp == 5) {
                    echo 'Block ip for security reasons.';
                    sendMail($blockIpMailBody[$lang], 'Your mail has been sended', $userData['email'], $secrets);
                    $usersData[] = [
                        'ip' => $userData["ip"],
                        'email' => $userData["email"],
                        'timestamp' => time(),
                        'timeDate' => date("d-m-Y H:i:s"),
                    ];
                    saveUsersData($usersData);
                } else {
                    sendMail($lessonMailBody[$lang], $subject[$lang], $userData['email'], $secrets);
                    $usersData[] = [
                        'ip' => $userData["ip"],
                        'email' => $userData["email"],
                        'timestamp' => time(),
                        'timeDate' => date("d-m-Y H:i:s"),
                    ];
                    saveUsersData($usersData);
                }
            }
        }
    }
} else {
    echo "Invalid JSON data";
}
?>