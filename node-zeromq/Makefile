# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=zeromq
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=6.0.0-beta.17
PKG_RELEASE:=4

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=https://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_HASH:=529b41f79596fc8a7165f57a2cff9ccb00fd53308807a10c6766c309d6702691

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=LICENSE

PKG_BUILD_DEPENDS:=node/host node-shx/host node-npm-run-all2/host node-gyp-build/host
PKG_BUILD_PARALLEL:=1
PKG_BUILD_FLAGS:=no-mips16

include $(INCLUDE_DIR)/package.mk
include $(INCLUDE_DIR)/cmake.mk

define Package/node-zeromq
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=Next-generation ZeroMQ bindings for Node.js
  URL:=https://www.npmjs.org/package/zeromq
  DEPENDS:=+node
endef

define Package/node-zeromq/description
 Next-generation ZeroMQ bindings for Node.js
endef

TAR_OPTIONS+= --strip-components 1
TAR_CMD=$(HOST_TAR) -C $(1) $(TAR_OPTIONS)

NODEJS_CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))
TMPNPM:=$(shell mktemp -u XXXXXXXXXX)
NPM_CACHE_DIR:=$(if $(call qstrip,$(CONFIG_NODEJS_NPM_CACHE_DIR)),$(call qstrip,$(CONFIG_NODEJS_NPM_CACHE_DIR)),$(TMP_DIR))

TARGET_CFLAGS+=$(FPIC)
TARGET_CPPFLAGS+=$(FPIC)

define Build/Configure
endef

define Build/Install
endef

