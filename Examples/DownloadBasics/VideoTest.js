var Observable = require("FuseJS/Observable");
var Downloader = require("FuseJS/BackgroundDownload");
var FileSystem = require("FuseJS/FileSystem");
var VideoTools = require("FuseJS/VideoTools");

var info = Observable();
var videoSource = Observable("");
var progressPercents = Observable(0);

var videoUrl = "http://techslides.com/demos/sample-videos/small.3gp";
var downloadVideo = function() {
    videoSource.value = "";
    Downloader.start(videoUrl);
};

var saveToCameraRoll = function () {
    info.value = 'Saving ...';
    info.value = "Success? " + VideoTools.copyVideoToCameraRoll(path);
}

var onDownloaded = function(downloadID, finalPath) {
    progressPercents.value = 0;

    // get filename from Url
    var filename = videoUrl.split('/').pop();
    // combine path for saving
    var path = FileSystem.cacheDirectory + "/" + filename;
    // read bytes from temp file
    FileSystem.readBufferFromFile(finalPath).then(function(buffer) {
        // create file in the Android directory (can be accessed via FileExplorer)
        FileSystem.writeBufferToFile(path, buffer)
            .then(function(){
                info.value = "Path : " + path;
                videoSource.value = path;
            })
            .catch(function(err){
                info.value = err;
            }); 
    });
};

var onProgressChanged = function(downloadID, bytesSoFar, totalBytesExpected) {
    progressPercents.value = Math.ceil(bytesSoFar * 100 / totalBytesExpected);
};

var onFailed = function(downloadID, errorMessage) {
    progressPercents.value = 0;
    info.value = "failure :( - " + downloadID + ": " + errorMessage;
};

var subscribe = function() {
    Downloader.on("succeeded", onDownloaded);
    Downloader.on("progress", onProgressChanged);
    Downloader.on("failed", onFailed);
};

var unsubscribe = function() {
    Downloader.removeListener("succeeded", onDownloaded);
    Downloader.removeListener("progress", onProgressChanged);
    Downloader.removeListener("failed", onFailed);
};

module.exports = {
    downloadVideo,
    saveToCameraRoll,
    subscribe,
    unsubscribe,
    info,
    videoSource,    
    progressPercents
};
