# OpenWrt Node.js Packages (nodejs)

##Description

OpenWrt Node.js Packages : for trunk (Bleeding Edge) / LEDE

Note: Testing target only ar71xx.

##License

See:
- [OpenWrt license](http://wiki.openwrt.org/about/license)

##Usage

Add follow line to feeds.conf or feeds.conf.default
```
src-git node https://github.com/nxhack/openwrt-node-packages.git
```

Run
```
./scripts/feeds update node
rm ./package/feeds/packages/node
rm ./package/feeds/packages/node-arduino-firmata
rm ./package/feeds/packages/node-cylon
rm ./package/feeds/packages/node-hid
rm ./package/feeds/packages/node-serialport
./scripts/feeds install -a -p node
```

##Note
OpenWrt Attitude Adjustment(12.09), Barrier Breaker(14.07), Chaos Calmer(15.05) are not supported.

## Modules that need build with '--build-from-source' option.
```
node-alljoyn
node-arduino-firmata		(serialport)
node-authenticate-pam
node-autobahn
node-bluetooth-hci-socket
node-cylon-firmata		(serialport)
node-firmata			(serialport)
node-fuse-bindings
node-hashtable
node-hid
node-i2c-bus
node-ibmiotf			(utf-8-validate, bufferutil)
node-ideino-linino-lib
node-johnny-five		(serialport)
node-leveldown
node-mknod
node-modbus
node-node-expat
node-node-red			(serialport, bcrypt, utf-8-validate, bufferutil)
node-node-red-contrib-gpio	(serialport)
node-node-red-node-arduino	(serialport)
node-onoff
node-rpio
node-serialport
node-sleep
node-sqlite3
node-statvfs
node-usb
```
Other modules can be installed by 'npm install'.
