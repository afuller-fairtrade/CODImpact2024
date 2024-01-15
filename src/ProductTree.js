import alasql from "alasql";

let ProductTree = {
  loadProductCategories: function (question) {
    // When AlaSQL is reading an external file it runs asynchronous
    // This query returns an array of value/text pairs
    alasql
      .promise(
        "SELECT DISTINCT [product_category] AS [value], [product_category] AS [text] FROM csv('./product_tree') ORDER BY [product_category]",
      )
      .then(function (results) {
        question.choices = results;
      })
      .catch(console.error);
  },

  filterProductTypes: function (question, ProductCategory) {
    alasql
      .promise(
        "SELECT DISTINCT [product_code] AS [value], [product_type] AS [text] FROM csv('./product_tree') WHERE [product_category] = ? ORDER BY [product_type]",
        [ProductCategory],
      )
      .then(function (results) {
        question.choices = results;
      })
      .catch(console.error);
  },
};

export default ProductTree;
