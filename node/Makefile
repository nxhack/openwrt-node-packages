# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=node
PKG_CPE_ID:=cpe:/a:nodejs:node.js

ifeq ($(CONFIG_NODEJS_12),y)
PKG_VERSION:=v12.3.1
PKG_RELEASE:=1
PKG_HASH:=ba2b50acffe67068f44e06e5c6938f9a391086d7f8386aea829a199db02d0bfe
PATCH_DIR:=./patches/v12.x
else
ifeq ($(CONFIG_NODEJS_10),y)
PKG_VERSION:=v10.15.3
PKG_RELEASE:=3
PKG_HASH:=4e22d926f054150002055474e452ed6cbb85860aa7dc5422213a2002ed9791d5
PATCH_DIR:=./patches/v10.x
else
ifeq ($(CONFIG_NODEJS_6),y)
PKG_VERSION:=v6.17.1
PKG_RELEASE:=1
PKG_HASH:=6f6dc9624656a008513b7608bfc105dd92ceea5d7b4516edeca7e6b19d2edd94
PATCH_DIR:=./patches/v6.x
else
PKG_VERSION:=v8.16.0
PKG_RELEASE:=1
PKG_HASH:=3515e8e01568a5dc4dff3d91a76ebc6724f5fa2fbb58b4b0c5da7b178a2f7340
PATCH_DIR:=./patches/v8.x
endif
endif
endif

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.xz
PKG_SOURCE_URL:=https://nodejs.org/dist/${PKG_VERSION}

HOST_BUILD_DEPENDS:=python/host
PKG_BUILD_DEPENDS:=python/host node/host
PKG_INSTALL:=1
PKG_USE_MIPS16:=0

HOST_BUILD_PARALLEL:=1
PKG_BUILD_PARALLEL:=1

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=LICENSE

OW_VER:=$(shell git --git-dir=$(TOPDIR)/.git describe --abbrev=0 --always --tag)

include $(INCLUDE_DIR)/host-build.mk
include $(INCLUDE_DIR)/package.mk

define Package/node
  SECTION:=lang
  CATEGORY:=Languages
  SUBMENU:=Node.js
  TITLE:=Node.js is a platform built on Chrome's JavaScript runtime
  URL:=https://nodejs.org/
  DEPENDS:=@(HAS_FPU||KERNEL_MIPS_FPU_EMULATOR) @!arc @!armeb \
           $(if $(findstring arm,$(ARCH)),$(if $(CONFIG_CPU_SUBTYPE),,@BROKEN)) \
           +libstdcpp +USE_UCLIBC:libpthread +USE_UCLIBC:librt +zlib \
           $(if $(filter reboot, $(OW_VER)),+libopenssl,+(!NODEJS_10&&!NODEJS_12):libopenssl) \
           +NODEJS_ICU_SYSTEM:icu +NODEJS_ICU_SYSTEM:icu-full-data \
           +(NODEJS_10||NODEJS_12):libatomic
endef

define Package/node/description
  Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine. Node.js uses
  an event-driven, non-blocking I/O model that makes it lightweight and efficient. Node.js'
   package ecosystem, npm, is the largest ecosystem of open source libraries in the world.
endef

define Package/node-npm
  SECTION:=lang
  CATEGORY:=Languages
  SUBMENU:=Node.js
  TITLE:=NPM stands for Node Package Manager
  URL:=https://www.npmjs.com/
  DEPENDS:=+node
endef

define Package/node-npm/description
 NPM is the package manager for Node.js
endef

#define Package/node-inspect
#  SECTION:=lang
#  CATEGORY:=Languages
#  SUBMENU:=Node.js
#  TITLE:=Node Inspect
#  URL:=https://www.npmjs.com/
#  DEPENDS:=+node
#endef

#define Package/node-inspect/description
# node-inspect re-implementing node debug against the new V8 debugger protocol.
#endef

define Package/node/config
	menu "Configuration"
		depends on PACKAGE_node

	choice
		prompt "Version Selection"
		default NODEJS_8
		help
		 Select node.js version.

		config NODEJS_6
			bool "6.x End-of-life : NO LONGER SUPPORTED"

		config NODEJS_8
			bool "8.x Maintenance LTS"

		config NODEJS_10
			bool "10.x Active LTS"

		config NODEJS_12
			bool "12.x Current Release"
	endchoice

	choice
		prompt "ICU Selection"
		default NODEJS_ICU_NONE
		help
		 Select i18n features

		config NODEJS_ICU_NONE
			bool "Disable"

		config NODEJS_ICU_SMALL
			bool "small-icu"

		config NODEJS_ICU_SYSTEM
			bool "system-icu"
	endchoice

	config NODEJS_WITH_SNAPSHOT
		depends on !(TARGET_x86_64 || NODEJS_ICU_NONE || (!ARCH_64BIT && NODEJS_ICU_SYSTEM))
		bool "Build with snapshot"
		help
		 Enable advanced debugging
		default y

	endmenu
