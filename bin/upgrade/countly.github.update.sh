#!/bin/bash

set -e

if [[ $EUID -ne 0 ]]; then
   echo "Please execute Countly update script with a superuser..." 1>&2
   exit 1
fi

echo "
   ______                  __  __
  / ____/___  __  ______  / /_/ /_  __
 / /   / __ \/ / / / __ \/ __/ / / / /
/ /___/ /_/ / /_/ / / / / /_/ / /_/ /
\____/\____/\__,_/_/ /_/\__/_/\__, /
              http://count.ly/____/

--------------------------------------
- Updating Countly code from Github  -
--------------------------------------

"

# if [[ "$(/usr/sbin/service countly-supervisor status)" =~ "start/running" ]]; then
  # echo "Stopping Countly"
  #stop countly-supervisor
# fi

DIR="$(cd $(dirname $0) && pwd)"

DT=`date +%Y.%m.%d_%H.%M.%S`
COUNTLY_DIR=`basename $(dirname $(dirname "${DIR}"))`
BACKUP_FILE="$COUNTLY_DIR.backup.$DT.tar.bz2"

if [ "$1" != "--no-backup" ]
then
	cd $DIR/../../..
	pwd
	echo "Backing up countly directory ($COUNTLY_DIR) to $BACKUP_FILE file"

  # Version with node_modules excluded
  # tar cjf "$BACKUP_FILE" --anchored --no-wildcards-match-slash --exclude='*/.git' --exclude='*/log' --exclude='*/node_modules' --exclude '*/plugins/*/node_modules' --exclude='*/core' $(basename $COUNTLY_DIR)
	tar cjf "$BACKUP_FILE" --anchored --no-wildcards-match-slash --exclude='*/.git' --exclude='*/log' --exclude='*/core' $(basename $COUNTLY_DIR)
fi

if ! type git >/dev/null 2>&1; then
    apt-get update && apt-get -y install git
fi

rm -rf /tmp/countly-github

git clone https://github.com/Countly/countly-server.git -b ui-v2 /tmp/countly-github || (echo "Failed to checkout Countly core from Github" ; exit)

rsync -rvc --exclude='.git/' --exclude='log/' /tmp/countly-github/ $DIR/../../  || (echo "Failed to synchronize folder contents" ; exit)

rm -rf /tmp/countly-github

( cd $DIR/../.. ; npm install -g grunt-cli --unsafe-perm ; npm install ) || (echo "Failed to install Node.js dependencies" ; exit)

if [ ! -f $DIR/../../plugins/plugins.json ]; then
	cp $DIR/../../plugins/plugins.default.json $DIR/../../plugins/plugins.json
fi

bash $DIR/../scripts/countly.install.plugins.sh

#compile scripts for production
cd $DIR/../frontend/express/public/javascripts
rm -fr ./react_components_compiled/*
rm -fr ./react_pages_compiled/*
babel --presets es2015,react react_components/ --out-dir react_components_compiled/
babel --presets es2015,react react_pages/ --out-dir react_pages_compiled/
cd $DIR/../frontend/express/public/stylesheets

lessc sidebar.less compiled_css_sidebar.css
lessc calendar.less compiled_css_calendar.css
lessc tables.less compiled_css_tables.css
lessc map.less compiled_css_map.css
lessc selector_with_search.less compiled_css_selector_with_search.css
lessc applications.less compiled_css_applications.css
lessc multi_select.less compiled_css_multi_select.css
lessc select.less compiled_css_select.css
lessc manage_users.less compiled_css_manage_users.css
lessc topbar.less compiled_css_topbar.css
lessc configurations.less compiled_css_configurations.css
lessc crash_details.less compiled_css_crash_details.css
lessc line_chart.less compiled_css_line_chart.css
lessc platforms.less compiled_css_platforms.css

cd $DIR/../.. && grunt dist-all

if [ `getent passwd countly`x != 'x' ]; then
  chown -R countly:countly $DIR/../..
fi

countly restart

echo "Countly has been successfully updated"
