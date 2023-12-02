# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_SCOPE:=aminya
PKG_NPM_NAME:=node-gyp-build
PKG_NAME:=node-$(PKG_NPM_SCOPE)-$(PKG_NPM_NAME)
PKG_VERSION:=4.5.0-aminya.5
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NPM_SCOPE)-$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL_FILE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=https://registry.npmjs.org/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)/-/
PKG_HASH:=b442a2bc27c07e2d904459ebde8027e268901e3a3a6faf3bac02bb6d7b1e23f7

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=LICENSE

HOST_BUILD_DEPENDS:=node/host
HOST_BUILD_PARALLEL:=1

PKG_BUILD_DEPENDS:=node/host
PKG_BUILD_PARALLEL:=1
PKG_BUILD_FLAGS:=no-mips16

include $(INCLUDE_DIR)/host-build.mk
include $(INCLUDE_DIR)/package.mk

define Package/node-aminya-node-gyp-build
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=Build tool and bindings loader for node-gyp that supports prebuilds
  URL:=https://www.npmjs.com/package/@aminya/node-gyp-build
  DEPENDS:=+node +node-gyp
endef

define Package/node-aminya-node-gyp-build/description
 Build tool and bindings loader for node-gyp that supports prebuilds
 Fork created because of https://github.com/prebuild/node-gyp-build/pull/55
endef

TAR_OPTIONS+= --strip-components 1
TAR_CMD=$(HOST_TAR) -C $(1) $(TAR_OPTIONS)

NODEJS_CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))
TMPNPM:=$(shell mktemp -u XXXXXXXXXX)
HOSTTMPNPM:=$(shell mktemp -u XXXXXXXXXX)
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
	find $(PKG_BUILD_DIR)/node_modules -type d -empty -print0 | xargs -0 rmdir || true
endef

define Package/node-aminya-node-gyp-build/install
	$(INSTALL_DIR) $(1)/usr/lib/node/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)
	$(CP) $(PKG_BUILD_DIR)/{package.json,LICENSE} \
		$(1)/usr/lib/node/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/{*.js,*.md} \
		$(1)/usr/lib/node/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)/
	$(INSTALL_DIR) $(1)/usr/bin
	$(LN) ../lib/node/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)/bin.js $(1)/usr/bin/aminya-node-gyp-build
	$(LN) ../lib/node/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)/optional.js $(1)/usr/bin/aminya-node-gyp-build-optional
	$(LN) ../lib/node/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)/build-test.js $(1)/usr/bin/aminya-node-gyp-build-test
	$(INSTALL_DIR) $(1)/usr/lib/node_modules/@$(PKG_NPM_SCOPE)
	$(LN) ../../node/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME) \
		$(1)/usr/lib/node_modules/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)
endef

define Package/node-aminya-node-gyp-build/postrm
#!/bin/sh
rm /usr/lib/node_modules/@aminya/node-gyp-build || true
rm -rf /usr/lib/node/@aminya/node-gyp-build || true
endef

define Host/Compile
	cd $(HOST_BUILD_DIR); \
	$(HOST_MAKE_VARS) \
	npm_config_nodedir=$(STAGING_DIR)/usr/ \
	$(if $(CONFIG_NODEJS_NPM_KEEP_CACHE), npm_config_cache=$(NPM_CACHE_DIR)/host-npm-cache-$(PKG_NPM_NAME),npm_config_cache=$(TMP_DIR)/npm-cache-$(HOSTTMPNPM)) \
	npm install --prefer-offline --no-audit --global-style --install-strategy=shallow --no-save --omit=dev --no-package-lock --ignore-scripts
	rm -rf $(TMP_DIR)/npm-cache-$(HOSTTMPNPM)
	rm -f $(HOST_BUILD_DIR)/node_modules/.package-lock.json
	find $(HOST_BUILD_DIR)/node_modules -type d -empty -print0 | xargs -0 rmdir || true
endef

define Host/Install
	$(INSTALL_DIR) $(1)/lib/node_modules/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)
	$(CP) $(HOST_BUILD_DIR)/{package.json,LICENSE} \
		$(1)/lib/node_modules/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)/
	$(CP) $(HOST_BUILD_DIR)/{*.js,*.md} \
		$(1)/lib/node_modules/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)/
	$(INSTALL_DIR) $(1)/bin
	$(LN) ../lib/node_modules/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)/bin.js $(1)/bin/aminya-node-gyp-build
	$(LN) ../lib/node_modules/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)/optional.js $(1)/bin/aminya-node-gyp-build-optional
	$(LN) ../lib/node_modules/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)/build-test.js $(1)/bin/aminya-node-gyp-build-test
endef

$(eval $(call HostBuild))
$(eval $(call BuildPackage,node-aminya-node-gyp-build))
