# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=camera.ui-v2
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=2.0.14
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tar.gz
PKG_SOURCE_SUBDIR:=$(PKG_NAME)-$(PKG_VERSION)
PKG_SOURCE_URL_FILE:=server-v$(PKG_VERSION).tar.gz
PKG_SOURCE_URL:=https://github.com/cameraui/camera.ui/archive/refs/tags/
PKG_HASH:=dc3a05139ed0bdf6c888fa233298a32e2df035f5c18910faac351bdd3ad1c3d7
PKG_BUILD_DIR:=$(BUILD_DIR)/camera.ui-server-v$(PKG_VERSION)

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=LICENSE.md

PKG_BUILD_DEPENDS:=node/host
PKG_BUILD_PARALLEL:=1
PKG_BUILD_FLAGS:=no-mips16

include $(INCLUDE_DIR)/package.mk

define Package/node-camera.ui-v2
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=camera.ui-v2
  URL:=https://www.npmjs.com/package/camera.ui
  DEPENDS:=+node +node-pty +sudo +node-bufferutil +node-utf-8-validate
  USERID:=cameraui:cameraui
endef

define Package/node-camera.ui-v2/description
 A self-hosted platform for your security cameras — live viewing, 24/7 recording*, on-device AI detection, semantic search*, smart-home integration, and push notifications*, all built on an extensible plugin ecosystem for endless possibilities. Runs on hardware you own — no mandatory cloud, your footage stays with you.
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
	$(if $(CONFIG_NODEJS_NPM_KEEP_CACHE), npm_config_cache=$(NPM_CACHE_DIR)/npm-cache-$(PKG_PKG_NAME),npm_config_cache=$(TMP_DIR)/npm-cache-$(TMPNPM)) \
	npm install --prefer-offline --no-audit --global-style --install-strategy=shallow --no-save --omit=dev --no-package-lock --ignore-scripts
	rm -rf $(TMP_DIR)/npm-cache-$(TMPNPM)
	rm -f $(PKG_BUILD_DIR)/node_modules/.package-lock.json
	find $(PKG_BUILD_DIR)/node_modules -type d -empty -print0 | xargs -0 -r rmdir || true
endef

define Package/node-camera.ui-v2/install
	$(INSTALL_DIR) $(1)/usr/lib/node/$(PKG_NPM_NAME)
	$(CP) $(PKG_BUILD_DIR)/{package.json,*.md,version.date} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/{node_modules,dist} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(INSTALL_DIR) $(1)/usr/lib/node_modules
	$(LN) ../node/$(PKG_NPM_NAME) $(1)/usr/lib/node_modules/$(PKG_NPM_NAME)
	$(INSTALL_DIR) $(1)/usr/bin
	$(LN) ../lib/node/$(PKG_NPM_NAME)/dist/cameraui.js $(1)/usr/bin/cameraui
	$(CP) ./files/openwrt.js $(1)/usr/lib/node_modules/$(PKG_NPM_NAME)/dist/installer/
	chmod +x $(1)/usr/lib/node/$(PKG_NPM_NAME)/dist/cameraui.js
	$(INSTALL_DIR) $(1)/etc/sudoers.d
	$(CP) ./files/010_cameraui $(1)/etc/sudoers.d
	chmod 0440 $(1)/etc/sudoers.d/010_cameraui
	# TEST
	$(LN) /usr/lib/node/node-pty $(1)/usr/lib/node_modules/$(PKG_NPM_NAME)/node_modules/
	$(LN) /usr/lib/node/bufferutil $(1)/usr/lib/node_modules/$(PKG_NPM_NAME)/node_modules/
	$(LN) /usr/lib/node/utf-8-validate $(1)/usr/lib/node_modules/$(PKG_NPM_NAME)/node_modules/
endef

define Package/node-camera.ui-v2/postrm
#!/bin/sh
rm /usr/lib/node_modules/camera.ui-v2 || true
rm -rf /usr/lib/node/camera.ui-v2 || true
endef

$(eval $(call BuildPackage,node-camera.ui-v2))
