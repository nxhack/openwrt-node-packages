# OpenWrt Node.js Packages (nodejs)

## Description

OpenWrt Node.js Packages : for Chaos Calmer

## License

See [LICENSE](LICENSE) file.

## Usage

Add the following line to feeds.conf or feeds.conf.default.
```
src-git node https://github.com/nxhack/openwrt-node-packages.git;for-15.05
```

Run
```
./scripts/feeds update node
rm ./package/feeds/packages/node
rm ./package/feeds/packages/node-*
./scripts/feeds install -a -p node
```

## Note
Tested OpenWrt Chaos Calmer(15.05)

## Prepare for building node.js

***Please make sure to apply this patch before building. And rebuild the toolchain.***

```
patch -p1 < ./feeds/node/for_building_latest_node.patch
make toolchain/clean
make toolchain/compile
```

* These patches are based on the work of the OpenWrt/LEDE developers and the buildroot developers and @artynet.
   + https://github.com/artynet/openwrt-git/blob/openwrt-1505-setup-04/toolchain/gcc/patches/4.8-linaro/852-libstdcxx-uclibc-c99.patch
   + https://github.com/artynet/openwrt-git/blob/openwrt-1505-setup-04/toolchain/uClibc/patches-0.9.33.2/L001-uClibc-add-execvpe-function.patch
   + https://github.com/artynet/openwrt-git/blob/openwrt-1505-setup-04/toolchain/uClibc/patches-0.9.33.2/L002-libm_Add_missing_C99_float_ld_wrappers.patch
   + https://github.com/artynet/openwrt-git/blob/openwrt-1505-setup-04/toolchain/uClibc/patches-0.9.33.2/L003-force-obstack-free-strong-alias.patch

## Illegal instruction issue

***V8 JIT code generates FP instruction. Node.js does not work without hardware FPU or kernel FPU emulation.***

If you are running nodejs with Atheros AR 71xx, AR 933x, you need to create the ***kernel*** using the MIPS_FPU_EMULATOR option.

***(This means that you need to rebuild the firmware.)***

You can configure using ***kernel_menuconfig***.
```
make kernel_menuconfig
```
> Kernel type  --->
>
> [*] MIPS FPU Emulator

ARM cores without vfp or neon (such as ***bcm53xx***) will not work either. In this case, there is no solution.

## Note about avahi and homebridge
(1)
Some OpenWRT / Lede images have built in dnscrypt-proxy package, which by default listening on 5353 port.

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

Please read this document. '[Why avahi and bonjour don't work on your home network](https://bitbucket.org/marc_culler/querierd/)'

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
node-alljoyn
node-arduino-firmata		(serialport)
node-authenticate-pam
node-bluetooth-hci-socket
node-cylon-firmata		(serialport)
node-ejdb
node-epoll
node-ffi			(ffi, ref)
node-firmata			(serialport)
node-fuse-bindings
node-hashtable
node-homebridge			(mdns [need select 'y'[*] libavahi-compat-libdnssd for InstallDev libdns_sd.so], curve25519-n2, ed25519)
node-hap-nodejs			(mdns [need select 'y'[*] libavahi-compat-libdnssd for InstallDev libdns_sd.so], curve25519-n2, ed25519)
node-i2c-bus
node-ideino-linino-lib
node-johnny-five		(serialport)
node-leveldown
node-level			(leveldown)
node-mdns			[need select 'y'[*] libavahi-compat-libdnssd for InstallDev libdns_sd.so]
node-mknod
node-modbus
node-net-ping
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

***If you want a new module (native module) that requires a precompiled binary, please open the issue.***
