<?php
class imaxParser {
  public $file;
  public $result;

  public function __construct($log) {
    $this->file = file($log);
    $this->process();
  }

  private function process() {
    // Nur die letzte Zeile im Logfile ist interessant:
    $line = $this->file[count($this->file) - 1];

    // Folgende Zeilen ignorieren:
    if(preg_match('/Standby/', $line, $match)) {
      $result = array(array("state" => $match[0]), array("direction" => ""));
    } else {
      $result = $this->parse($line);
    }

    $this->result = $result;
  }

  private function parse($subject) {
    $result = explode("  ", $subject);

    // Generische Felder, die uns interessieren:
    $pattern = array("Uin", "t", "Iset", "Cells", "Iout", "Uout", "Qout");

    foreach($result as $item) {
      foreach($pattern as $p) {
        if(preg_match("/^$p=(.*)/", $item, $match)) $result_single[] = array($p => $match[1]);
      }

      // cell_voltages ist ein Sonderfall:
      if(preg_match_all('/U[0-9]*=([0-9\.]*)/', $item, $match)) $result_single[] = array("cell_voltages" => $match[1]);
    }

    // state, direction und mode sind ebenfalls Sonderfälle:
    $info = explode(" ", $result[1]);
    $result_single[] = array("state" => $info[0]);
    $result_single[] = array("direction" => $info[1]);
    $result_single[] = array("mode" => $info[2]);

    return $result_single;
  }
}
?>
