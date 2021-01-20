<?php
include "./vendor/autoload.php";
function main($event, $context) {
    $environment = json_decode($context->environment);

    $redis = new Redis();
    $redis->connect($environment->REDIS_HOST);
    $redis->auth($environment->REDIS_PASSWORD);
    if ($suite_access_token = $redis->get('suite_access_token')) {
        return $suite_access_token;
    }

    $suite_ticket = $redis->get('suite_ticket');
    $options = ['form_params' => [
        'grant_type' => 'client_credentials',
        'suite_id' => $environment->SUITE_ID,
        'suite_secret' => $environment->SUITE_SECRET,
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
