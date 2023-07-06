# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=node

ifeq ($(CONFIG_NODEJS_16),y)
PKG_VERSION:=v16.20.1
PKG_RELEASE:=1
PKG_HASH:=83e03381e271f1a5619188e7aea9d85d9b7e12f5be2a28ceb78d7249ed22b7f1
PATCH_DIR:=./patches/v16.x
NODEJS_BIN_SUM:=b6c60e1e106ad7d8881e83945a5208c1b1d1b63e6901c04b9dafa607aff3a154
else
ifeq ($(CONFIG_NODEJS_20),y)
PKG_VERSION:=v20.4.0
PKG_RELEASE:=1
PKG_HASH:=09bd0b73c526b63c029d5ddfd885d10962e7ad87c975b94583c1f8ce90ee5348
PATCH_DIR:=./patches/v20.x
NODEJS_BIN_SUM:=6b49a007f409fb7620350285cfc909fbc909604fd0ff5a87a1730365514b3712
else
PKG_VERSION:=v18.16.1
PKG_RELEASE:=1
PKG_HASH:=e8404f8c8d89fdfdf7e95bbbc6066bd0e571acba58f54492599b615fbeefe272
PATCH_DIR:=./patches/v18.x
NODEJS_BIN_SUM:=ecfe263dbd9c239f37b5adca823b60be1bb57feabbccd25db785e647ebc5ff5e
endif
endif

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.xz
PKG_SOURCE_URL:=https://nodejs.org/dist/$(PKG_VERSION)

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=LICENSE
PKG_CPE_ID:=cpe:/a:nodejs:node.js

HOST_BUILD_DEPENDS:=python3/host
HOST_BUILD_PARALLEL:=1

PKG_BUILD_DEPENDS:=python3/host
PKG_BUILD_PARALLEL:=1
PKG_INSTALL:=1
PKG_USE_MIPS16:=0
PKG_ASLR_PIE:=0

include $(INCLUDE_DIR)/host-build.mk
include $(INCLUDE_DIR)/package.mk

define Package/node
  SECTION:=lang
  CATEGORY:=Languages
  SUBMENU:=Node.js
  TITLE:=Node.js is a platform built on Chrome's JavaScript runtime
  URL:=https://nodejs.org/
  DEPENDS:=@HAS_FPU @(i386||x86_64||arm||aarch64||mipsel) \
	   +libstdcpp +libopenssl +zlib +libnghttp2 \
	   +libcares +libatomic +NODEJS_ICU_SYSTEM:icu +NODEJS_ICU_SYSTEM:icu-full-data
endef

define Package/node/description
  Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine. Node.js uses
  an event-driven, non-blocking I/O model that makes it lightweight and efficient. Node.js'
   package ecosystem, npm, is the largest ecosystem of open source libraries in the world.

  *** The following preparations must be made on the host side. ***
      1. gcc 8.3 or higher is required.
      2. To build a 32-bit target, gcc-multilib, g++-multilib are required.
      3. Requires libatomic package. (If necessary, install the 32-bit library at the same time.)
     ex) sudo apt-get install gcc-multilib g++-multilib
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
	NPM is the package manager for NodeJS
endef

define Package/node/config
	menu "Configuration"

	choice
		prompt "Version Selection"
		default NODEJS_18
		help
		 Select node.js version.
		 The host package version is also the same.

		config NODEJS_16
			bool "16.x Maintenance"

		config NODEJS_18
			bool "18.x Active LTS"

		config NODEJS_20
			bool "20.x Current"
	endchoice

	if PACKAGE_node
		choice
			prompt "i18n features"
			default NODEJS_ICU_SMALL
			help
			 Select i18n features

			config NODEJS_ICU_NONE
				bool "Disable"

			config NODEJS_ICU_SMALL
				bool "small-icu"

			config NODEJS_ICU_SYSTEM
				depends on ARCH_64BIT
				bool "system-icu"
		endchoice
	endif

	config NODEJS_NPM_KEEP_CACHE
		bool "keep npm cache (experimental)"
		help
		  Keep npm package cache.
		  More space will be consumed by the cache.

	config NODEJS_NPM_CACHE_DIR
		string "Set npm cache directory" if NODEJS_NPM_KEEP_CACHE
		default ""
		help
		  Store npm cache in this directory.
		  If not set, uses './tmp'

	config NODEJS_HOST_BIN
		bool "Install the official nodejs binary package as HOSTPKG (experimental)"
		depends on HOST_OS_LINUX
		help
		  Reduce build time for the host package.

	endmenu
