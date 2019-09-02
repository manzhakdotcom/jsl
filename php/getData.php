<?php

header('Content-Type:application/json;charset=UTF-8');

$config = require __DIR__ . '/config.php';

$pdo = new PDO($config['driver'] . ':host=' . $config['host'] . ';dbname=' . $config['dbname'] . ';charset=utf8', $config['user'], $config['password']);

$table = (isset($_GET['table']) && trim($_GET['table'] !== '')) ? $_GET['table'] : null;
$param = (isset($_GET['param']) && trim($_GET['param'] !== '')) ? $_GET['param'] : null;

if(is_null($table)) {
    echo json_encode(array('error' => 'Нужно задать название таблицы БД.'));
    exit();
}

if($table !== 'kp' && $table !== 'ts') {
    echo json_encode(array('error' => 'Скрипт работает только с таблицами ts и kp.'));
    exit();
}

if (is_null($param)) {
    $sth = $pdo->prepare('select id, sign from ' . $table . ' where typertu_id > 0');
} else {
    $sth = $pdo->prepare('select ' . $table . '.sign, ' . $table . '.dev_desc, d.val_id, d.sign as title, d.mnemo_id, kp.interface, d.id_shem from ' . $table . ' left join dshem as d on ' . $table . '.id=d.val_id left join kp on ts.kp_id=kp.id where ' . $table . '.kp_id = ' . $param . ' and d.mnemo_id is not null order by ' . $table . '.dev_desc, trim(' . $table . '.sign)');
}

$sth->execute();
$data = $sth->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($data);
