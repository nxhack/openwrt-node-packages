#
# Copyright (C) 2016-2017 LEDE project
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=aws-sdk
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=2.36.0
PKG_RELEASE:=1

PKG_SOURCE_PROTO:=git
PKG_SOURCE_URL:=https://github.com/aws/aws-sdk-js.git
PKG_SOURCE_SUBDIR:=$(PKG_NAME)-$(PKG_VERSION)
PKG_SOURCE_VERSION:=42b7eead7802e662334bbfb08422833149983180
PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.xz
PKG_MIRROR_HASH:=77bdc4a72daa568b121f813862218ea1dee0c9fa5a10d5fb9b0ff97f3ca9603b

PKG_BUILD_DEPENDS:=node/host
PKG_NODE_VERSION:=4.8.2
PKG_USE_MIPS16:=0

PKG_MAINTAINER:=
PKG_LICENSE:=Apache-2.0
PKG_LICENSE_FILES:=LICENSE.txt

include $(INCLUDE_DIR)/package.mk

define Package/node-aws-sdk
  DEPENDS:=+node
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=AWS SDK for JavaScript
  URL:=https://www.npmjs.com/package/aws-sdk
endef

define Package/node-aws-sdk/description
 The official AWS SDK for JavaScript, available for browsers and mobile devices, or Node.js backends
endef

NODEJS_CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))

define Build/Compile
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_arch=$(NODEJS_CPU) \
	npm_config_nodedir=$(BUILD_DIR)/node-v$(PKG_NODE_VERSION)/ \
	npm_config_cache=$(BUILD_DIR)/node-v$(PKG_NODE_VERSION)/npm-cache \
	PREFIX="$(PKG_INSTALL_DIR)/usr/" \
	npm install --build-from-source --target_arch=$(NODEJS_CPU) -g $(PKG_BUILD_DIR)
endef

define Package/node-aws-sdk/install
	$(INSTALL_DIR) $(1)/usr/lib/node
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/* $(1)/usr/lib/node/
endef

$(eval $(call BuildPackage,node-aws-sdk))
