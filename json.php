<?php
require_once("imaxParser.php");

$log = "log/logfile";

$imaxParser = new imaxParser($log);

$result = $imaxParser->result;

// Mit Timestamp versehen (modification time von $log):
$result[] = array("timestamp" => filemtime($log));

echo json_encode($result);
?>
