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
PKG_RELEASE:=1

PKG_SOURCE_PROTO:=git
PKG_SOURCE_URL:=https://github.com/babel/babel.git
PKG_SOURCE_SUBDIR:=$(PKG_NAME)-$(PKG_VERSION)
PKG_SOURCE_VERSION:=754a6ed8c0106b42147a356457079f5f0208d902
PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION)-$(PKG_SOURCE_VERSION).tar.xz

PKG_BUILD_DEPENDS:=node/host
PKG_NODE_VERSION:=6.9.1
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

define Package/node-babel-core
  $(call Package/node-babel/default,core)
endef

define Package/node-babel-polyfill
  $(call Package/node-babel/default,polyfill)
endef

define Package/node-babel-preset-es2015
  $(call Package/node-babel/default,preset-es2015)
endef

define Package/node-babel-plugin-transform-es2015-modules-umd
  $(call Package/node-babel/default,plugin-transform-es2015-modules-umd)
endef

define Package/node-babel/description
 The compiler for writing next generation JavaScript
endef

define Build/Configure
endef

CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))

define Build/Compile/module
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_arch=$(CPU) \
	npm_config_nodedir=$(BUILD_DIR)/node-v$(PKG_NODE_VERSION)/ \
	npm_config_cache=$(BUILD_DIR)/node-v$(PKG_NODE_VERSION)/npm-cache \
	PREFIX="$(PKG_INSTALL_DIR)/usr/" \
	NODE_PATH="$(PKG_INSTALL_DIR)/usr/lib/node_modules/$(PKG_NAME)/node_modules" \
	npm install --build-from-source --target_arch=$(CPU) -g $(PKG_BUILD_DIR)/packages/$(1)/
endef

define Build/Compile
	$(call Build/Compile/module,node-babel-cli)
	$(call Build/Compile/module,node-babel-core)
	$(call Build/Compile/module,node-babel-polyfill)
	$(call Build/Compile/module,node-babel-preset-es2015)
	$(call Build/Compile/module,node-babel-plugin-transform-es2015-modules-umd)
endef

define Package/node-babel/install
	mkdir -p $(1)/usr/lib/node/node-babel-cli
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/node-babel-cli/* $(1)/usr/lib/node/node-babel-cli/
endef

define Package/node-babel-core/install
	mkdir -p $(1)/usr/lib/node/node-babel-core
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/node-babel-core/* $(1)/usr/lib/node/node-babel-core/
endef

define Package/node-babel-polyfill/install
	mkdir -p $(1)/usr/lib/node/node-babel-polyfill
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/node-babel-polyfill/* $(1)/usr/lib/node/node-babel-polyfill/
endef

define Package/node-babel-preset-es2015/install
	mkdir -p $(1)/usr/lib/node/node-babel-preset-es2015
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/node-babel-preset-es2015/* $(1)/usr/lib/node/node-babel-preset-es2015/
endef

define Package/node-babel-plugin-transform-es2015-modules-umd/install
	mkdir -p $(1)/usr/lib/node/node-babel-plugin-transform-es2015-modules-umd
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/node-babel-plugin-transform-es2015-modules-umd/* $(1)/usr/lib/node/node-babel-plugin-transform-es2015-modules-umd/
endef

define Host/Compile/module
	npm_config_nodedir=$(BUILD_DIR)/node-v$(PKG_NODE_VERSION)/ \
	npm_config_cache=$(BUILD_DIR)/node-v$(PKG_NODE_VERSION)/npm-cache \
	PREFIX="$(HOST_BUILD_PREFIX)" \
	npm install -g $(PKG_BUILD_DIR)/packages/$(1)/
endef

define Host/Compile
	$(call Host/Compile/module,node-babel-cli)
	$(call Host/Compile/module,node-babel-core)
	$(call Host/Compile/module,node-babel-polyfill)
	$(call Host/Compile/module,node-babel-preset-es2015)
	$(call Host/Compile/module,node-babel-plugin-transform-es2015-modules-umd)
endef

define Host/Install
endef

$(eval $(call HostBuild))
$(eval $(call BuildPackage,node-babel))
$(eval $(call BuildPackage,node-babel-core))
$(eval $(call BuildPackage,node-babel-polyfill))
$(eval $(call BuildPackage,node-babel-preset-es2015))
$(eval $(call BuildPackage,node-babel-plugin-transform-es2015-modules-umd))

