# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=rimraf
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=2.6.1
PKG_RELEASE:=4

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=http://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_HASH:=0597dcdf16daa619e52826fcc243d2eb4a396ad9fcb2cec02348d6bb5c69f8c1

PKG_BUILD_DEPENDS:=node/host
PKG_USE_MIPS16:=0

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=ISC
PKG_LICENSE_FILES:=LICENSE

include $(INCLUDE_DIR)/host-build.mk
include $(INCLUDE_DIR)/package.mk

define Package/node-rimraf
  DEPENDS:=+node
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=A deep deletion module for node (like rm -rf)
  URL:=https://www.npmjs.org/package/rimraf
endef

define Package/node-rimraf/description
 The UNIX command rm -rf for node
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
	npm_config_cache=$(STAGING_DIR)/usr/share/node/npm-cache \
	PREFIX="$(PKG_INSTALL_DIR)/usr/" \
	npm install --build-from-source --target_arch=$(NODEJS_CPU) -g $(DL_DIR)/$(PKG_SOURCE)
endef

define Package/node-rimraf/install
	$(INSTALL_DIR) $(1)/usr/lib/node
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/* $(1)/usr/lib/node/
	$(INSTALL_DIR) $(1)/usr/bin
	$(LN) ../lib/node/rimraf/bin.js $(1)/usr/bin/rimraf
endef

define Host/Prepare
	$(INSTALL_DIR) $(HOST_BUILD_DIR)
endef

define Host/Compile
	npm_config_nodedir=$(STAGING_DIR)/usr/ \
	npm_config_cache=$(STAGING_DIR)/usr/share/node/npm-cache \
	PREFIX="$(STAGING_DIR_HOSTPKG)/" \
	npm install -g $(DL_DIR)/$(PKG_SOURCE)
endef

define Host/Install
endef

$(eval $(call HostBuild))
$(eval $(call BuildPackage,node-rimraf))
