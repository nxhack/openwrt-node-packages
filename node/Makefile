#
# Copyright (C) 2006-2017 OpenWrt.org
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

ifeq ($(CONFIG_NODEJS_7),y)
PKG_VERSION:=v7.5.0
PKG_MD5SUM:=f99ee74647fe223eb03f2dd1dc6acdc14d9a881621376c848236c8d2ac8afd03
PATCH_DIR:=./patches/v7.x
else
ifeq ($(CONFIG_NODEJS_4),y)
PKG_VERSION:=v4.7.3
PKG_MD5SUM:=7f35dc7adf0b348857b98e543a54c2b2cafb92c27d9d32799a81ac66cbf035f0
PATCH_DIR:=./patches/v4.x
else
PKG_VERSION:=v6.9.5
PKG_MD5SUM:=d7fed1a354b29503f3e176d7fdb90b1a9de248e0ce9b3eb56cc26bb1f3d5b6b3
PATCH_DIR:=./patches/v6.x
endif
endif

PKG_NAME:=node
#PKG_VERSION:=
PKG_RELEASE:=1

PKG_SOURCE:=node-$(PKG_VERSION).tar.xz
PKG_SOURCE_URL:=http://nodejs.org/dist/${PKG_VERSION}
#PKG_MD5SUM:=

HOST_BUILD_DEPENDS:=python/host
PKG_BUILD_DEPENDS:=python/host NODEJS_7:node/host
PKG_INSTALL:=1
PKG_USE_MIPS16:=0

HOST_BUILD_PARALLEL:=1
PKG_BUILD_PARALLEL:=1

PKG_MAINTAINER:=John Crispin <blogic@openwrt.org>
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=LICENSE

include $(INCLUDE_DIR)/host-build.mk
include $(INCLUDE_DIR)/package.mk

define Package/node
  SECTION:=lang
  CATEGORY:=Languages
  SUBMENU:=Node.js
  TITLE:=Node.js is a platform built on Chrome's JavaScript runtime
  URL:=http://nodejs.org/
  DEPENDS:=+libstdcpp +libopenssl +zlib +USE_UCLIBC:libpthread +USE_UCLIBC:librt +NODEJS_ICU:icu
endef

define Package/node/description
  Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine. Node.js uses
  an event-driven, non-blocking I/O model that makes it lightweight and efficient. Node.js'
   package ecosystem, npm, is the largest ecosystem of open source libraries in the world.
endef

define Package/node/config
	choice
		prompt "Version Selection"
		default NODEJS_6
		help
		 Select node.js version.

		config NODEJS_4
			bool "4.x LTS"

		config NODEJS_6
			bool "6.x LTS"

		config NODEJS_7
			bool "7.x Current"
	endchoice

	menu "Build Option Selection"

	config NODEJS_ICU
		depends on !NODEJS_4
		bool "enable i18n features"
		default y

	endmenu
endef

NODEJS_CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))

MAKE_VARS+= \
	DESTCPU=$(NODEJS_CPU)

CONFIGURE_ARGS:= \
	--dest-cpu=$(NODEJS_CPU) \
	--dest-os=linux \
	--without-snapshot \
	--shared-zlib \
	--shared-openssl \
	--prefix=/usr

ifeq ($(CONFIG_NODEJS_4),)
ifeq ($(CONFIG_NODEJS_ICU),y)
CONFIGURE_ARGS+= \
	--with-intl=system-icu
else
CONFIGURE_ARGS+= \
	--with-intl=none
endif
endif

ifneq ($(findstring mips,$(NODEJS_CPU)),)
ifeq ($(CONFIG_SOFT_FLOAT),y)
CONFIGURE_ARGS+= \
	--with-mips-float-abi=soft
endif
endif

ifneq ($(findstring arm,$(NODEJS_CPU)),)
ifeq ($(CONFIG_SOFT_FLOAT),y)
CONFIGURE_ARGS+= \
	--with-arm-float-abi=softfp
else
ifneq ($(findstring vfp,$(CPU_SUBTYPE)),)
CONFIGURE_ARGS+= \
	--with-arm-fpu=vfp
endif
ifneq ($(findstring vfpv3,$(CPU_SUBTYPE)),)
CONFIGURE_ARGS+= \
	--with-arm-fpu=vfpv3
endif
ifneq ($(findstring vfpv3-d16,$(CPU_SUBTYPE)),)
CONFIGURE_ARGS+= \
	--with-arm-fpu=vfpv3-d16
endif
ifneq ($(findstring neon,$(CPU_SUBTYPE)),)
CONFIGURE_ARGS+= \
	--with-arm-fpu=neon
endif
endif
endif

HOST_CONFIGURE_VARS:=
HOST_CONFIGURE_ARGS:= \
	--dest-os=linux \
	--without-snapshot \
	--shared-zlib \
	--prefix=$(STAGING_DIR_HOSTPKG)

HOST_CONFIGURE_CMD:=python ./configure

ifeq ($(CONFIG_NODEJS_7),y)
MKTOOL=$(BUILD_DIR_HOST)/node-$(PKG_VERSION)/out/Release/mkpeephole
FILE_V8_GYP:=$(PKG_BUILD_DIR)/deps/v8/src/v8.gyp

define Build/Prepare
	$(Build/Prepare/Default)
	$(SED) "s#<(mkpeephole_exec)#$(MKTOOL)#g" $(FILE_V8_GYP)
endef
endif

define Build/InstallDev
	$(INSTALL_DIR) $(1)/usr/include
	$(CP) $(PKG_INSTALL_DIR)/usr/include/* $(1)/usr/include/
endef

define Package/node/install
	mkdir -p $(1)/usr/bin $(1)/usr/lib/node_modules/npm/{bin,lib,node_modules}
	$(CP) $(PKG_INSTALL_DIR)/usr/bin/{node,npm} $(1)/usr/bin/
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/npm/{package.json,LICENSE,cli.js} $(1)/usr/lib/node_modules/npm
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/npm/bin/npm-cli.js $(1)/usr/lib/node_modules/npm/bin
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/npm/lib/* $(1)/usr/lib/node_modules/npm/lib/
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/npm/node_modules/* $(1)/usr/lib/node_modules/npm/node_modules/
endef

$(eval $(call HostBuild))
$(eval $(call BuildPackage,node))
