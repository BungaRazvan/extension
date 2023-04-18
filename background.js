const pixivId = "pixiv_bookmark";
const pixivFolderBaseName = "pixiv";

let pixivContextMenuBookmark = false;

const findPixivFolder = async () => {
  const tree = await chrome.bookmarks.getTree();

  return travelBookmark(
    tree[0].children[0].children,
    (leaf) => leaf.children && leaf.title.includes(pixivFolderBaseName)
  );
};

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
    const pixivFolder = await findPixivFolder();

    if (!pixivFolder) {
      return;
    }

    const numBookmarks = pixivFolder.children.length;
    const newTitle = `${pixivFolderBaseName} (${numBookmarks})`;

    if (pixivFolder.title.includes(numBookmarks)) {
      chrome.bookmarks.update(pixivFolder.id, { title: pixivFolderBaseName });
      chrome.bookmarks.update(pixivFolder.id, { title: newTitle });
    } else {
      chrome.bookmarks.update(pixivFolder.id, { title: newTitle });
    }

    chrome.bookmarks.create({
      parentId: pixivFolder.id,
      url: info.linkUrl,
      title: "Kinki Picture",
    });
  }
});

chrome.bookmarks.onRemoved.addListener(async (id, removeInfo) => {
  const pixivFolder = await findPixivFolder();

  if (!pixivFolder) {
    return;
  }

  if (removeInfo.parentId == pixivFolder.id) {
    setTimeout(() => {
      const numBookmarks = pixivFolder.children.length;
      const newTitle = `${pixivFolderBaseName} (${removeInfo.index - 1})`;
      chrome.bookmarks.update(pixivFolder.id, { title: pixivFolderBaseName });
      chrome.bookmarks.update(pixivFolder.id, { title: newTitle });
    }, 100);
  }
});
