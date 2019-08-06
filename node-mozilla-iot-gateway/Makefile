#
# Copyright (C) 2018 Sartura Ltd.
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=mozilla-iot-gateway
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=0.9.1
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.gz
PKG_SOURCE_URL:=https://codeload.github.com/mozilla-iot/gateway/tar.gz/v$(PKG_VERSION)?
PKG_HASH:=3a11a7d31e562231c3bf82c293bb0ca3577a9974f6e3848c5513c33541455b12

PKG_MAINTAINER:=Marko Ratkaj <marko.ratkaj@sartura.hr>
PKG_LICENSE:=MPL-2.0
PKG_LICENSE_FILES:=LICENSE

PKG_BUILD_DEPENDS:=node/host openzwave
PKG_BUILD_PARALLEL:=1
PKG_USE_MIPS16:=0

include $(INCLUDE_DIR)/package.mk

define Package/node-mozilla-iot-gateway
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=WebThings Gateway by Mozilla
  URL:=https://iot.mozilla.org/gateway/
  DEPENDS:= +libpthread +node +node-npm +libopenzwave +openzwave-config +python +python3-light +python3-pip +openssl-util
  DEPENDS+= +MOIT_enable-plugin-support:git-http
  MENU:=1
endef

define Package/node-mozilla-iot-gateway/description
  Build Your Own Web of Things Gateway. The "Web of Things" (WoT) is the
  idea of taking the lessons learned from the World Wide Web and applying
  them to IoT. It's about creating a decentralized Internet of Things by
  giving Things URLs on the web to make them linkable and discoverable,
  and defining a standard data model and APIs to make them interoperable.
endef

define Package/node-mozilla-iot-gateway/config
  source "$(SOURCE)/Config.in"
endef

TAR_OPTIONS+= --strip-components 1
TAR_CMD=$(HOST_TAR) -C $(1) $(TAR_OPTIONS)

NODEJS_CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))
TMPNPM:=$(shell mktemp -u XXXXXXXXXX)
HOSTTMPNPM:=$(shell mktemp -u XXXXXXXXXX)

TARGET_CFLAGS+=$(FPIC)
TARGET_CPPFLAGS+=$(FPIC)

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
	npm install -g $(PKG_BUILD_DIR)
	rm -rf $(TMP_DIR)/npm-tmp-$(TMPNPM)
	rm -rf $(TMP_DIR)/npm-cache-$(TMPNPM)
endef

define Package/node-mozilla-iot-gateway/install
	$(INSTALL_DIR) $(1)/opt/mozilla-iot/gateway/
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/webthings-gateway/{*.json,LICENSE} \
		$(1)/opt/mozilla-iot/gateway/
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/webthings-gateway/{*.md,*.js,*.sh} \
		$(1)/opt/mozilla-iot/gateway/
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/webthings-gateway/{*.py,*.ts} \
		$(1)/opt/mozilla-iot/gateway/
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/webthings-gateway/{node_modules,lib} \
		$(1)/opt/mozilla-iot/gateway/
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/webthings-gateway/{config,images,src} \
		$(1)/opt/mozilla-iot/gateway/
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/webthings-gateway/{static,tools} \
		$(1)/opt/mozilla-iot/gateway/
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_arch=$(NODEJS_CPU) \
	npm_config_target_arch=$(NODEJS_CPU) \
	npm_config_build_from_source=true \
	npm_config_nodedir=$(STAGING_DIR)/usr/ \
	npm_config_prefix=$(1)/opt/mozilla-iot/gateway \
	npm_config_cache=$(TMP_DIR)/npm-cache-$(TMPNPM) \
	npm_config_tmp=$(TMP_DIR)/npm-tmp-$(TMPNPM) \
	npm install $(1)/opt/mozilla-iot/gateway
	rm -rf $(TMP_DIR)/npm-tmp-$(TMPNPM)
	rm -rf $(TMP_DIR)/npm-cache-$(TMPNPM)
	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) ./files/mozilla-iot-gateway.init $(1)/etc/init.d/mozilla-iot-gateway
endef

$(eval $(call BuildPackage,node-mozilla-iot-gateway))
