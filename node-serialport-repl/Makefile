# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_SCOPE:=serialport
PKG_NPM_NAME:=repl
PKG_NAME:=node-$(PKG_NPM_SCOPE)-$(PKG_NPM_NAME)
PKG_VERSION:=1.1.1
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=https://registry.npmjs.org/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)/-/
PKG_HASH:=9adb2dfee2b01bf8d12102a959e5e6a1ebd0aa9f69e4e2a883bf66be27a2fc66

PKG_BUILD_DEPENDS:=node/host
PKG_USE_MIPS16:=0

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=LICENSE

include $(INCLUDE_DIR)/package.mk

define Package/node-serialport-repl
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=SerialPort Repl
  URL:=https://www.npmjs.com/package/@serialport/repl
  DEPENDS:=+node +node-serialport
endef

define Package/node-serialport-repl/description
 The package @serialport/repl will install the serialport-repl cli tool which provides a nodejs repl for working with serialport. This is valuable when debugging.
endef

NODEJS_CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))

define Build/Prepare
	$(INSTALL_DIR) $(PKG_BUILD_DIR)
endef

define Build/Compile
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_arch=$(NODEJS_CPU) \
	npm_config_target_arch=$(NODEJS_CPU) \
	npm_config_build_from_source=true \
	npm_config_nodedir=$(STAGING_DIR)/usr/ \
	npm_config_prefix=$(PKG_INSTALL_DIR)/usr/ \
	npm_config_cache=$(TMP_DIR)/npm-cache \
	npm_config_tmp=$(TMP_DIR)/npm-tmp \
	npm install -g $(DL_DIR)/$(PKG_SOURCE)
	rm -rf $(TMP_DIR)/npm-tmp
	rm -rf $(TMP_DIR)/npm-cache
endef

define Package/node-serialport-repl/install
	$(INSTALL_DIR) $(1)/usr/lib/node
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/* $(1)/usr/lib/node/
	$(INSTALL_DIR) $(1)/usr/bin
	$(LN) ../lib/node/@serialport/repl/lib/repl.js $(1)/usr/bin/serialport-repl
endef

$(eval $(call BuildPackage,node-serialport-repl))
