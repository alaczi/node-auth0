const BaseManager = require('./BaseManager');

/**
 * Manages Auth0 Device Codes.
 */
class DeviceCodeManager extends BaseManager {
  /**
   * @param {object} options            The client options.
   * @param {string} options.baseUrl    The URL of the API.
   * @param {object} [options.headers]  Headers to be included in all requests.
   * @param {object} [options.retry]    Retry Policy Config
   */
  constructor(options) {
    super(options);

    this.verifyDevice = this._getRestClient('/device/verify');

    this.activateDevice = this._getRestClient('/device/activate');
  }

  /**
   * Verify a device code.
   *
   * @example
   * management.deviceCode.verify(data, function (err) {
   *   if (err) {
   *     // Handle error.
   *   }
   *
   *   // Information about the device code is returned.
   * });
   * @param   {object}    data     The device data object.
   * @param   {Function}  [cb]     Callback function.
   * @returns  {Promise|undefined}
   */
  verify(...args) {
    return this.verifyDevice.create(...args);
  }

  /**
   * Activate an Auth0 device code.
   *
   * @example
   * var params = {
   *   "user_code": "$user_code",
   *   "subject_token": "$access_token"
   * };
   *
   * management.deviceCode.approve(params, function (err) {
   *   if (err) {
   *     // Handle error.
   *   }
   *
   *   // Device Code approved.
   * });
   * @param   {object}    params          Credential parameters.
   * @param   {string}    params.id       Device credential ID.
   * @param   {Function}  [cb]            Callback function.
   * @returns  {Promise|undefined}
   */
  activate(...args) {
    return this.activateDevice.create(...args);
  }
}

module.exports = DeviceCodeManager;
