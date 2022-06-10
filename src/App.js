import { useCallback } from "react";

import "survey-core/defaultV2.min.css";
// import 'survey-core/survey.min.css';
import { StylesManager, Model } from "survey-core";
import { Survey } from "survey-react-ui";

StylesManager.applyTheme("defaultV2");

const surveyJson = {
  version: 1,
  logoPosition: "right",
  focusOnFirstError: false,
  progressBarType: "buttons",
  showProgressBar: "top",
  pages: [
    {
      name: "Start page",
      navigationTitle: "Start page",
      navigationDescription: "Producer Profile",
      elements: [
        {
          type: "panel",
          name: "panel1",
          elements: [
            {
              type: "text",
              name: "org_name",
              title: "Name of the organization:"
            },
            {
              type: "radiogroup",
              name: "producer_setup",
              title: "Choose your producer setup:",
              isRequired: true,
              choices: [
                {
                  value: "spo",
                  text:
                    "Small-scale producer organization or Contract production"
                },
                {
                  value: "hlo",
                  text: "Hired labor plantation"
                }
              ]
            },
            {
              type: "radiogroup",
              name: "organic_logic",
              title:
                "Were some or all of your products under Fairtrade certification also produced under an organic certification in the last calendar/ production year?",
              isRequired: true,
              choices: [
                {
                  value: "mixed",
                  text:
                    "Some products (both organic and conventional production)"
                },
                {
                  value: "conventional_only",
                  text: "None of the products (only conventional production)"
                },
                {
                  value: "organic_only",
                  text: "All products (only organic production)"
                }
              ]
            }
          ]
        }
      ],
      description: "Start Page: Producer Profile"
    },
    {
      name: "Land area",
      navigationTitle: "Land area",
      navigationDescription: "Under cultivation",
      elements: [
        {
          type: "matrixdynamic",
          name: "land_product_tree",
          title:
            "Please indicate the products that your organization produced according to the Fairtrade standards in the last calendar/ production year. Use the left-hand column to filter for the product(s).",
          columns: [
            {
              name: "product_category_major",
              title: "Major product category",
              cellType: "dropdown",
              choices: [
                {
                  value: 1,
                  text: "Coffee"
                },
                {
                  value: 2,
                  text: "Cocoa"
                },
                {
                  value: 3,
                  text: "Bananas"
                }
              ],
              storeOthersAsComment: true
            },
            {
              name: "product_category_minor",
              title: "Minor product category",
              cellType: "dropdown",
              choices: [
                {
                  value: 1,
                  text: "Coffee arabica"
                },
                {
                  value: 2,
                  text: "Coffee robusta"
                },
                {
                  value: 3,
                  text: "Cocoa"
                },
                {
                  value: 4,
                  text: "Bananas"
                }
              ],
              storeOthersAsComment: true
            }
          ]
        },
        {
          type: "radiogroup",
          name: "land_area_unit",
          title:
            "What is the unit in which you would like to report your land area?",
          isRequired: true,
          choices: [
            {
              value: "ha",
              text: "hectares"
            },
            {
              value: "acre",
              text: "acres"
            }
          ]
        },
        {
          type: "panel",
          name: "land_area_panel",
          elements: [
            {
              type: "text",
              name: "total_land_managed",
              title:
                "What is the total land area in {land_area_unit} under cultivation by all SPO members (land under cultivation of both Fairtrade and non-Fairtrade certified crops)? ",
              visibleIf: "{producer_setup} = 'spo'",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a number",
                  minValue: 0
                }
              ]
            },
            {
              type: "text",
              name: "total_area_ft_certification",
              startWithNewLine: false,
              title:
                "What is the total land area in {land_area_unit} under cultivation with Fairtrade crops within your organization?",
              validators: [
                {
                  type: "expression",
                  text:
                    "Fairtrade land area is larger than total land area. Please fix.",
                  expression:
                    "{total_land_managed} >= {total_area_ft_certification}"
                },
                {
                  type: "numeric",
                  text: "Please enter a number",
                  minValue: 0
                }
              ],
              inputType: "number"
            }
          ]
        },
        {
          type: "matrixdropdown",
          name: "land_area_production_matrix",
          title:
            "Record the land area in {land_area_unit} under cultivation of Fairtrade crops for each Fairtrade-certified product. If the area is not known, indicate so with the checkboxes. Note, if your organization produces honey, please report the number of beehives instead of land area.",
          columns: [
            {
              name: "land_area_known",
              title:
                "Do you know the land area under cultivation of each product?",
              cellType: "boolean",
              minWidth: "180px",
              defaultValue: "false",
              labelTrue: "No",
              labelFalse: "Yes",
              showTitle: true
            },
            {
              name: "land_total_production",
              title: "Total land area in {land_area_unit} by product",
              cellType: "text",
              minWidth: "150px",
              visibleIf: "{row.land_area_known}=false",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a number",
                  minValue: 0
                }
              ]
            },
            {
              name: "land_area_known_attribute",
              title:
                "Do you know the conventional and/or organic land area under cultivation of each product?",
              cellType: "boolean",
              minWidth: "200px",
              defaultValue: "false",
              labelTrue: "No",
              labelFalse: "Yes",
              showTitle: true
            },
            {
              name: "land_conventional_production",
              title:
                "Land area in {land_area_unit} under conventional cultivation",
              cellType: "text",
              minWidth: "150px",
              visibleIf:
                "{row.land_area_known_attribute}=false" &&
                "{organic_logic} <> 'organic_only'",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a number",
                  minValue: 0
                }
              ]
            },
            {
              name: "land_organic_production",
              title: "Land area in {land_area_unit} under organic cultivation",
              cellType: "text",
              minWidth: "150px",
              visibleIf:
                "{row.land_area_known_attribute}=false" &&
                "{organic_logic} <> 'conventional_only'",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a number",
                  minValue: 0
                }
              ]
            }
          ],
          horizontalScroll: true,
          rows: [
            {
              value: "Row 1",
              text: "[Product 1]"
            },
            {
              value: "Row 2",
              text: "[Product 2]"
            }
          ],
          rowTitleWidth: "150px"
        }
      ],
      description: "Land Area Under Cultivation"
    },
    {
      name: "Production",
      navigationTitle: "Production",
      navigationDescription: "Volumes produced & forecasts",
      elements: [
        {
          type: "panel",
          name: "unit_descriptions_panel",
          elements: [
            {
              type: "expression",
              name: "unit_descriptions",
              title:
                "A note on units: please make sure the unit you select is correct and applicable to the product you are reporting on. Please see here a description of uses for each unit:",
              hideNumber: true
            },
            {
              type: "panel",
              name: "panel4",
              elements: [
                {
                  type: "expression",
                  name: "kg_description",
                  title: "Kilograms (kg)",
                  description:
                    "Use kg when you know the volume of your product in kilograms",
                  hideNumber: true
                },
                {
                  type: "expression",
                  name: "mt_description",
                  startWithNewLine: false,
                  title: "Metric tons (MT)",
                  description:
                    "Use MT when you know the volume of your product in metric tons",
                  hideNumber: true
                },
                {
                  type: "expression",
                  name: "boxes_large_description",
                  title: "18.14 kg Boxes",
                  description:
                    "For bananas only: use 18.14 kg Boxes when you know the number of boxes of bananas",
                  hideNumber: true
                },
                {
                  type: "expression",
                  name: "boxes_small_description",
                  startWithNewLine: false,
                  title: "13.5 kg Boxes",
                  description:
                    "For bananas only: use 13.5 kg Boxes when you know the number of boxes of bananas",
                  hideNumber: true
                },
                {
                  type: "expression",
                  name: "pounds_description",
                  title: "Pound",
                  description:
                    "Use pound when you know the volume of your product in pounds",
                  hideNumber: true
                },
                {
                  type: "expression",
                  name: "question6",
                  startWithNewLine: false,
                  title: "Quintales (46 kg)",
                  description:
                    "Use quintales when you know the volume of your product in quintales (1 quintale = 46 kg)",
                  hideNumber: true
                },
                {
                  type: "expression",
                  name: "flowers_description",
                  title: "Stems of flowers",
                  description:
                    "For flowers and plants only: use when you know the number of flowers or plants",
                  hideNumber: true
                },
                {
                  type: "expression",
                  name: "1000stems_description",
                  startWithNewLine: false,
                  title: "1000 stems of flowers",
                  description:
                    "For flowers and plants only: use when you know the number of 1,000 flower or plant bunches",
                  hideNumber: true
                },
                {
                  type: "expression",
                  name: "litres_description",
                  title: "Litres",
                  description:
                    "For argan oil and wine bottles only: use litres when you know the volume of your oil or wine in litres",
                  hideNumber: true
                },
                {
                  type: "expression",
                  name: "items_description",
                  startWithNewLine: false,
                  title: "Items",
                  description:
                    "For coconuts and sportsballs only: use items when you know the number of coconuts or sportsballs produced",
                  hideNumber: true
                }
              ]
            }
          ]
        },
        {
          type: "matrixdropdown",
          name: "volumes_produced_matrix",
          title:
            "Record the conventional and organic volumes produced under Fairtrade certification in the last calendar/production year for each product. If production volume is estimated, please specify how you came to this estimate.",
          columns: [
            {
              name: "product_form_name",
              title: "What product form are you reporting your production in?",
              cellType: "dropdown",
              minWidth: "300px",
              choices: [
                {
                  value: 1,
                  text: "Arabica washed parchment"
                },
                {
                  value: 2,
                  text: "Arabica cherry"
                },
                {
                  value: 3,
                  text: "Baby bananas"
                },
                {
                  value: 4,
                  text: "Cocoa beans raw"
                }
              ],
              storeOthersAsComment: true
            },
            {
              name: "volume_produced_unit",
              title: "What unit are you reporting your production in?",
              cellType: "dropdown",
              minWidth: "180px",
              choices: [
                {
                  value: "kg",
                  text: "kg"
                },
                {
                  value: "mt",
                  text: "MT"
                },
                {
                  value: "boxes_large",
                  text: "18.14 kg Boxes"
                },
                {
                  value: "boxes_small",
                  text: "13.5 kg Boxes"
                },
                {
                  value: "pound",
                  text: "Pound"
                },
                {
                  value: "quintales",
                  text: "Quintales (46 kg)"
                },
                {
                  value: "stems",
                  text: "Stems of flowers"
                },
                {
                  value: "1000stems",
                  text: "1000 stems of flowers"
                },
                {
                  value: "litres",
                  text: "Litres"
                },
                {
                  value: "items",
                  text: "Items"
                }
              ]
            },
            {
              name: "volume_conventional_produced",
              title: "Volume produced under conventional cultivation",
              cellType: "text",
              visibleIf: "{organic_logic} <> 'organic_only'",
              minWidth: "180px",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a number",
                  minValue: 0
                }
              ]
            },
            {
              name: "volume_organic_produced",
              title: "Volume produced under organic cultivation",
              cellType: "text",
              visibleIf: "{organic_logic} <> 'conventional_only'",
              minWidth: "180px",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a number",
                  minValue: 0
                }
              ]
            },
            {
              name: "volume_produced_estimated_or_measured",
              title: "Are the volumes reported actual or estimates?",
              cellType: "boolean",
              minWidth: "150px",
              defaultValue: "false",
              labelTrue: "Actual",
              labelFalse: "Estimates",
              showTitle: true
            },
            {
              name: "estimation_method",
              title: "Volumes were estimated based on:",
              cellType: "dropdown",
              minWidth: "200px",
              visibleIf: "{row.volume_produced_estimated_or_measured}=false",
              choices: [
                {
                  value: 1,
                  text: "Yields"
                },
                {
                  value: 2,
                  text: "Purchases from members",
                  visibleIf: "{producer_setup}='spo'"
                },
                {
                  value: 3,
                  text: "Fairtrade sales"
                },
                {
                  value: 4,
                  text: "Total sales"
                }
              ],
              storeOthersAsComment: true
            }
          ],
          rows: [
            {
              value: "Row 1",
              text: "[Minor category 1]"
            },
            {
              value: "Row 2",
              text: "[Minor category 2]"
            }
          ],
          rowTitleWidth: "200px"
        },
        {
          type: "matrixdropdown",
          name: "volumes_forecast_matrix",
          title:
            "How much of the total volume produced this year does your organization have on offer that is of export quality for Fairtrade sales? Record the conventional and organic volumes. If you have already started selling, record the volume your organization had on offer at the beginning of this calendar year.",
          columns: [
            {
              name: "product_form_name_forecast",
              title: "Production type",
              cellType: "dropdown",
              minWidth: "300px",
              choices: [
                {
                  value: 1,
                  text: "Arabica washed parchment"
                },
                {
                  value: 2,
                  text: "Arabica cherry"
                },
                {
                  value: 3,
                  text: "Baby bananas"
                },
                {
                  value: 4,
                  text: "Cocoa beans raw"
                }
              ],
              storeOthersAsComment: true
            },
            {
              name: "volume_forecast_unit",
              title: "Unit",
              cellType: "dropdown",
              minWidth: "180px",
              choicesFromQuestion: "volume_produced_unit",
              choices: [
                {
                  value: "kg",
                  text: "kg"
                },
                {
                  value: "mt",
                  text: "MT"
                },
                {
                  value: "boxes_large",
                  text: "18.14 kg Boxes"
                },
                {
                  value: "boxes_small",
                  text: "13.5 kg Boxes"
                },
                {
                  value: "pound",
                  text: "Pound"
                },
                {
                  value: "quintales",
                  text: "Quintales (46 kg)"
                },
                {
                  value: "stems",
                  text: "Stems of flowers"
                },
                {
                  value: "1000stems",
                  text: "1000 stems of flowers"
                },
                {
                  value: "litres",
                  text: "Litres"
                },
                {
                  value: "items",
                  text: "Items"
                }
              ]
            },
            {
              name: "volume_conventional_forecast",
              title: "Conventional volume on offer",
              cellType: "text",
              visibleIf: "{organic_logic} <> 'organic_only'",
              minWidth: "180px",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a number",
                  minValue: 0
                }
              ]
            },
            {
              name: "volume_organic_forecast",
              title: "Organic volume on offer",
              cellType: "text",
              visibleIf: "{organic_logic} <> 'conventional_only'",
              minWidth: "180px",
              validators: [
                {
                  type: "numeric",
                  text: "Please enter a number",
                  minValue: 0
                }
              ]
            }
          ],
          rows: [
            {
              value: "Row 1",
              text: "[Minor category 1]"
            },
            {
              value: "Row 2",
              text: "[Minor category 2]"
            }
          ],
          rowTitleWidth: "200px"
        }
      ],
      description: "Production"
    }
  ],
  checkErrorsMode: "onValueChanged"
};

function App() {
  const survey = new Model(surveyJson);
  survey.focusFirstQuestionAutomatic = false;

  const alertResults = useCallback((sender) => {
    const results = JSON.stringify(sender.data);
    alert(results);
  }, []);

  survey.onComplete.add(alertResults);

  return <Survey model={survey} />;
}

export default App;
