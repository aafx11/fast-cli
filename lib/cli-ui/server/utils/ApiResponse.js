class ApiResponse {
  constructor(code, success, data=null, message='') {
    this.code = code;
    this.success = success;
    this.data = data;
    this.message = message;
  }
}

module.exports = ApiResponse;