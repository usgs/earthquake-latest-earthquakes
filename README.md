earthquake-latest-earthquakes
==============

Mobile friendly, interactive earthquake map and list application.

### Getting Started:
1. [Use git to clone earthquake-latest-earthquakes from git repository](readme_git_install.md)

1. Make sure you are in your `earthquake-latest-earthquakes` project directory.

1. Install NPM dependencies

    `npm install`

1. Preview in a browser

    `grunt`

    On windows, `gateway` has trouble resolving default documents and you need
    to change the opened url to `http://localhost:8000/index.html` in order to
    view the Test Suite.
    To view the application go to 'http://localhost:8080/index.html'

### Having trouble getting started?

1. If this is your first time using **grunt**, you need to install the grunt
command line interface globally

    `npm install -g grunt-cli`

1. Leaflet uses Jake to compile it's source.

    `npm install -g jake`

1. Jake uses uglify to compile the leaflet source.

    `npm install -g uglify-js`
