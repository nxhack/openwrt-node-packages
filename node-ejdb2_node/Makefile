# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=ejdb2_node
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=2.62.5
PKG_RELEASE:=2

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=https://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_HASH:=74c62bed6eb23a2364d5dbfdebb00b522493c51344cbf72c0ad11cebb12b75ee

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=

PKG_BUILD_DEPENDS:=node/host node-yarn/host
PKG_BUILD_PARALLEL:=1
PKG_BUILD_FLAGS:=no-mips16

include $(INCLUDE_DIR)/package.mk

define Package/node-ejdb2_node
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=EJDB2 Node.js native binding
  URL:=https://www.npmjs.com/package/ejdb2_node
  DEPENDS:=+node +libatomic @BROKEN
endef

define Package/node-ejdb2_node/description
 Embeddable JSON Database engine http://ejdb.org Node.js binding.
endef

TAR_OPTIONS+= --strip-components 1
TAR_CMD=$(HOST_TAR) -C $(1) $(TAR_OPTIONS)

NODEJS_CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))
TMPNPM:=$(shell mktemp -u XXXXXXXXXX)
NPM_CACHE_DIR:=$(if $(call qstrip,$(CONFIG_NODEJS_NPM_CACHE_DIR)),$(call qstrip,$(CONFIG_NODEJS_NPM_CACHE_DIR)),$(TMP_DIR))

TARGET_CFLAGS+=$(FPIC) -D_GNU_SOURCE
TARGET_CPPFLAGS+=$(FPIC)
TARGET_LDFLAGS+=-latomic

CMINC_PATH_LIST=$(STAGING_DIR)/usr/include
ifeq ($(CONFIG_USE_MUSL),y)
    CMINC_PATH_LIST+=$(TOOLCHAIN_DIR)/include/fortify
endif
CMINC_PATH_LIST+=$(TOOLCHAIN_DIR)/include
CMINC_PATH:=$(subst $(space),:,$(CMINC_PATH_LIST))

define Build/Compile
	cd $(PKG_BUILD_DIR); \
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_nodedir=$(STAGING_DIR)/usr/ \
	$(if $(CONFIG_NODEJS_NPM_KEEP_CACHE), npm_config_cache=$(NPM_CACHE_DIR)/npm-cache-$(PKG_NPM_NAME),npm_config_cache=$(TMP_DIR)/npm-cache-$(TMPNPM)) \
	npm_config_tmp=$(TMP_DIR)/npm-tmp-$(TMPNPM) \
	CMAKE_INCLUDE_PATH="$(CMINC_PATH)" \
	CMAKE_LIBRARY_PATH="$(STAGING_DIR)/usr/lib:$(TOOLCHAIN_DIR)/lib" \
	npm install --prefer-offline --no-audit --production --global-style --no-save --omit=dev --no-package-lock
	rm -rf $(TMP_DIR)/npm-tmp-$(TMPNPM)
	rm -rf $(TMP_DIR)/npm-cache-$(TMPNPM)
	rm -f $(PKG_BUILD_DIR)/node_modules/.package-lock.json
	find $(PKG_BUILD_DIR)/node_modules -type d -empty -print0 | xargs -0 rmdir || true
endef

define Package/node-ejdb2_node/install
	$(INSTALL_DIR) $(1)/usr/lib/node/$(PKG_NPM_NAME)
	$(INSTALL_DIR) $(1)/usr/lib/node/$(PKG_NPM_NAME)/build/Release
	$(CP) $(PKG_BUILD_DIR)/{package.json,*.md,*.js} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/node_modules \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/linux-x64/ejdb2_node.node \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/build/Release
	$(INSTALL_DIR) $(1)/usr/lib/node_modules
	$(LN) ../node/$(PKG_NPM_NAME) $(1)/usr/lib/node_modules/$(PKG_NPM_NAME)
endef

define Package/node-ejdb2_node/postrm
#!/bin/sh
rm /usr/lib/node_modules/ejdb2_node || true
rm -rf /usr/lib/node/ejdb2_node || true
endef

$(eval $(call BuildPackage,node-ejdb2_node))
