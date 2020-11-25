var Observable = require("FuseJS/Observable");
var Downloader = require("FuseJS/BackgroundDownload");

var lastDownloadID = -1;
var info = Observable("");
var progressPercents = Observable(0);

var startDownload = function() {
    lastDownloadID = Downloader.start("https://www.setaswall.com/wp-content/uploads/2017/03/Artistic-Landscape-4K-Wallpaper-3840x2160.jpg");
};

var stopDownload = function() {
    Downloader.stop(lastDownloadID);
};

var pauseDownload = function() {
    Downloader.pause(lastDownloadID);
};

var resumeDownload = function() {
    lastDownloadID = Downloader.resume(lastDownloadID);
};

var onProgressChanged = function(downloadID, bytesSoFar, totalBytesExpected) {
    progressPercents.value = Math.ceil(bytesSoFar * 100 / totalBytesExpected);
};

var onFailed = function(downloadID, errorMessage) {
    progressPercents.value = 0;
    info.value = "failure :( - " + downloadID + ": " + errorMessage;
};

var onPaused = function(kind, downloadID) {
    console.log(kind + " - " + downloadID);
};

var onDownloaded = function(downloadID, finalPath) {
    progressPercents.value = 0;
    console.log("success! - " + downloadID + ": " + finalPath);
};

var subscribe = function() {
    Downloader.on("succeeded", onDownloaded);
    Downloader.on("progress", onProgressChanged);
    Downloader.on("failed", onFailed);
    Downloader.on("paused", onPaused);
};

var unsubscribe = function() {
    Downloader.removeListener("succeeded", onDownloaded);
    Downloader.removeListener("progress", onProgressChanged);
    Downloader.removeListener("failed", onFailed);
    Downloader.removeListener("paused", onPaused);
};

module.exports = {
    startDownload,
    stopDownload,
    pauseDownload,
    resumeDownload,
    subscribe,
    unsubscribe,
    info,
    progressPercents
};