define Build/Compile
	cd $(PKG_BUILD_DIR); \
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_nodedir=$(STAGING_DIR)/usr/ \
	$(if $(CONFIG_NODEJS_NPM_KEEP_CACHE), npm_config_cache=$(NPM_CACHE_DIR)/npm-cache-$(PKG_NPM_NAME),npm_config_cache=$(TMP_DIR)/npm-cache-$(TMPNPM)) \
	npm install --prefer-offline --no-audit --no-save --no-package-lock --ignore-scripts
	cd $(PKG_BUILD_DIR); \
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_nodedir=$(STAGING_DIR)/usr/ \
	$(if $(CONFIG_NODEJS_NPM_KEEP_CACHE), npm_config_cache=$(NPM_CACHE_DIR)/npm-cache-$(PKG_NPM_NAME),npm_config_cache=$(TMP_DIR)/npm-cache-$(TMPNPM)) \
	CMAKE_SYSTEM_NAME=Linux \
	CMAKE_SYSTEM_VERSION=1 \
	CMAKE_SYSTEM_PROCESSOR=$(ARCH) \
	CMAKE_BUILD_TYPE=Release \
	CMAKE_C_FLAGS_RELEASE="-DNDEBUG" \
	CMAKE_CXX_FLAGS_RELEASE="-DNDEBUG" \
	CMAKE_C_COMPILER_LAUNCHER="$(CMAKE_C_COMPILER_LAUNCHER)" \
	CMAKE_C_COMPILER="$(CMAKE_C_COMPILER)" \
	CMAKE_C_COMPILER_ARG1="$(CMAKE_C_COMPILER_ARG1)" \
	CMAKE_CXX_COMPILER_LAUNCHER="$(CMAKE_CXX_COMPILER_LAUNCHER)" \
	CMAKE_CXX_COMPILER="$(CMAKE_CXX_COMPILER)" \
	CMAKE_CXX_COMPILER_ARG1="$(CMAKE_CXX_COMPILER_ARG1)" \
	CMAKE_ASM_COMPILER="$(TARGET_CC_NOCACHE)" \
	CMAKE_EXE_LINKER_FLAGS="$(TARGET_LDFLAGS)" \
	CMAKE_MODULE_LINKER_FLAGS="$(TARGET_LDFLAGS) $(CMAKE_SHARED_LDFLAGS)" \
	CMAKE_SHARED_LINKER_FLAGS="$(TARGET_LDFLAGS) $(CMAKE_SHARED_LDFLAGS)" \
	CMAKE_AR="$(CMAKE_AR)" \
	CMAKE_NM="$(CMAKE_NM)" \
	CMAKE_RANLIB="$(CMAKE_RANLIB)" \
	CMAKE_FIND_ROOT_PATH="$(CMAKE_FIND_ROOT_PATH)" \
	CMAKE_FIND_ROOT_PATH_MODE_PROGRAM=BOTH \
	CMAKE_FIND_ROOT_PATH_MODE_LIBRARY=ONLY \
	CMAKE_FIND_ROOT_PATH_MODE_INCLUDE=ONLY \
	CMAKE_INSTALL_PREFIX=/usr \
	DL_LIBRARY=$(STAGING_DIR) \
	CMAKE_PREFIX_PATH=$(STAGING_DIR) \
	CMAKE_SKIP_RPATH=TRUE  \
	CMAKE_EXPORT_PACKAGE_REGISTRY=FALSE \
	CMAKE_EXPORT_NO_PACKAGE_REGISTRY=TRUE \
	CMAKE_FIND_USE_PACKAGE_REGISTRY=FALSE \
	CMAKE_FIND_PACKAGE_NO_PACKAGE_REGISTRY=TRUE \
	CMAKE_FIND_USE_SYSTEM_PACKAGE_REGISTRY=FALSE \
	CMAKE_FIND_PACKAGE_NO_SYSTEM_PACKAGE_REGISTRY=TRUE \
	CMAKE_SYSROOT="$(STAGING_DIR_ROOT)" \
	CROSS_COMPILE="$(OPTIMIZE_FOR_CPU)-openwrt-linux$(if $(TARGET_SUFFIX),-$(TARGET_SUFFIX))-" \
	TARGET_CROSS="$(TOOLCHAIN_DIR)/bin/$(TARGET_CROSS)" \
	npm install --prefer-offline --no-audit --global-style --install-strategy=shallow --no-save --omit=dev --no-package-lock --build-from-source --target_arch=$(NODEJS_CPU)
	rm -rf $(PKG_BUILD_DIR)/node_modules
	cd $(PKG_BUILD_DIR); \
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_nodedir=$(STAGING_DIR)/usr/ \
	$(if $(CONFIG_NODEJS_NPM_KEEP_CACHE), npm_config_cache=$(NPM_CACHE_DIR)/npm-cache-$(PKG_NPM_NAME),npm_config_cache=$(TMP_DIR)/npm-cache-$(TMPNPM)) \
	npm install --prefer-offline --no-audit --global-style --install-strategy=shallow --no-save --omit=dev --no-package-lock --ignore-scripts --legacy-peer-deps
	rm -rf $(TMP_DIR)/npm-cache-$(TMPNPM)
	rm -f $(PKG_BUILD_DIR)/node_modules/.package-lock.json
	find $(PKG_BUILD_DIR)/node_modules -type d -empty -delete || true
endef

define Package/node-zeromq/install
	$(INSTALL_DIR) $(1)/usr/lib/node/$(PKG_NPM_NAME)
	$(CP) $(PKG_BUILD_DIR)/package.json \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/{*.md,*.js} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/{lib,node_modules} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(INSTALL_DIR) $(1)/usr/lib/node/$(PKG_NPM_NAME)/build/Release
	$(CP) $(PKG_BUILD_DIR)/build/Release/zeromq.node \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/build/Release/
	$(INSTALL_DIR) $(1)/usr/lib/node_modules
	$(LN) ../node/$(PKG_NPM_NAME) $(1)/usr/lib/node_modules/$(PKG_NPM_NAME)
endef

define Package/node-zeromq/postrm
#!/bin/sh
rm /usr/lib/node_modules/zeromq || true
rm -rf /usr/lib/node/zeromq || true
endef

$(eval $(call BuildPackage,node-zeromq))
