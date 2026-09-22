# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=zwave-js-ui
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=11.24.1
PKG_RELEASE:=2

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=https://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_HASH:=ab837c60ed13a0e6837b52a80d723d4714cd399231659226b28732b545cb4dd2

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
	npm install --prefer-offline --no-audit --global-style --install-strategy=shallow --no-save --omit=dev --no-package-lock --build-from-source --target_arch=$(NODEJS_CPU) --omit=optional --no-optional --prefer-dedupe --legacy-peer-deps
	rm -rf $(TMP_DIR)/npm-cache-$(TMPNPM)
	rm -f $(PKG_BUILD_DIR)/node_modules/.package-lock.json
	find $(PKG_BUILD_DIR)/node_modules -type d -empty -print0 | xargs -0 -r rmdir || true
	rm -rf $(PKG_BUILD_DIR)/node_modules/archiver/node_modules/bare-url/prebuilds
	rm -rf $(PKG_BUILD_DIR)/node_modules/archiver/node_modules/bare-os/prebuilds
	rm -rf $(PKG_BUILD_DIR)/node_modules/archiver/node_modules/bare-fs/prebuilds
	rm -rf $(PKG_BUILD_DIR)/node_modules/archiver/node_modules/bare-path/prebuilds
	rm -rf $(PKG_BUILD_DIR)/node_modules/zwave-js/node_modules/@serialport/bindings-cpp/prebuilds
	rm -rf $(PKG_BUILD_DIR)/node_modules/zwave-js/node_modules/@serialport/bindings-cpp/src
	rm -rf $(PKG_BUILD_DIR)/node_modules/zwave-js/node_modules/moment/min
	rm -rf $(PKG_BUILD_DIR)/node_modules/zwave-js/node_modules/moment/src
	rm -rf $(PKG_BUILD_DIR)/node_modules/zwave-js/node_modules/moment/locale
	rm -rf $(PKG_BUILD_DIR)/node_modules/@zwave-js/winston-daily-rotate-file/node_modules/moment/min
	rm -rf $(PKG_BUILD_DIR)/node_modules/@zwave-js/winston-daily-rotate-file/node_modules/moment/src
	rm -rf $(PKG_BUILD_DIR)/node_modules/@zwave-js/winston-daily-rotate-file/node_modules/moment/locale
	rm -rf $(PKG_BUILD_DIR)/node_modules/@zwave-js/core/build/cjs/test/*.ts
	rm -rf $(PKG_BUILD_DIR)/node_modules/@zwave-js/core/build/cjs/test/*.map
	clean-modules -y -D $(PKG_BUILD_DIR)/node_modules "!**/*.png" "!**/@zwave-js/core/build/cjs/test/" \
		"!**/@zwave-js/core/build/esm/test/" "!**/doc/" \
		"**/*.d.ts" "**/@types/**" "**/obj.target/" "**/config.gypi" \
		"**/.nvmrc" "**/.devcontainer/" "**/.bowerrc" "**/.airtap.yml" "**/.test/" \
		"**/.notags" "**/.releaserc" "**/.dprint.jsonc" "**/.eslintrc" "**/locales/" \
		"**/esm-debug/" "**/esm-browser/" "**/esm-node/" "**/*.esm.*" "**/esm.*" \
		"**/binding.Makefile" "**/.deps/" "**/Makefile" "**/binding.gyp"
endef

