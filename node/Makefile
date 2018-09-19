# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=node

ifeq ($(CONFIG_NODEJS_10),y)
PKG_VERSION:=v10.10.0
PKG_RELEASE:=1
PKG_HASH:=860eff976d83dd619849c0b4fab4cadb093ece2c718aaa5af8fb5ebbfa7d8a80
PATCH_DIR:=./patches/v10.x
else
ifeq ($(CONFIG_NODEJS_9),y)
PKG_VERSION:=v9.11.2
PKG_RELEASE:=2
PKG_HASH:=06484eac7f6b7c87e96983a039422347c0047284bc4d373d90884ae3966dc213
PATCH_DIR:=./patches/v9.x
else
ifeq ($(CONFIG_NODEJS_6),y)
PKG_VERSION:=v6.14.4
PKG_RELEASE:=1
PKG_HASH:=9a4bfc99787f8bdb07d5ae8b1f00ec3757e7b09c99d11f0e8a5e9a16a134ec0f
PATCH_DIR:=./patches/v6.x
else
PKG_VERSION:=v8.12.0
PKG_RELEASE:=1
PKG_HASH:=5a9dff58016c18fb4bf902d963b124ff058a550ebcd9840c677757387bce419a
PATCH_DIR:=./patches/v8.x
endif
endif
endif

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.xz
PKG_SOURCE_URL:=http://nodejs.org/dist/${PKG_VERSION}

HOST_BUILD_DEPENDS:=python/host
PKG_BUILD_DEPENDS:=python/host
PKG_INSTALL:=1
PKG_USE_MIPS16:=0

HOST_BUILD_PARALLEL:=1
PKG_BUILD_PARALLEL:=1

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
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
  DEPENDS:=+libstdcpp +!NODEJS_10:libopenssl +!NODEJS_10:zlib +USE_UCLIBC:libpthread +USE_UCLIBC:librt \
           +NODEJS_ICU_SYSTEM:icu +NODEJS_10:libatomic
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
  URL:=http://npmjs.com/
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
#  URL:=http://npmjs.com/
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
			bool "6.x Maintenance LTS"

		config NODEJS_8
			bool "8.x Active LTS"

		config NODEJS_9
			bool "9.x End-of-life"

		config NODEJS_10
			bool "10.x Current Release"
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

	config NODEJS_DEBUG
		bool "Debug build"
		default n

	endmenu
endef

NODEJS_CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))

ifeq ($(CONFIG_NODEJS_10),y)
TARGET_LDFLAGS+=-latomic
endif

MAKE_VARS+= \
	DESTCPU=$(NODEJS_CPU)

ifeq ($(CONFIG_NODEJS_DEBUG),y)
	STRIP:="/bin/true"
endif

CONFIGURE_VARS:= \
	CC="$(TARGET_CC) $(TARGET_OPTIMIZATION)" \
	CXX="$(TARGET_CXX) $(TARGET_OPTIMIZATION)" \
	CC_host="$(HOSTCC)" \
	CXX_host="$(HOSTCXX)"

CONFIGURE_ARGS:= \
	--dest-cpu=$(NODEJS_CPU) \
	--dest-os=linux \
	--without-snapshot \
	$(if $(CONFIG_NODEJS_10),,--shared-zlib) \
	$(if $(CONFIG_NODEJS_10),,--shared-openssl) \
	$(if $(CONFIG_NODEJS_DEBUG),--debug) \
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

HOST_CONFIGURE_CMD:=python ./configure

define Build/Prepare
	$(if $(findstring arm,$(NODEJS_CPU)), $(if $(CONFIG_SOFT_FLOAT), \
		echo "You can't running Node.js on ARM CPU without hardware FPU."; \
		exit 1; \
	))
	$(Build/Prepare/Default)
endef

define Build/InstallDev
	$(INSTALL_DIR) $(1)/usr/include
	$(CP) $(PKG_INSTALL_DIR)/usr/include/* $(1)/usr/include/
endef

define Package/node/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) $(PKG_INSTALL_DIR)/usr/bin/node $(1)/usr/bin/
ifeq ($(CONFIG_NODEJS_DEBUG),y)
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/node_g $(1)/usr/bin/
endif
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
