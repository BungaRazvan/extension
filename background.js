const pixivId = "pixiv_bookmark";

let pixivContextMenuBookmark = false;

const travelBookmark = (tree, condition) => {
  let foundElement = null;

  tree.map((leaf) => {
    if (condition(leaf)) {
      foundElement = leaf;
      return;
    }

    if (leaf.children) {
      travelBookmark(leaf.children, condition);
    }
  });

  return foundElement;
};

setInterval(() => {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      const tab = tabs[0];

      if (!tab) {
        return;
      }

      const hostname = new URL(tab.url).hostname;

      if (hostname == "www.pixiv.net" && !pixivContextMenuBookmark) {
        pixivContextMenuBookmark = true;
        chrome.contextMenus.create({
          id: pixivId,
          title: "Bookmark Image",
          contexts: ["link", "selection"], // ContextType
        });
      }
    }
  );
}, 1000);

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab) {
    return;
  }

  if (info.menuItemId == pixivId) {
    const tree = await chrome.bookmarks.getTree();
    const findPixivFolder = (leaf) => leaf.children && leaf.title == "pixiv";
    const pixivFolder = travelBookmark(
      tree[0].children[0].children,
      findPixivFolder
    );
    chrome.bookmarks.create({
      parentId: pixivFolder.id,
      url: info.linkUrl,
      title: "Kinki Picture",
    });
  }
});
