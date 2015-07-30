function zeroAny() {
  // Alles nullen:
  $("span#Uin").html("-");
  $("span#t").html("-");
  $("span#Iset").html("-");
  $("span#Cells").html("-");
  $("span#Iout").html("-");
  $("span#Uout").html("-");
  $("span#Qout").html("-");
  $("span#state").html("-");
  $("span#direction").html("-");
  $("span#mode").html("-");
  $("div#cell_voltages_wrapper div.row").html("-");
}

$(document).ready(function() {
  window.setInterval(function() {
    $.getJSON("/imax/json.php", function(data) {
      // Daten angekommen - Hauptbereich anzeigen:
      $("div#loading").addClass("hidden");
      $("div#main").removeClass("hidden");

      zeroAny();

      $.each(data, function(id, obj) {
        $.each(obj, function(key, val) {
          console.log(key + ": " + val);

          switch(key) {
          case "cell_voltages":
            // Zellen hübsch darstellen:
            cell_voltages_html = "";
            i = 1;

            $.each(val, function(cv_key, cv_val) {
              cell_voltages_html = cell_voltages_html + '<div class="col-md-4 text-center"><div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="' + (cv_val / 4.2 * 100) + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + (cv_val / 4.2 * 100) + '%;">' + cv_val.replace(".", ",") + ' V</div></div><p class="text-muted"> Zelle ' + i + '</p></div>';

              i++;
            });

            $("div#cell_voltages_wrapper div.row").html(cell_voltages_html);

            break;

          case "mode":
            if(val != "Li") {
              // Wenn der Akku kein Li ist, gibt's auch keine Angabe der einzelnen Zellen:
              $("div#cell_voltages_wrapper").hide();
            } else {
              $("div#cell_voltages_wrapper").show();
            }

            $("span#mode").html(val.toString().replace(".", ","));

            break;

          case "timestamp":
              // Formatierung des Timestamps inkl. führender Nullen:
              now = new Date();
              ts = new Date(val * 1000);
              timestamp = ("0" + ts.getUTCDate()).slice(-2) + "." + ("0" + ts.getUTCMonth()).slice(-2) + "." + ts.getUTCFullYear() + " " + ("0" + ts.getHours()).slice(-2) + ":" + ("0" + ts.getMinutes()).slice(-2) + ":" + ("0" + ts.getSeconds()).slice(-2) + " Uhr";

              // Warnung, wenn die Daten zu alt sind (Angabe in ms!):
              if((ts.getTime() + 3000) < now.getTime()) {
                timestamp = "<span class=\"text-danger\">" +  timestamp + "</span>";
                $("span#online").addClass("hidden");
                $("span#offline").removeClass("hidden");
              } else {
                timestamp = "<span class=\"text-success\">" +  timestamp + "</span>";
                $("span#offline").addClass("hidden");
                $("span#online").removeClass("hidden");
              }

              $("span#timestamp").html(timestamp);
            break;

          default:
            $("span#" + key).html(val.toString().replace(".", ","));
          }
        });
      });
    }).fail(function() {
      zeroAny();
      $("span#timestamp").html("-");
    });
  }, 1000);
});
