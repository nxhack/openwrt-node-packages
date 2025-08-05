"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinuxInstaller = void 0;
const node_child_process_1 = require("node:child_process");
const node_os_1 = require("node:os");
const node_path_1 = require("node:path");
const node_process_1 = __importDefault(require("node:process"));
const fs_extra_1 = require("fs-extra");
const semver_1 = require("semver");
const systeminformation_1 = require("systeminformation");
const base_platform_1 = require("../base-platform");
class LinuxInstaller extends base_platform_1.BasePlatform {
    get systemdServiceName() {
        return this.hbService.serviceName.toLowerCase();
    }
    get systemdServicePath() {
        return (0, node_path_1.resolve)('/etc/init.d', `${this.systemdServiceName}`);
    }

    async install() {
        this.checkForRoot();
        await this.checkUser();
        this.setupSudo();
        await this.hbService.portCheck();
        await this.hbService.storagePathCheck();
        await this.hbService.configCheck();
        try {
            await this.createSystemdService();
            await this.enableService();
            await this.start();
            await this.hbService.printPostInstallInstructions();
        }
        catch (e) {
            console.error(e.toString());
            this.hbService.logger('ERROR: Failed Operation', 'fail');
        }
    }
    async uninstall() {
        this.checkForRoot();
        await this.stop();
        await this.disableService();
        try {
            if ((0, fs_extra_1.existsSync)(this.systemdServicePath)) {
                (0, fs_extra_1.unlinkSync)(this.systemdServicePath);
            }
            this.hbService.logger(`Removed ${this.hbService.serviceName} Service`, 'succeed');
        }
        catch (e) {
            console.error(e.toString());
            this.hbService.logger('ERROR: Failed Operation', 'fail');
        }
    }
    async viewLogs() {
        try {
            const ret = (0, node_child_process_1.execSync)(`sudo logread -l 100 -e ${this.systemdServiceName}`).toString();
            console.log(ret);
        }
        catch (e) {
            this.hbService.logger(`Failed to start ${this.hbService.serviceName} - ${e}`, 'fail');
        }
    }
    async start() {
        this.checkForRoot();
        try {
            this.hbService.logger(`Starting ${this.hbService.serviceName} Service...`);
            (0, node_child_process_1.execSync)(`/etc/init.d/${this.systemdServiceName} start`);
        }
        catch (e) {
            this.hbService.logger(`Failed to start ${this.hbService.serviceName} - ${e}`, 'fail');
            node_process_1.default.exit(1);
        }
    }
    async stop() {
        this.checkForRoot();
        try {
            this.hbService.logger(`Stopping ${this.hbService.serviceName} Service...`);
            (0, node_child_process_1.execSync)(`/etc/init.d/${this.systemdServiceName} stop`);
            this.hbService.logger(`${this.hbService.serviceName} Stopped`, 'succeed');
        }
        catch (e) {
            this.hbService.logger(`Failed to stop ${this.systemdServiceName} - ${e}`, 'fail');
        }
    }
    async restart() {
        this.checkForRoot();
        try {
            this.hbService.logger(`Restarting ${this.hbService.serviceName} Service...`);
            (0, node_child_process_1.execSync)(`/etc/init.d/${this.systemdServiceName} restart`);
            this.hbService.logger(`${this.hbService.serviceName} Restarted`, 'succeed');
        }
        catch (e) {
            this.hbService.logger(`Failed to restart ${this.hbService.serviceName} - ${e}`, 'fail');
        }
    }
    async rebuild(all = false) {
        this.hbService.logger('ERROR: You cannot rebuild in the Openwrt.', 'fail');
    }
    async getId() {
        if (node_process_1.default.getuid() === 0 && this.hbService.asUser) {
            const uid = (0, node_child_process_1.execSync)(`id -u ${this.hbService.asUser}`).toString('utf8');
            const gid = (0, node_child_process_1.execSync)(`id -g ${this.hbService.asUser}`).toString('utf8');
            return {
                uid: Number.parseInt(uid, 10),
                gid: Number.parseInt(gid, 10),
            };
        }
        else {
            return {
                uid: (0, node_os_1.userInfo)().uid,
                gid: (0, node_os_1.userInfo)().gid,
            };
        }
    }
    getPidOfPort(port) {
        try {
            if (this.hbService.docker) {
                return (0, node_child_process_1.execSync)('pidof homebridge').toString('utf8').trim();
            }
            else {
                return (0, node_child_process_1.execSync)(`fuser ${port}/tcp 2>/dev/null`).toString('utf8').trim();
            }
        }
        catch (e) {
            return null;
        }
    }
    async updateNodejs(job) {
        this.hbService.logger('ERROR: You cannot update Nodejs in the Openwrt.', 'fail');
    }
    async enableService() {
        try {
            (0, node_child_process_1.execSync)(`/etc/init.d/${this.systemdServiceName} enable 2> /dev/null`);
        }
        catch (e) {
            this.hbService.logger(`WARNING: failed to run "systemctl enable ${this.systemdServiceName}"`, 'warn');
        }
    }
    async disableService() {
        try {
            (0, node_child_process_1.execSync)(`/etc/init.d/${this.systemdServiceName} disable 2> /dev/null`);
        }
        catch (e) {
            this.hbService.logger(`WARNING: failed to run "/etc/init.d/${this.systemdServiceName} disable"`, 'warn');
        }
    }
    checkForRoot() {
        if (node_process_1.default.getuid() !== 0) {
            this.hbService.logger('ERROR: This command must be executed using sudo on Linux', 'fail');
            this.hbService.logger(`EXAMPLE: sudo hb-service ${this.hbService.action}`, 'fail');
            node_process_1.default.exit(1);
        }
        if (this.hbService.action === 'install' && !this.hbService.asUser) {
            this.hbService.logger('ERROR: User parameter missing. Pass in the user you want to run Homebridge as using the --user flag eg.', 'fail');
            this.hbService.logger(`EXAMPLE: sudo hb-service ${this.hbService.action} --user your-user`, 'fail');
            node_process_1.default.exit(1);
        }
    }
    checkIsNotRoot() {
        if (node_process_1.default.getuid() === 0 && !this.hbService.allowRunRoot && node_process_1.default.env.HOMEBRIDGE_CONFIG_UI !== '1') {
            this.hbService.logger('ERROR: This command must not be executed as root or with sudo', 'fail');
            this.hbService.logger('ERROR: If you know what you are doing; you can override this by adding --allow-root', 'fail');
            node_process_1.default.exit(1);
        }
    }
    async checkUser() {
        try {
            (0, node_child_process_1.execSync)(`id ${this.hbService.asUser} 2> /dev/null`);
        }
        catch (e) {
            (0, node_child_process_1.execSync)(`useradd -m --system ${this.hbService.asUser}`);
            this.hbService.logger(`Created service user: ${this.hbService.asUser}`, 'info');
            if (this.hbService.addGroup) {
                (0, node_child_process_1.execSync)(`usermod -a -G ${this.hbService.addGroup} ${this.hbService.asUser}`, { timeout: 10000 });
                this.hbService.logger(`Added ${this.hbService.asUser} to group ${this.hbService.addGroup}`, 'info');
            }
        }
        try {
            const os = await (0, systeminformation_1.osInfo)();
            if (os.distro === 'Raspbian GNU/Linux') {
                (0, node_child_process_1.execSync)(`usermod -a -G audio,bluetooth,dialout,gpio,video ${this.hbService.asUser} 2> /dev/null`);
                (0, node_child_process_1.execSync)(`usermod -a -G input,i2c,spi ${this.hbService.asUser} 2> /dev/null`);
            }
        }
        catch (e) {
        }
    }
    setupSudo() {
        try {
            const sudoersEntry = `${this.hbService.asUser}    ALL=(ALL) NOPASSWD:SETENV: /etc/init.d/homebridge, /sbin/halt, /sbin/reboot, /sbin/poweroff, /sbin/logread, /usr/bin/npm, /usr/bin/hb-service`;
            const sudoers = (0, fs_extra_1.readFileSync)('/etc/sudoers', 'utf-8');
            if (sudoers.includes(sudoersEntry)) {
                return;
            }
            (0, node_child_process_1.execSync)(`echo '${sudoersEntry}' | sudo EDITOR='tee -a' visudo`);
        }
        catch (e) {
            this.hbService.logger('WARNING: Failed to setup /etc/sudoers, you may not be able to shutdown/restart your server from the Homebridge UI.', 'warn');
        }
    }
    async createSystemdService() {
        const serviceFile = [
            '#!/bin/sh /etc/rc.common',
            '',
            'START=98',
            'USE_PROCD=1',
            '',
            'start_service() {',
            '	[ -d /usr/share/homebridge ] || {',
            '		mkdir -m 0755 -p /usr/share/homebridge',
            '		chmod 0700 /usr/share/homebridge',
            '		chown homebridge:homebridge /usr/share/homebridge',
            '	}',
            '	procd_open_instance',
            '	procd_set_param env HOME=/usr/share/homebridge',
            '	procd_set_param command /usr/bin/node --optimize_for_size --max_old_space_size=256 --gc_interval=100 /usr/bin/hb-service run -U /usr/share/homebridge --port 8581',
            '	procd_set_param user homebridge',
            '	procd_set_param respawn',
            '	procd_set_param stdout 1',
            '	procd_set_param stderr 1',
            '	procd_set_param term_timeout 60',
            '	procd_close_instance',
            '',
            '}',
        ].filter(x => x !== null).join('\n');
        await (0, fs_extra_1.writeFile)(this.systemdServicePath, serviceFile);
    }
}
exports.LinuxInstaller = LinuxInstaller;
//# sourceMappingURL=linux.js.map
