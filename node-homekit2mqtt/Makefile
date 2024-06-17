# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=homekit2mqtt
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=1.1.2
PKG_RELEASE:=2

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=https://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_HASH:=bfffe0f4e514eeb6cfeab42df1256634183a384cc09c787acc593942d1a186ad

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=LICENSE

PKG_BUILD_DEPENDS:=node/host
PKG_BUILD_PARALLEL:=1
PKG_BUILD_FLAGS:=no-mips16

include $(INCLUDE_DIR)/package.mk

define Package/node-homekit2mqtt
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=HomeKit to MQTT bridge
  URL:=https://www.npmjs.com/package/homekit2mqtt
  DEPENDS:=+node +node-hap-nodejs +node-homebridge-camera-ffmpeg +node-mqtt
endef

define Package/node-homebridge-camera-ffmpeg/description
 HomeKit to MQTT bridge. (Depends on HAP-NodeJS by KhaosT, all credits belong to him.)
 This project follows the mqtt-smarthome architecture. I'm using this to control a multitude of MQTT-connected "Things" in my home automation through Siri and with HomeKit apps.
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

define Package/node-homekit2mqtt/install
	$(INSTALL_DIR) $(1)/usr/lib/node/$(PKG_NPM_NAME)
	$(CP) $(PKG_BUILD_DIR)/{*.json,LICENSE,*.md,*.js} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/{node_modules,characteristics,services,ui} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(INSTALL_DIR) $(1)/usr/bin
	$(LN) ../lib/node/$(PKG_NPM_NAME)/index.js $(1)/usr/bin/homekit2mqtt
	$(INSTALL_DIR) $(1)/usr/lib/node_modules
	$(LN) ../node/$(PKG_NPM_NAME) $(1)/usr/lib/node_modules/$(PKG_NPM_NAME)
endef

define Package/node-homekit2mqtt/postrm
#!/bin/sh
rm /usr/lib/node_modules/homekit2mqtt || true
rm -rf /usr/lib/node/homekit2mqtt || true
endef

$(eval $(call BuildPackage,node-homekit2mqtt))
