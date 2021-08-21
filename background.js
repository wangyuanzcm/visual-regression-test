chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.command !== "screenShot") return;
  chrome.tabs.captureVisibleTab(function (screenshotUrl) {
    sendResponse(screenshotUrl);
  })
  //此处必须返回true，否则在异步响应返回前，发送端接收端口就会关闭
  return true;
});