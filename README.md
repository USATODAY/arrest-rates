Copyright (c) 2014 USA TODAY 

##Development

The requirements for this project are node.js and grunt. 

To install node with Hombrew:
`brew install node`

Otherwise head over to the [Node website](http://nodejs.org/) and install from there.
Once Node is installed, install Grunt with
`npm install -g grunt-cli`

Once those dependencies are set up, from this repository run `npm install`, then run `grunt`

##Data Tools
To use the Python data tools included in this project, first set up your local Python environment, and then `pip install -r requirements.txt`.

These scripts are all expecting json data in a specific format.
`geojson-converter.py` converts said data into a single geojson file.
`data-splitter.py` converts said data into state-by-state json files that can be ingested into the front-end app.


###Live version:
http://www.gannett-cdn.com/experiments/usatoday/2014/11/arrests-interactive/

