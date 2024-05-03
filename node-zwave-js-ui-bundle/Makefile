# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=zwave-js-ui-bundle
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=9.12.0
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tar.gz
PKG_SOURCE_SUBDIR:=$(PKG_NAME)-$(PKG_VERSION)
PKG_SOURCE_URL_FILE:=v$(PKG_VERSION).tar.gz
PKG_SOURCE_URL:=https://github.com/zwave-js/zwave-js-ui/archive/refs/tags/
PKG_HASH:=9efc17ba3b2e5ac630645222cf79359ed1818730cf03dd25729a5b8a1343bc38
PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)-$(PKG_VERSION)

PKG_MAINTAINER:=David Woodhouse <dwmw2@infradead.org>
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=LICENSE

PKG_BUILD_DEPENDS:=node/host
PKG_BUILD_PARALLEL:=1
PKG_BUILD_FLAGS:=no-mips16

include $(INCLUDE_DIR)/package.mk

define Package/node-zwave-js-ui-bundle
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=Z-Wave control panel UI and MQTT gateway (Web app)
  URL:=https://zwave-js.github.io/zwave-js-ui/
  DEPENDS:=+node +node-bufferutil +node-utf-8-validate +node-serialport
endef

define Package/node-zwave-js-ui-bundle/description
 Z-Wave control panel UI and MQTT gateway.
 Bundled as a web app to compress file size.
endef

define Package/node-zwave-js-ui-bundle/conffiles
/opt/zwave-js-ui-bundle/
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
	$(if $(CONFIG_NODEJS_NPM_KEEP_CACHE), npm_config_cache=$(NPM_CACHE_DIR)/npm-cache-$(PKG_NPM_NAME),npm_config_cache=$(TMP_DIR)/npm-cache-$(TMPNPM)) \
	npm install --prefer-offline --no-audit
	cd $(PKG_BUILD_DIR); \
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_nodedir=$(STAGING_DIR)/usr/ \
	$(if $(CONFIG_NODEJS_NPM_KEEP_CACHE), npm_config_cache=$(NPM_CACHE_DIR)/npm-cache-$(PKG_NPM_NAME),npm_config_cache=$(TMP_DIR)/npm-cache-$(TMPNPM)) \
	npm run build
	cd $(PKG_BUILD_DIR); \
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_nodedir=$(STAGING_DIR)/usr/ \
	$(if $(CONFIG_NODEJS_NPM_KEEP_CACHE), npm_config_cache=$(NPM_CACHE_DIR)/npm-cache-$(PKG_NPM_NAME),npm_config_cache=$(TMP_DIR)/npm-cache-$(TMPNPM)) \
	npm run bundle
	rm -rf $(TMP_DIR)/npm-cache-$(TMPNPM)
	rm -rf $(PKG_BUILD_DIR)/build/node_modules/@serialport
endef

define Package/node-zwave-js-ui-bundle/install
	$(INSTALL_DIR) $(1)/opt/$(PKG_NPM_NAME)
	$(CP) $(PKG_BUILD_DIR)/{LICENSE,README.md,SECURITY.md} \
		$(1)/opt/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/build/* \
		$(1)/opt/$(PKG_NPM_NAME)/
	$(LN) /usr/lib/node/@serialport $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) /usr/lib/node/serialport $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) ./files/zwave-js-ui-bundle.init $(1)/etc/init.d/zwave-js-ui-bundle
	$(INSTALL_DIR) $(1)/etc/zwave-js-ui-bundle
endef

define Package/node-zwave-js-ui-bundle/postrm
#!/bin/sh
rm -rf /opt/zwave-js-ui-bundle || true
endef

$(eval $(call BuildPackage,node-zwave-js-ui-bundle))
