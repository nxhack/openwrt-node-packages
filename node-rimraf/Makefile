#
# Copyright (C) 2016 LEDE project
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=rimraf
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=2.5.4
PKG_RELEASE:=17

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=http://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_MD5SUM:=dc0610ea665f28511baa8bebcbe0f521

PKG_BUILD_DEPENDS:=node/host
PKG_NODE_VERSION:=4.8.2
PKG_USE_MIPS16:=0

PKG_MAINTAINER:=
PKG_LICENSE:=ISC
PKG_LICENSE_FILES:=LICENSE

include $(INCLUDE_DIR)/host-build.mk
include $(INCLUDE_DIR)/package.mk

define Package/node-rimraf
  DEPENDS:=+node
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=A deep deletion module for node (like rm -rf)
  URL:=https://www.npmjs.org/package/rimraf
endef

define Package/node-rimraf/description
 The UNIX command rm -rf for node
endef

define Build/Prepare
	/bin/tar xzf $(DL_DIR)/$(PKG_SOURCE) -C $(PKG_BUILD_DIR) --strip-components 1
	$(Build/Patch)
endef

define Host/Prepare
	/bin/tar xzf $(DL_DIR)/$(PKG_SOURCE) -C $(HOST_BUILD_DIR) --strip-components 1
	$(Host/Patch)
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

define Package/node-rimraf/install
	mkdir -p $(1)/usr/lib/node
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/* $(1)/usr/lib/node/
	mkdir -p $(1)/usr/bin
	$(LN) ../lib/node/rimraf/bin.js $(1)/usr/bin/rimraf
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
$(eval $(call BuildPackage,node-rimraf))

