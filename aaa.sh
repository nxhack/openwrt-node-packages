#!/bin/sh

for file in `ls -1 node-*/Makefile`; do
#    sed -i -e 's|^	rm -rf $(TMP_DIR)/npm-cache-$(TMPNPM)|	rm -rf $(TMP_DIR)/npm-cache-$(TMPNPM)\n	rm -f $(PKG_BUILD_DIR)/node_modules/.package-lock.json\n	find $(PKG_BUILD_DIR)/node_modules -type d -empty -print0 \| xargs -0 rmdir \|\| true|g' ${file}
#    sed -i -e 's|^	rm -rf $(TMP_DIR)/npm-cache-$(HOSTTMPNPM)|	rm -rf $(TMP_DIR)/npm-cache-$(HOSTTMPNPM)\n	rm -f $(HOST_BUILD_DIR)/node_modules/.package-lock.json\n	find $(HOST_BUILD_DIR)/node_modules -type d -empty -print0 \| xargs -0 rmdir \|\| true|g' ${file}
    sed -i -e 's|^	npm install --production|	npm install --global-style --production --no-package-lock|g' ${file}
done
