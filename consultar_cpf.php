<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$cpf = $_GET['cpf'] ?? null;
$token = "687eeeae24e56030ffe2aeef838d1f0e";

if (!$cpf) {
    echo json_encode(["error" => "CPF não informado"]);
    exit;
}

$url = "https://apela-api.tech/?user={$token}&cpf={$cpf}";

// Faz a requisição usando cURL
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

// Retorna o JSON da API direto para o front-end
echo $response;
