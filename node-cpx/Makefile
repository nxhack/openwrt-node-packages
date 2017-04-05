#
# Copyright (C) 2017 LEDE project
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=cpx
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=1.5.0
PKG_RELEASE:=2

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=http://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_MD5SUM:=0da1930edfd4d3ce52c695a76e33ff38

PKG_BUILD_DEPENDS:=node/host
PKG_NODE_VERSION:=4.8.2
PKG_USE_MIPS16:=0

PKG_MAINTAINER:=
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=LICENSE

include $(INCLUDE_DIR)/host-build.mk
include $(INCLUDE_DIR)/package.mk

define Package/node-cpx
  DEPENDS:=+node
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=Copy file globs, watching for changes
  URL:=https://www.npmjs.org/package/cpx
endef

define Package/node-cpx/description
 This module provides a CLI tool like cp, but with watching
endef

TAR_OPTIONS+= --strip-components 1
TAR_CMD=$(HOST_TAR) -C $(1) $(TAR_OPTIONS)

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

define Package/node-cpx/install
	mkdir -p $(1)/usr/lib/node
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/* $(1)/usr/lib/node/
	mkdir -p $(1)/usr/bin
	$(LN) ../lib/node/cpx/bin/index.js $(1)/usr/bin/cpx
endef

define Host/Compile
	npm_config_nodedir=$(BUILD_DIR)/node-v$(PKG_NODE_VERSION)/ \
	npm_config_cache=$(BUILD_DIR)/node-v$(PKG_NODE_VERSION)/npm-cache \
	PREFIX="$(STAGING_DIR_HOST)" \
	npm install -g $(HOST_BUILD_DIR)
endef

define Host/Install
endef

$(eval $(call HostBuild))
$(eval $(call BuildPackage,node-cpx))

