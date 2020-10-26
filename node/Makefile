# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=node

ifeq ($(CONFIG_NODEJS_12),y)
PKG_VERSION:=v12.19.0
PKG_RELEASE:=1
PKG_HASH:=3b671c45c493f96d7e018c15110cdbafa4478e5e5cfc9e6eec83cea9e6b551e1
PATCH_DIR:=./patches/v12.x
else
ifeq ($(CONFIG_NODEJS_10),y)
PKG_VERSION:=v10.22.1
PKG_RELEASE:=1
PKG_HASH:=f47f4725dcae137b26f8e2a7d0ab2c2c7f1f47e4f96834e6a9242f157132255f
PATCH_DIR:=./patches/v10.x
else
PKG_VERSION:=v8.17.0
PKG_RELEASE:=1
PKG_HASH:=5b0d96db482b273f0324c299ead86ecfbc5d033516e5fc37c92cfccb933ef6ff
PATCH_DIR:=./patches/v8.x
endif
endif

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.xz
PKG_SOURCE_URL:=https://nodejs.org/dist/$(PKG_VERSION)

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=LICENSE
PKG_CPE_ID:=cpe:/a:nodejs:node.js

HOST_BUILD_DEPENDS:=!NODEJS_12:python/host NODEJS_12:python3/host
HOST_BUILD_PARALLEL:=1

PKG_BUILD_DEPENDS:=!NODEJS_12:python/host NODEJS_12:python3/host
PKG_BUILD_PARALLEL:=1
PKG_INSTALL:=1
PKG_USE_MIPS16:=0

OW_VER:=$(shell git --git-dir=$(TOPDIR)/.git describe --abbrev=0 --always --tag)

include $(INCLUDE_DIR)/host-build.mk
include $(INCLUDE_DIR)/package.mk

define Package/node
  SECTION:=lang
  CATEGORY:=Languages
  SUBMENU:=Node.js
  TITLE:=Node.js is a platform built on Chrome's JavaScript runtime
  URL:=https://nodejs.org/
  DEPENDS:=@(HAS_FPU||KERNEL_MIPS_FPU_EMULATOR) @!arc @!armeb @!powerpc \
           +libstdcpp +USE_UCLIBC:libpthread +USE_UCLIBC:librt +zlib \
           $(if $(filter reboot v19.07%, $(OW_VER)),+libopenssl,+NODEJS_8:libopenssl) \
           $(if $(filter reboot v19.07%, $(OW_VER)),+NODEJS_ICU_SYSTEM:icu-full-data) \
           $(if $(filter reboot v19.07%, $(OW_VER)),+NODEJS_12:libnghttp2 +NODEJS_12:libuv +NODEJS_12:libhttp-parser +NODEJS_12:libcares) \
           +!NODEJS_8:libatomic +NODEJS_ICU_SYSTEM:icu
endef

define Package/node/description
  Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine. Node.js uses
  an event-driven, non-blocking I/O model that makes it lightweight and efficient. Node.js'
   package ecosystem, npm, is the largest ecosystem of open source libraries in the world.
  *** Requires GCC/G++ Multilib on host system to build! ***
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

define Package/node/config
	menu "Configuration"
		depends on PACKAGE_node

	choice
		prompt "Version Selection"
		default NODEJS_10
		help
		 Select node.js version.

		config NODEJS_8
			bool "8.x End-of-life : NO LONGER SUPPORTED"

		config NODEJS_10
			bool "10.x Maintenance LTS"

		config NODEJS_12
			bool "12.x Active LTS"
	endchoice

	choice
		prompt "i18n features"
		default NODEJS_ICU_NONE
		help
		 Select i18n features

		config NODEJS_ICU_NONE
			bool "Disable"

		config NODEJS_ICU_SMALL
			depends on !BIG_ENDIAN
			bool "small-icu"

		config NODEJS_ICU_SYSTEM
			depends on ARCH_64BIT&&!BIG_ENDIAN
			bool "system-icu"
	endchoice

	endmenu
endef

NODEJS_CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))

ifeq ($(CONFIG_NODEJS_10),y)
TARGET_LDFLAGS+=-latomic
endif

ifneq ($(CONFIG_ARCH_64BIT),y)
FORCE_32BIT:=-m32
endif

MAKE_VARS+= \
	DESTCPU=$(NODEJS_CPU) \
	NO_LOAD='cctest.target.mk embedtest.target.mk node_mksnapshot.target.mk' \
	LD_LIBRARY_PATH=$(STAGING_DIR_HOSTPKG)/share/icu/61.2/lib

HOST_MAKE_VARS+=NO_LOAD='cctest.target.mk embedtest.target.mk'

CONFIGURE_VARS:= \
	CC="$(TARGET_CC) $(TARGET_OPTIMIZATION)" \
	CXX="$(TARGET_CXX) $(TARGET_OPTIMIZATION)" \
	CC_host="$(HOSTCC) $(FORCE_32BIT)" \
	CXX_host="$(HOSTCXX) $(FORCE_32BIT)"

CONFIGURE_ARGS:= \
	--dest-cpu=$(NODEJS_CPU) \
	--dest-os=linux \
	--cross-compiling \
	--shared-zlib \
	$(if $(CONFIG_NODEJS_12),$(if $(filter reboot, $(OW_VER)) \
		,--shared-nghttp2 --shared-libuv --shared-cares)) \
	$(if $(filter reboot v19.07%, $(OW_VER)),--shared-openssl, \
		$(if $(CONFIG_NODEJS_8),--shared-openssl)) \
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
	--dest-os=$(if $(findstring Darwin,$(HOST_OS)),mac,linux) \
	--with-intl=none \
	--prefix=$(STAGING_DIR_HOSTPKG)

ifneq ($(CONFIG_NODEJS_12),y)
HOST_CONFIGURE_CMD:=python2 ./configure
endif

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
	$(LN) ../lib/node_modules/npm/bin/npx-cli.js $(1)/usr/bin/npx
endef

$(eval $(call HostBuild))
$(eval $(call BuildPackage,node))
$(eval $(call BuildPackage,node-npm))
