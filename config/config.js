/**
 * Created by Sabri on 2/15/2017.
 */

var config = {
    development: {
        //url to be used in link generation
        url: '127.0.0.1:3000',
        //mongodb connection settings
        database: {
            host:   '127.0.0.1',
            port:   '27017',
            db:     'testDB'
        },
        //server details
        server: {
            host: '',
            port: ''
        }
    },
    production: {
        //url to be used in link generation
        url: 'http://my.site.com',
        //mongodb connection settings
        database: {
            host: '127.0.0.1',
            port: '27017',
            db:     'site'
        },
        //server details
        server: {
            host:   '127.0.0.1',
            port:   '3421'
        }
    }
};
module.exports = config;