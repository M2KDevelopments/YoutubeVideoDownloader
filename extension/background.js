chrome.action.onClicked.addListener(async (tab) => {
    const { title, url } = tab;

    // check if youtube link
    if (!url.includes("youtube.com")) return;

    const uri = new URL(url);
    const videoId = uri.searchParams.get("v");

    //send message to active tab that is download
    chrome.tabs.sendMessage(tab.id, { cid: "alert", message: `Downloading ${title}` });

    try {
        // API Call to localhost server to download video
        const headers = {
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            'Content-Type': 'application/json; charset=utf-8',
        };
        const response = await fetch(`http://localhost:8000/streams/${videoId}`, { method: 'GET', headers });
        const json = await response.json();
        if (json.streams && json.streams.length > 0) {
            const downloadLink = json.streams[0].url;
            chrome.tabs.create({ url: downloadLink, active: true });
            chrome.tabs.sendMessage(tab.id, { cid: "alert", message: `Downloading ${title}` });
        } else {
            chrome.tabs.sendMessage(tab.id, { cid: "alert", message: `Could not find any download links for this video. TRY AGAIN when this popup closes.`, duration: 10000 });
        }
    } catch (e) {
        console.error("Error downloading video:", e);
        chrome.tabs.sendMessage(tab.id, { cid: "alert", message: `Error downloading ${title}. TRY AGAIN` });
    }

});