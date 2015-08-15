<?php
$callback = $_GET['callback'];
$data = $_GET['data'] * 10;
echo $callback."($data)";
