# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_SCOPE:=serialport
PKG_NPM_NAME:=list
PKG_NAME:=node-$(PKG_NPM_SCOPE)-$(PKG_NPM_NAME)
PKG_VERSION:=12.0.0
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NPM_SCOPE)-$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL_FILE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=https://registry.npmjs.org/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)/-/
PKG_HASH:=36deffd2616ea4dba190a7d8ae111a57aeacf20972e9091ac392e3ff01ed4355

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=LICENSE

PKG_BUILD_DEPENDS:=node/host
PKG_BUILD_PARALLEL:=1
PKG_BUILD_FLAGS:=no-mips16

include $(INCLUDE_DIR)/package.mk

define Package/node-serialport-list
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=SerialPort List
  URL:=https://www.npmjs.com/package/@serialport/list
  DEPENDS:=+node +node-serialport-bindings-cpp
endef

define Package/node-serialport-list/description
 The package @serialport/list will install the serialport-list cli tool which lists all available serial ports in different formats.
endef

TAR_OPTIONS+= --strip-components 1
TAR_CMD=$(HOST_TAR) -C $(1) $(TAR_OPTIONS)

NODEJS_CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))
TMPNPM:=$(shell mktemp -u XXXXXXXXXX)
NPM_CACHE_DIR:=$(if $(call qstrip,$(CONFIG_NODEJS_NPM_CACHE_DIR)),$(call qstrip,$(CONFIG_NODEJS_NPM_CACHE_DIR)),$(TMP_DIR))

TARGET_CFLAGS+=$(FPIC)
TARGET_CPPFLAGS+=$(FPIC)

define Build/Compile
	cd $(PKG_BUILD_DIR); \
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_nodedir=$(STAGING_DIR)/usr/ \
	$(if $(CONFIG_NODEJS_NPM_KEEP_CACHE), npm_config_cache=$(NPM_CACHE_DIR)/npm-cache-$(PKG_NPM_SCOPE)-$(PKG_NPM_NAME),npm_config_cache=$(TMP_DIR)/npm-cache-$(TMPNPM)) \
	npm install --prefer-offline --no-audit --global-style --install-strategy=shallow --no-save --omit=dev --no-package-lock
	rm -rf $(TMP_DIR)/npm-cache-$(TMPNPM)
	rm -f $(PKG_BUILD_DIR)/node_modules/.package-lock.json
	find $(PKG_BUILD_DIR)/node_modules -type d -empty -print0 | xargs -0 -r rmdir || true
endef

define Package/node-serialport-list/install
	$(INSTALL_DIR) $(1)/usr/lib/node/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)
	$(CP) $(PKG_BUILD_DIR)/{package.json,LICENSE,*.md} \
		$(1)/usr/lib/node/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)
	$(CP) $(PKG_BUILD_DIR)/{node_modules,dist} \
		$(1)/usr/lib/node/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)
	$(INSTALL_DIR) $(1)/usr/lib/node_modules/@$(PKG_NPM_SCOPE)
	$(LN) ../../node/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME) \
		$(1)/usr/lib/node_modules/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)
endef

define Package/node-serialport-list/postrm
#!/bin/sh
rm /usr/lib/node_modules/@serialport/list || true
rm -rf /usr/lib/node/@serialport/list || true
rmdir /usr/lib/node_modules/@serialport || true
rmdir /usr/lib/node/@serialport || true
endef

$(eval $(call BuildPackage,node-serialport-list))
