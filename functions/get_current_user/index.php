<?php
const LEXIANG_AUTH_URL = "https://lexiangla.net/connect/oauth2/authorize";

function main($event, $context) {
    $uri_query = http_build_query([
        'company_id' => $event->queryStringParameters->company_id,
        'suite_id' => 'bec9873c53dc11eb93b2be80f293bd92',
        'redirect_uri' => 'https://today.lexiangla.net',
        'response_type' => 'code',
        'scope' => 'snsapi_base',
        'state' => random_bytes(16),
    ]);
    return response(401, ['login_url' => LEXIANG_AUTH_URL . "?" . $uri_query]);
}

function response($code, $data) {
    return [
        'code' => $code,
        'data' => $data
    ];
}