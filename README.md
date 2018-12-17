# OpenWrt Node.js Packages (nodejs)

## Description

OpenWrt/LEDE Node.js Packages : for trunk / openwrt-18.06 / lede-17.01

Note: Testing target only ar71xx. Probably works on MT7688(mipsel) and Raspberry Pi(arm, aarch64).

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
rm ./package/feeds/packages/node
rm ./package/feeds/packages/node-*
./scripts/feeds install -a -p node
```

## Note
OpenWrt Attitude Adjustment(12.09), Barrier Breaker(14.07), Chaos Calmer(15.05) are not supported.

If you want to try with Chaos Calmer(15.05), see [for-15.05 branch](https://github.com/nxhack/openwrt-node-packages/tree/for-15.05)


## Illegal instruction issue

***V8 JIT code DOES generate FP instructions. Node.js may not work without hardware FPU or kernel FPU emulation.***

If you are running nodejs on Atheros AR71xx, AR933x, You need to make a kernel with MIPS_FPU_EMULATOR option.

On Trunk branch, You can configure using menuconfig.
```
make menuconfig
```
> Global build settings  --->
>
> Kernel build options  --->
>
>  [*] Compile the kernel with MIPS FPU Emulator

On lede-17.01 branch, You can configure using kernel_menuconfig.
```
make kernel_menuconfig
```
> Kernel type  --->
>
> [*] MIPS FPU Emulator

Also ARM core without vfp or neon (***bcm53xx*** etc) not work. There is no solution in this case.

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

(3)
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
node-alljoyn			[mark @BROKEN]
node-arduino-firmata		(serialport)
node-authenticate-pam
node-bluetooth-hci-socket
node-bufferutil
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
node-net-ping			(raw-socket)
node-node-enocean-utils		(serialport)
node-node-expat
node-node-hid-stream		(node-hid)
node-node-hid
node-node-red			(bcrypt)
node-node-red-contrib-gpio	(johnny-five)
node-node-red-contrib-homekit	(mdns [need select 'y'[*] libavahi-compat-libdnssd for InstallDev libdns_sd.so], curve25519-n2, ed25519)
node-node-red-node-arduino	(firmata)
node-onoff
node-pi-spi
node-rpi-gpio			(epoll)
node-rpio
node-serialport
node-sleep
node-spi-device
node-sqlite3
node-statvfs
node-usb
node-utf-8-validate
```
Other modules can be installed by 'npm install'.

***If you want new module that requires pre-compiled binary (native module), please open issues.***

## Package Guidelines

See [CONTRIBUTING.md](https://github.com/openwrt/packages/blob/master/CONTRIBUTING.md) file.
