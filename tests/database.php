<?php

// Disposable credentials for the isolated Compose database.
return [
    'host' => 'db',
    'username' => 'colors_test',
    'password' => getenv('MYSQL_PASSWORD'),
    'database' => 'COP4331',
];
