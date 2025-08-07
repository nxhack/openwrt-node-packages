# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_SCOPE:=homebridge-plugins
PKG_NPM_NAME:=homebridge-camera-ffmpeg
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=4.0.1
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=https://registry.npmjs.org/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)/-/
PKG_HASH:=994ad6c82786a357142f7a71ecba32a62bd4a7cfadc94a6c234b2ee265cb3434

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=ISC Apache-2.0 License
PKG_LICENSE_FILES:=LICENSE

PKG_BUILD_DEPENDS:=node/host
PKG_BUILD_PARALLEL:=1
PKG_BUILD_FLAGS:=no-mips16

include $(INCLUDE_DIR)/package.mk

define Package/node-homebridge-camera-ffmpeg
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=Homebridge Camera FFmpeg
  URL:=https://www.npmjs.com/package/homebridge-camera-ffmpeg
  DEPENDS:=+node +node-homebridge +node-ffmpeg-for-homebridge +node-mqtt
endef

define Package/node-homebridge-camera-ffmpeg/description
 Homebridge Plugin Providing FFmpeg-based Camera Support
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
	$(if $(CONFIG_NODEJS_NPM_KEEP_CACHE), npm_config_cache=$(NPM_CACHE_DIR)/npm-cache-$(PKG_NPM_NAME),npm_config_cache=$(TMP_DIR)/npm-cache-$(TMPNPM)) \
	npm install --prefer-offline --no-audit --global-style --install-strategy=shallow --no-save --omit=dev --no-package-lock --ignore-scripts --legacy-peer-deps
	rm -rf $(TMP_DIR)/npm-cache-$(TMPNPM)
	rm -f $(PKG_BUILD_DIR)/node_modules/.package-lock.json
	find $(PKG_BUILD_DIR)/node_modules -type d -empty -print0 | xargs -0 -r rmdir || true
endef

define Package/node-homebridge-camera-ffmpeg/install
	$(INSTALL_DIR) $(1)/usr/lib/node/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)
	$(CP) $(PKG_BUILD_DIR)/{package.json,LICENSE} \
		$(1)/usr/lib/node/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/{*.md,config.schema.json} \
		$(1)/usr/lib/node/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/{node_modules,dist} \
		$(1)/usr/lib/node/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)/
	$(INSTALL_DIR) $(1)/usr/lib/node_modules/@$(PKG_NPM_SCOPE)
	$(LN) ../../node/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME) \
		$(1)/usr/lib/node_modules/@$(PKG_NPM_SCOPE)/$(PKG_NPM_NAME)
endef

define Package/node-homebridge-camera-ffmpeg/preinst
#!/bin/sh
rm -rf /usr/lib/node_modules/homebridge-camera-ffmpeg || true
rm -rf /usr/lib/node/homebridge-camera-ffmpeg || true
endef

define Package/node-homebridge-camera-ffmpeg/postrm
#!/bin/sh
rm /usr/lib/node_modules/@homebridge-plugins/homebridge-camera-ffmpeg || true
rm -rf /usr/lib/node/@homebridge-plugins/homebridge-camera-ffmpeg || true
rmdir /usr/lib/node_modules/@homebridge-plugins || true
rmdir /usr/lib/node/@homebridge-plugins || true
endef

$(eval $(call BuildPackage,node-homebridge-camera-ffmpeg))