endef

NODEJS_CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))

ifeq ($(CONFIG_NODEJS_10),y)
TARGET_LDFLAGS+=-latomic
endif

ifeq ($(CONFIG_NODEJS_12),y)
TARGET_LDFLAGS+=-latomic
endif

ifneq ($(CONFIG_ARCH_64BIT),y)
FORCE_32BIT:=-m32
endif

MAKE_VARS+= \
	DESTCPU=$(NODEJS_CPU) \
	LD_LIBRARY_PATH=$(STAGING_DIR_HOSTPKG)/share/icu/64.2/lib

CONFIGURE_VARS:= \
	CC="$(TARGET_CC) $(TARGET_OPTIMIZATION)" \
	CXX="$(TARGET_CXX) $(TARGET_OPTIMIZATION)" \
	CC_host="$(HOSTCC) $(FORCE_32BIT)" \
	CXX_host="$(HOSTCXX) $(FORCE_32BIT)"

CONFIGURE_ARGS:= \
	--dest-cpu=$(NODEJS_CPU) \
	--dest-os=linux \
	$(if $(CONFIG_NODEJS_WITH_SNAPSHOT),,--without-snapshot) \
	--shared-zlib \
	$(if $(filter reboot, $(OW_VER)),--shared-openssl, \
		$(if $(CONFIG_NODEJS_10),,$(if $(CONFIG_NODEJS_12),,--shared-openssl))) \
	$(if $(CONFIG_NODEJS_ICU_SMALL),, \
		--with-intl=$(if $(CONFIG_NODEJS_ICU_SYSTEM),system-icu,none)) \
	$(if $(findstring mips,$(NODEJS_CPU)), \
		$(if $(CONFIG_SOFT_FLOAT),--with-mips-float-abi=soft)) \
	$(if $(findstring +neon,$(CONFIG_CPU_TYPE)),--with-arm-fpu=neon) \
	$(if $(findstring +vfp",$(CONFIG_CPU_TYPE)),--with-arm-fpu=vfp) \
	$(if $(findstring +vfpv3",$(CONFIG_CPU_TYPE)),--with-arm-fpu=vfpv3-d16) \
	$(if $(findstring +vfpv4",$(CONFIG_CPU_TYPE)),--with-arm-fpu=vfpv3) \
	--prefix=/usr

HOST_CONFIGURE_VARS:=
HOST_CONFIGURE_ARGS:= \
	--dest-os=linux \
	--without-snapshot \
	--with-intl=none \
	--prefix=$(STAGING_DIR_HOSTPKG)

HOST_CONFIGURE_CMD:=python2 ./configure

MKTOOL=$(HOST_BUILD_DIR)/out/Release/mkcodecache
FILE_NODE_GYP:=$(PKG_BUILD_DIR)/node.gyp

define Build/Prepare
	$(if $(filter reboot, $(OW_VER)), $(if $(CONFIG_NODEJS_6), \
		echo "Node.js v6.x no longer supported in the OpenWrt head."; \
		exit 1; \
	))
	$(Build/Prepare/Default)
ifeq ($(CONFIG_NODEJS_12),y)
	$(SED) "s#<(mkcodecache_exec)#$(MKTOOL)#g" $(FILE_NODE_GYP)
endif
endef

define Build/InstallDev
	$(INSTALL_DIR) $(1)/usr/include
	$(CP) $(PKG_INSTALL_DIR)/usr/include/* $(1)/usr/include/
endef

define Package/node/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) $(PKG_INSTALL_DIR)/usr/bin/node $(1)/usr/bin/
endef

define Package/node-npm/install
	$(INSTALL_DIR) $(1)/usr/lib/node_modules
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/* $(1)/usr/lib/node_modules/
	$(INSTALL_DIR) $(1)/usr/bin
	$(LN) ../lib/node_modules/npm/bin/npm-cli.js $(1)/usr/bin/npm
ifneq ($(CONFIG_NODEJS_6),y)
	$(LN) ../lib/node_modules/npm/bin/npx-cli.js $(1)/usr/bin/npx
endif
endef

#define Package/node-inspect/install
#	$(INSTALL_DIR) $(1)/usr/lib/node_modules
#	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/* $(1)/usr/lib/node_modules/
#	$(INSTALL_DIR) $(1)/usr/bin
#	$(LN) ../lib/node_modules/node-inspect/cli.js $(1)/usr/bin/node-inspect
#endef

$(eval $(call HostBuild))
$(eval $(call BuildPackage,node))
$(eval $(call BuildPackage,node-npm))
#$(eval $(call BuildPackage,node-inspect))
