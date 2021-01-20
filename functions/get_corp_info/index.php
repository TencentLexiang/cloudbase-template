<?php
include "./vendor/autoload.php";
function main($event, $context) {

    $client = new \GuzzleHttp\Client();
    $response = $client->request('POST', "https://lxapi.lexiangla.net/cgi-bin/service/get_corp_info?suite_access_token=$event->suite_access_token", [
        'json' => ['auth_code' => $event->auth_code],
    ]);
    return json_decode($response->getBody()->getContents(), true);
}
?>
