# Opal-Browser
Browser Made With CEF and Electron Uploaded For UMSL To View

# Building
There are prebuilt binaries in the repository, but if you want to build it, follow the instructions below

(Pre-Build Requirements: NodeJS, npm, and preferrably windows [only tested building on windows])

# Build Steps
Step 1: clone this repo (git clone) or download it as a zip

Step 2: navigate into directory and then navigate into 'Opal-Browser-main'

Step 3: Run: npm install

Step 4: Run: npm install electron-builder --save-dev

Step 5 (Windows Users): npm run dist-win

Step 5 (Linux and MacOS Users): npm run dist-nix

That's it, you should now have system binaries in a folder called ./dist
