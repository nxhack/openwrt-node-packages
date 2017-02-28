#
# Copyright (C) 2016 LEDE project
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=modbus
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=0.0.14
PKG_RELEASE:=9

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=http://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_MD5SUM:=01fa3eacfb13bf7ba76ae5c26fda59e1

PKG_BUILD_DEPENDS:=node/host
PKG_NODE_VERSION:=4.8.0
PKG_USE_MIPS16:=0

PKG_MAINTAINER:=
PKG_LICENSE:=BSD
PKG_LICENSE_FILES:=

include $(INCLUDE_DIR)/package.mk

define Package/node-modbus
  DEPENDS:=+node +libmodbus
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=libmodbus binding
  URL:=https://www.npmjs.org/package/modbus
endef

define Package/node-modbus/description
 This is binding to native library libmodbus (http://libmodbus.org/)
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
	GNU_TARGET_NAME="$(GNU_TARGET_NAME)" \
	TARGET_CFLAGS="$(TARGET_CFLAGS)" \
	TARGET_CPPFLAGS="$(TARGET_CPPFLAGS)" \
	npm install --build-from-source --target_arch=$(CPU) -g $(PKG_BUILD_DIR)
endef

define Package/node-modbus/install
	mkdir -p $(1)/usr/lib/node
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/* $(1)/usr/lib/node/
endef

$(eval $(call BuildPackage,node-modbus))

