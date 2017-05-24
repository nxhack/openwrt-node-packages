# OpenWrt Node.js Packages (nodejs)

## Description

OpenWrt Node.js Packages : for trunk (Bleeding Edge) / LEDE

Note: Testing target only ar71xx.

## License

See:
- [OpenWrt license](http://wiki.openwrt.org/about/license)

## Usage

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

## Note
OpenWrt Attitude Adjustment(12.09), Barrier Breaker(14.07), Chaos Calmer(15.05) are not supported.

If you want to try with Chaos Calmer(15.05), see [for-15.05 branch](https://github.com/nxhack/openwrt-node-packages/tree/for-15.05)


##Illegal instruction issue

***
V8 JIT code DOES generate FP instructions. Node.js may not work without hardware FPU (nor kernel FPU emulation).
***

If you are running nodejs on Atheros AR933x, You need to make a kernel with CONFIG_MIPS_FPU_EMULATOR=y.

Also ARM core without vfp or neon (***bcm53xx*** etc).

## Modules that need build with '--build-from-source' option.
```
node-alljoyn
node-arduino-firmata		(serialport)
node-authenticate-pam
node-autobahn			(utf-8-validate, bufferutil)
node-bluetooth-hci-socket
node-cylon-firmata		(serialport)
node-firmata			(serialport)
node-fuse-bindings
node-hashtable
node-hid
node-homebridge			(mdns [need select 'y' libavahi-compat-libdnssd and libavahi-dbus-support for InstallDev libdns_sd.so])
node-i2c-bus
node-ibmiotf			(utf-8-validate, bufferutil)
node-ideino-linino-lib
node-johnny-five		(serialport)
node-leveldown
#node-level			(leveldown)
node-mdns			[need select 'y' libavahi-compat-libdnssd and libavahi-dbus-support for InstallDev libdns_sd.so]
node-mknod
node-modbus
node-node-expat
node-node-red			(bcrypt)
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

# Memo
```
(default arm_fpu = 'vfp')

v8:
 valid_arm_fpu = ('vfp', 'vfpv3', 'vfpv3-d16', 'neon')

target:
CPU_SUBTYPE:=vfp
CPU_SUBTYPE:=vfpv3
CPU_SUBTYPE:=neon
CPU_SUBTYPE:=neon-vfpv4

CONFIG_CPU_TYPE:=arm1176jzf-s_vfp
CONFIG_CPU_TYPE:=cortex-a15_neon-vfpv4
CONFIG_CPU_TYPE:=cortex-a53_neon-vfpv4
CONFIG_CPU_TYPE:=cortex-a7_neon-vfpv4
CONFIG_CPU_TYPE:=cortex-a8_vfpv3
CONFIG_CPU_TYPE:=cortex-a9_neon
CONFIG_CPU_TYPE:=cortex-a9_vfpv3
CONFIG_CPU_TYPE:=mpcore_vfp
```
