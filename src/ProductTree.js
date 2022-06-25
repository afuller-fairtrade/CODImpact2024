import alasql from "alasql";

let ProductTree = {
  loadMajorCategories: function (question) {
    // When AlaSQL is reading an external file it runs asynchronous
    // This query returns an array of value/text pairs
    alasql
      .promise(
        "SELECT DISTINCT [major category] AS [value], [major category] AS [text] FROM csv('./products') ORDER BY [major category]"
      )
      .then(function (results) {
        question.choices = results;
      })
      .catch(console.error);
  },

  filterMinorCategories: function (question, majorCategory) {
    alasql
      .promise(
        "SELECT DISTINCT [minor category] AS [value], [minor category] AS [text] FROM csv('./products') WHERE [major category] = ? ORDER BY [minor category]",
        [majorCategory]
      )
      .then(function (results) {
        question.choices = results;
      })
      .catch(console.error);
  },

  filterProductionTypes: function (question, minorCategory) {
    alasql
      .promise(
        "SELECT DISTINCT [product_code] AS [value], [production type] AS [text] FROM csv('./products') WHERE [minor category] = ? ORDER BY [production type]",
        [minorCategory]
      )
      .then(function (results) {
        question.choices = results;
      })
      .catch(console.error);
  }
};

export default ProductTree;
