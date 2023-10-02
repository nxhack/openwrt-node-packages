# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=ffmpeg-for-homebridge
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=2.1.0
PKG_RELEASE:=2

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=https://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_HASH:=922887c30d4e57efdfb2e1672797280346bf0043dda46fb86c5632c294f4861f

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=none
PKG_LICENSE_FILES:=

PKG_BUILD_DEPENDS:=node/host

include $(INCLUDE_DIR)/package.mk

define Package/node-ffmpeg-for-homebridge
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=ffmpeg for homebridge
  URL:=https://www.npmjs.com/package/ffmpeg-for-homebridge
  DEPENDS:=+node +ffmpeg
endef

define Package/node-ffmpeg-for-homebridge/description
 Static ffmpeg binaries for Homebridge with support for audio (libfdk-aac) and hardware decoding (h264_omx).
endef

TAR_OPTIONS+= --strip-components 1
TAR_CMD=$(HOST_TAR) -C $(1) $(TAR_OPTIONS)

define Build/Compile
	# do nothing
endef

define Package/node-ffmpeg-for-homebridge/install
	$(INSTALL_DIR) $(1)/usr/lib/node/$(PKG_NPM_NAME)
	$(CP) $(PKG_BUILD_DIR)/package.json \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/{README.md,index.js} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(INSTALL_DIR) $(1)/usr/lib/node_modules
	$(LN) ../node/$(PKG_NPM_NAME) $(1)/usr/lib/node_modules/$(PKG_NPM_NAME)
endef

define Package/node-ffmpeg-for-homebridge/postrm
#!/bin/sh
rm /usr/lib/node_modules/ffmpeg-for-homebridge || true
rm -rf /usr/lib/node/ffmpeg-for-homebridge || true
endef

$(eval $(call BuildPackage,node-ffmpeg-for-homebridge))
