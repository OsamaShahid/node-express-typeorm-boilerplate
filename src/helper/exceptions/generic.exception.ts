export class GenericException extends Error {

  code: number;
  meta: object;

  constructor (message: string, code = 500, meta = {}) {

    super(message);
    this.code = code;
    this.meta = meta;

  }

  toJson () {

    const jsonObj = JSON.parse(JSON.stringify(this.meta || {}));

    jsonObj.code = this.code;
    jsonObj.message = this.message;

    return jsonObj;

  }

}
