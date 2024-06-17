# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=websocket
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=1.0.35
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=https://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_HASH:=8a6934a292d6f50440476387530db0207e60a2e39aa0f6248ad7c27aee208741

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=Apache-2.0
PKG_LICENSE_FILES:=LICENSE

PKG_BUILD_DEPENDS:=node/host
PKG_BUILD_PARALLEL:=1
PKG_BUILD_FLAGS:=no-mips16

include $(INCLUDE_DIR)/package.mk

define Package/node-websocket
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=WebSocket Client & Server Implementation for Node
  URL:=https://www.npmjs.org/package/websocket
  DEPENDS:=+node +node-bufferutil +node-utf-8-validate
endef

define Package/node-websocket/description
 Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.
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
	npm install --prefer-offline --no-audit --global-style --install-strategy=shallow --no-save --omit=dev --no-package-lock
	rm -rf $(TMP_DIR)/npm-cache-$(TMPNPM)
	rm -f $(PKG_BUILD_DIR)/node_modules/.package-lock.json
	find $(PKG_BUILD_DIR)/node_modules -type d -empty -print0 | xargs -0 -r rmdir || true
endef

define Package/node-websocket/install
	$(INSTALL_DIR) $(1)/usr/lib/node/$(PKG_NPM_NAME)
	$(CP) $(PKG_BUILD_DIR)/{package.json,*.md} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/{LICENSE,index.js} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/{node_modules,lib,vendor} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(INSTALL_DIR) $(1)/usr/lib/node_modules
	$(LN) ../node/$(PKG_NPM_NAME) $(1)/usr/lib/node_modules/$(PKG_NPM_NAME)
endef

define Package/node-websocket/postrm
#!/bin/sh
rm /usr/lib/node_modules/websocket || true
rm -rf /usr/lib/node/websocket || true
endef

$(eval $(call BuildPackage,node-websocket))
