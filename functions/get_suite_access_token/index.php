<?php
include "./vendor/autoload.php";
const SUITE_ID = "bec9873c53dc11eb93b2be80f293bd92";
const SUITE_SECRET = "19D2IhpCk9jKgNZO9F32zbfEflcatAQ7LN1suBsi";
const REDIS_HOST = "192.168.2.49";
const REDIS_PASSWORD = 'edRDs41a9Xhf0ghu';
function main($event, $context) {
    $redis = new Redis();
    $redis->connect(REDIS_HOST);
    $redis->auth(REDIS_PASSWORD);
    if ($suite_access_token = $redis->get('suite_access_token')) {
        return $suite_access_token;
    }

    $suite_ticket = $redis->get('suite_ticket');
    $options = ['form_params' => [
        'grant_type' => 'client_credentials',
        'suite_id' => SUITE_ID,
        'suite_secret' => SUITE_SECRET,
        'suite_ticket' => $suite_ticket
    ]];

    $client = new \GuzzleHttp\Client();
    $response = $client->post('https://lxapi.lexiangla.net/cgi-bin/service/get_suite_token', $options);
    $response = json_decode($response->getBody()->getContents(), true);
    $suite_access_token = $response['suite_access_token'];

    $redis->setex('suite_access_token', 1200, $suite_access_token);
    return $suite_access_token;
}
?>
