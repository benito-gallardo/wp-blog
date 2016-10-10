'use strict';

window.algolia = require('./algolia');
var url = require('url');

  /////////////////////////////////////////////////
  // Algolia Config
  var urlPathName = url.parse(location.href).pathname;
  urlPathName = stripTrailingSlash(urlPathName);
  if (urlPathName === '/search') {
    algolia.init();
    algolia.config.APPLICATION_ID = '7FI9T0IXZ5';
    algolia.config.SEARCH_ONLY_API_KEY = 'b998ea87dc6edcbdf733d2796f8eccf7';
    algolia.config.INDEX_NAME = 'prismic_products';
    algolia.config.HITS_PER_PAGE = 10;
    algolia.config.MAX_VALUES_PER_FACET = 30;
    algolia.config.FACET_CONFIG = [
      { name: 'fragments.product.flavour.value', title: 'flavor', disjunctive: true, sortFunction: algolia.sortByName, topListIfRefined: true },
      { name: 'fragments.product.name.value.text', title: 'name', disjunctive: true, sortFunction: algolia.sortByName, topListIfRefined: true }
    ];
  } else if (urlPathName === '/ecommerce-library') {
    algolia.init();
    algolia.config.APPLICATION_ID = '7FI9T0IXZ5';
    algolia.config.SEARCH_ONLY_API_KEY = 'b998ea87dc6edcbdf733d2796f8eccf7';
    algolia.config.INDEX_NAME = 'vol-resources2016-04-13T22:11:13.695Z';
    algolia.config.HITS_PER_PAGE = 10;
    algolia.config.MAX_VALUES_PER_FACET = 30;
    algolia.config.FACET_CONFIG = [
      { name: 'fragments.resource.resourceTopics.value.topic.value', title: 'Topics', disjunctive: true, sortFunction: algolia.sortByName, topListIfRefined: false },
      { name: 'fragments.resource.resourceType.value', title: 'Type', disjunctive: true, sortFunction: algolia.sortByCountDesc, topListIfRefined: false }
    ];
  } else if (urlPathName === '/marketplace') {
    algolia.init();
    algolia.config.APPLICATION_ID = '7FI9T0IXZ5';
    algolia.config.SEARCH_ONLY_API_KEY = 'b998ea87dc6edcbdf733d2796f8eccf7';
    algolia.config.INDEX_NAME = 'vol-apps2016-07-29T16:15:44.017Z';
    algolia.config.HITS_PER_PAGE = 10;
    algolia.config.MAX_VALUES_PER_FACET = 30;
    algolia.config.FACET_CONFIG = [
      { name: 'fragments.app.appType.value.productType.value', title: 'Type', disjunctive: true, sortFunction: algolia.sortByName, topListIfRefined: false },
      { name: 'fragments.app.appCategories.value.catgory.value', title: 'Categories', disjunctive: true, sortFunction: algolia.sortByName, topListIfRefined: false },
      { name: 'fragments.app.appIsFree.value', title: 'Price', disjunctive: true, sortFunction: algolia.sortByCountDesc, topListIfRefined: false },
      { name: 'fragments.app.appIsFeatured.value.attribute.value', title: 'Extras', disjunctive: true, sortFunction: algolia.sortByCountDesc, topListIfRefined: false }
    ];
  }
   else if (urlPathName === '/experts') {
    algolia.init();
    algolia.config.APPLICATION_ID = '7FI9T0IXZ5';
    algolia.config.SEARCH_ONLY_API_KEY = 'b998ea87dc6edcbdf733d2796f8eccf7';
    algolia.config.INDEX_NAME = 'vol-experts2016-07-22T20:25:13.342Z';
    algolia.config.HITS_PER_PAGE = 10;
    algolia.config.MAX_VALUES_PER_FACET = 30;
    algolia.config.FACET_CONFIG = [
      { name: 'fragments.expert.expertServices.value.catgory.value', title: 'Services', disjunctive: true, sortFunction: algolia.sortByName, topListIfRefined: false },
      { name: 'fragments.expert.expertCountriesServed.value.country.value', title: 'Region', disjunctive: true, sortFunction: algolia.sortByName, topListIfRefined: false },
      { name: 'fragments.expert.expertLevel.value', title: 'Level', disjunctive: true, sortFunction: algolia.sortByCountDesc, topListIfRefined: false }
    ];
  }


  /////////////////////////////////////////////////

  function stripTrailingSlash(str) {
      if(str.substr(-1) === '/') {
          return str.substr(0, str.length - 1);
      }
      return str;
  }
