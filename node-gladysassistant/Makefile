# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=gladysassistant
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=4.6.0
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.gz
PKG_SOURCE_URL:=https://codeload.github.com/GladysAssistant/Gladys/tar.gz/v$(PKG_VERSION)?
PKG_HASH:=694afc00a189ee12412632ea1a527db8b3aa54ccd81c98449a8c1972550b7c0d
PKG_BUILD_DIR:=$(BUILD_DIR)/Gladys-$(PKG_VERSION)

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=Apache-2.0
PKG_LICENSE_FILES:=LICENSE

PKG_BUILD_DEPENDS:=node/host
PKG_BUILD_PARALLEL:=1
PKG_USE_MIPS16:=0

include $(INCLUDE_DIR)/package.mk

define Package/node-gladysassistant-server
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=Gladys Assistant Server
  URL:=https://gladysassistant.com/
  DEPENDS:=+node +libopenzwave +libudev
endef

define Package/node-gladysassistant-server/description
 A privacy-first, open-source home assistant - Server
endef

define Package/node-gladysassistant-front
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=Gladys Assistant Frontend
  URL:=https://gladysassistant.com/
  DEPENDS:=+node
endef

define Package/node-gladysassistant-front/description
 A privacy-first, open-source home assistant - Frontend
endef

NODEJS_CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))
TMPNPM:=$(shell mktemp -u XXXXXXXXXX)

TARGET_CFLAGS+=$(FPIC)
TARGET_CPPFLAGS+=$(FPIC)

define Build/Compile
	cd $(PKG_BUILD_DIR)/server; \
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_nodedir=$(STAGING_DIR)/usr/ \
	npm_config_cache=$(TMP_DIR)/npm-cache-$(TMPNPM) \
	npm_config_tmp=$(TMP_DIR)/npm-tmp-$(TMPNPM) \
	npm install --production --global-style --no-save --omit=dev --no-package-lock --build-from-source --target_arch=$(NODEJS_CPU)
	rm -rf $(TMP_DIR)/npm-tmp-$(TMPNPM)
	rm -rf $(TMP_DIR)/npm-cache-$(TMPNPM)
	rm -rf $(PKG_BUILD_DIR)/server/services/ewelink/node_modules/bufferutil/prebuilds
	rm -rf $(PKG_BUILD_DIR)/server/services/ewelink/node_modules/utf-8-validate/prebuilds
	rm -f $(PKG_BUILD_DIR)/server/node_modules/.package-lock.json
	find $(PKG_BUILD_DIR)/server/node_modules -type d -empty -print0 | xargs -0 rmdir || true
	cd $(PKG_BUILD_DIR)/front; \
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_nodedir=$(STAGING_DIR)/usr/ \
	npm_config_cache=$(TMP_DIR)/npm-cache-$(TMPNPM) \
	npm_config_tmp=$(TMP_DIR)/npm-tmp-$(TMPNPM) \
	npm install --production --global-style --no-save --omit=dev --no-package-lock --build-from-source --target_arch=$(NODEJS_CPU)
	rm -rf $(TMP_DIR)/npm-tmp-$(TMPNPM)
	rm -rf $(TMP_DIR)/npm-cache-$(TMPNPM)
	rm -f $(PKG_BUILD_DIR)/front/node_modules/.package-lock.json
	find $(PKG_BUILD_DIR)/front/node_modules -type d -empty -print0 | xargs -0 rmdir || true
endef

define Package/node-gladysassistant-server/install
	$(INSTALL_DIR) $(1)/opt/$(PKG_NPM_NAME)-server
	$(CP) $(PKG_BUILD_DIR)/server/{package.json,*.js,*.json} \
		$(1)/opt/$(PKG_NPM_NAME)-server/
	$(CP) $(PKG_BUILD_DIR)/{LICENSE,README.md} \
		$(1)/opt/$(PKG_NPM_NAME)-server/
	$(CP) $(PKG_BUILD_DIR)/server/{node_modules,lib} \
		$(1)/opt/$(PKG_NPM_NAME)-server/
	$(CP) $(PKG_BUILD_DIR)/server/{api,cli,config,migrations,models} \
		$(1)/opt/$(PKG_NPM_NAME)-server/
	$(CP) $(PKG_BUILD_DIR)/server/{seeders,services,utils} \
		$(1)/opt/$(PKG_NPM_NAME)-server/
	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) ./files/gladysassistant-server.init $(1)/etc/init.d/gladysassistant-server
endef

define Package/node-gladysassistant-front/install
	$(INSTALL_DIR) $(1)/opt/$(PKG_NPM_NAME)-front
	$(CP) $(PKG_BUILD_DIR)/front/{package.json,*.js} \
		$(1)/opt/$(PKG_NPM_NAME)-front/
	$(CP) $(PKG_BUILD_DIR)/LICENSE \
		$(1)/opt/$(PKG_NPM_NAME)-front/
	$(CP) $(PKG_BUILD_DIR)/front/{netlify.toml,README.md} \
		$(1)/opt/$(PKG_NPM_NAME)-front/
	$(CP) $(PKG_BUILD_DIR)/front/{node_modules,cypress,src} \
		$(1)/opt/$(PKG_NPM_NAME)-front/
	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) ./files/gladysassistant-front.init $(1)/etc/init.d/gladysassistant-front
endef

define Package/node-gladysassistant-server/postrm
#!/bin/sh
rm -rf /opt/gladysassistant-server || true
endef

define Package/node-gladysassistant-front/postrm
#!/bin/sh
rm -rf /opt/gladysassistant-front || true
endef

$(eval $(call BuildPackage,node-gladysassistant-server))
$(eval $(call BuildPackage,node-gladysassistant-front))
