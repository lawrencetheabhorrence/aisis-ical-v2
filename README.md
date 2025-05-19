# AISIS ICAL
This extension adds a button on the "My Class Schedule" page on AISIS that exports your class schedule to an ical file, which you can import into sites like Google Calendar.

![image](https://github.com/user-attachments/assets/f819b137-85d5-4bed-b9d0-6e23f3ce70cf)

## Installation
As of now, the extension is only available as ZIP files which you can install on your browser. Uploading to the Firefox and Chrome extension stores will be coming soon.
### From the ZIP Release
#### Firefox
1. Download the Release with name `aisis-ical-<version>-firefox.zip`
2. Go to `about:addons`
3. Click on the gear button beside "Manage Your Extensions"
![image](https://github.com/user-attachments/assets/5bb36ced-2f57-4777-b1e2-dba2cea99050)
4. Click on "Install Add-on From File..."
![image](https://github.com/user-attachments/assets/56a23565-1bfa-4330-8254-2454518dded3)
5. Select the zip file `aisis-ical-<version>-firefox.zip`.

#### Chrome
1. Download the Release with name `aisis-ical-<version>-chrome.zip`
2. Extract this zip to a folder named "AISIS ICal"
3. Go to `chrome://extensions`
4. Click on the Load Unpacked button
![image](https://github.com/user-attachments/assets/87f3566d-7ae9-4038-86eb-459ddb16910a)
5. Select the "AISIS ICal" folder you just extracted

## Building from source
The extension is built with [wxt](https://wxt.dev/) and can also be built using its commands from [here](https://wxt.dev/guide/essentials/publishing.html). To build the extension ZIPs from source simply run `npm run zip`. You can also build a zip for a specific browser with `npm run zip:firefox` or `npm run zip:chrome`.
To run the extension from the commandline, use `npm run dev`. The full list of commands is in the project's `package.json`.

## Running Tests
To run the tests for this extension, simply run `npm run test` in your command line.
