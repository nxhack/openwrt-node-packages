#
# Copyright (C) 2016 LEDE project
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=ideino-linino-lib
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=0.1.2
PKG_RELEASE:=15

PKG_SOURCE_PROTO:=git
PKG_SOURCE_URL:=https://github.com/ideino/ideino-linino-lib.git
PKG_SOURCE_SUBDIR:=$(PKG_NAME)-$(PKG_VERSION)
PKG_SOURCE_VERSION:=7f65c03d2dafe1d861fda6096c2ab7d031b7b31d
PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION)-$(PKG_SOURCE_VERSION).tar.xz

PKG_BUILD_DEPENDS:=node/host
PKG_NODE_VERSION:=6.9.3
PKG_USE_MIPS16:=0

PKG_MAINTAINER:=
PKG_LICENSE:=
PKG_LICENSE_FILES:=

include $(INCLUDE_DIR)/package.mk

define Package/node-ideino-linino-lib
  DEPENDS:=+node
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=library for ideino-linino
  URL:=https://github.com/ideino/ideino-linino-lib
endef

define Package/node-ideino-linino-lib/description
 library for ideino-linino
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

define Package/node-ideino-linino-lib/install
	mkdir -p $(1)/usr/lib/node
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/* $(1)/usr/lib/node/
endef

$(eval $(call BuildPackage,node-ideino-linino-lib))

