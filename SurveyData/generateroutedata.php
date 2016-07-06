<?php

if(count($argv) == 5) {
    $curl = curl_init();

    $url = "http://api.irail.be/vehicle/?id=BE.NMBS." . $argv[1];

    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

    $result = curl_exec($curl);
    curl_close($curl);

    $xml = simplexml_load_string($result);
    $stops = $xml->stops;

    $write = false;
    $errorCheck = 0;
    $text = "";
    $crowding = "?";
    $i = 1;

    foreach($stops->stop as $stop) {
        if($stop->station == $argv[2]) {
            if($errorCheck != 0) $errorCheck += 1;

            $crowding = $argv[4];
            $errorCheck += 1;
        }

        if($stop->station == $argv[3] && $errorCheck == 1) {
            $errorCheck += 1;
            $crowding = "?";
        }

        if($i == 1) {
            $text .= $argv[1] . "," . (intval($stop["id"] + 1)) . "," . $crowding . ",1" . "," . $stop->station["URI"] . ",";
        } else if($i != count($stops->stop)) {
            $text .= $stop->station["URI"] . "\n";
            $text .= $argv[1] . "," . (intval($stop["id"] + 1)) . "," . $crowding . ",1" . "," . $stop->station["URI"] . ",";
        } else {
            $text .= $stop->station["URI"] . "\n"; 
        }

        //echo($stop->station . " " . $argv[2] . " " . $argv[3] . "\n");

        $i++;
    }

    if($errorCheck != 2) echo "Error: stations niet overlopen\n";
    else $myfile = file_put_contents('survey.csv', $text.PHP_EOL, FILE_APPEND);
} else {
    echo "Error: geef 4 argumenten\n";
}

?>