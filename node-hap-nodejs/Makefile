# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=hap-nodejs
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=0.4.27
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=http://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_HASH:=713d27a048b834cc2e445dbc2c38ce47823b9a3dccb918573982186761438b3c

PKG_BUILD_DEPENDS:=node/host
PKG_USE_MIPS16:=0

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=Apache-2.0
PKG_LICENSE_FILES:=LICENSE

include $(INCLUDE_DIR)/package.mk

define Package/node-hap-nodejs
  # need select 'y' libavahi-compat-libdnssd and libavahi-dbus-support
  #  for InstallDev libdns_sd.so
  DEPENDS:=+node libavahi-compat-libdnssd libavahi-dbus-support
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=Node.js implementation of HomeKit Accessory Server
  URL:=https://www.npmjs.org/package/hap-nodejs
endef

define Package/node-hap-nodejs/description
 HAP-NodeJS is a Node.js implementation of HomeKit Accessory Server
endef

NODEJS_CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))

TARGET_CFLAGS+=-I$(STAGING_DIR)/usr/include/avahi-compat-libdns_sd

define Build/Prepare
	$(INSTALL_DIR) $(PKG_BUILD_DIR)
endef

define Build/Compile
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_arch=$(NODEJS_CPU) \
	npm_config_nodedir=$(STAGING_DIR_HOSTPKG)/ \
	npm_config_cache=$(STAGING_DIR_HOSTPKG)/share/node/npm-cache \
	PREFIX="$(PKG_INSTALL_DIR)/usr/" \
	npm install --build-from-source --target_arch=$(NODEJS_CPU) -g $(DL_DIR)/$(PKG_SOURCE)
endef

define Package/node-hap-nodejs/install
	$(INSTALL_DIR) $(1)/usr/lib/node
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/* $(1)/usr/lib/node/
endef

$(eval $(call BuildPackage,node-hap-nodejs))
