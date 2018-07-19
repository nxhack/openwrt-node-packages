# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=mqtt
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=2.18.2
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=http://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_HASH:=1b11f32033ca841dbd9379b1badfebf5e6c7dc70e3858524dc751844ab9a481e

PKG_BUILD_DEPENDS:=node/host
PKG_USE_MIPS16:=0

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=LICENSE.md

include $(INCLUDE_DIR)/package.mk

define Package/node-mqtt
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=A library for the MQTT protocol
  URL:=https://www.npmjs.org/package/mqtt
  DEPENDS:=+node
endef

define Package/node-mqtt/description
 MQTT.js is a client library for the MQTT protocol, written in JavaScript for node.js and the browser
endef

NODEJS_CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))

define Build/Prepare
	$(INSTALL_DIR) $(PKG_BUILD_DIR)
endef

define Build/Compile
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_arch=$(NODEJS_CPU) \
	npm_config_nodedir=$(STAGING_DIR)/usr/ \
	npm_config_cache=$(TMP_DIR)/npm-cache \
	npm_config_tmp=$(TMP_DIR)/npm-tmp \
	PREFIX="$(PKG_INSTALL_DIR)/usr/" \
	NODE_PATH="$(PKG_INSTALL_DIR)/usr/lib/node_modules/$(PKG_NPM_NAME)/node_modules" \
	npm install --build-from-source --target_arch=$(NODEJS_CPU) -g $(DL_DIR)/$(PKG_SOURCE)
	rm -rf $(TMP_DIR)/npm-tmp
	rm -rf $(TMP_DIR)/npm-cache
endef

define Package/node-mqtt/install
	$(INSTALL_DIR) $(1)/usr/lib/node
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/* $(1)/usr/lib/node/
	$(INSTALL_DIR) $(1)/usr/bin
	$(LN) ../lib/node/mqtt/mqtt.js $(1)/usr/bin/mqtt
	$(LN) ../lib/node/mqtt/bin/pub.js $(1)/usr/bin/mqtt_pub
	$(LN) ../lib/node/mqtt/bin/sub.js $(1)/usr/bin/mqtt_sub
endef

$(eval $(call BuildPackage,node-mqtt))
