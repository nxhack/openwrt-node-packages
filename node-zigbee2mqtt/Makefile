# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=zigbee2mqtt
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=1.24.0
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=https://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_HASH:=e1678416c3f473ba599bd3aad438d4be846793d9878c86e38372845ec3c0ec23

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=GPL-3.0
PKG_LICENSE_FILES:=LICENSE

PKG_BUILD_DEPENDS:=node/host node-clean-modules/host
PKG_BUILD_PARALLEL:=1
PKG_USE_MIPS16:=0

include $(INCLUDE_DIR)/package.mk

define Package/node-zigbee2mqtt
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=Zigbee to MQTT bridge using Zigbee-herdsman
  URL:=https://github.com/Koenkk/zigbee2mqtt
  DEPENDS:=+node +node-bufferutil +node-utf-8-validate
endef

define Package/node-zigbee2mqtt/description
  Allows you to use your Zigbee devices without the vendor's bridge or gateway. It bridges events and allows you to control your Zigbee devices via MQTT. In this way you can integrate your Zigbee devices with whatever smart home infrastructure you are using.
endef

define Package/node-zigbee2mqtt/conffiles
/etc/zigbee2mqtt/configuration.yaml
/etc/zigbee2mqtt/
endef

TAR_OPTIONS+= --strip-components 1
TAR_CMD=$(HOST_TAR) -C $(1) $(TAR_OPTIONS)

NODEJS_CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))
TMPNPM:=$(shell mktemp -u XXXXXXXXXX)

TARGET_CFLAGS+=$(FPIC)
TARGET_CPPFLAGS+=$(FPIC)

define Build/Compile
	cd $(PKG_BUILD_DIR); \
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_nodedir=$(STAGING_DIR)/usr/ \
	npm_config_cache=$(TMP_DIR)/npm-cache-$(TMPNPM) \
	npm_config_tmp=$(TMP_DIR)/npm-tmp-$(TMPNPM) \
	npm install --production --global-style --no-save --omit=dev --no-package-lock --build-from-source --target_arch=$(NODEJS_CPU) --prefer-dedupe
	rm -rf $(PKG_BUILD_DIR)/node_modules/zigbee-herdsman-converters/node_modules/zigbee-herdsman
	rm -rf $(PKG_BUILD_DIR)/node_modules/ajv/lib
	rm -rf $(PKG_BUILD_DIR)/node_modules/moment/min
	rm -rf $(PKG_BUILD_DIR)/node_modules/moment/src
	rm -rf $(PKG_BUILD_DIR)/node_modules/moment/locale
	clean-modules -y -D $(PKG_BUILD_DIR)/node_modules --exclude "**/*.map.js" "**/*.png" \
		"**/example/" "**/examples/" --include "**/npm-shrinkwrap.json" "**/.babelrc.js" \
		"**/.prebuild-installrc" "**/obj.target/" "**/config.gypi" "**/binding.Makefile"
	rm -rf $(TMP_DIR)/npm-tmp-$(TMPNPM)
	rm -rf $(TMP_DIR)/npm-cache-$(TMPNPM)
	rm -f $(PKG_BUILD_DIR)/node_modules/.package-lock.json
	find $(PKG_BUILD_DIR)/node_modules -type d -empty -delete || true
endef

define Package/node-zigbee2mqtt/install
	$(INSTALL_DIR) $(1)/opt/$(PKG_NPM_NAME)
	$(CP) $(PKG_BUILD_DIR)/{package.json,LICENSE} \
		$(1)/opt/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/{*.md,*.js} \
		$(1)/opt/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/{node_modules,dist} \
		$(1)/opt/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/{data,scripts} \
		$(1)/opt/$(PKG_NPM_NAME)/
	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) ./files/zigbee2mqtt.init $(1)/etc/init.d/zigbee2mqtt
	$(INSTALL_DIR) $(1)/etc/zigbee2mqtt
	$(INSTALL_CONF) ./files/configuration.yaml $(1)/etc/zigbee2mqtt/configuration.yaml
	$(INSTALL_DIR) $(1)/usr/lib/node_modules
	$(LN) /opt/zigbee2mqtt $(1)/usr/lib/node_modules/zigbee2mqtt
endef

define Package/node-zigbee2mqtt/postrm
#!/bin/sh
rm /usr/lib/node_modules/zigbee2mqtt || true
rm -rf /opt/zigbee2mqtt || true
endef

$(eval $(call BuildPackage,node-zigbee2mqtt))
