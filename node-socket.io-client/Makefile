#
# Copyright (C) 2014-2016 Arduino LLC
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=socket.io-client
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=1.4.5
PKG_RELEASE:=3

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=http://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_MD5SUM:=6da8b878f6c2a0f68426c84a19f1755f

PKG_BUILD_DEPENDS:=node/host
PKG_NODE_VERSION:=4.4.3
PKG_USE_MIPS16:=0

include $(INCLUDE_DIR)/package.mk

define Package/node-socket.io-client
  DEPENDS:=+node +node-ws
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=Socket.IO client for the browser and node.js
  URL:=https://www.npmjs.org/package/socket.io-client
endef

define Package/node-socket.io-client/description
 Socket.IO client for the browser and node.js
endef

CPU:=$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))

LDFLAGS=-L$(TOOLCHAIN_DIR)/lib/ -Wl,-rpath-link $(TOOLCHAIN_DIR)/lib/ -L$(STAGING_DIR)/lib

define Build/Prepare
	/bin/tar xzf $(DL_DIR)/$(PKG_SOURCE) -C $(PKG_BUILD_DIR) --strip-components 1
	$(Build/Patch)
endef

define Build/Compile
	$(MAKE_FLAGS) \
	npm_config_arch=$(CONFIG_ARCH) \
	npm_config_nodedir=$(BUILD_DIR)/node-v$(PKG_NODE_VERSION)/ \
	npm_config_cache=$(BUILD_DIR)/node-v$(PKG_NODE_VERSION)/npm-cache \
	PREFIX="$(PKG_INSTALL_DIR)/usr/" \
	$(STAGING_DIR)/host/bin/npm install --target_arch=$(CPU) -g $(PKG_BUILD_DIR)
endef

define Package/node-socket.io-client/install
	mkdir -p $(1)/usr/lib/node
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/* $(1)/usr/lib/node/
	rm -rf $(1)/usr/lib/node/$(PKG_NPM_NAME)/node_modules/ws
endef

$(eval $(call BuildPackage,node-socket.io-client))