endef

NODEJS_CPU:=$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH))))

ifneq ($(CONFIG_ARCH_64BIT),y)
FORCE_32BIT:=-m32
endif

MAKE_VARS+= \
	DESTCPU=$(NODEJS_CPU) \
	NO_LOAD='cctest.target.mk embedtest.target.mk node_mksnapshot.target.mk overlapped-checker.target.mk \
		mkcodecache.target.mk tools/v8_gypfiles/torque_base.target.mk tools/v8_gypfiles/v8_init.target.mk' \
	LD_LIBRARY_PATH=$(STAGING_DIR_HOSTPKG)/share/icu/current/lib

HOST_MAKE_VARS+=NO_LOAD='cctest.target.mk embedtest.target.mk overlapped-checker.target.mk'

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
	--shared-openssl \
	--shared-nghttp2 \
	--shared-cares \
	--with-intl=$(if $(CONFIG_NODEJS_ICU_SMALL),small-icu,$(if $(CONFIG_NODEJS_ICU_SYSTEM),system-icu,none)) \
	$(if $(findstring +neon",$(CONFIG_CPU_TYPE)),--with-arm-fpu=neon) \
	$(if $(findstring +neon-vfpv4",$(CONFIG_CPU_TYPE)),--with-arm-fpu=neon) \
	$(if $(findstring +vfpv4",$(CONFIG_CPU_TYPE)),--with-arm-fpu=vfpv3) \
	$(if $(findstring +vfp",$(CONFIG_CPU_TYPE)),--with-arm-fpu=vfp) \
	$(if $(findstring +vfpv3",$(CONFIG_CPU_TYPE)),--with-arm-fpu=vfpv3) \
	$(if $(findstring +vfpv3-d16",$(CONFIG_CPU_TYPE)),--with-arm-fpu=vfpv3-d16) \
	--prefix=/usr

HOST_CONFIGURE_VARS:=
HOST_CONFIGURE_ARGS:= \
	--dest-os=$(if $(findstring Darwin,$(HOST_OS)),mac,linux) \
	--with-intl=small-icu \
	--prefix=$(STAGING_DIR_HOSTPKG)

define Build/InstallDev
	$(INSTALL_DIR) $(1)/usr/include
	$(CP) $(PKG_INSTALL_DIR)/usr/include/* $(1)/usr/include/
endef

define Package/node/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) $(PKG_INSTALL_DIR)/usr/bin/node $(1)/usr/bin/
endef

define Package/node-npm/install
	$(INSTALL_DIR) $(1)/usr/lib/node_modules/npm
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/npm/{package.json,LICENSE} \
		$(1)/usr/lib/node_modules/npm/
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/npm/README.md \
		$(1)/usr/lib/node_modules/npm/
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/node_modules/npm/{node_modules,bin,lib} \
		$(1)/usr/lib/node_modules/npm/
	$(INSTALL_DIR) $(1)/usr/bin
	$(LN) ../lib/node_modules/npm/bin/npm-cli.js $(1)/usr/bin/npm
	$(LN) ../lib/node_modules/npm/bin/npx-cli.js $(1)/usr/bin/npx
endef

define Package/node-npm/postrm
#!/bin/sh
rm -rf /usr/lib/node_modules/npm || true
endef

ifeq ($(CONFIG_NODEJS_HOST_BIN),y)

NODEJS_BIN:=node-$(PKG_VERSION)-linux-x64.tar.xz

define Download/nodebin
	URL:=https://nodejs.org/download/release/$(PKG_VERSION)/
	FILE:=$(NODEJS_BIN)
	HASH:=$(NODEJS_BIN_SUM)
endef

define Host/Prepare
	$(eval $(call Download,nodebin))
endef

define Host/Configure
	# nothing to do
endef

define Host/Compile
	# nothing to do
endef

define Host/Install
	$(TAR) xvfJ $(DL_DIR)/$(NODEJS_BIN) -C $(1) --strip-components=1
	$(RM) $(1)/{CHANGELOG.md,LICENSE,README.md}
endef

else
define Host/Install
	$(RM) -rf $(1)/lib/node_modules/npm
	$(call Host/Install/Default)
endef
endif

$(eval $(call HostBuild))
$(eval $(call BuildPackage,node))
$(eval $(call BuildPackage,node-npm))
