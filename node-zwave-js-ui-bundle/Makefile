# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=zwave-js-ui-bundle
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=9.5.1
PKG_RELEASE:=1

PKG_SOURCE_PROTO:=git
PKG_SOURCE_URL:=https://github.com/zwave-js/zwave-js-ui.git
PKG_SOURCE_SUBDIR:=$(PKG_NAME)-$(PKG_VERSION)
PKG_SOURCE_VERSION:=1f4cc1f9feaef9dbe6e393f37bfc12e755d51d97
PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.xz
PKG_MIRROR_HASH:=409b97823d52dd52d178f69cef28b72ce162bdae75fdb00144c83cceb2f7c1b0

PKG_MAINTAINER:=David Woodhouse <dwmw2@infradead.org>
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=LICENSE

PKG_BUILD_DEPENDS:=node/host node-clean-modules/host node-esbuild/host node-terser/host
PKG_BUILD_PARALLEL:=1
PKG_BUILD_FLAGS:=no-mips16

include $(INCLUDE_DIR)/package.mk

define Package/node-zwave-js-ui-bundle
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=Z-Wave control panel UI and MQTT gateway
  URL:=https://www.npmjs.org/package/zwave-js-ui-bundle
  DEPENDS:=+node +node-bufferutil +node-utf-8-validate +node-serialport-bindings-cpp
endef

define Package/node-zwave-js-ui-bundle/description
 Z-Wave control panel UI and MQTT gateway
endef

define Package/node-zwave-js-ui-bundle/conffiles
/etc/zwave-js-ui-bundle/
endef

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
	npm install --no-audit --global-style --install-strategy=shallow --build-from-source --target_arch=$(NODEJS_CPU)
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
	rm -f $(PKG_BUILD_DIR)/node_modules/.package-lock.json
	find $(PKG_BUILD_DIR)/node_modules -type d -empty -print0 | xargs -0 rmdir || true
	rm -rf $(PKG_BUILD_DIR)/build/node_modules/@serialport
endef

define Package/node-zwave-js-ui-bundle/install
	$(INSTALL_DIR) $(1)/opt/$(PKG_NPM_NAME)
	$(CP) $(PKG_BUILD_DIR)/{package.json,LICENSE,*.md} \
		$(1)/opt/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/build \
		$(1)/opt/$(PKG_NPM_NAME)/
	$(INSTALL_DIR) $(1)/usr/bin
	$(LN) /opt/$(PKG_NPM_NAME)/build/index.js $(1)/usr/bin/zwave-js-ui-bundle
	$(INSTALL_DIR) $(1)/usr/lib/node_modules
	$(LN) /opt/$(PKG_NPM_NAME) $(1)/usr/lib/node_modules/$(PKG_NPM_NAME)
	#$(INSTALL_DIR) $(1)/etc/init.d
	#$(INSTALL_BIN) ./files/zwave-js-ui-bundle.init $(1)/etc/init.d/zwave-js-ui-bundle
	#$(INSTALL_DIR) $(1)/etc/zwave-js-ui-bundle
	chmod +x $(1)/opt/$(PKG_NPM_NAME)/build/index.js
endef

define Package/node-zwave-js-ui-bundle/postrm
#!/bin/sh
rm /usr/lib/node_modules/zwave-js-ui-bundle || true
rm -rf /opt/zwave-js-ui-bundle || true
endef

$(eval $(call BuildPackage,node-zwave-js-ui-bundle))
