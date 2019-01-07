/**
 * Copyright (c) 2018 IT Solutions Roland Breitschaft <info@x-company.de>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 *
 * @Script: Log.ts
 * @Author: Roland Breitschaft
 * @Email: roland.breitschaft@x-company.de
 * @Create At: 2018-12-22 09:23:35
 * @Last Modified By: Roland Breitschaft
 * @Last Modified At: 2019-01-05 17:44:11
 * @Description: This is description.
 */

import logSymbols from 'log-symbols';

export class Log {

    public static init(level: string) {
        this.level = level;
    }

    public static verbose(message: string, ...args: any[]) {
        if (this.isLoggingAllowed('verbose')) {
            if (args && args.length !== 0) {
                console.log(message, args);
            } else {
                console.log(message);
            }
        }
    }

    public static info(message: string, ...args: any[]) {
        if (this.isLoggingAllowed('info')) {
            if (args && args.length !== 0) {
                console.log(logSymbols.info, message, args);
            } else {
                console.log(logSymbols.info, message);
            }
        }
    }

    public static success(message: string, ...args: any[]) {
        if (this.isLoggingAllowed('success')) {
            if (args && args.length !== 0) {
                console.log(logSymbols.success, message, args);
            } else {
                console.log(logSymbols.success, message);
            }
        }
    }

    public static warning(message: string, ...args: any[]) {
        if (this.isLoggingAllowed('warn')) {
            if (args && args.length !== 0) {
                console.log(logSymbols.warning, message, args);
            } else {
                console.log(logSymbols.warning, message);
            }
        }
    }

    public static error(message: string, ...args: any[]) {
        if (this.isLoggingAllowed('error')) {
            if (args && args.length !== 0) {
                console.log(logSymbols.info, message, args);
            } else {
                console.log(logSymbols.info, message);
            }
        }
    }

    public static critical(message: string | Error, ...args: any[]): Error {

        let error: Error;
        if (typeof message === 'string') {
            error = new Error(message);
        } else {
            error = message;
        }
        if (this.isLoggingAllowed('critical')) {
            if (error) {
                Log.error(error.message, args);
            }
        }
        return error;
    }

    private static level: string;

    private static isLoggingAllowed(level: string): boolean {
        if (this.level === 'verbose') {
            if (level === 'verbose' || level === 'info' || level === 'success' || level === 'warn' || level === 'error' || level === 'critical') {
                return true;
            }
        } else if (this.level === 'info') {
            if (level === 'info' || level === 'success' || level === 'warn' || level === 'error' || level === 'critical') {
                return true;
            }
        } else if (this.level === 'warn') {
            if (level === 'warn' || level === 'error' || level === 'critical') {
                return true;
            }
        } else if (this.level === 'error' || this.level === 'critical') {
            if (level === 'error' || level === 'critical') {
                return true;
            }
        }

        return false;
    }
}
