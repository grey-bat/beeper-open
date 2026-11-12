(function () {
  var PREFIX = "beeper://select-thread/";
  var raw = location.hash.slice(1), link = "";
  try { link = decodeURIComponent(raw); } catch (e) { link = ""; }
  var q = link.indexOf("?") >= 0 ? new URLSearchParams(link.split("?")[1]) : new URLSearchParams();
  var ok = link.indexOf(PREFIX) === 0 && link.length > PREFIX.length &&
           !/[\s<>"]/.test(link) && !q.has("text") && !q.has("attachmentPath");
  var msg = document.getElementById("msg");
  var err = document.getElementById("err");
  var a = document.getElementById("open");
  function fail(t) { msg.hidden = true; err.textContent = t; err.hidden = false; }
  if (!ok) { fail("Invalid or missing Beeper chat link."); return; }

  if (/Android/i.test(navigator.userAgent)) {
    // Beeper Android (com.beeper.android) has no beeper://select-thread handler.
    // Its MainActivity is BROWSABLE for https://matrix.to and opens the room from the permalink.
    // Chrome requires a user gesture to launch an app, so no auto-redirect here.
    var parts = link.slice(PREFIX.length).split("?")[0].split("/");
    var roomId = "";
    try { roomId = decodeURIComponent(parts[1] || ""); } catch (e) { roomId = ""; }
    if (!/^![A-Za-z0-9._~=+\/-]+:[A-Za-z0-9._-]+$/.test(roomId)) { fail("Invalid chat ID."); return; }
    var a2 = document.getElementById("open2");
    var data = "intent://matrix.to/#/" + roomId + "#Intent;scheme=https;package=com.beeper.android;";
    var v = encodeURIComponent(roomId);
    // Try 1: matrix.to permalink plus the chat-target extras Beeper reads from shortcuts/notifications.
    a.href = data + "S.chat_id=" + v + ";S.android.intent.extra.shortcut.ID=" + v + ";end";
    a.textContent = "Open in Beeper (try 1)";
    // Try 2: plain matrix.to permalink (works for synced rooms such as Note to self).
    a2.href = data + "end";
    a2.textContent = "Open in Beeper (try 2)";
    msg.textContent = "Tap to open this chat in Beeper. If try 1 does not open the chat, use try 2.";
    a.hidden = false;
    a2.hidden = false;
    return;
  }

  a.href = link;
  a.hidden = false;
  window.location.href = link;
})();
