# RSVP → Google Sheets setup (about 10 minutes)

Guests' replies go from the website to a Google Apps Script "Web app", which writes each one as a row in a Google Sheet that you own. Nothing secret is stored in the website or on GitHub.

## 1. Create the sheet

1. Go to [sheets.new](https://sheets.new) while signed in to the Google account that should own the replies.
2. Name it something like **Hana & Farhaan · RSVPs**.
3. You don't need to add columns. The script creates an **RSVP** tab with these headers on the first reply:

   | Timestamp | Guest name | Attendance | Phone | Wish | Type |
   |---|---|---|---|---|---|

   *Attendance* is `Yes`, `No` or `Later`. *Type* is `new`, or `update` when a guest changes their reply (look for the latest row per name).

## 2. Add the script

1. In the sheet: **Extensions → Apps Script**.
2. Delete whatever is in `Code.gs` and paste the full contents of [`apps-script/Code.gs`](./Code.gs).
3. Click **Save** (the disk icon). Name the project **RSVP**.

## 3. Deploy it as a Web app

1. Click **Deploy → New deployment**.
2. Click the gear next to *Select type* and choose **Web app**.
3. Set:
   - **Description:** RSVP v1
   - **Execute as:** *Me*
   - **Who has access:** *Anyone*
4. Click **Deploy**. Google asks you to **Authorize access**: pick your account, click *Advanced → Go to RSVP (unsafe)*, then *Allow*. This warning is normal for your own scripts. It only lets the script edit this one sheet as you.
5. Copy the **Web app URL**. It looks like `https://script.google.com/macros/s/AKfy…/exec`.

## 4. Connect the website

1. Open `src/config/eventConfig.ts`.
2. Paste the URL into `rsvp.endpoint`:

   ```ts
   rsvp: {
     endpoint: "https://script.google.com/macros/s/AKfy…/exec",
     replyBy: "",
   },
   ```

3. Save, then commit and push. Or just ask Claude to do it.

## 5. Test it

1. Open the Web app URL in your browser. You should see `{"ok":true,"service":"rsvp","sheet":"RSVP"}`.
2. On the invitation (local preview or live), send a test reply. A new row should appear in the **RSVP** tab within a few seconds.
3. Delete the test row afterwards.

## Changing the script later

If you edit `Code.gs`, use **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**. This keeps the same URL, so the website needs no change. Choosing *New deployment* instead creates a new URL, which you'd then have to paste into the config again.

## Privacy

- Only the fields on the form are collected: name, attendance, optional phone and optional wish.
- The sheet is private to your Google account unless you share it.
- To stop accepting replies, use **Deploy → Manage deployments → Archive**.
