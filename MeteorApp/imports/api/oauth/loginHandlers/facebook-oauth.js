import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { HTTP } from 'meteor/http';
import { _ } from 'meteor/underscore';

const registerHandler = () => {
  Accounts.registerLoginHandler('facebook', function (params) {
    const data = params.facebook;

    if (!data) {
      return undefined;
    }

    const whitelisted = ['id', 'email', 'name', 'first_name',
     'last_name', 'link', 'gender', 'locale', 'age_range'];

     const identity = getIdentity(data.accessToken, whitelisted);

     const serviceData = {
      accessToken: data.accessToken,
      expiresAt: (+new Date) + (1000 * data.expirationTime)
    };
    const fields = Object.assign({}, serviceData, identity);

    const existingUser = Meteor.users.findOne({ 'services.facebook.id': identity.id });

    let userId;
    if (existingUser) {
      userId = existingUser._id;
      const prefixedData = {};
      _.each(fields, (val, key) => {
        prefixedData[`services.facebook.${key}`] = val;
      });

      Meteor.users.update({ _id: userId }, {
        $set: prefixedData,
        $addToSet: { emails: { address: identity.email, verified: true } }
      });

    } else {
      userId = Meteor.users.insert({
        services: {
          facebook: fields
        },
        profile: { name: identity.name },
        emails: [{
          address: identity.email,
          verified: true
        }]
      });
    }

    return { userId: userId };
  });
};

const getIdentity = (accessToken, fields) => {
  try {
    return HTTP.get("https://graph.facebook.com/v2.8/me", {
      params: {
        access_token: accessToken,
        fields: fields
      }
    }).data;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from Facebook. " + err.message),
                   {response: err.response});
  }
};

export default registerHandler;