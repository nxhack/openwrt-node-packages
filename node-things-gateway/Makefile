# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=things-gateway
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=0.3.1
PKG_RELEASE:=1

PKG_SOURCE_PROTO:=git
PKG_SOURCE_URL:=https://github.com/mozilla-iot/gateway.git
PKG_SOURCE_SUBDIR:=$(PKG_NAME)-$(PKG_VERSION)
PKG_SOURCE_VERSION:=27e70ba07f7de2683027b16b6418fd91f7590900
PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.xz
PKG_MIRROR_HASH:=1e99b0353217a870b833258643a178049040c6e6ebf85695921157dd62938920

PKG_BUILD_DEPENDS:=node/host
PKG_USE_MIPS16:=0

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=MPL-2.0
PKG_LICENSE_FILES:=LICENSE

include $(INCLUDE_DIR)/package.mk

define Package/node-things-gateway
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=Things Gateway by Mozilla
  URL:=http://iot.mozilla.org/gateway
  DEPENDS:=+node +node-npm +libusb-1.0 node-openzwave-shared +python-pip +openssl-util
  USERID:=mozilla-iot:mozilla-iot
endef

define Package/node-things-gateway/description
 Web of Things gateway. The “Web of Things” (WoT) is the idea of taking the lessons learned from the World Wide Web and applying them to IoT. It’s about creating a decentralized Internet of Things by giving Things URLs on the web to make them linkable and discoverable, and defining a standard data model and APIs to make them interoperable.
endef

NODEJS_CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))

define Build/Compile
	(cd $(PKG_BUILD_DIR); \
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_arch=$(NODEJS_CPU) \
	npm_config_nodedir=$(STAGING_DIR)/usr/ \
	npm_config_cache=$(TMP_DIR)/npm-cache \
	npm_config_tmp=$(TMP_DIR)/npm-tmp \
	PREFIX="$(PKG_INSTALL_DIR)/usr/" \
	npm install --build-from-source --target_arch=$(NODEJS_CPU))
	rm -rf $(TMP_DIR)/npm-tmp
	rm -rf $(TMP_DIR)/npm-cache
endef

define Package/node-things-gateway/install
	$(INSTALL_DIR) $(1)/usr/share/$(PKG_NPM_NAME)
	$(CP) $(PKG_BUILD_DIR)/{package.json,LICENSE,README.md} \
		$(1)/usr/share/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/{global.d.ts,*.sh,pagekite.py} \
		$(1)/usr/share/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/{config,doc,image} \
		$(1)/usr/share/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/{node_modules,src,ssl} \
		$(1)/usr/share/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/{static,tools} \
		$(1)/usr/share/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/{tsconfig.json,webpack.config.js} \
		$(1)/usr/share/$(PKG_NPM_NAME)/

	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) ./files/mozilla-iot-run $(1)/usr/bin
	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) ./files/mozilla-iot-gateway.init $(1)/etc/init.d/mozilla-iot-gateway
endef

$(eval $(call BuildPackage,node-things-gateway))
