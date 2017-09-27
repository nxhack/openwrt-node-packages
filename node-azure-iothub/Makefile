# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=azure-iothub
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=1.1.11
PKG_RELEASE:=5

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=http://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_HASH:=43cdca4b575718714075e23bcb154a923319f569d20c33d98108f434acf86e41

PKG_BUILD_DEPENDS:=node/host
PKG_USE_MIPS16:=0

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=

include $(INCLUDE_DIR)/package.mk

define Package/node-azure-iothub
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=Azure IoT SDK - IoT Hub
  URL:=https://www.npmjs.org/package/azure-iothub
  DEPENDS:=+node
endef

define Package/node-azure-iothub/description
 The Azure IoT Service SDK for Node.js helps you build applications that interact with your devices and manage their identities in your IoT hub
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
	PREFIX="$(PKG_INSTALL_DIR)/usr/" \
	npm install --no-cache --build-from-source --target_arch=$(NODEJS_CPU) -g $(DL_DIR)/$(PKG_SOURCE)
endef

define Package/node-azure-iothub/install
	$(INSTALL_DIR) $(1)/usr/lib/node
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/* $(1)/usr/lib/node/
endef

$(eval $(call BuildPackage,node-azure-iothub))
