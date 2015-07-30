#!/bin/bash
#
# Schreibt $SOURCE Zeile für Zeile nach $DESTINATION (1 Hz)

SOURCE="logfile-test"
DESTINATION="logfile"

LINE_COUNT=$(wc -l < "$SOURCE")
INDEX=1

while [ $INDEX -le $LINE_COUNT ]; do
	RANDOM_LINE="$(sed -ne "${INDEX}p" "$SOURCE")"

	echo "Zeile $INDEX: $RANDOM_LINE"
	echo "$RANDOM_LINE" >> "$DESTINATION"

	INDEX=$(expr $INDEX + 1)

	sleep 1
done
