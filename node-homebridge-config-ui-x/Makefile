# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=homebridge-config-ui-x
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=4.39.1
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=https://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_HASH:=15b4823f392470d0307eba9579c139a628a6fbc19aabdba17499f8b30e88cf0b

PKG_BUILD_DEPENDS:=node/host
PKG_USE_MIPS16:=0

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
  DEPENDS:=+node +node-homebridge +sudo +node-pty-prebuilt-multiarch
endef

define Package/node-homebridge-config-ui-x/description
 Homebridge Config UI X is a web based management tool for Homebridge that allows you to manage all aspects of your Homebridge setup.

 Run as root:
    hb-service install --user homebridge -U /usr/share/homebridge
    hb-service restart

 *** The hb-service command is not full compatible with the openwrt environment. ***
 *** You can edit config.json using the Homebridge Config UI X. ***

      See: https://github.com/oznu/homebridge-config-ui-x#configuration
           https://github.com/oznu/homebridge-config-ui-x#logs-from-custom-command

        "platforms": [
            {
              "platform": "config",
              "name": "Config",
              "port": 8581,
              "restart": "sudo /etc/init.d/homebridge restart",
              "sudo": true,
              "log": {
                "method": "custom",
                "command": "sudo logread -f -l 300 -e homebridge"
              }
            }
        ]
endef

TAR_OPTIONS+= --strip-components 1
TAR_CMD=$(HOST_TAR) -C $(1) $(TAR_OPTIONS)

NODEJS_CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))
TMPNPM:=$(shell mktemp -u XXXXXXXXXX)

TARGET_CFLAGS+=$(FPIC)
TARGET_CPPFLAGS+=$(FPIC)

define Build/Compile
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_arch=$(NODEJS_CPU) \
	npm_config_target_arch=$(NODEJS_CPU) \
	npm_config_build_from_source=true \
	npm_config_nodedir=$(STAGING_DIR)/usr/ \
	npm_config_prefix=$(PKG_INSTALL_DIR)/usr/ \
	npm_config_cache=$(TMP_DIR)/npm-cache-$(TMPNPM) \
	npm_config_tmp=$(TMP_DIR)/npm-tmp-$(TMPNPM) \
	npm install -g $(PKG_BUILD_DIR)
	rm -rf $(TMP_DIR)/npm-tmp-$(TMPNPM)
	rm -rf $(TMP_DIR)/npm-cache-$(TMPNPM)
endef

define Package/node-homebridge-config-ui-x/install
	$(INSTALL_DIR) $(1)/usr/lib/node/$(PKG_NPM_NAME)
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/$(PKG_NPM_NAME)/{*.json,*.md} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/$(PKG_NPM_NAME)/{node_modules,dist,public} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/$(PKG_NPM_NAME)/{LICENSE,*.js} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(INSTALL_DIR) $(1)/usr/bin
	$(LN) ../lib/node/$(PKG_NPM_NAME)/dist/bin/hb-service.js $(1)/usr/bin/hb-service
	$(LN) ../lib/node/$(PKG_NPM_NAME)/dist/bin/standalone.js $(1)/usr/bin/homebridge-config-ui-x
	$(CP) ./files/openwrt.js $(1)/usr/lib/node/$(PKG_NPM_NAME)/dist/bin/platforms/
	$(INSTALL_DIR) $(1)/usr/lib/node_modules
	$(LN) ../node/$(PKG_NPM_NAME) $(1)/usr/lib/node_modules/$(PKG_NPM_NAME)
endef

define Package/node-homebridge-config-ui-x/postrm
#!/bin/sh
rm /usr/lib/node_modules/homebridge-config-ui-x || true
rm -rf /usr/lib/node/homebridge-config-ui-x || true
endef

$(eval $(call BuildPackage,node-homebridge-config-ui-x))
