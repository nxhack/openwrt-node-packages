# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=zwave-js-ui
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=9.4.1
PKG_RELEASE:=3

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=https://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_HASH:=ea45b51074f5f25bdfe00542fdc49e3b482f62fc0e7608be6a2d07235121d802

PKG_MAINTAINER:=David Woodhouse <dwmw2@infradead.org>
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=LICENSE

PKG_BUILD_DEPENDS:=node/host node-clean-modules/host
PKG_BUILD_PARALLEL:=1
PKG_BUILD_FLAGS:=no-mips16

include $(INCLUDE_DIR)/package.mk

define Package/node-zwave-js-ui
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=Z-Wave control panel UI and MQTT gateway
  URL:=https://www.npmjs.org/package/zwave-js-ui
  DEPENDS:=+node +node-bufferutil +node-utf-8-validate
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
	rm -rf $(TMP_DIR)/npm-cache-$(TMPNPM)
	rm -f $(PKG_BUILD_DIR)/node_modules/.package-lock.json
	find $(PKG_BUILD_DIR)/node_modules -type d -empty -print0 | xargs -0 rmdir || true
	rm -rf $(PKG_BUILD_DIR)/node_modules/zwave-js/node_modules/@serialport/bindings-cpp/prebuilds
	rm -rf $(PKG_BUILD_DIR)/node_modules/zwave-js/node_modules/@serialport/bindings-cpp/src
	rm -rf $(PKG_BUILD_DIR)/node_modules/zwave-js/node_modules/moment/min
	rm -rf $(PKG_BUILD_DIR)/node_modules/zwave-js/node_modules/moment/src
	rm -rf $(PKG_BUILD_DIR)/node_modules/zwave-js/node_modules/moment/locale
	rm -rf $(PKG_BUILD_DIR)/node_modules/@zwave-js/winston-daily-rotate-file/node_modules/moment/min
	rm -rf $(PKG_BUILD_DIR)/node_modules/@zwave-js/winston-daily-rotate-file/node_modules/moment/src
	rm -rf $(PKG_BUILD_DIR)/node_modules/@zwave-js/winston-daily-rotate-file/node_modules/moment/locale
	clean-modules -y -D $(PKG_BUILD_DIR)/node_modules "!**/*.png" "!**/@zwave-js/core/build/test/" \
		"**/@zwave-js/core/build/test/*.ts" "**/@zwave-js/core/build/test/*.map" \
		"**/*.d.ts" "**/@types/**" "**/obj.target/" "**/config.gypi" \
		"**/.nvmrc" "**/.devcontainer/" "**/.bowerrc" "**/.airtap.yml" "**/.test/" \
		"**/.notags" "**/.releaserc" "**/.dprint.jsonc" "**/.eslintrc" \
		"**/binding.Makefile" "**/.deps/" "**/Makefile" "**/binding.gyp"
endef

define Package/node-zwave-js-ui/install
	$(INSTALL_DIR) $(1)/usr/lib/node/$(PKG_NPM_NAME)
	$(CP) $(PKG_BUILD_DIR)/{package.json,LICENSE,*.md} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/{server,dist,snippets,node_modules,public} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(INSTALL_DIR) $(1)/usr/bin
	$(LN) ../lib/node/$(PKG_NPM_NAME)/server/bin/www.js $(1)/usr/bin/zwave-js-ui
	$(INSTALL_DIR) $(1)/usr/lib/node_modules
	$(LN) ../node/$(PKG_NPM_NAME) $(1)/usr/lib/node_modules/$(PKG_NPM_NAME)
	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) ./files/zwave-js-ui.init $(1)/etc/init.d/zwave-js-ui
	$(INSTALL_DIR) $(1)/etc/zwave-js-ui
	chmod +x $(1)/usr/lib/node/$(PKG_NPM_NAME)/server/bin/www.js
endef

define Package/node-zwave-js-ui/postrm
#!/bin/sh
rm /usr/lib/node_modules/zwave-js-ui || true
rm -rf /usr/lib/node/zwave-js-ui || true
endef

$(eval $(call BuildPackage,node-zwave-js-ui))
