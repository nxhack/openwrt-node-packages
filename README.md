# OpenWrt Node.js Packages (nodejs)

## Description

OpenWrt Node.js Packages : for trunk (Bleeding Edge) / LEDE

Note: Testing target only ar71xx.

## License

See [LICENSE](LICENSE) file.

## Usage

Add follow line to feeds.conf or feeds.conf.default
```
src-git node https://github.com/nxhack/openwrt-node-packages.git
```

Run
```
./scripts/feeds update node
rm ./package/feeds/packages/node*
./scripts/feeds install -a -p node
```

## Note
OpenWrt Attitude Adjustment(12.09), Barrier Breaker(14.07), Chaos Calmer(15.05) are not supported.

If you want to try with Chaos Calmer(15.05), see [for-15.05 branch](https://github.com/nxhack/openwrt-node-packages/tree/for-15.05)


## Illegal instruction issue

***V8 JIT code DOES generate FP instructions. Node.js may not work without hardware FPU or kernel FPU emulation.***

If you are running nodejs on Atheros AR933x, You need to make a kernel with CONFIG_MIPS_FPU_EMULATOR=y.

Also ARM core without vfp or neon (***bcm53xx*** etc) not work.

## Note about avahi and homebridge
(1)
"libdns_sd.so" is required to build homebridge package. To install this library, select "libavahi-compat-libdnssd" and press 'y' sets the <*> as built-in label.

```
make meuconfig
```
> Libraries  --->
>
>    <*> libavahi-compat-libdnssd........ An mDNS/DNS-SD implementation (libdnssd)

***It is meant select Avahi dbus version instead of Avahi non-dbus version.***

(2)
Some OpenWRT / Lede images have built in dnscrypt-proxy package, which by default listening on 5353 port.

In that case, installed avahi-daemon will not start on ipv4 interface, only on ipv6 because ipv4 port is taken.

This will lead to strange issue: your homebrdge accessory will be visible in 'Home' app, but can't finish pairing.

To fix this, you have to stop and disable dnscrypt-proxy

Also, you have to enable: dbus and avahi-daemon services to start automatically, i.e for Lede:

```
/etc/init.d/dbus enable
/etc/init.d/avahi-daemon enable
```


## Modules that need build with '--build-from-source' option.
```
node-alljoyn
node-arduino-firmata		(serialport)
node-authenticate-pam
node-autobahn			(utf-8-validate, bufferutil)
node-bluetooth-hci-socket
node-cylon-firmata		(serialport)
node-ejdb
node-ffi			(ffi, ref)
node-firmata			(serialport)
node-fuse-bindings
node-hashtable
node-homebridge			(mdns [need select 'y'[*] libavahi-compat-libdnssd for InstallDev libdns_sd.so], curve25519-n2, ed25519)
node-hap-nodejs			(mdns [need select 'y'[*] libavahi-compat-libdnssd for InstallDev libdns_sd.so], curve25519-n2, ed25519)
node-i2c-bus
node-ibmiotf			(utf-8-validate, bufferutil)
node-ideino-linino-lib
node-johnny-five		(serialport)
node-leveldown
node-level			(leveldown)
node-mdns			[need select 'y'[*] libavahi-compat-libdnssd for InstallDev libdns_sd.so]
node-mknod
node-modbus
node-node-expat
node-node-hid
node-node-red			(bcrypt)
node-node-red-contrib-gpio	(serialport)
node-node-red-contrib-homekit	(mdns [need select 'y'[*] libavahi-compat-libdnssd for InstallDev libdns_sd.so], curve25519-n2, ed25519)
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

***If you want new module that requires pre-compiled binary (native module), please open issues.***
