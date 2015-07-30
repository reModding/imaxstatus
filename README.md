IMAX B6 Status
==============

Das IMAX B6 ist ein Ladegerät, welches über seinen seriellen Ausgang Informationen zum aktuellen Betriebsstatus liefert.

Der serielle Ausgang muss in den Einstellunge noch aktiviert werden ("USB/Temp Cut-Off" auf "USB Enable" stellen). Die Pinbelegung ist von links (Stecker fürs Netzteil) nach rechts wie folgt: VCC 5 V / TX / GND

Dieses Projekt besteht aus drei Komponenten:

1. Datensammler
2. Parser
3. Darsteller


Datensammler
------------

[Niobos](http://blog.dest-unreach.be/2012/01/29/imax-b6-charger-protocol-reverse-engineered) hat das Ladegerät analysiert und einen kleinen Script gebastelt, der den binary blob dekodiert. Der Script kommt nach `./collector/` und ist hier zu finden: https://github.com/niobos/iMaxB6

- `read_serial.pl $DEVICE` liest aus
- `decode.pl` konvertiert in *lesbar*

Vielen Dank an den Autor [Niobos](http://blog.dest-unreach.be/2012/01/29/imax-b6-charger-protocol-reverse-engineered)!

Da Perl normalerweise STDOUT puffert, musste ich `decode.pl` noch ein wenig anpassen. Im Grunde habe ich nur die folgenden zwei Zeilen am Anfang eingeschoben:

~~~ perl
# Disable output buffering:
select(STDOUT);
$| = 1;
~~~


### Beispielanwendung

Rechner, der Daten sammelt:

~~~ bash
perl read_serial.pl /dev/ttyUSB0 > /dev/tcp/192.168.0.2/1500
~~~

Rechner, der Daten entgegennimmt und niederschreibt:

~~~ bash
nc -l 1500 | perl decode.pl > ../log/logfile
~~~


Parser
------

Die Parserklasse befindet sich in `imaxParser.php` und wertet immer die letzte Zeile des Logfiles aus.


Darsteller
----------

![Screenshot](https://raw.githubusercontent.com/reModding/imaxstatus/master/screenshot.png)

Der Darsteller ist "der Rest" und ist nichts anderes als eine HTML-Seite, die mit Bootstrap aufgehübscht wurde und per JavaScript/jQuery regelmäßig `json.php` aufruft. `json.php` ruft wiederum die Parserklasse auf.

Dies erzeugt auf Dauer etwas Last auf dem Webserver. Deshalb sollte man diesen Teil noch anders lösen, beispielsweise über WebSockets (TBD).

Schön wäre noch ein Liniendiagramm, das die Zellspannungen darstellt (TBD).
