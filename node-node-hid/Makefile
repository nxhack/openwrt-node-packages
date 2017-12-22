#
# Copyright (C) 2015 OpenWrt.org
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=node-hid
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=0.5.7
PKG_RELEASE:=4

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=http://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_HASH:=78db1342df8417e98b2f450bebe8f02e0b3e1782231185ac5d5a86565be9c686

PKG_BUILD_DEPENDS:=node/host
PKG_USE_MIPS16:=0

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=MIT or X11
PKG_LICENSE_FILES:=

include $(INCLUDE_DIR)/package.mk
include $(INCLUDE_DIR)/nls.mk

define Package/node-node-hid
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=Access USB HID devices from node.js
  URL:=https://www.npmjs.com/package/node-hid
  DEPENDS:=+node +libusb-1.0 +hidapi
endef

define Package/node-node-hid/description
 Access USB HID devices from node.js
endef

NODEJS_CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))

TARGET_CFLAGS+=-I$(STAGING_DIR)/usr/include/libusb-1.0

define Build/Prepare
	$(INSTALL_DIR) $(PKG_BUILD_DIR)
endef

define Build/Compile
	git init $(PKG_BUILD_DIR)
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_arch=$(NODEJS_CPU) \
	npm_config_nodedir=$(STAGING_DIR)/usr/ \
	npm_config_cache=$(TMP_DIR)/npm-cache \
	npm_config_tmp=$(TMP_DIR)/npm-tmp \
	PREFIX="$(PKG_INSTALL_DIR)/usr/" \
	npm install --build-from-source --target_arch=$(NODEJS_CPU) -g $(DL_DIR)/$(PKG_SOURCE)
	npm_config_cache=$(TMP_DIR)/npm-cache \
	npm cache clean --force
endef

define Package/node-node-hid/install
	$(INSTALL_DIR) $(1)/usr/lib/node
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/* $(1)/usr/lib/node/
	$(INSTALL_DIR) $(1)/usr/bin
	$(LN) ../lib/node/node-hid/src/show-devices.js $(1)/usr/bin/hid-showdevices
endef

$(eval $(call BuildPackage,node-node-hid))
