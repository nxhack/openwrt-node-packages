# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=zwave-js-ui
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=9.5.1
PKG_RELEASE:=3

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=https://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_HASH:=489769de78ad0f494eac4fb2c0ff66d52857f095437932078e3997fd1b20baaa

PKG_MAINTAINER:=David Woodhouse <dwmw2@infradead.org>
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=LICENSE

PKG_BUILD_DEPENDS:=node/host node-clean-modules/host node-esbuild/host node-terser/host
PKG_BUILD_PARALLEL:=1
PKG_BUILD_FLAGS:=no-mips16

include $(INCLUDE_DIR)/package.mk

define Package/node-zwave-js-ui
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=Z-Wave control panel UI and MQTT gateway
  URL:=https://www.npmjs.org/package/zwave-js-ui
  DEPENDS:=+node +node-bufferutil +node-utf-8-validate +node-serialport-bindings-cpp
endef

define Package/node-zwave-js-ui/description
 Z-Wave control panel UI and MQTT gateway
endef

define Package/node-zwave-js-ui/conffiles
/etc/zwave-js-ui/
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
	npm install --prefer-offline --no-audit --global-style --install-strategy=shallow --no-save --omit=dev --no-package-lock --build-from-source --target_arch=$(NODEJS_CPU) --omit=optional --no-optional --prefer-dedupe
	sed s^api/bin/www.ts^server/bin/www.js^ -i $(PKG_BUILD_DIR)/esbuild.js
	ln -sf ../zwave-js/node_modules/@zwave-js/config $(PKG_BUILD_DIR)/node_modules/@zwave-js/config
	cd $(PKG_BUILD_DIR); \
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_nodedir=$(STAGING_DIR)/usr/ \
	$(if $(CONFIG_NODEJS_NPM_KEEP_CACHE), npm_config_cache=$(NPM_CACHE_DIR)/npm-cache-$(PKG_NPM_NAME),npm_config_cache=$(TMP_DIR)/npm-cache-$(TMPNPM)) \
	npm run bundle -- --minify
	rm -rf $(PKG_BUILD_DIR)/build/node_modules/@serialport
	ln -sf ../../@serialport $(PKG_BUILD_DIR)/build/node_modules/@serialport
	rm -rf $(TMP_DIR)/npm-cache-$(TMPNPM)
	rm -f $(PKG_BUILD_DIR)/node_modules/.package-lock.json
endef

define Package/node-zwave-js-ui/install
	$(INSTALL_DIR) $(1)/opt/$(PKG_NPM_NAME)
	$(CP) $(PKG_BUILD_DIR)/build/{dist,index.js,snippets,node_modules} \
		$(1)/opt/$(PKG_NPM_NAME)/
	$(INSTALL_DIR) $(1)/usr/bin
	$(LN) /opt/$(PKG_NPM_NAME)/index.js $(1)/usr/bin/zwave-js-ui
	$(INSTALL_DIR) $(1)/opt_modules
	$(LN) /opt/$(PKG_NPM_NAME) $(1)/opt_modules/$(PKG_NPM_NAME)
	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) ./files/zwave-js-ui.init $(1)/etc/init.d/zwave-js-ui
	$(INSTALL_DIR) $(1)/etc/zwave-js-ui
	chmod +x $(1)/opt/$(PKG_NPM_NAME)/index.js
endef

define Package/node-zwave-js-ui/postrm
#!/bin/sh
rm /usr/lib/node_modules/zwave-js-ui || true
rm -rf /opt/zwave-js-ui || true
endef

$(eval $(call BuildPackage,node-zwave-js-ui))
