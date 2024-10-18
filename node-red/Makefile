# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=node-red
PKG_NAME:=$(PKG_NPM_NAME)
PKG_VERSION:=4.0.5
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=https://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_HASH:=2babe48282a3cc9e9a40547e5ef0c99fcd1c77b7d2a40a12977a6559a8d29784

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=Apache-2.0
PKG_LICENSE_FILES:=LICENSE

PKG_BUILD_DEPENDS:=node/host node-clean-modules/host
PKG_BUILD_PARALLEL:=1
PKG_BUILD_FLAGS:=no-mips16

include $(INCLUDE_DIR)/package.mk

define Package/node-red
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=A visual tool for wiring the Internet of Things
  URL:=https://nodered.org/
  DEPENDS:=+node +node-npm +node-bcrypt +node-bufferutil +node-utf-8-validate
endef

define Package/node-red/description
 A visual tool for wiring the Internet of Things
endef

TAR_OPTIONS+= --strip-components 1
TAR_CMD=$(HOST_TAR) -C $(1) $(TAR_OPTIONS)

NODEJS_CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))
TMPNPM:=$(shell mktemp -u XXXXXXXXXX)
NPM_CACHE_DIR:=$(if $(call qstrip,$(CONFIG_NODEJS_NPM_CACHE_DIR)),$(call qstrip,$(CONFIG_NODEJS_NPM_CACHE_DIR)),$(TMP_DIR))

TARGET_CFLAGS+=$(FPIC)
TARGET_CPPFLAGS+=$(FPIC)

define Package/node-red/conffiles
/etc/config/node-red
endef

define Build/Compile
	cd $(PKG_BUILD_DIR); \
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_nodedir=$(STAGING_DIR)/usr/ \
	$(if $(CONFIG_NODEJS_NPM_KEEP_CACHE), npm_config_cache=$(NPM_CACHE_DIR)/npm-cache-$(PKG_NPM_NAME),npm_config_cache=$(TMP_DIR)/npm-cache-$(TMPNPM)) \
	npm install --prefer-offline --no-audit --global-style --install-strategy=shallow --no-save --omit=dev --no-package-lock --omit=optional --no-optional --prefer-dedupe
	clean-modules -y -D $(PKG_BUILD_DIR)/node_modules "!**/*.png" "!**/example/" "!**/examples/"
	rm -rf $(TMP_DIR)/npm-cache-$(TMPNPM)
	rm -f $(PKG_BUILD_DIR)/node_modules/.package-lock.json
	find $(PKG_BUILD_DIR)/node_modules -type d -empty -print0 | xargs -0 -r rmdir || true
	#rm -rf $(PKG_BUILD_DIR)/node_modules/@node-red/nodes/node_modules/ajv/lib
	rm -rf $(PKG_BUILD_DIR)/node_modules/@node-red/util/node_modules/moment/min
	rm -rf $(PKG_BUILD_DIR)/node_modules/@node-red/util/node_modules/moment/src
	rm -rf $(PKG_BUILD_DIR)/node_modules/@node-red/util/node_modules/moment/locale
endef

define Package/node-red/install
	$(INSTALL_DIR) $(1)/usr/lib/node/$(PKG_NPM_NAME)
	$(CP) $(PKG_BUILD_DIR)/{package.json,LICENSE} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/{*.md,*.js} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/{node_modules,bin,lib} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(INSTALL_DIR) $(1)/usr/bin
	$(LN) ../lib/node/$(PKG_NPM_NAME)/red.js $(1)/usr/bin/node-red
	$(LN) ../lib/node/$(PKG_NPM_NAME)/bin/node-red-pi $(1)/usr/bin/node-red-pi
	$(LN) ../lib/node/$(PKG_NPM_NAME)/node_modules/node-red-admin/node-red-admin.js \
		$(1)/usr/bin/node-red-admin
	$(INSTALL_DIR) $(1)/etc/config
	$(INSTALL_BIN) ./files/node-red.conf $(1)/etc/config/node-red
	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) ./files/node-red.init $(1)/etc/init.d/node-red
	$(INSTALL_DIR) $(1)/usr/lib/node_modules
	$(LN) ../node/$(PKG_NPM_NAME) $(1)/usr/lib/node_modules/$(PKG_NPM_NAME)
endef

define Package/node-red/postrm
#!/bin/sh
rm /usr/lib/node_modules/node-red || true
rm -rf /usr/lib/node/node-red || true
endef

$(eval $(call BuildPackage,node-red))
