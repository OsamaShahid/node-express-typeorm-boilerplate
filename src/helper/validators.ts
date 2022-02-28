import { clogger } from "./console";

export class Validators {
  static isValidStr(str: any) {
    if (!str) {
      return false;
    }

    return str && typeof str === "string" && str.trim() && str !== "";
  }

  static isValidJSON(str: any) {
    if (!str) {
      return false;
    }

    if (typeof str === "string") {
      try {
        str = JSON.parse(str);
      } catch (e) {
        return false;
      }
    }

    return !!Object.keys(str).length;
  }

  static isValidPassword(pPassword: string) {
    if (/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(pPassword)) {
      return true;
    }

    return false;
  }

  static getParsedJson(data: any) {
    if (!data) {
      return null;
    }

    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch (e) {
        clogger.error(e);

        return null;
      }
    } else if (Object.keys(data).length) {
      return data;
    }
  }

  static propExists(key: any, obj: any) {
    return Object.prototype.hasOwnProperty.call(obj, key) && key in obj;
  }

  static isArray(variable: any) {
    return (
      variable &&
      Object.prototype.toString.call(variable) === "[object Array]" &&
      Array.isArray(variable)
    );
  }

  static parseInteger(value: any, defaultValue: number) {
    try {
      value = parseInt(value, 10);

      return Number.isNaN(value) ? defaultValue : value;
    } catch (ex) {
      return defaultValue;
    }
  }

  static isPNG(fileName: string) {
    if (!fileName || !fileName.length || fileName.lastIndexOf(".") === -1) {
      return false;
    }

    return fileName.substring(fileName.lastIndexOf(".") + 1) === "png";
  }

  static isObject(value: any) {
    return value && typeof value === "object" && value.constructor === Object;
  }

  static isString(value: any) {
    if (!value) {
      return false;
    }

    return value && typeof value === "string" && value.trim();
  }

  static isBoolean(value: any) {
    try {
      return typeof JSON.parse(value) === "boolean";
    } catch (err) {
      return false;
    }
  }

  static isValidDomain(email: string, domain: string) {
    if (this.isValidStr(email) && this.isValidStr(domain)) {
      const pattern = new RegExp(`@?(${domain})$`, "i");

      return pattern.test(email);
    }

    return false;
  }

  static isFunction(fn: any) {
    return fn && typeof fn === "function";
  }

  static isUndefined(obj: any) {
    return typeof obj === "undefined";
  }

  static isNumber(value: any) {
    return typeof value === "number";
  }

  static isNaN(value: any) {
    return !/^\d+$/.test(value);
  }

  static isValidNumber(value: any) {
    return this.isNumber(value) && !this.isNaN(value);
  }

  static getParsedValue(value: any) {
    try {
      if (!value || value.trim() === "") {
        return value;
      }

      const boolValue = value.toLowerCase();

      if (boolValue === "true") {
        return true;
      }

      if (boolValue === "false") {
        return false;
      }

      const num = Number(value);

      if (!Number.isNaN(num)) {
        const numberRegEx = new RegExp(/^\d+(\.\d+)?$/);

        if (numberRegEx.test(value)) {
          return num;
        }
      }
    } catch (err) {
      clogger.error(
        `getParsedValue:: Error occurred while parsing value: ${value} error: `,
        err
      );
    }

    return value;
  }
}
