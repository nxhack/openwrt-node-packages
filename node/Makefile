# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=node

ifeq ($(CONFIG_NODEJS_9),y)
PKG_VERSION:=v9.2.1
PKG_RELEASE:=1
PKG_HASH:=200de3c145e79d5da5361ab079df199cec13dbd10902df9cf9a75c6546cd4582
PATCH_DIR:=./patches/v9.x
else
ifeq ($(CONFIG_NODEJS_8),y)
PKG_VERSION:=v8.9.3
PKG_RELEASE:=1
PKG_HASH:=748ddb3baa6b85e6a56e38aacd066586e7581952f84a92bc8152248a9be6b2da
PATCH_DIR:=./patches/v8.x
else
ifeq ($(CONFIG_NODEJS_4),y)
PKG_VERSION:=v4.8.7
PKG_RELEASE:=1
PKG_HASH:=03479a8ce6affedde75d80a6c8c351a7afb5a85b8d7e5119ab6f349100e641f8
PATCH_DIR:=./patches/v4.x
else
PKG_VERSION:=v6.12.2
PKG_RELEASE:=1
PKG_HASH:=33677c1fcf6a2f35d2718834fd0afdb36166b0cc68349820e05d8f9316b1dafc
PATCH_DIR:=./patches/v6.x
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
  DEPENDS:=+libstdcpp +libopenssl +zlib +USE_UCLIBC:libpthread +USE_UCLIBC:librt +NODEJS_ICU:icu
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

define Package/node/config
	menu "Configuration"
		depends on PACKAGE_node

	choice
		prompt "Version Selection"
		default NODEJS_6
		help
		 Select node.js version.

		config NODEJS_4
			bool "4.x LTS"

		config NODEJS_6
			bool "6.x LTS"

		config NODEJS_8
			bool "8.x LTS"

		config NODEJS_9
			bool "9.x Current"
	endchoice

	config NODEJS_ICU
		depends on !NODEJS_4
		bool "Enable i18n features"
		default n

	config NODEJS_DEBUG
		bool "Debug build"
		default n

	endmenu
endef

NODEJS_CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))

MAKE_VARS+= \
	DESTCPU=$(NODEJS_CPU)

ifeq ($(CONFIG_NODEJS_DEBUG),y)
	STRIP:="/bin/true"
endif

CONFIGURE_ARGS:= \
	--dest-cpu=$(NODEJS_CPU) \
	--dest-os=linux \
	--without-snapshot \
	--shared-zlib \
	--shared-openssl \
	$(if $(CONFIG_NODEJS_DEBUG),--debug,) \
	$(if $(CONFIG_NODEJS_4),,--with-intl=$(if $(CONFIG_NODEJS_ICU),system-icu,none)) \
	$(if $(findstring mips,$(NODEJS_CPU)), \
		$(if $(CONFIG_SOFT_FLOAT),--with-mips-float-abi=soft,)) \
	$(if $(findstring arm,$(NODEJS_CPU)), \
		$(if $(CONFIG_SOFT_FLOAT),, \
			$(if $(findstring neon,$(CONFIG_CPU_TYPE)), --with-arm-fpu=neon, \
			$(if $(findstring vfpv3,$(CONFIG_CPU_TYPE)), --with-arm-fpu=vfpv3,)))) \
	--prefix=/usr

HOST_CONFIGURE_VARS:=
HOST_CONFIGURE_ARGS:= \
	--dest-os=linux \
	--without-snapshot \
	--shared-zlib \
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
ifneq ($(filter y,$(CONFIG_NODEJS_8) $(CONFIG_NODEJS_9)),)
	$(LN) ../lib/node_modules/npm/bin/npx-cli.js $(1)/usr/bin/npx
endif
endef

$(eval $(call HostBuild))
$(eval $(call BuildPackage,node))
$(eval $(call BuildPackage,node-npm))
