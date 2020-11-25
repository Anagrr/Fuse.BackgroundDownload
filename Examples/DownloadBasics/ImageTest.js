var Observable = require("FuseJS/Observable");
var Downloader = require("FuseJS/BackgroundDownload");
var FileSystem = require("FuseJS/FileSystem");
var ImageTools = require("FuseJS/ImageTools");
var CameraRoll = require("FuseJS/CameraRoll");

var info = Observable();
var image = Observable({path:""});
var progressPercents = Observable(0);

var downloadImage = function() {
    image.value = {path:""};
    Downloader.start("https://www.setaswall.com/wp-content/uploads/2017/03/Artistic-Landscape-4K-Wallpaper-3840x2160.jpg");
};

var saveToCameraRoll = function () {
    info.value = 'Saving ...'
    CameraRoll.publishImage(image.value).then(function() {
        info.value = 'Saved succesfuly';
    });
}

var onDownloaded = function(downloadID, finalPath) {
    progressPercents.value = 0;

    // read bytes from temp file
    FileSystem.readBufferFromFile(finalPath).then(function(buffer) {      
        // create image from bytes      
        ImageTools.getImageFromBuffer(buffer).then(function(srcImage) {
            // display created image
            image.value = srcImage;
            info.value = "Path: " + image.value.path;
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
    downloadImage,
    saveToCameraRoll,
    subscribe,
    unsubscribe,
    info,
    image,
    progressPercents
};
