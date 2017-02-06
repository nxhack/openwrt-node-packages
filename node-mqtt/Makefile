#
# Copyright (C) 2016 LEDE project
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=mqtt
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=2.1.3
PKG_RELEASE:=8

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=http://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_MD5SUM:=70a684bddfafcc77ed6e166cf79dda2b

PKG_BUILD_DEPENDS:=node/host node-uglify-js/host node-browserify/host
PKG_NODE_VERSION:=4.7.3
PKG_USE_MIPS16:=0

PKG_MAINTAINER:=
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=LICENSE.md

include $(INCLUDE_DIR)/package.mk

define Package/node-mqtt
  DEPENDS:=+node
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=A library for the MQTT protocol
  URL:=https://www.npmjs.org/package/mqtt
endef

define Package/node-mqtt/description
 MQTT.js is a client library for the MQTT protocol, written in JavaScript for node.js and the browser
endef

define Build/Prepare
	/bin/tar xzf $(DL_DIR)/$(PKG_SOURCE) -C $(PKG_BUILD_DIR) --strip-components 1
	$(Build/Patch)
endef

CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))

define Build/Compile
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_arch=$(CPU) \
	npm_config_nodedir=$(BUILD_DIR)/node-v$(PKG_NODE_VERSION)/ \
	npm_config_cache=$(BUILD_DIR)/node-v$(PKG_NODE_VERSION)/npm-cache \
	PREFIX="$(PKG_INSTALL_DIR)/usr/" \
	NODE_PATH="$(PKG_INSTALL_DIR)/usr/lib/node_modules/$(PKG_NPM_NAME)/node_modules" \
	npm install --build-from-source --target_arch=$(CPU) -g $(PKG_BUILD_DIR)
endef

define Package/node-mqtt/install
	mkdir -p $(1)/usr/lib/node
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/* $(1)/usr/lib/node/
	mkdir -p $(1)/usr/bin
	$(LN) ../lib/node/mqtt/mqtt.js $(1)/usr/bin/mqtt
	$(LN) ../lib/node/mqtt/bin/pub.js $(1)/usr/bin/mqtt_pub
	$(LN) ../lib/node/mqtt/bin/sub.js $(1)/usr/bin/mqtt_sub
endef

$(eval $(call BuildPackage,node-mqtt))

