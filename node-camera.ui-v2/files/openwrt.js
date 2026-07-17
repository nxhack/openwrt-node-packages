import { APP_CLI_NAME, sleep } from '@camera.ui/common';
import { getNpmGlobalModulesDirectory } from '@camera.ui/common/node';
import { mkdirp, pathExists } from 'fs-extra/esm';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { chmod, readdir, rm, writeFile } from 'node:fs/promises';
import { userInfo } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { osInfo } from 'systeminformation';
import { BasePlatform } from './base.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export class LinuxInstaller extends BasePlatform {
    get systemdServiceName() {
        return this.cli.serviceName.toLowerCase();
    }
    get systemdServicePath() {
        return resolve('/etc/init.d', this.systemdServiceName);
    }
    get runPartsPath() {
        return resolve('/etc/cameraui', this.cli.serviceName.toLowerCase(), 'prestart.d');
    }
    async install() {
        this.checkForRoot();
        await this.checkUser();
        this.setupSudo();
        await this.cli.portCheck();
        await this.cli.homePathCheck();
        try {
            await this.createSystemdService();
            await this.createRunPartsPath();
            await this.enableService();
            await this.start();
        }
        catch (e) {
            console.error(e.toString());
            this.cli.logger('ERROR: Failed Operation', 'fail');
        }
    }
    async uninstall() {
        this.checkForRoot();
        await this.stop();
        // try and disable the service
        await this.disableService();
        try {
            if (existsSync(this.systemdServicePath)) {
                rmSync(this.systemdServicePath);
            }
            if (existsSync(this.runPartsPath)) {
                rmSync(this.runPartsPath, { recursive: true });
            }
            // reload services
            this.cli.logger(`Removed ${this.cli.serviceName} service`, 'succeed');
        }
        catch (e) {
            console.error(e.toString());
            this.cli.logger('ERROR: Failed Operation', 'fail');
        }
    }
    async reinstall() {
        await this.uninstall();
        await sleep(2000);
        await this.install();
    }
    async start() {
        this.checkForRoot();
        try {
            execSync(`/etc/init.d/${this.systemdServiceName} start`);
            await this.waitForApiAndPrintInstructions('start');
        }
        catch (e) {
            this.cli.logger(`Failed to start ${this.cli.serviceName} - ` + e, 'fail');
            process.exit(1);
        }
    }
    async stop() {
        this.checkForRoot();
        try {
            execSync(`/etc/init.d/${this.systemdServiceName} stop`);
            this.cli.logger(`${this.cli.serviceName} stopped`, 'succeed');
        }
        catch (e) {
            this.cli.logger(`Failed to stop ${this.systemdServiceName} - ` + e, 'fail');
        }
    }
    async restart() {
        this.checkForRoot();
        try {
            execSync(`/etc/init.d/${this.systemdServiceName} restart`);
            this.cli.logger(`${this.cli.serviceName} restarted`, 'succeed');
            await this.waitForApiAndPrintInstructions('restart');
        }
        catch (e) {
            this.cli.logger(`Failed to restart ${this.cli.serviceName} - ` + e, 'fail');
        }
    }
    async rebuild(all = false) {
        this.cli.logger('ERROR: You cannot rebuild in the Openwrt.', 'fail');
    }
    async getId() {
        if (process.getuid?.() === 0 && this.cli.asUser) {
            const uid = execSync(`id -u ${this.cli.asUser}`).toString('utf8');
            const gid = execSync(`id -g ${this.cli.asUser}`).toString('utf8');
            return {
                uid: parseInt(uid, 10),
                gid: parseInt(gid, 10),
            };
        }
        else {
            return {
                uid: userInfo().uid,
                gid: userInfo().gid,
            };
        }
    }
    getPidOfPort(port) {
        try {
            if (this.cli.isDocker) {
                return execSync('pidof cameraui').toString('utf8').trim();
            }
            else {
                return execSync(`fuser ${port}/tcp 2>/dev/null`).toString('utf8').trim();
            }
        }
        catch {
            return null;
        }
    }
    async updateNodejs(job) {
        this.cli.logger('ERROR: You cannot update Nodejs in the Openwrt.', 'fail');
    }
    async waitForApiAndPrintInstructions(type) {
        const apiReady = await this.cli.waitForApiHealth();
        if (apiReady) {
            await this.cli.printPostInstallInstructions(type);
        }
        else {
            this.cli.logger('WARNING: There might be errors, or the setup might still be in progress.\n' + '  You can check the logs using the command: cameraui logs', 'warn');
        }
    }
    async enableService() {
        try {
            execSync(`/etc/init.d/${this.systemdServiceName} enable 2> /dev/null`);
        }
        catch (error) {
            this.cli.logger(`WARNING: failed to run "/etc/init.d/${this.systemdServiceName}" enable: ${error.message}`, 'warn');
        }
    }
    async disableService() {
        try {
            execSync(`/etc/init.d/${this.systemdServiceName} disable 2> /dev/null`);
        }
        catch (error) {
            this.cli.logger(`WARNING: failed to run "/etc/init.d/${this.systemdServiceName}" disable: ${error.message}`, 'warn');
        }
    }
    checkForRoot() {
        if (process.getuid?.() !== 0) {
            this.cli.logger('ERROR: This command must be executed using sudo on Linux', 'fail');
            this.cli.logger(`EXAMPLE: sudo cameraui ${this.cli.action}`, 'fail');
            process.exit(1);
        }
        if ((this.cli.action === 'install' || this.cli.action === 'reinstall') && !this.cli.asUser) {
            this.cli.logger('ERROR: User parameter missing. Pass in the user you want to run camera.ui as using the --user flag eg.', 'fail');
            this.cli.logger(`EXAMPLE: sudo cameraui ${this.cli.action} --user your-user`, 'fail');
            process.exit(1);
        }
    }
    async checkUser() {
        try {
            // check if user exists
            execSync(`id ${this.cli.asUser} 2> /dev/null`);
        }
        catch {
            // if not create the user
            execSync(`useradd -m --system ${this.cli.asUser}`);
            this.cli.logger(`Created service user: ${this.cli.asUser}`, 'info');
            if (this.cli.addGroup) {
                execSync(`usermod -a -G ${this.cli.addGroup} ${this.cli.asUser}`, { timeout: 10000 });
                this.cli.logger(`Added ${this.cli.asUser} to group ${this.cli.addGroup}`, 'info');
            }
        }
        try {
            // try and add the user to commonly required groups if on Raspbian
            const os = await osInfo();
            if (os.distro === 'Raspbian GNU/Linux') {
                execSync(`usermod -a -G audio,bluetooth,dialout,gpio,video ${this.cli.asUser} 2> /dev/null`);
                execSync(`usermod -a -G input,i2c,spi ${this.cli.asUser} 2> /dev/null`);
            }
        }
        catch {
            // do nothing
        }
    }
    async createRunPartsPath() {
        await mkdirp(this.runPartsPath);
    }
    setupSudo() {
        try {
            const sysctlPath = execSync('which sysctl').toString('utf8').trim();
            const sudoersEntry = `${this.cli.asUser}    ALL=(ALL) NOPASSWD:SETENV: ${sysctlPath}}}`;
            // check if the sudoers file already contains the entry
            const sudoers = readFileSync('/etc/sudoers', 'utf-8');
            if (sudoers.includes(sudoersEntry)) {
                return;
            }
            // grant the user restricted sudo privileges to /sbin/sysctl
            execSync(`echo '${sudoersEntry}' | sudo EDITOR='tee -a' visudo`);
        }
        catch (error) {
            this.cli.logger(`WARNING: Failed to setup /etc/sudoers, you may see performance issues when streaming: ${error.message}`, 'warn');
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
            '	[ -d /usr/share/cameraui ] || {',
            '		mkdir -m 0755 -p /usr/share/cameraui',
            '		chmod 0700 /usr/share/cameraui',
            '		chown cameraui:cameraui /usr/share/cameraui',
            ' }',
            ' procd_open_instance',
            ' procd_set_param env HOME=/usr/share/cameraui',
            ' procd_set_param command /usr/bin/node --optimize_for_size --max_old_space_size=256 --gc_interval=100 --preserve-symlinks /usr/bin/cameraui run -H /usr/share/cameraui --user cameraui --group cameraui',
            ' procd_set_param user cameraui',
            ' procd_set_param respawn',
            ' procd_set_param stdout 1',
            ' procd_set_param stderr 1',
            ' procd_set_param term_timeout 60',
            ' procd_close_instance',
            '}',
        ].filter((x) => x !== null).join('\n');
        await writeFile(this.systemdServicePath, serviceFile);
        await chmod(this.systemdServicePath, '755');
    }
}
//# sourceMappingURL=linux.js.map
