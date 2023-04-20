# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=bluetooth-hci-socket
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=0.5.3
PKG_RELEASE:=4

PKG_SOURCE_PROTO:=git
PKG_SOURCE_URL:=https://github.com/noble/node-bluetooth-hci-socket.git
PKG_SOURCE_SUBDIR:=$(PKG_NAME)-$(PKG_VERSION)
PKG_SOURCE_VERSION:=916158269f7e48ddc73d2448d2634e91538c8991
PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.xz
PKG_MIRROR_HASH:=746838c7d99e889603496e6e70fa5f87a39e91ddea700587ac4ddf6437cb224f

#PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
#PKG_SOURCE_URL:=https://registry.npmjs.org/$(PKG_NPM_NAME)/-/
#PKG_HASH:=69fba6171c1fb981d61c0e789ebcd25869589181a03c836b1b5e4867bab957e5

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=LICENSE

PKG_BUILD_DEPENDS:=node/host
PKG_BUILD_PARALLEL:=1
PKG_BUILD_FLAGS:=no-mips16

include $(INCLUDE_DIR)/package.mk

define Package/node-bluetooth-hci-socket
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=Bluetooth HCI socket binding for Node.js
  URL:=https://www.npmjs.com/package/bluetooth-hci-socket
  DEPENDS:=+node +node-usb
endef

define Package/node-bluetooth-hci-socket/description
 Bluetooth HCI socket binding for Node.js
endef

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
	$(if $(CONFIG_NODEJS_NPM_KEEP_CACHE), npm_config_cache=$(NPM_CACHE_DIR)/npm-cache-$(PKG_NPM_NAME),npm_config_cache=$(TMP_DIR)/npm-cache-$(TMPNPM)) \
	npm install --prefer-offline --no-audit --global-style --install-strategy=shallow --no-save --omit=dev --no-package-lock --build-from-source --target_arch=$(NODEJS_CPU)
	rm -rf $(TMP_DIR)/npm-cache-$(TMPNPM)
	rm -f $(PKG_BUILD_DIR)/node_modules/.package-lock.json
	find $(PKG_BUILD_DIR)/node_modules -type d -empty -print0 | xargs -0 rmdir || true
endef

define Package/node-bluetooth-hci-socket/install
	$(INSTALL_DIR) $(1)/usr/lib/node/$(PKG_NPM_NAME)
	$(CP) $(PKG_BUILD_DIR)/{package.json,*.md} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/{LICENSE,*.js} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/{node_modules,lib,examples} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(INSTALL_DIR) $(1)/usr/lib/node_modules
	$(LN) ../node/$(PKG_NPM_NAME) $(1)/usr/lib/node_modules/$(PKG_NPM_NAME)
endef

define Package/node-bluetooth-hci-socket/postrm
#!/bin/sh
rm /usr/lib/node_modules/bluetooth-hci-socket || true
rm -rf /usr/lib/node/bluetooth-hci-socket || true
endef

$(eval $(call BuildPackage,node-bluetooth-hci-socket))
