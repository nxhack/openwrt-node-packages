# OpenWrt Node.js Packages (nodejs)

## Description

OpenWrt/LEDE Node.js Packages : for Head (Development branch)

Note: support arches are aarch64, arm, x86_64
      (mipseb & mips64eb & mipsel & mips64el & i386 are not supported)

***MIPS no longer be supported***

## License

See [LICENSE](LICENSE) file.

## Usage

Add the following line to feeds.conf or feeds.conf.default.
```
src-git node https://github.com/nxhack/openwrt-node-packages.git
```

Run
```
./scripts/feeds update node
rm ./package/feeds/packages/node
rm ./package/feeds/packages/node-*
./scripts/feeds install -a -p node
make defconfig
```

## Note
OpenWrt Attitude Adjustment(12.09), Barrier Breaker(14.07), Chaos Calmer(15.05) , LEDE(17.01) , 18.06 are not supported.

If you want to use with Chaos Calmer(15.05), see [for-15.05 branch](https://github.com/nxhack/openwrt-node-packages/tree/for-15.05)

If you want to use with LEDE (17.01), see [lede-17.01 branch](https://github.com/nxhack/openwrt-node-packages/tree/lede-17.01)


If you want to use with 18.06, see [openwrt-18.06 branch](https://github.com/nxhack/openwrt-node-packages/tree/openwrt-18.06)

If you want to use with 19.07, see [openwrt-19.07 branch](https://github.com/nxhack/openwrt-node-packages/tree/openwrt-19.07)


***MIPS no longer be supported***

OpenSSL 1.0.x becomes EoL, OpenWrt-18.06 will not be supported.
Python2 becomes EoL, node v8.x will not be supported.

On the host side, the following preparations are required.
* GCC 6.3 or higher is required.
* To build a 32-bit target, gcc-multilib, g++-multilib are required.
* The libatomic package is required. (Install the 32-bit library at the same time, if necessary).

## Illegal instruction issue

***V8 JIT code generates FP instruction. Node.js does not work without hardware FPU.***

If you are running nodejs with Atheros AR71xx, AR933x.
ARM cores without vfp or neon (such as ***bcm53xx***) will not work either.

## Enable Inspector

| Processor | ICU | Inspector |
| :---: | --- | :---: |
| 32bit | Disable | NO |
| 32bit | small-icu | YES |
| 32bit | system-icu | NO |
| 64bit | Disable | NO |
| 64bit | small-icu | YES |
| 64bit | system-icu | YES |

 [Debugging Guide](https://nodejs.org/en/docs/guides/debugging-getting-started/) ***Nice to use Chrome DevTools.***

 Note: ICU currently supports only ***LITTLE ENDIAN***.

## Note about mDNS and homebridge
***If you use node-homebridge(node-hap-nodejs), please install mDNS package (umdns / avahi-dbus-daemon / mdnsresponder).***

(1)
Some OpenWrt / Lede images have built in dnscrypt-proxy package, which by default listening on 5353 port.

In that case, installed avahi-daemon will not start on ipv4 interface, only on ipv6 because ipv4 port is taken.

This will lead to strange issue: your homebrdge accessory will be visible in 'Home' app, but can't finish pairing.

To fix this, you have to stop and disable dnscrypt-proxy

Also, you have to enable: dbus and avahi-daemon services to start automatically, i.e for Lede:

```
/etc/init.d/dbus enable
/etc/init.d/avahi-daemon enable
```

(2)
avahi on home network

Please read this document. '[Why avahi and bonjour don't work on your home network](https://github.com/culler/querierd/blob/master/README)'

***IGMP-querier*** will solve your problem.

OpenWrt custom packages available: https://github.com/nxhack/openwrt-custom-packages

## Low memory
Specify v8-options.

```
--max_old_space_size=20 --initial_old_space_size=4 --max_semi_space_size=2 --max_executable_size=5 --optimize_for_size
```

Or use [swap](https://openwrt.org/docs/guide-user/storage/fstab?s[]=swap).

## Modules that use pre-compiled binary (native module)
```
node-alljoyn			[mark @BROKEN]
node-arduino-firmata		(serialport)
node-authenticate-pam
node-bignum
node-binaryjs			(streamws)
node-bleacon			(bignum,bluetooth-hci-socket)
node-bluetooth-hci-socket	(usb)
node-bufferutil
node-cylon-firmata		(firmata)
node-deasync
node-ejdb2_node
node-enocean-utils		(serialport)
node-epoll
node-expat
node-ffi-napi			(ffi-napi, ref-napi)
node-firmata			(serialport)
node-fuse-bindings
node-hashtable			[mark @BROKEN: use node-megahash]
node-hid
node-hid-stream			(node-hid)
node-homebridge-config-ui-x	(node-pty-prebuilt-multiarch)
node-i2c-bus
node-ideino-linino-lib		(epoll)
node-johnny-five		(firmata, serialport)
node-level			(leveldown)
node-leveldown
node-megahash
node-mdns			[need select 'y'[*] libavahi-compat-libdnssd for InstallDev libdns_sd.so]
node-mknod			[mark @BROKEN]
node-muzzley-client		(ws[legacy])
node-net-ping			(raw-socket)
node-nitrogen			(ws[legacy])
node-nitrogen-cli		(ws[legacy])
node-onoff			(epoll)
node-pi-spi
node-pty
node-red			(bcrypt)
node-red-contrib-gpio		(johnny-five)
node-red-contrib-homekit	(hap-nodejs)
node-red-contrib-modbus		(@serialport/bindings)
node-red-node-arduino		(firmata)
node-reverse-wstunnel
node-rpi-gpio			(epoll)
node-rpio
node-serialport			(@serialport/bindings)
node-serialport-bindings	(@serialport/bindings)
node-sleep
node-socket.io-client-legacy	(ws[legacy])
node-socket.io-legacy		(ws[legacy])
node-spi-device
node-sqlite3
node-statvfs
node-ubus
node-usb
node-utf-8-validate
node-websocket			(bufferutil, utf-8-validate)
node-zigbee2mqtt		(@serialport/bindings)
```
Other modules can be installed by 'npm install'.

***If you want a new module (native module) that requires a precompiled binary, please open the issue.***

## Package Guidelines

See [CONTRIBUTING.md](https://github.com/openwrt/packages/blob/master/CONTRIBUTING.md) file.
