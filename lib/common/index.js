/*jshint camelcase: false */

'use strict';

var util = require('util');
var Net = require('net');
var Url = require('url');
var S = require('string');
var AzureEnvironment = require('ms-rest-azure').AzureEnvironment;

module.exports.validateEnvironmentVariables = function() {
  var envs = [];
  var envNames = ['environment', 'subscription_id', 'tenant_id', 'client_id', 'client_secret'];
  envNames.forEach(function(value) {
    if (!process.env[value]) {
      envs.push(value);
    }
  });
  if (envs.length > 0) {
    throw new Error(util.format('please set/export the following environment variables: %s', envs.toString()));
  }
};

module.exports.getCredentialsAndSubscriptionId = function() {
  var environment = process.env['environment'];
  var subscriptionId = process.env['subscription_id'];
  var tenantId = process.env['tenant_id'];
  var clientId = process.env['client_id'];
  var clientSecret = process.env['client_secret'];
  return {
    environment: environment,
    subscription_id: subscriptionId,
    tenant_id: tenantId,
    client_id: clientId,
    client_secret: clientSecret,
  };
};

module.exports.getEnvironment = function(environmentName) {
  var azureEnv;
  if (environmentName == 'AzureCloud') {
    azureEnv = AzureEnvironment.Azure;
  } else if (environmentName == 'AzureChinaCloud') {
    azureEnv = AzureEnvironment.AzureChina;
  } else {
    throw new Error(util.format('Environment %s is not supported', environmentName));
  }
  if (!S(azureEnv.resourceManagerEndpointUrl).endsWith('/')) {
    azureEnv.resourceManagerEndpointUrl = azureEnv.resourceManagerEndpointUrl + '/' ;
  }
  return azureEnv;
};

module.exports.API_VERSION = {
  AzureCloud: {
    TOKEN: '2015-05-01-preview',
    RESOURCE_GROUP: '2015-11-01',
    SERVICE_BUS_NAMESPACE: '2015-08-01', // https://msdn.microsoft.com/en-us/library/azure/mt639413.aspx
    SQL: '2014-04-01-preview'            // https://msdn.microsoft.com/en-us/library/azure/mt163571.aspx
  },
  AzureChinaCloud: {
    TOKEN: '2015-05-01-preview',
    RESOURCE_GROUP: '2015-11-01',
    SERVICE_BUS_NAMESPACE: '2015-08-01',
    SQL: '2014-04-01-preview'
  }
};
