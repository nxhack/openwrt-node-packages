# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=ffmpeg-for-homebridge
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=0.0.7
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=https://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_HASH:=9be6f320f923bcc10457eb0076eeab68baa23e9be851e8c14a017b961ec636fa

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
	$(CP) $(PKG_INSTALL_DIR)/package.json \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_INSTALL_DIR)/{README.md,index.js} \
		$(1)/usr/lib/node/$(PKG_NPM_NAME)/
endef

$(eval $(call BuildPackage,node-ffmpeg-for-homebridge))
