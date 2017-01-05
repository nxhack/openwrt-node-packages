#
# Copyright (C) 2016 LEDE project
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=sleep
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=5.0.0
PKG_RELEASE:=6

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=http://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_MD5SUM:=b99fb73989907ebd3f0c2da423a1ba01

PKG_BUILD_DEPENDS:=node/host
PKG_NODE_VERSION:=4.7.1
PKG_USE_MIPS16:=0

PKG_MAINTAINER:=
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=LICENSE.txt

include $(INCLUDE_DIR)/package.mk

define Package/node-sleep
  DEPENDS:=+node
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=Add sleep() and usleep() to nodejs
  URL:=https://www.npmjs.org/package/sleep
endef

define Package/node-sleep/description
 These calls will block execution of all JavaScript by halting Node.js' event loop!
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

define Package/node-sleep/install
	mkdir -p $(1)/usr/lib/node
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/* $(1)/usr/lib/node/
	mkdir -p $(1)/usr/bin
	$(LN) ../lib/node/sleep/bin/sleep $(1)/usr/bin/sleep
	$(LN) ../lib/node/sleep/bin/sleep $(1)/usr/bin/sleepuv
	$(LN) ../lib/node/sleep/bin/sleep $(1)/usr/bin/usleep
	$(LN) ../lib/node/sleep/bin/sleep $(1)/usr/bin/usleepuv
endef

$(eval $(call BuildPackage,node-sleep))

