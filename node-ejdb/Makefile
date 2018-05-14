# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=ejdb
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=1.2.12-42
PKG_RELEASE:=6

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=http://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_HASH:=22aff6fe9baad4313bf1428736141493b3412a6d3bc49b1997b3f2270b82aeee

PKG_BUILD_DEPENDS:=node/host
PKG_USE_MIPS16:=0

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=LGPL-2.1
PKG_LICENSE_FILES:=LICENSE

include $(INCLUDE_DIR)/package.mk

define Package/node-ejdb
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=EJDB NodeJS binding
  URL:=https://www.npmjs.com/package/ejdb
  DEPENDS:=+node +libbz2 +liblzma
endef

define Package/node-ejdb/description
 EJDB NodeJS binding
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
	CMAKE_INCLUDE_PATH="$(STAGING_DIR)/usr/include:$(TOOLCHAIN_DIR)/include" \
	CMAKE_LIBRARY_PATH="$(STAGING_DIR)/usr/lib:$(TOOLCHAIN_DIR)/lib" \
	npm install --build-from-source --target_arch=$(NODEJS_CPU) -g $(DL_DIR)/$(PKG_SOURCE)
	rm -rf $(TMP_DIR)/npm-tmp
	rm -rf $(TMP_DIR)/npm-cache
endef

define Package/node-ejdb/install
	$(INSTALL_DIR) $(1)/usr/lib/node
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/* $(1)/usr/lib/node/
	$(INSTALL_DIR) $(1)/usr/bin
	$(LN) ../lib/node/ejdb/bin/cli.js $(1)/usr/bin/ejdb
endef

$(eval $(call BuildPackage,node-ejdb))
