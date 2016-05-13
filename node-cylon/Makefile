#
# Copyright (C) 2014-2016 Arduino LLC
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=cylon
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=0.23.0
PKG_RELEASE:=1

PKG_SOURCE_PROTO:=git
PKG_SOURCE_URL:=https://github.com/hybridgroup/cylon-firmata.git
PKG_SOURCE_VERSION:=f4803d9b32e877933ec55b6aed235d83cd1d22fd
PKG_SOURCE_SUBDIR:=$(PKG_NAME)-$(PKG_SOURCE_VERSION)
PKG_SOURCE:=$(PKG_NAME)-$(PKG_SOURCE_VERSION).tar.gz

PKG_BUILD_DEPENDS:=node/host
PKG_NODE_VERSION:=4.4.4
PKG_USE_MIPS16:=0

PKG_MAINTAINER:=John Crispin <blogic@openwrt.org>
PKG_LICENSE:=Apache-2.0
PKG_LICENSE_FILE:=LICENSE

include $(INCLUDE_DIR)/package.mk

define Package/node-cylon/default
  DEPENDS:=+node $(2)
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=Cylon module for Arduino and other microcontrollers using the Firmata protocol
  URL:=https://www.npmjs.com/package/cylon-firmata
endef

define Package/node-cylon
  $(call Package/node-cylon/default,Core)
endef

define Package/node-cylon-i2c
  $(call Package/node-cylon/default,I2C,+node-cylon)
endef

define Package/node-cylon-gpio
  $(call Package/node-cylon/default,GPIO,+node-cylon)
endef

define Package/node-cylon-firmata
  $(call Package/node-cylon/default,Firmata,+node-cylon-gpio +node-cylon-i2c +node-arduino-firmata)
endef

define Package/node-cylon/description
 Cylon module for Arduino and other microcontrollers using the Firmata protocol
endef

define Build/Prepare
	/bin/tar xzf $(DL_DIR)/$(PKG_SOURCE) -C $(PKG_BUILD_DIR) --strip-components 1
	$(Build/Patch)
endef

CPU:=$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH))))

define Build/Compile
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_arch=$(CPU) \
	npm_config_nodedir=$(BUILD_DIR)/node-v$(PKG_NODE_VERSION)/ \
	npm_config_cache=$(BUILD_DIR)/node-v$(PKG_NODE_VERSION)/npm-cache \
	PREFIX="$(PKG_INSTALL_DIR)/usr/" \
	$(STAGING_DIR)/host/bin/npm install --build-from-source --target_arch=$(CPU) -g $(PKG_BUILD_DIR)
endef

define Package/node-cylon/install
	mkdir -p $(1)/usr/lib/node/cylon
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/cylon-firmata/node_modules/cylon/* $(1)/usr/lib/node/cylon/
endef

define Package/node-cylon-i2c/install
	mkdir -p $(1)/usr/lib/node/cylon-i2c
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/cylon-firmata/node_modules/cylon-i2c/* $(1)/usr/lib/node/cylon-i2c/
endef

define Package/node-cylon-gpio/install
	mkdir -p $(1)/usr/lib/node/cylon-gpio
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/cylon-firmata/node_modules/cylon-gpio/* $(1)/usr/lib/node/cylon-gpio/
endef

define Package/node-cylon-firmata/install
	mkdir -p $(1)/usr/lib/node/cylon-firmata
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/cylon-firmata/{index.js,lib,LICENSE,package.json,README.md,RELEASES.md,spec} $(1)/usr/lib/node/cylon-firmata/
endef

$(eval $(call BuildPackage,node-cylon))
$(eval $(call BuildPackage,node-cylon-i2c))
$(eval $(call BuildPackage,node-cylon-gpio))
$(eval $(call BuildPackage,node-cylon-firmata))

