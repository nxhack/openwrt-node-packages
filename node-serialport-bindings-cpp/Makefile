# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_SCOPE:=serialport
PKG_NPM_NAME:=bindings-cpp
PKG_NAME:=node-$(PKG_NPM_SCOPE)-$(PKG_NPM_NAME)
PKG_VERSION:=12.0.1
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NPM_SCOPE)-$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL_FILE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=https://registry.npmjs.org/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)/-/
PKG_HASH:=8cf4e55fcbc175ee56b9c5ba79e6665b9528adabfde8e3b4ae1abd6e948f40e2

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=LICENSE

PKG_BUILD_DEPENDS:=node/host
PKG_BUILD_PARALLEL:=1
PKG_BUILD_FLAGS:=no-mips16

include $(INCLUDE_DIR)/package.mk

define Package/node-serialport-bindings-cpp
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=SerialPort Hardware bindings for node serialport written in c++
  URL:=https://www.npmjs.com/package/@serialport/bindings-cpp
  DEPENDS:=+node
endef

define Package/node-serialport-bindings-cpp/description
 The Bindings provide a low level interface to work with your serialport. It is possible to use them alone but it's usually easier to use them with an interface.
endef

TAR_OPTIONS+= --strip-components 1
TAR_CMD=$(HOST_TAR) -C $(1) $(TAR_OPTIONS)

NODEJS_CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))
TMPNPM:=$(shell mktemp -u XXXXXXXXXX)
NPM_CACHE_DIR:=$(if $(call qstrip,$(CONFIG_NODEJS_NPM_CACHE_DIR)),$(call qstrip,$(CONFIG_NODEJS_NPM_CACHE_DIR)),$(TMP_DIR))

TARGET_CFLAGS+=$(FPIC)
TARGET_CPPFLAGS+=$(FPIC)

define Build/Compile
	cd $(PKG_BUILD_DIR); \
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_nodedir=$(STAGING_DIR)/usr/ \
	$(if $(CONFIG_NODEJS_NPM_KEEP_CACHE), npm_config_cache=$(NPM_CACHE_DIR)/npm-cache-$(PKG_NPM_SCOPE)-$(PKG_NPM_NAME),npm_config_cache=$(TMP_DIR)/npm-cache-$(TMPNPM)) \
	npm install --prefer-offline --no-audit --global-style --install-strategy=shallow --no-save --omit=dev --no-package-lock --build-from-source --target_arch=$(NODEJS_CPU)
	rm -rf $(TMP_DIR)/npm-cache-$(TMPNPM)
	rm -f $(PKG_BUILD_DIR)/node_modules/.package-lock.json
	find $(PKG_BUILD_DIR)/node_modules -type d -empty -print0 | xargs -0 rmdir || true
endef

define Package/node-serialport-bindings-cpp/install
	$(INSTALL_DIR) $(1)/usr/lib/node/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)
	$(CP) $(PKG_BUILD_DIR)/{package.json,LICENSE,*.md} \
		$(1)/usr/lib/node/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)
	$(CP) $(PKG_BUILD_DIR)/{node_modules,dist} \
		$(1)/usr/lib/node/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)
	$(INSTALL_DIR) $(1)/usr/lib/node/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)/build/Release
	$(CP) $(PKG_BUILD_DIR)/build/Release/bindings.node \
		$(1)/usr/lib/node/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)/build/Release/
	$(INSTALL_DIR) $(1)/usr/lib/node_modules/@$(PKG_NPM_SCOPE)
	$(LN) ../../node/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME) \
		$(1)/usr/lib/node_modules/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)
endef

define Package/node-serialport-bindings-cpp/postrm
#!/bin/sh
rm /usr/lib/node_modules/@serialport/bindings-cpp || true
rm -rf /usr/lib/node/@serialport/bindings-cpp || true
rmdir /usr/lib/node_modules/@serialport || true
rmdir /usr/lib/node/@serialport || true
endef

$(eval $(call BuildPackage,node-serialport-bindings-cpp))
