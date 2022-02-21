# Opal-Browser
Browser Made With CEF and Electron Uploaded For UMSL To View

# Notes
This app uses many dependencies from the NodeJS repositories, and 
one static library (easily identifiable because it is the only 
folder with a ridiculously long name)

The app itself is largely completed, but is missing key features that a release ready browser would have (like customizable downloads and history), but since I was doing this as a timed practice, it does not have these. It does have integrated adblocking via a NodeJS library, bookmarking, and useragent obfuscation and user agent customization for browsing more privately. It also has a fully functonal top bar, tab system, and tab creation system as well as fully functional webGL rendering and video decoding for things like youtube)

# Requirements
NodeJS,
npm,
electron

# Running The app
(This app does not have a packaging process because I never wanted to run it in a packaged form since I was using it to learn, so it gets executed like an interpreted language would, like python.)

Step 1: clone this repo (git clone) or download it as a zip

Step 2: navigate into directory and then navigate into 'Opal-Browser-main'

Step 3: Run: npm install

Step 4: Run "electron ./"

The app should then start up in non-packaged version
