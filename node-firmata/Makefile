#
# Copyright (C) 2016 LEDE Project
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=firmata
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=0.15.0
PKG_RELEASE:=2

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=http://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_MD5SUM:=b49e3ede0bff971978073cd5e277de50

PKG_BUILD_DEPENDS:=node/host
PKG_NODE_VERSION:=4.8.2
PKG_USE_MIPS16:=0

PKG_MAINTAINER:=
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=readme.md

include $(INCLUDE_DIR)/package.mk

define Package/node-firmata
  DEPENDS:=+node
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=Firmata protocol implementation for programmatic interaction with Arduino and Arduino compatible development boards
  URL:=https://www.npmjs.com/package/firmata
endef

define Package/node-firmata/description
 Firmata protocol implementation for programmatic interaction with Arduino and Arduino compatible development boards
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
	npm install --build-from-source --target_arch=$(CPU) -g $(PKG_BUILD_DIR)
endef

define Package/node-firmata/install
	mkdir -p $(1)/usr/lib/node
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/* $(1)/usr/lib/node/
	mkdir -p $(1)/usr/bin
	$(LN) ../lib/node/firmata/repl.js $(1)/usr/bin/firmata
endef

$(eval $(call BuildPackage,node-firmata))

