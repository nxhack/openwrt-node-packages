# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=ffi
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=2.2.0
PKG_RELEASE:=2

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=http://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_MD5SUM:=c7ee1416fad31710632ad50ef6df33fe

PKG_BUILD_DEPENDS:=node/host
PKG_USE_MIPS16:=0
PKG_LIBFFI_VERSION:=3.0.13

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=LICENSE

include $(INCLUDE_DIR)/package.mk

define Package/node-ffi
  DEPENDS:=+node +libffi
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=Node.js Foreign Function Interface
  URL:=https://www.npmjs.com/package/ffi
endef

define Package/node-ffi/description
 node-ffi is a Node.js addon for loading and calling dynamic libraries using pure JavaScript. It can be used to create bindings to native libraries without writing any C++ code
endef

NODEJS_CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))

TAR_OPTIONS+= --strip-components 1
TAR_CMD=$(HOST_TAR) -C $(1) $(TAR_OPTIONS)

TARGET_CFLAGS+=-I$(BUILD_DIR)/libffi-$(PKG_LIBFFI_VERSION)/build

define Build/Compile
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_arch=$(NODEJS_CPU) \
	npm_config_nodedir=$(STAGING_DIR_HOST)/ \
	npm_config_cache=$(STAGING_DIR_HOST)/share/node/npm-cache \
	PREFIX="$(PKG_INSTALL_DIR)/usr/" \
	npm install --build-from-source --target_arch=$(NODEJS_CPU) -g $(PKG_BUILD_DIR)
endef

define Package/node-ffi/install
	$(INSTALL_DIR) $(1)/usr/lib/node/$(PKG_NPM_NAME)
	$(INSTALL_DIR) $(1)/usr/lib/node/$(PKG_NPM_NAME)/build/Release
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/$(PKG_NPM_NAME)/{package.json,LICENSE,README.md} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/$(PKG_NPM_NAME)/{binding.gyp,CHANGELOG.md,appveyor.yml} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/$(PKG_NPM_NAME)/{example,lib} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/$(PKG_NPM_NAME)/{src,test} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/$(PKG_NPM_NAME)/node_modules \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/$(PKG_NPM_NAME)/build/Release/ffi_bindings.node \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/build/Release/
endef

$(eval $(call BuildPackage,node-ffi))
