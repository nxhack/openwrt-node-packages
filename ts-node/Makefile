# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=ts-node
PKG_NAME:=$(PKG_NPM_NAME)
PKG_VERSION:=10.9.2
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=https://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_HASH:=0290b8a665925d581da75499425c7156b1f433619af62b0ea51d159c18dff968

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=LICENSE

PKG_BUILD_DEPENDS:=node/host
PKG_BUILD_PARALLEL:=1
PKG_BUILD_FLAGS:=no-mips16

include $(INCLUDE_DIR)/package.mk

define Package/ts-node
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=TypeScript execution environment and REPL for node.js
  URL:=https://typestrong.org/ts-node/
  DEPENDS:=+node +node-npm
endef

define Package/ts-node/description
 ts-node is a TypeScript execution engine and REPL for Node.js.
 It JIT transforms TypeScript into JavaScript, enabling you to directly execute TypeScript on Node.js without precompiling. This is accomplished by hooking node's module loading APIs, enabling it to be used seamlessly alongside other Node.js tools and libraries.
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
	npm install --prefer-offline --no-audit --global-style --install-strategy=shallow --no-save --omit=dev --no-package-lock --ignore-scripts
	rm -rf $(TMP_DIR)/npm-cache-$(TMPNPM)
	rm -f $(PKG_BUILD_DIR)/node_modules/.package-lock.json
	find $(PKG_BUILD_DIR)/node_modules -type d -empty -print0 | xargs -0 -r rmdir || true
endef

define Package/ts-node/install
	$(INSTALL_DIR) $(1)/usr/lib/node/$(PKG_NPM_NAME)
	$(CP) $(PKG_BUILD_DIR)/{package.json,LICENSE,*.md,esm.mjs,tsconfig.*.json} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/{node_modules,transpilers,dist,dist-raw} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/{register,esm,node12,node14,node16} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(INSTALL_DIR) $(1)/usr/bin
	$(LN) ../lib/node/$(PKG_NPM_NAME)/dist/bin.js $(1)/usr/bin/ts-node
	$(LN) ../lib/node/$(PKG_NPM_NAME)/dist/bin-script-deprecated.js $(1)/usr/bin/ts-script
	$(LN) ../lib/node/$(PKG_NPM_NAME)/dist/bin-script.js $(1)/usr/bin/ts-node-script
	$(LN) ../lib/node/$(PKG_NPM_NAME)/dist/bin-cwd.js $(1)/usr/bin/ts-node-cwd
	$(LN) ../lib/node/$(PKG_NPM_NAME)/dist/bin-transpile.js $(1)/usr/bin/ts-node-transpile-only
	$(INSTALL_DIR) $(1)/usr/lib/node_modules
	$(LN) ../node/$(PKG_NPM_NAME) $(1)/usr/lib/node_modules/$(PKG_NPM_NAME)
	chmod +x $(1)/usr/lib/node/$(PKG_NPM_NAME)/dist/bin.js
	chmod +x $(1)/usr/lib/node/$(PKG_NPM_NAME)/dist/bin-script-deprecated.js
	chmod +x $(1)/usr/lib/node/$(PKG_NPM_NAME)/dist/bin-script.js
	chmod +x $(1)/usr/lib/node/$(PKG_NPM_NAME)/dist/bin-cwd.js
	chmod +x $(1)/usr/lib/node/$(PKG_NPM_NAME)/dist/bin-transpile.js
endef

define Package/ts-node/postrm
#!/bin/sh
rm /usr/lib/node_modules/ts-node || true
rm -rf /usr/lib/node/ts-node || true
endef

$(eval $(call BuildPackage,ts-node))
