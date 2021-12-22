# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=zigbee2mqtt
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=1.22.1
PKG_RELEASE:=7

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=https://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_HASH:=2b0376248a891662626a9f8429cabac5e2eb7bb1054f6cbdf37a936b16bc9ac2

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=GPL-3.0
PKG_LICENSE_FILES:=LICENSE

PKG_BUILD_DEPENDS:=node/host node-modclean/host
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
	rm $(PKG_BUILD_DIR)/node_modules/zigbee-herdsman/npm-shrinkwrap.json
	rm $(PKG_BUILD_DIR)/node_modules/zigbee-herdsman-converters/npm-shrinkwrap.json
	rm -f $(PKG_BUILD_DIR)/node_modules/zigbee2mqtt-frontend/dist/report.html
	rm -f $(PKG_BUILD_DIR)/node_modules/zigbee2mqtt-frontend/dist/*.map
	rm -f $(PKG_BUILD_DIR)/node_modules/zigbee2mqtt-frontend/dist/*/*.map
	rm -rf $(PKG_BUILD_DIR)/node_modules/zigbee-herdsman-converters/node_modules/zigbee-herdsman
	rm -rf $(PKG_BUILD_DIR)/node_modules/moment/min
	rm -rf $(PKG_BUILD_DIR)/node_modules/moment/src
	rm -rf $(PKG_BUILD_DIR)/node_modules/moment/locale
	rm -rf $(PKG_BUILD_DIR)/node_modules/winston-syslog/node_modules/unix-dgram/build/Release/.deps
	rm -rf $(PKG_BUILD_DIR)/node_modules/winston-syslog/node_modules/unix-dgram/build/Release/obj.target
	rm -rf $(PKG_BUILD_DIR)/node_modules/winston-syslog/node_modules/unix-dgram/src
	rm -rf $(PKG_BUILD_DIR)/node_modules/zigbee-herdsman/node_modules/@serialport/bindings/build/Release/.deps
	rm -rf $(PKG_BUILD_DIR)/node_modules/zigbee-herdsman/node_modules/@serialport/bindings/build/Release/obj.target
	rm -rf $(PKG_BUILD_DIR)/node_modules/zigbee-herdsman/node_modules/@serialport/bindings/src
	rm -rf $(PKG_BUILD_DIR)/node_modules/rimraf/node_modules/balanced-match/.github
	rm -rf $(PKG_BUILD_DIR)/node_modules/zigbee-herdsman/.github
	rm -rf $(PKG_BUILD_DIR)/node_modules/zigbee-herdsman/node_modules/node-abi/.github
	rm -rf $(PKG_BUILD_DIR)/node_modules/zigbee-herdsman/node_modules/node-abi/.circleci
	rm -rf $(PKG_BUILD_DIR)/node_modules/mqtt/node_modules/mqtt-packet/.github
	rm -rf $(PKG_BUILD_DIR)/node_modules/mqtt/node_modules/balanced-match/.github
	rm -rf $(PKG_BUILD_DIR)/node_modules/mqtt/node_modules/help-me/.github
	rm -rf $(PKG_BUILD_DIR)/node_modules/ajv/node_modules/json-schema-traverse/.github
	rm -f $(PKG_BUILD_DIR)/node_modules/winston/node_modules/logform/.babelrc
	rm -f $(PKG_BUILD_DIR)/node_modules/winston/node_modules/winston-transport/.babelrc
	rm -f $(PKG_BUILD_DIR)/node_modules/zigbee-herdsman/.babelrc.js
	rm -f $(PKG_BUILD_DIR)/node_modules/zigbee-herdsman/node_modules/@serialport/bindings/.prebuild-installrc
	modclean --no-progress -r --patterns="default:safe" --additional-patterns="*.d.ts,*.gypi,*.mk,*.Makefile" \
	         --path $(PKG_BUILD_DIR) --ignore="examples,example*"
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
