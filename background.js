let currentTabId;
let messengerTabId;
let previousTab;

function onError(e) {
  console.log("***Error: " + e);
};

function createPinnedTab() {
  browser.tabs.create(
    {
      url: "https://www.messenger.com",
      pinned: true,
      active: true
    }
  )
};

function handleSearch(messengerTabs) {
  //console.log("currentTabId: " + currentTabId);
  if(messengerTabs.length > 0) {
    //console.log("there is a calendar tab");
    messengerTabId = messengerTabs[0].id;
    if(messengerTabId === currentTabId) {
      //console.log("I'm in the messenger tab");
      browser.tabs.update(previousTab, {active: true,});
    } else {
      //console.log("I'm NOT in the messenger tab");
      previousTab = currentTabId;
      browser.tabs.update(messengerTabId, {active: true,});
    }
  } else {
    //console.log("there is NO messenger tab");
    previousTab = currentTabId;
    createPinnedTab();
  }
};

function handleClick(tab) {
  //console.log("*********Button clicked*********");
  currentTabId = tab.id;
  var querying = browser.tabs.query({url: "*://www.messenger.com/*"});
  querying.then(handleSearch, onError);
};

function update(details) {
  if (details.reason === "install" || details.reason === "update") {
    var opening = browser.runtime.openOptionsPage();
    opening.then(onOpened, onError);  }
};

browser.browserAction.onClicked.addListener(handleClick);
browser.runtime.onInstalled.addListener(update);