#!/bin/bash

#simplifies choosing and downloading audio formats from youtube using yt-dlp programm

#show available audio formats to choose from
read -p "Enter video url: " videoUrl
audioFormats=$(yt-dlp -F $videoUrl | grep  -E '(audio|ID|--)')
echo "$audioFormats"


#input of needed format, offering 251 as default - usually it is best-audio
defaultFormatId=251
read -p "Enter format ID (default is $defaultFormatId): " formatId

if [ "$formatId" = "" ]; then
    formatId=$defaultFormatId
fi

downloadProcessMessages=$(yt-dlp -P "~/audios" -f $formatId $videoUrl)
echo "$downloadProcessMessages" #just for info


#launch downaloaded file in player
destinationLine=$(grep "Destination" <<< $downloadProcessMessages)
downloadedFileLocation=${destinationLine:24}
echo "will try to play file {$downloadedFileLocation}"
vlc "$downloadedFileLocation"


#prevent exiting of script to prevent exiting of launched player 
echo -n "Press Enter to exit!"
read tempVar
