#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ -f /etc/redhat-release ]; then
    #install latest mongodb 
    
    #select source based on release
	if grep -q -i "release 6" /etc/redhat-release ; then
        echo "[mongodb-org-3.2]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/6/mongodb-org/3.2/x86_64/
gpgcheck=0
enabled=1" > /etc/yum.repos.d/mongodb-org-3.2.repo
    elif grep -q -i "release 7" /etc/redhat-release ; then
        echo "[mongodb-org-3.2]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/7/mongodb-org/3.2/x86_64/
gpgcheck=0
enabled=1" > /etc/yum.repos.d/mongodb-org-3.2.repo
    fi
    yum install -y nodejs mongodb-org
    
    #disable transparent-hugepages (requires reboot)
    cp -f $DIR/disable-transparent-hugepages /etc/init.d/disable-transparent-hugepages
    chmod 755 /etc/init.d/disable-transparent-hugepages
    chkconfig --add disable-transparent-hugepages
fi

if [ -f /etc/lsb-release ]; then
    #install latest mongodb 
	apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
    UBUNTU_YEAR="$(lsb_release -sr | cut -d '.' -f 1)";

    if [ "$UBUNTU_YEAR" != "16" ]
    then
        echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.2.list ;
    else
        echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.2.list ;
    fi
    apt-get update
    #install mongodb
    apt-get -y install mongodb-org || (echo "Failed to install mongodb." ; exit)
    
    #disable transparent-hugepages (requires reboot)
    cp -f $DIR/disable-transparent-hugepages /etc/init.d/disable-transparent-hugepages
    chmod 755 /etc/init.d/disable-transparent-hugepages
    update-rc.d disable-transparent-hugepages defaults
fi

#backup config and remove configuration to prevent duplicates
cp /etc/mongod.conf /etc/mongod.conf.bak
nodejs $DIR/configure_mongodb.js /etc/mongod.conf
  
if [ -f /etc/redhat-release ]; then
    #mongodb might need to be started
    if grep -q -i "release 6" /etc/redhat-release ; then
        service mongod restart || echo "mongodb service does not exist"
    else
        systemctl restart mongod || echo "mongodb systemctl job does not exist"
    fi
fi

if [ -f /etc/lsb-release ]; then
    if [[ `/sbin/init --version` =~ upstart ]]; then
        restart mongod || echo "mongodb upstart job does not exist"
    else
        systemctl restart mongod || echo "mongodb systemctl job does not exist"
    fi
fi
