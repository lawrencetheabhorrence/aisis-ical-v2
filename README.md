# AISIS ICAL

This extension adds a button on the "My Class Schedule" page on AISIS that exports your class schedule to an ical file, which you can import into sites like Google Calendar.

![image](https://github.com/user-attachments/assets/f819b137-85d5-4bed-b9d0-6e23f3ce70cf)

## Installation

The add-on is available on [Firefox Extensions](https://addons.mozilla.org/en-US/firefox/addon/aisis-ical/). The ZIP Releases and a Chrome Webstore link will be coming soon.

## Building from source

The extension is built with [wxt](https://wxt.dev/) and can also be built using its commands from [here](https://wxt.dev/guide/essentials/publishing.html). To build the extension ZIPs from source simply run `npm run zip`. You can also build a zip for a specific browser with `npm run zip:firefox` or `npm run zip:chrome`.
To run the extension from the commandline, use `npm run dev`. The full list of commands is in the project's `package.json`.

## Running Tests

To run the tests for this extension, simply run `npm run test` in your command line.
