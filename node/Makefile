# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=node
#PKG_VERSION:=
#PKG_RELEASE:=

ifeq ($(CONFIG_NODEJS_8),y)
PKG_VERSION:=v8.2.0
PKG_RELEASE:=1
PKG_HASH:=4ce8975176630eb60cc8da256a6039e1d3d0e8bed472948a83ed4f22e8134781
PATCH_DIR:=./patches/v8.x
else
ifeq ($(CONFIG_NODEJS_4),y)
PKG_VERSION:=v4.8.4
PKG_RELEASE:=1
PKG_HASH:=35fe633a48cbe93c79327161d9dc964ac9810f4ceb2ed8628487e6e14a15905b
PATCH_DIR:=./patches/v4.x
else
PKG_VERSION:=v6.11.1
PKG_RELEASE:=1
PKG_HASH:=6f6655b85919aa54cb045a6d69a226849802fcc26491d0db4ce59873e41cc2b8
PATCH_DIR:=./patches/v6.x
endif
endif

PKG_SOURCE:=node-$(PKG_VERSION).tar.xz
PKG_SOURCE_URL:=http://nodejs.org/dist/${PKG_VERSION}
#PKG_HASH:=

HOST_BUILD_DEPENDS:=python/host
PKG_BUILD_DEPENDS:=python/host NODEJS_8:node/host
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
			bool "8.x Current"
	endchoice

	config NODEJS_ICU
		depends on !NODEJS_4
		bool "Enable i18n features"
		default n

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

ifeq ($(CONFIG_NODEJS_8),y)
MKTOOL=$(BUILD_DIR_HOST)/node-$(PKG_VERSION)/out/Release/mkpeephole
FILE_V8_GYP:=$(PKG_BUILD_DIR)/deps/v8/src/v8.gyp
endif

define Build/Prepare
	$(if $(findstring arm,$(NODEJS_CPU)), $(if $(CONFIG_SOFT_FLOAT), \
		echo "You can't running Node.js on ARM CPU without hardware FPU."; \
		exit 1; \
	))
	$(Build/Prepare/Default)
ifeq ($(CONFIG_NODEJS_8),y)
	$(SED) "s#<(mkpeephole_exec)#$(MKTOOL)#g" $(FILE_V8_GYP)
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
endef

$(eval $(call HostBuild))
$(eval $(call BuildPackage,node))
$(eval $(call BuildPackage,node-npm))
