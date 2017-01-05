# OpenWrt Node.js Packages (nodejs)

##Description

OpenWrt Node.js Packages : for Chaos Calmer

Note: Testing target only ar71xx.

##License

See:
- [OpenWrt license](http://wiki.openwrt.org/about/license)

##Usage

Add follow line to feeds.conf or feeds.conf.default
```
src-git node https://github.com/nxhack/openwrt-node-packages.git;for-15.05
```

Run
```
./scripts/feeds update node
./scripts/feeds install -a -p node
```

##Note
Tested OpenWrt Chaos Calmer(15.05)

Node version v4.x 'Argon' (LTS)
