#
# Copyright (C) 2016 LEDE project
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=nitrogen-leveldb-store
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=0.2.0
PKG_RELEASE:=20

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=http://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_MD5SUM:=21ed079e74c48bca6eb8afee187d9584

PKG_BUILD_DEPENDS:=node/host
PKG_NODE_VERSION:=4.8.0
PKG_USE_MIPS16:=0

PKG_MAINTAINER:=
PKG_LICENSE:=Apache-2.0
PKG_LICENSE_FILES:=

include $(INCLUDE_DIR)/package.mk

define Package/node-nitrogen-leveldb-store
  DEPENDS:=+node +node-nitrogen +node-level
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=This is the leveldb storage backend for devices to store credential information
  URL:=https://www.npmjs.org/package/nitrogen-leveldb-store
endef

define Package/node-nitrogen-leveldb-store/description
 Nitrogen is a platform for building connected devices. Nitrogen provides the authentication, authorization, and real time message passing framework so that you can focus on your device and application
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

define Package/node-nitrogen-leveldb-store/install
	mkdir -p $(1)/usr/lib/node
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/* $(1)/usr/lib/node/
endef

$(eval $(call BuildPackage,node-nitrogen-leveldb-store))