define Package/node-zwave-js-ui/install
	$(INSTALL_DIR) $(1)/opt/$(PKG_NPM_NAME)
	$(CP) $(PKG_BUILD_DIR)/{package.json,LICENSE,*.md} \
		$(1)/opt/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/{server,dist,snippets,node_modules} \
		$(1)/opt/$(PKG_NPM_NAME)/
	$(INSTALL_DIR) $(1)/usr/bin
	$(LN) /opt/$(PKG_NPM_NAME)/server/bin/www.js $(1)/usr/bin/zwave-js-ui
	$(INSTALL_DIR) $(1)/usr/lib/node_modules
	$(LN) /opt/$(PKG_NPM_NAME) $(1)/usr/lib/node_modules/$(PKG_NPM_NAME)
	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) ./files/zwave-js-ui.init $(1)/etc/init.d/zwave-js-ui
	$(INSTALL_DIR) $(1)/etc/zwave-js-ui
	chmod +x $(1)/opt/$(PKG_NPM_NAME)/server/bin/www.js
	# for ESM
	$(INSTALL_DIR) $(1)/opt/$(PKG_NPM_NAME)/node_modules
	$(LN) /usr/lib/node/bufferutil $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) /usr/lib/node/utf-8-validate $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/ $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/pathe $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/json5 $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/json-logic-js $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/alcalzone-shared $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/triple-beam $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/reflect-metadata $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/fflate $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/dayjs $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/yocto-queue $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/yargs-parser $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/yargs $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/y18n $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/wrap-ansi $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/word-wrap $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/winston-transport $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/which $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/util-deprecate $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/uri-js $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/type-check $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/tslib $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/strip-ansi $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/string_decoder $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/string-width $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/source-map-support $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/source-map $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/signal-exit $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/shebang-regex $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/shebang-command $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/serialport $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/safe-stable-stringify $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/safe-buffer $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/retry $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/readable-stream $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/qified $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/punycode $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/prelude-ls $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/path-key $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/path-exists $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/p-timeout $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/p-queue $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/p-locate $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/p-limit $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/optionator $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/nrf-intel-hex $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/node-gyp-build $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/node-addon-api $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/natural-compare $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/ms $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/minimatch $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/mdns-server $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/logform $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/locate-path $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/levn $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/ky $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/keyv $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/json-stable-stringify-without-jsonify $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/json-schema-traverse $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/isexe $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/is-glob $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/is-extglob $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/inherits $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/imurmurhash $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/ignore $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/hookified $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/hashery $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/graceful-fs $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/glob-parent $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/get-east-asian-width $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/get-caller-file $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/flatted $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/flat-cache $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/find-up $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/file-entry-cache $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/fecha $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/fast-levenshtein $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/fast-json-stable-stringify $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/fast-deep-equal $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/eventemitter3 $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/esutils $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/estraverse $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/esrecurse $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/esquery $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/espree $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/eslint-visitor-keys $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/eslint-scope $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/eslint $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/escape-string-regexp $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/escalade $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/emoji-regex $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/dns-packet $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/deep-is $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/debug $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/cross-spawn $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/cliui $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/cacheable $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/buffer-from $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/brace-expansion $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/balanced-match $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/ansi-styles $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/ansi-regex $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/ansi-colors $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/ajv $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/acorn-jsx $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/acorn $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/@serialport $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/@leichtgewicht $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/@keyv $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/@humanwhocodes $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/@humanfs $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/@homebridge $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/@eslint-community $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/@eslint $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/@colors $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/@cacheable $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/@andrewbranch $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/@alcalzone $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ../zwave-js/node_modules/@zwave-js/config $(1)/opt/$(PKG_NPM_NAME)/node_modules/@zwave-js/
	$(LN) ../zwave-js/node_modules/@zwave-js/core $(1)/opt/$(PKG_NPM_NAME)/node_modules/@zwave-js/
	$(LN) ../zwave-js/node_modules/@zwave-js/shared $(1)/opt/$(PKG_NPM_NAME)/node_modules/@zwave-js/
	$(LN) ../zwave-js/node_modules/@zwave-js/waddle $(1)/opt/$(PKG_NPM_NAME)/node_modules/@zwave-js/
	$(LN) ../zwave-js/node_modules/@zwave-js/testing $(1)/opt/$(PKG_NPM_NAME)/node_modules/@zwave-js/
	$(LN) ../zwave-js/node_modules/@zwave-js/serial $(1)/opt/$(PKG_NPM_NAME)/node_modules/@zwave-js/
	$(LN) ../zwave-js/node_modules/@zwave-js/nvmedit $(1)/opt/$(PKG_NPM_NAME)/node_modules/@zwave-js/
	$(LN) ../zwave-js/node_modules/@zwave-js/host $(1)/opt/$(PKG_NPM_NAME)/node_modules/@zwave-js/
	$(LN) ../zwave-js/node_modules/@zwave-js/cc $(1)/opt/$(PKG_NPM_NAME)/node_modules/@zwave-js/
	$(LN) ./zwave-js/node_modules/alcalzone-shared $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/json-logic-js $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/json5 $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	$(LN) ./zwave-js/node_modules/pathe $(1)/opt/$(PKG_NPM_NAME)/node_modules/
	# for BUG
	$(INSTALL_DIR) $(1)/opt/$(PKG_NPM_NAME)/node_modules/zwave-js/build/esm/lib/controller/proprietary/zwave-me
	$(CP) ./files/License.js $(1)/opt/$(PKG_NPM_NAME)/node_modules/zwave-js/build/esm/lib/controller/proprietary/zwave-me/
endef

define Package/node-zwave-js-ui/postrm
#!/bin/sh
rm /usr/lib/node_modules/zwave-js-ui || true
rm -rf /opt/zwave-js-ui || true
endef

$(eval $(call BuildPackage,node-zwave-js-ui))
