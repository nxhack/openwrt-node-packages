# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=node

ifeq ($(CONFIG_NODEJS_12),y)
PKG_VERSION:=v12.9.0
PKG_RELEASE:=1
PKG_HASH:=e05fe8ba1bdf58e51cdb5d946ebb7a2dec567b3680da2752e120a763293a41c5
PATCH_DIR:=./patches/v12.x
else
ifeq ($(CONFIG_NODEJS_10),y)
PKG_VERSION:=v10.16.3
PKG_RELEASE:=1
PKG_HASH:=7bf1123d7415964775b8f81fe6ec6dd5c3c08abb42bb71dfe4409dbeeba26bbd
PATCH_DIR:=./patches/v10.x
else
PKG_VERSION:=v8.16.1
PKG_RELEASE:=1
PKG_HASH:=d8c190acdf2d967faf49c22df883d31a8d4e249d67852dae3c2d8a0f756b0512
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

PKG_BUILD_DEPENDS:=!NODEJS_12:python/host NODEJS_12:python3/host NODEJS_12:node/host
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
  DEPENDS:=@(HAS_FPU||KERNEL_MIPS_FPU_EMULATOR) @!arc @!armeb \
           +libstdcpp +USE_UCLIBC:libpthread +USE_UCLIBC:librt +zlib \
           $(if $(filter reboot v19.07%, $(OW_VER)),+libopenssl,+NODEJS_8:libopenssl) \
           +NODEJS_ICU_SYSTEM:icu +NODEJS_ICU_SYSTEM:icu-full-data \
           +!NODEJS_8:libatomic
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

define Package/node/config
	menu "Configuration"
		depends on PACKAGE_node

	choice
		prompt "Version Selection"
		default NODEJS_8
		help
		 Select node.js version.

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
	--cross-compiling \
	$(if $(CONFIG_NODEJS_ICU_NONE),--without-snapshot) \
	$(if $(CONFIG_BIG_ENDIAN),--without-snapshot) \
	--shared-zlib \
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

HOST_CONFIGURE_VARS:= \
	CC="$(HOSTCC) $(FORCE_32BIT)" \
	CXX="$(HOSTCXX) $(FORCE_32BIT)"

HOST_CONFIGURE_ARGS:= \
	--dest-os=$(if $(findstring Darwin,$(HOST_OS)),mac,linux) \
	--with-intl=none \
	--prefix=$(STAGING_DIR_HOSTPKG)

HOST_CONFIGURE_CMD:=python2 ./configure

ifeq ($(CONFIG_NODEJS_12),y)
ifeq ($(CONFIG_NODEJS_ICU_NONE),y)

HOST_EXE=$(HOST_BUILD_DIR)/out/Release/
FILE_V8_GYP:=$(PKG_BUILD_DIR)/tools/v8_gypfiles/v8.gyp
FILE_NODE_GYP:=$(PKG_BUILD_DIR)/node.gyp

define Build/Prepare
	$(Build/Prepare/Default)
	$(SED) "s#<(PRODUCT_DIR)/<(EXECUTABLE_PREFIX)#$(HOST_EXE)#g" $(FILE_V8_GYP)
	$(SED) "s#<(PRODUCT_DIR)/<(EXECUTABLE_PREFIX)#$(HOST_EXE)#g" $(FILE_NODE_GYP)
endef
endif
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
