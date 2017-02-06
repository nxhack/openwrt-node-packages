#
# Copyright (C) 2016 LEDE project
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=babel
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=v6.19.0
PKG_RELEASE:=8

PKG_SOURCE_PROTO:=git
PKG_SOURCE_URL:=https://github.com/babel/babel.git
PKG_SOURCE_SUBDIR:=$(PKG_NAME)-$(PKG_VERSION)
PKG_SOURCE_VERSION:=754a6ed8c0106b42147a356457079f5f0208d902
PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION)-$(PKG_SOURCE_VERSION).tar.xz

PKG_BUILD_DEPENDS:=node/host
PKG_NODE_VERSION:=4.7.3
PKG_USE_MIPS16:=0

PKG_MAINTAINER:=
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=

include $(INCLUDE_DIR)/host-build.mk
include $(INCLUDE_DIR)/package.mk

define Package/node-babel/default
  DEPENDS:=+node
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=BABEL $(1) for JavaScript.
  URL:=https://babeljs.io/
endef

define Package/node-babel
  $(call Package/node-babel/default,cli)
endef

define Package/node-babel-preset-latest
  $(call Package/node-babel/default,preset-latest)
endef

define Package/node-babel/description
 The compiler for writing next generation JavaScript
endef

CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))

define Build/Compile/module
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_arch=$(CPU) \
	npm_config_nodedir=$(BUILD_DIR)/node-v$(PKG_NODE_VERSION)/ \
	npm_config_cache=$(BUILD_DIR)/node-v$(PKG_NODE_VERSION)/npm-cache \
	PREFIX="$(PKG_INSTALL_DIR)/usr/" \
	npm install --build-from-source --target_arch=$(CPU) -g $(PKG_BUILD_DIR)/packages/$(1)/
endef

define Build/Compile
	$(call Build/Compile/module,babel-cli)
	$(call Build/Compile/module,babel-preset-latest)
endef

define Package/node-babel/install
	mkdir -p $(1)/usr/lib/node/babel-cli
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/babel-cli/* $(1)/usr/lib/node/babel-cli/
	mkdir -p $(1)/usr/bin
	$(LN) ../lib/node/babel-cli/bin/babel.js $(1)/usr/bin/babel
	$(LN) ../lib/node/babel-cli/bin/babel-doctor.js $(1)/usr/bin/babel-doctor
	$(LN) ../lib/node/babel-cli/bin/babel-external-helpers.js $(1)/usr/bin/babel-external-helpers
	$(LN) ../lib/node/babel-cli/bin/babel-node.js $(1)/usr/bin/babel-node
endef

define Package/node-babel-preset-latest/install
	mkdir -p $(1)/usr/lib/node/babel-preset-latest
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/babel-preset-latest/* $(1)/usr/lib/node/babel-preset-latest/
endef

define Host/Compile/module
	npm_config_nodedir=$(BUILD_DIR)/node-v$(PKG_NODE_VERSION)/ \
	npm_config_cache=$(BUILD_DIR)/node-v$(PKG_NODE_VERSION)/npm-cache \
	PREFIX="$(STAGING_DIR_HOST)" \
	npm install -g $(HOST_BUILD_DIR)/packages/$(1)/
endef

define Host/Compile
	$(call Host/Compile/module,babel-cli)
	$(call Host/Compile/module,babel-preset-latest)
endef

define Host/Install
endef

$(eval $(call HostBuild))
$(eval $(call BuildPackage,node-babel))
$(eval $(call BuildPackage,node-babel-preset-latest))

