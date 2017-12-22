# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=statvfs
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=2.1.0
PKG_RELEASE:=12

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=http://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_HASH:=a93dd601ce864c4554deb32713f6c11100808b2cd93f77e66d8038a413542d6f

PKG_BUILD_DEPENDS:=node/host
PKG_USE_MIPS16:=0

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=README.md

include $(INCLUDE_DIR)/package.mk

define Package/node-statvfs
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=node binding to POSIX statvfs (file system information)
  URL:=https://www.npmjs.org/package/statvfs
  DEPENDS:=+node
endef

define Package/node-statvfs/description
 statvfs is a super simple module that just gives you access to statvfs(3)
endef

TAR_OPTIONS+= --strip-components 1
TAR_CMD=$(HOST_TAR) -C $(1) $(TAR_OPTIONS)

NODEJS_CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))

define Build/Compile
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_arch=$(NODEJS_CPU) \
	npm_config_nodedir=$(STAGING_DIR)/usr/ \
	npm_config_cache=$(TMP_DIR)/npm-cache \
	npm_config_tmp=$(TMP_DIR)/npm-tmp \
	PREFIX="$(PKG_INSTALL_DIR)/usr/" \
	npm install --build-from-source --target_arch=$(NODEJS_CPU) -g $(PKG_BUILD_DIR)
	npm_config_cache=$(TMP_DIR)/npm-cache \
	npm cache clean --force
endef

define Package/node-statvfs/install
	$(INSTALL_DIR) $(1)/usr/lib/node/$(PKG_NPM_NAME)
	$(INSTALL_DIR) $(1)/usr/lib/node/$(PKG_NPM_NAME)/build/Release
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/$(PKG_NPM_NAME)/{package.json,README.md} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/$(PKG_NPM_NAME)/binding.gyp \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/$(PKG_NPM_NAME)/{node_modules,lib} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/$(PKG_NPM_NAME)/{src,test} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/$(PKG_NPM_NAME)/build/Release/statvfs.node \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/build/Release/
endef

$(eval $(call BuildPackage,node-statvfs))
