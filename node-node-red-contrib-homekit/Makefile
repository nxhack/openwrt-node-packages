# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=node-red-contrib-homekit
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=0.2.1
PKG_RELEASE:=4

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=http://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_HASH:=d9e92e1ce23f152c17a4457243a56ee5f1923ff76b89629595e88406af6c2c19

PKG_BUILD_DEPENDS:=node/host
PKG_USE_MIPS16:=0

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=Apache-2.0
PKG_LICENSE_FILES:=LICENSE

include $(INCLUDE_DIR)/package.mk

define Package/node-node-red-contrib-homekit
  # need select 'y' libavahi-compat-libdnssd and libavahi-dbus-support
  #  for InstallDev libdns_sd.so
  DEPENDS:=+node libavahi-compat-libdnssd libavahi-dbus-support
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=nodes to simulate Apple HomeKit devices
  URL:=http://nodered.org/
endef

define Package/node-node-red-contrib-homekit/description
 Node-RED nodes to simulate Apple HomeKit devices
endef

NODEJS_CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))

TARGET_CFLAGS+=-I$(STAGING_DIR)/usr/include/avahi-compat-libdns_sd

define Build/Prepare
	$(INSTALL_DIR) $(PKG_BUILD_DIR)
endef

define Build/Compile
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_arch=$(NODEJS_CPU) \
	npm_config_nodedir=$(STAGING_DIR)/usr/ \
	npm_config_cache=$(STAGING_DIR)/usr/share/node/npm-cache \
	PREFIX="$(PKG_INSTALL_DIR)/usr/" \
	npm install --build-from-source --target_arch=$(NODEJS_CPU) -g $(DL_DIR)/$(PKG_SOURCE)
endef

define Package/node-node-red-contrib-homekit/install
	$(INSTALL_DIR) $(1)/usr/lib/node
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/* $(1)/usr/lib/node/
endef

$(eval $(call BuildPackage,node-node-red-contrib-homekit))
