# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=epoll
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=4.0.0
PKG_RELEASE:=2

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=https://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_HASH:=146e5d2fb49324203e3af195c9f40baa2e4bb943c9ff81c0ca993e09910bffa3

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=LICENSE

PKG_BUILD_DEPENDS:=node/host
PKG_BUILD_PARALLEL:=1
PKG_USE_MIPS16:=0

include $(INCLUDE_DIR)/package.mk

define Package/node-epoll
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=A low-level Node.js binding for the Linux epoll API
  URL:=https://www.npmjs.org/package/epoll
  DEPENDS:=+node
endef

define Package/node-epoll/description
 A low-level Node.js binding for the Linux epoll API for monitoring multiple file descriptors to see if I/O is possible on any of them.
endef

NODEJS_CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))
TMPNPM:=$(shell mktemp -u XXXXXXXXXX)

TARGET_CFLAGS+=$(FPIC)
TARGET_CPPFLAGS+=$(FPIC)

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
	npm_config_cache=$(TMP_DIR)/npm-cache-$(TMPNPM) \
	npm_config_tmp=$(TMP_DIR)/npm-tmp-$(TMPNPM) \
	npm install -g $(DL_DIR)/$(PKG_SOURCE)
	rm -rf $(TMP_DIR)/npm-tmp-$(TMPNPM)
	rm -rf $(TMP_DIR)/npm-cache-$(TMPNPM)
endef

define Package/node-epoll/install
	$(INSTALL_DIR) $(1)/usr/lib/node
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/* $(1)/usr/lib/node/
	$(INSTALL_DIR) $(1)/usr/lib/node_modules
	$(LN) ../node/$(PKG_NPM_NAME) $(1)/usr/lib/node_modules/$(PKG_NPM_NAME)
endef

define Package/node-epoll/postrm
#!/bin/sh
rm /usr/lib/node_modules/epoll || true
rm -rf /usr/lib/node/epoll || true
endef


$(eval $(call BuildPackage,node-epoll))
