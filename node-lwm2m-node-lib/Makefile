#
# Copyright (C) 2017 LEDE project
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=lwm2m-node-lib
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=1.0.0
PKG_RELEASE:=3

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=http://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_HASH:=b731b8cdf759fdf5445d9c2ebc90c71d64557ed05d31ab321da2102026d12f8d

PKG_BUILD_DEPENDS:=node/host
PKG_USE_MIPS16:=0

PKG_MAINTAINER:=
PKG_LICENSE:=AGPL-3.0
PKG_LICENSE_FILES:=

include $(INCLUDE_DIR)/package.mk

define Package/node-lwm2m-node-lib
  DEPENDS:=+node
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=Library for building OMA Lightweight M2M
  URL:=https://www.npmjs.org/package/lwm2m-node-lib
endef

define Package/node-lwm2m-node-lib/description
 The Open Mobile Alliance Lightweight M2M protocol is a machine to machine communication protocol built over COAP, and meant to communicate resource constrained devices. The protocol defines two roles for the devices: a Lightweight M2M Client (the constrained device) and a Lightweight M2M Server (meant to consume the device data and control its execution).
endef

NODEJS_CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))

define Build/Prepare
	$(INSTALL_DIR) $(PKG_BUILD_DIR)
endef

define Build/Compile
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_arch=$(NODEJS_CPU) \
	npm_config_nodedir=$(STAGING_DIR_HOSTPKG)/ \
	npm_config_cache=$(STAGING_DIR_HOSTPKG)/share/node/npm-cache \
	PREFIX="$(PKG_INSTALL_DIR)/usr/" \
	npm install --build-from-source --target_arch=$(NODEJS_CPU) -g $(DL_DIR)/$(PKG_SOURCE)
endef

define Package/node-lwm2m-node-lib/install
	$(INSTALL_DIR) $(1)/usr/lib/node
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/* $(1)/usr/lib/node/
	$(INSTALL_DIR) $(1)/usr/bin
	$(LN) ../lib/node/lwm2m-node-lib/bin/iotagent-lwm2m-client.js $(1)/usr/bin/iotagent-lwm2m-client
	$(LN) ../lib/node/lwm2m-node-lib/bin/iotagent-lwm2m-server.js $(1)/usr/bin/iotagent-lwm2m-server
endef

$(eval $(call BuildPackage,node-lwm2m-node-lib))
