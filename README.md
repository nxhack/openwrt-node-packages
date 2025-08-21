# OpenWrt Node.js Packages (nodejs)

## Description

OpenWrt Node.js Packages : for OpenWrt-23.05 (***End of life***)

Note: support arches are aarch64, arm, x86_64

## License

See [LICENSE](LICENSE) file.

## Usage

Add the following line to feeds.conf or feeds.conf.default.
```
src-git node https://github.com/nxhack/openwrt-node-packages.git;openwrt-23.05
```

Run
```
./scripts/feeds update node
rm ./package/feeds/packages/node
rm ./package/feeds/packages/node-*
./scripts/feeds install -a -p node
make defconfig
```

## Request to add a package is welcome
If you want a new module (native module) that requires a precompiled binary, ***please open the issue.***

## Note
If you want to use with 21.02, see [openwrt-21.02 branch](https://github.com/nxhack/openwrt-node-packages/tree/openwrt-21.02) (***End of life***)

If you want to use with 22.03, see [openwrt-22.03 branch](https://github.com/nxhack/openwrt-node-packages/tree/openwrt-22.03) (***End of life***)

On the host side, the following preparations are required.
* [Unix prerequisites](https://github.com/nodejs/node/blob/master/BUILDING.md#unix-prerequisites)
* To build a 32-bit target, gcc-multilib, g++-multilib are required.
```
sudo apt-get install gcc-multilib g++-multilib
```
* The libatomic package is required. (Install the 32-bit library at the same time, if necessary).

## Illegal instruction issue

***V8 JIT code generates FP instruction. Node.js does not work without hardware FPU.***

If you are running nodejs on the Atheros AR71xx/AR933x, MediaTek MT76x8, it will not work because there is no hardware FPU.
ARM cores without vfp or neon (such as ***bcm53xx***) will not work either.

## Enable Inspector

| Processor | ICU | Inspector |
| :---: | --- | :---: |
| 32bit | Disable | NO |
| 32bit | small-icu | YES |
| 64bit | Disable | NO |
| 64bit | small-icu | YES |
| 64bit | system-icu | YES |

 [Debugging Guide](https://nodejs.org/en/docs/guides/debugging-getting-started/) ***Nice to use Chrome DevTools.***

 Note: ICU currently supports only ***LITTLE ENDIAN***.

## Note about mDNS and homebridge
Read this document: [mDNS Options](https://github.com/homebridge/homebridge/wiki/mDNS-Options)

If you want, you can install the OpenWrt mDNS package (umdns / avahi-dbus-daemon / mdnsresponder).

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

Please read this document. '[Why avahi and bonjour don't work on your home network](https://github.com/culler/querierd/blob/master/README.rst)'

***IGMP-querier*** will solve your problem.

OpenWrt custom packages available: https://github.com/nxhack/openwrt-custom-packages

## Low memory
Specify v8-options.

```
--max_old_space_size=80
```

Or use [swap](https://openwrt.org/docs/guide-user/storage/fstab?s[]=swap).

## Modules that use pre-compiled binary (native module)
```
node-authenticate-pam
node-aws-crt
node-bcryp
node-bignum
node-bluetooth-hci-socket
node-bufferutil
node-deasync
node-ejdb2_node
node-epoll
node-expat
node-ffi-napi			(ffi-napi, ref-napi)
node-fuse-bindings
node-hid
node-pty-prebuilt-multiarch
node-i2c-bus
node-leveldown
node-megahash
node-mdns
node-net-ping			(raw-socket)
node-openzwave-shared
node-pi-spi
node-pty
node-rpio
node-serialport-bindings
node-sleep
node-spi-device
node-sqlite3
node-statvfs
node-ubus
node-usb
node-utf-8-validate
node-zigbee2mqtt		(@serialport/bindings,unix-dgram)
```
Other modules can be installed by 'npm install'.

## Package Guidelines

See [CONTRIBUTING.md](https://github.com/openwrt/packages/blob/master/CONTRIBUTING.md) file.
