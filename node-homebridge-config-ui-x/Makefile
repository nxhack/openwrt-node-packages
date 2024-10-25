# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=homebridge-config-ui-x
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=4.62.0
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=https://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_HASH:=ecbefdc49e8d3a3b51dce1276b586110bda37a098baa539b6e8aaea4e909c6e2

PKG_BUILD_DEPENDS:=node/host node-clean-modules/host
PKG_BUILD_FLAGS:=no-mips16

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=LICENSE

include $(INCLUDE_DIR)/package.mk

define Package/node-homebridge-config-ui-x
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=Homebridge Config UI X
  URL:=https://www.npmjs.org/package/homebridge-config-ui-x
  DEPENDS:=+node +node-homebridge +sudo +node-homebridge-node-pty-prebuilt-multiarch +node-bufferutil +node-utf-8-validate
endef

define Package/node-homebridge-config-ui-x/description
 Homebridge Config UI X is a web based management tool for Homebridge that allows you to manage all aspects of your Homebridge setup.

 Run as root:
    hb-service install --user homebridge -U /usr/share/homebridge
    hb-service restart

 *** The hb-service command is not full compatible with the openwrt environment. ***
 *** You can edit config.json using the Homebridge Config UI X. ***

      See: https://github.com/oznu/homebridge-config-ui-x/wiki/Manual-Configuration
           https://github.com/oznu/homebridge-config-ui-x/wiki/Manual-Configuration#logs-from-custom-command
           https://github.com/oznu/homebridge-config-ui-x/wiki/Manual-Configuration#sudo-mode

        "platforms": [
            {
              "platform": "config",
              "name": "Config",
              "port": 8581,
              "restart": "sudo /etc/init.d/homebridge restart",
              "sudo": true,
              "log": {
                "method": "custom",
                "command": "sudo logread -f -l 100 -e homebridge"
              }
            }
        ]
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
	npm install --prefer-offline --no-audit --global-style --install-strategy=shallow --no-save --omit=dev --no-package-lock --prefer-dedupe
	rm -rf $(TMP_DIR)/npm-cache-$(TMPNPM)
	rm -f $(PKG_BUILD_DIR)/node_modules/.package-lock.json
	find $(PKG_BUILD_DIR)/node_modules -type d -empty -print0 | xargs -0 -r rmdir || true
	rm -rf $(PKG_BUILD_DIR)/node_modules/./fastify/node_modules/ajv/lib
	clean-modules -y -D $(PKG_BUILD_DIR)/node_modules "!**/*.png" "**/*.d.ts" "**/@types/**" \
		"**/.nvmrc" "**/.c8rc.json" "**/.taprc" "**/.airtap.yml" "**/.husky/" \
		"**/.runkit_example.js" "**/.gitkeep" "**/.nojekyll" \
		"**/esm/" "**/esm-debug/" "**/esm2015/" "**/esm5/" "**/*.esm.*" "**/esm.*" \
		"**/.hidden" "**/.nojekyll" "**/.??*.json" "**/.??*.yaml" "**/*.esm5.*" "**/esm5.*"
endef

define Package/node-homebridge-config-ui-x/install
	$(INSTALL_DIR) $(1)/opt/$(PKG_NPM_NAME)
	$(CP) $(PKG_BUILD_DIR)/{*.json,*.md} \
		$(1)/opt/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/{node_modules,dist,public} \
		$(1)/opt/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/LICENSE \
		$(1)/opt/$(PKG_NPM_NAME)/
	$(INSTALL_DIR) $(1)/usr/bin
	$(LN) /opt/$(PKG_NPM_NAME)/dist/bin/hb-service.js $(1)/usr/bin/hb-service
	$(LN) /opt/$(PKG_NPM_NAME)/dist/bin/standalone.js $(1)/usr/bin/homebridge-config-ui-x
	$(CP) ./files/openwrt.js $(1)/opt/$(PKG_NPM_NAME)/dist/bin/platforms/
	$(INSTALL_DIR) $(1)/usr/lib/node_modules
	$(LN) /opt/$(PKG_NPM_NAME) $(1)/usr/lib/node_modules/$(PKG_NPM_NAME)
	chmod +x $(1)/opt/$(PKG_NPM_NAME)/dist/bin/hb-service.js
	chmod +x $(1)/opt/$(PKG_NPM_NAME)/dist/bin/standalone.js

	$(INSTALL_DIR) $(1)/usr/share/dbus-1/interfaces
	$(CP) ./files/org.freedesktop.Avahi.Server.xml $(1)/usr/share/dbus-1/interfaces/
	$(INSTALL_DIR) $(1)/etc/sudoers.d
	$(CP) ./files/010_homebridge $(1)/etc/sudoers.d
	chmod 0440 $(1)/etc/sudoers.d/010_homebridge
endef

define Package/node-homebridge-config-ui-x/postrm
#!/bin/sh
rm /usr/lib/node_modules/homebridge-config-ui-x || true
rm -rf /opt/homebridge-config-ui-x || true
endef

$(eval $(call BuildPackage,node-homebridge-config-ui-x))
