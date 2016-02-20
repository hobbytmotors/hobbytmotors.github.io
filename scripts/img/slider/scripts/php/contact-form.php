<?php
function died($error)
{
    $message= "We are sorry, but your message was not send successfully.";
    $message.= "The following mistakes were made:<br /><br />";
    $message.= $error . "<br /><br />";
    $message.= "Please try again.<br /><br />";
}

if (isset($_POST['submit'])) {
    $error_message = "";
    
        $sender = trim($_POST['name']);
        $subject = trim($_POST['subject']);
        $headers[] = "Subject:" .  $subject;
        $message ="From: ".$sender."\r\n"."Subject: ".$subject."\r\n";

    if (filter_var( $_POST['email'], FILTER_VALIDATE_EMAIL ) ) {
        $senderEmail = trim($_POST['email']);
        $headers[] = "Reply-To:" . $senderEmail;
    } else {
        $error_message .= 'Your email is incorrect <br/>';
    }

    if (strlen($_POST['message'])>3) {
        $message =$message.("\r\n". trim($_POST['message']));
        $message = wordwrap($message, 70, "\r\n");
    } else {
        $error_message .= 'Your message should be longer than 2 symbols.<br/>';
    }

    if (strlen($error_message) > 0) {
        died($error_message);
    }

    $to = "l_yanev@abv.bg";
    mail($to, "Hobbyt-site", $message, implode("\r\n", $headers));
    $message ="<h1>Your message was send succesfully. </h1>
              <h1>Thank you for contacting us.</h1>
              <p>You will be redirected to the page in 3 seconds.</p>";
}
?>

<!DOCTYPE html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <title>Hobbyt</title>
        <script type="text/javascript">
            function delayer(){
                window.location = "http://hobbytmotors.eu/"
            }
        </script>
    </head>
    <body  onLoad="setTimeout('delayer()', 3500)">
        <?php
        echo $message;
        ?>
    </body>
</html>